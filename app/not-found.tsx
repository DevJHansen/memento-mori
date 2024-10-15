import Link from 'next/link';

export default function Custom404() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-accent">404</h1>
        <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
        <Link
          href="/"
          className="mt-4 inline-block px-4 py-2 text-foreground bg-accent rounded"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}
