export type player = {
    x: number;
    y: number;
    width: number;
    height: number;
    velocityY: number;
    stopPlayer?: boolean;
};

export type ball = player & {
    velocityX: number; // shhifting by 2px
};

export interface HighScoreProps {
}

export interface HomeProps {
}
export interface AudioComponentProps {
    onAudioEnd: () => void;
    path: string;
    volume: number;
}

export interface QuestionDialogProps {
    correct: () => void;
    wrong: () => void;
}

export interface MultiplePlayerModeProps {
    settings: SettingProps;
}


export interface SinglePlayerModeProps {
    settings: SettingProps;
}

export interface SettingProps {
    speedOption: string;
    pointOption: number;
}

export interface Score {
    name: string;
    score: number;
}

export interface Question {
    question: string;
    A: string;
    B: string;
    C: string;
    D: string;
    answer: string;
}

export interface BaseSettings{
    baseVelocityX: number;
    baseVelocityY: number;
    maxLife: number;
    maxVelocityX: number;
    moveSpeed: number;
    playerWidth: number;
    playerHeight: number;
    boardHeightDivisor: number;
    maxBoardWidth: number;
    keyUp: string;
    keyDown: string;
    key2Up: string;
    key2Down: string;
}