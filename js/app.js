document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todo-input");
  const todoDate = document.getElementById("todo-date");
  const todoCategory = document.getElementById("todo-category");
  const addTodoButton = document.getElementById("add-todo");
  const todoList = document.getElementById("todo-list");
  const tabs = document.querySelectorAll(".tab");

  let tasks = [];
  let currentCategory = "all";

  const fetchTasks = async () => {
    const response = await fetch("/api/tasks");
    tasks = await response.json();
    renderTasks();
  };

  const renderTasks = () => {
    todoList.innerHTML = "";
    tasks
      .filter((task) => {
        if (currentCategory === "all") return true;
        if (currentCategory === "completed") return task.completed;
        if (currentCategory === "pending") return !task.completed;
        return task.category === currentCategory;
      })
      .forEach((task) => {
        const li = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", async () => {
          task.completed = checkbox.checked;
          await fetch(`/api/tasks/${task._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ completed: task.completed }),
          });
          fetchTasks();
        });

        const span = document.createElement("span");
        span.textContent = task.text;

        const noteButton = document.createElement("button");
        noteButton.textContent = "Add Note";
        noteButton.addEventListener("click", async () => {
          const note = prompt("Enter a note for this task:", task.note || "");
          if (note !== null) {
            task.note = note;
            await fetch(`/api/tasks/${task._id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ note }),
            });
            fetchTasks();
          }
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", async () => {
          await fetch(`/api/tasks/${task._id}`, { method: "DELETE" });
          fetchTasks();
        });

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(noteButton);
        li.appendChild(deleteButton);
        li.className = task.completed ? "completed" : "";
        todoList.appendChild(li);
      });
  };

  addTodoButton.addEventListener("click", async () => {
    const text = todoInput.value;
    const date = todoDate.value;
    const category = todoCategory.value;

    if (text && date && category) {
      await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, date, category }),
      });
      todoInput.value = "";
      todoDate.value = "";
      fetchTasks();
    }
  });

  tabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      currentCategory = tab.dataset.category;
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      renderTasks();
    });
  });

  fetchTasks();
});
