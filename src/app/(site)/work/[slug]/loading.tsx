export default function LoadingCaseStudy() {
  return (
    <main className="gutter min-h-[75svh] pt-[calc(var(--nav-block)+4rem)] pb-16" aria-busy="true">
      <p role="status" className="eyebrow text-[var(--color-muted)]">Opening case study…</p>
      <div aria-hidden="true" className="mt-12 max-w-3xl space-y-5">
        <div className="h-16 w-3/4 rounded bg-[var(--color-line)]" />
        <div className="h-16 w-1/2 rounded bg-[var(--color-line)]" />
        <div className="mt-10 h-4 w-full rounded bg-[var(--color-line)]" />
        <div className="h-4 w-4/5 rounded bg-[var(--color-line)]" />
      </div>
    </main>
  );
}
