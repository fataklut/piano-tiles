// note object
function Note() {
    // initial values
    this.noteLength = 20
    this.color = "black"
    this.div
    this.noteTop = -20
    this.lane = Math.floor(Math.random() * 4)
    // a note can create anotether note, but only once
    this.hasCreated = false

    // has to be a different lane than last note
    let different = false
    while (!different && notes.length != 0) {
        if (notes[notes.length - 1].lane == this.lane) {
            this.lane = Math.floor(Math.random() * 4)
        } else {
            different = true
        }
    }
    this.create = function () {
        let rndLane = game.childNodes[this.lane]
        let divEl = document.createElement("div")
        // important line, sets object div value to be actual div element
        this.div = divEl
        divEl.className = "note"
        divEl.style.backgroundColor = this.color
        divEl.style.height = `${this.noteLength}%`
        divEl.style.width = "100%"
        divEl.style.top = "-20%"
        divEl.style.position = "absolute"
        rndLane.appendChild(divEl)
    }
    // creates the element (doesn't need a function, but easier to debug)
    this.create()
    this.update = function () {
        this.noteTop += speed
        this.div.style.top = `${this.noteTop}%`
        this.div.style.backgroundColor = this.color
        if (this.noteTop > 0 && !this.hasCreated) {
            notes.push(new Note())
            this.hasCreated = true
        }
        if (this.noteTop >= 100) {
            if (this.color == "black") {
                resetGame()
            }
        }
    }
}