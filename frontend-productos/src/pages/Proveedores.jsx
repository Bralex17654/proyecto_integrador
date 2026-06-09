import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../services/proveedores.service";
import fondo from "../assets/fondo_7.png";

const Proveedores = () => {
  const [proveedores, setProveedores] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(false);
  const [idProveedor, setIdProveedor] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    empresa: "",
  });

  useEffect(() => {
    obtenerProveedores();
  }, []);

  const obtenerProveedores = async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cargando) return;
    setCargando(true);
    try {
      if (editando) {
        await updateProveedor(idProveedor, formulario);
        alert("Proveedor actualizado ✅");
        setEditando(false);
      } else {
        await createProveedor(formulario);
        alert("Proveedor registrado ✅");
      }
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert("Error al guardar proveedor");
    } finally {
      setCargando(false);
    }
    obtenerProveedores();
  };

  const editarProveedor = (proveedor) => {
    setFormulario({
      nombre: proveedor.Nombre,
      telefono: proveedor.Telefono,
      correo: proveedor.Correo,
      empresa: proveedor.Empresa,
    });
    setIdProveedor(proveedor.Id);
    setEditando(true);
  };

  const eliminarProveedor = async (id) => {
    if (!window.confirm("¿Eliminar proveedor?")) return;
    try {
      await deleteProveedor(id);
      alert("Proveedor eliminado ✅");
      obtenerProveedores();
    } catch (error) {
      console.error(error);
    }
  };

  const limpiarFormulario = () => {
    setFormulario({ nombre: "", telefono: "", correo: "", empresa: "" });
    setIdProveedor(null);
    setEditando(false);
  };

  const proveedoresFiltrados = proveedores.filter(
    (p) =>
      p.Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.Empresa?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.Telefono?.includes(busqueda),
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
      <div style={{ background: "rgba(0,0,0,.45)", minHeight: "100vh" }}>
        {/* NAVBAR */}
        <div
          className="text-white p-3 d-flex justify-content-between align-items-center"
          style={{ background: "rgba(20,20,20,.70)", backdropFilter: "blur(10px)" }}
        >
          <h2 className="m-0">🏭 Proveedores</h2>
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
                  background: "rgba(255,255,255,.25)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,.25)",
                }}
              >
                <h4 className="mb-4 text-dark">
                  {editando ? "Editar Proveedor" : "Nuevo Proveedor"}
                </h4>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Nombre del contacto"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Empresa"
                    name="empresa"
                    value={formulario.empresa}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="tel"
                    className="form-control mb-3"
                    placeholder="Teléfono"
                    name="telefono"
                    value={formulario.telefono}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    className="form-control mb-3"
                    placeholder="Correo electrónico"
                    name="correo"
                    value={formulario.correo}
                    onChange={handleChange}
                  />
                  <button className="btn btn-success w-100" disabled={cargando}>
                    {editando ? "Actualizar" : "Registrar"}
                  </button>
                  {editando && (
                    <button
                      type="button"
                      className="btn btn-secondary w-100 mt-2"
                      onClick={limpiarFormulario}
                    >
                      Cancelar
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* TABLA */}
            <div className="col-md-8">
              <div
                className="shadow p-4"
                style={{
                  borderRadius: "20px",
                  background: "rgba(255,255,255,.20)",
                  backdropFilter: "blur(14px)",
                  border: "1px solid rgba(255,255,255,.25)",
                }}
              >
                <h4 className="mb-3 text-dark">Lista de Proveedores</h4>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="🔍 Buscar por nombre, empresa o teléfono..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead style={{ background: "rgba(0,0,0,.75)", color: "white" }}>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Empresa</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proveedoresFiltrados.map((proveedor) => (
                        <tr key={proveedor.Id}>
                          <td>{proveedor.Id}</td>
                          <td>{proveedor.Nombre}</td>
                          <td>{proveedor.Empresa}</td>
                          <td>{proveedor.Telefono}</td>
                          <td>{proveedor.Correo}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => editarProveedor(proveedor)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => eliminarProveedor(proveedor.Id)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {proveedoresFiltrados.length === 0 && (
                    <p className="text-white">No hay proveedores registrados</p>
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

export default Proveedores;
