const todoList = [{name:'Make dinner', dueDate: '2022-12-22'}, {name:'Wash dishes', dueDate: '2025-08-05'}];

function renderTodoList(){
  let todoListHTML = '';

  for(i=0;i<todoList.length;i++){
    const todoObject = todoList[i];
    // const name = todoObject.name;
    // const dueDate = todoObject.dueDate;
    const {name, dueDate} = todoObject;
    const html = `<div>${name}</div>
    <div>${dueDate}</div>
    <button onclick = "
      todoList.splice(${i}, 1);
      renderTodoList();
    ">Delete
    </button>`;

    todoListHTML += html;
  }

  document.querySelector('.js-todo-list').innerHTML = todoListHTML;

}

function addTodo(){
  const inputElement = document.querySelector('.js-name-input')
  const name = inputElement.value;
  const dateInputelement = document.querySelector('.js-due-date-input');
  const dueDate = dateInputelement.value;

  todoList.push({name, dueDate});

  inputElement.value = '';
  dateInputelement.value = '';

  renderTodoList();
}