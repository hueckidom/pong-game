import React, { useEffect, useRef, useState } from "react";
import { Question, QuestionDialogProps, gamepad } from "../utils/types";
import questions from "../assets/questions.json";
import { addGamePadListener, isDownPressed, isUpPressed, removeGamePadListener } from "../utils/gamepad";
import { gameDefaults } from "../views/Game";

const state: any = {
    question: undefined,
    activeIndex: 0
};

const QuestionDialogCmp: React.FC<QuestionDialogProps> = ({
    value,
    correct,
    wrong,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [question, setQuestion] = useState<Question | undefined>(undefined);
    const [timer, setTimer] = useState(gameDefaults.questionSeconds);
    let timeout: any;

    useEffect(() => {
        if (timer > 0) {
            timeout = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(timeout);
        } else {
            wrong();
        }

        return () => {
            if (timeout) {
                clearTimeout(timeout);
            }
        };
    }, [timer]);

    const indexToAlpha = (index: number): string => {
        switch (index) {
            case 0:
                return 'A';
            case 1:
                return 'B';
            case 2:
                return 'C';
            case 3:
                return 'D';
            default:
                return '';
        }
    };

    const handleSpace = () => {
        const answerToIndex = indexToAlpha(state.activeIndex);
        if (answerToIndex == state?.question?.answer) {
            correct();
        } else {
            wrong();
        }
    };

    useEffect(() => {
        state.activeIndex = activeIndex;
        state.question = question;
    }, [activeIndex, question]);

    useEffect(() => {
        // const questionToCategory = questions.filter((q) => q.category == value);
        // const randoms = questions.filter((o) => o.category === "random");
        // const allQuestions = [...questionToCategory, ...randoms];
        const randomQuestion: Question = questions[Math.floor(Math.random() * questions.length)];
        setQuestion(randomQuestion);

        const handleKeyPress = (event: KeyboardEvent) => {
            event.preventDefault();
            event.stopPropagation();

            switch (event.key) {
                case 'ArrowUp':
                    const newIndex = state.activeIndex > 0 ? state.activeIndex - 1 : 0;
                    setActiveIndex(newIndex);
                    break;
                case 'ArrowDown':
                    const newIndexD = state.activeIndex < 3 ? state.activeIndex + 1 : 3;
                    setActiveIndex(newIndexD);
                    break;
                case ' ':
                    handleSpace();
                    break;
                default:
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyPress);

        const gamePadhandler = (input: gamepad) => {
            if (input.type === 'button' && input.pressed) {
                handleSpace();
                return;
            }

            if (isDownPressed(input)) {
                const newIndex = state.activeIndex > 0 ? state.activeIndex - 1 : 0;
                setActiveIndex(newIndex);
            }

            if (isUpPressed(input)) {
                const newIndexD = state.activeIndex < 3 ? state.activeIndex + 1 : 3;
                console.log('newIndexD', newIndexD);
                setActiveIndex(newIndexD);
            }
        };

        const padIndex = addGamePadListener(gamePadhandler);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            removeGamePadListener(gamePadhandler, padIndex);
        };
    }, []);

    return (
        <div className="hero min-h-screen bg-base-300 fixed z-20 top-0 opacity-95 backdrop-blur-md">
            <div className="hero-content text-left flex-col px-4">
                <div className="title-wrapper mb-8 floating">
                    <h1 className="sweet-title sweet-title-mixed game-title">
                        <span data-text={timer}>{timer}</span>
                    </h1>
                </div>
                <div className="text-2xl font-bold">{question?.question}</div>
                <div className="flex flex-col gap-2">
                    <div className={`kbd w-full text-xl ${activeIndex === 0 ? 'bg-primary' : ''}`}>{question?.A}</div>
                    <div className={`kbd text-xl ${activeIndex === 1 ? 'bg-primary' : ''}`}>{question?.B}</div>
                    <div className={`kbd text-xl ${activeIndex === 2 ? 'bg-primary' : ''}`}>{question?.C}</div>
                    <div className={`kbd text-xl ${activeIndex === 3 ? 'bg-primary' : ''}`}>{question?.D}</div>
                </div>
            </div>
        </div>
    );
};

export default QuestionDialogCmp;
