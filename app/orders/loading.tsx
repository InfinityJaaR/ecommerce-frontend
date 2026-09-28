export default function Loading() {
  return <div className="page-shell route-loading"><div className="eyebrow">Cargando tus pedidos</div><div className="orders-skeleton">{Array.from({ length: 3 }, (_, index) => <div className="order-skeleton" key={index} />)}</div></div>;
}
