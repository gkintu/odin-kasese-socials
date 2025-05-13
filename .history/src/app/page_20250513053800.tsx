// src/app/page.tsx (example modification)
import AuthStatusDisplay from '@/components/Auth/AuthStatusDisplay';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-100">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        {/*... existing content... */}
      </div>

      <div className="relative flex place-items-center">
        <h1 className="text-5xl font-bold text-indigo-600 hover:text-indigo-800 transition-colors">
          Welcome to Kasese Socials!
        </h1>
      </div>

      <div className="mt-12">
        <AuthStatusDisplay />
      </div>

      <div className="mb-32 mt-16 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        {/*... existing content... */}
      </div>
    </main>
  );
}
