/* eslint-env browser */
// Supported via standard GitHub programming aids
(function () {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-undef
  const vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : undefined;

  function renderTasks(tasks) {
    const tbody = document.querySelector('#taskTable tbody');
    if (!tbody) { return; }
    tbody.innerHTML = '';
    for (const t of tasks) {
      const tr = document.createElement('tr');
      tr.dataset.taskId = t.id;
      tr.innerHTML = `
        <td>${t.description}</td>
        <td>${t.status}</td>
        <td>${t.dueDate ? new Date(t.dueDate).toLocaleDateString() : ''}</td>
        <td>${t.tags ? t.tags.join(', ') : ''}</td>
        <td><button class="status-btn" data-task-id="${t.id}" data-status="${t.status}">Toggle</button></td>
      `;
      tbody.appendChild(tr);
    }
  }

  // Initial data from VSCode
  let allTasks = [];
  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'setTasks') {
      allTasks = msg.tasks;
      renderTasks(allTasks);
    }
  });

  // Filter
  document.getElementById('filterInput')?.addEventListener('input', (e) => {
    const val = e.target.value.toLowerCase();
    renderTasks(allTasks.filter(t => t.description.toLowerCase().includes(val)));
  });

  // Sort
  document.getElementById('sortBtn')?.addEventListener('click', () => {
    allTasks.reverse();
    renderTasks(allTasks);
  });

  // Status change
  document.querySelector('#taskTable tbody')?.addEventListener('click', (e) => {
    const target = e.target;
    if (target.classList.contains('status-btn') && vscode) {
      const taskId = target.dataset.taskId;
      vscode.postMessage({ type: 'changeStatus', taskId });
    }
  });

  // Request initial data
  if (vscode) {
    vscode.postMessage({ type: 'requestTasks' });
  }
})();
