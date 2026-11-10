/* eslint-env browser */
// Supported via standard GitHub programming aids
(function () {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, no-undef
  var vscode = typeof acquireVsCodeApi === 'function' ? acquireVsCodeApi() : undefined;

  function renderTasks(tasks) {
    var tbody = document.querySelector('#taskTable tbody');
    if (!tbody) { return; }
    tbody.innerHTML = '';
    for (var t of tasks) {
      var tr = document.createElement('tr');
      tr.dataset.taskId = t.id;
      tr.innerHTML = "
        <td>" + (t.description) + "</td>
        <td>" + (t.status) + "</td>
        <td>" + (t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '') + "</td>
        <td>" + (t.tags ? t.tags.join(', ') : '') + '</td>
        <td><button class="status-btn" data-task-id="' + (t.id) + '" data-status="' + (t.status) + '">Toggle</button></td>
      ';
      tbody.appendChild(tr);
    }
  }

  // Initial data from VSCode
  var allTasks = [];
  window.addEventListener('message', function (event) {
    var msg = event.data;
    if (msg.type === 'setTasks') {
      allTasks = msg.tasks;
      renderTasks(allTasks);
    }
  });

  // Filter
  document.getElementById('filterInput')?.addEventListener('input', function (e) {
    var val = e.target.value.toLowerCase();
    renderTasks(allTasks.filter(t => t.description.toLowerCase().includes(val)));
  });

  // Sort
  document.getElementById('sortBtn')?.addEventListener('click', function () {
    allTasks.reverse();
    renderTasks(allTasks);
  });

  // Status change
  document.querySelector('#taskTable tbody')?.addEventListener('click', function (e) {
    var target = e.target;
    if (target.classList.contains('status-btn') && vscode) {
      var taskId = target.dataset.taskId;
      vscode.postMessage({ type: 'changeStatus', taskId });
    }
  });

  // Request initial data
  if (vscode) {
    vscode.postMessage({ type: 'requestTasks' });
  }
})();
