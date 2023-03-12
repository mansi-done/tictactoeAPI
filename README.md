# Scalable Tic Tac Toe API
Here is an API by which we can play TicTacToe for any N x N size board.
### Complexity
The time complexity for each move is : **O(1)**
The overall spae complexity of each game : is **O(N)**

The base URL: https://tictactoe-game.up.railway.app/

### Endpoints
1. */start* :  Endpoint to start a new game, returns a game with gameId and more game information, the gameId is used in turn to play the game further.
	Headers: 
      "Content-Type": "application/x-www-form-urlencoded" (OPTIONAL) // IF board size is specified
    Body :
      game_num : number (OPTIONAL) // specifies the board size, by default 3x3
    
    
2. */gameStatus* : To return the status of a particular game
	Query Params:
		gameId: string // game id of the game should be sent with the request
		
    
3. */move* : To play a particular move
	Query Params:
		gameId: string // game id of the game should be sent with the request
	Headers: "Content-Type": "application/x-www-form-urlencoded" 
	
    Body :
      row : number  // row of the move
      col : number  // col of the move 
      
      
 4. */deletegame* :  To delete a particular game play
	 Query Params:
		gameId: string // game id of the game should be sent with the request
