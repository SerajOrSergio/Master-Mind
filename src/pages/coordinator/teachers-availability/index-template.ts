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
  	<title>Coordinator - Teachers Availability</title>
  	<link rel="stylesheet" href="/src/components/coordinator/header/header.css">
  	<link rel="stylesheet" href="/src/components/coordinator/sidebar-menu/sidebar.css">
  	<link rel="stylesheet" href="teachers-availability.css">
  	<link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
  </head>
  <body>
  	<!-- Header -->
  	<div id="coordinator-header-container"></div>
  	<div class="container-fluid">
  		<div class="row">
  			<!-- Sidebar (desktop column + mobile offcanvas) -->
  			<div class="col-md-2 p-0" id="sidebar-container"></div>
  			<!-- Main Content -->
  			<main class="col-md-10 ms-sm-auto px-4 py-4">
  				<h2 class="mb-4">Teachers Availability (Read Only)</h2>
  				<div class="table-responsive">
  					<table class="table table-bordered table-hover" id="availability-table">
  						<thead class="table-light">
  							<tr>
  								<th>ID</th>
  								<th>Teacher Name</th>
  								<th>Subjects</th>
  								<th>Grade From</th>
  								<th>Grade To</th>
  								<th>Weekly Schedule</th>
  								<th>Note</th>
  							</tr>
  						</thead>
  						<tbody></tbody>
  					</table>
  				</div>
  			</main>
  		</div>
  	</div>
  	<script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
  	<script src="/src/components/coordinator/sidebar-menu/sidebar-loader.js"></script>
  	<script type="module" src="/assist/page-boot.js" data-header="/src/components/coordinator/header/header.html" data-container="coordinator-header-container"></script>
  	<script src="teachers-availability.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
