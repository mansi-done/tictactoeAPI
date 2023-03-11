const express = require("express");
const bodyParser = require("body-parser");
const { v1: uuidv1 } = require("uuid");
const app = express();
const port = 3000;

const tools = require("./tictactoe");
const mongoose = require("mongoose");

require("dotenv").config();
const dburl = process.env.ATLAS_URI;

// mongodb connection 
mongoose
  .connect(dburl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "game",
  })
  .then(
    (dbo) => {
      console.log("DB connected");
    },
    (err) => {
      console.log(err);
    }
  );

// mangodb model
var tictactoeModel = require("./tictactoemodel");
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", async (req, res) => {
  const data = await tictactoeModel.find({});
  res.send(data);
});

app.post("/start", async (req, res) => {
  const gameId = uuidv1();
  const n = req.body.game_num || 3;

  const visArray = tools.createVisitedArray(n);
  const rowMap1 = tools.createMaps();
  const colMap1 = tools.createMaps();
  const rowMap2 = tools.createMaps();
  const colMap2 = tools.createMaps();
  const diagonals = tools.createDiagonalArray();
  const player1Chance = true;
  const winner = 0;
  const round = n*n;

  const newGame = new tictactoeModel({
    gameId: gameId,
    visitedArray: visArray,
    rowMap1: rowMap1,
    colMap1: colMap1,
    rowMap2: rowMap2,
    colMap2: colMap2,
    diagonalValues: diagonals,
    player1Chance: player1Chance,
    winner: winner,
    round: round,
    n:n,
  });

  const result = await newGame.save();
  res.status(200).send(result);
});

app.post("/gameStatus", async (req, res) => {
  const gameId = req.query.gameId;
  const game = await tictactoeModel.findOne({ gameId: gameId });
  res.send(game);
});

app.post("/move", async (req, res) => {
  const gameId = req.query.gameId;
  const game = await tictactoeModel.findOne({ gameId: gameId });

  const row = req.body.row;
  const col = req.body.col;

  if (game.round < 1 || game.winner != 0) {
    var winnerstring;
    if (game.winner == 0) {
      winnerstring = "Game is tied";
    } else
      winnerstring = "Game Already over, winner is " + game.winner.toString();
    res.send(winnerstring);
  } else {
    if (row == undefined || col == undefined) {
      res.status(406).send("row and col must be specified,try again");
    } else {
      if (tools.checkValidRowCol(game, row, col)) {
        newgame = tools.playMove(game, row, col);
        await game.updateOne(newgame);

        if (newgame.winner != 0) {
          const winnerstring = "Game Over, Winner is " + game.winner.toString();
          res.send(winnerstring);
        } else if (newgame.round == 0) {
          const winnerstring = "Game is tied";
          res.send(winnerstring);
        } else res.send(game);
      } else res.status(404).send("Invalid Indices");
    }
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
