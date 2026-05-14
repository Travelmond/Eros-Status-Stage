import { ReactElement, useMemo } from 'react';
import type { MessageStateType, ProgressionValues, SystemData, LocationData, NTRModuleState, SexModuleState, BodyState, ClothingState, GenitaliaState } from '../../types/eros-status';

export interface LiveTerminalProps {
    state: MessageStateType;
    density?: 'full' | 'condensed';
    showCharacterName?: boolean;
    showNpcBlocks?: boolean;
    npcBlocks?: Array<{
        name: string;
        species?: string;
        mood: string;
        activity: string;
        position?: string;
        thoughts?: string;
    }>;
}

function getMoodEmoji(prog: ProgressionValues): string {
    if (prog.happiness >= 80) return '😊';
    if (prog.happiness >= 60) return '🙂';
    if (prog.happiness >= 40) return '😐';
    if (prog.happiness >= 20) return '😢';
    return '😤';
}

function getMoodText(prog: ProgressionValues): string {
    if (prog.happiness >= 80) return 'Ecstatic';
    if (prog.happiness >= 60) return 'Happy';
    if (prog.happiness >= 40) return 'Neutral';
    if (prog.happiness >= 20) return 'Sad';
    return 'Miserable';
}

function renderBar(value: number, width: number = 15): string {
    const filled = Math.round((value / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

function renderEmojiBar(value: number, full: string, empty: string, count: number = 5): string {
    const filled = Math.round((value / 100) * count);
    return full.repeat(filled) + empty.repeat(count - filled);
}

export function LiveTerminal({
    state,
    density = 'full',
    showCharacterName = true,
    showNpcBlocks = true,
    npcBlocks = [],
}: LiveTerminalProps): ReactElement {
    const { progressions: prog, system, location, clothing, body, sexModule, ntrModule, genitalia } = state;

    const moodEmoji = getMoodEmoji(prog);
    const moodText = getMoodText(prog);

    const weatherEmoji: Record<string, string> = {
        sunny: '☀️', clear: '☀️', cloudy: '☁️', overcast: '☁️',
        rainy: '🌧️', rain: '🌧️', stormy: '⛈️', storm: '⛈️',
        snowy: '❄️', snow: '❄️', windy: '💨', hot: '🔥', cold: '🥶',
    };
    const weatherIcon = weatherEmoji[system.weather?.toLowerCase()] || '☀️';
    const weatherLabel = system.weather || 'Clear';

    const sceneTypeEmoji: Record<string, string> = {
        quiet: '🤫', conversation: '💬', flirt: '😏',
        foreplay: '🔥', sex: '🍑', aftercare: '💕',
    };
    const sceneIcon = sexModule.active ? (sceneTypeEmoji[sexModule.sceneType?.toLowerCase()] || '🎬') : '';

    return (
        <div className={`live-terminal live-terminal--${density}`}>
            {renderTerminalHeader(system, location, weatherIcon, weatherLabel)}
            {density === 'full' && (
                <div className="live-terminal__body">
                    {showCharacterName && renderCharacterHeader(state)}
                    {renderProgressionBars(prog)}
                    {sexModule.active && renderSexStatus(sexModule)}
                    {renderBodyLocation(body, clothing, location)}
                    {ntrModule.enabled && renderNTRStatus(ntrModule)}
                    {genitalia && renderGenitaliaStatus(genitalia)}
                    {genitalia?.menstrual && (
                        <div className="live-terminal__line">
                            🚺 Cycle: {genitalia.menstrual}
                        </div>
                    )}
                    {renderMoodLine(moodEmoji, moodText)}
                    {showNpcBlocks && npcBlocks.length > 0 && renderNpcBlocks(npcBlocks)}
                </div>
            )}
            {density === 'condensed' && renderCondensed(prog, system, location, moodEmoji)}
        </div>
    );
}

function renderTerminalHeader(system: SystemData, location: LocationData, weatherIcon: string, weatherLabel: string): ReactElement {
    return (
        <div className="live-terminal__header">
            <span className="live-terminal__header-line">
                📅 Day {system.day} | 🕐 {system.time} | {weatherIcon} {weatherLabel} | 📍 {location.building || location.currentRoom}
            </span>
        </div>
    );
}

function renderCharacterHeader(state: MessageStateType): ReactElement {
    const charName = state.character?.name || 'Character';
    return (
        <div className="live-terminal__char">
            <span className="live-terminal__char-name">{charName}</span>
        </div>
    );
}

function renderProgressionBars(prog: ProgressionValues): ReactElement {
    const stats: Array<{ key: string; label: string; icon: string; value: number }> = [
        { key: 'affection', label: 'Love', icon: '❤️', value: prog.affection },
        { key: 'obedience', label: 'Obedience', icon: '🎯', value: prog.obedience },
        { key: 'libido', label: 'Libido', icon: '🔥', value: prog.libido },
        { key: 'arousal', label: 'Arousal', icon: '🍑', value: prog.arousal },
        { key: 'trust', label: 'Trust', icon: '💕', value: prog.trust },
        { key: 'corruption', label: 'Corruption', icon: '😣', value: prog.corruption },
    ];

    return (
        <div className="live-terminal__stats">
            {stats.map(s => (
                <div key={s.key} className="live-terminal__stat-row">
                    <span className="live-terminal__stat-icon">{s.icon}</span>
                    <span className="live-terminal__stat-label">{s.label}:</span>
                    <span className="live-terminal__stat-bar">
                        <span className="live-terminal__stat-fill" style={{ width: `${s.value}%` }} />
                    </span>
                    <span className="live-terminal__stat-value">
                        [{renderBar(s.value, 15)}] {s.value}%
                    </span>
                </div>
            ))}
        </div>
    );
}

function renderSexStatus(sexModule: SexModuleState): ReactElement {
    const sceneEmojis: Record<string, string> = {
        quiet: '🤫', conversation: '💬', flirt: '😏',
        foreplay: '🔥', sex: '🍑', aftercare: '💕',
    };
    const sceneIcon = sceneEmojis[sexModule.sceneType?.toLowerCase()] || '🍑';
    const paceEmojis: Record<string, string> = {
        slow: '🐢', medium: '🏃', fast: '💨', rough: '🔥', violent: '💥',
    };
    const paceIcon = paceEmojis[sexModule.pace?.toLowerCase()] || '';

    return (
        <div className="live-terminal__sex">
            <div className="live-terminal__line">
                {sceneIcon} Scene: {sexModule.sceneType} {paceIcon && `| Pace: ${paceIcon} ${sexModule.pace}`}
            </div>
            <div className="live-terminal__line">
                🛏️ Position: {sexModule.position} | 💦 Arousal: [█'.repeat(Math.round(sexModule.arousal/10)) + '░'.repeat(10-Math.round(sexModule.arousal/10))] {sexModule.arousal}%
            </div>
            {sexModule.orgasmCount > 0 && (
                <div className="live-terminal__line">💦 Orgasms: {sexModule.orgasmCount}</div>
            )}
        </div>
    );
}

function renderBodyLocation(body: BodyState, clothing: ClothingState, location: LocationData): ReactElement {
    return (
        <div className="live-terminal__body-state">
            <div className="live-terminal__line">
                👚 Clothing: {clothing.upperBody} ({clothing.upperBodyState || 'worn'}), {clothing.lowerBody} ({clothing.lowerBodyState || 'worn'})
            </div>
            <div className="live-terminal__line">
                😊 Expression: {body.expression} | 🧍 Posture: {body.posture}
            </div>
            {body.exposureLevel && body.exposureLevel !== 'covered' && (
                <div className="live-terminal__line">🔞 Exposed: {body.exposureLevel}</div>
            )}
        </div>
    );
}

function renderNTRStatus(ntrModule: NTRModuleState): ReactElement {
    return (
        <div className="live-terminal__ntr">
            <div className="live-terminal__line">
                <span className="live-terminal__ntr-warn">⚠️ NTR Active</span>
                {ntrModule.type !== 'none' && ` | Type: ${ntrModule.type}`}
                {ntrModule.partner && ` | Partner: ${ntrModule.partner}`}
            </div>
            {ntrModule.humiliationLevel > 0 && (
                <div className="live-terminal__line">
                    😰 Humiliation: [{renderBar(ntrModule.humiliationLevel, 10)}] {ntrModule.humiliationLevel}%
                </div>
            )}
        </div>
    );
}

function renderGenitaliaStatus(genitalia: GenitaliaState): ReactElement {
    return (
        <div className="live-terminal__genitalia">
            <div className="live-terminal__line">🌸 Genitalia: {genitalia.female || 'N/A'}</div>
            {genitalia.menstrual && (
                <div className="live-terminal__line">🚺 Cycle: {genitalia.menstrual}</div>
            )}
            {genitalia.pregnancy && genitalia.pregnancy !== 'none' && (
                <div className="live-terminal__line">🤰 Pregnancy: {genitalia.pregnancy}</div>
            )}
        </div>
    );
}

function renderMoodLine(moodEmoji: string, moodText: string): ReactElement {
    return (
        <div className="live-terminal__mood">
            <span className="live-terminal__line">{moodEmoji} Mood: {moodText}</span>
        </div>
    );
}

function renderCondensed(prog: ProgressionValues, system: SystemData, location: LocationData, moodEmoji: string): ReactElement {
    return (
        <div className="live-terminal__condensed">
            <span className="live-terminal__condensed-stats">
                [💕{prog.affection}% 🎯{prog.obedience}% 🔥{prog.libido}% 🍑{prog.arousal}%]
            </span>
            <span className="live-terminal__condensed-loc">
                [📍{location.currentRoom}]
            </span>
            <span className="live-terminal__condensed-time">
                [⏰{system.time}]
            </span>
            <span className="live-terminal__condensed-mood">
                {moodEmoji}
            </span>
        </div>
    );
}

function renderNpcBlocks(npcs: Array<{
    name: string;
    species?: string;
    mood: string;
    activity: string;
    position?: string;
    thoughts?: string;
}>): ReactElement {
    return (
        <div className="live-terminal__npcs">
            {npcs.map((npc, i) => (
                <div key={i} className="live-terminal__npc-block">
                    <div className="live-terminal__npc-header">
                        Name: {npc.name}{npc.species ? ` (${npc.species})` : ''}
                    </div>
                    <div className="live-terminal__npc-info">Mood: {npc.mood}</div>
                    <div className="live-terminal__npc-info">Activity: {npc.activity}</div>
                    {npc.position && (
                        <div className="live-terminal__npc-info">Position: {npc.position}</div>
                    )}
                    {npc.thoughts && (
                        <div className="live-terminal__npc-info">Thoughts: {npc.thoughts}</div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default LiveTerminal;
