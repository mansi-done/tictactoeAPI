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
  createVisitedArray: function (n) {
    var vis = makeArray(n, n, 0);
    return vis;
  },
  createMaps: function () {
    let map = new Map();
    return map;
  },
  createDiagonalArray: function () {
    var diag = [0, 0, 0, 0];
    return diag;
  },

  checkValidRowCol: function (game, row, col) {
    const vis = game.visitedArray;
    const n = game.n;
    if (row < n && col < n && row >= 0 && col >= 0 && vis[row][col] == 0)
      return true;
    return false;
  },

  playMove: function (game, row, col) {
    const n = game.n;
    if (game.player1Chance) {
      //player1 chance
      game.visitedArray[row][col] = 1;
      if (row == col) {
        game.diagonalValues[0] = game.diagonalValues[0] + 1;
        if (game.diagonalValues[0] == n) {
          game.winner = 1;
          return game;
        }
      }

      if (Number(row) + Number(col) == n-1) {
        console.log("yes her");
        console.log(game.diagonalValues[2]);
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

      if (game.colMap1.get(row) == undefined) game.colMap1.set(col, 0);
      game.colMap1.set(col, game.colMap1.get(col) + 1);
      if (game.colMap1.get(col) == n) {
        game.winner = 1;
        return game;
      }
    } else {
      //player2 chance
      game.visitedArray[row][col] = 2;
      if (row == col) {
        game.diagonalValues[1] = game.diagonalValues[1] + 1;
        if (game.diagonalValues[1] == n) {
          game.winner = 2;
          return game;
        }
      }

      if (Number(row) + Number(col) == n-1) {
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

      if (game.colMap2.get(row) == undefined) game.colMap2.set(col, 0);
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
