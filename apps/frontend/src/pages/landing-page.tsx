import { useNavigate } from "react-router-dom";
import Button from "../components/button";

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="flex md:flex-row flex-col gap-4 justify-center ">
      <div className="">
        <img
          className="m-2 md:max-w-lg lg:max-w-xl"
          src="/chess.png"
          alt="chess board"
        />
      </div>
      <div className="md:max-w-xs md:mt-28 text-center">
        <h1 className="text-3xl font-bold text-center">Play Chess</h1>
        <p className="text-lg">
          Play chess with a friend or against the computer. No registration
          required.
        </p>
        <Button onClick={() => navigate("/game")}>Play</Button>
      </div>
    </div>
  );
};

export default LandingPage;
