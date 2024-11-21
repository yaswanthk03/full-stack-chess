import { useEffect, useState } from "react";
import Button from "../components/button";
import Chessboard from "../components/chessboard";
import { useSocket } from "../hooks/useSocket";
import { Chess, Color, Square } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "../components/messages";

const Game = () => {
  const socket = useSocket();

  const [chess, setChess] = useState(new Chess());
  const [board, setBoard] = useState(chess.board());
  const [gameColor, setGameColor] = useState<Color>("w");
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [startPlay, setStartPlay] = useState<boolean>(false);
  const [opponentMove, setOpponentMove] = useState<string[] | null>(null);

  useEffect(() => {
    if (!socket) {
      return;
    }
    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      //console.log(message);
      switch (message.type) {
        case INIT_GAME:
          setBoard(chess.board());
          setGameColor(message.payload.color === "white" ? "w" : "b");
          setStartTime(new Date());
          //console.log("Game initialized");
          break;
        case MOVE:
          const move = message.payload.move;
          chess.move(move);
          //console.log(chess.board());
          setBoard(chess.board());
          setOpponentMove([move.from, move.to]);
          //console.log(board);
          console.log("Move piece");
          break;
        case GAME_OVER:
          console.log("Game over");
          break;
        default:
          break;
      }
    };
  }, [socket]);

  if (!socket) {
    return <div>Connecting...</div>;
  }
  return (
    <div className="flex justify-center">
      <div className="pt-8 max-w-screen-lg w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="">
            <Chessboard
              board={board}
              socket={socket}
              color={gameColor}
              chess={chess}
              setBoard={setBoard}
              isGameStarted={!!startTime}
              opponentMove={opponentMove}
            />
          </div>
          {!startPlay && (
            <div className="">
              <Button
                onClick={() => {
                  socket.send(
                    JSON.stringify({
                      type: INIT_GAME,
                    })
                  );
                  setStartPlay(true);
                }}
              >
                Play
              </Button>
            </div>
          )}
          {!startTime && startPlay && "Waiting for opponent..."}
          {startTime && (
            <div>
              Game started at {startTime.getHours()}:{startTime.getMinutes()}
              <div className="flex flex-wrap max-w-48 justify-between">
                {chess.history({ verbose: true }).map((move, i) => (
                  <div>
                    <div key={i} className="flex flex-row max-w-24 mt-2">
                      <img
                        className="h-6"
                        src={`${move.color}${move.piece}.png`}
                      />
                      : {move.from} {move.to}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Game;
