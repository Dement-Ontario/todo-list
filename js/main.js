/* Functions for To-Do List

- Add task
    Create a new task object and append it to the tasks list. This should also immediately add it
    to the display
- Remove task
    When the user clicks the delete button, delete the chosen task object from the tasks list
    and remove the task from the display. This should also delete any subtasks under it.
    Should also add a confirmation screen before removal
- Add subtask
    Create a new subtask and append it to the subtasks list in the task object.
    If there is no subtasks list, create one
- Remove subtask
    When the user clicks the delete button, delete the chosen subtask from the subtasks
    list in the task object. If there are no subtasks in the subtasks list, remove the list
- Display task
    Display a singular task. On page load, use recursion to go through 
    each task in the task list and display its information to the user.
    Make sure the function can be tweaked later to display subtasks
- Mark task/subtask complete/incomplete
    When the user clicks the button that tells you if the task is complete,
    set the task object completion property to complete if the property is incomplete and vice versa.
    The display should also immediately reflect this
- Save list
    Updates local storage with the newest list. Use this in add/remove and mark complete functions
- Load list
    Loads the current list from local storage on page load

*/

// Day.js object to store current date
const now = dayjs();

// Total task number to keep task IDs unique
let totalTasks = 2;

// Array of task objects
let taskList = [
    {id: 1, desc: "Do something smart", due:"1987-12-12", complete: false, subtasks: []},
    {id: 2, desc: "Do something stupid", due:"1999-04-26", complete: true,
        subtasks: [
            {desc: "Jump off a bridge or something", complete: true},
            {desc: "Do a flip", complete: false}
        ]
    }
];

function saveList() {
    const taskListString = JSON.stringify(taskList);
    localStorage.setItem("total", totalTasks);
    localStorage.setItem("tasks", taskListString);
}

function loadList(taskList) {
    // Store every task's ID in storedTasks and run displayTask with the list
    const storedTasks = [];
    taskList.forEach(element => {
        storedTasks.push(element.id);
    });
    
    displayTask(storedTasks);
}

function displayTask(tasks) {
    // Check if the tasks argument is both an array and not empty
    if (Array.isArray(tasks) && tasks.length > 0) {
        // Shift the first element from the tasks list and return as currentId
        const currentId = tasks.shift();
        // Find the current task in the tasks list through the current ID
        const currentTask = taskList.find(item => item && item.id === currentId);
        // Find HTML main
        const taskHolder = document.querySelector("main");

        // Make new task section
        const taskSection = document.createElement("section");
        taskSection.className = "task";
        taskHolder.appendChild(taskSection);

        // Make new task complete check button, writing an X if complete
        const taskButton = document.createElement("button");
        taskButton.className = "task-button";
        if (currentTask.complete) {
            taskButton.textContent = "X";
        }
        taskButton.addEventListener("click", () => markComplete(currentTask));
        taskSection.appendChild(taskButton);

        // Make new task description
        const taskDesc = document.createElement("p");
        taskDesc.className = "task-desc";
        taskDesc.textContent = currentTask.desc;
        taskSection.appendChild(taskDesc);

        // Make new task misc div
        const taskMisc = document.createElement("div");
        taskMisc.className = "task-misc";
        taskSection.appendChild(taskMisc);

        // Make new due date element
        const taskDue = document.createElement("p");
        taskDue.className = "task-due";
        // Format due date with Day.js
        const dueDate = dayjs(currentTask.due);
        const formattedDue = dueDate.format("M/D/YYYY");
        // If due date has been passed, mark late
        if (dueDate.isBefore(now) && !currentTask.complete) {
            taskDue.classList.add("late-date");
        }
        taskDue.textContent = formattedDue;
        taskMisc.appendChild(taskDue);

        // Make new delete button
        const taskDelete = document.createElement("button");
        taskDelete.className = "task-delete";
        taskDelete.textContent = "Delete Task";
        taskDelete.addEventListener("click", () => deleteTask(currentTask, taskSection, taskList));
        taskMisc.appendChild(taskDelete);

        // Make subtask form
        const subtaskForm = document.createElement("form");
        subtaskForm.className = "subtask-form";
        subtaskForm.id = `subtask-input-${currentTask.id}`;
        subtaskForm.innerHTML += '<input type="text" name="subtask-text" placeholder="Type in any subtask here!" class="subtask-text" required>';
        subtaskForm.innerHTML += '<input type="submit" value="Submit Subtask">';
        taskSection.appendChild(subtaskForm);
        subtaskForm.onsubmit = () => {
            // Keep the form from reloading the page and add the subtask
            event.preventDefault();
            addSubtask(currentTask, subtaskForm, subtaskHolder);
        }

        // Make subtask holder
            const subtaskHolder = document.createElement("section");
            subtaskHolder.className = "subtask-holder";
            taskSection.appendChild(subtaskHolder);

        // If there are subtasks in the list, display them
        if (currentTask.subtasks.length > 0){
            currentTask.subtasks.forEach(currentSubtask => {
                displaySubtask(currentTask, subtaskHolder, currentSubtask);
            });
        }

        // Recurse until array is empty
        displayTask(tasks);
    }
}

function displaySubtask(currentTask, subtaskHolder, currentSubtask) {
    // Add subtask div
    const subtaskDiv = document.createElement("div");
    subtaskDiv.className = "subtask";
    subtaskHolder.appendChild(subtaskDiv);

    // Add subtask complete check button, writing an X if complete
    const subtaskButton = document.createElement("button");
    subtaskButton.className = "subtask-button";
    if (currentSubtask.complete) {
        subtaskButton.textContent = "X";
    }
    subtaskButton.addEventListener("click", () => markComplete(currentSubtask));
    subtaskDiv.appendChild(subtaskButton);

    // Add subtask description
    const subtaskDesc = document.createElement("p");
    subtaskDesc.className = "subtask-desc";
    subtaskDesc.textContent = currentSubtask.desc;
    subtaskDiv.appendChild(subtaskDesc);
    
    // Add subtask delete button
    const subtaskDelete = document.createElement("button");
    subtaskDelete.className = "subtask-delete";
    subtaskDelete.textContent = "Delete Subtask";
    subtaskDelete.addEventListener("click", () => {
        deleteTask(currentSubtask, subtaskDiv, currentTask.subtasks);
    });
    subtaskDiv.appendChild(subtaskDelete);
}

function markComplete(task) {
    // If the task is incomplete, mark as complete
    // If the task is complete, mark as incomplete
    if (!task.complete) {
        event.target.innerHTML = "X";
        task.complete = true;
    } else {
        event.target.innerHTML = "";
        task.complete = false;
    }
    
    // Save changes to localStorage
    saveList();
}

function deleteTask(task, eventParent, listUsed) {
    // Hide delete button
    const delButton = event.target;
    delButton.classList.add("hidden");
    
    // Add confirmation element below the delete button
    const confirmDiv = document.createElement("div");
    confirmDiv.className = "confirm-delete";
    if (!listUsed === taskList) {
        eventParent.appendChild(confirmDiv);
    } else {
        event.target.parentElement.appendChild(confirmDiv);
    }

    // Add confirmation message
    const confirmText = document.createElement("p");
    confirmText.textContent = "Are you sure?";
    confirmDiv.appendChild(confirmText);

    // Add yes/no buttons inside confirmation element.
    // If the user clicks yes, delete task.
    // If the user clicks no, remove the confirmation and unhide the delete button.
    const yesButton = document.createElement("button");
    yesButton.textContent = "Yes";
    yesButton.addEventListener("click", () => {
        // Remove task from list
        const taskIndex = listUsed.indexOf(task);
        if (taskIndex !== -1) {
            listUsed.splice(taskIndex, 1);
        }
        
        // Remove task from display
        eventParent.remove();
        
        // Save changes to localStorage
        saveList();
    });
    confirmDiv.appendChild(yesButton);

    const noButton = document.createElement("button");
    noButton.textContent = "No";
    noButton.addEventListener("click", () => {
        confirmDiv.remove();
        delButton.classList.remove("hidden");
    });
    confirmDiv.appendChild(noButton);
}

function addTask() {
    // Keep the form from reloading the page and increase total tasks by 1
    event.preventDefault();
    totalTasks++;

    // Grab what was put on the form as a variable and put it in a new task object
    const taskDesc = event.target["task-text"].value;
    const taskDue = event.target["task-date"].value;
    const newTask = {id: totalTasks, desc: taskDesc, due: taskDue, complete: false, subtasks: []};

    // Push the new task into the task list and add the task to the display
    taskList.push(newTask);
    displayTask([newTask.id]);

    // Reset the form and save changes to localStorage
    taskForm.reset();
    saveList();
}

function addSubtask(task, form, subtaskHolder) {
    // Grab the task description from the form and put it in a new subtask object
    const subtaskDesc = event.target["subtask-text"].value;
    const newSubtask = {desc: subtaskDesc, complete: false};

    // Push the new subtask into the subtask list
    task.subtasks.push(newSubtask);
    
    // Create a new subtask for the display
    displaySubtask(task, subtaskHolder, newSubtask);

    // Reset the form and save changes to localStorage
    form.reset();
    saveList();
}

// Insert event into task submit button
const taskForm = document.getElementById("task-input");
taskForm.onsubmit = addTask;

// Get stored tasks and stored total from localStorage
const storedTotal = localStorage.getItem("total");
const storedList = JSON.parse(localStorage.getItem("tasks"));

// If both the task total and the task list are in localStorage,
// set the variables to their stored counterparts
if (storedTotal !== null && storedList !== null) {
    totalTasks = storedTotal;
    taskList = storedList;
}

loadList(taskList);