import pongImage from "../assets/pong-header.png";
import multiPlayerIcon from "../assets/multi-player.png";
import buttonClickSound from "../assets/button-click-sound.mp3";
import { HomeProps } from "../utils/types";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home: React.FC<HomeProps> = ({ }) => {
    useEffect(() => {
        const swalEl: HTMLElement | null = document.querySelector(
            ".swal-overlay",
        ) as HTMLElement | null;
        if (swalEl) {
            swalEl.remove();
        }
    }, []);

    const navigate = useNavigate();

    const startGame = (): void => {
        playSound();
        navigate("/game");
    };

    const highscore = (): void => {
        navigate("/score");
    };

    const playSound = () => {
        const audio = new Audio(buttonClickSound);
        audio.play();
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-md">
                    <h1 className="text-5xl font-bold">Team Pong</h1>
                    <button className="btn btn-primary" onClick={startGame}>Start game!</button>
                    <button className="btn btn-primary" onClick={highscore}>highscore</button>
                </div>
            </div>
        </div >
    );
};

export default Home;
