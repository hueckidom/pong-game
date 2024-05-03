import React, { useEffect, useRef, useState } from "react";
import correctSound from "../assets/correct.mp3";
import questionSound from "../assets/questions.mp3";
import wrongSound from "../assets/wrong.mp3";
import {
    BaseSettings,
    MultiplePlayerModeProps,
    ball,
    player,
} from "../utils/types";
import hitSound from "../assets/Paddle Ball Hit Sound Effect HD.mp3";
import goalSound from "../assets/goal.mp3";
import { useNavigate } from "react-router-dom";
import AudioComponent from "../components/Audio";
import backgroundMusic from "../assets/game.mp3";
import { determineBoardWidth } from "../utils/board";
import QuestionDialogCmp from "../components/QuestionDialog";

let isPlaying1 = false;
let bubble: any = null;

export let gameDefaults: BaseSettings = {
    baseVelocityX: 2,
    baseVelocityY: 1.2,
    boardHeightDivisor: 1.7,
    maxBoardWidth: 700,
    maxLife: 3,
    maxVelocityX: 5,
    moveSpeed: 4.5,
    playerHeight: 60,
    playerWidth: 8,
    key2Down: "s",
    key2Up: "w",
    keyDown: "ArrowDown",
    keyUp: "ArrowUp"
}

export const assignGameDefaults = (settings: BaseSettings) => {
    gameDefaults = settings;
}

const GameField: React.FC<MultiplePlayerModeProps> = ({
}) => {
    let boardWidth: number = determineBoardWidth();
    let boardHeight: number = boardWidth / gameDefaults.boardHeightDivisor;
    let context: CanvasRenderingContext2D;
    let board: HTMLCanvasElement;
    let playerWidth: number = gameDefaults.playerWidth;
    let playerHeight: number = gameDefaults.playerHeight;
    let playerVelocityY = 0;
    let moveSpeed = gameDefaults.moveSpeed;
    let maxVelocity = gameDefaults.maxVelocityX;
    let maxLife = gameDefaults.maxLife;

    let player1: player = {
        x: 2,
        y: boardHeight / 2,
        width: playerWidth,
        height: playerHeight,
        velocityY: playerVelocityY,
        stopPlayer: false
    };

    let player2: player = {
        x: boardWidth - playerWidth - 2,
        y: boardHeight / 2,
        width: playerWidth,
        height: playerHeight,
        velocityY: playerVelocityY,
        stopPlayer: false,
    };
    const ballWidth = 10;
    const ballHeight = 10;

    let ball: ball = {
        x: boardWidth / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: gameDefaults.baseVelocityX,
        velocityY: gameDefaults.baseVelocityY,
    };

    const [playHit, setPlayHit] = useState<boolean>(false);
    const [playGoal, setPlayGoal] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isQuestion, setIsQuestion] = useState<boolean>(false);
    const [isBackgroundMusicPlaying, setBackgroundMusicPlaying] =
        useState<boolean>(false);

    const [timer, setTimer] = useState(0);
    const timeRef = useRef<number>(0);
    const [life, setLife] = useState(maxLife);
    const timerRef = useRef<number | null>(null);

    const startTimer = (): void => {
        timerRef.current = window.setInterval(() => {
            if (isPlaying1 && !isPaused) {
                setTimer((prevTimer) => prevTimer + 1);
            }
        }, 1000);
    };

    useEffect(() => {
        timeRef.current = timer;
    }, [timer]);

    const resetTimer = () => {
        setTimer(0);
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
        }
    };
    const score = useRef<number>(0);
    const navigate = useNavigate();

    const detectCollision = (a: any, b: any) => {
        return (
            a.x < b.x + b.width && //a's top left corner doesn't reach b's top right corner
            a.x + a.width > b.x && //a's top right corner passes b's top left corner
            a.y < b.y + b.height && //a's top left corner doesn't reach b's bottom left corner
            a.y + a.height > b.y
        ); //a's bottom left corner passes b's top left corner
    };

    const [backgroundAudio] = useState(new Audio(backgroundMusic));

    useEffect(() => {
        backgroundAudio.volume = 0.18;
        backgroundAudio.play();

        return () => {
            backgroundAudio.pause();
            backgroundAudio.currentTime = 0;
        };
    }, []);

    const outOfBound = (y: number) => {
        return y < 0 || y + player1.height > boardHeight;
    };

    const startBubbleTimer = () => {
        const spawnInterval = Math.random() * 4000 + (10000);
        setTimeout(spawnBubble, spawnInterval);
    };

    const handleCorrectAnswer = () => {
        const audio = new Audio(correctSound);
        audio.play();
        score.current += timeRef.current;
        setIsQuestion(false);
        
        setTimeout(() => {
            triggerPause();
            bubble = null;
            startBubbleTimer();
        }, 250);
    }

    const handleWrongAnswer = () => {
        const audio = new Audio(wrongSound);
        audio.play();
        setIsQuestion(false);
        setLife((prevLife) => prevLife - 1);

        setTimeout(() => {
            triggerPause();
            bubble = null;
            startBubbleTimer();
        }, 250);
    }

    const drawBubble = () => {
        if (!bubble) return;

        context.beginPath();
        context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        context.fillStyle = '#fff';
        context.fill();
        context.font = '13px Arial';
        context.fillStyle = '#000';
        context.textAlign = 'center';
        context.fillText('?', bubble.x, bubble.y + 6);
    };

    const spawnBubble = () => {
        if (bubble) return;

        bubble = {
            x: boardWidth / 2,
            y: Math.random() * boardHeight / 1.5 + 20,
            radius: 13,
            velocityX: (Math.random() - 1.5) * 2.5,
            velocityY: 1.2
        };
    };

    const updateBubblePosition = () => {
        if (!bubble) return;

        let newX = bubble.x + bubble.velocityX;
        let newY = bubble.y + bubble.velocityY;

        // Check for canvas boundaries and make the bubble bounce off the edges
        if (newX < bubble.radius || newX > boardWidth - bubble.radius) {
            bubble.velocityX = -bubble.velocityX;
            newX = bubble.x + bubble.velocityX; // Correct position after reversing velocity
        }
        if (newY < bubble.radius || newY > boardHeight - bubble.radius) {
            bubble.velocityY = -bubble.velocityY;
            newY = bubble.y + bubble.velocityY; // Correct position after reversing velocity
        }

        bubble = { ...bubble, x: newX, y: newY };
    };

    const checkBubbleCollision = (player: any) => {
        if (!bubble) return;

        const dx = bubble.x - (player.x + player.width / 2);
        const dy = bubble.y - (player.y + player.height / 2);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < bubble.radius + Math.max(player.width, player.height) / 2) {
            handleBubbleTouch();
            bubble = null; // Remove the bubble after it has been touched
        }
    };

    const handleBubbleTouch = () => {
        triggerPause();
        const audio = new Audio(questionSound);
        audio.play();
        setIsQuestion(true);
    };

    useEffect(() => {
        if (life === 0) {
            navigate('/enter-score?score=' + score.current);
        }
    }, [life]);

    const animate = (): void => {
        // requestAnimationFrame(animate);


        if (isPlaying1 === true) {
            setBackgroundMusicPlaying(true);
            // clearing the canvas
            context.clearRect(0, 0, boardWidth, boardHeight);

            // moving the player 1 up and down
            context.fillStyle = "#00f6ff";
            if (!outOfBound(player1.y + player1.velocityY)) {
                if (player1.stopPlayer === false) {
                    player1.y += player1.velocityY;
                }
            }
            context.fillRect(
                player1.x,
                player1.y,
                player1.width,
                player1.height,
            );

            // moving the player 2 up and down
            if (!outOfBound(player2.y + player2.velocityY)) {
                if (player2.stopPlayer === false) {
                    player2.y += player2.velocityY;
                }
            }
            context.fillRect(
                player2.x,
                player2.y,
                player2.width,
                player2.height,
            ); // fillRect(x,y,width,height)
            // changing the color of the ball
            context.fillStyle = "#fff";

            // changing the pos of the ball
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            // recreating the ball
            context.fillRect(ball.x, ball.y, ball.width, ball.height);


            // question bubble
            checkBubbleCollision(player1);
            checkBubbleCollision(player2);

            updateBubblePosition();
            drawBubble();


            // changing the velocity/direction of the ball when it hits the top/bottom of boundries.
            if (ball.y <= 0 || ball.y + ball.height >= boardHeight) {
                ball.velocityY *= -1;
            }
            // detecting collision with player1 or with player2
            if (detectCollision(ball, player1)) {
                setPlayHit(true);
                // left side of ball touches right side of player1
                if (ball.x <= player1.x + player1.width) {
                    ball.velocityX *= ball.velocityX < -maxVelocity ? -1 : -1.15;
                }

                score.current += timeRef.current;

            } else if (detectCollision(ball, player2)) {
                setPlayHit(true);
                // right side of ball touches left side player2
                if (ball.x + ballWidth >= player2.x) {
                    ball.velocityX *= ball.velocityX > maxVelocity ? -1 : -1.15;
                }

                score.current += timeRef.current;
            }
            const resetGame = (direction: number) => {
                ball = {
                    x: boardWidth / 2,
                    y: boardHeight / 2,
                    width: ballWidth,
                    height: ballHeight,
                    velocityX: direction,
                    velocityY: ball.velocityY * 1.4,
                };
            };

            // scoring goal
            if (isPlaying1) {
                if (ball.x < 0) {
                    setPlayGoal(true);
                    setLife((prevLife) => prevLife - 1);
                    resetGame(gameDefaults.baseVelocityX + 1);
                } else if (ball.x + ballWidth > boardWidth) {
                    setPlayGoal(true);
                    setLife((prevLife) => prevLife - 1);
                    resetGame(gameDefaults.baseVelocityX + 1);
                }
            }

            // drawing line
            context.fillStyle = "#15b7cd";
            context.fillRect(board.width / 2, 0, 5, board.height);
        }
    };

    const movePlayer = (e: any): void => {
        if (e.key === gameDefaults.key2Up || e.key === gameDefaults.key2Down) player1.stopPlayer = false;

        // start moving the paddle (player2)
        if (e.key === gameDefaults.keyUp || e.key === gameDefaults.keyDown)
            player2.stopPlayer = false;

        if (e.key === gameDefaults.key2Up) {
            player1.velocityY = -moveSpeed;
        } else if (e.key === gameDefaults.key2Down) {
            player1.velocityY = moveSpeed;
        }

        if (e.key === gameDefaults.keyUp) {
            player2.velocityY = -moveSpeed;
        } else if (e.key === gameDefaults.keyDown) {
            player2.velocityY = moveSpeed;
        }

        // to pause
        if (e.key === "p" || e.key === "Escape") {
            triggerPause();
        }
    };

    const triggerPause = () => {
        isPlaying1 = !isPlaying1;
        setIsPaused((isPaused) => !isPaused);
    };

    const resetScores = (): void => {
        score.current = 0;
    };

    const stopMovingPlayer = (e: any): void => {
        if (e.key === gameDefaults.key2Up || e.key === gameDefaults.key2Down) {
            player1.stopPlayer = true;
        }

        if (e.key === gameDefaults.keyDown || e.key === gameDefaults.keyUp) {
            player2.stopPlayer = true;
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (isPlaying1 === true) {
                    triggerPause();
                }
            }
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => {
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
        };
    }, [isPlaying1]);

    useEffect(() => {
        board = document.getElementById("board") as HTMLCanvasElement;
        board.height = boardHeight;
        board.width = boardWidth;
        context = board.getContext("2d") as CanvasRenderingContext2D;
        // drawing the first player
        context.fillStyle = "#58c7f3";
        // drawing a rectangle
        context.fillRect(player1.x, player1.y, player1.width, player1.height); // fillRect(x,y,width,height)

        startTimer();
        resetScores();
        isPlaying1 = true;
        bubble = null;
        // loop of game
        // requestAnimationFrame(animate);
        setInterval(animate, 1000 / 60);

        window.addEventListener("keydown", movePlayer);
        window.addEventListener("keyup", stopMovingPlayer);
        startBubbleTimer();

        return () => {
            resetTimer();
            window.removeEventListener("keydown", movePlayer);
            window.removeEventListener("keyup", stopMovingPlayer);
        };
    }, []);

    return (
        <section className="flex-1 text-center">

            <div className="stats shadow-xl bg-base-200 p-2">

                <div className="stat place-items-center">
                    <div className="stat-title">Timer</div>
                    <div className="stat-value opacity-75">{timer}s</div>
                </div>

                <div className="stat place-items-center">
                    <div className="stat-figure text-secondary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                    </div>
                    <div className="stat-title">Score</div>
                    <div className="stat-value text-secondary glow">{score.current}</div>
                </div>

                <div className="stat place-items-center">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div className="stat-title">Life</div>
                    <div className="stat-value opacity-75">{life}</div>
                </div>

            </div>

            {/* Game board  */}
            <div className="gradient-border">
                <canvas className="bg-base-300 mt-10 m-auto shadow-lg " id="board"></canvas>
            </div>

            {/* Audio */}
            {playHit && (
                <AudioComponent
                    onAudioEnd={() => setPlayHit(false)}
                    path={hitSound}
                    volume={0.18}
                />
            )}
            {playGoal && (
                <AudioComponent
                    onAudioEnd={() => setPlayGoal(false)}
                    path={goalSound}
                    volume={0.18}
                />
            )}
            {isBackgroundMusicPlaying && (
                <AudioComponent
                    onAudioEnd={() => setBackgroundMusicPlaying(false)}
                    path={backgroundMusic}
                    volume={0.05}
                />
            )}

            {isQuestion && (
                <QuestionDialogCmp correct={handleCorrectAnswer} wrong={handleWrongAnswer} />
            )}

            {isPaused && (
                <h2 className="game-paused-info text-purple-400">
                    Game is paused
                </h2>
            )}
        </section>
    );
};

export default GameField;
