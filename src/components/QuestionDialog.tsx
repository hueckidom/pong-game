import React, { useEffect, useRef, useState } from "react";
import { AudioComponentProps, Question, QuestionDialogProps } from "../utils/types";
import questions from "../assets/questions.json";

const QuestionDialogCmp: React.FC<QuestionDialogProps> = ({
    correct,
    wrong,
}) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [question, setQuestion] = useState<Question | undefined>(undefined);

    useEffect(() => {
        const randomQuestion: Question = questions[Math.floor(Math.random() * questions.length)];
        setQuestion(randomQuestion);
    }, []);

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
        if (indexToAlpha(activeIndex) === question?.answer) {
            correct();
        } else {
            wrong();
        }
    };

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            switch (event.key) {
                case 'ArrowUp':
                    setActiveIndex((prev) => (prev > 0 ? prev - 1 : 0));
                    break;
                case 'ArrowDown':
                    setActiveIndex((prev) => (prev < 3 ? prev + 1 : 3));
                    break;
                case ' ':
                    handleSpace();
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
        <div className="hero min-h-screen bg-base-300 fixed z-20 top-0 opacity-90 backdrop-blur-md">
            <div className="hero-content text-left flex-col">
                <div className="text-xl font-bold">{question?.question}</div>
                <div className="flex flex-col gap-2">
                    <div className={`kbd w-full ${activeIndex === 0 ? 'bg-primary' : ''}`}>{question?.A}</div>
                    <div className={`kbd ${activeIndex === 1 ? 'bg-primary' : ''}`}>{question?.B}</div>
                    <div className={`kbd ${activeIndex === 2 ? 'bg-primary' : ''}`}>{question?.C}</div>
                    <div className={`kbd ${activeIndex === 3 ? 'bg-primary' : ''}`}>{question?.D}</div>
                </div>
            </div>
        </div>
    );
};

export default QuestionDialogCmp;
