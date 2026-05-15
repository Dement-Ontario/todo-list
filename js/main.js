// ---------- Initial Variables ---------- //

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



// ---------- Functions ---------- //

/*
    Function: saveList
    Parameters: None
    Description:
        Saves both the current taskList array and the total amount of
        tasks created to localStorage. The total tasks variable keeps task IDs unique
        so it doesn't cause any problems with ID-related HTML tags.
        
        This function is called when adding, removing, and marking tasks/subtasks complete.
*/
function saveList() {
    const taskListString = JSON.stringify(taskList);
    localStorage.setItem("total", totalTasks);
    localStorage.setItem("tasks", taskListString);
}

/*
    Function: loadList
    Parameters:
        - The current taskList array
    Description:
        Collects each task object's ID from the taskList array and calls the first
        displayTask in order to load the whole list.

        This function is called on page load.
*/
function loadList(taskList) {
    // Store every task's ID in storedTasks and run displayTask with the list
    const storedTasks = [];
    taskList.forEach(element => {
        storedTasks.push(element.id);
    });
    
    // Call first displayTask
    displayTask(storedTasks);
}

/*
    Function: displayTask
    Parameters:
        - An array of task IDs
    Description:
        Creates an element on the DOM for a task and its subtasks, if any.
        
        If the argument is an array and is not empty, this function:
            - removes the first ID from the given array,
            - finds the task the ID is connected to in the taskList,
            - adds the necessary HTML elements along with their
                functions to the DOM's main element,
            - runs displaySubtask for every subtask in the
                task object if any exist, and
            - recursively calls itself with the array it removed the ID from.
        This will continue running until the array is empty,
        in which case it will do nothing.

        This function is called when loading from the initial taskList array,
        in itself to continue recursion, and when adding a new task.
*/
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
            taskButton.ariaLabel = "Complete";
            taskButton.textContent = "X";
        } else {taskButton.ariaLabel = "Incomplete";}
        taskButton.addEventListener("click", () => markComplete(currentTask, taskDue));
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

/*
    Function: displaySubtask
    Parameters:
        - The subtask's parent task
        - The DOM element that holds the subtask
        - The current subtask
    Description:
        Creates an element inside a task in the DOM for a subtask.

        This function is called when displaying the initial task list
        to the DOM (if any subtasks exist) and when adding a new subtask.
*/
function displaySubtask(currentTask, subtaskHolder, currentSubtask) {
    // Add subtask div
    const subtaskDiv = document.createElement("div");
    subtaskDiv.className = "subtask";
    subtaskHolder.appendChild(subtaskDiv);

    // Add subtask complete check button, writing an X if complete
    const subtaskButton = document.createElement("button");
    subtaskButton.className = "subtask-button";
    if (currentSubtask.complete) {
        subtaskButton.ariaLabel = "Complete";
        subtaskButton.textContent = "X";
    } else {subtaskButton.ariaLabel = "Incomplete";}
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

/*
    Function: markComplete
    Parameters:
        - The task to mark complete/incomplete
        - The DOM element for the task's due date
            (undefined for subtasks as they have no due date element)
    Description:
        Changes a sub/task object's "complete" property from true to false
        and vice versa, reflects the change on the button the function
        was called by, and saves the change to localStorage.
        This function also adds and removes the class that
        recolors the DOM element for late due dates if the element exists.

        This function is called exclusively with an event listener for every
        completion button on every task and subtask.
*/
function markComplete(task, date) {
    // If the task is incomplete, mark as complete
    // If the task is complete, mark as incomplete
    if (!task.complete) {
        event.target.innerHTML = "X";
        event.target.ariaLabel = "Complete";
        task.complete = true;

        // Remove the late-date class from the due date element if it exists and is marked late
        if (date && date.classList.contains("late-date")) {
            date.classList.remove("late-date");
        }
    } else {
        event.target.innerHTML = "";
        event.target.ariaLabel = "Incomplete";
        task.complete = false;

        // Add the late-date class to the due date element if it exists and is not marked late
        if (date && dayjs(date.textContent).isBefore(now)) {
            date.classList.add("late-date");
        }
    }
    
    // Save changes to localStorage
    saveList();
}

/*
    Function: deleteTask
    Parameters:
        - The task to delete from the taskList/subtasks array
        - The DOM element the task/subtask is shown in
        - The list of sub/task objects, whether the
            taskList array itself or a task's subtasks array
    Description:
        Deletes a sub/task from both its list and the DOM.
        This function:
            - hides the delete button from the DOM and
                creates an element asking for confirmation,
            - if "Yes" is clicked:
                - deletes the sub/task object from its array,
                - deletes the task's DOM element, and
                - saves the new taskList array to localStorage, and
            - if "No" is clicked:
                - deletes the confirmation element and
                - unhides the delete button from the DOM

        This function is called exclusively with an event listener for every
        delete button on every task and subtask.
*/
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

/*
    Function: addTask
    Parameters: None
    Description:
        Adds a task object to the taskList array and calls displayTask
        to show the task on the DOM.
        This function:
            - adds 1 to the total amount of tasks (for use in task IDs),
            - takes the input task description and due date values from the form,
            - creates a new task object,
            - pushes the task object to the taskList array,
            - calls displayTask to add a DOM element for the task, and
            - saves the updated taskList array and total tasks to localStorage.
        
        This function is called exclusively with an event handler when
        submitting the task form.
*/
function addTask() {
    // Keep the form from reloading the page and increase total tasks by 1
    event.preventDefault();
    totalTasks++;

    // Grab what was put on the form as a variable
    const taskDesc = event.target["task-text"].value;
    const taskDue = event.target["task-date"].value;

    // If the task description or due date are empty, call them silly and stop the function
    if (taskDesc === "" || taskDue === "") {
        alert("You're silly. Please enter a task description and due date.");
        return;
    }

    // Make a new task object with what was on the form
    const newTask = {id: totalTasks, desc: taskDesc, due: taskDue, complete: false, subtasks: []};

    // Push the new task into the taskList array and add the task to the display
    taskList.push(newTask);
    displayTask([newTask.id]);

    // Reset the form and save changes to localStorage
    taskForm.reset();
    saveList();
}

/*
    Function: addSubtask
    Parameters:
        - The task that the subtask belongs to
        - The subtask form element
        - The DOM element that holds the subtasks
    Description:
        Pushes a subtask object to the parent task's subtasks array
        and displays the new subtask under the task on the DOM.
        This function:
            - takes the input subtask description from the form,
            - creates a new subtask object,
            - pushes the subtask into the task's subtask array,
            - calls displaySubtask to add the subtask to the DOM, and
            - saves the updated taskList array to localStorage.
        
        This function is called exclusively with an event handler when
        submitting each task element's subtask form.
*/
function addSubtask(task, form, subtaskHolder) {
    // Grab the task description from the form and put it in a new subtask object
    const subtaskDesc = event.target["subtask-text"].value;

    // If the subtask description is empty, call them silly and stop the function
    if (subtaskDesc === "") {
        alert("You're silly. Please enter a subtask description.");
        return;
    }

    const newSubtask = {desc: subtaskDesc, complete: false};

    // Push the new subtask into the subtasks array
    task.subtasks.push(newSubtask);
    
    // Create a new subtask for the display
    displaySubtask(task, subtaskHolder, newSubtask);

    // Reset the form and save changes to localStorage
    form.reset();
    saveList();
}



// ---------- Initialization ---------- //

// Insert event into task submit button
const taskForm = document.getElementById("task-input");
taskForm.onsubmit = addTask;

// Get stored tasks and stored total from localStorage
const storedTotal = localStorage.getItem("total");
const storedList = JSON.parse(localStorage.getItem("tasks"));

// If both the task total and the taskList array are in localStorage,
// set the variables to their stored counterparts
if (storedTotal !== null && storedList !== null) {
    totalTasks = storedTotal;
    taskList = storedList;
}

// Load the task list to DOM on page load
loadList(taskList);