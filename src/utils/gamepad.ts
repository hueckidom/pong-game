import { gamepad } from './types';

// Define a function to handle gamepad inputs
export const addHandleGamePad = (handleInput: any) => {
    let intervalId: number | undefined;

    const handleGamePadInput = () => {
        const gamepads = navigator.getGamepads();
        if (!gamepads) {
            return;
        }

        // Iterate over each gamepad
        for (const gamepad of gamepads) {
            if (!gamepad) continue;

            // Handle button presses
            gamepad.buttons.forEach((button, index) => {
                if (button.pressed) {
                    handleInput({
                        type: 'button',
                        index: index,
                        pressed: button.pressed,
                        gamepadIndex: gamepad.index
                    });
                }
            });

            // Handle axis movements
            gamepad.axes.forEach((axis, index) => {
                if (axis === 1 || axis === -1) { // Using strict comparison for exact movements
                    handleInput({
                        type: 'axis',
                        index: index,
                        value: axis,
                        gamepadIndex: gamepad.index
                    });
                }
            });
        }
    };

    intervalId = window.setInterval(handleGamePadInput, 120);

    return () => {
        if (intervalId !== undefined) {
            clearInterval(intervalId);
        }
    };
};

export const isDownPressed = (input: gamepad) => {
    return input.gamepadIndex == 0 && input.index == 0 && input.value == 1;
}

export const isUpPressed = (input: gamepad) => {
    return input.gamepadIndex == 0 && input.index == 0 && input.value == 1;
}