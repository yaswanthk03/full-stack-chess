import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  private board: Chess;
  private startTime: Date;
  public gameId: string;

  constructor(player1: WebSocket, player2: WebSocket, gameId: string) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    this.startTime = new Date();
    this.gameId = gameId;
    player1.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "white",
          gameId: this.gameId,
        },
      })
    );
    player2.send(
      JSON.stringify({
        type: INIT_GAME,
        payload: {
          color: "black",
          gameId: this.gameId,
        },
      })
    );
  }
  makeMove(
    player: WebSocket,
    move: {
      from: string;
      to: string;
      promotion?: string;
    }
  ) {
    // validate move
    // Is it the player's turn?
    if (player === this.player1 && this.board.turn() === "b") {
      player.send("It's not your turn");
      return;
    }
    if (player === this.player2 && this.board.turn() === "w") {
      player.send("It's not your turn");
      return;
    }

    try {
      console.log(move);
      this.board.move(move);
    } catch (e) {
      //send the error message to the player
      player.send(JSON.stringify(e));
      console.log(e);
      return;
    }

    //send the move to the other player
    const otherPlayer = player === this.player1 ? this.player2 : this.player1;
    otherPlayer.send(
      JSON.stringify({
        type: MOVE,
        payload: { move: move, board: this.board.fen() },
      })
    );

    // Update the board
    //push the move to the moves array

    // Check for checkmate
    if (this.board.isCheckmate()) {
      //send the game over message to both players
      this.player1.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            result: "checkmate",
            winner: player === this.player1 ? "black" : "white",
          },
        })
      );

      this.player2.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            result: "checkmate",
            winner: player === this.player1 ? "black" : "white",
          },
        })
      );

      return;
    }

    // Check for stalemate
    if (this.board.isStalemate()) {
      //send the game over message to both players
      this.player1.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            result: "stalemate",
          },
        })
      );

      this.player2.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            result: "stalemate",
          },
        })
      );

      return;
    }

    // Check for draw
    if (this.board.isDraw()) {
      //send the game over message to both players
      this.player1.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            result: "draw",
          },
        })
      );

      this.player2.send(
        JSON.stringify({
          type: "game_over",
          payload: {
            result: "draw",
          },
        })
      );

      return;
    }

    //send the updated board to both players
  }
}
