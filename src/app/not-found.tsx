import Link from "next/link";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center gap-6 p-6"
    >
      <h1 className="text-4xl">Page not found</h1>
      <Link href="/" className="profile-link profile-link-primary">
        Back to portfolio
      </Link>
    </main>
  );
}
