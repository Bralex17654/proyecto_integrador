import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/productos.service";
import fondoProductos from "../assets/fondo_8.png";

const Productos = () => {
  const [productos, setProductos] = useState([]);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
    imagen: "",
  });

  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [idProducto, setIdProducto] = useState(null);

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
     HANDLE CHANGE
  ========================= */

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value,
    });
  };

  /* =========================
     HANDLE IMAGEN
  ========================= */

  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert("La imagen no puede superar 2 MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormulario((prev) => ({ ...prev, imagen: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  /* =========================
     CREAR / EDITAR
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cargando) return;
    setCargando(true);
    try {
      const datos = {
        nombre: formulario.nombre,
        descripcion: formulario.descripcion,
        precio: formulario.precio,
        categoria: formulario.categoria,
        stock: formulario.stock,
        imagen: formulario.imagen,
      };

      if (editando) {
        await updateProducto(idProducto, datos);

        alert("Producto actualizado ✅");
        setEditando(false);
      } else {
        await createProducto(datos);

        alert("Producto creado ✅");
      }

      limpiarFormulario();
    } catch (error) {
      console.error(error);
      alert("Error al guardar producto");
    } finally {
      setCargando(false);
    }
    obtenerProductos();
  };

  /* =========================
     EDITAR
  ========================= */

  const editarProducto = (producto) => {
    setFormulario({
      nombre: producto.Nombre,
      descripcion: producto.Descripcion,
      precio: producto.Precio,
      categoria: producto.Categoria,
      stock: producto.Stock,
      imagen: producto.Imagen || "",
    });

    setIdProducto(producto.Id);
    setEditando(true);
  };

  /* =========================
     ELIMINAR
  ========================= */

  const eliminarProducto = async (id) => {
    const confirmar = window.confirm("¿Eliminar producto?");

    if (!confirmar) return;

    try {
      await deleteProducto(id);

      alert("Producto eliminado ✅");

      obtenerProductos();
    } catch (error) {
      console.error(error);
    }
  };

  /* =========================
     LIMPIAR
  ========================= */

  const limpiarFormulario = () => {
    setFormulario({
      nombre: "",
      descripcion: "",
      precio: "",
      categoria: "",
      stock: "",
      imagen: "",
    });

    setIdProducto(null);
    setEditando(false);
  };

  return (
    <div
      className="container-fluid p-0"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fondoProductos})`,
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
          <h2 className="m-0">Productos</h2>

          <Link to="/admin" className="btn btn-light">
            ⬅ Volver
          </Link>
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
                  {editando ? "Editar Producto" : "Nuevo Producto"}
                </h4>

                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    className="form-control mb-3"
                    placeholder="Nombre"
                    name="nombre"
                    value={formulario.nombre}
                    onChange={handleChange}
                    required
                  />

                  <textarea
                    className="form-control mb-3"
                    placeholder="Descripción"
                    name="descripcion"
                    value={formulario.descripcion}
                    onChange={handleChange}
                    required
                  />

                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Precio"
                    name="precio"
                    value={formulario.precio}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    required
                  />

                  <select
                    className="form-control mb-3"
                    name="categoria"
                    value={formulario.categoria}
                    onChange={handleChange}
                  >
                    <option value="">Selecciona una categoría</option>
                    <option value="Suculentas">Suculentas</option>
                    <option value="Perennes">Perennes</option>
                    <option value="Cactus">Cactus</option>
                    <option value="Plantas de sombra">Plantas de sombra</option>
                  </select>

                  <input
                    type="number"
                    className="form-control mb-3"
                    placeholder="Stock"
                    name="stock"
                    value={formulario.stock}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    required
                  />

                  {/* IMAGEN */}

                  <div className="mb-3">
                    <label className="form-label text-dark">
                      Foto del producto
                    </label>

                    <div className="d-flex gap-2 mb-2">
                      <label className="btn btn-outline-light w-50 mb-0" style={{ cursor: "pointer" }}>
                        📁 Galería
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImagen}
                          style={{ display: "none" }}
                        />
                      </label>

                      <label className="btn btn-outline-light w-50 mb-0" style={{ cursor: "pointer" }}>
                        📷 Cámara
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          onChange={handleImagen}
                          style={{ display: "none" }}
                        />
                      </label>
                    </div>

                    <small className="text-white">Máximo 2 MB</small>
                  </div>

                  {/* PREVIEW */}

                  {formulario.imagen && (
                    <div className="text-center mb-3">
                      <img
                        src={formulario.imagen}
                        alt="Preview"
                        className="img-fluid rounded shadow"
                        style={{
                          height: "150px",
                          objectFit: "cover",
                        }}
                        onError={(e) => { e.target.style.display = "none"; }}
                      />
                    </div>
                  )}

                  <button className="btn btn-success w-100">
                    {editando ? "Actualizar" : "Crear"}
                  </button>
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
                <h4 className="mb-4 text-dark">Lista de Productos</h4>

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
                        <th>Nombre</th>
                        <th>Precio</th>
                        <th>Stock</th>
                        <th>Categoría</th>
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

                          <td>{producto.Categoria}</td>

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

                  {productos.length === 0 && (
                    <p className="text-white">No hay productos registrados</p>
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

export default Productos;
