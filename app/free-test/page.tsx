'use client';

import { useState } from 'react';
import UrduKeyboard from '../components/UrduKeyboard';
import TypingTest, { TestResults } from '../components/TypingTest';
import TestResultsComponent from '../components/TestResults';

export default function FreeTestPage() {
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['ف', 'ج']));
    const [testDuration, setTestDuration] = useState(15);
    const [testResults, setTestResults] = useState<TestResults | null>(null);
    const [showResults, setShowResults] = useState(false);

    const handleKeyToggle = (key: string) => {
        setSelectedKeys(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const handleTestComplete = (results: TestResults) => {
        setTestResults(results);
        setShowResults(true);
    };

    const handleRestart = () => {
        setShowResults(false);
        setTestResults(null);
    };

    const selectAllKeys = () => {
        const allKeys = new Set([
            // Numbers row
            '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰', 'أ', 'ؤ',
            // First row
            'ق', 'و', 'ع', 'ر', 'ت', 'ے', 'ء', 'ی', 'ہ', 'پ', '[', ']',
            // Second row
            'ا', 'س', 'د', 'ف', 'گ', 'ح', 'ج', 'ک', 'ل', '؛', "'",
            // Third row
            'ز', 'ش', 'چ', 'ط', 'ب', 'ن', 'م', ',', '۔', '/', 'ھ', 'ئ', '؎', ' ْ',
        ]);
        setSelectedKeys(allKeys);
    };

    const clearAllKeys = () => {
        setSelectedKeys(new Set());
    };

    return (
        <div className="min-h-screen bg-linear-to-br from-[#01411c] to-[#5d993e] py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {showResults && testResults ? (
                    <TestResultsComponent results={testResults} onRestart={handleRestart} showRestartBtn={true} />
                ) : (
                    <div className="space-y-8">
                        {/* Keyboard Selection */}
                        <div className="kiburd-bg-primary rounded-lg shadow-lg p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-2xl font-semibold kiburd-text-primary">
                                    Selecciona las teclas para el test
                                </h2>
                                <div className="space-x-2">
                                    <button
                                        onClick={selectAllKeys}
                                        className="px-4 py-2 kiburd-btn-success text-white rounded-md transition-colors hover:kiburd-btn-success-hover hover-scale"
                                    >
                                        Todas
                                    </button>
                                    <button
                                        onClick={clearAllKeys}
                                        className="px-4 py-2 kiburd-btn-danger text-white rounded-md transition-colors hover:kiburd-btn-danger-hover hover-scale"
                                    >
                                        Ninguna
                                    </button>
                                </div>
                            </div>
                            <UrduKeyboard selectedKeys={selectedKeys} onKeyToggle={handleKeyToggle} showNextKey={false} />
                        </div>

                        {/* Typing Test */}
                        <div className="kiburd-bg-primary rounded-lg shadow-lg p-6">
                            <TypingTest
                                selectedKeys={selectedKeys}
                                testDuration={testDuration}
                                onTestComplete={handleTestComplete}
                                onTimeChange={setTestDuration}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}