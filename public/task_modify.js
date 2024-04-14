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

function displayCurrentTask () {

    console.log("Fetching current Task");

    xhttp.onreadystatechange = function () {
        if (this.status == 200 && this.readyState == 4) {
            let task = JSON.parse(this.responseText);

            let taskDescription = document.getElementById("description");

            taskDescription.value = task.description;
            for(radioButton of document.querySelectorAll('input[type="radio"][name="categories"]')){
                if (categories[parseInt(radioButton.id)].name == task.category) radioButton.checked = true;
            }

        }
    }

    xhttp.open("GET", "../currentTask");
    xhttp.send();
    
}

function validateModification() {
    let taskDescription = document.getElementById("description").value;
    let selectedRadioButtonId = document.querySelector('input[name="categories"]:checked').id ;

    const newTask = {
        description: taskDescription,
        category: categories[parseInt(selectedRadioButtonId)].name
    };

    console.log(newTask);

    const xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {

    }
    
    xhttp.open("POST", "../modify_task");
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(newTask));

    window.location.href = "../";
}

displayCategories();
setTimeout(displayCurrentTask,100);