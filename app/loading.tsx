export default function Loading() {
  return <div className="page-shell route-loading"><div className="eyebrow">Cargando colección</div><div className="product-grid">{Array.from({ length: 6 }, (_, index) => <div className="product-skeleton" key={index}><div /><span /><span /></div>)}</div></div>;
}
