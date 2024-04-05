function cancel() {
    
    window.location.href = "../";

}

function addNewReminder() {
    let reminderDescription = document.getElementById("description").value;

    const newReminder = {
        description: reminderDescription
    };

    console.log(newReminder);

    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

    }
    
    xhttp.open("POST", "../add_reminder");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(newReminder));

    window.location.href = "../";
}