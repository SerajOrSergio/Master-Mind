// Auto-generated from index.html — markup verbatim; the
// build (scripts/generate-pages.mjs) writes index.html from this.
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
  	<title>Admin Classes</title>
  	<link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
  	<link href="/src/components/admin/sidebar-menu/sidebar.css" rel="stylesheet">
  	<link href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" rel="stylesheet" media="print" onload="this.media='all'">
  	<!-- Import Bootstrap Icons for sidebar icons -->
  	<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
  	<!-- Import session-form CSS for classroom quick-select row styles -->
  	<link rel="stylesheet" href="/src/pages/admin/session-form/session-form.css" />
  	<link rel="stylesheet" href="/src/components/admin/header/header.css">
  	<link rel="stylesheet" href="/src/pages/admin/classes/classes.css">
  </head>
  <body>
  	<!-- Sidebar Container (used for both mobile and desktop) -->
  	<div id="sidebar-container"></div>
  
  	<!-- Header Container -->
  	<div id="admin-header-container"></div>
  
  	<main class="container-fluid px-2 px-md-4" style="margin-left:0;">
  		<div class="row pt-3 pt-md-4 justify-content-start align-items-start">
  			<!-- Calendar box removed as requested -->
  			<div class="col-12 col-md-8 col-lg-8 mx-auto">
  				<div class="card shadow-sm mb-3">
  					<div class="card-body">
  						<div class="mb-2 fw-bold fs-5"><i class="bi bi-people-fill me-2"></i>New Reservation</div>
  						<form id="reserve-form" autocomplete="off">
  							<div class="mb-3">
  								<label for="teacherName" class="form-label">Teacher Name</label>
  								<select class="form-select" id="teacherName" required>
  									<option value="">Select...</option>
  								</select>
  							</div>
  							<!-- Date input removed as requested -->
  							<div class="choice-row mb-3">
  								<span class="choice-label">Classroom:</span>
  								<div class="classroom-tabs" id="classroomContainer"></div>
  							</div>
  							<div class="mb-3">
  								<label class="form-label">Class Type</label>
  								<div>
  									<input type="radio" class="btn-check" name="classType" id="privateType" value="Private" required>
  									<label class="btn btn-outline-primary me-2" for="privateType">Private</label>
  									<input type="radio" class="btn-check" name="classType" id="groupType" value="Group" required>
  									<label class="btn btn-outline-primary" for="groupType">Group</label>
  								</div>
  							</div>
  							<div class="mb-3">
  								<label class="form-label">Time Window:</label>
  								<div id="timeSlotsContainer" class="choice-wrap" style="overflow-x:auto;"></div>
  								<input type="hidden" id="timeWindow" name="timeWindow" required>
  							</div>
  							<button type="submit" class="btn btn-primary w-100">Reserve</button>
  							<div id="reserve-status" class="mt-3"></div>
  						</form>
  					</div>
  				</div>
  
  				<!-- Saved Reservations -->
  				<div class="card shadow-sm mb-3">
  					<div class="card-body">
  						<div class="mb-2 fw-bold fs-5"><i class="bi bi-calendar-check me-2"></i>Saved Reservations</div>
  						<div id="reservationsList"></div>
  					</div>
  				</div>
  			</div>
  		</div>
  	</main>
  	<script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
  	<script src="/src/components/admin/sidebar-menu/sidebar-loader.js"></script>
  	<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
  	<script type="module" src="/assist/page-boot.js" data-header="/src/components/admin/header/header.html" data-container="admin-header-container" data-undo-module="/assist/undo-manager.js"></script>
  	<script type="module" src="/src/pages/admin/classes/classes.js"></script>
  	<script type="module" src="/src/pages/admin/classes/classes-responsive.js"></script>
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
