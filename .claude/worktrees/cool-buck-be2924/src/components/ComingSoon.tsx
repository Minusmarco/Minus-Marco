import Link from "next/link";

export default function ComingSoon({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 px-6 text-center">
      <div className="h-1 w-16 bg-accent rounded-full" />
      <h1 className="font-display text-6xl sm:text-7xl font-bold text-text-primary tracking-tight">
        {title}
      </h1>
      <p className="text-text-secondary text-lg max-w-md">{description}</p>
      <Link
        href="/"
        className="mt-4 inline-flex items-center gap-2 text-sm font-sans font-medium text-text-secondary hover:text-accent transition-colors"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Home
      </Link>
    </div>
  );
}
