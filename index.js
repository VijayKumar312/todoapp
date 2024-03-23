let todoItemsContainer = document.getElementById("todoItemsContainer");
let addButton = document.getElementById("addButton");
let saveButton = document.getElementById("saveButton");
let userInput = document.getElementById("userInput");
let warningElement = document.getElementById("warning");
let removeAllButton = document.getElementById("removeAllButton");

let todoList = []

function getSavedTodoItemsFromLocal() {
    try {
        let savedTodos = JSON.parse(localStorage.getItem("todoList"));
        if (Array.isArray(savedTodos)) {
            todoList = savedTodos;
        } else {
            todoList = [];
        }
    } catch (error) {
        console.error("Error parsing todoList from localStorage:", error.message);
    }
}
getSavedTodoItemsFromLocal();

function onTodoStatusChange(labelId, todoId) {
    let labelElement = document.getElementById(`label-${labelId}`);
    labelElement.classList.toggle("checked");

    let todoObjectIndex = todoList.findIndex((eachItem) => (eachItem.uniqueNo === todoId));

    let todoItem = todoList[todoObjectIndex];
    if (todoItem.isChecked === false) {
        todoList[todoObjectIndex].isChecked = true;
    } else {
        todoList[todoObjectIndex].isChecked = false;
    }
}

function onTodoDeleteItems(todoId) {
    let listElement = document.getElementById(todoId);
    todoItemsContainer.removeChild(listElement);

    let itemIndex = todoList.findIndex(function(eachItem) {
        if (eachItem.text === listElement.textContent) {
            return true;
        } else {
            return false;
        }
    })

    todoList.splice(itemIndex, 1);

}

function createAndAppendTodoItem(todoItem) {
    let todoId = todoItem.uniqueNo;
    let labelId = todoItem.uniqueNo;
    let checkboxId = todoItem.uniqueNo;

    let todoItemContainer = document.createElement("li");
    todoItemContainer.classList.add("todo-item-container", "d-flex", "flex-row");
    todoItemContainer.id = todoId;
    todoItemsContainer.appendChild(todoItemContainer);

    let checkboxElement = document.createElement("input");
    checkboxElement.type = "checkbox";
    checkboxElement.classList.add("checkbox");
    checkboxElement.setAttribute("id", checkboxId);
    checkboxElement.checked = todoItem.isChecked;
    if (todoItem.isChecked === true) {
        checkboxElement.classList.add("checked");
    }
    todoItemContainer.appendChild(checkboxElement);
    checkboxElement.onclick = function() {
        onTodoStatusChange(labelId, todoId);
    }

    let labelContainer = document.createElement("div");
    labelContainer.classList.add("label-container", "d-flex", "flex-row");
    todoItemContainer.appendChild(labelContainer);

    let labelValue = document.createElement("label");
    labelValue.classList.add("label-element");
    labelValue.setAttribute("id", `label-${labelId}`);
    labelValue.setAttribute("for", checkboxId);
    labelValue.textContent = todoItem.text;
    if (todoItem.isChecked) {
        labelValue.classList.add("checked");
    }
    labelContainer.appendChild(labelValue);

    let deleteIconContainer = document.createElement("div");
    deleteIconContainer.classList.add("delete-icon-container");
    labelContainer.appendChild(deleteIconContainer);

    let deleteIcon = document.createElement("i");
    deleteIcon.classList.add("far", "fa-trash-alt", "delete-icon");
    deleteIconContainer.appendChild(deleteIcon);

    deleteIcon.onclick = function() {
        onTodoDeleteItems(todoId);
    }
}

function onAddTodoItem(userInput) {
    let userEnteredText = userInput.value;
    userInput.value = "";

    if (userEnteredText === "") {
        alert("Enter valid text");
        warningElement.textContent = "";
        return;
    } else {
        let isPresent = todoList.find(todoList => todoList.text === userEnteredText);
        if (isPresent === undefined) {
            let uniqueId = userEnteredText;
            let newTodo = {
                text: userEnteredText,
                uniqueNo: uniqueId,
                isChecked: false
            };
            todoList.push(newTodo);
            warningElement.textContent = "";
            createAndAppendTodoItem(newTodo);
        } else {
            warningElement.textContent = "You have already added this task";
        }
    }
}

saveButton.onclick = function() {
    let stringifiedItems = JSON.stringify(todoList);
    localStorage.setItem("todoList", stringifiedItems);
    alert("You've saved successfully")
}

addButton.onclick = function() {
    onAddTodoItem(userInput);
}

removeAllButton.onclick = function() {
    localStorage.clear("todoList");

    if (todoList.length > 1) {
        for (let eachTodo of todoList) {
            let itemContainer = document.getElementById(eachTodo.uniqueId);
            todoItemsContainer.removeChild(itemContainer);
        }
    }

}

userInput.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        addButton.click();
    }
})
if (todoList.length > 0) {
    for (let todo of todoList) {
        createAndAppendTodoItem(todo);
    }
}