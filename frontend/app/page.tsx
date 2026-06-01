"use client";

import Link from "next/link";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold">
        BRAHMO Knowledge Assistant
      </h1>

      <p className="mt-4">
        Organizational AI Knowledge Infrastructure
      </p>

      <Link href="/ask">
        <button className="mt-6 bg-blue-600 text-white px-5 py-2 rounded">
          Ask Clinical Question
        </button>
      </Link>
    </main>
  );
}