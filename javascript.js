let game = document.getElementById("game")
let speed = 0.5
let running = false
let score = 0
let attemptStop = false
let notes = []
let keys = "dfjk"
let index = {
    d: 0,
    f: 1,
    j: 2,
    k: 3,
}

for (let i = 0; i < 4; i++) {
    let divEl = document.createElement("div")
    divEl.style.height = "100%"
    divEl.id = i
    game.appendChild(divEl)
}

function Note() {
    this.noteLength = 20
    this.color = "black"
    this.lane = Math.floor(Math.random() * 4)
    let different = false
    while (!different && notes.length != 0) {
        if (notes[notes.length - 1].lane == this.lane) {
            this.lane = Math.floor(Math.random() * 4)
        } else {
            different = true
        }
    }
    this.div
    this.noteTop = -20
    this.create = function () {
        let rndLane = game.childNodes[this.lane]
        let divEl = document.createElement("div")
        this.div = divEl
        divEl.style.backgroundColor = this.color
        divEl.style.height = `${this.noteLength}%`
        divEl.style.width = "100%"
        divEl.style.top = "-20%"
        divEl.style.position = "absolute"
        rndLane.appendChild(divEl)
    }
    this.create()
    this.hasCreated = false
    this.update = function () {
        this.noteTop += speed
        this.div.style.top = `${this.noteTop}%`
        this.div.style.backgroundColor = this.color
        if (this.noteTop > 0 && !this.hasCreated) {
            notes.push(new Note())
            this.hasCreated = true
        }
    }
}
window.addEventListener("click", e => {
    if (!running) {
        startGame()
    } else {
        let lane = e.target.parentNode.id
        if (lane.length == 1) {
            inputHandle(lane)
        } else {
            resetGame()
        }
    }
})
window.addEventListener("keydown", e => {
    if (!running && e.key == " ") {
        startGame()
    } else if (keys.includes(e.key)) {
        let lane = index[e.key]
        inputHandle(lane)
    }
})
function inputHandle(lane) {
    console.log(lane)
    if (notes.length != 0) {
        let found = false
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].color == "black" && !found) {
                found = true
                if (notes[i].lane == lane) {
                    notes[i].color = "gray"
                    score++
                } else {
                    resetGame()
                }
            }
        }
    }
}

function startGame() {
    running = true
    // clear current game
    notes.forEach(e => { e.div.style.display = "none" })
    score = 0
    speed = 0.5
    let gameInterval = setInterval(() => {
        document.getElementById("score").innerHTML = score
        window.onkeydown = e => { if (e.key == "s") { clearInterval(gameInterval); running = false } }
        if (attemptStop) {
            attemptStop = false
            clearInterval(gameInterval)
        }
        if (notes.length == 0) {
            notes.push(new Note())
        } else {
            notes.forEach(e => {
                e.update()
                if (e.noteTop == 100) {
                    game.childNodes[e.lane].removeChild(game.childNodes[e.lane].firstChild)
                    notes.splice(e, 1)
                }
            })
        }

    }, 10)
}
let timeInterval = setInterval(() => {
    speed += 0.1
}, 5000)

function resetGame() {
    notes.forEach(e => {
        e.div.style.transition = "1s"
        e.color = "red"
    })
    attemptStop = true
    running = false
}

// let counter = 0
// window.onkeydown = e => {
//     if (e.keyCode == "32") {
//         let word = document.getElementById("row1").childNodes[counter].innerHTML
//         let inputfield = document.getElementById("inputfield")
//         inputfield.value = word.toString()
//         counter++
//         counter++
//     }
// }

// youtube
// let images = document.querySelectorAll("#img")
// let degrees = 0
// let interval = setInterval(() => {
//     images.forEach(e => {
//         e.style.transform = `rotate(${degrees}deg)`
//         degrees++
//     })
// }, 100)
