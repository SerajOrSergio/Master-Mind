import os from 'os';
/* ============================================================
   LAN IP selection for MasterMind
   ------------------------------------------------------------
   A PC can hold several IPv4 addresses at once: Wi-Fi, Ethernet,
   phone hotspots and VPN tunnels (NordLynx, OpenVPN, ...). Only
   the interface a phone can actually reach matters, so instead of
   taking "the first non-internal address" we pick deliberately:

     1. Ignore VPN / virtual adapters by name (NordLynx, OpenVPN,
        Wintun, ...) — their 10.x / 172.x addresses are only valid
        on the tunnel and can never be reached from LAN devices.
     2. Ignore link-local (169.254.x) addresses.
     3. Prefer real router subnets: 192.168.* first, then
        172.16-31.* (iPhone/Android hotspots use 172.20.10.x),
        then 10.*.
     4. When we know who is asking (the mDNS / DNS responder sees
        the requesting device's IP), prefer the interface on the
        SAME subnet as the asker — e.g. a phone on a hotspot asks
        from 172.20.10.x, so we answer with the PC's 172.20.10.x
        address instead of a VPN 10.x one.
   ============================================================ */

// Interface names that are tunnels / virtual adapters, never the LAN.
const VPN_IFACE_RE = /nord|lynx|openvpn|tun|tap|wintun|utun|wg|vpn|ppp/i;
// APIPA / link-local addresses Windows assigns when no DHCP is available.
const APIPA_RE = /^169\.254\./;

function isVpnLikeIface(name) {
  return VPN_IFACE_RE.test(String(name || ''));
}

// Lower is better. Phone hotspots (172.20.10.x) match the 172.16-31 band.
function ifacePreference(address) {
  if (/^192\.168\./.test(address)) return 0;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(address)) return 1;
  if (/^10\./.test(address)) return 2;
  return 3;
}

function collectLanCandidates() {
  const candidates = [];
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    if (isVpnLikeIface(name)) continue;
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal && !APIPA_RE.test(iface.address)) {
        candidates.push({ name, address: iface.address });
      }
    }
  }
  return candidates;
}

function pickBestAddress(candidates) {
  if (!candidates.length) return null;
  return candidates
    .slice()
    .sort((a, b) => ifacePreference(a.address) - ifacePreference(b.address))[0].address;
}

// The general LAN IP, shown in the startup log and used as a fallback.
function getLocalExternalIP() {
  return pickBestAddress(collectLanCandidates()) || 'localhost';
}

// The best IP to answer a specific device with. Devices on the same /16 as
// one of our interfaces get that interface's address — so a phone on the
// hotspot gets the hotspot IP even while a VPN tunnel is up.
function getLocalIPFor(remoteIp) {
  const candidates = collectLanCandidates();
  if (remoteIp && /^(\d{1,3}\.){3}\d{1,3}$/.test(remoteIp)) {
    const remote = remoteIp.split('.');
    const onSameSubnet = candidates.filter((c) => {
      const parts = c.address.split('.');
      return parts[0] === remote[0] && parts[1] === remote[1];
    });
    if (onSameSubnet.length) return pickBestAddress(onSameSubnet);
  }
  return getLocalExternalIP();
}

export { getLocalExternalIP, getLocalIPFor, collectLanCandidates };
