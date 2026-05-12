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

// Total task number to keep task IDs unique
let totalTasks = 2;

// Array of task objects
let taskList = [
    {id: 1, desc: "Do something smart", due:"1987-12-12", complete: false},
    {id: 2, desc: "Do something stupid", due:"1999-04-26", complete: true,
        subtasks: [
            {id: 1, desc: "Jump off a bridge or something", complete: true},
            {id: 2, desc: "Do a flip", complete: false}
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

function displayTask(tasks, isSubtask = false) {
    // Check if the tasks argument is both an array and not empty
    if (Array.isArray(tasks) && tasks.length > 0) {
        // Shift the first element from the tasks list and return as currentId
        const currentId = tasks.shift();
        
        if (!isSubtask) {
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

            // Make new due date
            const taskDue = document.createElement("p");
            taskDue.className = "task-due";
            taskDue.textContent = currentTask.due;
            taskMisc.appendChild(taskDue);

            // Make new delete button
            const taskDelete = document.createElement("button");
            taskDelete.className = "task-delete";
            taskDelete.textContent = "Delete Task";
            taskDelete.addEventListener("click", () => deleteTask(currentTask, taskSection));
            taskMisc.appendChild(taskDelete);

            // TODO: Make subtask form

            if ("subtasks" in currentTask){
                // TODO: Make subtask holder, call displayTask for subtasks
                console.log(currentTask.subtasks);
            }
        } else {
            // TODO: Make subtask display calls

            console.log("This is a subtask.");
        }

        // Recurse until array is empty
        displayTask(tasks, isSubtask);
    }
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

function deleteTask(task, eventParent) {
    // Remove task from list
    const taskIndex = taskList.indexOf(task);
    if (taskIndex !== -1) {
        taskList.splice(taskIndex, 1);
    }
    
    // Remove task from display
    eventParent.remove();
    
    // Save changes to localStorage
    saveList();
}

function addTask() {
    // Keep the form from reloading the page and increase total tasks by 1
    event.preventDefault();
    totalTasks++;

    // Grab what was put on the form as a variable and put it in a new form object
    const taskDesc = event.target["task-text"].value;
    const taskDue = event.target["task-date"].value;
    const newTask = {id: totalTasks, desc: taskDesc, due: taskDue, complete: false};

    // Push the new task into the task list and add the task to the display
    taskList.push(newTask);
    displayTask([newTask.id]);

    // Save changes to localStorage
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