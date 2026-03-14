'use client';

import { useState } from 'react';
import UrduKeyboard from '../components/UrduKeyboard';
import ArmenianKeyboard from '../components/ArmenianKeyboard';
import TypingTest, { TestResults } from '../components/TypingTest';
import TestResultsComponent from '../components/TestResults';

type CourseId = 'urdu' | 'armenian';

const URDU_ALL_KEYS = new Set([
    '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '۰', 'أ', 'ؤ',
    'ق', 'و', 'ع', 'ر', 'ت', 'ے', 'ء', 'ی', 'ہ', 'پ', '[', ']',
    'ا', 'س', 'د', 'ف', 'گ', 'ح', 'ج', 'ک', 'ل', '؛', "'",
    'ز', 'ش', 'چ', 'ط', 'ب', 'ن', 'م', '،', '۔', '/', 'ھ', 'ئ', '؎', ' ْ',
]);

const ARMENIAN_ALL_KEYS = new Set([
    '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=',
    'ճ', 'փ', 'բ', 'ս', 'մ', 'ո', 'ւ', 'կ', 'ը', 'թ', 'ծ', 'ց',
    'ջ', 'վ', 'գ', 'ե', 'ա', 'ն', 'ի', 'տ', 'հ', 'պ', 'ռ', '»',
    'ժ', 'դ', 'չ', 'յ', 'զ', 'լ', 'ք', ',', 'շ', 'ռ',
]);

const DEFAULT_KEYS: Record<CourseId, Set<string>> = {
    urdu: new Set(['ف', 'ج']),
    armenian: new Set(['ե', 'ի']),
};

export default function FreeTestPage() {
    const [selectedCourse, setSelectedCourse] = useState<CourseId>('urdu');
    const [selectedKeys, setSelectedKeys] = useState<Set<string>>(DEFAULT_KEYS['urdu']);
    const [testDuration, setTestDuration] = useState(15);
    const [testResults, setTestResults] = useState<TestResults | null>(null);
    const [showResults, setShowResults] = useState(false);

    const handleCourseChange = (course: CourseId) => {
        setSelectedCourse(course);
        setSelectedKeys(DEFAULT_KEYS[course]);
        setShowResults(false);
        setTestResults(null);
    };

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
        setSelectedKeys(selectedCourse === 'armenian' ? new Set(ARMENIAN_ALL_KEYS) : new Set(URDU_ALL_KEYS));
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
                        {/* Course selector */}
                        <div className="flex justify-center gap-3">
                            {(['urdu', 'armenian'] as CourseId[]).map(course => (
                                <button
                                    key={course}
                                    onClick={() => handleCourseChange(course)}
                                    className={`px-5 py-2 rounded-full font-semibold transition-all border-2 ${selectedCourse === course
                                        ? 'bg-white text-black border-white shadow-lg scale-105'
                                        : 'bg-transparent kiburd-text-primary border-white/40 hover:border-white/80'
                                        }`}
                                >
                                    {course === 'urdu' ? 'Urdu (Pakistan)' : 'Armenian (Typewriter)'}
                                </button>
                            ))}
                        </div>

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
                            {selectedCourse === 'armenian' ? (
                                <ArmenianKeyboard selectedKeys={selectedKeys} onKeyToggle={handleKeyToggle} showNextKey={false} />
                            ) : (
                                <UrduKeyboard selectedKeys={selectedKeys} onKeyToggle={handleKeyToggle} showNextKey={false} />
                            )}
                        </div>

                        {/* Typing Test */}
                        <div className="kiburd-bg-primary rounded-lg shadow-lg p-6">
                            <TypingTest
                                selectedKeys={selectedKeys}
                                testDuration={testDuration}
                                onTestComplete={handleTestComplete}
                                onTimeChange={setTestDuration}
                                keyboard={selectedCourse}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
