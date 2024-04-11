const xhttp = new XMLHttpRequest();

function cancel() {
    
    window.location.href = "../";

}

function displayCurrentReminder() {

    xhttp.onreadystatechange = function () {
        console.log("Fetching reminder ...");
        if (this.status == 200 && this.readyState == 4) {
            let reminder = JSON.parse(this.responseText);

            let reminderDescription = document.getElementById("description");

            reminderDescription.value = reminder.description;
        }
    }

    xhttp.open("GET", "../currentReminder");
    xhttp.send();
    
}

function validateModification() {
    let reminderDescription = document.getElementById("description").value;

    const newReminder = {
        description: reminderDescription,
    };

    console.log(newReminder);

    xhttp.onreadystatechange = function () {
        window.location.href = "../../";
    }
    
    xhttp.open("POST", "../modify_reminder");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(newReminder));
    
}

displayCurrentReminder();