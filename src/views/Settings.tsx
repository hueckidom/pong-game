import { useState, useEffect } from 'react';
import { gameDefaults } from "./Game";
// settings
// baseVelocityX: number;
// baseVelocityY: number;
// maxLife: number;
// maxVelocityX: number;
// moveSpeed: number;
// playerWidth: number;
// playerHeight: number;
// boardHeightDivisor: number;
// maxBoardWidth: number;
const Settings: React.FC = () => {
    const [settings, setSettings] = useState<any>({});

    const updateSetting = (key: string, value: string | number) => {
        setSettings((prev: any) => ({ ...prev, [key]: value }));
    }

    useEffect(() => {
        const settings = localStorage.getItem('settings');
        if (settings) {
            setSettings(JSON.parse(settings));
        } else {
            setSettings(gameDefaults);
        }
    }, []);

    useEffect(() => {
        if (Object.keys(settings).length === 0) return;
        localStorage.setItem('settings', JSON.stringify(settings));
    }, [settings]);

    return (
        <div className="hero min-h-screen bg-base-200">
            <div className="hero-content text-left flex-col bg-base-300 p-4 rounded-lg min-w-96">
                <div className="text-xl font-bold">Settings</div>
                <div className="flex gap-4 flex-col overflow-auto">
                    <div>
                        <label className="label">Base Velocity X</label>
                        <input type="number" value={settings.baseVelocityX} onChange={(e) => updateSetting('baseVelocityX', e.target.value)} />
                    </div>
                    <div>
                        <label className="label">Base Velocity Y</label>
                        <input type="number" value={settings.baseVelocityY} onChange={(e) => updateSetting('baseVelocityY', e.target.value)} />
                    </div>
                    <div>
                        <label className="label">Max Life</label>
                        <input type="number" value={settings.maxLife} onChange={(e) => updateSetting('maxLife', e.target.value)} />
                    </div>
                    <div>
                        <label className="label">Max Velocity X</label>
                        <input type="number" value={settings.maxVelocityX} onChange={(e) => updateSetting('maxVelocityX', e.target.value)} />
                    </div>
                    <div>
                        <label className="label">Move Speed</label>
                        <input type="number" value={settings.moveSpeed} onChange={(e) => updateSetting('moveSpeed', e.target.value)} />
                    </div>
                    <div>
                        <label className="label">Player Width</label>
                        <input type="number" value={settings.playerWidth} onChange={(e) => updateSetting('playerWidth', e.target.value)} />
                    </div>
                    <div>
                        <label className="label">Player Height</label>
                        <input type="number" value={settings.playerHeight} onChange={(e) => updateSetting('playerHeight', e.target.value)} />
                    </div>
                    <div>
                        <label className="label">Board Height Divisor</label>
                        <input type="number" value={settings.boardHeightDivisor} onChange={(e) => updateSetting('boardHeightDivisor', e.target.value)} />
                    </div>
                    <div>
                        <label className="label">Max Board Width</label>
                        <input type="number" value={settings.maxBoardWidth} onChange={(e) => updateSetting('maxBoardWidth', e.target.value)} />
                    </div>
                </div>


            </div>
        </div>
    );
};

export default Settings;
