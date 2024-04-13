const xhttp = new XMLHttpRequest();

function update(){
    console.log("Updating the page !")
    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4){
            let data = JSON.parse(this.responseText);

            // console.log(data);

            let category_list = document.getElementById("CATEGORY_LIST");
            let todo_list = document.getElementById("TO_DO_LIST");
            let in_progress_list = document.getElementById("IN_PROGRESS_LIST");
            let finished_list = document.getElementById("FINISHED_LIST");
            let reminder_list = document.getElementById("REMINDER_LIST");
            
            // Update the categories
            while(category_list.firstChild){
                category_list.removeChild(category_list.firstChild);
            }
            for (const category of data.categories){
                createCategoryOnPage(category, category_list);
            }

            // Update the tasks
            while(todo_list.firstChild){
                todo_list.removeChild(todo_list.firstChild);
            }
            for (const task of data.tasks.to_do){
                createTaskOnPage(task,todo_list, data.categories, "to_do"); // data.categories is useful to set the color of the task
            }

            while(in_progress_list.firstChild){
                in_progress_list.removeChild(in_progress_list.firstChild);
            }
            for (const task of data.tasks.in_progress){
                createTaskOnPage(task,in_progress_list, data.categories, "in_progress")
            }

            while(finished_list.firstChild){
                finished_list.removeChild(finished_list.firstChild);
            }
            for (const task of data.tasks.finished){
                createTaskOnPage(task, finished_list, data.categories, "finished")
            }

            // Update the reminders
            while(reminder_list.firstChild){
                reminder_list.removeChild(reminder_list.firstChild);
            }
            for(const reminder of data.reminders){
                createReminderOnPage(reminder, reminder_list);
            }



        } else {
            console.log("Failed to load the data");
        }
        
    }



    xhttp.open("GET", "/update");
    xhttp.send();
}

function goToCategoryForm() {
    window.location.href = "../category_form";
}

function goToReminderForm() {
    window.location.href = "../reminder_form";
}

function goToTaskFormTODO() {
    window.location.href = "../task_form?group=to_do";
}

function goToTaskFormINPROGRESS() {
    window.location.href = "../task_form?group=in_progress";
}

function goToTaskFormFINISHED() {
    window.location.href = "../task_form?group=finished";
}

function createCategoryOnPage(category, group) {
    let newCategory = document.createElement("div");
    newCategory.classList.add("horizontal_div","category")
                
    let newCategoryText = document.createElement("p");
    newCategoryText.textContent = category.name;
    
    let newCategoryColor = document.createElement("div");
    newCategoryColor.className = "square";
    newCategoryColor.style.backgroundColor = category.color;

    let newCategoryModify = document.createElement("button");
    newCategoryModify.className = "modify";
    newCategoryModify.onclick = function () {
        modifyCategory(category.name);
    }

    let newCategoryDelete = document.createElement("button");
    newCategoryDelete.className = "delete";
    newCategoryDelete.onclick = function () {
        deleteCategory(category.name);
    }

    let newCategoryDisplay = document.createElement("input");
    newCategoryDisplay.type = "checkbox";
    newCategoryDisplay.className = "display";
    newCategoryDisplay.checked = category.checked;
    newCategory.addEventListener("change", function(event){
        const xhttp2 = new XMLHttpRequest();
        xhttp2.onreadystatechange = function() {
            setTimeout(update, 50);
        };
        xhttp2.open("POST", "../display_changed");
        xhttp2.setRequestHeader('Content-Type', 'application/json');
        const display = {name: category.name, checked: event.target.checked};
        xhttp2.send(JSON.stringify(display));

    });
    
    newCategory.appendChild(newCategoryText);
    newCategory.appendChild(newCategoryColor);
    newCategory.appendChild(newCategoryModify);
    newCategory.appendChild(newCategoryDelete);
    newCategory.appendChild(newCategoryDisplay);
    
    group.appendChild(newCategory);
}

function createTaskOnPage(task, group, categoryList, groupName) {
    // Test if the category is displayed
    if(!getCheckedByCategoryName(categoryList, task.category)) return;
    // Add the task if necessary
    let newTask = document.createElement("div");
    newTask.classList.add("vertical_div", "task");

    let newTaskText = document.createElement("p");
    newTaskText.textContent = task.description;

    let newTaskColorAndModify = document.createElement("div");
    newTaskColorAndModify.classList.add("horizontal_div","color_and_modify");

    let newTaskColor = document.createElement("div");
    newTaskColor.className = "square";
    let color = getColorByCategoryName(categoryList, task.category);
    newTaskColor.style.backgroundColor = color;

    let newTaskModify = document.createElement("button");
    newTaskModify.className = "modify";
    newTaskModify.onclick = function () {
        modifyTask(groupName, task.description);
    }

    let newTaskDelete = document.createElement("button");
    newTaskDelete.className = "delete";
    newTaskDelete.onclick = function () {
        deleteTask(groupName, task.description);
    }    

    newTaskColorAndModify.appendChild(newTaskColor);
    newTaskColorAndModify.appendChild(newTaskModify);
    newTaskColorAndModify.appendChild(newTaskDelete);

    newTask.appendChild(newTaskText);
    newTask.appendChild(newTaskColorAndModify);

    group.appendChild(newTask);
}

function createReminderOnPage(reminder, group) {
    let newReminder = document.createElement("div");
    newReminder.classList.add("horizontal_div", "reminder");

    let newReminderText = document.createElement("p");
    newReminderText.textContent = reminder.description;

    let newReminderModify = document.createElement("button");
    newReminderModify.className = "modify";
    newReminderModify.onclick = function () {
        modifyReminder(reminder.description);
    }

    let newReminderDelete = document.createElement("button");
    newReminderDelete.className = "delete";
    newReminderDelete.onclick = function () {
        deleteReminder(reminder.description);
    }  

    newReminder.appendChild(newReminderText);
    newReminder.appendChild(newReminderModify);
    newReminder.appendChild(newReminderDelete);

    group.appendChild(newReminder);
}

function getColorByCategoryName(categoryList, categoryName) {
    let i=0;
    while (categoryName != categoryList[i].name && i<categoryList.length){
        i++;
    }
    return categoryList[i].color;
}

function getCheckedByCategoryName(categoryList, categoryName){
    let i=0;
    while (categoryName != categoryList[i].name && i<categoryList.length){
        i++;
    }
    return categoryList[i].checked;
}

function modifyCategory(category) {
    window.location.href = "../category_modify?category="+category;
}

function deleteCategory(category) {
    console.log(category);
    const confirmation = confirm("Are you sure you want to delete the category : "+category, "Yes, delete it", "No");
    if (confirmation){
        xhttp.onreadystatechange = function () {
            if (this.status == 200 && this.readyState == 4){
                update();
            }
        }
        xhttp.open("GET", "../delete_category?category="+category);
        xhttp.send();
    } 
}

function modifyTask(group, task) {
    console.log(group, task);
    window.location.href = "../task_modify?group="+group+"&task="+task;
}

function deleteTask(group, task) {
    console.log(group, task);
    const confirmation = confirm("Are you sure you want to delete the task : "+task, "Yes, delete it", "No");
    if (confirmation){
        xhttp.onreadystatechange = function () {
            if (this.status == 200 && this.readyState == 4){
                update();
            }
        }
        xhttp.open("GET", "../delete_task?group="+group+"&task="+task);
        xhttp.send();
    }    
}

function modifyReminder(reminder){
    window.location.href = "../reminder_modify?reminder="+reminder;  
}

function deleteReminder(reminder){
    const confirmation = confirm("Are you sure you want to delete the reminder : "+reminder, "Yes, delete it", "No");
    if (confirmation){
        xhttp.onreadystatechange = function () {
            if (this.status == 200 && this.readyState == 4){
                update();
            }
        }
        xhttp.open("GET", "../delete_reminder?reminder="+reminder);
        xhttp.send();
    } 
}

update();