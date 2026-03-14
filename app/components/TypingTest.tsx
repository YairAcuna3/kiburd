'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import UrduKeyboard from './UrduKeyboard';
import ArmenianKeyboard from './ArmenianKeyboard';

interface TypingTestProps {
    selectedKeys: Set<string>;
    testDuration: number;
    onTestComplete: (results: TestResults) => void;
    onTimeChange?: (duration: number) => void;
    keyboard?: 'urdu' | 'armenian';
}

export interface TestResults {
    accuracy: number;
    wpm: number;
    correctKeys: number;
    incorrectKeys: number;
    totalKeys: number;
}

export default function TypingTest({ selectedKeys, testDuration, onTestComplete, onTimeChange, keyboard = 'urdu' }: TypingTestProps) {
    const [isActive, setIsActive] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [timeLeft, setTimeLeft] = useState(testDuration);
    const [currentText, setCurrentText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [correctKeys, setCorrectKeys] = useState(0);
    const [incorrectKeys, setIncorrectKeys] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [pressedKey, setPressedKey] = useState<string>(''); // Nueva state para la tecla presionada

    const inputRef = useRef<HTMLInputElement>(null);
    const restartButtonRef = useRef<HTMLButtonElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Generate random text from selected keys
    const generateText = useCallback(() => {
        const keysArray = Array.from(selectedKeys);
        if (keysArray.length === 0) return '';

        let text = '';
        for (let i = 0; i < 50; i++) {
            const randomKey = keysArray[Math.floor(Math.random() * keysArray.length)];
            text += randomKey;
            if (i < 49 && Math.random() > 0.7) text += ' '; // Add spaces occasionally
        }
        return text;
    }, [selectedKeys]);

    const finishTest = useCallback(() => {
        setIsActive(false);
        setIsReady(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const totalKeys = correctKeys + incorrectKeys;
        const accuracy = totalKeys > 0 ? (correctKeys / totalKeys) * 100 : 0;
        const timeElapsed = startTime ? (Date.now() - startTime) / 1000 / 60 : 1; // in minutes
        const wpm = Math.round(correctKeys / 5 / timeElapsed); // Standard WPM calculation

        // Use setTimeout to defer the callback to avoid React warning
        setTimeout(() => {
            onTestComplete({
                accuracy: Math.round(accuracy),
                wpm,
                correctKeys,
                incorrectKeys,
                totalKeys
            });
        }, 0);
    }, [correctKeys, incorrectKeys, startTime, onTestComplete]);

    const prepareTest = useCallback(() => {
        if (selectedKeys.size === 0) {
            alert('Por favor selecciona al menos una tecla para el test');
            return;
        }

        setIsReady(true);
        setIsActive(false);
        setTimeLeft(testDuration);
        setCurrentText(generateText());
        setUserInput('');
        setCorrectKeys(0);
        setIncorrectKeys(0);
        setStartTime(null);

        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [selectedKeys, testDuration, generateText]);

    const startTest = useCallback(() => {
        setIsActive(true);
        setStartTime(Date.now());
    }, []);

    const restartTest = () => {
        prepareTest();
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Start test on first character if not already active
        if (!isActive && !startTime && value.length === 1) {
            startTest();
        }

        if (!isActive && !isReady) return;

        const lastChar = value[value.length - 1];
        const expectedChar = currentText[value.length - 1];

        // Resaltar la tecla presionada
        if (lastChar) {
            // Convertir espacio a 'Space' para que coincida con el layout del teclado
            const keyToHighlight = lastChar === ' ' ? 'Space' : lastChar;
            setPressedKey(keyToHighlight);
            // Limpiar el resaltado después de un breve momento
            setTimeout(() => setPressedKey(''), 200);
        }

        if (lastChar === expectedChar) {
            setCorrectKeys(prev => prev + 1);
        } else if (lastChar !== undefined) {
            setIncorrectKeys(prev => prev + 1);
        }

        setUserInput(value);

        // Generate new text if user is close to the end
        if (value.length >= currentText.length - 10) {
            setCurrentText(prev => prev + ' ' + generateText());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // Allow Tab to move to restart button
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            restartButtonRef.current?.focus();
        }
    };

    const handleRestartKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        // Allow Shift+Tab to move back to input
        if (e.key === 'Tab' && e.shiftKey) {
            e.preventDefault();
            inputRef.current?.focus();
        }
        // Allow Tab to cycle back to input
        if (e.key === 'Tab' && !e.shiftKey) {
            e.preventDefault();
            inputRef.current?.focus();
        }
    };

    // Initialize test when component mounts or selectedKeys change
    useEffect(() => {
        prepareTest();
    }, [prepareTest]);

    // Auto-focus input when component mounts and when test is ready
    useEffect(() => {
        if (isReady && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isReady]);

    // Timer effect
    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, timeLeft]);

    // Test completion effect
    useEffect(() => {
        if (isActive && timeLeft === 0) {
            finishTest();
        }
    }, [timeLeft, isActive, finishTest]);

    const renderText = () => {
        return currentText.split('').map((char, index) => {
            let className = 'text-2xl ';

            if (index < userInput.length) {
                className += userInput[index] === char ? 'kiburd-success-bg kiburd-success-text' : 'kiburd-error-bg kiburd-error-text';
            } else if (index === userInput.length) {
                className += 'kiburd-info-bg kiburd-info-text animate-pulse';
            } else {
                className += 'kiburd-text-primary';
            }

            return (
                <span key={index} className={className}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div className="space-y-6">
            {(isReady || isActive) && (
                <div className="space-y-4">
                    <div className="kiburd-bg-secondary p-6 rounded-lg border-2 border-[var(--kiburd-bg-secondary)] min-h-32 font-mono leading-relaxed">
                        {renderText()}
                    </div>

                    <div className="flex gap-2 items-center">
                        <input
                            ref={inputRef}
                            type="text"
                            value={userInput}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyDown}
                            autoFocus
                            className="typing-input kiburd-text-primary kiburd-bg-primary flex-1 p-4 text-xl border-2 border-[var(--kiburd-bg-secondary)] rounded-lg focus:border-green-600 focus:outline-none font-mono"
                            placeholder="Comienza a escribir aquí..."
                        />
                        {isActive ? (
                            <div className="text-2xl font-bold text-white px-4 bg-[#01411c] py-4 rounded-md">
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                        ) : (
                            <select
                                value={testDuration}
                                onChange={(e) => {
                                    const newDuration = parseInt(e.target.value);
                                    setTimeLeft(newDuration);
                                    if (onTimeChange) {
                                        onTimeChange(newDuration);
                                    }
                                }}
                                className="px-4 py-4 text-lg font-medium border-2 border-[#01411c] rounded-lg focus:border-[#01411c] focus:outline-none bg-[#01411c] text-white appearance-none cursor-pointer min-w-[100px] text-center pr-10"
                                style={{
                                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                    backgroundPosition: 'right 12px center',
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: '16px'
                                }}
                            >
                                <option value={15}>0:15</option>
                                <option value={30}>0:30</option>
                                <option value={60}>1:00</option>
                                <option value={120}>2:00</option>
                            </select>
                        )}
                        <button
                            ref={restartButtonRef}
                            onClick={restartTest}
                            onKeyDown={handleRestartKeyDown}
                            className="hover-scale px-4 py-4 kiburd-bg-secondary kiburd-text-primary rounded-lg hover:kiburd-bg-primary focus:kiburd-bg-primary focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
                            title="Reiniciar test (Tab para acceder)"
                        >
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                                />
                            </svg>
                        </button>
                    </div>

                    <div className="flex justify-between text-sm kiburd-text-primary">
                        <span>Correctas: {correctKeys}</span>
                        <span>Incorrectas: {incorrectKeys}</span>
                        <span>Total: {correctKeys + incorrectKeys}</span>
                    </div>

                    {/* Teclado durante el test */}
                    <div className="mt-6">
                        {keyboard === 'armenian' ? (
                            <ArmenianKeyboard
                                selectedKeys={new Set([pressedKey])}
                                onKeyToggle={() => { }}
                                showNextKey={false}
                            />
                        ) : (
                            <UrduKeyboard
                                selectedKeys={new Set([pressedKey])}
                                onKeyToggle={() => { }}
                                showNextKey={false}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}