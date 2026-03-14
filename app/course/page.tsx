'use client';

import { useState, useEffect } from 'react';
import CourseTypingTest, { TestResults } from '../components/CourseTypingTest';
import TestResultsComponent from '../components/TestResults';

interface Level {
    id: number;
    title: string;
    letters: string;
}

interface Phase {
    id: number;
    title: string;
    levels: Level[];
}

interface CourseData {
    phases: Phase[];
}

type CourseId = 'urdu' | 'armenian';

const COURSES: { id: CourseId; label: string; file: string; title: string; gradient: string; cardBg: string; cardBorder: string; badgeBg: string; backHover: string; flag: string }[] = [
    {
        id: 'urdu',
        label: 'Urdu (Pakistan)',
        file: 'doc/urdu-course-data.json',
        title: 'Curso de Mecanografía Urdu',
        gradient: 'from-[#01411c] to-[#5d993e]',
        cardBg: 'bg-green-700 hover:bg-green-800',
        cardBorder: 'hover:border-green-600',
        badgeBg: 'bg-green-600',
        backHover: 'hover:bg-green-600',
        flag: '/img/flags/Pakistan.png',
    },
    {
        id: 'armenian',
        label: 'Armenian (Typewriter)',
        file: 'doc/armenian-course-data.json',
        title: 'Curso de Mecanografía Armenio',
        gradient: 'from-[#3a0a0a] to-[#9e3a3a]',
        cardBg: 'bg-red-900 hover:bg-red-800',
        cardBorder: 'hover:border-red-700',
        badgeBg: 'bg-red-800',
        backHover: 'hover:bg-red-800',
        flag: '/img/flags/Armenia.png',
    },
];

export default function CoursePage() {
    const [selectedCourse, setSelectedCourse] = useState<CourseId>('urdu');
    const [courseData, setCourseData] = useState<CourseData | null>(null);
    const [currentPhase, setCurrentPhase] = useState<number | null>(null);
    const [currentLevel, setCurrentLevel] = useState<number | null>(null);
    const [testResults, setTestResults] = useState<TestResults | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        setCourseData(null);
        setCurrentPhase(null);
        setCurrentLevel(null);
        setTestResults(null);
        const course = COURSES.find(c => c.id === selectedCourse)!;
        fetch(course.file)
            .then(response => response.json())
            .then((data: CourseData) => {
                setCourseData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error loading course data:', error);
                setLoading(false);
            });
    }, [selectedCourse]);

    const handleTestComplete = (results: TestResults) => {
        setTestResults(results);
    };

    const getCurrentLevel = (): Level | null => {
        if (!courseData || currentPhase === null || currentLevel === null) return null;
        const phase = courseData.phases.find(p => p.id === currentPhase);
        if (!phase) return null;
        return phase.levels.find(l => l.id === currentLevel) || null;
    };

    const getPreviousLevel = (): { phaseId: number; levelId: number } | null => {
        if (!courseData || currentPhase === null || currentLevel === null) return null;

        const currentPhaseIndex = courseData.phases.findIndex(p => p.id === currentPhase);
        const currentPhaseData = courseData.phases[currentPhaseIndex];
        const currentLevelIndex = currentPhaseData.levels.findIndex(l => l.id === currentLevel);

        if (currentLevelIndex > 0) {
            // Previous level in same phase
            return {
                phaseId: currentPhase,
                levelId: currentPhaseData.levels[currentLevelIndex - 1].id
            };
        } else if (currentPhaseIndex > 0) {
            // Last level of previous phase
            const previousPhase = courseData.phases[currentPhaseIndex - 1];
            return {
                phaseId: previousPhase.id,
                levelId: previousPhase.levels[previousPhase.levels.length - 1].id
            };
        }

        return null;
    };

    const getNextLevel = (): { phaseId: number; levelId: number } | null => {
        if (!courseData || currentPhase === null || currentLevel === null) return null;

        const currentPhaseIndex = courseData.phases.findIndex(p => p.id === currentPhase);
        const currentPhaseData = courseData.phases[currentPhaseIndex];
        const currentLevelIndex = currentPhaseData.levels.findIndex(l => l.id === currentLevel);

        if (currentLevelIndex < currentPhaseData.levels.length - 1) {
            // Next level in same phase
            return {
                phaseId: currentPhase,
                levelId: currentPhaseData.levels[currentLevelIndex + 1].id
            };
        } else if (currentPhaseIndex < courseData.phases.length - 1) {
            // First level of next phase
            const nextPhase = courseData.phases[currentPhaseIndex + 1];
            return {
                phaseId: nextPhase.id,
                levelId: nextPhase.levels[0].id
            };
        }

        return null;
    };

    const goToPreviousLevel = () => {
        const prev = getPreviousLevel();
        if (prev) {
            setCurrentPhase(prev.phaseId);
            setCurrentLevel(prev.levelId);
            setTestResults(null);
        }
    };

    const goToNextLevel = () => {
        const next = getNextLevel();
        if (next) {
            setCurrentPhase(next.phaseId);
            setCurrentLevel(next.levelId);
            setTestResults(null);
        }
    };

    const repeatLevel = () => {
        setTestResults(null);
    };

    const goBackToPhases = () => {
        setCurrentPhase(null);
        setCurrentLevel(null);
        setTestResults(null);
    };

    const goBackToLevels = () => {
        setCurrentLevel(null);
        setTestResults(null);
    };

    const activeCourse = COURSES.find(c => c.id === selectedCourse)!;

    if (loading) {
        return (
            <div className="min-h-screen kiburd-bg-primary flex items-center justify-center">
                <div className="text-xl kiburd-text-primary">Cargando curso...</div>
            </div>
        );
    }

    if (!courseData) {
        return (
            <div className="min-h-screen kiburd-bg-primary flex items-center justify-center">
                <div className="text-xl kiburd-text-primary">Error al cargar el curso</div>
            </div>
        );
    }

    const currentLevelData = getCurrentLevel();

    return (
        <div className={`min-h-screen bg-linear-to-br ${activeCourse.gradient}`}>
            <div className="container mx-auto px-4 py-8">
                {/* Course selector */}
                <div className="flex justify-center gap-3 mb-6">
                    {COURSES.map(course => (
                        <button
                            key={course.id}
                            onClick={() => setSelectedCourse(course.id)}
                            className={`px-5 py-2 rounded-full font-semibold transition-all border-2 ${selectedCourse === course.id
                                ? 'bg-white text-black border-white shadow-lg scale-105'
                                : 'bg-transparent kiburd-text-primary border-white/40 hover:border-white/80'
                                }`}
                        >
                            {course.label}
                        </button>
                    ))}
                </div>

                <h1 className="text-4xl font-bold kiburd-text-primary mb-4 text-center">
                    {activeCourse.title}
                </h1>
                <div className="flex justify-center mb-8">
                    <img src={activeCourse.flag} alt={activeCourse.label} className="h-20 rounded shadow-md" />
                </div>

                {/* Vista de fases */}
                {currentPhase === null && (
                    <div className="space-y-6">
                        <h2 className="text-2xl font-semibold kiburd-text-primary mb-6">Selecciona una fase:</h2>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                            {courseData.phases.map((phase) => (
                                <div
                                    key={phase.id}
                                    onClick={() => setCurrentPhase(phase.id)}
                                    className={`${activeCourse.cardBg} p-6 rounded-lg border-2 border-[var(--kiburd-bg-secondary)] ${activeCourse.cardBorder} cursor-pointer transition-all hover:scale-105`}
                                >
                                    <div className="flex flex-col items-center">
                                        <div className={`w-12 h-12 rounded-full ${activeCourse.badgeBg} text-white flex items-center justify-center font-bold text-xl shadow-lg border-2 border-white`}>
                                            {phase.id}
                                        </div>
                                        <img
                                            src={`/img/phases/${phase.id}.png`}
                                            alt={phase.title}
                                            className="w-32 h-32 object-contain"
                                        />
                                        <p className="kiburd-text-primary opacity-80">
                                            {phase.levels.length} niveles
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Vista de niveles */}
                {currentPhase !== null && currentLevel === null && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={goBackToPhases}
                                className={`px-4 py-2 kiburd-bg-secondary kiburd-text-primary rounded-lg ${activeCourse.backHover} hover:text-white hover:-translate-x-1 hover:-translate-y-1 hover:-rotate-2 transition-all duration-300 shadow-md hover:shadow-lg`}
                            >
                                ← Volver a fases
                            </button>
                            <h2 className="text-2xl font-semibold kiburd-text-primary">
                                {courseData.phases.find(p => p.id === currentPhase)?.title}
                            </h2>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
                            {courseData.phases.find(p => p.id === currentPhase)?.levels.map((level) => (
                                <div
                                    key={level.id}
                                    onClick={() => setCurrentLevel(level.id)}
                                    className={`kiburd-bg-secondary p-6 rounded-lg border-2 border-[var(--kiburd-bg-secondary)] ${activeCourse.cardBorder} cursor-pointer transition-colors`}
                                >
                                    <h3 className="text-xl font-semibold kiburd-text-primary mb-2">
                                        {level.title}
                                    </h3>
                                    <p className="kiburd-text-primary opacity-80 font-mono text-lg break-all">
                                        {level.letters}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Vista del nivel actual */}
                {currentLevelData && (
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-6">
                            <button
                                onClick={goBackToLevels}
                                className={`px-4 py-2 kiburd-bg-secondary kiburd-text-primary rounded-lg ${activeCourse.backHover} hover:text-white hover:-translate-x-1 hover:-translate-y-1 hover:-rotate-2 transition-all duration-300 shadow-md hover:shadow-lg`}
                            >
                                ← Volver a niveles
                            </button>
                            <h2 className="text-2xl font-semibold kiburd-text-primary">
                                {currentLevelData.title}
                            </h2>
                        </div>

                        {!testResults ? (
                            <CourseTypingTest
                                text={currentLevelData.letters}
                                onTestComplete={handleTestComplete}
                                keyboard={selectedCourse === 'armenian' ? 'armenian' : 'urdu'}
                            />
                        ) : (
                            <div className="space-y-6">
                                <TestResultsComponent
                                    results={testResults}
                                    onRestart={repeatLevel}
                                />

                                <div className="    flex flex-col gap-4 items-center">
                                    <button
                                        onClick={repeatLevel}
                                        className="px-12 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-700 transition-colors w-full max-w-xs"
                                    >
                                        ⟲ Repetir
                                    </button>

                                    <div className="flex gap-4 justify-center">
                                        {getPreviousLevel() && (
                                            <button
                                                onClick={goToPreviousLevel}
                                                className="px-9 py-3 bg-red-900 hover:bg-red-800 kiburd-text-primary rounded-lg transition-colors"
                                            >
                                                ← Anterior
                                            </button>
                                        )}

                                        {getNextLevel() && (
                                            <button
                                                onClick={goToNextLevel}
                                                className="px-9 py-3 bg-green-900 text-white rounded-lg hover:bg-green-800 transition-colors"
                                            >
                                                Siguiente →
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}