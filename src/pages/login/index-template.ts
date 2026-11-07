// Auto-generated from index.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes index.html from this.
// Styles for this page live in the sibling *-styles.ts modules.
export const htmlFile = 'index.html';
export const pageHtml = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="MasterMind">
    <meta name="theme-color" content="#6C4DF6">
    <link rel="manifest" href="/assist/manifest.json">
    <link rel="apple-touch-icon" href="/src/assets/Mastermind_logo.jpeg">
  
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <title>School Management System - Login</title>
    <link href="https://fonts.googleapis.com" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400..700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" media="print" onload="this.media='all'">
    <link rel="stylesheet" href="login.css">
    <!-- Use local Bootstrap CSS for future-proofing and offline support -->
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
    <div id="hsTip" class="hs-tip" role="note" hidden>
      <div class="hs-tip-body">
        <strong id="hsTipTitle"></strong>
        <span id="hsTipText"></span>
      </div>
      <button type="button" class="hs-tip-action" id="hsTipAction"></button>
      <button type="button" class="hs-tip-close" id="hsTipClose" aria-label="Dismiss">&times;</button>
    </div>
    <div class="login-page">
      <div class="login-card card shadow p-4 p-md-5">
        <div class="text-center mb-4">
          <div class="login-logo mx-auto mb-3">
            <img src="/src/assets/Mastermind_logo.jpeg" alt="Mastermind Logo">
          </div>
          <div class="login-eyebrow">MASTERMIND ACADEMY</div>
          <h2 class="login-title">School Management System</h2>
          <p class="login-subtitle">Sign in to your portal</p>
        </div>
        <form id="loginForm">
          <div class="mb-3">
            <label for="username" class="form-label">Username</label>
            <input type="text" class="form-control" id="username" placeholder="Enter your username" autocomplete="username" required>
          </div>
          <div class="mb-4">
            <label for="password" class="form-label">Password</label>
            <div class="password-wrap">
              <input type="password" class="form-control" id="password" placeholder="Enter your password" autocomplete="current-password" required>
              <button type="button" class="password-toggle" id="passwordToggle" aria-label="Show password">
                <i class="bi bi-eye"></i>
              </button>
            </div>
          </div>
          <button type="submit" class="btn btn-primary w-100 login-btn">Login</button>
        </form>
        <div id="loginMessage" class="mt-3 text-center" style="display:none;"></div>
      </div>
    </div>
    <!-- Bootstrap Icons (password visibility toggle) -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
    <!-- Bootstrap JS Bundle (with Popper) for full component support -->
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
    <script src="login.js"></script>
    <script src="login-features.js" defer></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
