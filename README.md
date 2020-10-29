# fullstack-todo-app
Fullstack todo app made with Node, Express, MongoDB, mongoose, and vanilla JS for the frontend. Assignment for DGM 3760.

## How the app is architected
Runs on Heroku with NodeJS as the backend; app deploys by installing all the npm modules and running ```node main.js```. Main.js contains all the server logic and is written with Express. Uses the SRC folder as the static folder, where when you visit the root of the site, it serves you index.html with all the CSS and JavaScript attached to it as well. The frontend app is written in vanilla JS, but I made tried to mimic React in a way; meaning that everytime the "state" updates, I have to main renderControls() and renderTodos() functions that render everything. The frontend uses the API endpoints of the server to GET, PUT, POST and DELETE data from the MongoDB database.

## How to run locally
Clone or fork the code from github onto your local machine, then install all the dependencies by typing ```npm install```. To run the app locally, you can type ```node main.js``` or use something like nodemon.

## Database API endpoints
The main endpoint for the API is ```/todos```. 

### GET request
To GET all of the todos, simply just hit ```/todos```.

Example
```javascript
https://todo-fullstack-bingland.herokuapp.com/todos
```

### POST request
To POST a todo to the server, you hit ```/todos``` as well, however you attach all the parameters to the end.

Example
```javascript
https://todo-fullstack-bingland.herokuapp.com/todos?text=Carve pumpkins&complete=true&category=Fun
```

### PUT request
To modify a todo using a PUT request, you hit ```/todos/:id```, with :id being the ID of the todo you want to modify. After the ID, you attach all of the parameters.

Example
```javascript
https://todo-fullstack-bingland.herokuapp.com/todos/5f9a40cd098adc420df2a94e?text=Buy gum at walmart&complete=true&category=Groceries
```

### DELETE request
To do DELETE a todo, you hit ```/todos/:d```, with :id being the ID of the todo you want to delete. You don't need to attach any parameters.

Example
```javascript
https://todo-fullstack-bingland.herokuapp.com/todos/5f90efcc0287b18ff9224332
```
