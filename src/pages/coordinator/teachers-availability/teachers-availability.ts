// Load header
fetch('/src/components/coordinator/header/header.html')
	.then(res => res.text())
	.then(html => {
		document.getElementById('header-container').innerHTML = html;
	});

// Utility to escape HTML
function escapeHtml(str) {
	if (!str) return '';
	return String(str).replace(/[&<>]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]));
}

// Utility to format subjects as badges
function formatSubjects(subject) {
	if (!subject) return '';
	if (Array.isArray(subject)) {
		return subject.map(s => `<span class='badge bg-info text-dark me-1'>${escapeHtml(s)}</span>`).join('');
	}
	return `<span class='badge bg-info text-dark'>${escapeHtml(subject)}</span>`;
}

// Fetch and display teachers availability (grouped, admin style, read-only)
fetch('/api/teachers-availability')
	.then(res => res.json())
	.then(availabilities => {
		const container = document.querySelector('#availability-table').parentElement;
		container.innerHTML = '';
		if (!Array.isArray(availabilities) || availabilities.length === 0) {
			container.innerHTML = '<div class="alert alert-info">No availabilities found.</div>';
			return;
		}
		// Group by teacher name
		const grouped: { [key: string]: any } = {};
		availabilities.forEach(av => {
			const key = av.teacherName || `Teacher ID ${av.teacherId}`;
			if (!grouped[key]) grouped[key] = [];
			grouped[key].push(av);
		});
		for (const [teacherName, entries] of Object.entries(grouped as { [key: string]: any })) {
			let html = `<h4 class="mt-4 mb-2">${escapeHtml(teacherName)}</h4>`;
			html += `<div class="table-responsive mb-4" style="overflow-x:auto;">
				<table class="table table-bordered table-hover align-middle bg-white availabilitiesTable w-100">
					<thead class="table-light"><tr>
						<th>Day</th>
						<th>Start Time</th>
						<th>Close Time</th>
						<th>Status</th>
						<th>Subject</th>
						<th>Grade From</th>
						<th>Grade To</th>
						<th>Note</th>
					</tr></thead><tbody>`;
			for (const av of entries) {
				const weekly = av.weeklySchedule || {};
				for (const [day, info] of Object.entries(weekly as { [key: string]: any })) {
					if (!info) continue;
					let start = '', close = '';
					if (info.hours && info.hours.includes('-')) {
						[start, close] = info.hours.split('-').map(s => s.trim());
					} else {
						start = info.hours || '';
					}
					const status = info.status || 'available';
					const statusBadge = status === 'available' ? 'success' : (status === 'busy' ? 'danger' : 'secondary');
					html += `<tr>
						<td><strong>${escapeHtml(day.charAt(0).toUpperCase() + day.slice(1))}</strong></td>
						<td>${escapeHtml(start)}</td>
						<td>${escapeHtml(close)}</td>
						<td><span class="badge bg-${statusBadge}">${escapeHtml(status)}</span></td>
						<td>${formatSubjects(av.subject)}</td>
						<td>${escapeHtml(av.gradeFrom || '')}</td>
						<td>${escapeHtml(av.gradeTo || '')}</td>
						<td><small class="text-muted">${escapeHtml(av.note || '')}</small></td>
					</tr>`;
				}
			}
			html += '</tbody></table></div>';
			container.innerHTML += html;
		}
	})
	.catch(() => {
		const container = document.querySelector('#availability-table').parentElement;
		container.innerHTML = '<div class="alert alert-danger">Failed to load availabilities.</div>';
	});
