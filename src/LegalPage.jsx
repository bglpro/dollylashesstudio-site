import { C } from "./theme";

export function LegalSection({ title, children }) {
  return (
    <section className="border-t py-8" style={{ borderColor: C.line }}>
      <h2
        className="mb-4 text-sm font-semibold uppercase tracking-[0.16em]"
        style={{ color: C.muted }}
      >
        {title}
      </h2>
      <div className="space-y-4 text-base leading-relaxed" style={{ color: C.ink }}>
        {children}
      </div>
    </section>
  );
}

export function LegalList({ items }) {
  return (
    <ul className="list-none space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" style={{ color: C.muted }}>
            —
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function LegalPage({ title, updated, intro, children }) {
  return (
    <main className="mx-auto max-w-3xl px-6 pb-24 pt-16 md:pt-24">
      <h1
        className="text-4xl font-semibold leading-tight tracking-tight md:text-5xl"
        style={{ color: C.ink }}
      >
        {title}
      </h1>

      {updated ? (
        <p className="mt-3 text-sm" style={{ color: C.muted }}>
          Dernière mise à jour : {updated}
        </p>
      ) : null}

      {intro ? (
        <p className="mt-6 text-lg leading-relaxed" style={{ color: C.ink }}>
          {intro}
        </p>
      ) : null}

      <div className="mt-8">{children}</div>
    </main>
  );
}
