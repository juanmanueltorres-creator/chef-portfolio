const steps = ['PROVEEDORES', 'STOCK', 'PREPARACIÓN', 'PRODUCCIÓN', 'PASE', 'CLIENTE'];

export function OperationsFlow() {
  return (
    <ol className="operations-flow" aria-label="A kitchen's flow of work">
      {steps.map((step, index) => (
        <li className="operations-flow__step" key={step} style={{ '--flow-index': index } as React.CSSProperties}>
          <span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong>
        </li>
      ))}
    </ol>
  );
}
