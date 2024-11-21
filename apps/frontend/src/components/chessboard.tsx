import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "./messages";

const Chessboard = ({
  board,
  socket,
  color,
  chess,
  setBoard,
  isGameStarted,
  opponentMove,
}: {
  board: ({
    square: Square;
    type: PieceSymbol | null;
    color: Color | null;
  } | null)[][];
  socket: WebSocket;
  color: Color;
  chess: any;
  setBoard: any;
  isGameStarted: boolean;
  opponentMove: string[] | null;
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  const [highlighted, setHighlighted] = useState<string[]>(); // Highlighted squares

  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 8; j++) {
      if (board[i][j] === null) {
        board[i][j] = {
          square: `${j}${8 - i}` as Square,
          type: null,
          color: null,
        };
      } else if (board[i][j]?.color !== color) {
        board[i][j] = {
          square: `${j}${8 - i}` as Square,
          type: board[i][j]?.type ?? null,
          color: board[i][j]?.color ?? null,
        };
      }
    }
  }
  if (color === "b") {
    board = board.slice().reverse();
    for (let i = 0; i < board.length; i++) {
      board[i] = board[i].slice().reverse();
    }
  }

  const handlePossibleMoves = (square: Square) => {
    console.log(square, "handlePossibleMoves");

    const moves = chess.moves({ square, verbose: true });
    console.log(moves);

    const possibleMoves = moves.map((move: any) => {
      const m = move.to;
      const id = "01234567"[parseInt(m[0], 26) - 10] + m[1];
      return id;
    });
    console.log(possibleMoves);

    setHighlighted(possibleMoves);
    console.log(highlighted);
  };

  const handleClick = (square: Square) => {
    if (!isGameStarted) {
      return;
    }
    console.log(square);

    if (
      square[0] >= "a" &&
      square[0] <= "h" &&
      square[1] >= "1" &&
      square[1] <= "8"
    ) {
      setFrom(square as Square);
      handlePossibleMoves(square as Square);
      // Set highlighted squares directly
    } else if (from) {
      const to = "abcdefgh"[parseInt(square[0])] + square[1];
      const promotion = "q";
      try {
        setHighlighted([]);
        chess.move({
          from,
          to,
          promotion,
        });

        setBoard(chess.board());
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: {
              move: {
                from,
                to,
                promotion,
              },
            },
          })
        );
        setFrom(null);
      } catch (e) {
        console.log(e);
        setFrom(null);
        return;
      }
    }
  };

  return (
    <div className="border-solid border-black border-2">
      {board.map((row, i) => (
        <div key={i} className="flex">
          {row.map((square, j) => {
            const squareId = square?.square || `${j}${8 - i};`;
            return (
              <div
                key={j}
                id={squareId}
                className={`relative w-16 h-16 flex justify-center items-center pointer-events-auto
    ${(i + j) % 2 === 0 ? "bg-[#EBECD0]" : "bg-[#739552]"}`}
                onClick={() => handleClick(squareId as Square)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (squareId[0] >= "0" && squareId[0] <= "7")
                    handleClick(squareId as Square);
                  else {
                    setFrom(null);
                    setHighlighted([]);
                  }
                }}
              >
                {highlighted?.includes(squareId) &&
                  (square?.type ? (
                    <div className="absolute inset-0 bg-red-600 opacity-50"></div>
                  ) : (
                    <div className="absolute inset-0 bg-[#FFFF33] opacity-50"></div>
                  ))}
                <div>
                  {square?.color && (
                    <img
                      src={`/${square.color + square.type}.png`}
                      draggable
                      onDragStart={() => handleClick(squareId as Square)}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Chessboard;
