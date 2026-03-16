const tableBody = document.getElementById('todoTableBody');
const todoSearch = document.querySelector('.todo-search');
const todoFilter = document.getElementById('todoFilter');
const addTaskBtn = document.getElementById('addTaskBtn');

// const taskForm = document.getElementById('taskForm');
// const taskTitleInput = document.getElementById('taskTitle');
// const taskCategoryInput = document.getElementById('taskCategory');
// const taskDueDateInput = document.getElementById('taskDueDate');
// const taskStatusInput = document.getElementById('taskStatus');

// Status options for tasks with color schemes
const statusColors = {
  "Created": "bg-secondary",
  "Ongoing": "bg-info",
  "Completed": "bg-success",
  "On-Hold": "bg-warning",
  "Cancelled": "bg-danger",
  "Deferred": "bg-dark" 
};

// Helper function to render badge
const renderStatusBadge = (status) => {
  const badgeClass = statusColors[status] || "bg-light text-dark";
  return `<span class="badge ${badgeClass}">${status}</span>`;
};

/* =========================
   RENDER TABLE
========================= */
function renderTodos(todos) {

    tableBody.innerHTML = "";

    if (todos.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-muted">
                    No tasks found
                </td>
            </tr>
        `;
        return;
    }

    todos.forEach((task, index) => {

        const tr = document.createElement("tr");

        tr.innerHTML = `
            <td class="text-center">${index + 1}</td>
            <td class="text-center">${task.created_at}</td>
            <td class="task-cell"></td>
            <td class="text-center">${task.category}</td>
            <td class="text-center">${renderStatusBadge(task.status)}</td>
            <td class="text-center">

                <button class="btn btn-warning btn-sm edit-btn"
                        data-id="${task.id}"
                        title="Edit">
                    <i class="bi bi-pencil-square"></i>
                </button>

                <button class="btn btn-danger btn-sm delete-btn"
                        data-id="${task.id}"
                        title="Delete">
                    <i class="bi bi-trash"></i>
                </button>

            </td>
        `;

        /* safer text rendering */
        tr.querySelector(".task-cell").textContent = task.task;

        tableBody.appendChild(tr);

    });
}

/* =========================
   LOAD TODOS
========================= */
async function loadTodoList() {

    try {

    const response = await fetch('/api/get_todos.php');
    const result = await response.json();

    console.log(result); // debug

    if (result.success) {
      renderTodos(result.data);   // IMPORTANT
    }

    } catch (error) {

        console.error(error);

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    Failed to load tasks
                </td>
            </tr>
        `;
    }
}

/* =========================
   EVENT DELEGATION
========================= */
tableBody.addEventListener("click", function (e) {

    const editBtn = e.target.closest(".edit-btn");
    const deleteBtn = e.target.closest(".delete-btn");

    if (editBtn) {
        const id = editBtn.dataset.id;
        editTask(id);
    }

    if (deleteBtn) {
        const id = deleteBtn.dataset.id;
        deleteTask(id);
    }

});

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", loadTodoList);
