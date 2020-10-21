//inital data array. DO NOT EDIT OR REMOVE - Use these as the inital app state.
//This is the kind of data you would traditionally get from a data base.
//For now we are just going to mock it.
let initialTodos = [
    {id: 1, todo: "Buy milk.", complete: false, category: "Grocery"},
    {id: 2, todo: "Clean the cat box.", complete: false, category: "House"},
    {id: 3, todo: "Chips and salsa.", complete: false, category: "Grocery"},
    {id: 4, todo: "Finish Homework for DGM 3760", complete: false, category: "School"}
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
    for (let item of initialTodos) {
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

const addTodo = () => {
    const addTodoDesc = document.querySelector('.addTodoDesc')
    const addTodoCat = document.querySelector('.addTodoCat')

    if (addTodoDesc.value.replace(/\s/g,'') !== '' && addTodoCat.value.replace(/\s/g,'') !== '') {
        initialTodos.push({id: initialTodos.length + 1, todo: addTodoDesc.value, complete: false, category: addTodoCat.value})
        renderTodos()
        renderControls()
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

    initialTodos.forEach(element => {
        // render items only if they fit the category requirements
        if (activeCategories.includes(element.category) || activeCategories.length == 0 ) {
            // dont render completed items if the hideDoneTodos filter is on 
            if (!(element.complete && hideDoneTodos)) {
                let checked = element.complete ? 'checked' : ''
                let myclass = element.complete ? 'todoContent todoChecked' : 'todoContent'
                output.innerHTML += `
                    <div class="todo todoUnchecked" data-id="${element.id}">
                        <input type="checkbox" name="todo" value="todo" class="crossoff" ${checked}>
                        <label class="${myclass}">${element.todo}</label><div class="catTodo">${element.category}</div>
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

    // cross off todos by clicking
    let checkboxes = document.querySelectorAll('.crossoff')
    let labels = document.querySelectorAll('.todoContent')
    let todos = document.querySelectorAll('.todo')
    const toggleClicks = (element, index) => {
        element.addEventListener('click', () => {
            // cross off todos by clicking label, change complete property for the respective todo
            let myIndex = Number(todos[index].getAttribute('data-id')) - 1
            if (element.tagName == 'LABEL') {
                initialTodos[myIndex].complete = !checkboxes[index].checked
            }

            // cross off todos by checkbox, change complete property for the respective todo
            if (element.tagName == 'INPUT') {
                initialTodos[myIndex].complete = checkboxes[index].checked
            }
            // rerender
            renderTodos()
            renderControls()
        })
    }

    checkboxes.forEach(toggleClicks)
    labels.forEach(toggleClicks)

    // delete todos by clicking the SVG
    let closers = document.querySelectorAll('.deleteTodo')
    closers.forEach((element, index) => {
        element.addEventListener('click', () => {
            let myIndex = Number(todos[index].getAttribute('data-id')) - 1
            initialTodos.splice(myIndex, 1)
            readjustIds()
            renderTodos()
            renderControls()
        })
    })

    // if category is turned on and there are no todos listed, then deactivate the category
    if (todos.length === 0) {
        activeCategories = []

        if (initialTodos.length !== 0) {
            hideDoneTodos = false
            renderControls()
            renderTodos()
        }
    }

    // update storage at the end of the renderTodo cycle
    updateStorage()
}

// readjust all the ids for when a todo is deleted 
const readjustIds = () => {
    for (let i in initialTodos) {
        initialTodos[i].id = Number(i) + 1
    }
}

// update the storage with the current version of initial todos
const updateStorage = () => {
    localStorage.setItem('todos', JSON.stringify(initialTodos))
}

// update initial todos with the storage. if there's nothing set for todos, then continue
initialTodos = localStorage.getItem('todos') == null ? initialTodos : JSON.parse(localStorage.getItem('todos'))

// initial function calls to render the todos and controls
renderControls()
renderTodos()