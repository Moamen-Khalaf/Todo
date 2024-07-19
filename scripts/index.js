"use strict";
const UI = {
  addBtn: document.querySelector(`.add-task input[type="submit"]`),
  newTodo: document.querySelector(`.add-task input[type="text"]`),
  tasksContainer: document.querySelector(".tasks"),
  btnMenu: document.querySelector(".bottom-menu"),
  tasks: [],
};

let task = class {
  content = "";
  archived = false;
  order = -1;
  taskElement = null;
  completed = false;
  constructor(content = "", order = 0) {
    this.content = content;
    this.order = order;
    this.taskElement = this.#createTask();
  }
  deserilize = ([content, order, archived, completed]) => {
    this.content = content;
    this.order = order;
    this.archived = archived;
    this.completed = completed;
    this.taskElement = this.#createTask();
    return this;
  };
  #createTask = function () {
    let taskContainer = document.createElement("div");
    taskContainer.className = "task";
    let checkArea = document.createElement("div");
    checkArea.className = "check-area";
    let taskCheck = document.createElement("input");
    taskCheck.type = "checkbox";
    let taskContent = document.createElement("span");
    taskContent.className = "content";
    taskContent.innerHTML = this.content;
    let archive = document.createElement("span");
    archive.className = "material-symbols-outlined";
    archive.innerHTML = "archive";
    let close = document.createElement("span");
    close.className = "material-symbols-outlined";
    close.innerHTML = "close";
    taskCheck.onclick = () => {
      checkArea.click();
    };
    checkArea.onclick = () => {
      if (taskCheck.checked) {
        taskCheck.checked = false;
        this.completed = false;
      } else {
        taskCheck.checked = true;
        this.completed = true;
        UI.btnMenu.before(this.taskElement);
      }
    };
    close.onclick = () => {
      close.parentElement.remove();
      const index = UI.tasks.indexOf(this);
      if (index > -1) {
        UI.tasks.splice(index, 1);
      }
    };
    archive.onclick = () => {
      if (archive.innerHTML === "archive") {
        archive.innerHTML = "unarchive";
        this.taskElement.style.opacity = ".2";
        this.archived = true;
        UI.btnMenu.before(this.taskElement);
      } else {
        archive.innerHTML = "archive";
        this.taskElement.style.opacity = "1";
        this.archived = false;
      }
    };
    checkArea.appendChild(taskCheck);
    checkArea.appendChild(taskContent);
    taskContainer.appendChild(checkArea);
    taskContainer.appendChild(archive);
    taskContainer.appendChild(close);
    return taskContainer;
  };
  serilize = () => {
    return [this.content, this.order, this.archived, this.completed];
  };
};
if (localStorage.getItem("savedTasks")) {
  UI.tasks = JSON.parse(localStorage.getItem("savedTasks"));
  UI.tasks = UI.tasks.map((ele) => {
    let savedItem = new task().deserilize(ele);
    console.log(savedItem.completed, savedItem.archived);
    UI.tasksContainer.prepend(savedItem.taskElement);
    return savedItem;
  });
  console.log(UI.tasks);
}
window.onbeforeunload = function (e) {
  window.localStorage.clear();
  window.localStorage.setItem(
    "savedTasks",
    JSON.stringify(
      UI.tasks.map((ele) => {
        return ele.serilize();
      })
    )
  );
};
UI.addBtn.onclick = () => {
  let ntask = new task(UI.newTodo.value);
  UI.tasksContainer.prepend(ntask.taskElement);
  UI.tasks.push(ntask);
  UI.newTodo.value = "";
};
