// kasese-socials/src/app/page.tsx
// The default Image import is commented out as it is not being used immediately.
// import Image from 'next/image';

// This is the main functional component for the homepage.
export default function Home() {
  return (
    // The <main> tag serves as the semantic HTML element for the main content of the page.
    // The className applies default Next.js styling, which can be customized later.
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      {/* The heading below is the one targeted by the test. */}
      <h1>Welcome to Kasese Socials</h1>

      {/* The default Next.js structure is retained for now, 
          but it will be replaced as the project evolves. */}
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Get started by editing&nbsp;
          <code className="font-mono font-bold">src/app/page.tsx</code>
        </p>
        {/* Additional default content can either be retained or removed as needed. */}
      </div>
    </main>
  );
}
