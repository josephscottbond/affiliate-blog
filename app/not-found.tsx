import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
      <h1
        className="text-6xl font-bold mb-4"
        style={{ fontFamily: "var(--font-serif)" }}
      >
        404
      </h1>
      <h2 className="text-2xl text-[var(--color-text-muted)] mb-8">
        Page not found
      </h2>
      <p className="text-[var(--color-text-muted)] mb-8 max-w-md">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It may
        have been moved or deleted.
      </p>
      <Link href="/" className="btn btn-primary">
        Go back home
      </Link>
    </div>
  );
}
