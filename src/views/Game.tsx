import React, { useEffect, useRef, useState } from "react";
import correctSound from "../assets/correct.mp3";
import questionSound from "../assets/questions.mp3";
import wrongSound from "../assets/wrong.mp3";
import bubblePicture from "../assets/ball.png";
import BodenStaendigkeitBallImg from "../assets/b.png";
import LeistungBallImg from "../assets/l.png";
import RespektBallImg from "../assets/r.png";
import VerbundenheitBallImg from "../assets/vbh.png";
import Vertrauen from "../assets/v.png";
import {
    BaseSettings,
    MultiplePlayerModeProps,
    ball,
    gamepad,
    player,
} from "../utils/types";
import hitSound from "../assets/Paddle Ball Hit Sound Effect HD.mp3";
import goalSound from "../assets/goal.mp3";
import { useNavigate } from "react-router-dom";
import backgroundMusic from "../assets/game.mp3";
import { determineBoardWidth } from "../utils/board";
import QuestionDialogCmp from "../components/QuestionDialog";
import { values } from "../utils/options";
import { addHandleGamePad, isDownPressed, isPressReleased, isUpPressed, removeHandleGamePad } from "../utils/gamepad";

let isPlaying1 = false;
let bubble: any = null;
let setValue: values = "Vertrauen";
let tGameEffect = "none";

export let gameDefaults: BaseSettings = {
    velocityXIncrement: 1.15,
    baseVelocityX: 1.5,
    baseVelocityY: 1.50,
    boardHeightDivisor: 1.7,
    maxBoardWidth: 700,
    maxLife: 2,
    maxVelocityX: 5,
    moveSpeed: 5,
    playerHeight: 60,
    playerWidth: 10,
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
    let moveSpeed = Number(gameDefaults.moveSpeed);
    let maxVelocity = Number(gameDefaults.maxVelocityX);
    let maxLife = gameDefaults.maxLife;
    let valueQue: values[] = ["Vertrauen", "Bodenständigkeit", "Leistung", "Verbundenheit", "Respekt"];
    const [gameEffect, setGameEffect] = useState<"shake" | "smallerPad" | "blackout" | "none" | "velocityYChange">("none");

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
    const ballWidth = 32;
    const ballHeight = 32;

    let ball: ball = {
        x: boardWidth / 2,
        y: boardHeight / 2,
        width: ballWidth,
        height: ballHeight,
        velocityX: Number(gameDefaults.baseVelocityX),
        velocityY: Number(gameDefaults.baseVelocityY),
    };

    const [currentValue, setCurrentValue] = useState<values>(valueQue[0]);
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

    const playSound = (src: string, volume = 0.5) => {
        const audio = new Audio(src);
        audio.play();
        audio.loop = false;
        audio.volume = volume;
    }

    const outOfBound = (y: number) => {
        return y < 0 || y + player1.height > boardHeight;
    };

    const startBubbleTimer = () => {
        const spawnInterval = Math.random() * 5000 + (12000);
        setTimeout(spawnBubble, spawnInterval);
    };

    const nextValue = () => {
        //+1 to get the next index if we reach the end of the array we start from the beginning
        const currentIndex = valueQue.indexOf(currentValue);
        const nextIndex = (currentIndex + 1) % valueQue.length;
        setCurrentValue(valueQue[nextIndex]);
    }

    const handleCorrectAnswer = () => {
        playSound(correctSound);
        score.current += timeRef.current;
        nextValue();
        setIsQuestion(false);

        setTimeout(() => {
            triggerPause();
            bubble = null;
            startBubbleTimer();
        }, 250);
    }

    const handleWrongAnswer = () => {
        playSound(wrongSound);
        setIsQuestion(false);
        nextValue();

        setTimeout(() => {
            triggerPause();
            bubble = null;
            startBubbleTimer();
            setLife((prevLife) => prevLife - 1);
        }, 250);
    }

    const determineBallPicture = (value: values) => {
        switch (value) {
            case "Bodenständigkeit":
                return BodenStaendigkeitBallImg;
            case "Leistung":
                return LeistungBallImg;
            case "Respekt":
                return RespektBallImg;
            case "Verbundenheit":
                return VerbundenheitBallImg;
            case "Vertrauen":
                return Vertrauen;
        }
    }

    const drawBubble = () => {
        if (!bubble) return;
        const bubbleimage = new Image();
        bubbleimage.src = bubblePicture;
        context.drawImage(bubbleimage, bubble.x - bubble.radius, bubble.y - bubble.radius, bubble.radius * 2, bubble.radius * 2);
    };

    const spawnBubble = () => {
        if (bubble) return;

        bubble = {
            x: boardWidth / 2,
            y: Math.random() * boardHeight / 1.5 + 20,
            radius: 26,
            velocityX: ball.velocityX,
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
        playSound(questionSound);
        setTimeout(() => {
            setIsQuestion(true);
        });
    };

    useEffect(() => {
        if (life <= 0) {
            // navigate('/enter-score?score=' + score.current);
            // use window.location.href instead of navigate to avoid the page transition
            window.location.href = '/#/ enter-score?score=' + score.current;
        }
    }, [life]);

    useEffect(() => {
        setValue = currentValue;

        //set the game effect based on the value
        switch (currentValue) {
            case "Bodenständigkeit":
                setGameEffect("shake");
                break;
            case "Leistung":
                setGameEffect("smallerPad");
                break;
            case "Respekt":
                setGameEffect("velocityYChange");
                break;
            case "Verbundenheit":
                setGameEffect("blackout");
                break;
            case "Vertrauen":
                setGameEffect("none");
                break;
        }
    }, [currentValue]);

    useEffect(() => {
        tGameEffect = gameEffect;
    }, [gameEffect]);

    const animate = (): void => {
        requestAnimationFrame(animate);

        if (isPlaying1 === true) {
            setBackgroundMusicPlaying(true);
            // clearing the canvas
            context.clearRect(0, 0, boardWidth, boardHeight);

            // moving the player 1 up and down
            context.fillStyle = "#fff";
            if (!outOfBound(player1.y + player1.velocityY)) {
                if (player1.stopPlayer === false) {
                    player1.y += player1.velocityY;
                }
            }
            context.fillRect(
                player1.x,
                player1.y,
                player1.width,
                player1.height - (tGameEffect === "smallerPad" ? 15 : 0),
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
                player2.height - (tGameEffect === "smallerPad" ? 15 : 0),

            );
            // changing the color of the ball
            context.fillStyle = "#fff";

            // changing the pos of the ball
            ball.x += ball.velocityX;
            ball.y += ball.velocityY;
            // recreating the ball

            const ballImg = new Image();
            ballImg.src = determineBallPicture(setValue);
            context.drawImage(ballImg, ball.x, ball.y, ball.width, ball.height);

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
                playSound(hitSound);
                // left side of ball touches right side of player1
                if (ball.x <= player1.x + player1.width) {
                    ball.velocityX *= ball.velocityX < -maxVelocity ? -1 : -Number(gameDefaults.velocityXIncrement);
                }

                if (tGameEffect === "velocityYChange") {
                    ball.velocityY = (Math.random() * 3 + 1.5);
                }

                score.current += timeRef.current;

            } else if (detectCollision(ball, player2)) {
                playSound(hitSound);
                // right side of ball touches left side player2
                if (ball.x + ballWidth >= player2.x) {
                    ball.velocityX *= ball.velocityX > maxVelocity ? -1 : - Number(gameDefaults.velocityXIncrement);
                }

                if (tGameEffect === "velocityYChange") {
                    ball.velocityY = -(Math.random() * 3 + 1.5);
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
                    const newLife = life - 1;
                    setLife((prevLife) => prevLife - 1);

                    if (newLife > 0) {
                        playSound(goalSound);
                        resetGame(Number(gameDefaults.baseVelocityX) + 1);
                    } else {
                        setIsPaused(true);
                    }
                } else if (ball.x + ballWidth > boardWidth) {
                    const newLife = life - 1;
                    setLife((prevLife) => prevLife - 1);
                    if (newLife > 0) {
                        playSound(goalSound);
                        resetGame(Number(gameDefaults.baseVelocityX) + 1);
                    } else {
                        setIsPaused(true);
                    }
                }
            }

            // drawing line
            // context.fillRect(board.width / 2, 0, 5, board.height);
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
        requestAnimationFrame(animate);
        // const intervall = setInterval(animate, 1000 / 60);

        window.addEventListener("keydown", movePlayer);
        window.addEventListener("keyup", stopMovingPlayer);

        const gamePadHandler = addHandleGamePad((input: gamepad) => {
            const isPlayer1 = input.gamepadIndex === 0;
            const isPlayer2 = input.gamepadIndex === 1;


            if (isPressReleased(input)) {
                if (isPlayer1) {
                    player1.stopPlayer = true;
                }

                if (isPlayer2) {
                    player2.stopPlayer = true;
                }
            }

            if (isDownPressed(input)) {
                if (isPlayer1) {
                    player1.velocityY = -moveSpeed;
                    player1.stopPlayer = false;
                }

                if (isPlayer2) {
                    player2.velocityY = -moveSpeed;
                    player2.stopPlayer = false;
                }
            }

            if (isUpPressed(input)) {
                if (isPlayer1) {
                    player1.velocityY = moveSpeed;
                    player1.stopPlayer = false;
                }

                if (isPlayer2) {
                    player2.velocityY = moveSpeed;
                    player2.stopPlayer = false;
                }
            }
        });

        startBubbleTimer();

        return () => {
            resetTimer();
            // clearInterval(intervall);
            window.removeEventListener("keydown", movePlayer);
            window.removeEventListener("keyup", stopMovingPlayer);
            removeHandleGamePad(gamePadHandler);
        };
    }, []);

    return (
        <section className="flex-1 text-center fixed w-full h-full flex justify-center align-middle items-center left-0 top-0 flex-col">
            {/* Values */}
            <div className="my-8 text-md flex gap-2 justify-center align-middle">
                <span className="opacity-75">Ihr haltet gerade gemeinsam den Wert</span>
                <div className="title-wrapper game-wrapper floating">
                    <h1 className="sweet-title game-title sweet-title-mixed">
                        <span data-text={currentValue}>{currentValue}</span>
                    </h1>
                </div>
                <span className="opacity-75">hoch!</span>
            </div>
            {/* Game board  */}
            {gameEffect}
            <div className={(gameEffect == "shake" ? "shake-effect" : "") + (gameEffect == "blackout" ? "blackout-effect" : "") + " gradient-border"}>
                <canvas className={" bg-base-300 mt-10 m-auto shadow-lg"} id="board"></canvas>
            </div>
            {/* Score */}
            <div className="stats shadow-xl bg-base-200 p-2 mt-8">
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

            {isQuestion && (
                <QuestionDialogCmp correct={handleCorrectAnswer} wrong={handleWrongAnswer} value={currentValue} />
            )}

            {/* {isPaused && (
                <h2 className="game-paused-info text-purple-400">
                    Game is paused
                </h2>
            )} */}
        </section>
    );
};

export default GameField;
