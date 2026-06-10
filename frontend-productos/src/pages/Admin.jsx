import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../assets/Logo.png";
import fondo from "../assets/fondo_7.png";
import { getProductos } from "../services/productos.service";
import { createVenta } from "../services/ventas.service";

const Admin = () => {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [procesando, setProcesando] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => { obtenerProductos(); }, []);

  const obtenerProductos = async () => {
    setCargando(true);
    try {
      const data = await getProductos();
      setProductos(data);
      const init = {};
      data.forEach((p) => { init[p.Id] = 1; });
      setCantidades(init);
    } catch (error) {
      console.log(error);
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    navigate("/");
  };

  /* CARRITO */
  const agregarAlCarrito = (producto) => {
    const cantidad = Number(cantidades[producto.Id]) || 1;
    if (cantidad <= 0) return;
    if (cantidad > producto.Stock) {
      alert(`Solo hay ${producto.Stock} unidades de ${producto.Nombre}`);
      return;
    }
    setCarrito((prev) => {
      const existe = prev.find((i) => i.Id === producto.Id);
      if (existe) {
        const nueva = existe.cantidad + cantidad;
        if (nueva > producto.Stock) {
          alert(`Solo hay ${producto.Stock} unidades de ${producto.Nombre}`);
          return prev;
        }
        return prev.map((i) => i.Id === producto.Id ? { ...i, cantidad: nueva } : i);
      }
      return [...prev, { ...producto, cantidad }];
    });
  };

  const quitarDelCarrito = (id) => setCarrito((prev) => prev.filter((i) => i.Id !== id));

  const cambiarCantidadCarrito = (id, valor) => {
    const prod = productos.find((p) => p.Id === id);
    const nueva = Math.max(1, Number(valor));
    if (prod && nueva > prod.Stock) { alert(`Solo hay ${prod.Stock} unidades`); return; }
    setCarrito((prev) => prev.map((i) => i.Id === id ? { ...i, cantidad: nueva } : i));
  };

  const totalCarrito = carrito.reduce((acc, i) => acc + Number(i.Precio) * i.cantidad, 0);

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

      // Generar ticket
      setTicket({
        fecha: new Date().toLocaleString(),
        items: [...carrito],
        total: totalCarrito,
      });

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

  const menuLinks = [
    { to: "/productos",   label: "📦 Productos" },
    { to: "/inventario",  label: "🌿 Inventario" },
    { to: "/ventas",      label: "💰 Ventas" },
    { to: "/clientes",    label: "👥 Clientes" },
    { to: "/proveedores", label: "🏭 Proveedores" },
    { to: "/reportes",    label: "📊 Reportes" },
    { to: "/dashboard",   label: "📈 Dashboard" },
  ];

  return (
    <div className="container-fluid p-0" style={{ minHeight: "100vh", backgroundImage: `url(${fondo})`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed" }}>
      <div style={{ background: "rgba(0,0,0,0.45)", minHeight: "100vh" }}>

        {/* NAVBAR */}
        <div className="text-white p-2 p-md-3 d-flex justify-content-between align-items-center" style={{ background: "rgba(20,20,20,0.75)", backdropFilter: "blur(10px)" }}>
          <div className="d-flex align-items-center gap-2">
            {/* BOTÓN MENÚ MÓVIL */}
            <button className="btn btn-outline-light btn-sm d-md-none" onClick={() => setMenuAbierto(!menuAbierto)}>☰</button>
            <img src={logo} alt="Logo" style={{ width: "45px", height: "45px", objectFit: "cover", borderRadius: "50%" }} />
            <h5 className="m-0 fw-bold d-none d-sm-block">Panel Administrativo 🌱</h5>
            <h6 className="m-0 fw-bold d-sm-none">Vivero 🌱</h6>
          </div>
          <button className="btn btn-danger btn-sm" onClick={cerrarSesion} style={{ borderRadius: "10px" }}>Salir</button>
        </div>

        {/* MENÚ MÓVIL DESPLEGABLE */}
        {menuAbierto && (
          <div className="d-md-none p-3" style={{ background: "rgba(25,135,84,0.95)", backdropFilter: "blur(8px)" }}>
            <div className="d-grid gap-2">
              {menuLinks.map((item) => (
                <Link key={item.to} to={item.to} className="btn btn-light btn-sm" style={{ borderRadius: "10px" }} onClick={() => setMenuAbierto(false)}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="row g-0">
          {/* SIDEBAR ESCRITORIO */}
          <div className="col-md-2 text-white p-3 d-none d-md-block" style={{ minHeight: "100vh", background: "rgba(25,135,84,0.88)", backdropFilter: "blur(8px)" }}>
            <h5 className="mb-3 fw-bold">Menú</h5>
            <div className="d-grid gap-2">
              {menuLinks.map((item) => (
                <Link key={item.to} to={item.to} className="btn btn-light btn-sm shadow-sm" style={{ borderRadius: "10px" }}>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* CONTENIDO PRINCIPAL */}
          <div className="col-12 col-md-7 p-3 p-md-4 text-white">
            <div className="p-3 rounded shadow mb-3" style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(10px)" }}>
              <h4 className="fw-bold mb-1">Bienvenido a tu inventario 🌿</h4>
              <p className="mb-0 small">Administra el sistema del vivero desde aquí.</p>
            </div>

            {/* BARRA DE BÚSQUEDA */}
            <input
              type="text"
              className="form-control form-control-lg mb-3"
              placeholder="🔍 Buscar planta por nombre o categoría..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              style={{ borderRadius: "14px" }}
            />

            <h5 className="mb-3 fw-bold">
              Inventario Disponible
              {busqueda && !cargando && <span className="fs-6 fw-normal ms-2 text-white-50">— {productosFiltrados.length} resultado(s)</span>}
            </h5>

            {/* ESQUELETOS */}
            {cargando && (
              <div className="row">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="col-6 col-md-4 mb-3">
                    <div className="card border-0" style={{ borderRadius: "16px", overflow: "hidden", background: "rgba(255,255,255,0.15)" }}>
                      <div style={{ height: "140px", background: "rgba(255,255,255,0.1)", animation: "pulse 1.5s infinite" }} />
                      <div className="p-2">
                        <div style={{ height: "14px", borderRadius: "6px", background: "rgba(255,255,255,0.15)", marginBottom: "6px", animation: "pulse 1.5s infinite" }} />
                        <div style={{ height: "24px", borderRadius: "6px", background: "rgba(255,255,255,0.1)", animation: "pulse 1.5s infinite" }} />
                      </div>
                    </div>
                  </div>
                ))}
                <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.4}}`}</style>
              </div>
            )}

            {/* TARJETAS */}
            {!cargando && (
              <div className="row">
                {productosFiltrados.map((producto) => (
                  <div key={producto.Id} className="col-6 col-md-4 mb-3">
                    <div className="card border-0 shadow h-100 text-center" style={{ borderRadius: "16px", overflow: "hidden", background: "rgba(255,255,255,0.95)" }}>
                      <img src={producto.Imagen} alt={producto.Nombre} loading="lazy"
                        style={{ height: "140px", objectFit: "cover" }}
                        onError={(e) => { e.target.style.display = "none"; }} />
                      <div className="card-body p-2 d-flex flex-column">
                        <h6 className="fw-bold text-dark mb-1" style={{ fontSize: "13px" }}>{producto.Nombre}</h6>
                        <p className="text-muted mb-1" style={{ fontSize: "11px" }}>{producto.Categoria}</p>
                        <span className={`badge mb-1 ${producto.Stock <= 5 ? "bg-danger" : "bg-success"}`} style={{ fontSize: "11px" }}>
                          Stock: {producto.Stock}
                        </span>
                        <p className="text-success fw-bold mb-2" style={{ fontSize: "14px" }}>${producto.Precio}</p>
                        <div className="d-flex gap-1 mt-auto">
                          <input
                            type="number"
                            className="form-control form-control-sm text-center p-1"
                            value={cantidades[producto.Id] || 1}
                            min="1" max={producto.Stock}
                            onChange={(e) => setCantidades({ ...cantidades, [producto.Id]: e.target.value })}
                            style={{ width: "50px", borderRadius: "8px", fontSize: "13px" }}
                          />
                          <button
                            className="btn btn-success btn-sm flex-grow-1"
                            style={{ borderRadius: "8px", fontSize: "12px" }}
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
                {productosFiltrados.length === 0 && (
                  <div className="alert alert-light">{busqueda ? `Sin resultados para "${busqueda}"` : "No hay productos registrados"}</div>
                )}
              </div>
            )}
          </div>

          {/* CARRITO */}
          <div className="col-12 col-md-3 p-3">
            <div className="shadow p-3" style={{ borderRadius: "20px", background: "rgba(255,255,255,0.18)", backdropFilter: "blur(14px)", border: "1px solid rgba(255,255,255,.3)", color: "white", position: "sticky", top: "10px" }}>
              <h6 className="fw-bold mb-3">🛒 Carrito de Venta {carrito.length > 0 && <span className="badge bg-success">{carrito.length}</span>}</h6>
              {carrito.length === 0 ? (
                <p className="text-white-50 small">Agrega productos para crear una venta.</p>
              ) : (
                <>
                  {carrito.map((item) => (
                    <div key={item.Id} className="mb-2 p-2 rounded" style={{ background: "rgba(255,255,255,.12)" }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="fw-bold" style={{ fontSize: "13px" }}>{item.Nombre}</span>
                        <button className="btn btn-danger btn-sm py-0 px-1" style={{ fontSize: "11px" }} onClick={() => quitarDelCarrito(item.Id)}>✕</button>
                      </div>
                      <div className="d-flex align-items-center gap-2 mt-1">
                        <input type="number" className="form-control form-control-sm text-center"
                          value={item.cantidad} min="1"
                          max={productos.find((p) => p.Id === item.Id)?.Stock || 999}
                          onChange={(e) => cambiarCantidadCarrito(item.Id, e.target.value)}
                          style={{ width: "55px", borderRadius: "6px", fontSize: "12px" }} />
                        <span style={{ fontSize: "12px" }} className="text-white-50">× ${item.Precio}</span>
                        <span className="ms-auto fw-bold text-success" style={{ fontSize: "13px" }}>${(Number(item.Precio) * item.cantidad).toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                  <hr style={{ borderColor: "rgba(255,255,255,.3)" }} />
                  <div className="d-flex justify-content-between fw-bold mb-3">
                    <span>Total:</span>
                    <span className="text-success fs-5">${totalCarrito.toFixed(2)}</span>
                  </div>
                  <button className="btn btn-success w-100 fw-bold mb-2" style={{ borderRadius: "12px" }} onClick={registrarVenta} disabled={procesando}>
                    {procesando ? "Procesando..." : "✅ Registrar Venta"}
                  </button>
                  <button className="btn btn-outline-light w-100" style={{ borderRadius: "12px", fontSize: "13px" }} onClick={() => setCarrito([])}>
                    Vaciar carrito
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ======= MODAL TICKET ======= */}
      {ticket && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ background: "rgba(0,0,0,0.7)", zIndex: 9999 }}>
          <div className="ticket-print bg-white shadow-lg" style={{ maxWidth: "380px", width: "90%", borderRadius: "16px", overflow: "hidden", border: "1px solid #c8e6c9" }}>
            {/* CABECERA TICKET */}
            <div className="text-center p-3" style={{ background: "#198754", color: "#fff" }}>
              <img src={logo} alt="Logo" style={{ width: "55px", height: "55px", borderRadius: "50%", objectFit: "cover", border: "2px solid #fff" }} />
              <h5 className="fw-bold mt-2 mb-0">Plantas Perenes de la Vega</h5>
              <p className="small mb-0" style={{ opacity: 0.9 }}>Ticket de Venta</p>
            </div>

            <div className="p-3">
              <p className="text-muted small text-center mb-3">{ticket.fecha}</p>

              {/* PRODUCTOS */}
              <table className="table table-sm mb-2">
                <thead>
                  <tr style={{ fontSize: "12px", color: "#198754", borderBottom: "2px solid #198754" }}>
                    <th>Producto</th>
                    <th className="text-center">Cant.</th>
                    <th className="text-end">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {ticket.items.map((item) => (
                    <tr key={item.Id} style={{ fontSize: "13px" }}>
                      <td>{item.Nombre}</td>
                      <td className="text-center">{item.cantidad} × ${item.Precio}</td>
                      <td className="text-end fw-bold">${(Number(item.Precio) * item.cantidad).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <hr style={{ borderColor: "#c8e6c9" }} />

              <div className="d-flex justify-content-between fw-bold fs-5 mb-3" style={{ color: "#198754" }}>
                <span>TOTAL</span>
                <span>${ticket.total.toFixed(2)}</span>
              </div>

              <p className="text-center text-muted small mb-3">¡Gracias por su compra! 🌱</p>

              <div className="d-flex gap-2 no-print">
                <button className="btn btn-outline-success flex-grow-1" style={{ borderRadius: "10px" }}
                  onClick={() => window.print()}>
                  🖨️ Imprimir
                </button>
                <button className="btn btn-success flex-grow-1" style={{ borderRadius: "10px" }}
                  onClick={() => setTicket(null)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ESTILOS PARA IMPRIMIR TICKET */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .ticket-print, .ticket-print * { visibility: visible; }
          .ticket-print {
            position: absolute;
            top: 0;
            left: 0;
            width: 100% !important;
            max-width: 100% !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .no-print { display: none !important; }
        }
        @media (max-width: 767px) {
          body { font-size: 14px; }
        }
      `}</style>
    </div>
  );
};

export default Admin;
