// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  //using the ++ operator to increment the nextId
  //nextId is the retrieved from localStorage, and then it's returned
    return nextId++;
  }

// Todo: create a function to create a task card
function createTaskCard(task) {
  //destructuring the task object to get its properties and assign them to variables for easier access and manipulation
    const { id, title, description, deadline, status } = task;
    // creating a new card element with the given data and adding the necessary classes and event listeners to handle delete functionality
    const taskCard = $(`
      <div class="card task-card mb-3" data-id="${id}" data-status="${status}">
        <div class="card-body">
          <h5 class="card-title">${title}</h5>
          <p class="card-text">${description}</p>
          <p class="card-text"><strong>Deadline:</strong> ${dayjs(deadline).format('MM-DD-YYYY')}</p>
          <button class="btn btn-danger btn-sm delete-btn"><i class="fas fa-trash"></i></button>
        </div>
      </div>
    `);

    // function for color rendering
    // checks if the task is due today or overdue and applies the necessary styles to the card body
    if (task.deadline && task.status !== 'done') {
      // if the condition is true, create a dayjs object with now representing the current date and time
    const now = dayjs();
    // converting the deadline string to a dayjs object and comparing it with the current date to determine if the task is due today or overdue
    const taskDueDate = dayjs(task.deadline, 'MM-DD-YYYY');
    // if the task is due today, add the 'bg-warning' and 'text-white' classes to the card body
    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
      // if the condition is true, add the 'border-light' class to the delete button to make it visually appealing
    } else if (now.isAfter(taskDueDate)) {
      taskCard.find('.card-body').addClass('bg-danger text-white');
      taskCard.find('.delete-btn').addClass('border-light');
    }
  }
    return taskCard;
    
  }


// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // clear the existing task cards from the lanes before rendering the new ones
    $("#todo-cards").empty();
    $("#in-progress-cards").empty();
    $("#done-cards").empty();
  
    // loop through the tasks array and create task cards for each status
    taskList.forEach(task => {
      // create a task card for the current task and append it to the corresponding lane in the DOM
      const taskCard = createTaskCard(task);
      $(`#${task.status}-cards`).append(taskCard);
    });
  //? Use JQuery UI to make task cards draggable
    $(".task-card").draggable({
      revert: "invalid",
      cursor: "move",
      helper: "clone"
    });
  }

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  // prevent the form from submitting and resetting the input fields
    event.preventDefault();
  
    // get the input values and trim any leading or trailing whitespace
    const title = $("#title").val().trim();
    const description = $("#description").val().trim();
    const deadline = $("#deadline").val();
    const status = "todo";
  
    // check if all required fields are filled out and not empty
    if (title && description && deadline) {
      const newTask = {
        id: generateTaskId(),
        title,
        description,
        deadline,
        status
      };
  
      // add the new task to the tasks array and save it to localStorage
      taskList.push(newTask);
      localStorage.setItem("tasks", JSON.stringify(taskList));
      localStorage.setItem("nextId", nextId);
      
      // clear the form inputs and hide the modal
      $("#formModal").modal("hide");
      $("#title").val("");
      $("#description").val("");
      $("#deadline").val("");
  
      renderTaskList();
    }
  }

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  // find the closest parent element with the class "task-card" and get its id
  //It then retrieves the "id" data attribute from that element using jQuery's data() method.
  //The retrieved id is stored in the taskId constant.
    const taskId = $(this).closest(".task-card").data("id");
    // use filter() to create a new array that excludes the task with the matching id from the original taskList array
    taskList = taskList.filter(task => task.id !== taskId);
    // save the updated taskList array to localStorage with the updated taskList array
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }



// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  // retrive the ID of the dragges task car
  //ui.draggable.data("id") is used to get the id of the task card being dragged.
    const taskId = ui.draggable.data("id");
    // get the ID of the drop target.
    //$(this) refers to the drop target.attr("id") is used to get the id of the drop target lane.
    const newStatus = $(this).attr("id");
  
    // find the task in the taskList array with the matching id and update its status to the new status
    const taskIndex = taskList.findIndex(task => task.id === taskId);
    // update the status of the task in the taskList array to the new status
    taskList[taskIndex].status = newStatus;
  
    // save the updated taskList array to localStorage (overwriting the previous one) and render the new task data to the screen.
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
  }

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();
  
    $("#formModal").on("shown.bs.modal", function () {
      $("#title").focus();
    });
  
    $("#addTaskForm").on("submit", handleAddTask);
  
    $(document).on("click", ".delete-btn", handleDeleteTask);
  
    $(".lane").droppable({
      accept: ".task-card",
      drop: handleDrop
    });
  
    $("#deadline").datepicker({
      dateFormat: "yy-mm-dd"
    });
  });