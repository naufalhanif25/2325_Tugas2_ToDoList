// Get the submit button element
const submitButton = document.getElementById("submit-todo");

// Initialize an empty array to store todos
let todos = [];
let index = 0;
let important = 0;

document.addEventListener("keydown", function (event) {
    if (event.key === "/" && !event.target.matches("input, textarea")) {
        event.preventDefault(); 
        document.getElementById("input-todo").focus();
    }
});

// Adjusts the padding of the container to accommodate the scrollbar
function adjustPadding() {
    const container = document.getElementById("container-todos");
    const hasScrollbar = container.scrollHeight > container.clientHeight;

    if (hasScrollbar) {
        container.style.paddingRight = "0.8em";
    } 
    else {
        container.style.paddingRight = "0em";
    }
}

// Handles the submission of a new to-do task
const onSubmit = () => {
    const input = document.getElementById("input-todo");
    const containerTodos = document.getElementById("container-todos");

    // Check if input is empty, display placeholder message, and return
    if (input.value.trim() === "") {
        input.value = "";
        input.setAttribute("placeholder", "No task entered");
        input.addEventListener("click", () => {
            input.setAttribute("placeholder", 'Type "/" to enter task');
        });

        setTimeout(() => {
            input.setAttribute("placeholder", 'Type "/" to enter task');
        }, 2000);

        return;
    }

    // Add task to the array
    todos.push(input.value);

    // Create a new todo element
    const todoElement = document.createElement("div");

    // Get current date and time
    const curTime = new Date();
    const curDate = curTime.toLocaleString("en-EN", { 
        month: "short",
        day: "2-digit"
    });
    const curHourMin = curTime.toLocaleString("en-EN", { 
        hour: "2-digit",
        minute: "2-digit"
    });

    todoElement.classList.add("todo");
    todoElement.setAttribute("data-id", index);

    // Set the inner HTML of the new todo element
    todoElement.innerHTML = `
        <div class="todo-content">
            <h1><strong>${curDate},</strong><br> ${curHourMin}</h1>
            <p class="todo-text">${input.value}</p>
            <button id="edit-todo" class="edit-todo">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
                    <path d="M16 20h8"/>
                    <path d="M16 4l4 4L8 20H4v-4L16 4z"/>
                    <path d="M12 8l4 4"/>
                </svg>
            </button>
            <button id="delete-todo" class="delete-todo">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path d="M5 7h14m-9 3v8m4-8v8M10 3h4a1 1 0 0 1 1 1v3H9V4a1 1 0 0 1 1-1ZM6 7h12v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V7Z"/>
                </svg>
            </button>
            <button id="important" class="important">
                <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <path d="M11.083 5.104c.35-.8 1.485-.8 1.834 0l1.752 4.022a1 1 0 0 0 .84.597l4.463.342c.9.069 1.255 1.2.556 1.771l-3.33 2.723a1 1 0 0 0-.337 1.016l1.03 4.119c.214.858-.71 1.552-1.474 1.106l-3.913-2.281a1 1 0 0 0-1.008 0L7.583 20.8c-.764.446-1.688-.248-1.474-1.106l1.03-4.119A1 1 0 0 0 6.8 14.56l-3.33-2.723c-.698-.571-.342-1.702.557-1.771l4.462-.342a1 1 0 0 0 .84-.597l1.753-4.022Z"/>
                </svg>
            </button>
        </div>
    `;

    // Append the new todo element to the container
    containerTodos.appendChild(todoElement);

    // Increment the index for the next task
    index += 1;
    input.value = "";

    updateCount();

    // Adjust padding after adding a new task
    adjustPadding();
};

// Update the container and task count
function updateCount() {
    const todosCtr = document.getElementById("container-todos");
    const todoCount = document.getElementById("todo-count");
    const importantCount = document.getElementById("important-count");
    const taskCountCtr = document.getElementById("task-count-ctr");
    const importantTask = document.getElementById("important-task");

    if (index === 0) {
        todosCtr.style.display = "none";
        taskCountCtr.style.opacity = "0";
        importantTask.style.opacity = "0";
    }
    else {
        todosCtr.style.display = "flex";
        taskCountCtr.style.opacity = "1";
        importantTask.style.opacity = "1"
    }

    todoCount.innerText = `Task: ${index}`;
    importantCount.innerText = `Important: ${important}`;
}

// Event listener for clicking on the task container
document.getElementById("container-todos").addEventListener("click", function (event) {
    // Delete task if the delete button is clicked
    if (event.target.classList.contains(".delete-todo")) {
        event.target.closest(".todo").remove();

        adjustPadding();
    }

    // Start editing mode if the edit button is clicked
    if (event.target.closest("#edit-todo")) {
        const todoElement = event.target.closest(".todo-content");
        const taskText = todoElement.querySelector(".todo-text");

        startEditing(taskText);
    }

    // Mark task as important
    if (event.target.closest("#important")) {
        importantTodo(event);
    }
});

// Enables inline editing when the user double-clicks on a task
function editTodo(event) {
    if (event.target.classList.contains("todo-text")) {
        const taskText = event.target;
        const oldValue = taskText.innerText;
        const input = document.createElement("input");

        input.type = "text";
        input.value = oldValue;
        input.classList.add("edit-input");

        taskText.replaceWith(input);
        input.focus();

        // Save task when pressing Enter
        input.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                saveTaskEdit(input, taskText);
            }
        });

        // Save task when input loses focus
        input.addEventListener("blur", () => {
            saveTaskEdit(input, taskText);
        });
    }
}

// Replaces task text with an input field for editing
function startEditing(taskText) {
    const oldValue = taskText.innerText;
    const input = document.createElement("input");

    input.type = "text";
    input.value = oldValue;
    input.classList.add("edit-input");

    taskText.replaceWith(input);
    input.focus();

    // Save the edited task when pressing Enter
    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            saveTaskEdit(input, taskText);
        }
    });

    // Save the edited task when losing focus
    input.addEventListener("blur", () => {
        saveTaskEdit(input, taskText);
    });
}

// Mark tasks as important by using a different color
function importantTodo(event) {
    const todo = event.target.closest(".todo");
    const starIcon = todo.querySelector(".important svg path");
    
    if (!starIcon || !todo) {
        return;
    }

    // Toggle class 'important-todo' to determine the status
    const isNowImportant = todo.classList.toggle("important-todo");

    if (isNowImportant) {
        starIcon.setAttribute("fill", "white");
        important += 1;
    } else {
        starIcon.setAttribute("fill", "transparent");
        important -= 1;
    }

    updateCount();
}

// Event listener for double-clicking on a task to enable editing
document.getElementById("container-todos").addEventListener("dblclick", editTodo);

// Saves the edited task text and replaces the input field with plain text
function saveTaskEdit(input, taskText) {
    let newValue = input.value.trim();

    // If input is empty, revert to the original value
    if (newValue === "") {
        newValue = taskText.innerText;
    }

    taskText.innerText = newValue;
    input.replaceWith(taskText);
}

// Event listener for pressing Enter in the input field to submit a new task
document.getElementById("input-todo").addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        onSubmit();
    }
});

// Event listeners for clicking the submit button to add a new task
submitButton.addEventListener("click", onSubmit);
submitButton.addEventListener("enter", onSubmit);

// Event listener for clicking the delete button to remove a task
document.getElementById("container-todos").addEventListener("click", function (event) {
    if (event.target.closest(".delete-todo")) {
        const todo = event.target.closest(".todo");
        
        if (!todo) {
            return;
        }
        
        const starIcon = todo.querySelector(".important svg path");

        // If the star has a white fill, reduce the amount of important
        if (starIcon && starIcon.getAttribute("fill") === "white") {
            important -= 1;
        }

        todo.remove();
        index -= 1;

        updateCount();
        adjustPadding();
    }
});
