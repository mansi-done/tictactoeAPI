/*
  This file consists of the model schema
  used for the game.

*/

var mongoose = require("mongoose");
var tictactoe = new mongoose.Schema({
  gameId: String,
  visitedArray: [[Number]],
  rowMap1: Map,
  colMap1: Map,
  rowMap2: Map,
  colMap2: Map,
  diagonalValues: [Number], //d1,d1,ad1,ad2
  player1Chance: Boolean,
  winner: Number,
  round: Number,
  n: Number,
});

module.exports = new mongoose.model("Tictactoe", tictactoe);

