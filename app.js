const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

let currentGroup = "in_progress";
let currentTask = "Send an email to Michel";

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
    fs.readFile("db.json", 'utf8', (err,data) => {
            if(err){
                console.error("Error reading the storage ...");
            } else {

                let dataToChange = JSON.parse(data);
                dataToChange.categories.push(newCategory);            
                const updatedData = JSON.stringify(dataToChange, null, 2);

                fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                    if (err){
                        console.error("Failed to write the new storage ...");
                        res.writeHead(500);
                        res.end("Failed to remove an element")
                    } else {
                        res.writeHead(200);
                        res.end("Category added successfully !");
                    }
                });
            }
        });
});

app.get("/reminder_form", (req,res) => {
    res.sendFile(path.join(__dirname, 'public', 'reminder_form.html'));
})

app.post("/add_reminder", (req,res) => {
    let newReminder = req.body;
    fs.readFile("db.json", 'utf8', (err,data) => {
            if(err){
                console.error("Error reading the storage ...");
            } else {

                let dataToChange = JSON.parse(data);
                dataToChange.reminders.push(newReminder);            
                const updatedData = JSON.stringify(dataToChange, null, 2);

                fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                    if (err){
                        console.error("Failed to write the new storage ...");
                        res.writeHead(500);
                        res.end("Failed to remove an element")
                    } else {
                        res.writeHead(200);
                        res.end("Reminder added successfully !");
                    }
                });
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
});

function addTask(task,res){
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
                    console.error("Failed to write the new storage ...");
                    
                } else {
                    console.log("Task replaced successfully");
                }
            });
        }
    });
}

app.get("/task_modify", (req,res) => {
    currentGroup = req.query.group;
    currentTask = req.query.task;
    res.sendFile(path.join(__dirname, 'public', 'task_modify.html'));
})

app.post("/modify_task", (req,res) => {
    let newTask = req.body;
    modifyTask(currentTask, newTask);
});

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
})

app.listen(8080, () => {
    console.log("Application started on port 8080");
});