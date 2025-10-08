// ------- Storage helpers -------
const STORAGE_KEY = 'todos-v1';
const load = () => JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
const save = (data) => localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

// ------- State -------
let todoList = load();
if (todoList.length === 0) {
  // starter data (can remove)
  todoList = [
    { id: Date.now()-2, name: 'Make dinner', dueDate: '2025-10-08', done: false },
    { id: Date.now()-1, name: 'Wash dishes', dueDate: '2025-10-10', done: false }
  ];
  save(todoList);
}

// ------- DOM refs -------
const listEl = document.querySelector('.js-todo-list');
const nameInput = document.querySelector('.js-name-input');
const dateInput = document.querySelector('.js-due-date-input');
const addBtn = document.querySelector('.add-btn');
const countEl = document.querySelector('.count strong');
const clearBtn = document.querySelector('.clear-done-btn');
const sortBtn = document.querySelector('.sort-btn');

// ------- Render -------
function render() {
  listEl.innerHTML = '';
  todoList.forEach((t) => {
    const row = document.createElement('div');
    row.className = `todo-item ${t.done ? 'done' : ''}`;
    row.dataset.id = t.id;

    row.innerHTML = `
      <div class="task-cell">
        <input type="checkbox" class="toggle" ${t.done ? 'checked' : ''} aria-label="toggle complete">
        <span class="task-text" title="${escapeHtml(t.name)}">${escapeHtml(t.name)}</span>
      </div>
      <div class="date-cell">${t.dueDate || '-'}</div>
      <div class="actions">
        <button class="btn ${t.done ? 'btn-undo' : 'btn-done'} action-toggle">
          ${t.done ? 'Undo' : 'Mark Done'}
        </button>
        <button class="btn btn-del action-delete">Delete</button>
      </div>
    `;
    listEl.appendChild(row);
  });

  countEl.textContent = String(todoList.length);
}

// ------- Utilities -------
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, (c) =>
    ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])
  );
}

// ------- Actions -------
function addTodo() {
  const name = nameInput.value.trim();
  const dueDate = dateInput.value;

  if (!name) {
    nameInput.focus();
    return;
  }

  todoList.push({ id: Date.now(), name, dueDate, done: false });
  save(todoList);
  nameInput.value = '';
  dateInput.value = '';
  render();
}

function toggleById(id) {
  const idx = todoList.findIndex(t => t.id === id);
  if (idx >= 0) {
    todoList[idx].done = !todoList[idx].done;
    save(todoList);
    render();
  }
}

function deleteById(id) {
  todoList = todoList.filter(t => t.id !== id);
  save(todoList);
  render();
}

function clearCompleted() {
  todoList = todoList.filter(t => !t.done);
  save(todoList);
  render();
}

let sortAsc = true;
function sortByDate() {
  todoList.sort((a, b) => {
    const da = a.dueDate || '';
    const db = b.dueDate || '';
    return sortAsc ? da.localeCompare(db) : db.localeCompare(da);
  });
  sortAsc = !sortAsc;
  save(todoList);
  render();
}

// ------- Event wiring -------
addBtn.addEventListener('click', addTodo);

// Enter key support
nameInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTodo(); });
dateInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addTodo(); });

clearBtn.addEventListener('click', clearCompleted);
sortBtn.addEventListener('click', sortByDate);

// Event delegation for list actions (keeps DOM light)
listEl.addEventListener('click', (e) => {
  const row = e.target.closest('.todo-item');
  if (!row) return;
  const id = Number(row.dataset.id);

  if (e.target.classList.contains('action-toggle')) {
    toggleById(id);
  } else if (e.target.classList.contains('action-delete')) {
    deleteById(id);
  }
});

// Also toggle with the checkbox
listEl.addEventListener('change', (e) => {
  if (e.target.classList.contains('toggle')) {
    const row = e.target.closest('.todo-item');
    const id = Number(row.dataset.id);
    toggleById(id);
  }
});

// Initial paint
render();
