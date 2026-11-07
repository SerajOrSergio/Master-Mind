

const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');
let pendingTeacherId = null;
let pendingTeacherUsername = '';

// ===== Persistent login session (remember me across app restarts) =====
// The last successful login is stored in localStorage so the app on mobile
// (or any device) doesn't require re-authentication every time it opens.
const SESSION_KEY = 'mastermind_session';

function saveSession(session) {
  try {
    session.loginAt = Date.now();
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (e) {
    /* ignore quota/security errors */
  }
}

function getSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function clearSession() {
  try { localStorage.removeItem(SESSION_KEY); } catch (e) { /* ignore */ }
}

// Redirect to the portal matching the stored session role. Returns true if a
// valid session was found and a redirect happened.
function redirectFromSession() {
  const session = getSession();
  if (!session || !session.role) return false;
  if (session.role === 'admin') {
    window.location.replace('/src/pages/admin/dashboard');
    return true;
  }
  if (session.role === 'teacher') {
    if (session.teacherId) {
      localStorage.setItem('teacherId', session.teacherId);
    }
    if (session.teacherName) {
      localStorage.setItem('teacherName', session.teacherName);
    }
    if (session.firstName && session.lastName) {
      localStorage.setItem('teacherFirstName', session.firstName);
      localStorage.setItem('teacherLastName', session.lastName);
    }
    window.location.replace('/src/pages/teacher/session-form/sessionform.html');
    return true;
  }
  if (session.role === 'receptionist') {
    window.location.replace('/src/pages/receptionist/payments/index.html');
    return true;
  }
  if (session.role === 'coordinator') {
    window.location.replace('/src/pages/coordinator/topics/index.html');
    return true;
  }
  return false;
}

// If a previous login is still saved, go straight to that portal.
// Also prefill the username as a convenience for the next sign-in.
(function () {
  const session = getSession();
  if (session && session.username) {
    const userInput = document.getElementById('username');
    if (userInput) userInput.value = session.username;
  }
  if (redirectFromSession()) return;
})();

loginForm.addEventListener('submit', async function(e) {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (!username || !password) {
    loginMessage.textContent = 'Please enter both username and password.';
    loginMessage.style.display = 'block';
    return;
  }

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    if (data.success) {
      loginMessage.style.display = 'none';
      if (data.role === 'admin') {
        saveSession({ role: 'admin', username });
        window.location.href = '/src/pages/admin/dashboard';
      } else if (data.role === 'teacher') {
        // Store teacherId for session form auto-fill
        if (data.teacherId) {
          localStorage.setItem('teacherId', data.teacherId);
        }
        // PATCH: Store teacher name for auto-fill
        if (data.firstName && data.lastName) {
          localStorage.setItem('teacherFirstName', data.firstName);
          localStorage.setItem('teacherLastName', data.lastName);
          localStorage.setItem('teacherName', data.firstName + ' ' + data.lastName);
        } else if (data.teacherName) {
          localStorage.setItem('teacherName', data.teacherName);
        }
        if (data.forcePasswordChange && data.teacherId) {
          // Show password change form (do not persist session until it is done)
          showPasswordChangeForm(data.teacherId, username);
        } else {
          saveSession({
            role: 'teacher',
            username,
            teacherId: data.teacherId,
            teacherName: localStorage.getItem('teacherName'),
            firstName: data.firstName,
            lastName: data.lastName
          });
          window.location.href = '/src/pages/teacher/session-form/sessionform.html';
        }
      } else if (data.role === 'receptionist') {
        saveSession({ role: 'receptionist', username, receptionistId: data.receptionistId });
        window.location.href = '/src/pages/receptionist/payments/index.html';
      } else if (data.role === 'coordinator') {
        saveSession({ role: 'coordinator', username, coordinatorId: data.coordinatorId });
        window.location.href = '/src/pages/coordinator/topics/index.html';
      } else {
        window.location.href = '/';
      }
    } else {
      loginMessage.textContent = data.message || 'Login failed.';
      loginMessage.style.display = 'block';
    }
  } catch (err) {
    loginMessage.textContent = 'Server error. Please try again.';
    loginMessage.style.display = 'block';
  }
});

function showPasswordChangeForm(teacherId, username) {
  // Hide login form
  loginForm.style.display = 'none';
  // Create password change form
  let form = document.createElement('form');
  form.id = 'changePasswordForm';
  form.innerHTML = `
    <div class="mb-3">
      <label for="newPassword" class="form-label">New Password</label>
      <input type="password" class="form-control" id="newPassword" required>
    </div>
    <div class="mb-3">
      <label for="confirmPassword" class="form-label">Confirm New Password</label>
      <input type="password" class="form-control" id="confirmPassword" required>
    </div>
    <button type="submit" class="btn btn-primary w-100">Change Password & Login</button>
    <div id="changePasswordMessage" class="mt-3 text-center text-danger" style="display:none;"></div>
  `;
  loginForm.parentNode.appendChild(form);
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const msg = document.getElementById('changePasswordMessage');
    if (!newPassword || !confirmPassword) {
      msg.textContent = 'Please fill in both fields.';
      msg.style.display = 'block';
      return;
    }
    if (newPassword !== confirmPassword) {
      msg.textContent = 'Passwords do not match.';
      msg.style.display = 'block';
      return;
    }
    if (newPassword.length < 3) {
      msg.textContent = 'Password must be at least 3 characters.';
      msg.style.display = 'block';
      return;
    }
    // Update password via API
    try {
      const res = await fetch(`/api/teachers/${teacherId}/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });
      const data = await res.json();
      if (data.success) {
        // Auto-login after password change
        saveSession({
          role: 'teacher',
          username,
          teacherId,
          teacherName: localStorage.getItem('teacherName')
        });
        window.location.href = '/src/pages/teacher/index.html';
      } else {
        msg.textContent = data.error || 'Failed to update password.';
        msg.style.display = 'block';
      }
    } catch (err) {
      msg.textContent = 'Server error. Please try again.';
      msg.style.display = 'block';
    }
  });
}
