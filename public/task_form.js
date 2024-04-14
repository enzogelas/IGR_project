const xhttp = new XMLHttpRequest();

let categories;

function cancel() {
    
    window.location.href = "../";

}

function displayCategories () {

    console.log("Fetching categories");

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            categories = JSON.parse(this.responseText);

            let categoriesToFill = document.getElementById("categories");

            let i = 0;
            for (category of categories){
                let newCategory = document.createElement("li");

                let newcategoryName = document.createElement("span");
                newcategoryName.textContent = category.name;

                let newCategoryRadioButton = document.createElement("input");
                newCategoryRadioButton.name = "categories";
                newCategoryRadioButton.type = "radio";
                newCategoryRadioButton.id = i.toString();

                newCategory.appendChild(newcategoryName);
                newCategory.appendChild(newCategoryRadioButton);

                categoriesToFill.appendChild(newCategory);

                i++;
            }
        }
    }

    xhttp.open("GET", "../categories");
    xhttp.send();
    
}

function addNewTask() {
    let taskDescription = document.getElementById("description").value;
    let selectedRadioButtonId = document.querySelector('input[name="categories"]:checked').id ;

    const newTask = {
        description: taskDescription,
        category: categories[parseInt(selectedRadioButtonId)].name
    };

    console.log(newTask);

    xhttp.onreadystatechange = function () {

    }
    
    xhttp.open("POST", "../add_task");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(newTask));

    window.location.href = "../";
}

displayCategories();