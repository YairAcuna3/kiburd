'use client';

interface UrduKeyboardProps {
    selectedKeys: Set<string>;
    onKeyToggle: (key: string) => void;
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

export default function UrduKeyboard({ selectedKeys, onKeyToggle }: UrduKeyboardProps) {
    const renderKey = (key: string, isDecorative: boolean, isSpaceBar = false) => {
        const isSelected = selectedKeys.has(key);
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
                        ? 'bg-gray-200 text-gray-500 border-gray-300 cursor-not-allowed'
                        : isSelected
                            ? 'bg-[#508b39] text-white border-[#01411c] shadow-md transform scale-95'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 cursor-pointer'
                    }
        `}
            >
                {key === 'Space' ? 'Space' : key}
                {hasTactileBump && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className={`w-4 h-0.5 rounded-full ${isSelected ? 'bg-white' : 'bg-gray-400'
                            }`}></div>
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
            <div className="space-y-2">
                {URDU_KEYBOARD_LAYOUT.map((row, rowIndex) => (
                    <div key={rowIndex} className={`flex justify-center gap-1 ${row.isSpaceBar ? 'mt-4' : ''}`}>
                        {row.keys.map((key) => renderKey(key, row.isDecorative, row.isSpaceBar))}
                    </div>
                ))}
            </div>

            {/* Legend and Counter */}
            <div className="mt-4 flex justify-between items-center text-sm text-gray-600 px-6">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#508b39] rounded border"></div>
                        <span>Seleccionadas</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-white border-2 border-gray-300 rounded"></div>
                        <span>Disponibles</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-200 border-2 border-gray-300 rounded"></div>
                        <span>Decorativas</span>
                    </div>
                </div>
                <div className="font-medium">
                    Teclas seleccionadas: {selectedKeys.size}
                </div>
            </div>
        </div>
    );
}