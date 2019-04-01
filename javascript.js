let game = document.getElementById("game")
let speed = 0.5
let running = false
let score = 0
let attemptStop = false
// array of all notes
let notes = []
// input values (changable)
let keys = "dfjk"

// index for the input values
let index = {
    d: 0,
    f: 1,
    j: 2,
    k: 3,
}

// creates all the lanes
for (let i = 0; i < 4; i++) {
    let divEl = document.createElement("div")
    divEl.style.height = "100%"
    divEl.id = i
    divEl.className = "lane"
    game.appendChild(divEl)
}

// listens for click and checks if it is the correct lane
window.addEventListener("click", e => {
    // starts game if not already
    if (!running) {
        startGame()
    } else {
        let lane
        if (e.target.className == "note") {
            lane = e.target.parentNode.id
        } else if (e.target.className == "lane") {
            lane = e.target.id
        }
        if (lane.length == 1) {
            inputHandle(lane)
        } else {
            resetGame()
        }
    }
})

// touchstart is for iphone
window.addEventListener("touchstart", e => {
    if (!running) {
        startGame()
    } else {
        let lane
        if (e.target.className == "note") {
            lane = e.target.parentNode.id
        } else if (e.target.className == "lane") {
            lane = e.target.id
        }
        if (lane.length == 1) {
            inputHandle(lane)
        } else {
            resetGame()
        }
    }
})

// starts game if spacebar is pressed
window.addEventListener("keydown", e => {
    if (!running && e.key == " ") {
        startGame()
    }
    // if key pressed is a key to a lane it will register
    else if (keys.includes(e.key)) {
        let lane = index[e.key]
        inputHandle(lane)
    }
})

// handles the user input
function inputHandle(lane) {
    if (notes.length != 0) {
        // calculates which lane should be pressed and checks if the lane pressed is correct
        let found = false
        for (let i = 0; i < notes.length; i++) {
            if (notes[i].color == "black" && !found) {
                found = true
                if (notes[i].lane == lane) {
                    notes[i].color = "gray"
                    score++

                    // plays click sound
                    let audio = document.getElementById("lyd")
                    audio.load()
                    audio.play()
                } else {
                    // if the note pressed is wrong it will stop the game and reset
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

    // game interval
    let gameInterval = setInterval(() => {
        // updates scores
        document.getElementById("score").innerHTML = score
        document.getElementById("scoreMobile").innerHTML = score
        window.onkeydown = e => { if (e.key == "s") { clearInterval(gameInterval); running = false } }

        // attempts to stop game if gameStop == true
        if (attemptStop) {
            attemptStop = false
            clearInterval(gameInterval)
        }

        // if no notes are present, push a first note
        if (notes.length == 0) {
            notes.push(new Note())
        } else {
            // updates each note
            notes.forEach(e => {
                e.update()

                // if the note has passsed it will be removed
                if (e.noteTop >= 100) {
                    game.childNodes[e.lane].removeChild(game.childNodes[e.lane].firstChild)
                    notes.splice(e, 1)
                }
            })
        }
    }, 10)
}

// speed multiplyer interval speeds up the game gradually
let timeInterval = setInterval(() => {
    speed += 0.1
}, 5000)

// sets all notes color to red when failed and attempts stop
function resetGame() {
    notes.forEach(e => {
        e.div.style.transition = "1s"
        e.color = "red"
    })
    attemptStop = true
    running = false

    // set new score
    if (localStorage.bestScore) {
        // highscore
        if (Number(localStorage.bestScore) < score) {
            localStorage.bestScore = score
            // type == 1 means new highscore
            writeBestScore(1)
        }
        // not new highscore
        else {
            writeBestScore()
        }

    }
    // first time played, sets new score
    else {
        localStorage.setItem("bestScore", score)
        writeBestScore()
    }
}

// writes best score after game ended
function writeBestScore(type) {
    // times out because it will be overwritten if not
    setTimeout(() => {
        // if new score then tyoe == 1
        if (type == 1) {
            document.getElementById("score").innerHTML += `<br>New Highscore!`
            document.getElementById("scoreMobile").innerHTML += `<br>New Highscore!`
        }
        // score was lower than best
        else {
            document.getElementById("scoreMobile").innerHTML = `Your score: ${score} <br> Best Score: ${localStorage.bestScore}`
            document.getElementById("score").innerHTML = `Your score: ${score}<br>Best Score: ${localStorage.bestScore}`
        }
    }, 100)
}