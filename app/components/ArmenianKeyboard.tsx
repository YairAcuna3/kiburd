'use client';

interface ArmenianKeyboardProps {
    selectedKeys: Set<string>;
    nextKey?: string;
    onKeyToggle: (key: string) => void;
    showNextKey?: boolean;
}

// Armenian Typewriter keyboard layout (QWERTY positions)
const ARMENIAN_KEYBOARD_LAYOUT = [
    {
        keys: ['ֆ', 'ձ', '-', ',', '։', '՞', '․', '՛', ')', 'օ', 'է', 'ղ'],
        isDecorative: false
    },
    // Q-P row
    {
        keys: ['ճ', 'փ', 'բ', 'ս', 'մ', 'ո', 'ւ', 'կ', 'ը', 'թ', 'ծ', 'ց'],
        isDecorative: false
    },
    // A-L row (home row)
    {
        keys: ['ջ', 'վ', 'գ', 'ե', 'ա', 'ն', 'ի', 'տ', 'հ', 'պ', 'ր', '»'],
        isDecorative: false
    },
    // Z-M row
    {
        keys: ['ժ', 'դ', 'չ', 'յ', 'զ', 'լ', 'ք', 'խ', 'շ', 'ռ'],
        isDecorative: false
    },
    {
        keys: ['Space'],
        isDecorative: true,
        isSpaceBar: true
    }
];

export default function ArmenianKeyboard({ selectedKeys, nextKey, onKeyToggle, showNextKey = false }: ArmenianKeyboardProps) {
    const renderKey = (key: string, isDecorative: boolean, isSpaceBar = false) => {
        const isSelected = selectedKeys.has(key);
        const isNextKey = showNextKey && nextKey === key;
        const isClickable = !isDecorative;

        const hasTactileBump = key === 'ե' || key === 'ի';

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
                            ? 'bg-[#8b2020] text-white border-[#5a0a0a] shadow-md transform scale-95'
                            : isNextKey
                                ? 'bg-blue-500 text-white border-blue-600 shadow-lg animate-pulse'
                                : 'kiburd-bg-primary kiburd-text-primary border-[var(--kiburd-bg-secondary)] hover:kiburd-bg-secondary hover:border-[var(--kiburd-bg-secondary)] cursor-pointer'
                    }
        `}
            >
                {key === 'Space' ? 'Space' : key}
                {hasTactileBump && (
                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                        <div className="w-4 h-0.5 rounded-full bg-white"></div>
                    </div>
                )}
            </button>
        );
    };

    return (
        <div className="kiburd-bg-secondary p-4 rounded-lg shadow-inner">
            <div className="space-y-2">
                {ARMENIAN_KEYBOARD_LAYOUT.map((row, rowIndex) => (
                    <div key={rowIndex} className={`flex justify-center gap-1 ${row.isSpaceBar ? 'mt-4' : ''}`}>
                        {row.keys.map((key) => renderKey(key, row.isDecorative, row.isSpaceBar))}
                    </div>
                ))}
            </div>

            <div className="mt-4 flex justify-between items-center text-sm kiburd-text-primary px-6">
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-[#8b2020] rounded border"></div>
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
