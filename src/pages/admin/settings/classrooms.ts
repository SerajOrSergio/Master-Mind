document.addEventListener('DOMContentLoaded', () => {
  function setStatusMessage(element, type, text) {
    element.innerHTML = `<div class="alert alert-${type} mb-0">${text}</div>`;
  }

  // ================= DARK MODE =================
  const darkModeToggle = document.getElementById('darkModeToggle');
  const darkModeMsg = document.getElementById('darkModeMsg');

  function loadDarkMode() {
    fetch('/api/settings/dark-mode')
      .then(res => res.json())
      .then(data => {
        darkModeToggle.checked = data.darkMode;
        applyDarkMode(data.darkMode);
      })
      .catch(() => {
        console.error('Failed to load dark mode setting');
      });
  }

  function applyDarkMode(isDark) {
    if (isDark) {
      document.body.classList.add('dark-mode');
      document.body.classList.add('gradient-glassmorphism');
    } else {
      document.body.classList.remove('dark-mode');
      document.body.classList.remove('gradient-glassmorphism');
    }
  }

  darkModeToggle.addEventListener('change', () => {
    const newDarkMode = darkModeToggle.checked;
    
    fetch('/api/settings/dark-mode', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ darkMode: newDarkMode })
    })
    .then(res => res.json())
    .then(data => {
      applyDarkMode(data.darkMode);
      setStatusMessage(darkModeMsg, 'success', 'Theme preference saved. Refresh the page to see the creamy 2.0 white mode design across all portals.');
    })
    .catch(() => {
      setStatusMessage(darkModeMsg, 'danger', 'Failed to save dark mode preference.');
    });
  });

  loadDarkMode();

  // ================= CLASSROOM =================
  const form = document.getElementById('addClassroomForm');
  const nameInput = document.getElementById('classroomName');
  const colorInput = document.getElementById('classroomColor');
  const listDiv = document.getElementById('classroomsList');

  function fetchClassrooms() {
    fetch('/api/classrooms')
      .then(res => res.json())
      .then(renderClassrooms)
      .catch(() => {
        listDiv.innerHTML = '<div class="alert alert-danger">Failed to load classrooms.</div>';
      });
  }

  function renderClassrooms(data) {
    if (!data.length) {
      listDiv.innerHTML = '<div class="alert alert-info">No classrooms</div>';
      return;
    }

    listDiv.innerHTML = `
      <table class="table table-bordered" id="classroomsTable">
        <thead>
          <tr>
            <th></th>
            <th>Name</th>
            <th>Color</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(c => `
            <tr data-id="${c.id}" draggable="true">
              <td class="grab-handle">☰</td>
              <td>${c.classroom_name}</td>
              <td>
                <span style="background:${c.color};width:30px;height:20px;display:inline-block;"></span>
                ${c.color}
              </td>
              <td>
                <button class="btn btn-danger btn-sm delete" data-id="${c.id}">Delete</button>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    // DELETE
    document.querySelectorAll('.delete').forEach(btn => {
      btn.onclick = () => {
        const classroom = data.find(c => String(c.id) === String(btn.dataset.id)) || null;
        fetch(`/api/classrooms/${btn.dataset.id}`, { method: 'DELETE' })
          .then(res => {
            if (res.ok && classroom && window.pushAction && window.createDeleteAction) {
              // Undo re-creates the classroom via POST
              window.pushAction(window.createDeleteAction(classroom, 'classroom', '/api/classrooms', fetchClassrooms));
            }
            fetchClassrooms();
          });
      };
    });

    // DRAG AND DROP REORDER (grab the ☰ burger handle to move a classroom)
    const tbody = listDiv.querySelector<HTMLTableElement>('#classroomsTable tbody');
    if (tbody) {
      // Keep a direct reference to the row being dragged instead of matching by
      // id, so rows always move exactly as dragged (even if ids ever collide).
      let dragRowEl = null;

      const clearDragHighlights = () => {
        tbody.querySelectorAll('.dragging, .drag-over').forEach(r => r.classList.remove('dragging', 'drag-over'));
      };

      // Persist a new classroom order and register an undo that restores prevOrder
      const saveOrder = (order, prevOrder) => {
        fetch('/api/classrooms/reorder', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order })
        })
          .then(res => {
            if (!res.ok) throw new Error('Reorder failed');
            return res.json();
          })
          .then(() => {
            if (prevOrder && window.pushAction && window.createCustomAction) {
              window.pushAction(window.createCustomAction('reorder', async () => {
                await fetch('/api/classrooms/reorder', {
                  method: 'PATCH',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ order: prevOrder })
                });
                fetchClassrooms();
              }));
            }
            fetchClassrooms();
          })
          .catch(() => {
            alert('Failed to save classroom order.');
            fetchClassrooms();
          });
      };

      tbody.querySelectorAll('tr[draggable=true]').forEach(row => {
        row.addEventListener('dragstart', (e: any) => {
          dragRowEl = row;
          row.classList.add('dragging');
          e.dataTransfer.effectAllowed = 'move';
          try { e.dataTransfer.setData('text/plain', String(row.dataset.id)); } catch (err) { /* some browsers need setData for drag to start */ }
        });
        row.addEventListener('dragend', () => {
          clearDragHighlights();
          dragRowEl = null;
        });
        row.addEventListener('dragover', (e: any) => {
          e.preventDefault();
          if (!dragRowEl || dragRowEl === row) return;
          row.classList.add('drag-over');
        });
        row.addEventListener('dragleave', (e: any) => {
          if (row.contains(e.relatedTarget)) return; // still inside this row (child cell)
          row.classList.remove('drag-over');
        });
        row.addEventListener('drop', (e: any) => {
          e.preventDefault();
          row.classList.remove('drag-over');
          if (!dragRowEl || dragRowEl === row) return;

          // Remember the previous order so Undo can restore it
          const prevOrder = Array.from(tbody.rows).map(r => r.dataset.id);
          // Drop on the lower half of the target row → insert AFTER it,
          // so a classroom can be moved to the very last position.
          const rect = row.getBoundingClientRect();
          const insertAfter = e.clientY > rect.top + rect.height / 2;
          if (insertAfter) {
            tbody.insertBefore(dragRowEl, row.nextSibling);
          } else {
            tbody.insertBefore(dragRowEl, row);
          }
          // Build the new order of ids and persist it (only when it changed)
          const order = Array.from(tbody.rows).map(r => r.dataset.id);
          if (order.join('|') !== prevOrder.join('|')) {
            saveOrder(order, prevOrder);
          }
        });
      });

    }
  }

  form.addEventListener('submit', e => {
    e.preventDefault();

    fetch('/api/classrooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        classroom_name: nameInput.value,
        color: colorInput.value
      })
    })
    .then(res => res.json())
    .then(created => {
      // Register an undo action so the added classroom can be rolled back
      if (created && created.id && window.pushAction && window.createAddAction) {
        window.pushAction(window.createAddAction(created, 'classroom', '/api/classrooms', fetchClassrooms));
      }
      form.reset();
      fetchClassrooms();
    });
  });

  fetchClassrooms();

  // ================= RECEPTIONIST =================
  const rForm = document.getElementById('receptionistForm');
  const rMsg = document.getElementById('receptionistMsg');

  rForm.addEventListener('submit', e => {
    e.preventDefault();

    fetch('/api/receptionist', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: document.getElementById('receptionistId').value,
        username: document.getElementById('receptionistUsername').value,
        password: document.getElementById('receptionistPassword').value
      })
    })
    .then(res => res.json())
    .then(() => {
      rMsg.innerHTML = '<div class="alert alert-success">Updated</div>';
    });
  });

  // ================= ADMIN =================
  const adminSection = document.getElementById('admin-credentials-section');
  const adminForm = document.getElementById('adminCredentialsForm');
  const adminMsg = document.getElementById('adminCredentialsMsg');
  const adminUsernameInput = document.getElementById('adminUsername');
  const adminPasswordInput = document.getElementById('adminPassword');
  const adminPasswordConfirmInput = document.getElementById('adminPasswordConfirm');
  let adminId = 1;

  function loadAdminCredentials() {
    adminSection.style.display = 'block';
    setStatusMessage(adminMsg, 'info', 'Loading admin credentials...');

    fetch('/api/admin')
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to load admin credentials.');
        }
        return data;
      })
      .then(data => {
        adminId = data.id || 1;
        adminUsernameInput.value = data.username || '';
        adminPasswordInput.value = '';
        adminPasswordConfirmInput.value = '';
        adminMsg.innerHTML = '';
      })
      .catch(err => {
        setStatusMessage(adminMsg, 'danger', err.message || 'Failed to load admin credentials.');
      });
  }

  adminForm.addEventListener('submit', e => {
    e.preventDefault();

    const username = adminUsernameInput.value.trim();
    const password = adminPasswordInput.value;
    const passwordConfirm = adminPasswordConfirmInput.value;

    if (!username) {
      setStatusMessage(adminMsg, 'danger', 'Admin username is required.');
      adminUsernameInput.focus();
      return;
    }



    if (password !== passwordConfirm) {
      setStatusMessage(adminMsg, 'danger', 'New password and confirmation do not match.');
      adminPasswordConfirmInput.focus();
      return;
    }

    setStatusMessage(adminMsg, 'info', 'Saving admin credentials...');

    fetch('/api/admin', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: adminId,
        username,
        password
      })
    })
      .then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to update admin credentials.');
        }
        return data;
      })
      .then(data => {
        adminUsernameInput.value = data.admin?.username || username;
        adminPasswordInput.value = '';
        adminPasswordConfirmInput.value = '';
        setStatusMessage(adminMsg, 'success', 'Admin credentials updated successfully.');
      })
      .catch(err => {
        setStatusMessage(adminMsg, 'danger', err.message || 'Failed to update admin credentials.');
      });
  });

  loadAdminCredentials();

});