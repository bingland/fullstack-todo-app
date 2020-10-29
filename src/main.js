//inital data array. DO NOT EDIT OR REMOVE - Use these as the inital app state.
//This is the kind of data you would traditionally get from a data base.
//For now we are just going to mock it.
let todoData = [
    // {id: 1, todo: "Buy milk.", complete: false, category: "Grocery"},
    // {id: 2, todo: "Clean the cat box.", complete: false, category: "House"},
    // {id: 3, todo: "Chips and salsa.", complete: false, category: "Grocery"},
    // {id: 4, todo: "Finish Homework for DGM 3760", complete: false, category: "School"}
]

// global vars for state management
let categories = []
let activeCategories = []
let catButtons = null
let hideDoneTodos = false

// dom refs
const output = document.querySelector('#output')
const controls = document.querySelector('#controls')
const addArea = document.querySelector('#addArea')
const addTodoBtn = document.querySelector('.addTodo')
const addCat = document.querySelector('#addCat')

// render categories to the controls
const renderControls = () => {

    // updates categories array for state
    categories = []
    for (let item of todoData) {
        if (!categories.includes(item.category)) {
            categories.push(item.category)
        }
    }

    // output categories to the control bar
    controls.innerHTML = ''
    categories.forEach(element => {
        controls.innerHTML += `
            <div class="category">${element}</div>
        `
    })

    // assign onclick event listeners
    catButtons = document.querySelectorAll('.category')
    catButtons.forEach((element, index) => {
        element.addEventListener('click', () => {
            catToggle(element.innerHTML, index)
        })
    })

    // show / hide done todos
    let doneToggle = document.createElement('div')
    doneToggle.className = hideDoneTodos ? 'doneToggleActive doneToggle' : 'doneToggle'
    doneToggle.innerHTML = 'Toggle Done Todos'
    doneToggle.addEventListener('click', () => {
        hideDoneTodos = !hideDoneTodos
        doneToggle.className = hideDoneTodos ? 'doneToggleActive doneToggle' : 'doneToggle'
        renderTodos()
    })
    controls.appendChild(doneToggle)


}
// GET request
const getTodos = () => {
    fetch('/todos')
        .then(response => response.json())
        .then(data => {
            todoData = data
            renderControls()
            renderTodos()
    });
}
// POST request
const addTodo = () => {
    const addTodoDesc = document.querySelector('.addTodoDesc').value
    const addTodoCat = document.querySelector('.addTodoCat').value

    if (addTodoDesc.replace(/\s/g,'') !== '' && addTodoCat.replace(/\s/g,'') !== '') {
        // localhost:3000/todos?text=Carve pumpkins&complete=true&category=Fun
        fetch(`/todos?text=${addTodoDesc}&complete=false&category=${addTodoCat}`, {
            method: 'POST'
        }).
        then(response => response.json())
        .then(data => {
            todoData = data
            renderControls()
            renderTodos()
        })

        // todoData.push({id: todoData.length + 1, todo: addTodoDesc.value, complete: false, category: addTodoCat.value})
        // renderTodos()
        // renderControls()
    }
}

// event listener for add todo button
addTodoBtn.onclick = addTodo

const catToggle = (catName, catIndex) => {
    if (!activeCategories.includes(catName)) {
        // if the category isn't enabled already
        activeCategories.push(catName)
        catButtons[catIndex].classList.add('catEnabled')
    } else {
        // if category is already enabled
        let index = activeCategories.indexOf(catName)
        activeCategories.splice(index, 1)
        catButtons[catIndex].classList.remove('catEnabled')
    }

    renderTodos()
}

// render todos to the output
const renderTodos = () => {
    output.innerHTML = ''

    todoData.forEach((element, index) => {
        // render items only if they fit the category requirements
        if (activeCategories.includes(element.category) || activeCategories.length == 0 ) {
            // dont render completed items if the hideDoneTodos filter is on 
            if (!(element.complete && hideDoneTodos)) {
                let checked = element.complete ? 'checked' : ''
                let myclass = element.complete ? 'todoContent todoChecked' : 'todoContent'
                output.innerHTML += `
                    <div class="todo todoUnchecked" data-id="${element._id}">
                        <input type="checkbox" name="todo" value="todo" class="crossoff" ${checked}>
                        <label class="${myclass}">${element.text}</label><div class="catTodo">${element.category}</div>
                        <div class="svgContainer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" class="deleteTodo">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </div>
                `
            }
        }
    })

    // PUT REQUEST
    // cross off todos by clicking
    let checkboxes = document.querySelectorAll('.crossoff')
    let labels = document.querySelectorAll('.todoContent')
    let todos = document.querySelectorAll('.todo')
    const toggleClicks = (element, index) => {
        element.addEventListener('click', () => {
            // cross off todos by clicking label, change complete property for the respective todo
            if (element.tagName == 'LABEL') {
                todoData[index].complete = !checkboxes[index].checked
                fetch(`/todos/${todoData[index]._id}?text=${todoData[index].text}&complete=${todoData[index].complete}&category=${todoData[index].category}`, {
                    method: 'PUT'
                }).
                then(response => response.json())
                .then(data => {
                    todoData = data
                    renderControls()
                    renderTodos()
                })
            }

            // cross off todos by checkbox, change complete property for the respective todo
            if (element.tagName == 'INPUT') {
                todoData[index].complete = checkboxes[index].checked
                fetch(`/todos/${todoData[index]._id}?text=${todoData[index].text}&complete=${todoData[index].complete}&category=${todoData[index].category}`, {
                    method: 'PUT'
                }).
                then(response => response.json())
                .then(data => {
                    todoData = data
                    renderControls()
                    renderTodos()
                })
            }
            // rerender
            renderTodos()
            renderControls()
        })
    }

    checkboxes.forEach(toggleClicks)
    labels.forEach(toggleClicks)

    // DELETE
    // delete todos by clicking the SVG
    let closers = document.querySelectorAll('.deleteTodo')
    closers.forEach((element, index) => {
        element.addEventListener('click', (e) => {
            let id = todoData[index]._id
            fetch(`/todos/${id}`, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                todoData = data
                renderControls()
                renderTodos()
            })

            // todoData.splice(index, 1)
            renderTodos()
            renderControls()
        })
    })

    // if category is turned on and there are no todos listed, then deactivate the category
    if (todos.length === 0) {
        activeCategories = []

        if (todoData.length !== 0) {
            hideDoneTodos = false
            renderControls()
            renderTodos()
        }
    }
}

// initial function calls to render the todos and controls

const init = () => {
    getTodos()
}

init()
