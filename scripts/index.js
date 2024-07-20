"use strict";
const UI = {
  addBtn: document.querySelector(`.add-task input[type="submit"]`),
  newTodo: document.querySelector(`.add-task input[type="text"]`),
  tasksContainer: document.querySelector(".tasks"),
  btnMenu: document.querySelector(".bottom-menu"),
  tasks: [],
  clearCompleted: document.querySelector(".clr-completed"),
  archivedbtn: document.querySelector(".Achived"),
  allbtn: document.querySelector(".All"),
  completedbtn: document.querySelector(".Completed"),
  emptyLabel: document.querySelector(".tasks > span"),
  notCompletedCount: document.querySelector(".count"),
};
let empCheck = (bool) => {
  if (bool) {
    UI.emptyLabel.style.display = "block";
  } else {
    UI.emptyLabel.style.display = "none";
  }
};
let updateCount = () => {
  let counts = UI.tasks.filter((ele) => {
    return !ele.completed;
  }).length;
  UI.notCompletedCount.innerHTML = `${counts}`;
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
      this.toggleCheckTask();
    };
    this.checkArea.onclick = () => {
      this.toggleCheckTask();
    };
    this.close.onclick = () => {
      this.deleteTask();
    };
    this.archive.onclick = () => {
      this.archiveTask();
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
  archiveTask = () => {
    if (this.archive.innerHTML === "archive") {
      this.archive.innerHTML = "unarchive";
      this.taskElement.style.opacity = ".2";
      this.archived = true;
      UI.btnMenu.before(this.taskElement);
    } else {
      this.archive.innerHTML = "archive";
      this.taskElement.style.opacity = "1";
      this.archived = false;
      if (UI.archivedbtn.classList.contains("active")) {
        UI.archivedbtn.click();
      }
    }
  };
  deleteTask = () => {
    this.close.parentElement.remove();
    const index = UI.tasks.indexOf(this);
    if (index > -1) {
      UI.tasks.splice(index, 1);
    }
    empCheck(UI.tasks.length === 0);
    updateCount();
  };
  toggleCheckTask = () => {
    if (this.taskCheck.checked) {
      this.taskCheck.checked = false;
      this.completed = false;
      if (UI.completedbtn.classList.contains("active")) {
        UI.completedbtn.click();
      }
    } else {
      this.taskCheck.checked = true;
      this.completed = true;
      UI.btnMenu.before(this.taskElement);
    }
    updateCount();
  };
};
if (localStorage.getItem("savedTasks")) {
  UI.tasks = JSON.parse(localStorage.getItem("savedTasks"));
  UI.tasks = UI.tasks.map((ele) => {
    let savedItem = new task().deserilize(ele);
    UI.tasksContainer.prepend(savedItem.taskElement);
    return savedItem;
  });
  empCheck(UI.tasks.length === 0);
  updateCount();
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
    empCheck(false);
    UI.tasks.push(ntask);
    UI.newTodo.value = "";
    updateCount();
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
  let checkExists = true;
  UI.tasks.forEach((ele) => {
    if (UI.archivedbtn.classList.contains("active") && ele.archived) {
      UI.tasksContainer.prepend(ele.taskElement);
      checkExists = false;
    } else if (UI.completedbtn.classList.contains("active") && ele.completed) {
      UI.tasksContainer.prepend(ele.taskElement);
      checkExists = false;
    } else {
      UI.tasksContainer.prepend(ele.taskElement);
      checkExists = false;
    }
  });
  empCheck(checkExists);
};
UI.newTodo.onchange = () => {
  localStorage.setItem("savedInput", UI.newTodo.value);
};
UI.archivedbtn.onclick = () => {
  UI.archivedbtn.parentElement.querySelectorAll("*").forEach((ele) => {
    ele.classList.remove("active");
  });
  UI.archivedbtn.classList.add("active");
  let allarchivedbtn = UI.tasks.filter((ele) => {
    return ele.archived;
  });
  empCheck(allarchivedbtn.length === 0);
  let allTasks = UI.tasksContainer.querySelectorAll(".task");
  allTasks.forEach((ele) => {
    ele.remove();
  });
  allarchivedbtn.forEach((ele) => {
    UI.tasksContainer.prepend(ele.taskElement);
  });
};
UI.allbtn.onclick = () => {
  UI.archivedbtn.parentElement.querySelectorAll("*").forEach((ele) => {
    ele.classList.remove("active");
  });
  UI.allbtn.classList.add("active");
  let allTasks = UI.tasksContainer.querySelectorAll(".task");
  allTasks.forEach((ele) => {
    ele.remove();
  });
  empCheck(UI.tasks.length == 0);
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
  empCheck(allCompletedTasks.length == 0);
  let allTasks = UI.tasksContainer.querySelectorAll(".task");
  allTasks.forEach((ele) => {
    ele.remove();
  });
  allCompletedTasks.forEach((ele) => {
    UI.tasksContainer.prepend(ele.taskElement);
  });
};
