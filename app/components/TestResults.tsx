'use client';

import { TestResults } from './TypingTest';

interface TestResultsProps {
    results: TestResults;
    onRestart: () => void;
}

export default function TestResultsComponent({ results, onRestart }: TestResultsProps) {
    return (
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-gray-200">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">
                ¡Test Completado!
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                        {results.accuracy}%
                    </div>
                    <div className="text-gray-600 font-medium">Precisión</div>
                </div>

                <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                        {results.wpm}
                    </div>
                    <div className="text-gray-600 font-medium">Palabras por minuto</div>
                </div>

                <div className="text-center p-4 bg-emerald-50 rounded-lg">
                    <div className="text-4xl font-bold text-emerald-600 mb-2">
                        {results.correctKeys}
                    </div>
                    <div className="text-gray-600 font-medium">Teclas correctas</div>
                </div>

                <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-4xl font-bold text-red-600 mb-2">
                        {results.incorrectKeys}
                    </div>
                    <div className="text-gray-600 font-medium">Teclas incorrectas</div>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={onRestart}
                    className="px-8 py-4 bg-blue-500 text-white rounded-lg font-bold text-xl hover:bg-blue-600 transition-colors"
                >
                    Hacer otro test
                </button>
            </div>
        </div>
    );
}