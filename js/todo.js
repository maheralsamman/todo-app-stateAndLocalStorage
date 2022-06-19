let state = [];

const localStorageGet = () => Array.from(JSON.parse(localStorage.getItem('todos')));
const localStorageWrite = (todos) => {
  localStorage.setItem('todos', JSON.stringify(todos));
};

const changeTocomplete = (todoitem) => {
  const todos = localStorageGet();
  todos.forEach((todo) => {
    const completeTodo = todo;
    if (completeTodo.title === todoitem.children[0].innerText) {
      completeTodo.completed = !completeTodo.completed;
      todos.splice(todos.indexOf(completeTodo), 1, completeTodo);
    }
  });
  localStorageWrite(todos);
};

const removeTodo = (event) => {
  const todos = localStorageGet();
  todos.forEach((todo) => {
    if (todo.title === event.parentNode.children[0].innerText) {
      todos.splice(todos.indexOf(todo), 1);
    }
  });
  localStorageWrite(todos);
  event.parentElement.remove();
};

const removeButtonHandler = (todoItem) => {
  if (todoItem.querySelector('button')) {
    todoItem.querySelector('button').remove();
  }
  if (todoItem.classList.contains('todo__item--completed')) {
    const button = document.createElement('button');
    button.className = 'todo__removeBtn';
    button.innerText = 'Remove';
    button.id = 'btnDeleteTodo';
    button.setAttribute('data-testid', 'btnDeleteTodo');
     button.onclick = function () {
      removeTodo(this);
    }; 
    todoItem.appendChild(button);
  }
};

const createTodoListener = () => {
  const todoItems = document.querySelectorAll('.todo__item');
  todoItems.forEach((todoItem) => {
    todoItem.addEventListener('click', () => {
      changeTocomplete(todoItem);
      todoItem.classList.toggle('todo__item--completed');
      removeButtonHandler(todoItem);
    });
  });
};

const renderTodos = (todosArray) => {
  const todos = todosArray
    .map(
      ({
        title, description, time, completed,
      }) => `
        <article data-testid="todoItem" id="todoItem" class="todo__item ${
  completed ? 'todo__item--completed' : ''}">
        <h3 class="todo__title">${title}</h3>
        <p class="todo__text">${description}</p>
        <p class="todo__time">${new Date(time).toLocaleString()}</p>
      </article>
        `,
    )
    .join('');
  document.querySelector('#todoList').innerHTML = todos;
  const todoItems = document.querySelectorAll('.todo__item');
  todoItems.forEach((todoItem) => removeButtonHandler(todoItem));
  createTodoListener();
};

const handleSubmit = (e) => {
  e.preventDefault();

  const prevState = window.localStorage.getItem('todos');
  const data = Object.fromEntries(new FormData(e.target).entries());
  if (!data.title) {
    const title = document.querySelector('#txtTodoItemTitle');
    title.classList.add('form__titleInput--danger');
    return null;
  }
  data.time = Date.now();
  data.completed = false;
  state = !prevState ? [data] : [...JSON.parse(prevState), data];

  window.history.replaceState(state, '');
  window.localStorage.setItem('todos', JSON.stringify(state));
  window.dispatchEvent(new Event('statechange'));
  document.querySelector('#txtTodoItemTitle').value = '';
  document.querySelector('#txtTodoItemDescription').value = '';
  return null;
};

const initialise = () => {
  document.querySelector('form').addEventListener('submit', handleSubmit);
  const title = document.querySelector('#txtTodoItemTitle');
  title.addEventListener('input', () => title.classList.remove('form__titleInput--danger'));

  const prevState = window.localStorage.getItem('todos');
  if (!prevState) {
    return;
  }
  renderTodos(JSON.parse(prevState));
};

window.onload = initialise;
window.addEventListener('statechange', () => renderTodos(window.history.state));
