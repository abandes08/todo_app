const taskList = document.getElementById('taskList');
const taskInput = document.getElementById('taskInput');
const statusInput = document.getElementById('statusInput');
const addTaskBtn = document.getElementById('addTaskBtn');

function loadTasks() {
    fetch("api/get_tasks.php")
        .then(response => response.json())
        .then(data => {
            taskList.innerHTML = '';
            data.forEach(task => {
                const li = document.createElement('li');
                li.classList.add('list-group-item');
                li.textContent = `${task.task} — [${task.status}]`; // show both task and status
                taskList.appendChild(li);
            });
        })
        .catch(error => console.error('Error fetching tasks:', error));
}

// Load tasks on page load
loadTasks();