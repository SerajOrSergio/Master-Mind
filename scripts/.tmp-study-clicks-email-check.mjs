import { spawn } from 'node:child_process';
import http from 'node:http';
import net from 'node:net';

const BASE = 'http://localhost:8084';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9445;

const sleep = ms => new Promise(r => setTimeout(r, ms));

function wsConnect(url) {
  return new Promise((resolve, reject) => {
    let dataBuf = '';
    const socket = net.createConnection(443, 'localhost', () => {
      const magic = Buffer.from([0x81, 0x00]);
      socket.write(magic);
    });
    socket.on('data', chunk => { dataBuf += chunk.toString('binary'); processWSBuf(); });
    socket.on('error', reject);
    socket.on('close', () => { if (!wsDone) reject(new Error('socket close')); });

    let wsDone = false;
    const pending = {};
    let msgId = 0;

    function processWSBuf() {
      while (dataBuf.length >= 2) {
        const b1 = dataBuf.charCodeAt(0);
        const opcode = b1 & 0x0f;
        const fin = (b1 & 0x80) !== 0;
        const masked = (b1 & 0x80) !== 0;
        let payloadLen = dataBuf.charCodeAt(1) & 0x7f;
        let hdrLen = 2;
        if (payloadLen === 126) { payloadLen = (dataBuf.charCodeAt(2) << 8) | dataBuf.charCodeAt(3); hdrLen = 4; }
        else if (payloadLen === 127) { payloadLen = 0; for (let i = 1; i <= 8; i++) payloadLen = (payloadLen << 8) | dataBuf.charCodeAt(1 + i); hdrLen = 10; }
        if (dataBuf.length < hdrLen + (masked ? 4 : 0) + payloadLen) break;
        const maskKey = masked ? [dataBuf.charCodeAt(hdrLen), dataBuf.charCodeAt(hdrLen+1), dataBuf.charCodeAt(hdrLen+2), dataBuf.charCodeAt(hdrLen+3)] : null;
        const payloadStart = hdrLen + (masked ? 4 : 0);
        const payload = dataBuf.slice(payloadStart, payloadStart + payloadLen);
        if (maskKey) { let dec = ''; for (let i=0;i<payloadLen;i++) dec += String.fromCharCode(payload.charCodeAt(i) ^ maskKey[i%4]); }
        dataBuf = dataBuf.slice(payloadStart + payloadLen);
        const msg = JSON.parse(payload);
        if (!wsDone && msg.id != null && pending[msg.id]) { const cb = pending[msg.id]; delete pending[msg.id]; cb(msg); }
        if (opcode === 8) { wsDone = true; socket.destroy(); }
      }
    }

    function sendFrame(payloadStr) {
      const buf = Buffer.from(payloadStr, 'utf8');
      const len = buf.length;
      let header;
      if (len < 126) header = Buffer.from([0x81, len]);
      else if (len <= 65535) { header = Buffer.alloc(4); header.writeUInt8(0x81,0); header.writeUInt8(126,1); header.writeUInt16BE(len,2); }
      else { header = Buffer.alloc(10); header.writeUInt8(0x81,0); header.writeUInt8(127,1); for (let i=0;i<8;i++) header.writeUInt8((len>>(56-8*i))&0xff,2+i); }
      socket.write(Buffer.concat([header, buf]));
    }

    function sendMsg(method, params) {
      return new Promise((resolve, reject) => {
        msgId++;
        const id = msgId;
        pending[id] = msg => { if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error))); else resolve(msg.result); };
        sendFrame(JSON.stringify({ id, method, params }));
      });
    }

    function evalJS(expr) { return sendMsg('Runtime.evaluate', { expression: expr, returnByValue: true }); }
    function navigate(url) { return sendMsg('Page.navigate', { url }); }

    const ws = { socket, sendMsg, evalJS, navigate, destroy: () => { wsDone = true; socket.destroy(); } };
    setTimeout(() => resolve(ws), 50);
  });
}

async function evalPage(url, expr) {
  const chrome = spawn(CHROME, [
    '--headless=new', `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}/mm-sc-${Date.now()}`,
    '--no-first-run', 'about:blank'
  ]);
  await sleep(2500);
  let targets;
  for (let i=0;i<30;i++){ try { const res = await new Promise(r2=>http.get(`http://localhost:${PORT}/json/list`,r2).on('error',()=>r2([]))); if(res&&res.length){targets=res;break;} } catch{} await sleep(300); }
  if (!targets) { chrome.kill(); throw new Error('chrome did not start'); }
  const page = targets.find(t => t.type === 'page');
  const ws = await wsConnect(page.webSocketDebuggerUrl);
  await ws.navigate(url);
  await sleep(900);
  const result = await ws.evalJS(expr);
  ws.destroy();
  chrome.kill();
  await sleep(400);
  return result;
}

const results = [];
const check = (name, ok, detail='') => { results.push({name,ok,detail}); console.log(`${ok?'PASS':'FAIL'} | ${name} | ${detail}`); };

async function main() {
  const portals = ['admin', 'receptionist'];
  for (const portal of portals) {
    const expr = `
      (async () => {
        const studentsRes = await fetch('/api/students');
        const students = await studentsRes.json();
        const s = students.find(st => st.studentEmail);
        if (!s) return { noEmailStudent: true };
        const searchInput = document.getElementById('studentQuickSearch');
        const nameInput = document.getElementById('studentName');
        searchInput.value = (s.studentName || '').split(' ')[0];
        searchInput.dispatchEvent(new Event('input'));
        await new Promise(r => setTimeout(r, 320));
        const firstPill = document.querySelector('#studentsQuickContainer .student-pill');
        if (!firstPill) return { noPill: true };
        firstPill.click();
        await new Promise(r => setTimeout(r, 420));
        const emailEl = document.getElementById('quickAddEmailPreview');
        const emailText = emailEl ? (emailEl.textContent || '').trim() : '';
        const nameText = nameInput.value;
        return { nameText, emailText, studentEmail: s.studentEmail };
      })();
    `;
    const result = await evalPage(`${BASE}/src/pages/${portal}/study-clicks/index.html`, expr);
    check(`${portal} – quick-add email preview`, result && !result.noEmailStudent && !result.noPill, JSON.stringify(result));
  }

  for (const portal of portals) {
    const expr = `
      (async () => {
        const studentsRes = await fetch('/api/students');
        const students = await studentsRes.json();
        const s = students.find(st => st.studentEmail);
        if (!s) return { noEmailStudent: true };
        const searchInput = document.getElementById('studentQuickSearch');
        const nameInput = document.getElementById('studentName');
        const paidInput = document.getElementById('paidAmount');
        searchInput.value = (s.studentName || '').split(' ')[0];
        searchInput.dispatchEvent(new Event('input'));
        await new Promise(r => setTimeout(r, 320));
        const firstPill = document.querySelector('#studentsQuickContainer .student-pill');
        if (!firstPill) return { noPill: true };
        firstPill.click();
        await new Promise(r => setTimeout(r, 360));
        paidInput.value = '5';
        const form = document.getElementById('studyClicksForm');
        const submitEv = new Event('submit', { cancelable: true, bubbles: true });
        form.dispatchEvent(submitEv);
        await new Promise(r => setTimeout(r, 1000));
        const rows = document.querySelectorAll('#studyClicksTableContainer tbody tr');
        const lastRow = rows[rows.length - 1];
        if (!lastRow) return { noRow: true };
        const cells = lastRow.querySelectorAll('td');
        const emailCell = cells[2];
        const emailText = emailCell ? (emailCell.textContent || '').trim() : '';
        return { emailText, studentEmail: s.studentEmail };
      })();
    `;
    const result = await evalPage(`${BASE}/src/pages/${portal}/study-clicks/index.html`, expr);
    check(`${portal} – email appears in table after save`, result && !result.noEmailStudent && !result.noPill && !result.noRow, JSON.stringify(result));
  }

  const failed = results.filter(r => !r.ok).length;
  console.log(failed === 0 ? 'ALL OK' : `${failed} FAILURES`);
}

main().catch(e => { console.error(e); process.exit(1); });
