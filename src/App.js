import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import targetWords from "./words/targetWords.js";
import dictionary from './words/dictionary.json'

const App = () => {
  const guessGrid = useRef(null)
  const keyboard = useRef(null)
  const alertContainer = useRef(null)
  const WORD_LENGTH = 5
  const FLIP_ANIMATION_DURATION = 500
  const DANCE_ANIMATION_DURATION = 500
  const offsetFromDate = new Date(2022, 9, 5)
  const msOffset = Date.now() - offsetFromDate
  const dayOffset = msOffset / 1000 / 60 / 60 / 24
  const targetWord = targetWords[Math.floor(dayOffset)]

  const checkWinLose = (guess, tiles) => {
    if (guess === targetWord) {
      showAlert("You Win", 5000)
      danceTiles(tiles)
      return
    }
  
    const remainingTiles = guessGrid.current.querySelectorAll(":not([data-letter])")
    if (remainingTiles.length === 0) {
      showAlert(targetWord.toUpperCase(), null)
    }
  }

  const flipTile = (tile, index, array, guess) => {
    const letter = tile.dataset.letter
    const key = keyboard.current.querySelector(`[data-key="${letter}"i]`)
    setTimeout(() => {
      tile.classList.add("flip")
    }, (index * FLIP_ANIMATION_DURATION) / 2)
  
    tile.addEventListener(
      "transitionend",
      () => {
        tile.classList.remove("flip")
        if (targetWord[index] === letter) {
          tile.dataset.state = "correct"
          key.classList.add("correct")
        } else if (targetWord.includes(letter)) {
          tile.dataset.state = "wrong-location"
          key.classList.add("wrong-location")
        } else {
          tile.dataset.state = "wrong"
          key.classList.add("wrong")
        }
  
        if (index === array.length - 1) {
          tile.addEventListener(
            "transitionend",
            () => {
              checkWinLose(guess, array)
            },
            { once: true }
          )
        }
      },
      { once: true }
    )
  }
  
  const danceTiles = (tiles) => {
    tiles.forEach((tile, index) => {
      setTimeout(() => {
        tile.classList.add("dance")
        tile.addEventListener(
          "animationend",
          () => {
            tile.classList.remove("dance")
          },
          { once: true }
        )
      }, (index * DANCE_ANIMATION_DURATION) / 5)
    })
  }

  const shakeTiles = (tiles) => {
    tiles.forEach(tile => {
      tile.classList.add("shake")
      tile.addEventListener(
        "animationend",
        () => {
          tile.classList.remove("shake")
        },
        { once: true }
      )
    })
  }

  const submitGuess = () => {
    const activeTiles = [...getActiveTiles()]
    if (activeTiles.length !== WORD_LENGTH) {
      showAlert("Not enough letters")
      shakeTiles(activeTiles)
      return
    }
  
    const guess = activeTiles.reduce((word, tile) => {
      return word + tile.dataset.letter
    }, "")
  
    if (!dictionary.includes(guess)) {
      showAlert("Not in word list")
      shakeTiles(activeTiles)
      return
    }
  
    activeTiles.forEach((...params) => flipTile(...params, guess))
  }

  const deleteKey = () => {
    const activeTiles = getActiveTiles()
    const lastTile = activeTiles[activeTiles.length - 1]
    if (lastTile == null) return
    lastTile.textContent = ""
    delete lastTile.dataset.state
    delete lastTile.dataset.letter
  }

  const getActiveTiles = () => {
    return guessGrid.current.querySelectorAll('[data-state="active"]')
  }

  const pressKey = (key) => {
      const activeTiles = getActiveTiles()
      if (activeTiles.length >= WORD_LENGTH) return
      const nextTile = guessGrid.current.querySelector(":not([data-letter])")
      nextTile.dataset.letter = key.toLowerCase()
      nextTile.textContent = key
      nextTile.dataset.state = "active"
  }

  const onClick = (e) => {
    if (e.target.matches("[data-key]")) {
      pressKey(e.target.dataset.key)
      return
    }
  
    if (e.target.matches("[data-enter]")) {
      submitGuess()
      return
    }
  
    if (e.target.matches("[data-delete]")) {
      deleteKey()
      return
    }
  }

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      submitGuess()
      return
    }
  
    if (e.key === "Backspace" || e.key === "Delete") {
      deleteKey()
      return
    }
  
    if (e.key.match(/^[a-z]$/)) {
      pressKey(e.key)
      return
    }
  }

  const showAlert = (message, duration = 1000) => {
    const alert = document.createElement("div")
    alert.textContent = message
    alert.classList.add("alert")
    alertContainer.current.prepend(alert)
    if (duration == null) return
  
    setTimeout(() => {
      alert.classList.add("hide")
      alert.addEventListener("transitionend", () => {
        alert.remove()
      })
    }, duration)
  }

  useEffect(() => {
    window.addEventListener("click", onClick)
    window.addEventListener("keydown", onKeyDown)
  })

  return (
    <div className="wrapper">
      <div class="alert-container" data-alert-container ref={alertContainer}></div>
      <div data-guess-grid class="guess-grid" ref={guessGrid}>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
        <div class="tile"></div>
      </div>
      <div data-keyboard class="keyboard" ref={keyboard}>
        <button class="key" data-key="Q">Q</button>
        <button class="key" data-key="W">W</button>
        <button class="key" data-key="E">E</button>
        <button class="key" data-key="R">R</button>
        <button class="key" data-key="T">T</button>
        <button class="key" data-key="Y">Y</button>
        <button class="key" data-key="U">U</button>
        <button class="key" data-key="I">I</button>
        <button class="key" data-key="O">O</button>
        <button class="key" data-key="P">P</button>
        <div class="space"></div>
        <button class="key" data-key="A">A</button>
        <button class="key" data-key="S">S</button>
        <button class="key" data-key="D">D</button>
        <button class="key" data-key="F">F</button>
        <button class="key" data-key="G">G</button>
        <button class="key" data-key="H">H</button>
        <button class="key" data-key="J">J</button>
        <button class="key" data-key="K">K</button>
        <button class="key" data-key="L">L</button>
        <div class="space"></div>
        <button data-enter class="key large">Enter</button>
        <button class="key" data-key="Z">Z</button>
        <button class="key" data-key="X">X</button>
        <button class="key" data-key="C">C</button>
        <button class="key" data-key="V">V</button>
        <button class="key" data-key="B">B</button>
        <button class="key" data-key="N">N</button>
        <button class="key" data-key="M">M</button>
        <button data-delete class="key large">
          <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
            <path fill="var(--color-tone-1)" d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"></path>
          </svg>
        </button>
      </div>
    </div>
  )
};

export default App;
