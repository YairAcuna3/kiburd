'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/free-test');
  }, [router]);

  return (
    <div className="min-h-screen bg-linear-to-br from-[#01411c] to-[#5d993e] flex items-center justify-center">
      <div className="text-white text-xl">Cargando...</div>
    </div>
  );
}
