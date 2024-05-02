import { Score } from "./types";

const getScores = () => {
    const scores = localStorage.getItem('highscores');
    if (scores) {
        return JSON.parse(scores);
    }
    return [];
}

const saveScore = (score: number, name: string) => {
    const scores = getScores();
    scores.push({ name, score });
    scores.sort((a: Score, b: Score) => b.score - a.score);
    localStorage.setItem('highscores', JSON.stringify(scores.slice(0, 10)));
}

export { getScores, saveScore };