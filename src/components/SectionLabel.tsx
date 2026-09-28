type SectionLabelProps = { number: string; children: string; light?: boolean };

export function SectionLabel({ number, children, light = false }: SectionLabelProps) {
  return (
    <div className={`section-label${light ? ' section-label--light' : ''}`}>
      <span>{number}</span><span className="section-label__line" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
