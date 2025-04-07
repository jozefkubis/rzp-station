"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="text-center space-y-6 mt-20">
      <h1 className="text-4xl font-bold text-gray-900">
        Táto stránka neexistuje 😞
      </h1>
      <p className="text-lg text-gray-600">
        Zdá sa, že stránka, ktorú hľadáte, nebola nájdená.
      </p>

      <div className="flex justify-center gap-4">
        <button
          onClick={() => router.back()}
          className="bg-gray-300 text-gray-800 px-6 py-3 text-lg rounded-md hover:bg-gray-400 transition"
        >
          🔙 Späť
        </button>

        <Link
          href="/"
          className="bg-accent-500 text-primary-800 px-6 py-3 text-lg rounded-md hover:bg-accent-600 transition"
        >
          🏠 Domov
        </Link>
      </div>
    </main>
  );
}
