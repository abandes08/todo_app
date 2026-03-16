document.addEventListener("DOMContentLoaded", () => {

    /* =========================
       DOM ELEMENTS
    ========================= */
    const tableBody = document.getElementById('todoTableBody');
    // const todoSearch = document.querySelector('.todo-search');
    // const todoFilter = document.getElementById('todoFilter');

    // Modals
    const addModal = document.getElementById("addTaskModal");
    const editModal = document.getElementById("editTaskModal");

    const openAddBtn = document.getElementById("openAddModal");
    const closeButtons = document.querySelectorAll(".close-btn");

    // Open Add Task Modal
    openAddBtn?.addEventListener("click", () => addModal.classList.add("show"));

    // Forms
    const addTaskForm = document.getElementById("addTaskForm");
    const editTaskForm = document.getElementById("editTaskForm");

    // Status badge colors
    const statusColors = {
        "Created": "bg-secondary",
        "In Progress": "bg-info",
        "Completed": "bg-success",
        "On-Hold": "bg-warning",
        "Cancelled": "bg-danger",
        "Deferred": "bg-dark"
    };

    /* =========================
       HELPER FUNCTIONS
    ========================= */
    const renderStatusBadge = (status) => {
        const badgeClass = statusColors[status] || "bg-light text-dark";
        return `<span class="badge ${badgeClass}">${status}</span>`;
    };

    const renderTodos = (todos) => {
        tableBody.innerHTML = "";

        if (!todos.length) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-muted">No tasks found</td>
                </tr>
            `;
            return;
        }

        todos.forEach((task, index) => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="text-center">${todos.length - index}</td>
                <td class="text-center">${task.created_at}</td>
                <td class="task-cell"></td>
                <td class="text-center">${task.category}</td>
                <td class="text-center">${renderStatusBadge(task.status)}</td>
                <td class="text-center">
                    <button class="btn btn-warning btn-sm edit-btn" data-id="${task.id}" title="Edit">
                        <i class="bi bi-pencil-square"></i>
                    </button>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${task.id}" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </td>
            `;
            tr.querySelector(".task-cell").textContent = task.task;
            tableBody.appendChild(tr);
        });
    };

    /* =========================
       LOAD DATA
    ========================= */
    const loadTodos = async () => {
        try {
            const res = await fetch('/api/get_todos.php');
            const data = await res.json();
            if (data.success) renderTodos(data.data);
        } catch (err) {
            console.error(err);
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="text-center text-danger">Failed to load tasks</td>
                </tr>
            `;
        }
    };

    const loadCategories = async () => {
        try {
            const res = await fetch("/api/get_categories.php");
            const data = await res.json();

            const selects = [
                document.getElementById("taskCategory"),
                document.getElementById("editTaskCategory")
            ];

            selects.forEach(select => {
                if (!select) return;
                select.innerHTML = '<option value="">Select Category</option>';
                data.data.forEach(cat => {
                    const option = document.createElement("option");
                    option.value = cat.id;
                    option.textContent = cat.category_name;
                    select.appendChild(option);
                });
            });
        } catch (err) {
            console.error("Failed to load categories:", err);
        }
    };

    const loadStatus = async () => {
        try {
            const statusSelect = document.getElementById("editTaskStatus");
            if (!statusSelect) return;

            const res = await fetch("/api/get_status.php");
            const data = await res.json();

            statusSelect.innerHTML = '<option value="">Select Status</option>';
            data.data.forEach(status => {
                const option = document.createElement("option");
                option.value = status.id;
                option.textContent = status.status_name;
                statusSelect.appendChild(option);
            });
        } catch (err) {
            console.error("Failed to load status options:", err);
        }
    };

    /* =========================
       MODAL HANDLING
    ========================= */
    openAddBtn?.addEventListener("click", () => addModal.classList.add("show"));

    // Close modals
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const modalId = btn.dataset.close;
            const modal = document.getElementById(modalId);
            if (modal) modal.classList.remove("show");
        });
    });

    // Click outside modal closes it
    window.addEventListener("click", e => {
        if (e.target.classList.contains("modal")) e.target.classList.remove("show");
    });

    /* =========================
       EVENT DELEGATION FOR EDIT / DELETE
    ========================= */
    tableBody.addEventListener("click", (e) => {
        const editBtn = e.target.closest(".edit-btn");
        const deleteBtn = e.target.closest(".delete-btn");

        if (editBtn) editTask(editBtn.dataset.id);
        if (deleteBtn) deleteTask(deleteBtn.dataset.id);
    });

    /* =========================
       FORM SUBMISSIONS
    ========================= */
    if (addTaskForm) {
        addTaskForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            try {
                const res = await fetch("/api/add_todos.php", { method: "POST", body: formData });
                const data = await res.json();
                if (data.success) {
                    addModal.classList.remove("show");
                    e.target.reset();
                    loadTodos();
                } else {
                    alert(data.message);
                }
            
            } catch (err) {
                console.error(err);
                alert("Failed to add task.");
            }
        });
    }

    //Edit Task Form
    // if (editTaskForm) {
    //     editTaskForm.addEventListener("submit", async (e) => {
    //         e.preventDefault();
    //         const formData = new FormData(e.target);
    //         try {
    //             const res = await fetch("/api/edit_todos.php", { method: "POST", body: formData });
    //             const data = await res.json();
    //             if (data.success) {
    //                 editModal.classList.remove("show");
    //                 loadTodos();
    //             } else {
    //                 alert(data.message);
    //             }
    //         } catch (err) {
    //             console.error(err);
    //             alert("Failed to update task.");
    //         }
    //     });
    // }

    /* =========================
       INITIAL LOAD
    ========================= */
    loadTodos();
    loadCategories();
    loadStatus();

});