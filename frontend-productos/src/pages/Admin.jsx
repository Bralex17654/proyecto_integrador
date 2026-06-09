import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/Logo.png";
import fondo from "../assets/fondo_7.png";
import { getProductos } from "../services/productos.service";
import { createVenta } from "../services/ventas.service";

const Admin = () => {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [procesando, setProcesando] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
      const init = {};
      data.forEach((p) => { init[p.Id] = 1; });
      setCantidades(init);
    } catch (error) {
      console.log(error);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  };

  /* =========================
     CARRITO
  ========================= */

  const agregarAlCarrito = (producto) => {
    const cantidad = Number(cantidades[producto.Id]) || 1;
    if (cantidad <= 0) return;
    if (cantidad > producto.Stock) {
      alert(`Solo hay ${producto.Stock} unidades disponibles de ${producto.Nombre}`);
      return;
    }
    setCarrito((prev) => {
      const existe = prev.find((i) => i.Id === producto.Id);
      if (existe) {
        const nuevaCantidad = existe.cantidad + cantidad;
        if (nuevaCantidad > producto.Stock) {
          alert(`Solo hay ${producto.Stock} unidades disponibles de ${producto.Nombre}`);
          return prev;
        }
        return prev.map((i) =>
          i.Id === producto.Id ? { ...i, cantidad: nuevaCantidad } : i
        );
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const quitarDelCarrito = (id) => {
    setCarrito((prev) => prev.filter((i) => i.Id !== id));
  };

  const cambiarCantidadCarrito = (id, valor) => {
    const producto = productos.find((p) => p.Id === id);
    const nueva = Math.max(1, Number(valor));
    if (producto && nueva > producto.Stock) {
      alert(`Solo hay ${producto.Stock} unidades disponibles`);
      return;
    }
    setCarrito((prev) =>
      prev.map((i) => (i.Id === id ? { ...i, cantidad: nueva } : i))
    );
  };

  const totalCarrito = carrito.reduce(
    (acc, i) => acc + Number(i.Precio) * i.cantidad, 0
  );

  const registrarVenta = async () => {
    if (carrito.length === 0) return;
    setProcesando(true);
    try {
      const usuario = JSON.parse(localStorage.getItem("user"));
      const venta = {
        usuario_id: usuario.id,
        metodo_pago: "Efectivo",
        productos: carrito.map((i) => ({
          producto_id: i.Id,
          cantidad: i.cantidad,
          precio: Number(i.Precio),
        })),
      };
      await createVenta(venta);
      alert(`Venta registrada ✅\nTotal: $${totalCarrito.toFixed(2)}`);
      setCarrito([]);
      obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("Error al registrar la venta");
    } finally {
      setProcesando(false);
    }
  };

  const productosFiltrados = productos.filter((p) =>
    p.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.Categoria?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div style={{ background: "rgba(0,0,0,0.45)", minHeight: "100vh" }}>

        {/* NAVBAR */}
        <div
          className="text-white p-3 d-flex justify-content-between align-items-center"
          style={{ background: "rgba(20,20,20,0.75)", backdropFilter: "blur(10px)" }}
        >
          <div className="d-flex align-items-center">
            <img src={logo} alt="Logo" style={{ width: "65px", height: "65px", objectFit: "cover", borderRadius: "50%", marginRight: "15px", boxShadow: "0 0 15px rgba(255,255,255,.3)" }} />
            <h2 className="m-0 fw-bold">Panel de Control Administrativo 🌱</h2>
          </div>
          <button className="btn btn-danger" onClick={cerrarSesion} style={{ borderRadius: "12px", padding: "10px 20px" }}>
            Cerrar sesión
          </button>
        </div>

        <div className="row g-0">
          {/* SIDEBAR */}
          <div className="col-md-2 text-white p-4" style={{ minHeight: "100vh", background: "rgba(25,135,84,0.88)", backdropFilter: "blur(8px)" }}>
            <h4 className="mb-4 fw-bold">Menú</h4>
            <div className="d-grid gap-3">
              {[
                { to: "/productos", label: "📦 Productos" },
                { to: "/inventario", label: "🌿 Inventario" },
                { to: "/ventas", label: "💰 Ventas" },
                { to: "/clientes", label: "👥 Clientes" },
                { to: "/proveedores", label: "🏭 Proveedores" },
                { to: "/reportes", label: "📊 Reportes" },
                { to: "/dashboard", label: "📈 Dashboard" },
              ].map((item) => (
                <Link key={item.to} to={item.to} className="btn btn-light shadow-sm" style={{ borderRadius: "12px" }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="col-md-7 p-4 text-white">
            {/* BIENVENIDA */}
            <div className="p-4 rounded shadow mb-4" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
              <h1 className="fw-bold mb-2">Bienvenido a tu inventario 🌿</h1>
              <p className="mb-0">Desde aquí podrás administrar todo el sistema del vivero.</p>
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <div className="mb-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="🔍 Buscar planta por nombre o categoría..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                style={{ borderRadius: "14px", fontSize: "16px" }}
              />
            </div>

            <h3 className="mb-4 fw-bold">
              Inventario Disponible
              {busqueda && (
                <span className="fs-6 fw-normal ms-2 text-white-50">
                  — {productosFiltrados.length} resultado(s)
                </span>
              )}
            </h3>

            {/* TARJETAS */}
            <div className="row">
              {productosFiltrados.map((producto) => (
                <div key={producto.Id} className="col-md-4 mb-4">
                  <div
                    className="card border-0 shadow-lg h-100 text-center"
                    style={{ borderRadius: "20px", overflow: "hidden", background: "rgba(255,255,255,0.95)", transition: ".3s" }}
                  >
                    <img
                      src={producto.Imagen}
                      alt={producto.Nombre}
                      style={{ height: "180px", objectFit: "cover" }}
                      onError={(e) => { e.target.style.display = "none"; }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="fw-bold text-dark mb-1">{producto.Nombre}</h5>
                      <p className="text-muted mb-2 small">{producto.Categoria}</p>
                      <span className={`badge mb-2 p-2 ${producto.Stock <= 5 ? "bg-danger" : "bg-success"}`}>
                        Stock: {producto.Stock}
                      </span>
                      <h5 className="text-success fw-bold mb-3">${producto.Precio}</h5>

                      {/* AGREGAR AL CARRITO */}
                      <div className="d-flex gap-2 mt-auto">
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          value={cantidades[producto.Id] || 1}
                          min="1"
                          max={producto.Stock}
                          onChange={(e) =>
                            setCantidades({ ...cantidades, [producto.Id]: e.target.value })
                          }
                          style={{ width: "65px", borderRadius: "10px" }}
                        />
                        <button
                          className="btn btn-success btn-sm flex-grow-1"
                          style={{ borderRadius: "10px" }}
                          onClick={() => agregarAlCarrito(producto)}
                          disabled={producto.Stock === 0}
                        >
                          {producto.Stock === 0 ? "Sin stock" : "🛒 Agregar"}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {productosFiltrados.length === 0 && (
              <div className="alert alert-light" style={{ background: "rgba(255,255,255,.75)" }}>
                {busqueda ? `No se encontraron productos con "${busqueda}"` : "No hay productos registrados"}
              </div>
            )}
          </div>

          {/* CARRITO DE VENTA */}
          <div className="col-md-3 p-4">
            <div
              className="shadow p-4 sticky-top"
              style={{
                top: "20px",
                borderRadius: "20px",
                background: "rgba(255,255,255,0.18)",
                backdropFilter: "blur(14px)",
                border: "1px solid rgba(255,255,255,.3)",
                color: "white",
              }}
            >
              <h5 className="fw-bold mb-3">🛒 Carrito de Venta</h5>

              {carrito.length === 0 ? (
                <p className="text-white-50 small">Agrega productos para crear una venta.</p>
              ) : (
                <>
                  {carrito.map((item) => (
                    <div key={item.Id} className="mb-3 p-2 rounded" style={{ background: "rgba(255,255,255,.12)" }}>
                      <div className="d-flex justify-content-between align-items-start">
                        <span className="fw-bold small">{item.Nombre}</span>
                        <button
                          className="btn btn-sm btn-danger py-0 px-1"
                          style={{ fontSize: "11px" }}
                          onClick={() => quitarDelCarrito(item.Id)}
                        >
                          ✕
                        </button>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <input
                          type="number"
                          className="form-control form-control-sm text-center"
                          value={item.cantidad}
                          min="1"
                          max={productos.find((p) => p.Id === item.Id)?.Stock || 999}
                          onChange={(e) => cambiarCantidadCarrito(item.Id, e.target.value)}
                          style={{ width: "60px", borderRadius: "8px" }}
                        />
                        <span className="small text-white-50">× ${item.Precio}</span>
                        <span className="ms-auto fw-bold text-success small">
                          ${(Number(item.Precio) * item.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}

                  <hr style={{ borderColor: "rgba(255,255,255,.3)" }} />

                  <div className="d-flex justify-content-between fw-bold mb-3">
                    <span>Total:</span>
                    <span className="text-success fs-5">${totalCarrito.toFixed(2)}</span>
                  </div>

                  <button
                    className="btn btn-success w-100 fw-bold"
                    style={{ borderRadius: "12px" }}
                    onClick={registrarVenta}
                    disabled={procesando}
                  >
                    {procesando ? "Procesando..." : "✅ Registrar Venta"}
                  </button>

                  <button
                    className="btn btn-outline-light w-100 mt-2"
                    style={{ borderRadius: "12px", fontSize: "13px" }}
                    onClick={() => setCarrito([])}
                  >
                    Vaciar carrito
                  </button>
                </>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Admin;
