const xhttp = new XMLHttpRequest();

function cancel() {
    
    window.location.href = "../../";

}

function displayCurrentTask () {

    console.log("Fetching current Task");

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            let task = JSON.parse(this.responseText);
            console.log(task);

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
    // TODO TODO TODO TODO TODO TODO
    // TODO TODO TODO TODO TODO TODO
    // TODO TODO TODO TODO TODO TODO
    // TODO TODO TODO TODO TODO TODO
    // TODO TODO TODO TODO TODO TODO
    // TODO TODO TODO TODO TODO TODO
    // TODO TODO TODO TODO TODO TODO
    // TODO TODO TODO TODO TODO TODO
    // TODO TODO TODO TODO TODO TODO
    // TODO TODO TODO TODO TODO TODO
}

displayCurrentTask();