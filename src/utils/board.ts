import { gameDefaults } from "../views/Game";

export const determineBoardWidth = () => {
    const width = document.body.clientWidth;

    if (width > gameDefaults.maxBoardWidth) {
        return gameDefaults.maxBoardWidth;
    }

    return width;
}

export const playSound = (src: string, volume = gameDefaults.volume) => {
    const audio = new Audio(src);
    audio.play();
    audio.loop = false;
    audio.volume = volume;
}