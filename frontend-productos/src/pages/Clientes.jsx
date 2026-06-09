import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getClientes,
  createCliente,
  updateCliente,
  deleteCliente,
} from "../services/clientes.service";
import fondo from "../assets/fondo_8.png";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(false);
  const [idCliente, setIdCliente] = useState(null);
  const [cargando, setCargando] = useState(false);

  const [formulario, setFormulario] = useState({
    nombre: "",
    telefono: "",
    correo: "",
    direccion: "",
  });

  useEffect(() => {
    obtenerClientes();
  }, []);

  const obtenerClientes = async () => {
    try {
      const data = await getClientes();
      setClientes(data);
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
        await updateCliente(idCliente, formulario);
        alert("Cliente actualizado ✅");
        setEditando(false);
      } else {
        await createCliente(formulario);
        alert("Cliente registrado ✅");
      }
      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert("Error al guardar cliente");
    } finally {
      setCargando(false);
    }
    obtenerClientes();
  };

  const editarCliente = (cliente) => {
    setFormulario({
      nombre: cliente.Nombre,
      telefono: cliente.Telefono,
      correo: cliente.Correo,
      direccion: cliente.Direccion,
    });
    setIdCliente(cliente.Id);
    setEditando(true);
  };

  const eliminarCliente = async (id) => {
    if (!window.confirm("¿Eliminar cliente?")) return;
    try {
      await deleteCliente(id);
      alert("Cliente eliminado ✅");
      obtenerClientes();
    } catch (error) {
      console.error(error);
    }
  };

  const limpiarFormulario = () => {
    setFormulario({ nombre: "", telefono: "", correo: "", direccion: "" });
    setIdCliente(null);
    setEditando(false);
  };

  const clientesFiltrados = clientes.filter(
    (c) =>
      c.Nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.Correo?.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.Telefono?.includes(busqueda),
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
          <h2 className="m-0">👥 Clientes</h2>
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
                  {editando ? "Editar Cliente" : "Nuevo Cliente"}
                </h4>
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Nombre completo"
                    name="nombre"
                    value={formulario.nombre}
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
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Dirección"
                    name="direccion"
                    value={formulario.direccion}
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
                <h4 className="mb-3 text-dark">Lista de Clientes</h4>
                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="🔍 Buscar por nombre, correo o teléfono..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />
                <div className="table-responsive">
                  <table className="table table-hover align-middle">
                    <thead style={{ background: "rgba(0,0,0,.75)", color: "white" }}>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Teléfono</th>
                        <th>Correo</th>
                        <th>Dirección</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clientesFiltrados.map((cliente) => (
                        <tr key={cliente.Id}>
                          <td>{cliente.Id}</td>
                          <td>{cliente.Nombre}</td>
                          <td>{cliente.Telefono}</td>
                          <td>{cliente.Correo}</td>
                          <td>{cliente.Direccion}</td>
                          <td>
                            <button
                              className="btn btn-warning btn-sm me-2"
                              onClick={() => editarCliente(cliente)}
                            >
                              Editar
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => eliminarCliente(cliente.Id)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {clientesFiltrados.length === 0 && (
                    <p className="text-white">No hay clientes registrados</p>
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

export default Clientes;
