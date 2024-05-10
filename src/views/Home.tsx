import buttonClickSound from "../assets/button-click-sound.mp3";
import { HomeProps } from "../utils/types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import backgroundMusic from "../assets/game.mp3";
import valuehero from "../assets/valuehero.png";
import AudioComponent from "../components/Audio";

const Home: React.FC<HomeProps> = ({ }) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const navigate = useNavigate();

    const goToGame = (): void => {
        playSound();
        navigate("/game");
    };

    const goToHighscore = (): void => {
        playSound();
        navigate("/scores");
    };

    const playSound = () => {
        const audio = new Audio(buttonClickSound);
        audio.play();
    };

    const handlePress = () => {
        switch (activeIndex) {
            case 0:
                goToGame();
                break;
            case 1:
                goToHighscore();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            event.preventDefault();
            event.stopPropagation();
            console.log("key", event.key, "code", event.keyCode);

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
                <div className="">
                    <div className="absolute w-full hero-img">
                        <img className="w-2/4 max-w-72 m-auto" src={valuehero} />
                    </div>

                    <div className="title-wrapper mb-8 floating">
                        <h1 className="sweet-title">
                            <span data-text="#ValueHero">#ValueHero</span>
                        </h1>
                    </div>


                    <div className="flex flex-col gap-4">
                        <button className={(activeIndex === 0 ? "active" : "") + " kave-btn"}>
                            <span className="kave-line"></span>
                            Starten!
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
                volume={0.005}
            />
        </div >
    );
};

export default Home;
