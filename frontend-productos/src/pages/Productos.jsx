import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getProductos,
  createProducto,
  updateProducto,
  deleteProducto,
} from "../services/productos.service";
import { getProveedores } from "../services/proveedores.service";
import fondoProductos from "../assets/fondo_8.png";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [proveedores, setProveedores] = useState([]);

  const [formulario, setFormulario] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    categoria: "",
    stock: "",
    imagen: "",
    proveedor_id: "",
  });

  const [editando, setEditando] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [idProducto, setIdProducto] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  /* =========================
     OBTENER PRODUCTOS
  ========================= */

  useEffect(() => {
    obtenerProductos();
    obtenerProveedores();
  }, []);

  const obtenerProductos = async () => {
    try {
      const data = await getProductos();
      setProductos(data);
    } catch (error) {
      console.error(error);
    }
  };

  const obtenerProveedores = async () => {
    try {
      const data = await getProveedores();
      setProveedores(data);
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

    if (file.size > 10 * 1024 * 1024) {
      alert("La imagen no puede superar 10 MB");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      // Comprimir la imagen antes de guardar
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX = 600;
        let w = img.width;
        let h = img.height;
        if (w > h && w > MAX) { h = (h * MAX) / w; w = MAX; }
        else if (h > MAX) { w = (w * MAX) / h; h = MAX; }
        canvas.width = w;
        canvas.height = h;
        canvas.getContext("2d").drawImage(img, 0, 0, w, h);
        const comprimida = canvas.toDataURL("image/jpeg", 0.75);
        setFormulario((prev) => ({ ...prev, imagen: comprimida }));
      };
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
        proveedor_id: formulario.proveedor_id || null,
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
      proveedor_id: producto.ProveedorId || "",
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
      proveedor_id: "",
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

                  {/* PROVEEDOR */}

                  <select
                    className="form-control mb-3"
                    name="proveedor_id"
                    value={formulario.proveedor_id}
                    onChange={handleChange}
                  >
                    <option value="">Sin proveedor asignado</option>
                    {proveedores.map((p) => (
                      <option key={p.Id} value={p.Id}>
                        {p.Nombre} {p.Empresa ? `(${p.Empresa})` : ""}
                      </option>
                    ))}
                  </select>

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

                    <small className="text-white">Máximo 10 MB</small>
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
                <h4 className="mb-3 text-dark">Lista de Productos</h4>

                <input
                  type="text"
                  className="form-control mb-3"
                  placeholder="🔍 Buscar producto..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                />

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
                        <th className="d-none d-md-table-cell">Proveedor</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>

                    <tbody>
                      {productos
                        .filter((p) =>
                          p.Nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                          p.Categoria?.toLowerCase().includes(busqueda.toLowerCase())
                        )
                        .map((producto) => (
                        <tr key={producto.Id}>
                          <td>{producto.Id}</td>

                          <td>{producto.Nombre}</td>

                          <td>${producto.Precio}</td>

                          <td>{producto.Stock}</td>

                          <td>{producto.Categoria}</td>

                          <td className="d-none d-md-table-cell">{producto.Proveedor || "—"}</td>

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
