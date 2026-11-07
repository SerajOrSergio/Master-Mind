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
  
    <title>Admin Topics</title>
  
    <!-- Bootstrap -->
    <link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
  
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
  
    <!-- Header CSS -->
    <link rel="stylesheet" href="/src/components/admin/header/header.css">
  
    <!-- Choices.js -->
    <link href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" rel="stylesheet" media="print" onload="this.media='all'">
  
    <!-- Sidebar CSS -->
    <link rel="stylesheet" href="/src/components/admin/sidebar-menu/sidebar.css">
  
    <!-- Page CSS -->
    <link rel="stylesheet" href="topics.css">
  </head>
  
  <body>
  
    <!-- Sidebar -->
    <div id="sidebar-container"></div>
  
    <!-- Admin Header (shared for mobile/desktop) -->
    <div id="admin-header-container"></div>
  
    <!-- Main Content -->
    <main class="container main-content-container mt-4" id="main-content">
  
      <h1>Topics</h1>
  
      <div id="topics-form-section" class="mb-4"></div>
  
      <div id="topics-list-section"></div>
  
    </main>
  
    <!-- Bootstrap -->
    <script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
  
    <!-- Choices.js -->
    <script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
  
    <!-- Sidebar Loader -->
    <script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
  
    <!-- Dark Mode Loader -->
    <script src="/src/components/admin/2.0-design/2.0design.js"></script>
  
    <!-- Responsive margin adjustment -->
    <script src="/assist/main-content.js" defer></script>
  
    <!-- Header and Undo -->
    <script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
  
    <!-- Topics JS -->
    <script type="module" src="topics.js"></script>
  
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
