const ProductoCard = ({ producto, agregarCarrito }) => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow h-100">
        <div className="card-body">
          <h5>{producto.Nombre}</h5>

          <p>{producto.Descripcion}</p>

          <h4>${producto.Precio}</h4>

          <p>Stock: {producto.Stock}</p>

          <button
            className="btn btn-success w-100"
            onClick={() => agregarCarrito(producto)}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductoCard;
