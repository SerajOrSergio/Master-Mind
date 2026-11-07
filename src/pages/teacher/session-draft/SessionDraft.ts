// Teacher Session Draft page logic — replaces the previously inline <script>
// block in SessionDraft.html. Compiled by tsc to SessionDraft.js next to the
// page and loaded as a module from there.

interface Draft {
  classroom?: string;
  date?: string;
  schoolName?: string;
  grade?: string;
  subject?: string;
  timeSlots?: string[];
  students?: unknown[];
  lastUpdate?: string | number;
}

type DraftEntry = Partial<Draft> & { teacherId?: string; draft?: Draft };

const teacherId = localStorage.getItem('teacherId');

async function renderDrafts(): Promise<void> {
  const container = document.getElementById('draftsContainer');
  container!.innerHTML = '<div class="text-muted">Loading drafts...</div>';

  let drafts: DraftEntry[] = [];

  try {
    const res = await fetch('/api/session-draft-all');
    drafts = await res.json();
  } catch (error) {
    console.error('Error fetching drafts:', error);
    container!.innerHTML = '<div class="alert alert-danger">Failed to load drafts.</div>';
    return;
  }

  if (!drafts || drafts.length === 0) {
    container!.innerHTML = '<div class="alert alert-info">No drafts saved.</div>';
    return;
  }

  container!.innerHTML = '';

  drafts.forEach((entry: DraftEntry) => {
    const draft: Draft = entry.draft || (entry as Draft);

    const card = document.createElement('div');
    card.className = 'card mb-3 shadow-sm';

    card.innerHTML = `
        <div class="card-body">
          <h5 class="card-title">
            ${draft.classroom || 'N/A'} • ${draft.date || 'N/A'}
          </h5>

          <div class="card-text mb-2">
            <div>School: <b>${draft.schoolName || '-'}</b></div>
            <div>Grade: <b>${draft.grade || '-'}</b></div>
            <div>Subject: <b>${draft.subject || '-'}</b></div>
            <div>Time Slots: <b>${(draft.timeSlots || []).join(', ')}</b></div>
            <div>Students: <b>${(draft.students || []).length}</b></div>
            <div class="text-muted small">
              Last Update: ${draft.lastUpdate ? new Date(draft.lastUpdate).toLocaleString() : '-'}
            </div>
          </div>

          <div class="d-grid gap-2 d-md-flex">
            <button class="btn btn-primary open-btn">Open Draft</button>
            <button class="btn btn-danger delete-btn">Delete</button>
          </div>
        </div>
      `;

    // OPEN DRAFT
    card.querySelector('.open-btn')!.addEventListener('click', () => {
      localStorage.setItem('sessionFormDraft', JSON.stringify(draft));
      window.location.href = '/src/pages/teacher/session-form/sessionform.html';
    });

    // DELETE DRAFT
    card.querySelector('.delete-btn')!.addEventListener('click', async () => {
      try {
        // Capture the draft + its position so Undo can restore it exactly.
        // Use the draft's own teacherId (falls back to localStorage) for BOTH
        // the delete and the restore, so the undo always targets the same key.
        const draftTeacherId = entry.teacherId || teacherId;
        const entryForUndo = { teacherId: draftTeacherId, draft: draft };
        const restoreIndex = drafts.indexOf(entry);
        const date = encodeURIComponent(draft.date || '');
        const subject = encodeURIComponent(draft.subject || '');
        const classroom = encodeURIComponent(draft.classroom || '');
        const timeSlots = encodeURIComponent((draft.timeSlots || []).join(','));

        await fetch(
          `/api/session-draft/${draftTeacherId}/${date}/${subject}/${classroom}/${timeSlots}`,
          { method: 'DELETE' }
        );

        // Register an undo action so the deleted draft can be restored
        // (_restoreIndex keeps it at its original spot, not the bottom).
        const undoAction = createCustomAction('delete', async () => {
          await fetch('/api/session-draft', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...entryForUndo, _restoreIndex: restoreIndex })
          });
          void renderDrafts();
        });
        pushAction(undoAction);

        void renderDrafts(); // refresh
      } catch (err) {
        console.error('Delete failed:', err);
      }
    });

    container!.appendChild(card);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  void renderDrafts();
});
