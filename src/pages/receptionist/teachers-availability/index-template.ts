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
  	<title>Teacher Availability | Receptionist</title>
  	<link href="/bootstrap-5.0.2/dist/css/bootstrap.min.css" rel="stylesheet">
  	<link href="/src/components/receptionist/sidebar-menu/sidebar.css" rel="stylesheet">
  	<link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css" rel="stylesheet" media="print" onload="this.media='all'">
  	<link rel="stylesheet" href="/src/pages/receptionist/teachers-availability/teachers-availability.css">
  	<link href="https://cdn.jsdelivr.net/npm/choices.js/public/assets/styles/choices.min.css" rel="stylesheet" media="print" onload="this.media='all'">
  	<link rel="stylesheet" href="/src/components/receptionist/header/header.css">
  </head>
  <body>
  	<div id="sidebar-container"></div>
  	<!-- Receptionist Header (shared for mobile/desktop, includes the undo button) -->
  	<div id="receptionist-header-container"></div>
  	<div class="container mt-5" id="main-content" style="margin-left:260px; max-width:calc(100% - 260px);">
  		<h2>Teacher Availability</h2>
  		<form id="availabilityForm" class="mb-4">
  			<div class="row g-2 mb-2">
  				<div class="col-12 col-sm-6 col-md-3 mb-2 mb-md-0">
  					<select id="teacherSelect" class="form-control" required></select>
  				</div>
  				<div class="col-12 col-sm-6 col-md-3 mb-2 mb-md-0">
  					<select id="subjectSelect" class="form-control" required multiple></select>
  				</div>
  				<div class="col-12 col-sm-6 col-md-3 mb-2 mb-md-0">
  					<select id="gradeFromSelect" class="form-control" required></select>
  				</div>
  				<div class="col-12 col-sm-6 col-md-3 mb-2 mb-md-0">
  					<select id="gradeToSelect" class="form-control" required></select>
  				</div>
  			</div>
  			<div class="table-responsive mb-2">
  				<table class="table table-bordered align-middle bg-white" id="daysTable">
  					<thead class="table-light">
  						<tr>
  							<th>Select</th>
  							<th>Day</th>
  							<th>Hours (e.g. 09:00-12:00)</th>
  							<th>Status</th>
  						</tr>
  					</thead>
  					<tbody>
  						<tr>
  							<td><input type="checkbox" name="day_sunday" value="sunday" disabled></td>
  							<td>Sunday</td>
  							<td>
  								<input type="time" class="form-control d-inline-block" name="hours_sunday" style="width: 48%;" disabled> -
  								<input type="time" class="form-control d-inline-block" name="hours_sunday_close" style="width: 48%;" disabled>
  							</td>
  							<td>
  								<select class="form-control" name="status_sunday" disabled>
  									<option value="available">Available</option>
  									<option value="busy">Busy</option>
  								</select>
  							</td>
  						</tr>
  						<tr>
  							<td><input type="checkbox" name="day_monday" value="monday" disabled></td>
  							<td>Monday</td>
  							<td>
  								<input type="time" class="form-control d-inline-block" name="hours_monday" style="width: 48%;" disabled> -
  								<input type="time" class="form-control d-inline-block" name="hours_monday_close" style="width: 48%;" disabled>
  							</td>
  							<td>
  								<select class="form-control" name="status_monday" disabled>
  									<option value="available">Available</option>
  									<option value="busy">Busy</option>
  								</select>
  							</td>
  						</tr>
  						<tr>
  							<td><input type="checkbox" name="day_tuesday" value="tuesday" disabled></td>
  							<td>Tuesday</td>
  							<td>
  								<input type="time" class="form-control d-inline-block" name="hours_tuesday" style="width: 48%;" disabled> -
  								<input type="time" class="form-control d-inline-block" name="hours_tuesday_close" style="width: 48%;" disabled>
  							</td>
  							<td>
  								<select class="form-control" name="status_tuesday" disabled>
  									<option value="available">Available</option>
  									<option value="busy">Busy</option>
  								</select>
  							</td>
  						</tr>
  						<tr>
  							<td><input type="checkbox" name="day_wednesday" value="wednesday" disabled></td>
  							<td>Wednesday</td>
  							<td>
  								<input type="time" class="form-control d-inline-block" name="hours_wednesday" style="width: 48%;" disabled> -
  								<input type="time" class="form-control d-inline-block" name="hours_wednesday_close" style="width: 48%;" disabled>
  							</td>
  							<td>
  								<select class="form-control" name="status_wednesday" disabled>
  									<option value="available">Available</option>
  									<option value="busy">Busy</option>
  								</select>
  							</td>
  						</tr>
  						<tr>
  							<td><input type="checkbox" name="day_thursday" value="thursday" disabled></td>
  							<td>Thursday</td>
  							<td>
  								<input type="time" class="form-control d-inline-block" name="hours_thursday" style="width: 48%;" disabled> -
  								<input type="time" class="form-control d-inline-block" name="hours_thursday_close" style="width: 48%;" disabled>
  							</td>
  							<td>
  								<select class="form-control" name="status_thursday" disabled>
  									<option value="available">Available</option>
  									<option value="busy">Busy</option>
  								</select>
  							</td>
  						</tr>
  						<tr>
  							<td><input type="checkbox" name="day_friday" value="friday" disabled></td>
  							<td>Friday</td>
  							<td>
  								<input type="time" class="form-control d-inline-block" name="hours_friday" style="width: 48%;" disabled> -
  								<input type="time" class="form-control d-inline-block" name="hours_friday_close" style="width: 48%;" disabled>
  							</td>
  							<td>
  								<select class="form-control" name="status_friday" disabled>
  									<option value="available">Available</option>
  									<option value="busy">Busy</option>
  								</select>
  							</td>
  						</tr>
  						<tr>
  							<td><input type="checkbox" name="day_saturday" value="saturday" disabled></td>
  							<td>Saturday</td>
  							<td>
  								<input type="time" class="form-control d-inline-block" name="hours_saturday" style="width: 48%;" disabled> -
  								<input type="time" class="form-control d-inline-block" name="hours_saturday_close" style="width: 48%;" disabled>
  							</td>
  							<td>
  								<select class="form-control" name="status_saturday" disabled>
  									<option value="available">Available</option>
  									<option value="busy">Busy</option>
  								</select>
  							</td>
  						</tr>
  					</tbody>
  				</table>
  			</div>
  			<div class="row g-2 mb-2">
  				<div class="col-12 col-md-8 mb-2 mb-md-0">
  					<input type="text" id="noteInput" class="form-control" placeholder="Optional note (e.g. full day / after 10:30 / depends)">
  				</div>
  				<div class="col-12 col-md-4">
  					<button type="submit" class="btn btn-success w-100">Save Availability</button>
  				</div>
  			</div>
  		</form>
  		<div id="availabilitiesContainer"></div>
  	</div>
  	<script src="/bootstrap-5.0.2/dist/js/bootstrap.bundle.min.js"></script>
  	<script src="https://cdn.jsdelivr.net/npm/choices.js/public/assets/scripts/choices.min.js"></script>
  	<script src="/src/components/receptionist/sidebar-menu/sidebar-loader.js"></script>
  	<script type="module" src="/src/pages/receptionist/teachers-availability/teachers-availability.js"></script>
  
  	<!-- Header Loader + Undo Button -->
  	<script type="module" src="/assist/page-boot.js" data-header="/src/components/receptionist/header/header.html" data-container="receptionist-header-container" data-undo-module="/assist/undo-manager.js" data-burger-module="/src/components/receptionist/header/header.js"></script>
  
    <script src="/assist/pwa-register.js" defer></script>
    <script src="/assist/use-hostname.js" defer></script>
  </body>
  </html>
`;
