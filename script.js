const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const themeToggle = document.getElementById('themeToggle');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTheme = localStorage.getItem('theme') || 'light';

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
  } else {
    themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
  }
  localStorage.setItem('theme', theme);
}

applyTheme(currentTheme);

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'light' ? 'dark' : 'light';
  applyTheme(currentTheme);
});

addTaskBtn.addEventListener('click', () => {
  const text = taskInput.value.trim();
  if (!text) {
    alert('Please enter a task!');
    return;
  }
  addTask(text);
  taskInput.value = '';
});

function addTask(text) {
  tasks.push({ id: Date.now(), text, completed: false });
  saveTasks();
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.className = 'todo' + (task.completed ? ' completed' : '');

    taskDiv.innerHTML = `
      <input type="checkbox" class="complete" aria-label="Mark task as complete" ${task.completed ? 'checked' : ''} />
      <span class="task-text" contenteditable="false" tabindex="0">${task.text}</span>
      <div class="buttons">
        <button class="edit" aria-label="Edit task" title="Edit task">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
        <button class="delete" aria-label="Delete task" title="Delete task">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    // Complete toggle
    taskDiv.querySelector('.complete').addEventListener('change', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    // Delete
    taskDiv.querySelector('.delete').addEventListener('click', () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveTasks();
      renderTasks();
    });

    // Edit toggle
    const editBtn = taskDiv.querySelector('.edit');
    const taskSpan = taskDiv.querySelector('.task-text');
    editBtn.addEventListener('click', () => {
      if (editBtn.innerHTML.includes('pen-to-square')) {
        taskSpan.contentEditable = 'true';
        taskSpan.focus();
        editBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
      } else {
        const updatedText = taskSpan.innerText.trim();
        if (!updatedText) {
          alert('Task description cannot be empty.');
          taskSpan.innerText = task.text;
        } else {
          task.text = updatedText;
          saveTasks();
        }
        taskSpan.contentEditable = 'false';
        editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        renderTasks();
      }
    });

    taskList.appendChild(taskDiv);
  });
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

renderTasks();
