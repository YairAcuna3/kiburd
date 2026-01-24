'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import UrduKeyboard from './UrduKeyboard';

interface CourseTypingTestProps {
    text: string;
    onTestComplete: (results: TestResults) => void;
}

export interface TestResults {
    accuracy: number;
    wpm: number;
    correctKeys: number;
    incorrectKeys: number;
    totalKeys: number;
}

export default function CourseTypingTest({ text, onTestComplete }: CourseTypingTestProps) {
    const [isActive, setIsActive] = useState(false);
    const [isReady, setIsReady] = useState(true);
    const [timeLeft, setTimeLeft] = useState(30); // 30 segundos fijos
    const [currentText, setCurrentText] = useState('');
    const [userInput, setUserInput] = useState('');
    const [correctKeys, setCorrectKeys] = useState(0);
    const [incorrectKeys, setIncorrectKeys] = useState(0);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [pressedKey, setPressedKey] = useState<string>('');
    const [nextKey, setNextKey] = useState<string>('');
    const [isCompleted, setIsCompleted] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    // Generate random text from level characters
    const generateRandomText = useCallback(() => {
        const chars = text.split('');
        if (chars.length === 0) return '';

        let randomText = '';
        for (let i = 0; i < 100; i++) { // Generate 100 characters
            const randomChar = chars[Math.floor(Math.random() * chars.length)];
            randomText += randomChar;
            // Add spaces occasionally for better practice
            if (i < 99 && Math.random() > 0.8) randomText += ' ';
        }
        return randomText;
    }, [text]);

    const finishTest = useCallback(() => {
        if (isCompleted) return;

        setIsActive(false);
        setIsCompleted(true);

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        const totalKeys = correctKeys + incorrectKeys;
        const accuracy = totalKeys > 0 ? (correctKeys / totalKeys) * 100 : 0;
        const timeElapsed = startTime ? (Date.now() - startTime) / 1000 / 60 : 0.5; // 30 seconds = 0.5 minutes
        const wpm = Math.round(correctKeys / 5 / timeElapsed);

        setTimeout(() => {
            onTestComplete({
                accuracy: Math.round(accuracy),
                wpm,
                correctKeys,
                incorrectKeys,
                totalKeys
            });
        }, 0);
    }, [correctKeys, incorrectKeys, startTime, onTestComplete, isCompleted]);

    const startTest = useCallback(() => {
        setIsActive(true);
        setStartTime(Date.now());
    }, []);

    const resetTest = () => {
        setIsActive(false);
        setIsReady(true);
        setTimeLeft(30);
        setUserInput('');
        setCorrectKeys(0);
        setIncorrectKeys(0);
        setStartTime(null);
        setPressedKey('');
        setNextKey('');
        setIsCompleted(false);

        // Generate new random text
        const newText = generateRandomText();
        setCurrentText(newText);

        // Set first key
        if (newText.length > 0) {
            const firstChar = newText[0];
            const firstKeyToShow = firstChar === ' ' ? 'Space' : firstChar;
            setNextKey(firstKeyToShow);
        }

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (isCompleted || (!isActive && startTime)) return;

        const lastChar = value[value.length - 1];
        const expectedChar = currentText[value.length - 1];

        // Evaluate the character first, before starting the timer
        if (lastChar) {
            const keyToHighlight = lastChar === ' ' ? 'Space' : lastChar;
            setPressedKey(keyToHighlight);
            setTimeout(() => setPressedKey(''), 200);

            // Check if the character is correct
            if (lastChar === expectedChar) {
                setCorrectKeys(prev => prev + 1);
            } else {
                setIncorrectKeys(prev => prev + 1);
            }
        }

        // Start test after evaluating the first character
        if (!isActive && !startTime && value.length === 1) {
            startTest();
        }

        setUserInput(value);

        // Set next key to press
        const nextCharIndex = value.length;
        if (nextCharIndex < currentText.length) {
            const nextChar = currentText[nextCharIndex];
            const nextKeyToShow = nextChar === ' ' ? 'Space' : nextChar;
            setNextKey(nextKeyToShow);
        } else {
            // Generate more text if user is close to the end
            const newText = currentText + ' ' + generateRandomText();
            setCurrentText(newText);
            if (nextCharIndex < newText.length) {
                const nextChar = newText[nextCharIndex];
                const nextKeyToShow = nextChar === ' ' ? 'Space' : nextChar;
                setNextKey(nextKeyToShow);
            }
        }
    };

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

    useEffect(() => {
        resetTest();
    }, [text, generateRandomText]);

    useEffect(() => {
        if (isReady && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isReady]);

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
                        autoFocus
                        disabled={isCompleted}
                        className="typing-input kiburd-text-primary kiburd-bg-primary flex-1 p-4 text-xl border-2 border-[var(--kiburd-bg-secondary)] rounded-lg focus:border-green-600 focus:outline-none font-mono disabled:opacity-50"
                        placeholder="Comienza a escribir aquí..."
                    />
                    {isActive ? (
                        <div className="flex gap-2 items-center">
                            <div className="text-2xl font-bold text-white px-4 bg-[#01411c] py-4 rounded-md">
                                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                            </div>
                            <button
                                onClick={resetTest}
                                className="px-4 py-4 kiburd-bg-secondary kiburd-text-primary rounded-lg hover:kiburd-bg-primary focus:kiburd-bg-primary focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
                                title="Repetir test"
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
                    ) : (
                        <button
                            onClick={resetTest}
                            className="px-4 py-4 kiburd-bg-secondary kiburd-text-primary rounded-lg hover:kiburd-bg-primary focus:kiburd-bg-primary focus:outline-none focus:ring-2 focus:ring-green-400 transition-colors"
                            title="Iniciar test"
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
                    )}
                </div>

                <div className="flex justify-between text-sm kiburd-text-primary">
                    <span>Correctas: {correctKeys}</span>
                    <span>Incorrectas: {incorrectKeys}</span>
                    <span>Total: {correctKeys + incorrectKeys}</span>
                </div>

                {/* Teclado Urdu mostrando la tecla presionada y la siguiente */}
                <div className="mt-6">
                    <UrduKeyboard
                        selectedKeys={new Set([pressedKey])}
                        nextKey={nextKey}
                        onKeyToggle={() => { }}
                    />
                </div>
            </div>
        </div>
    );
}