'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function TopBar() {
    const pathname = usePathname();

    return (
        <nav className="bg-green-950 shadow-md border-b-2 border-green-600">
            <div className="container mx-auto px-4 max-w-6xl">
                <div className="flex items-center justify-between h-16">
                    {/* Logo y nombre */}
                    <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                        <img
                            src="/PakistanFlag.png"
                            alt="Bandera de Pakistán"
                            className="w-10 h-7 object-cover rounded shadow-sm"
                        />
                        <h1 className="text-2xl font-bold kiburd-text-primary">Kiburd</h1>
                    </Link>

                    {/* Navegación */}
                    <div className="flex items-center space-x-6">
                        <Link
                            href="/free-test"
                            className={`px-4 py-2 rounded-md transition-colors ${pathname === '/free-test' || pathname === '/'
                                ? 'bg-green-600 text-white'
                                : 'kiburd-text-primary hover:kiburd-bg-secondary'
                                }`}
                        >
                            Custom test
                        </Link>
                        <Link
                            href="/course"
                            className={`px-4 py-2 rounded-md transition-colors ${pathname === '/course'
                                ? 'bg-green-600 text-white'
                                : 'kiburd-text-primary hover:kiburd-bg-secondary'
                                }`}
                        >
                            Curso
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}