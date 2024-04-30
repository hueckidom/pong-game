export const determineBoardWidth = () => {
    const width = document.body.clientWidth;

    if (width > 700) {
        return 700;
    }

    return width;
}