// Auto-generated from login.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes login.css from this.
export const css = `
  /* ============================================================
     LOGIN — 2.0 creamy professional design
     Warm cream canvas, white rounded card, Fraunces branding and
     the purple accent used across the admin portals.
     ============================================================ */
  
  body {
    margin: 0;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    /* soft cream canvas with two faint purple glows for depth */
    background:
      radial-gradient(1100px 520px at 88% -12%, rgba(108, 77, 246, 0.12), transparent 62%),
      radial-gradient(950px 520px at -12% 112%, rgba(196, 71, 255, 0.10), transparent 62%),
      linear-gradient(160deg, #F8F4EB 0%, #F1EADB 55%, #EAE0CB 100%);
    background-attachment: fixed;
  }
  
  .login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
  }
  
  body .login-card {
    width: 100%;
    max-width: 420px;
    background: rgba(255, 255, 255, 0.94);
    border: 1px solid #E8E0D3;
    border-radius: 22px;
    box-shadow: 0 24px 60px rgba(28, 24, 20, 0.12), 0 4px 14px rgba(28, 24, 20, 0.05);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }
  
  /* ---- branding ---- */
  .login-logo {
    width: 76px;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 20px;
    background: #FFFFFF;
    border: 1px solid #E8E0D3;
    box-shadow: 0 10px 24px rgba(108, 77, 246, 0.16);
  }
  .login-logo img {
    width: 56px;
    height: 56px;
    border-radius: 14px;
    object-fit: cover;
  }
  
  .login-eyebrow {
    font-size: 10.5px;
    font-weight: 700;
    letter-spacing: 0.28em;
    color: #6C4DF6;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }
  
  .login-title {
    font-family: 'Fraunces', Georgia, 'Times New Roman', serif;
    font-size: 1.65rem;
    font-weight: 700;
    letter-spacing: -0.3px;
    color: #1C1814;
    line-height: 1.2;
    margin: 0;
  }
  
  .login-subtitle {
    color: #96907F;
    font-size: 0.95rem;
    margin: 0.4rem 0 0;
  }
  
  /* ---- form fields (Project1 style) ---- */
  .login-card .form-label {
    font-weight: 600;
    font-size: 0.85rem;
    color: #1C1814;
    margin-bottom: 0.35rem;
  }
  
  .login-card .form-control {
    background: #FFFFFF;
    border: 1.5px solid #D8CDBB;
    border-radius: 10px;
    padding: 0.65rem 0.9rem;
    font-size: 0.95rem;
    color: #1C1814;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
  }
  
  .login-card .form-control::placeholder {
    color: #B8AE9C;
  }
  
  .login-card .form-control:focus {
    border-color: #6C4DF6;
    box-shadow: 0 0 0 3px rgba(108, 77, 246, 0.14);
  }
  
  .password-wrap {
    position: relative;
  }
  
  .password-wrap .form-control {
    padding-right: 2.75rem;
  }
  
  .password-toggle {
    position: absolute;
    top: 50%;
    right: 0.6rem;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #96907F;
    font-size: 1.05rem;
    line-height: 1;
    padding: 0.35rem;
    cursor: pointer;
    transition: color 0.15s ease;
  }
  
  .password-toggle:hover {
    color: #6C4DF6;
  }
  
  /* ---- login button ---- */
  body .login-btn {
    background: linear-gradient(135deg, #6C4DF6 0%, #C447FF 100%);
    background-color: #6C4DF6;
    border: 0;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    font-weight: 650;
    font-size: 1rem;
    letter-spacing: 0.01em;
    color: #FFFFFF;
    box-shadow: 0 14px 30px rgba(108, 77, 246, 0.32);
    transition: transform 0.15s ease, box-shadow 0.15s ease, filter 0.15s ease;
  }
  
  body .login-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 18px 36px rgba(108, 77, 246, 0.4);
    filter: brightness(1.03);
  }
  
  body .login-btn:active {
    transform: translateY(0);
  }
  
  /* ---- iOS home-screen tip banner ---- */
  .hs-tip {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1050;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.7rem 1rem;
    padding-top: calc(0.7rem + env(safe-area-inset-top));
    background: rgba(255, 255, 255, 0.97);
    border-bottom: 1px solid #E8E0D3;
    box-shadow: 0 8px 24px rgba(28, 24, 20, 0.10);
    font-size: 0.82rem;
    line-height: 1.35;
    color: #1C1814;
  }
  .hs-tip[hidden] {
    display: none;
  }
  .hs-tip-body {
    flex: 1;
    min-width: 0;
  }
  .hs-tip-body strong {
    display: block;
    font-size: 0.85rem;
    font-weight: 700;
    color: #6C4DF6;
    margin-bottom: 1px;
  }
  .hs-tip-action {
    flex-shrink: 0;
    border: 0;
    border-radius: 999px;
    background: linear-gradient(135deg, #6C4DF6 0%, #C447FF 100%);
    color: #FFFFFF;
    font-size: 0.78rem;
    font-weight: 650;
    padding: 0.45rem 0.85rem;
    cursor: pointer;
    white-space: nowrap;
  }
  .hs-tip-close {
    flex-shrink: 0;
    border: 0;
    background: none;
    color: #96907F;
    font-size: 1.15rem;
    line-height: 1;
    padding: 0.2rem 0.3rem;
    cursor: pointer;
  }
  .hs-tip-close:hover {
    color: #1C1814;
  }
  
  /* ---- messages ---- */
  #loginMessage,
  #changePasswordMessage {
    font-size: 0.9rem;
    font-weight: 600;
    padding: 0.55rem 0.8rem;
    border-radius: 10px;
    background: rgba(226, 62, 62, 0.08);
    border: 1px solid rgba(226, 62, 62, 0.25);
    color: #C22A2A;
  }
  
  /* ---- responsive ---- */
  @media (max-width: 480px) {
    body .login-card {
      border-radius: 18px;
      box-shadow: 0 16px 40px rgba(28, 24, 20, 0.12);
    }
    .login-title {
      font-size: 1.4rem;
    }
  }
`;
export const cssFile = 'login.css';
