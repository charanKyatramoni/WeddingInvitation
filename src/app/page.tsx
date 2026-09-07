import Link from "next/link";

const foundation = ["Invitation content model", "Theme contract", "Supabase-ready schema"];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-6 py-16">
      <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-rose-700">Vowcraft</p>
      <h1 className="max-w-3xl text-5xl font-semibold tracking-tight sm:text-7xl">One platform. Every celebration.</h1>
      <p className="mt-7 max-w-2xl text-lg leading-8 text-stone-600">
        A scalable foundation for managing bespoke wedding invitations from one private dashboard.
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        {foundation.map((item) => <span className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm" key={item}>{item}</span>)}
      </div>
      <Link className="mt-12 w-fit rounded-full bg-stone-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-rose-800" href="/admin/login">
        Admin sign in
      </Link>
    </main>
  );
}
