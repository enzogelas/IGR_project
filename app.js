const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

let currentGroup = "in_progress";

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
    fs.readFile("db.json", 'utf8', (err,data) => {
            if(err){
                console.error("Error reading the storage ...");
            } else {

                let dataToChange = JSON.parse(data);

                if(currentGroup == "to_do") dataToChange.tasks.to_do.push(newTask);            
                else if(currentGroup == "in_progress") dataToChange.tasks.in_progress.push(newTask);            
                else if(currentGroup == "finished") dataToChange.tasks.finished.push(newTask);            
                
                const updatedData = JSON.stringify(dataToChange, null, 2);

                fs.writeFile("db.json", updatedData, 'utf8', (err)=>{
                    if (err){
                        console.error("Failed to write the new storage ...");
                        res.writeHead(500);
                        res.end("Failed to remove an element")
                    } else {
                        res.writeHead(200);
                        res.end("Task added successfully !");
                    }
                });
            }
        });
});

app.listen(8080, () => {
    console.log("Application started on port 8080");
});