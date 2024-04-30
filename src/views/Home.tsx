import buttonClickSound from "../assets/button-click-sound.mp3";
import { HomeProps } from "../utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundMusic from "../assets/game.mp3";
import AudioComponent from "../components/Audio";

const Home: React.FC<HomeProps> = ({ }) => {
    const [activeIndex, setActiveIndex] = useState(0);


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

    const handlePress = () => {
        switch (activeIndex) {
            case 0:
                startGame();
                break;
            case 1:
                highscore();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    setActiveIndex((prev) => (prev + 1) % 2);
                    break;
                case 'ArrowDown':
                    setActiveIndex((prev) => (prev + 1) % 2);
                    break;
                case ' ':
                    handlePress();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [activeIndex]);



    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-center">
                <div className="max-w-lg">
                    <h1 className="title"><span className="text-sky-300">|</span> PonQ <span className="text-sky-300">|</span> </h1>
                    <div className="flex flex-col gap-4">

                        <button className={(activeIndex === 0 ? "active" : "") + " kave-btn"}>
                            <span className="kave-line"></span>
                            Start game!
                        </button>

                        <button className={(activeIndex === 1 ? "active" : "") + " kave-btn"}>
                            <span className="kave-line"></span>
                            Highscore
                        </button>

                    </div>
                </div>
            </div>
            <AudioComponent
                onAudioEnd={() => { }}
                path={backgroundMusic}
                volume={0.01}
            />
        </div>
    );
};

export default Home;
