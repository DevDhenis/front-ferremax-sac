export default function Panel({ title, eyebrow, action, children, className = "", bodyClassName = "" }) {
  return (
    <section className={`bg-card rounded-xl border border-border shadow-sm flex flex-col ${className}`}>
      <header className="flex items-start justify-between gap-3 px-5 pt-5 pb-3 border-b border-border/40">
        <div>
          {eyebrow && (
            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {eyebrow}
            </span>
          )}
          <h3 className="text-sm font-bold text-foreground m-0 mt-0.5">{title}</h3>
        </div>
        {action}
      </header>
      <div className={`p-5 flex-1 ${bodyClassName}`}>{children}</div>
    </section>
  );
}
