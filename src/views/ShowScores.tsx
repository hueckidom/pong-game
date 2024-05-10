import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Score } from "../utils/types";
import QuestionDialogCmp from "../components/QuestionDialog";

const ShowScores: React.FC = () => {
    const [highscores, setHighscores] = useState<Score[]>([]);
    const navigate = useNavigate();

    const handleKeyPress = (event: KeyboardEvent) => {
        event.preventDefault();
        event.stopPropagation();

        if (event.key === ' ') {
            navigate('/');
        }
    }

    useEffect(() => {
        const scores = localStorage.getItem('highscores');
        if (scores) {
            setHighscores(JSON.parse(scores));
        }

        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, []);


    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-left flex-col bg-base-300 p-4 rounded-lg min-w-96">

                <div className="title-wrapper mb-12 floating">
                    <h1 className="sweet-title">
                        <span data-text="Top-Heros">Top-Heros</span>
                    </h1>
                </div>

                <div className="overflow-x-auto w-full">
                    <table className="table w-full">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Team</th>
                                <th>Score</th>
                            </tr>
                        </thead>
                        <tbody className="text-xl">
                            {highscores.map((score, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{score.name}</td>
                                    <td>{score.score}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default ShowScores;
