// Auto-generated from teachers-availability.css — styles verbatim; the
// build (scripts/generate-pages.mjs) writes teachers-availability.css from this.
export const css = `
  /* --- Fix mobile table horizontal scroll for teacher availability admin page --- */
  .table-responsive {
  	overflow-x: auto !important;
  	-webkit-overflow-scrolling: touch;
  	width: 100%;
  }
  
  .availabilitiesTable {
  	min-width: 900px;
  	width: max-content;
  }
  
  @media (max-width: 767.98px) {
  	.table-responsive {
  		margin-bottom: 1rem;
  		border-radius: 0.5rem;
  		box-shadow: 0 2px 8px rgba(0,0,0,0.04);
  	}
  	.availabilitiesTable {
  		min-width: 700px;
  		width: max-content;
  	}
  }
  /* Show mobile labels only on xs screens */
  .mobile-label {
  	font-size: 0.95rem;
  	color: #495057;
  	margin-bottom: 0.1rem;
  }
  @media (min-width: 576px) {
  	.mobile-label {
  		display: none !important;
  	}
  }
  /* Ensure date/time inputs are always visible and styled */
  input[type="date"], input[type="time"] {
  	background: #fff !important;
  	color: #212529 !important;
  	border: 1px solid #ced4da !important;
  	min-height: 38px;
  }
  input[type="date"]::placeholder, input[type="time"]::placeholder {
  	color: #6c757d;
  	opacity: 1;
  }
  @media (max-width: 767.98px) {
  	input[type="date"], input[type="time"] {
  		width: 100% !important;
  		min-width: 0;
  		font-size: 1rem;
  	}
  }
  /* Style date/time placeholders for native pickers */
  input[type="date"]:empty:before {
  	content: attr(placeholder);
  	color: #6c757d;
  }
  input[type="time"]:empty:before {
  	content: attr(placeholder);
  	color: #6c757d;
  }
  /* Style period and time side by side */
  #dateInput, #timeInput, #periodSelect {
  	display: block;
  	width: 100%;
  	margin: 0;
  	border-radius: 0.375rem;
  }
  #timeInput, #periodSelect {
  	margin-right: 0;
  }
  /* teachers-availability.css */
  #availabilitiesContainer .card {
  	margin-bottom: 1rem;
  }
  #availabilitiesContainer .card .card-body {
  	display: flex;
  	flex-wrap: wrap;
  	align-items: center;
  	justify-content: space-between;
  }
  #availabilitiesContainer .card .info {
  	flex: 1 1 60%;
  	min-width: 200px;
  }
  #availabilitiesContainer .card .actions {
  	flex: 0 0 auto;
  	display: flex;
  	gap: 0.5rem;
  }
  @media (max-width: 767.98px) {
  	#main-content {
  		margin-left: 0 !important;
  		max-width: 100vw !important;
  		padding: 0 0.5rem;
  	}
  	#availabilitiesContainer .card .card-body {
  		flex-direction: column;
  		align-items: flex-start;
  		gap: 0.5rem;
  	}
  	#availabilitiesContainer .card .actions {
  		width: 100%;
  		justify-content: flex-end;
  	}
  }
  /* Copied from admin teachers-availability.css */
  /* Show mobile labels only on xs screens */
  .mobile-label {
  	font-size: 0.95rem;
  	color: #495057;
  	margin-bottom: 0.1rem;
  }
  @media (min-width: 576px) {
  	.mobile-label {
  		display: none !important;
  	}
  }
  /* Ensure date/time inputs are always visible and styled */
  input[type="date"], input[type="time"] {
  	background: #fff !important;
  	color: #212529 !important;
  	border: 1px solid #ced4da !important;
  	min-height: 38px;
  }
  input[type="date"]::placeholder, input[type="time"]::placeholder {
  	color: #6c757d;
  	opacity: 1;
  }
  @media (max-width: 767.98px) {
  	input[type="date"], input[type="time"] {
  		width: 100% !important;
  		min-width: 0;
  		font-size: 1rem;
  	}
  }
  /* Style date/time placeholders for native pickers */
  input[type="date"]:empty:before {
  	content: attr(placeholder);
  	color: #6c757d;
  }
  input[type="time"]:empty:before {
  	content: attr(placeholder);
  	color: #6c757d;
  }
  /* Style period and time side by side */
  #dateInput, #timeInput, #periodSelect {
  	display: block;
  	width: 100%;
  	margin: 0;
  	border-radius: 0.375rem;
  }
  #timeInput, #periodSelect {
  	margin-right: 0;
  }
  /* teachers-availability.css */
  #availabilitiesContainer .card {
  	margin-bottom: 1rem;
  }
  #availabilitiesContainer .card .card-body {
  	display: flex;
  	flex-wrap: wrap;
  	align-items: center;
  	justify-content: space-between;
  }
  #availabilitiesContainer .card .info {
  	flex: 1 1 60%;
  	min-width: 200px;
  }
  #availabilitiesContainer .card .actions {
  	flex: 0 0 auto;
  	display: flex;
  	gap: 0.5rem;
  }
  @media (max-width: 767.98px) {
  	#main-content {
  		margin-left: 0 !important;
  		max-width: 100vw !important;
  		padding: 0 0.5rem;
  	}
  	#availabilitiesContainer .card .card-body {
  		flex-direction: column;
  		align-items: flex-start;
  		gap: 0.5rem;
  	}
  	#availabilitiesContainer .card .actions {
  		width: 100%;
  		justify-content: flex-end;
  	}
  }
`;
export const cssFile = 'teachers-availability.css';
