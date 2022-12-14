todoForm.title.addEventListener("input", (e) => validiteField(e.target));
todoForm.title.addEventListener("blur", (e) => validiteField(e.target));
todoForm.description.addEventListener("input", (e) => validiteField(e.target));
todoForm.description.addEventListener("blur", (e) => validiteField(e.target));
todoForm.dueDate.addEventListener("input", (e) => validiteField(e.target));
todoForm.dueDate.addEventListener("blur", (e) => validiteField(e.target));

todoForm.addEventListener("submit", onSubmit);

const todoListElement = document.getElementById('todoList');
const api = new Api("http://localhost:5000/tasks")

let titleValid = true;
let descValid = true;
let dueDateValid = true;

function validiteField(field) {
  const { name, value } = field;

  let = validateMessage = "";

  switch (name) {
    case "title": {
      if (value.length < 2) {
        titleValid = false;
        validateMessage = "Titel måste innehålla minst 2 tecken.";
      } else if (value.length > 30) {
        titleValid = false;
        validateMessage = "Titel får inte vara längre än 30 tecken!";
      } else {
        titleValid = true;
      }
      break;
    }
    case "description": {
      if (value.length > 500) {
        descValid = false;
        validateMessage = "Beskrivning får inte vara mer än 500 tecken.";
      } else {
        descValid = true;
      }
      break;
    }
    case "dueDate": {
      if (value.length === 0) {
        dueDateValid = false;
        validateMessage = "Slutförd senaste är obligatoriskt.";
      } else {
        dueDateValid = true;
      }
      break;
    }
  }
  field.previousElementSibling.innerText = validateMessage;
  field.previousElementSibling.classList.remove('hidden');
}

function onSubmit(e) {
    e.preventDefault();

    if (titleValid && descValid && dueDateValid){
        //console.log("Submit");
        saveTask();
    }
  }

function saveTask(){
    const task = {
        title: todoForm.title.value,
        description: todoForm.description.value,
        dueDate: todoForm.dueDate.value,
        completed: false
    };

    api.create(task)
    .then((task) => {
        if (task) {
            renderList();
        }
    });
    // Clears input fields after submit
    todoForm.title.value = '';
    todoForm.description.value = '';
    todoForm.dueDate.value = '';
}

function renderList() {
    console.log('Rendering List');
    api.getAll().then((tasks) => {
        todoListElement.innerHTML = '';
        //console.log(tasks);
        
        if (tasks && tasks.length > 0) {
          sortDueDate(tasks);
          sortComplete(tasks);
            tasks.forEach((task) => {
              todoListElement.insertAdjacentHTML('beforeend', renderTask(task));
            });
        }
    });
}

function renderTask({id, title, description, dueDate, completed}) {
    const taskStatus = completed == true ? "checked" : "";
    const taskDone = completed == true ? "bg-black/20" : "";

    let html = `
    <li class="select-none my-2 py-2 border-b border-yellow-600 ${taskDone}">
        <div class="flex items-center">
            <input type="checkbox" value="${id}" class="accent-yellow-400/50 mr-2" onclick="updateTask(this)" ${taskStatus}>
            <h3 class="mb-3 flex-1 text-xl font-bold text-emerald-300 uppercase">${title}</h3>
            <div>
                <span>${dueDate}</span>
                <button onclick="removeTask(${id})" class="inline-block bg-cyan-500 border border-white px-5 py-2 ml-2 rounded-xl hover:bg-red-700">DELETE</button>
            </div>
        </div>
        `;
    description && (html += `<p class="ml-8 mt-2 text-xs italic text-yellow-300">${description}</p>`);
    html += `</li>`;
    return html;
}

function removeTask(id) {
  api.remove(id).then((result) => {
      renderList();
  });
}

function updateTask(e) {
  api.update(e.value).then((result) => {
    renderList()
  });
}

function sortDueDate(tasks) {
  // Sort Array by date  
  tasks.sort((a, b) => {
    if (a.dueDate < b.dueDate){
      return -1;
    }
    else if (a.dueDate > b.dueDate){
      return 1;
    }
    else {
      return 0;
    }
  });
}

function sortComplete(tasks) {
  // Sort Array by completion
  tasks.sort((a, b) => {
    if (a.completed < b.completed){
      return -1;
    }
    else if (a.completed > b.completed){
      return 1;
    }
  })
}

renderList();