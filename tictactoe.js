/*
  This file consists all the function and logic
  for the TicTacToe application.

  The functions in this module repeatedly get called 
  during the game play.
*/

function makeArray(w, h, val) {
  var arr = [];
  for (let i = 0; i < h; i++) {
    arr[i] = [];
    for (let j = 0; j < w; j++) {
      arr[i][j] = val;
    }
  }
  return arr;
}

module.exports = {
  // Function to create a 2D array
  createVisitedArray: function (n) {
    var vis = makeArray(n, n, 0);
    return vis;
  },
  // Function to create a MAP
  createMaps: function () {
    let map = new Map();
    return map;
  },
  // Function to create arrays for diagonals
  createDiagonalArray: function () {
    var diag = [0, 0, 0, 0];
    return diag;
  },

  // Function that checks if the indices (row, column) in the request are correct.
  checkValidRowCol: function (game, row, col) {
    const vis = game.visitedArray;
    const n = game.n;
    if (row < n && col < n && row >= 0 && col >= 0 && vis[row][col] == 0)
      return true;
    return false;
  },


  // Function that manipulates the board on the basis of the move that has been requested.
  playMove: function (game, row, col) {
    const n = game.n;
    if (game.player1Chance) {
      // Player 1 chance
      game.visitedArray[row][col] = 1;
      if (row == col) {
        game.diagonalValues[0] = game.diagonalValues[0] + 1;
        if (game.diagonalValues[0] == n) {
          game.winner = 1;
          return game;
        }
      }

      if (Number(row) + Number(col) == n - 1) {
        game.diagonalValues[2] = game.diagonalValues[2] + 1;
        if (game.diagonalValues[2] == n) {
          game.winner = 1;
          return game;
        }
      }

      if (game.rowMap1.get(row) == undefined) game.rowMap1.set(row, 0);
      game.rowMap1.set(row, game.rowMap1.get(row) + 1);
      if (game.rowMap1.get(row) == n) {
        game.winner = 1;
        return game;
      }

      if (game.colMap1.get(col) == undefined) game.colMap1.set(col, 0);
      game.colMap1.set(col, game.colMap1.get(col) + 1);
      if (game.colMap1.get(col) == n) {
        game.winner = 1;
        return game;
      }
    } else {
      // Player 2 chance
      game.visitedArray[row][col] = 2;
      if (row == col) {
        game.diagonalValues[1] = game.diagonalValues[1] + 1;
        if (game.diagonalValues[1] == n) {
          game.winner = 2;
          return game;
        }
      }

      if (Number(row) + Number(col) == n - 1) {
        game.diagonalValues[3] = game.diagonalValues[3] + 1;
        if (game.diagonalValues[3] == n) {
          game.winner = 2;
          return game;
        }
      }

      if (game.rowMap2.get(row) == undefined) game.rowMap2.set(row, 0);
      game.rowMap2.set(row, game.rowMap2.get(row) + 1);
      if (game.rowMap2.get(row) == n) {
        game.winner = 2;
        return game;
      }

      if (game.colMap2.get(col) == undefined) game.colMap2.set(col, 0);
      game.colMap2.set(col, game.colMap2.get(col) + 1);
      if (game.colMap2.get(col) == n) {
        game.winner = 2;
        return game;
      }
    }

    if (game.player1Chance) game.player1Chance = false;
    else game.player1Chance = true;
    game.round = game.round - 1;

    return game;
  },
};
