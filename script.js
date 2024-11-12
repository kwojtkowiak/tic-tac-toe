const Gameboard = (function () {
  const board = Array(9).fill(null)

  const getBoard = () => board

  const setCell = (index, player) => {
    if (index >= 0 && index < 9 && !board[index]) {
      board[index] = player
      return true
    }
    return false
  }

  const resetBoard = () => {
    board.fill(null)
  }

  return { getBoard, setCell, resetBoard }
})()

function Player(name, marker) {
  return { name, marker }
}

const GameController = (function () {
  const playerX = Player('Player X', 'X')
  const playerO = Player('Player O', 'O')
  let currentPlayer = playerX

  function updateCurrentPlayer() {
    currentPlayer = currentPlayer === playerX ? playerO : playerX
  }

  function getCurrentPlayer() {
    return currentPlayer
  }

  function playTurn(index) {
    if (Gameboard.setCell(index, currentPlayer.marker)) {
      DisplayController.render()
      if (checkWin()) {
        DisplayController.displayWinner(currentPlayer.name)
      } else if (isDraw()) {
        DisplayController.displayDraw()
      } else {
        updateCurrentPlayer()
        DisplayController.updateMessage(`${getCurrentPlayer().name}'s turn`)
      }
    }
  }

  const checkWin = () => {
    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    return winningCombinations.some((combo) => {
      const [a, b, c] = combo
      const board = Gameboard.getBoard()
      return board[a] && board[a] === board[b] && board[a] === board[c]
    })
  }

  function isDraw() {
    return Gameboard.getBoard().every((cell) => cell !== null)
  }

  function resetGame() {
    Gameboard.resetBoard()
    currentPlayer = playerX
    DisplayController.clearBoard()
    DisplayController.updateMessage("Player X's turn")
  }

  return { playTurn, resetGame, getCurrentPlayer }
})()

const DisplayController = (() => {
  const cells = document.querySelectorAll('[data-cell]')
  const messageElement = document.querySelector('.title')
  const restartButton = document.querySelector('.restart-button')

  cells.forEach((cell, index) => {
    cell.addEventListener('click', () => GameController.playTurn(index))
  })

  restartButton.addEventListener('click', GameController.resetGame)

  function clearBoard() {
    cells.forEach((cell) => (cell.textContent = ''))
  }

  function displayWinner(winner) {
    updateMessage(`${winner} wins!`)
  }

  function displayDraw() {
    updateMessage("It's a draw!")
  }

  const updateMessage = (message) => {
    messageElement.textContent = message
  }

  const render = () => {
    const board = Gameboard.getBoard()
    cells.forEach((cell, index) => {
      cell.textContent = board[index]
    })
  }

  return { clearBoard, displayWinner, displayDraw, updateMessage, render }
})()
