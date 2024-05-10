import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getScores, saveScore } from "../utils/scores";

const EnterScore: React.FC = () => {
    const [teamName, setTeamName] = useState('');
    const [currentLetter, setCurrentLetter] = useState('A');
    const [activeIndex, setActiveIndex] = useState(0); // 0: Letter, 1: Remove, 2: Confirm
    const [score, setScore] = useState<number>(0);
    const currentScores = getScores();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowLeft':
                    // Change to previous letter if the first option is active
                    if (activeIndex === 0) updateCurrentLetter(-1);
                    break;
                case 'ArrowRight':
                    // Change to next letter if the first option is active
                    if (activeIndex === 0) updateCurrentLetter(1);
                    break;
                case 'ArrowUp':
                    // Move selection up
                    setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
                    break;
                case 'ArrowDown':
                    // Move selection down
                    setActiveIndex(prev => (prev < 2 ? prev + 1 : 2));
                    break;
                case ' ':
                    // Activate the selected option
                    handleSpace();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        const query = new URLSearchParams(location.search);
        const scoreParam = query.get('score');
        if (scoreParam) {
            setScore(parseInt(scoreParam, 10));
        }

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [currentLetter, activeIndex]);

    const updateCurrentLetter = (direction: number) => {
        let currentCharCode = currentLetter.charCodeAt(0);
        if (direction === 1 && currentCharCode === 90) {
            currentCharCode = 65;
        } else if (direction === -1 && currentCharCode === 65) {
            currentCharCode = 90;
        } else {
            currentCharCode += direction;
        }
        setCurrentLetter(String.fromCharCode(currentCharCode));
    };

    const handleSpace = () => {
        if (activeIndex === 0) {
            addLetter();
        } else if (activeIndex === 1) {
            removeLastLetter();
        } else if (activeIndex === 2) {
            confirmName();
        }
    };

    const addLetter = () => {
        setTeamName(prev => prev + currentLetter);
    };

    const removeLastLetter = () => {
        setTeamName(prev => prev.slice(0, -1));
    };

    const confirmName = () => {
        if (teamName.length === 0) return;

        saveScore(score, teamName);
        navigate('/scores');
    };

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-left flex-col">
                <div className="text-4xl ">Euer score: {score}</div>
                <div className="text-center">
                    <div className="flex gap-2 justify-center">
                        <span>Euer Team Name: </span>
                        <div>{teamName}<span className="blink-ani ml-1">{currentLetter}</span></div>

                    </div>
                    <div>
                        <div className={"p-4 text-center flex gap-2 justify-center"}>
                            <kbd className="p-2">◀︎</kbd>
                            <span className={(activeIndex === 0 ? "bg-primary" : "") + " kbd"}>{currentLetter}</span>
                            <kbd className="p-2">▶︎</kbd>
                        </div>
                        <div className="flex gap-4 p-4">
                            <div className={"p-2 kbd " + (activeIndex === 1 ? "bg-primary" : "")} onClick={removeLastLetter}>
                                Löschen
                            </div>
                            <div className={(activeIndex === 2 ? "bg-primary" : "") + " kbd"} onClick={confirmName}>
                                Bestätigen
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EnterScore;
