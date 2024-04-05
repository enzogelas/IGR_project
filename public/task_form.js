function cancel() {
    
    window.location.href = "../../";

}

function addNewTask() {
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
    
    xhttp.open("POST", "../add_task");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(newTask));

    window.location.href = "../../";
}