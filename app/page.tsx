'use client';

import { useState } from 'react';
import UrduKeyboard from './components/UrduKeyboard';
import TypingTest, { TestResults } from './components/TypingTest';
import TestResultsComponent from './components/TestResults';

export default function Home() {
  const [selectedKeys, setSelectedKeys] = useState<Set<string>>(new Set(['ا', 'س', 'د', 'ف', 'گ']));
  const [testDuration, setTestDuration] = useState(30);
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
      // Only selectable keys (not decorative)
      'ق', 'و', 'ع', 'ر', 'ت', 'ے', 'ء', 'ی', 'ہ', 'پ', '[', ']',
      'ا', 'س', 'د', 'ف', 'گ', 'ح', 'ج', 'ک', 'ل', '؛', "'",
      'ز', 'ش', 'چ', 'ط', 'ب', 'ن', 'م', '،', '۔', '/'
    ]);
    setSelectedKeys(allKeys);
  };

  const clearAllKeys = () => {
    setSelectedKeys(new Set());
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#01411c] to-[#5d993e] py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center justify-center gap-6">
            Mecanografía en Urdu
            <img
              src="/PakistanFlag.png"
              alt="Bandera de Pakistán"
              className="w-12 h-8 object-cover rounded shadow-md"
            />
          </h1>
        </header>

        {showResults && testResults ? (
          <TestResultsComponent results={testResults} onRestart={handleRestart} />
        ) : (
          <div className="space-y-8">
            {/* Keyboard Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-800">
                  Selecciona las teclas para el test
                </h2>
                <div className="space-x-2">
                  <button
                    onClick={selectAllKeys}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                  >
                    Todas
                  </button>
                  <button
                    onClick={clearAllKeys}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                  >
                    Ninguna
                  </button>
                </div>
              </div>
              <UrduKeyboard selectedKeys={selectedKeys} onKeyToggle={handleKeyToggle} />
            </div>

            {/* Typing Test */}
            <div className="bg-white rounded-lg shadow-lg p-6">
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
