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