"use strict";
const UI = {
  addBtn: document.querySelector(`.add-task input[type="submit"]`),
  newTodo: document.querySelector(`.add-task input[type="text"]`),
  tasksContainer: document.querySelector(".tasks"),
  btnMenu: document.querySelector(".bottom-menu"),
  tasks: [],
  clearCompleted: document.querySelector(".clr-completed"),
  archivedTasks: document.querySelector(".Achived"),
  allbtn: document.querySelector(".All"),
  completedbtn: document.querySelector(".Completed"),
};
let task = class {
  content = "";
  archived = false;
  order = -1;
  taskElement = null;
  completed = false;
  taskContainer = document.createElement("div");
  checkArea = document.createElement("div");
  taskCheck = document.createElement("input");
  taskContent = document.createElement("span");
  archive = document.createElement("span");
  close = document.createElement("span");
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
    if (archived) {
      this.archive.click();
    }
    if (completed) {
      this.checkArea.click();
    }
    return this;
  };
  #createTask = function () {
    this.taskContainer.className = "task";
    this.checkArea.className = "check-area";
    this.taskCheck.type = "checkbox";
    this.taskContent.className = "content";
    this.taskContent.innerHTML = this.content;
    this.archive.className = "material-symbols-outlined";
    this.archive.innerHTML = "archive";
    this.close.className = "material-symbols-outlined";
    this.close.innerHTML = "close";
    this.taskCheck.onclick = () => {
      this.checkArea.click();
    };
    this.checkArea.onclick = () => {
      if (this.taskCheck.checked) {
        this.taskCheck.checked = false;
        this.completed = false;
      } else {
        this.taskCheck.checked = true;
        this.completed = true;
        UI.btnMenu.before(this.taskElement);
      }
    };
    this.close.onclick = () => {
      this.close.parentElement.remove();
      const index = UI.tasks.indexOf(this);
      if (index > -1) {
        UI.tasks.splice(index, 1);
      }
    };
    this.archive.onclick = () => {
      if (this.archive.innerHTML === "archive") {
        this.archive.innerHTML = "unarchive";
        this.taskElement.style.opacity = ".2";
        this.archived = true;
        UI.btnMenu.before(this.taskElement);
      } else {
        this.archive.innerHTML = "archive";
        this.taskElement.style.opacity = "1";
        this.archived = false;
      }
    };
    this.checkArea.appendChild(this.taskCheck);
    this.checkArea.appendChild(this.taskContent);
    this.taskContainer.appendChild(this.checkArea);
    this.taskContainer.appendChild(this.archive);
    this.taskContainer.appendChild(this.close);
    return this.taskContainer;
  };
  serilize = () => {
    return [this.content, this.order, this.archived, this.completed];
  };
};
if (localStorage.getItem("savedTasks")) {
  UI.tasks = JSON.parse(localStorage.getItem("savedTasks"));
  UI.tasks = UI.tasks.map((ele) => {
    let savedItem = new task().deserilize(ele);
    UI.tasksContainer.prepend(savedItem.taskElement);
    return savedItem;
  });
}
if (localStorage.getItem("savedInput")) {
  UI.newTodo.value = localStorage.getItem("savedInput");
}
window.onbeforeunload = function (e) {
  window.localStorage.removeItem("savedTasks");
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
  if (UI.newTodo.value.trim() != "") {
    let ntask = new task(UI.newTodo.value);
    if (UI.allbtn.classList.contains("active")) {
      UI.tasksContainer.prepend(ntask.taskElement);
    }
    UI.tasks.push(ntask);
    UI.newTodo.value = "";
  }
};
UI.clearCompleted.onclick = () => {
  UI.tasks = UI.tasks.filter((ele) => {
    return !ele.completed;
  });
  let allTasks = UI.tasksContainer.querySelectorAll(".task");
  allTasks.forEach((ele) => {
    ele.remove();
  });
  UI.tasks.forEach((ele) => {
    if (UI.archivedTasks.classList.contains("active") && ele.archived) {
      UI.tasksContainer.prepend(ele.taskElement);
    } else if (UI.completedbtn.classList.contains("active") && ele.completed) {
      UI.tasksContainer.prepend(ele.taskElement);
    }
  });
};
UI.newTodo.onblur = () => {
  localStorage.setItem("savedInput", UI.newTodo.value);
};
UI.archivedTasks.onclick = () => {
  UI.archivedTasks.parentElement.querySelectorAll("*").forEach((ele) => {
    ele.classList.remove("active");
  });
  UI.archivedTasks.classList.add("active");
  let allArchivedTasks = UI.tasks.filter((ele) => {
    return ele.archived;
  });
  let allTasks = UI.tasksContainer.querySelectorAll(".task");
  allTasks.forEach((ele) => {
    ele.remove();
  });
  allArchivedTasks.forEach((ele) => {
    UI.tasksContainer.prepend(ele.taskElement);
  });
};
UI.allbtn.onclick = () => {
  UI.archivedTasks.parentElement.querySelectorAll("*").forEach((ele) => {
    ele.classList.remove("active");
  });
  UI.allbtn.classList.add("active");
  let allTasks = UI.tasksContainer.querySelectorAll(".task");
  allTasks.forEach((ele) => {
    ele.remove();
  });
  UI.tasks.forEach((ele) => {
    UI.tasksContainer.prepend(ele.taskElement);
  });
};
UI.completedbtn.onclick = () => {
  UI.completedbtn.parentElement.querySelectorAll("*").forEach((ele) => {
    ele.classList.remove("active");
  });
  UI.completedbtn.classList.add("active");
  let allCompletedTasks = UI.tasks.filter((ele) => {
    return ele.completed;
  });
  let allTasks = UI.tasksContainer.querySelectorAll(".task");
  allTasks.forEach((ele) => {
    ele.remove();
  });
  allCompletedTasks.forEach((ele) => {
    UI.tasksContainer.prepend(ele.taskElement);
  });
};
