# Local Domain Setup for MasterMindHTML_CSS_JS

This project runs on `http://mastermind.ly/` and works on **every device on the same Wi-Fi** with one
time setup. The server now includes a small local DNS responder that makes `mastermind.ly` behave
exactly like your PC's LAN IPv4 link.

## How it works

`mastermind.ly` is not a real network name, so phones and other devices normally can't find your PC
by that name. The server fixes that with a built-in **DNS responder** (port 53):

- `mastermind.ly` and `mastermind.local` → answered with your PC's LAN IPv4
  (e.g. `192.168.10.223`) — the same address as the IPv4 link that already works on other devices.
- Every other domain (google.com, etc.) → **forwarded** to your normal DNS servers, so pointing a
  device's DNS at this PC does not break the internet.

## One-time setup (recommended)

1. Run the server as Administrator so the DNS responder can open port 53:
   `start-server-admin.bat`
   (Ports below 1024 need admin rights on Windows.)

2. Point your network's DNS at this PC. Pick the option that matches your hardware:

   - **Router (best — covers every device at once):** in your router's admin page, set the DNS
     server to your PC's LAN IP (shown in the server log, e.g. `192.168.10.223`). Every phone,
     tablet and PC on the Wi-Fi will then resolve `mastermind.ly` automatically.
   - **Per device:** Wi-Fi settings → DNS → set it to your PC's LAN IP.
     - iOS: Wi-Fi > (i) > Configure DNS > Manual > add `<PC LAN IP>`
     - Android: Wi-Fi > Modify network > Advanced > IP settings > Static > DNS 1 = `<PC LAN IP>`

3. Open `http://mastermind.ly/` on any device. It resolves to the PC and serves the site — same as
   typing the IPv4 link.

## Use ONE home-screen icon on every Wi-Fi (iPhone/iPad)

If you "Add to Home Screen" from an IPv4 link (e.g. `http://192.168.10.223/`), iOS saves that
literal IP inside the icon. When the PC joins a different Wi-Fi it gets a new IP, so the saved one
stops working — that's why the icon breaks when you switch networks.

**Fix it once, permanently:**

1. In Safari on the iPhone, open `http://mastermind.local/` (not the IPv4 link).
2. Tap **Share → Add to Home Screen**.
3. Done. The icon saves the *name* `mastermind.local`, not an IP. Every time it opens, the phone
   re-asks mDNS, which answers with the PC's **current** IP on that network — so the same icon
   works on every Wi-Fi the PC joins, with zero per-network setup. Never add the icon from an IPv4
   link again; if an old icon points at an IP, delete it and re-add from the name.

**Why re-adding the *current* broken icon is unavoidable:** iOS stores the exact URL inside each
home-screen icon. An icon added from an IP holds that literal IP, and when the PC moves to a new
network that address stops existing — the icon cannot even load, so no app or server code can
change what it points to. Deleting it and re-adding from `mastermind.local` is the only way to
repair that one icon. It never needs to be done again.

The site itself now helps prevent this from recurring:

- **Auto-redirect:** every page (`assist/use-hostname.js`, injected into all HTML pages) detects
  when it was opened via a raw IPv4 link and immediately bounces to `mastermind.local` — but only
  after confirming the name is reachable, so if mDNS is blocked the plain IP link still works as a
  fallback. Opening the site through an IP therefore lands on the name, and anything added to the
  Home Screen from there saves the name.
- **In-app tip:** the login page shows a dismissible banner on iPhones explaining to add the app
  from `mastermind.local` (with a one-tap button that opens it) instead of an IP link.

Requirements for this to work on any given network:

- The PC is running the server and is connected to the **same Wi-Fi** as the phone (mDNS is
  local-network only).
- Windows Firewall allows Node.js on **Private** networks — TCP port 80 (the site) and UDP 5353
  (mDNS multicast). If Windows prompted to allow Node when you first ran the server, tick
  "Private networks" and allow; if you declined it, allow it in Firewall settings.
- The router is not blocking multicast between Wi-Fi clients (see troubleshooting below).

## Install MasterMind as a desktop app (Windows / macOS)

When you open the site on a desktop browser, a popup asks if you want to **install**
MasterMind as an app — it opens in its own window with no browser toolbar, and it
works even faster on repeat visits.

Browsers only allow this on a **secure origin**, so the server also serves HTTPS
with a self-signed certificate:

1. On the desktop, open **`https://mastermind.local/`** in **Chrome or Edge**
   (Safari/Firefox have no install-prompt API — use Chrome or Edge).
2. The first visit shows a certificate warning — click **Advanced → Proceed**
   (one time per machine; the cert is generated on the server PC and covers
   `mastermind.local`, `mastermind.ly` and `localhost`).
3. The **Install MasterMind** popup appears. Click **Install** and the app opens
   in its own window, installed for that machine.

The popup shows once per browser session, on desktop-sized screens, and never
again once the app is installed. If you dismiss it with **Not now**, it will ask
again on your next boot/session.

- The server auto-generates the certificate on first run (needs `openssl`; the
  files live in `Server/certs/`, which is git-ignored). HTTPS listens on port
  `443` — override with the `HTTPS_PORT` env var.
- Plain `http` is untouched, so phones and the existing home-screen flow keep
  working exactly as before.

## Why mastermind.local auto-works but mastermind.ly needs one setting

- `.local` is a special name every operating system resolves with **mDNS** (a broadcast on the
  Wi-Fi), so a device can discover your PC by `mastermind.local` with zero configuration.
- `.ly` is a real internet TLD. Devices therefore send it to their **DNS server** (the router),
  never to mDNS — that is decided by the device's OS, before your server is even contacted, so no
  server code can change it.
- The server answers `mastermind.ly` on **both** mechanisms anyway (mDNS responder + the port-53
  DNS responder), so the moment a device asks either one, it gets your PC's LAN IP.
- The one-time router setting below is what tells every device to "ask the PC" — after that,
  `mastermind.ly` behaves exactly like `mastermind.local` did, on every device.

## Notes

- The server is already configured to listen on port `80`, so the URL is `http://mastermind.ly/`
  with no port. If port 80 is busy, start with `set PORT=8080` and use `http://mastermind.ly:8080/`.
- If you can't change the router or device DNS, the plain IPv4 link
  (`http://<PC LAN IP>/`) always works on the same network.
- `mastermind.local` is the zero-configuration name — use it for the iPhone home-screen icon so
  the same icon works on every Wi-Fi. `mastermind.ly` is the name to use after you've pointed the
  router/device DNS at this PC, but that DNS setting stores the PC's current IP and must be
  updated whenever the PC changes networks.
- If you copy the project to another PC, the server still needs to run there and the router/device
  DNS must point to that PC's new IP.

## Phone hotspot (SIM data / personal hotspot)

When the PC joins an iPhone/Android personal hotspot the network looks like `172.20.10.x`
(iPhone) or `192.168.x.x` (Android), and the PC often also has a VPN tunnel up
(NordLynx, OpenVPN, ...). The server now handles this automatically:

- `mastermind.local` works exactly like on any Wi-Fi — open it in Safari and add it to the
  Home Screen the same way. mDNS resolves it to the PC's hotspot IP, not a VPN address.
- The server ignores VPN/tunnel adapters when picking the IP to advertise, and answers each
  device with the IP on that device's own subnet, so a phone on the hotspot gets the hotspot
  IP even while a VPN is connected.

If it still won't load on the phone, the usual blocker is **Windows Firewall**: hotspot
connections are typically classified as **Public**, while the Node.js allow rule may only
cover Private networks. Allow Node.js on **both Private and Public** network profiles
(Windows Security → Firewall → Allow an app, or re-run the server and tick "Public networks"
when Windows asks). The server log prints this reminder when it detects a hotspot network.

## Troubleshooting

- **"DNS responder error: cannot bind port 53"** — the server needs Administrator rights. Use
  `start-server-admin.bat`.
- **"Port 53 is already in use"** — another program (e.g. a VPN or local DNS tool) is using port 53.
  Stop it, or that program may already handle local names.
- **Internet stops working on devices after setting DNS** — the responder forwards all other
  lookups, so this shouldn't happen. If it does, check that the server log shows
  "all other lookups forward to: ..." and that the PC itself has internet.
- **Home-screen icon loads on one Wi-Fi but not another** — the icon was added from an IPv4 link.
  Delete it and re-add it from `http://mastermind.local/` (see the section above). If the page is
  still reachable by its old IP, it now auto-redirects to `mastermind.local` — follow it, then
  re-add from the name in the address bar.
- **mastermind.local does not resolve on a network** — some routers enable client/AP isolation,
  which blocks the mDNS broadcast between Wi-Fi devices. The PC and phone must be allowed to see
  each other (disable isolation for the network, or put the PC on Ethernet). As a fallback, use the
  per-device DNS method above with `mastermind.ly` — but remember that DNS setting points at the
  PC's current IP and has to be updated when the PC moves to another network.
- **mastermind.local resolves but the site still won't load on a phone hotspot** — Windows
  Firewall classifies hotspot connections as "Public", so make sure Node.js is allowed on both
  Private and Public profiles (see the hotspot section above).
- **VPN active, phone can't reach the PC** — the server now ignores VPN adapters and answers
  with the LAN/hotspot IP instead of a tunnel IP like `10.5.0.2`, so nothing to configure. If
  the problem persists, check the server log shows the phone's network IP (e.g. `172.20.10.x`)
  and not a `10.x`/VPN address.
