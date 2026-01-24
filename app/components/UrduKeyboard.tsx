'use client';

interface UrduKeyboardProps {
    selectedKeys: Set<string>;
    nextKey?: string; // Nueva prop para la siguiente tecla
    onKeyToggle: (key: string) => void;
    showNextKey?: boolean; // Mostrar indicador de siguiente tecla
}

// Urdu Phonetic keyboard layout matching QWERTY positions
const URDU_KEYBOARD_LAYOUT = [
    // Numbers row (decorative only)
    {
        keys: ['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰', 'أ', 'ؤ'],
        isDecorative: true
    },
    // First row (Q-P) - QWERTY positions
    {
        keys: ['ق', 'و', 'ع', 'ر', 'ت', 'ے', 'ئ', 'ی', 'ہ', 'پ', ']', '['],
        isDecorative: false
    },
    // Second row (A-L) - ASDF positions  
    {
        keys: ['ا', 'س', 'د', 'ف', 'گ', 'ھ', 'ج', 'ک', 'ل', '؛', '۔', '؎'],
        isDecorative: false
    },
    // Third row (Z-M) - ZXCV positions
    {
        keys: ['ز', 'ش', 'چ', 'ط', 'ب', 'ن', 'م', '،', '۔', 'ْ'],
        isDecorative: false
    },
    // Space bar row
    {
        keys: ['Space'],
        isDecorative: true,
        isSpaceBar: true
    }
];

export default function UrduKeyboard({ selectedKeys, nextKey, onKeyToggle, showNextKey = false }: UrduKeyboardProps) {
    const renderKey = (key: string, isDecorative: boolean, isSpaceBar = false) => {
        const isSelected = selectedKeys.has(key);
        const isNextKey = showNextKey && nextKey === key;
        const isClickable = !isDecorative;

        // Keys that should have tactile bumps (F and J positions in Urdu Phonetic)
        const hasTactileBump = key === 'ف' || key === 'ج';

        return (
            <button
                key={key}
                onClick={isClickable ? () => onKeyToggle(key) : undefined}
                disabled={isDecorative}
                className={`
          ${isSpaceBar ? 'w-64 h-12' : 'w-12 h-12'} 
          rounded-md border-2 font-bold text-lg transition-all duration-200 relative
          ${isDecorative
                        ? 'kiburd-bg-tertiary kiburd-text-primary border-[var(--kiburd-bg-tertiary)] cursor-not-allowed'
                        : isSelected
                            ? 'bg-[#508b39] text-white border-[#01411c] shadow-md transform scale-95'
                            : isNextKey
                                ? 'bg-blue-500 text-white border-blue-600 shadow-lg animate-pulse'
                                : 'kiburd-bg-primary kiburd-text-primary border-[var(--kiburd-bg-secondary)] hover:kiburd-bg-secondary hover:border-[var(--kiburd-bg-secondary)] cursor-pointer'
                    }
        `}
            >
                {key === 'Space' ? 'Space' : key}
                {hasTactileBump && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className={`w-4 h-0.5 rounded-full ${isSelected || isNextKey ? 'bg-white' : 'bg-white'
                            }`}></div>
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="kiburd-bg-secondary p-4 rounded-lg shadow-inner">
            <div className="space-y-2">
                {URDU_KEYBOARD_LAYOUT.map((row, rowIndex) => (
                    <div key={rowIndex} className={`flex justify-center gap-1 ${row.isSpaceBar ? 'mt-4' : ''}`}>
                        {row.keys.map((key) => renderKey(key, row.isDecorative, row.isSpaceBar))}
                    </div>
                ))}
            </div>

            {/* Legend and Counter */}
            <div className="mt-4 flex justify-between items-center text-sm kiburd-text-primary px-6">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#508b39] rounded border"></div>
                        <span>Presionada</span>
                    </div>
                    {showNextKey && (
                        <div className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-blue-500 rounded border animate-pulse"></div>
                            <span>Siguiente</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 kiburd-bg-primary border-2 border-[var(--kiburd-bg-secondary)] rounded"></div>
                        <span>Disponibles</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 kiburd-bg-tertiary border-2 border-[var(--kiburd-bg-tertiary)] rounded"></div>
                        <span>Decorativas</span>
                    </div>
                </div>
                {showNextKey && (
                    <div className="font-medium">
                        {nextKey ? `Siguiente: ${nextKey === 'Space' ? 'Espacio' : nextKey}` : 'Completado'}
                    </div>
                )}
            </div>
        </div>
    );
}