const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

let currentGroup = "to_do";
let currentTask = "l";
let currentReminder = "";
let currentCategory = "";

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'todo.html'));
});

app.get("/update", (req,res) => {
    fs.readFile("db.json", "utf8", (err,data) => {
        if (err) {
            console.error("Error while reading database");
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(data);
        }
    })
});

app.get("/category_form", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'category_form.html'));
});

app.post("/add_category", (req,res) => {
    let newCategory = req.body;
    addCategory(newCategory); 
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Category added successfully !!");   
});

function addCategory(newCategory) {
    fs.readFile("db.json", 'utf8', (err,data) => {
        if(err){
            console.error("Error reading the storage ...");
        } else {

            let dataToChange = JSON.parse(data);
            dataToChange.categories.push(newCategory);            
            const updatedData = JSON.stringify(dataToChange, null, 2);

            fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                if (err){
                    console.error("Failed to add a category ...");
                    
                } else {
                    console.log("Category added successfully");
                }
            });
        }
    });
}

app.get("/category_modify", (req,res) => {
    currentCategory = req.query.category;
    console.log("Current category :",currentCategory);
    res.sendFile(path.join(__dirname, 'public', 'category_modify.html'))
})

app.post("/modify_category", (req,res) => {
    let newCategory = req.body;
    modifyCategory(currentCategory, newCategory);   
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Category modified successfully !!");   
});

function modifyCategory(formerCategoryName, newCategory){
    
    fs.readFile("db.json", 'utf8', (err,data) => {
        if(err){
            console.error("Error reading the storage ...");
        } else {

            let dataToChange = JSON.parse(data);

            let indexToRemove = 0;
            console.log(dataToChange.categories[indexToRemove]);

            while(dataToChange.categories[indexToRemove].name != formerCategoryName){
                indexToRemove++;
            }
            
            dataToChange.categories[indexToRemove] = newCategory;   
            
            for (group of ["to_do","in_progress","finished"]){
                for (task of dataToChange.tasks[group]){
                    if (task.category == formerCategoryName){
                        task.category = newCategory.name;
                    }
                }
            }
            
            const updatedData = JSON.stringify(dataToChange, null, 2);

            fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                if (err){
                    console.error("Failed to modify the reminder ...");
                    
                } else {
                    console.log("Reminder replaced successfully");
                }
            });
        }
    });
}

app.get("/delete_category", (req,res) => {
    currentCategory = req.query.category;
    deleteCategory(currentCategory);
    res.sendFile(path.join(__dirname, 'public', 'todo.html'));
});

function deleteCategory(categoryName) {
    fs.readFile("db.json", 'utf8', (err,data) => {
        if(err){
            console.error("Error reading the storage ...");
        } else {

            let dataToChange = JSON.parse(data);

            console.log("I want to delete :", categoryName);

            let canDelete = true;
            for (group of ["to_do","in_progress","finished"]){
                for (task of dataToChange.tasks[group]){
                    if (task.category == categoryName){
                        canDelete = false;
                        break;
                    }
                }
            }
            if (!canDelete) return canDelete;
            if (canDelete){
                let indexToRemove = 0;

                while(dataToChange.categories[indexToRemove].name != categoryName){
                    indexToRemove++;
                }
                
                dataToChange.categories.splice(indexToRemove,1);                 
                
                const updatedData = JSON.stringify(dataToChange, null, 2);

                fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                    if (err){
                        console.error("Failed to write the new storage ...");
                        
                    } else {
                        console.log("Task replaced successfully");
                    }
                });
                return canDelete;
            }
        }
    });
}

app.get("/currentCategory", (req,res) => {
    fs.readFile("db.json", "utf8", (err,data) => {
        if (err) {
            console.error("Error while reading database");
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            
            let completeData = JSON.parse(data);
            for (category of completeData.categories) {
                console.log(category);
                if (category.name == currentCategory){
                    console.log("I found the reminder :",category);
                    res.end(JSON.stringify(category));
                    break;
                }
            }
        }
    });
});

app.post("/display_changed", (req,res) => {
    let categoryToChange = req.body;
    console.log("I change the display of category :",categoryToChange.name);
    fs.readFile("db.json", 'utf8', (err,data) => {
        if(err){
            console.error("Error reading the storage ...");
        } else {

            let dataToChange = JSON.parse(data);
            let indexToChange = 0;
            while(dataToChange.categories[indexToChange].name != categoryToChange.name){
                indexToChange++;
            }          
            dataToChange.categories[indexToChange].checked = categoryToChange.checked;
            const updatedData = JSON.stringify(dataToChange, null, 2);

            fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                if (err){
                    console.error("Failed to add the reminder ...");
                } else {
                    console.log("Display changed successfully !");
                    res.writeHead(200, { "Content-Type": "text/plain" });
                    res.end("Display chenged successfully !!");
                }
            });
        }
    });

})

app.get("/reminder_form", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'reminder_form.html'));
})

app.post("/add_reminder", (req,res) => {
    let newReminder = req.body;
    addReminder(newReminder);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Reminder added successfully !!");  
});

function addReminder(newReminder) {
    fs.readFile("db.json", 'utf8', (err,data) => {
        if(err){
            console.error("Error reading the storage ...");
        } else {

            let dataToChange = JSON.parse(data);
            dataToChange.reminders.push(newReminder);            
            const updatedData = JSON.stringify(dataToChange, null, 2);

            fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                if (err){
                    console.error("Failed to add the reminder ...");
                } else {
                    console.log("Reminder added successfully !");
                }
            });
        }
    });
}

app.get("/reminder_modify", (req,res) => {
    currentReminder = req.query.reminder;
    console.log("Current reminder :",currentReminder);
    res.sendFile(path.join(__dirname, 'public', 'reminder_modify.html'))
})

app.post("/modify_reminder", (req,res) => {
    let newReminder = req.body;
    modifyReminder(currentReminder, newReminder);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Reminder modified successfully !!");  
});

function modifyReminder(formerReminderDescription, newReminder){
    
    fs.readFile("db.json", 'utf8', (err,data) => {
        if(err){
            console.error("Error reading the storage ...");
        } else {

            let dataToChange = JSON.parse(data);

            let indexToRemove = 0;
            console.log(dataToChange.reminders[indexToRemove]);

            while(dataToChange.reminders[indexToRemove].description != formerReminderDescription){
                indexToRemove++;
            }
            
            dataToChange.reminders[indexToRemove] = newReminder;                 
            
            const updatedData = JSON.stringify(dataToChange, null, 2);

            fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                if (err){
                    console.error("Failed to modify the reminder ...");
                    
                } else {
                    console.log("Reminder replaced successfully");
                }
            });
        }
    });
}

app.get("/delete_reminder", (req,res) => {
    currentReminder = req.query.reminder;
    deleteReminder(currentReminder);
    res.sendFile(path.join(__dirname, 'public', 'todo.html'))
});

function deleteReminder(reminderDescription){
    fs.readFile("db.json", 'utf8', (err,data) => {
        if(err){
            console.error("Error reading the storage ...");
        } else {

            let dataToChange = JSON.parse(data);

            let indexToRemove = 0;

            console.log("I want to delete :", reminderDescription);

            while(dataToChange.reminders[indexToRemove].description != reminderDescription){
                indexToRemove++;
            }
            
            dataToChange.reminders.splice(indexToRemove,1);                 
            
            const updatedData = JSON.stringify(dataToChange, null, 2);

            fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                if (err){
                    console.error("Failed to write the new storage ...");
                    
                } else {
                    console.log("Task replaced successfully");
                }
            });
        }
    });
}

app.get("/currentReminder", (req,res) => {
    fs.readFile("db.json", "utf8", (err,data) => {
        if (err) {
            console.error("Error while reading database");
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            
            let completeData = JSON.parse(data);
            for (reminder of completeData.reminders) {
                console.log(reminder);
                if (reminder.description == currentReminder){
                    console.log("I found the reminder :",reminder);
                    res.end(JSON.stringify(reminder));
                    break;
                }
            }
        }
    });
});

app.get("/task_form", (req,res) => {
    currentGroup = req.query.group;
    console.log(currentGroup);
    res.sendFile(path.join(__dirname, 'public', 'task_form.html'));
})

app.post("/add_task", (req,res) => {
    let newTask = req.body;
    addTask(newTask);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Task added successfully !!");  
});

app.get("/task_modify", (req,res) => {
    currentGroup = req.query.group;
    currentTask = req.query.task;
    res.sendFile(path.join(__dirname, 'public', 'task_modify.html'));
})

app.post("/modify_task", (req,res) => {
    let newTask = req.body;
    modifyTask(currentTask, newTask);
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Task modified successfully !!");  
});

app.get("/delete_task", (req,res) => {
    currentGroup = req.query.group;
    currentTask = req.query.task;
    deleteTask(currentTask);
    res.sendFile(path.join(__dirname, 'public', 'todo.html'))
})

function addTask(task){
    fs.readFile("db.json", 'utf8', (err,data) => {
        if(err){
            console.error("Error reading the storage ...");
        } else {

            let dataToChange = JSON.parse(data);

            dataToChange.tasks[currentGroup].push(task);                        
            
            const updatedData = JSON.stringify(dataToChange, null, 2);

            fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                if (err){
                    console.error("Failed to add the new task ...");
                } else {
                    console.log("Task added successfully !");
                }
            });
        }
    });
}

function modifyTask(formerTaskDescription, newTask){
    
    fs.readFile("db.json", 'utf8', (err,data) => {
        if(err){
            console.error("Error reading the storage ...");
        } else {

            let dataToChange = JSON.parse(data);

            let indexToRemove = 0;
            console.log(dataToChange.tasks[currentGroup][indexToRemove]);

            while(dataToChange.tasks[currentGroup][indexToRemove].description != formerTaskDescription){
                indexToRemove++;
            }
            
            dataToChange.tasks[currentGroup][indexToRemove] = newTask;                 
            
            const updatedData = JSON.stringify(dataToChange, null, 2);

            fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                if (err){
                    console.error("Failed to modify the task ...");
                    
                } else {
                    console.log("Task replaced successfully");
                }
            });
        }
    });
}

function deleteTask(taskDescription){
    fs.readFile("db.json", 'utf8', (err,data) => {
        if(err){
            console.error("Error reading the storage ...");
        } else {

            let dataToChange = JSON.parse(data);

            let indexToRemove = 0;

            console.log(currentGroup);
            console.log("I want to delete :", taskDescription);

            while(dataToChange.tasks[currentGroup][indexToRemove].description != taskDescription){
                indexToRemove++;
            }
            
            dataToChange.tasks[currentGroup].splice(indexToRemove,1);                 
            
            const updatedData = JSON.stringify(dataToChange, null, 2);

            fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                if (err){
                    console.error("Failed to write the new storage ...");
                    
                } else {
                    console.log("Task replaced successfully");
                }
            });
        }
    });
}

app.get("/currentTask", (req,res) => {
    fs.readFile("db.json", "utf8", (err,data) => {
        if (err) {
            console.error("Error while reading database");
        } else {
            res.writeHead(200, { "Content-Type": "application/json" });
            
            let completeData = JSON.parse(data);
            for (task of completeData.tasks[currentGroup]) {
                console.log(task);
                if (task.description == currentTask){
                    console.log("I found the task :",task);
                    res.end(JSON.stringify(task));
                    break;
                }
            }
        }
    });
});

app.listen(8080, () => {
    console.log("Application started on port 8080");
});