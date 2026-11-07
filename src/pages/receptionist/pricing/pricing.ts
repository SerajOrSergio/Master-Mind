document.addEventListener('DOMContentLoaded', function() {
  const pricingTable = document.getElementById('pricing-table');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const addForm = document.getElementById('add-pricing-form');
  const typeInput = document.getElementById('typeInput');
  const descInput = document.getElementById('descInput');
  const priceInput = document.getElementById('priceInput');
  const currencyInput = document.getElementById('currencyInput');
  let pricingData = [];
  let currentCategory = 'Standard';

  // Fetch pricing data
  fetch('/api/pricing')
    .then(res => res.json())
    .then(data => {
      pricingData = data;
      renderTable(currentCategory);
    });

  // Tab switching logic
  tabButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      tabButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      currentCategory = this.dataset.category;
      renderTable(currentCategory);
    });
  });

  // Add pricing item
  if (addForm) {
    addForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const type = typeInput.value.trim();
      const description = descInput.value.trim();
      const price = parseFloat(priceInput.value);
      const currency = currencyInput.value;
      if (!type || !description || isNaN(price) || !currency) return;
      const addedCategory = currentCategory;
      const cat = pricingData.find(c => c.category === currentCategory);
      const addedItem = { type, description, price, currency };
      cat.pricing.push(addedItem);
      savePricingData(() => {
        renderTable(currentCategory);
        addForm.reset();
        // Register an undo action so the new pricing item can be removed
        if (window.pushAction) {
          const undoAction = window.createCustomAction('add', async () => {
            const catU = pricingData.find(c => c.category === addedCategory);
            if (catU) {
              const i = catU.pricing.indexOf(addedItem);
              if (i !== -1) catU.pricing.splice(i, 1);
              savePricingData(() => renderTable(addedCategory));
            }
          });
          window.pushAction(undoAction);
        }
      });
    });
  }

  // Delete pricing item
  window.deletePricingItem = function(idx) {
    const cat = pricingData.find(c => c.category === currentCategory);
    if (!cat || !cat.pricing[idx]) return;
    // Capture the removed item (plus its category/index) so undo can restore it
    const removedItem = { ...cat.pricing[idx] };
    const removedCategory = currentCategory;
    const removedIndex = idx;
    cat.pricing.splice(idx, 1);
    savePricingData(() => {
      renderTable(currentCategory);
      // Register an undo action so the deleted pricing item can be restored
      if (window.pushAction) {
        const undoAction = window.createCustomAction('delete', async () => {
          const catU = pricingData.find(c => c.category === removedCategory);
          if (catU) {
            catU.pricing.splice(Math.min(removedIndex, catU.pricing.length), 0, { ...removedItem });
            savePricingData(() => renderTable(removedCategory));
          }
        });
        window.pushAction(undoAction);
      }
    });
  };

  // Save pricing data to backend
  function savePricingData(cb) {
    fetch('/api/pricing', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pricingData)
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to save');
        return res.json();
      })
      .then(() => { if (cb) cb(); })
      .catch(() => alert('Failed to save pricing data.'));
  }

  function renderTable(category) {
    const cat = pricingData.find(c => c.category === category);
    if (!cat) {
      pricingTable.innerHTML = '<p>No data available.</p>';
      return;
    }
    let html = '<table class="table table-hover"><thead><tr><th></th><th>Type</th><th>Description</th><th>Price</th><th></th></tr></thead><tbody>';
    cat.pricing.forEach((item, idx) => {
      const symbol = item.currency === 'LYD' ? 'LYD' : (item.currency === '\u20ac' ? '\u20ac' : (item.currency === '$' ? '$' : (item.currency === '\u0644.\u062f' ? '\u0644.\u062f' : (item.currency || 'LYD'))));
      html += `<tr draggable="true" data-idx="${idx}">
        <td class="drag-handle text-center" style="cursor:grab;width:32px;"><i class="bi bi-list"></i></td>
        <td class="editable" data-field="type" data-idx="${idx}">${item.type}</td>
        <td class="editable" data-field="description" data-idx="${idx}">${item.description}</td>
        <td class="editable" data-field="price" data-idx="${idx}">${item.price}${symbol}</td>
        <td><button class="btn btn-link text-danger p-0" onclick="deletePricingItem(${idx})"><i class="bi bi-trash"></i></button></td>
      </tr>`;
    });
    html += '</tbody></table>';
    pricingTable.innerHTML = html;

    // Drag and drop reordering
    let dragSrcIdx = null;
    pricingTable.querySelectorAll('tr[draggable=true]').forEach(row => {
      row.addEventListener('dragstart', function(e) {
        dragSrcIdx = +row.dataset.idx;
        row.classList.add('table-active');
        e.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragend', function(e) {
        row.classList.remove('table-active');
      });
      row.addEventListener('dragover', function(e) {
        e.preventDefault();
        row.classList.add('table-primary');
      });
      row.addEventListener('dragleave', function(e) {
        row.classList.remove('table-primary');
      });
      row.addEventListener('drop', function(e) {
        e.preventDefault();
        row.classList.remove('table-primary');
        const dropIdx = +row.dataset.idx;
        if (dragSrcIdx === null || dragSrcIdx === dropIdx) return;
        const cat = pricingData.find(c => c.category === currentCategory);
        const moved = cat.pricing.splice(dragSrcIdx, 1)[0];
        cat.pricing.splice(dropIdx, 0, moved);
        savePricingData(() => renderTable(category));
      });
    });

    // Add inline editing events
    pricingTable.querySelectorAll('.editable').forEach(cell => {
      cell.addEventListener('click', function(e) {
        if (cell.querySelector('input')) return; // already editing
        const idx = +cell.dataset.idx;
        const field = cell.dataset.field;
        let value = field === 'price' ? cat.pricing[idx][field] : cat.pricing[idx][field];
        if (field === 'price') value = cat.pricing[idx][field];
        else value = cat.pricing[idx][field];
        const input = document.createElement('input');
        input.type = field === 'price' ? 'number' : 'text';
        input.className = 'form-control form-control-sm';
        input.value = value;
        input.style.minWidth = '80px';
        input.addEventListener('keydown', function(ev) {
          if (ev.key === 'Enter') { ev.preventDefault(); input.blur(); }
        });
        input.addEventListener('blur', function() {
          let newValue: any = input.value;
          if (field === 'price') newValue = parseFloat(newValue);
          if (field === 'price' && (isNaN(newValue) || newValue < 0)) newValue = cat.pricing[idx][field];
          if (newValue !== cat.pricing[idx][field]) {
            const oldValue = cat.pricing[idx][field];
            cat.pricing[idx][field] = field === 'price' ? newValue : newValue;
            savePricingData(() => {
              renderTable(category);
              // Register an undo action so the edited field can be reverted
              if (window.pushAction) {
                const undoAction = window.createCustomAction('edit', async () => {
                  const catU = pricingData.find(c => c.category === category);
                  if (catU && catU.pricing[idx]) {
                    catU.pricing[idx][field] = oldValue;
                    savePricingData(() => renderTable(category));
                  }
                });
                window.pushAction(undoAction);
              }
            });
          } else {
            renderTable(category);
          }
        });
        cell.innerHTML = '';
        cell.appendChild(input);
        input.focus();
        input.select();
      });
    });
  }
});