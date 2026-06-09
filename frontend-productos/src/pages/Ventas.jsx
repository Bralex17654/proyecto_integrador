import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getVentas, createVenta } from "../services/ventas.service";
import { getProductos } from "../services/productos.service";
import fondoVentas from "../assets/fondo_9.avif";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [formulario, setFormulario] = useState({
    producto_id: "",
    cantidad: 1,
    precio: "",
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    obtenerVentas();
    obtenerProductos();
  }, []);

  const obtenerVentas = async () => {
    try {
      const data = await getVentas();
      setVentas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTotal(Number(formulario.cantidad) * Number(formulario.precio));
  }, [formulario.cantidad, formulario.precio]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "producto_id") {
      const productoSeleccionado = productos.find(
        (p) => p.Id === Number(value),
      );
      setFormulario({
        ...formulario,
        producto_id: value,
        precio: productoSeleccionado ? productoSeleccionado.Precio : "",
      });
    } else {
      setFormulario({ ...formulario, [name]: value });
    }
  };

  const agregarVenta = async (e) => {
    e.preventDefault();
    try {
      const usuario = JSON.parse(localStorage.getItem("user"));

      const venta = {
        usuario_id: usuario.id,
        metodo_pago: "Efectivo",
        productos: [
          {
            producto_id: Number(formulario.producto_id),
            cantidad: Number(formulario.cantidad),
            precio: Number(formulario.precio),
          },
        ],
      };

      await createVenta(venta);
      alert("Venta registrada ✅");
      setFormulario({ producto_id: "", cantidad: 1, precio: "" });
      setTotal(0);
      obtenerVentas();
    } catch (error) {
      console.error(error);
      alert("Error al guardar venta");
    }
  };

  const ventasFiltradas = ventas.filter(
    (v) =>
      v.Planta?.toLowerCase().includes(busqueda.toLowerCase()) ||
      new Date(v.Fecha).toLocaleDateString().includes(busqueda),
  );

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fondoVentas})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div style={{ background: "rgba(0,0,0,.45)", minHeight: "100vh" }}>
        {/* NAVBAR */}
        <div
          className="text-white p-3 d-flex justify-content-between align-items-center"
          style={{ background: "rgba(20,20,20,.70)", backdropFilter: "blur(10px)" }}
        >
          <h2 className="m-0">Ventas</h2>
          <Link to="/admin" className="btn btn-light">⬅ Volver</Link>
        </div>

        <div className="container py-4">
          <div className="row">
            {/* FORMULARIO */}
            <div className="col-md-4">
              <div
                className="shadow p-4"
                style={{
                  borderRadius: "20px",
                  background: "rgba(255,255,255,.22)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,.25)",
                }}
              >
                <h4 className="mb-4 text-dark">Nueva Venta</h4>
                <form onSubmit={agregarVenta}>

                  {/* SELECTOR DE PRODUCTO */}
                  <select
                    className="form-control mb-3"
                    name="producto_id"
                    value={formulario.producto_id}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Selecciona un producto</option>
                    {productos.map((p) => (
                      <option key={p.Id} value={p.Id}>
                        {p.Nombre} — Stock: {p.Stock}
                      </option>
                    ))}
                  </select>

                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Cantidad"
                    name="cantidad"
                    value={formulario.cantidad}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    required
                  />

                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Precio unitario"
                    name="precio"
                    value={formulario.precio}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />

                  {/* TOTAL */}
                  <div
                    className="text-center mb-3 p-3"
                    style={{
                      background: "rgba(25,135,84,.85)",
                      color: "white",
                      borderRadius: "12px",
                      fontSize: "18px",
                      fontWeight: "bold",
                    }}
                  >
                    Total: ${total.toFixed(2)}
                  </div>

                  <button className="btn btn-success w-100">Guardar Venta</button>
                </form>
              </div>
            </div>

            {/* TABLA */}
            <div className="col-md-8">
              <div
                className="shadow p-4"
                style={{
                  borderRadius: "20px",
                  background: "rgba(255,255,255,.18)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,.25)",
                }}
              >
                <h4 className="mb-3 text-white">Lista de Ventas</h4>

                {/* BUSCADOR */}
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="🔍 Buscar por producto o fecha..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />

                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead style={{ background: "rgba(0,0,0,.75)", color: "white" }}>
                      <tr>
                        <th>ID</th>
                        <th>Fecha</th>
                        <th>Planta</th>
                        <th>Categoría</th>
                        <th>Cantidad</th>
                        <th>Precio</th>
                        <th>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ventasFiltradas.map((venta) => (
                        <tr key={venta.Id} style={{ background: "rgba(255,255,255,.12)" }}>
                          <td>{venta.Id}</td>
                          <td>{new Date(venta.Fecha).toLocaleDateString()}</td>
                          <td>{venta.Planta}</td>
                          <td>{venta.Categoria}</td>
                          <td>{venta.Cantidad}</td>
                          <td>${venta.Precio}</td>
                          <td><strong className="text-success">${venta.Total}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {ventasFiltradas.length === 0 && (
                    <p className="text-white">No hay ventas registradas</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ventas;
