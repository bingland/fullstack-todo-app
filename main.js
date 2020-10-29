const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
//const cors = require('cors')
const app = express()
const port = process.env.PORT || 3000

//middleware
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.listen(port, () => { console.log(`Server running on port ${port}`) })

const Todo = require('./models/Todo')

app.use('/', express.static('src'))

// GET 
app.get('/todos', (req, res) => {
    Todo.find((err, todos) => {
        if (err) console.log(err)
        res.json(todos)
    })
})

// POST 
app.post('/todos', (req, res) => {
    Todo.create({
        text: req.query.text, 
        complete: req.query.complete,
        category: req.query.category
    }, (err, todo) => {
        if (err) console.log(err)

        Todo.find((err, todos) => {
            if (err) console.log(err)
            res.json(todos)
        })
    })
})

// PUT
app.put('/todos/:id', (req, res) => {
    Todo.findById(`${req.params.id}`, (err, todo) => {
        if (err) console.log(err)
        todo.updateOne(req.query, (err, todos) => {
            if (err) console.log(err)

            Todo.find((err, todos) => {
                if (err) console.log(err)
                res.json(todos)
            })
        })
    })
})

// DELETE
app.delete('/todos/:id', (req, res) => {
    Todo.remove({
        _id: req.params.id
    }, (err, todos) => {
        if (err) console.log(err)
        Todo.find((err, todos) => {
            if (err) console.log(err)
            res.json(todos)
        })
    })
})