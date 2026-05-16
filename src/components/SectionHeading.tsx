interface SectionHeadingProps {
  subtitle: string;
  title: string;
  description?: string;
}

export function SectionHeading({ subtitle, title, description }: SectionHeadingProps) {
  return (
    <div className="section-heading">
      <p className="section-heading__label">{subtitle}</p>
      <h2 className="section-heading__title">{title}</h2>
      {description ? <p className="section-heading__description">{description}</p> : null}
    </div>
  );
}
