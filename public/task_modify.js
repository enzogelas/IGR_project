const xhttp = new XMLHttpRequest();

function cancel() {
    
    window.location.href = "../";

}

function displayCurrentTask () {

    console.log("Fetching current Task");

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            let task = JSON.parse(this.responseText);

            let taskDescription = document.getElementById("description");
            let taskCategory = document.getElementById("category");

            taskDescription.value = task.description;
            taskCategory.value = task.category;
        }
    }

    xhttp.open("GET", "../currentTask");
    xhttp.send();
    
}

function validateModification() {
    let taskDescription = document.getElementById("description").value;
    let taskCategory = document.getElementById("category").value;

    const newTask = {
        description: taskDescription,
        category: taskCategory
    };

    console.log(newTask);

    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

    }
    
    xhttp.open("POST", "../modify_task");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(newTask));

    window.location.href = "../../";
}

displayCurrentTask();