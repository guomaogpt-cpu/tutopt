type PublicPageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

export function PublicPageHeader({ eyebrow, title, description }: PublicPageHeaderProps) {
  return (
    <div className="max-w-3xl">
      {eyebrow ? (
        <p className="text-sm font-medium uppercase tracking-wider text-blue-600">{eyebrow}</p>
      ) : null}
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
      {description ? (
        <p className="mt-4 text-base leading-relaxed text-slate-600 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
