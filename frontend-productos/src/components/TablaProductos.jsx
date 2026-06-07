const TablaProductos = ({ productos, editarProducto, eliminarProducto }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Stock</th>
          <th>Acciones</th>
        </tr>
      </thead>

      <tbody>
        {productos.map((producto) => (
          <tr key={producto.Id}>
            <td>{producto.Id}</td>

            <td>{producto.Nombre}</td>

            <td>${producto.Precio}</td>

            <td>{producto.Stock}</td>

            <td>
              <button
                className="btn btn-warning btn-sm me-2"
                onClick={() => editarProducto(producto)}
              >
                Editar
              </button>

              <button
                className="btn btn-danger btn-sm"
                onClick={() => eliminarProducto(producto.Id)}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaProductos;
