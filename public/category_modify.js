const xhttp = new XMLHttpRequest();

function cancel() {
    
    window.location.href = "../";

}

function displayCurrentCategory () {

    console.log("Fetching current category");

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            let category = JSON.parse(this.responseText);

            let categoryName = document.getElementById("name");
            let categoryColor = document.getElementById("color");

            categoryName.value = category.name;
            categoryColor.value = category.color;
        }
    }

    xhttp.open("GET", "../currentCategory");
    xhttp.send();
    
}

function validateModification() {
    let categoryName = document.getElementById("name").value;
    let categoryColor = document.getElementById("color").value;

    const newCategory = {
        name: categoryName,
        color: categoryColor
    };

    console.log(newCategory);

    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

    }
    
    xhttp.open("POST", "../modify_category");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(newCategory));

    window.location.href = "../";
}

displayCurrentCategory();