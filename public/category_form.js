function cancel() {
    
    window.location.href = "../";

}

function addNewCategory() {
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
    
    xhttp.open("POST", "../add_category");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(newCategory));

    window.location.href = "../";
}