import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProductos, updateProducto } from "../services/productos.service";
import fondoInventario from "../assets/fondo_7.png";

const Inventario = () => {
  const [productos, setProductos] = useState([]);

  const [busqueda, setBusqueda] = useState("");

  /* =========================
     OBTENER PRODUCTOS
  ========================= */

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const data = await getProductos();

      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     ACTUALIZAR STOCK
  ========================= */

  const actualizarStock = async (producto, cantidad) => {
    try {
      const nuevoStock = Number(producto.Stock) + cantidad;

      if (nuevoStock < 0) return;

      const productoActualizado = {
        nombre: producto.Nombre,
        descripcion: producto.Descripcion,
        precio: producto.Precio,
        categoria: producto.Categoria,
        stock: nuevoStock,
      };

      await updateProducto(producto.Id, productoActualizado);

      obtenerProductos();
    } catch (error) {
      console.error(error);

      alert("Error al actualizar stock");
    }
  };

  /* =========================
     FILTRO
  ========================= */

  const productosFiltrados = productos.filter((producto) =>
    producto.Nombre.toLowerCase().includes(busqueda.toLowerCase()),
  );

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fondoInventario})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* CAPA OSCURA */}

      <div
        style={{
          background: "rgba(0,0,0,.45)",
          minHeight: "100vh",
        }}
      >
        {/* NAVBAR */}

        <div
          className="text-white p-3 d-flex justify-content-between align-items-center"
          style={{
            background: "rgba(20,20,20,.70)",
            backdropFilter: "blur(10px)",
          }}
        >
          <h2 className="m-0">Inventario</h2>

          <Link to="/admin" className="btn btn-light">
            ⬅ Volver
          </Link>
        </div>

        <div className="container py-4">
          {/* BUSCADOR */}

          <div
            className="shadow p-4 mb-4"
            style={{
              borderRadius: "20px",
              background: "rgba(255,255,255,.20)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,.25)",
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* TABLA */}

          <div
            className="shadow p-4"
            style={{
              borderRadius: "20px",
              background: "rgba(255,255,255,.18)",
              backdropFilter: "blur(14px)",
              border: "1px solid rgba(255,255,255,.25)",
            }}
          >
            <h3 className="mb-4 text-white">Control de Inventario</h3>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead
                  style={{
                    background: "rgba(0,0,0,.75)",
                    color: "white",
                  }}
                >
                  <tr>
                    <th>ID</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {productosFiltrados.map((producto) => (
                    <tr
                      key={producto.Id}
                      style={{
                        background: "rgba(255,255,255,.15)",
                      }}
                    >
                      <td>{producto.Id}</td>

                      <td>{producto.Nombre}</td>

                      <td>{producto.Categoria}</td>

                      <td>${producto.Precio}</td>

                      <td>{producto.Stock}</td>

                      <td>
                        {producto.Stock <= 5 ? (
                          <span className="badge bg-danger">Stock Bajo</span>
                        ) : (
                          <span className="badge bg-success">Disponible</span>
                        )}
                      </td>

                      <td>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => actualizarStock(producto, 1)}
                        >
                          +1
                        </button>

                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => actualizarStock(producto, -1)}
                        >
                          -1
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {productosFiltrados.length === 0 && (
                <p className="text-white">No se encontraron productos</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventario;
