// Packages import
const express = require("express");
const bodyParser = require("body-parser");
const { v1: uuidv1 } = require("uuid");
const mongoose = require("mongoose");

// APP
const app = express();

// Local requirements
const tools = require("./tictactoe");

// Enviornment Variables
require("dotenv").config();
const dburl = process.env.ATLAS_URI;
const port = process.env.PORT;
const mykey = process.env.MY_KEY;

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

// Extra app use
app.use(bodyParser.urlencoded({ extended: true }));
var cors = require("cors");
app.use(cors());

/*
  REQUEST
    Function name: Get All Games 
    Path : "/"
    Method : GET
    Query Parameters: none
    Headers: none
    body : none

  RESPONSE 
    JSON Object of all games.
  
  Function that returns all the played games.
*/
app.get("/", async (req, res) => {
  const data = await tictactoeModel.find({});
  res.send(data);
});

/*
  REQUEST
    Function name: Start Game 
    Path : "/start"
    Method : POST
    Query Parameters: none
    Headers: {
      "Content-Type": "application/x-www-form-urlencoded" [OPTIONAL] // IF board size is specified
    }
    body : {
      game_num : number [OPTIONAL] // specifies the board size, by default 3*3
    }

  RESPONSE  
    JSON Object of the started game with tictactoemodel from './tictactoemodel.js'

  Function that starts the tic tac toe game.
  If game_num is specified, the game with use a n*n board, by default it starts a
  game with 3*3 board.
*/

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
  const round = n * n;

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
    n: n,
  });

  const result = await newGame.save();
  res.status(200).send(result);
});

/*
  REQUEST
    Function name: Game Status
    Path : "/gameStatus"
    Method : POST
    Query Parameters: {
      gameId: string // game id of the game should be sent with the request
    }
    Headers: none
    body : none

  RESPONSE  
    JSON Object of the started game with tictactoemodel from './tictactoemodel.js'

  Function that returns the status of the game 
*/
app.post("/gameStatus", async (req, res) => {
  const gameId = req.query.gameId;
  const game = await tictactoeModel.findOne({ gameId: gameId });
  res.send(game);
});

/*
  REQUEST
    Function name: Play Move 
    Path : "/move"
    Method : POST
    Query Parameters: {
      gameId: string // game id of the game should be sent with the request
    }
    Headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    body :{
      'row': Number, // row number of the move 
      'col': Number, // column number of the move
    }

  RESPONSE 
    JSON Object of the game after making the move , with tictactoemodel from './tictactoemodel.js'
  
  Function that makes the move with positions what came along with request
  and responds with game status of the board.
*/
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

/*
  REQUEST
    Function name: Delete One game
    Path : "/deletegame"
    Method : POST
    Query Parameters: {
      gameId: string // game id of the game should be sent with the request
    }
    Headers: none
    body : none

  RESPONSE 
    JSON response of deleting acknowledgement.
  
  Function that deletes a game
*/

app.post("/deletegame", async (req, res) => {
  const gameId = req.query.gameId;
  if (gameId === undefined)
    res.status(404).send("gameId is required");
  else {
    const del = await tictactoeModel.deleteOne({gameId: gameId});
    console.log(del.deletedCount)
    if(del.deletedCount == '0') res.status(404).send("Game does not exist, please send correct gameId");
    else res.status(200).send(del);
  }
});

/*
  REQUEST
    Function name: Delete ALL Games
    Path : "/delete"
    Method : POST
    Query Parameters: {
      key: string // a private key for deleting all the games
    }
    Headers: none
    body : none

  RESPONSE 
    JSON response of deleting acknowledgement
  
  Function that deletes all games, recognises only a private key.
*/

app.post("/delete", async (req, res) => {
  const key = req.query.key;
  if (key === undefined)
    res.status(404).send("Key Param is required");
  else {
    if (key == mykey) {
      const del = await tictactoeModel.deleteMany({});
      res.send(del);
    } else res.status(404).send("Key is incorrect, cannot delete");
  }
});


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
