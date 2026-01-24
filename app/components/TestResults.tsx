'use client';

import { TestResults } from './TypingTest';

interface TestResultsProps {
    results: TestResults;
    onRestart?: () => void;
    showRestartBtn?: boolean;
}

export default function TestResultsComponent({ results, onRestart, showRestartBtn = false }: TestResultsProps) {
    // Calculate correct and wrong words (approximation based on characters)
    const correctWords = Math.floor(results.correctKeys / 5); // Standard word length approximation
    const wrongWords = Math.floor(results.incorrectKeys / 5);

    return (
        <div className="kiburd-bg-primary p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
            {/* WPM Section */}
            <div className="text-center mb-12">
                <div className="text-8xl font-bold mb-2" style={{
                    background: 'linear-gradient(45deg, #4ade80, #22c55e, #16a34a)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    {results.wpm} WPM
                </div>
                <div className="kiburd-text-primary text-lg font-medium">
                    (words per minute)
                </div>
            </div>

            {/* Stats Section */}
            <div className="space-y-6">
                {/* Keystrokes */}
                <div className="flex justify-between items-center py-4 border-b border-[var(--kiburd-bg-secondary)]">
                    <span className="kiburd-text-primary text-xl font-medium">Keystrokes</span>
                    <div className="flex items-center gap-2">
                        <span className="text-green-600 font-bold text-xl">({results.correctKeys}</span>
                        <span className="kiburd-text-primary font-bold text-xl">|</span>
                        <span className="text-red-600 font-bold text-xl">{results.incorrectKeys})</span>
                        <span className="kiburd-text-primary font-bold text-xl ml-2">{results.totalKeys}</span>
                    </div>
                </div>

                {/* Accuracy */}
                <div className="flex justify-between items-center py-4 border-b border-[var(--kiburd-bg-secondary)]">
                    <span className="kiburd-text-primary text-xl font-medium">Accuracy</span>
                    <span className="kiburd-text-primary font-bold text-2xl">{results.accuracy}%</span>
                </div>

                {/* Correct Words */}
                <div className="flex justify-between items-center py-4 border-b border-[var(--kiburd-bg-secondary)]">
                    <span className="kiburd-text-primary text-xl font-medium">Correct words</span>
                    <span className="text-green-600 font-bold text-2xl">{correctWords}</span>
                </div>

                {/* Wrong Words */}
                <div className="flex justify-between items-center py-4 border-b border-[var(--kiburd-bg-secondary)]">
                    <span className="kiburd-text-primary text-xl font-medium">Wrong words</span>
                    <span className="text-red-600 font-bold text-2xl">{wrongWords}</span>
                </div>
            </div>

            {/* Restart Button */}
            {showRestartBtn && onRestart && (
                <div className="mt-8 text-center">
                    <button
                        onClick={onRestart}
                        className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105"
                    >
                        Restart Test
                    </button>
                </div>
            )}
        </div>
    );
}