import Link from "next/link";
import { Gauge, Library, PenLine, ShieldCheck } from "lucide-react";

type AppShellProps = {
  children?: React.ReactNode;
  eyebrow?: string;
  title?: string;
  description?: string;
};

export function AppShell({ children, eyebrow, title, description }: AppShellProps) {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-5 sm:px-6 lg:px-8">
      <header className="mb-6 flex flex-col gap-4 rounded-[2rem] border border-chrome-100/10 bg-black/30 p-4 backdrop-blur md:flex-row md:items-center md:justify-between">
        <Link href="/create" className="group flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-warning-400/40 bg-warning-500/15 text-warning-300 shadow-[0_0_35px_rgba(238,49,49,0.25)]">
            <Gauge className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.42em] text-warning-200/80">DemonDash</p>
            <h1 className="font-display text-xl font-black uppercase tracking-tight text-chrome-50">
              Crazy Story Skit Lab
            </h1>
          </div>
        </Link>
        <nav className="grid grid-cols-2 gap-2 text-sm text-chrome-200 sm:flex">
          <Link className="rounded-full border border-chrome-100/10 px-4 py-2 hover:border-warning-300/50 hover:text-warning-100" href="/create">
            <PenLine className="mr-2 inline h-4 w-4" />
            Create
          </Link>
          <Link className="rounded-full border border-chrome-100/10 px-4 py-2 hover:border-warning-300/50 hover:text-warning-100" href="/projects">
            <Library className="mr-2 inline h-4 w-4" />
            Projects
          </Link>
          <Link className="rounded-full border border-chrome-100/10 px-4 py-2 hover:border-warning-300/50 hover:text-warning-100" href="/dashboard">
            <ShieldCheck className="mr-2 inline h-4 w-4" />
            Dashboard
          </Link>
        </nav>
      </header>

      {(eyebrow || title || description) && (
        <section className="mb-6 max-w-4xl">
          {eyebrow && <p className="text-xs uppercase tracking-[0.38em] text-petrol-200">{eyebrow}</p>}
          {title && <h2 className="mt-2 font-display text-4xl font-black uppercase leading-none text-chrome-50 sm:text-6xl">{title}</h2>}
          {description && <p className="mt-4 max-w-2xl text-base leading-7 text-chrome-300">{description}</p>}
        </section>
      )}

      {children}
    </main>
  );
}
