import { gameDefaults } from "../views/Game";

export const determineBoardWidth = () => {
    const width = document.body.clientWidth;

    if (width > gameDefaults.maxBoardWidth) {
        return gameDefaults.maxBoardWidth;
    }

    return width;
}