import { gamepad } from './types';


export let pressedPads: number[] = [];
export const addHandleGamePad = (handleInput: any) => {
    let intervalId: number | undefined;

    const handleGamePadInput = () => {
        const gamepads = navigator.getGamepads();
        if (!gamepads) {
            return;
        }

        for (const gamepad of gamepads) {
            if (!gamepad) continue;

            // button presses
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

            // axis movements
            gamepad.axes.forEach((axis, index) => {
                if (axis === 1 || axis === -1) {
                    handleInput({
                        type: 'pad',
                        index: index,
                        value: axis,
                        gamepadIndex: gamepad.index
                    });

                    if (!pressedPads.includes(index)) {
                        pressedPads.push(index);
                    }
                    return;
                }



                if (pressedPads.includes(index)) {
                    handleInput({
                        type: 'pad',
                        index: index,
                        value: axis,
                        gamepadIndex: gamepad.index,
                        isRelease: true
                    });

                    pressedPads = pressedPads.filter((pad) => pad !== index);
                }
            });
        }
    };

    intervalId = window.setInterval(handleGamePadInput, 120);
    return intervalId;
};

export const removeHandleGamePad = (intervalId: number) => {
    if (intervalId) {
        clearInterval(intervalId);
    }
}

export const isPressReleased = (input: gamepad) => {
    return input.index == 0 && input.isRelease;
}

export const isDownPressed = (input: gamepad) => {
    return input.index == 0 && input.value == 1;
}

export const isUpPressed = (input: gamepad) => {
    return input.index == 0 && input.value == -1;
}

export const isLeftPressed = (input: gamepad) => {
    return input.index == 1 && input.value == -1;
}

export const isRightPressed = (input: gamepad) => {
    return input.index == 1 && input.value == 1;
}
