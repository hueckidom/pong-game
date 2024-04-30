import React, { useEffect, useRef, useState } from "react";
import swal from "sweetalert";
import {
    MultiplePlayerModeProps,
    ball,
    player,
} from "../utils/types";
import hitSound from "../assets/Paddle Ball Hit Sound Effect HD.mp3";
import goalSound from "../assets/goal.mp3";
import buttonClickSound from "../assets/button-click-sound.mp3";
import { useNavigate } from "react-router-dom";
import AudioComponent from "../components/Audio";
import backgroundMusic from "../assets/game.mp3";
import { speedOptions, timeToSpeed as determineVelocity } from "../utils/options";
import { determineBoardWidth } from "../utils/board";

const GameField: React.FC<MultiplePlayerModeProps> = ({
    settings,
}) => {
    let boardWidth: number = determineBoardWidth();
    let boardHeight: number = boardWidth / 2;
    let context: CanvasRenderingContext2D;
    let board: HTMLCanvasElement;
    let playerWidth: number = 8;
    let playerHeight: number = 60;
    let playerVelocityY = 0;
    let moveSpeed = 3;
    let maxVelocity = 4.5;

    let player1: player = {
        x: 2,
        y: boardHeight / 2,
        width: playerWidth,
        height: playerHeight,
        velocityY: playerVelocityY,
        stopPlayer: false,
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
        velocityX: speedOptions["slow"].velocityX,
        velocityY: speedOptions["slow"].velocityY,
    };

    const [firstPlayerName, setFirstNamePlayer] = useState<string>("Player 1");
    const [secondPlayerName, setSecondNamePlayer] = useState("Player 2");
    const [playHit, setPlayHit] = useState<boolean>(false);
    const [playGoal, setPlayGoal] = useState<boolean>(false);
    const [isPaused, setIsPaused] = useState<boolean>(false);
    const [isBackgroundMusicPlaying, setBackgroundMusicPlaying] =
        useState<boolean>(false);

    const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);

    const [timer, setTimer] = useState(0);

    const timerRef = useRef<number | null>(null);

    const startTimer = (): void => {
        timerRef.current = window.setInterval(() => {
            if (isPlaying1) {
                setTimer((prevTimer) => prevTimer + 1);
            }
        }, 1000);
    };

    const resetTimer = () => {
        setTimer(0);
        if (timerRef.current !== null) {
            clearInterval(timerRef.current);
        }
    };
    let isPlaying1 = false;
    const score = useRef<number>(0);
    const navigate = useNavigate();
    let firstPlayerName1: string = firstPlayerName;
    let secondPlayerName1: string = secondPlayerName;

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

        if (isPlaying1) {
            backgroundAudio.play();
        } else {
            backgroundAudio.pause();
            backgroundAudio.currentTime = 0;
        }

        return () => {
            backgroundAudio.pause();
            backgroundAudio.currentTime = 0;
        };
    }, [isPlaying1]);

    const outOfBound = (y: number) => {
        return y < 0 || y + player1.height > boardHeight;
    };

    const win = (playerName: string) => {
        isPlaying1 = false;

        resetScores();

        if (backgroundMusicRef.current) {
            backgroundMusicRef.current.pause();
            setBackgroundMusicPlaying(false);
        }

        alert(`${playerName} wins !`);
        swal({
            title: `Feedback!`,
            text: `Ready for another round? Click 'Play again' to dive back into the excitement! :))`,
            buttons: {
                home: "Go to Home",
                star: "Star GitHub⭐",
                // menu: "Return to menu",
                play: "Play again",
            } as any,
            className: "btn",
        }).then((value) => {
            console.log(value);
            if (value === "menu") {
                isPlaying1 = false;
                resetScores();
                // later we will change this to creat a menu
            } else if (value === "home") {
                navigate("/");
            } else if (value === "play") {
                // play again
                resetTimer();
                startTimer();
            } else {
                // navigate("/https://github.com/Ramzi-Abidi/Pong");
                // window.location.href = '';
                window.open("https://github.com/Ramzi-Abidi/Pong", "_blank");
                navigate("/");
            }
        });
    };

    let bubble: any = null;


    useEffect(() => {
        setTimeout(spawnBubble, 5000); // Spawn a bubble every 5 seconds

    }, []);

    const drawBubble = () => {
        if (!bubble) return;

        context.beginPath();
        context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2);
        context.fillStyle = 'lightblue';
        context.fill();
        context.font = '16px Arial';
        context.fillStyle = '#000';
        context.textAlign = 'center';
        context.fillText('?', bubble.x, bubble.y + 6); // Center the question mark in the bubble
    };

    const spawnBubble = () => {
        bubble = {
            x: Math.random() * boardWidth,
            y: Math.random() * boardHeight,
            radius: 20,
            velocityX: (Math.random() - 0.5) * 4, // Random horizontal velocity
            velocityY: (Math.random() - 0.5) * 4  // Random vertical velocity
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
        swal("You found a mystery bubble!", "Special event triggered!", "success");
    };

    const animate = (): void => {
        requestAnimationFrame(animate); // The requestAnimationFrame() method used to repeat something pretty fast :) => alternative to setInterval()

        if (isPlaying1 === true) {
            setBackgroundMusicPlaying(true);
            // clearing the canvas
            context.clearRect(0, 0, boardWidth, boardHeight);

            // moving the player 1 up and down
            context.fillStyle = "skyBlue";
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
                    ball.velocityX *= ball.velocityX < -maxVelocity ? -1 : -1.2;

                }
            } else if (detectCollision(ball, player2)) {
                setPlayHit(true);
                // right side of ball touches left side player2
                if (ball.x + ballWidth >= player2.x) {
                    ball.velocityX *= ball.velocityX > maxVelocity ? -1 : -1.2;
                }
            }
            const resetGame = (direction: number) => {
                ball = {
                    x: boardWidth / 2,
                    y: boardHeight / 2,
                    width: ballWidth,
                    height: ballHeight,
                    velocityX: direction,
                    velocityY: ball.velocityY * 1.5,
                };
            };

            // scoring goal
            if (isPlaying1) {

                if (ball.x < 0) {
                    setPlayGoal(true);
                    if (ball.velocityX > maxVelocity || ball.velocityX < -maxVelocity) {
                        ball.velocityX = maxVelocity / 1.5;
                    }
                    resetGame(ball.velocityX);
                } else if (ball.x + ballWidth > boardWidth) {
                    setPlayGoal(true);
                    if (ball.velocityX > maxVelocity || ball.velocityX < -maxVelocity) {
                        ball.velocityX = maxVelocity / 1.5;
                    }
                    resetGame(ball.velocityX);
                }
            }

            // drawing line
            context.fillStyle = "#15b7cd";
            context.fillRect(board.width / 2, 0, 5, board.height);
        }
    };

    const movePlayer = (e: any): void => {
        if (e.key === "w" || e.key === "s") player1.stopPlayer = false;

        // start moving the paddle (player2)
        if (e.key === "ArrowUp" || e.key === "ArrowDown")
            player2.stopPlayer = false;

        if (e.key === "w") {
            player1.velocityY = -moveSpeed;
        } else if (e.key === "s") {
            player1.velocityY = moveSpeed;
        }

        if (e.key === "ArrowUp") {
            player2.velocityY = -moveSpeed;
        } else if (e.key === "ArrowDown") {
            player2.velocityY = moveSpeed;
        }

        // to pause
        if (e.key === "p" || e.key === "Escape") {
            const popup = document.querySelector(".btn");
            if (popup === null) {
                isPlaying1 = !isPlaying1;
                setIsPaused((isPaused) => !isPaused);
            }
        }
    };

    const resetScores = (): void => {
        score.current = 0;
    };

    const stopMovingPlayer = (e: any): void => {
        if (e.key === "w" || e.key === "s") {
            player1.stopPlayer = true;
        }

        if (e.key === "ArrowUp" || e.key === "ArrowDown") {
            player2.stopPlayer = true;
        }
    };

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden) {
                const btn = document.querySelector(".btn");
                if (btn === null && isPlaying1 === true) {
                    isPlaying1 = !isPlaying1;
                    setIsPaused((prevState) => !prevState);
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
        // loop of game
        requestAnimationFrame(animate);
        window.addEventListener("keydown", movePlayer);
        window.addEventListener("keyup", stopMovingPlayer);

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
                    <div className="stat-value text-secondary glow">4,200</div>
                </div>

                <div className="stat place-items-center">
                    <div className="stat-figure text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block w-8 h-8 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path></svg>
                    </div>
                    <div className="stat-title">Life</div>
                    <div className="stat-value opacity-75">3</div>
                </div>

            </div>

            {isPaused && (
                <h2 className="game-paused-info">
                    Game is paused, press p to resume!
                </h2>
            )}

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
        </section>
    );
};

export default GameField;