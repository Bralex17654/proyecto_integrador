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
    imagen: null,
  });

  const [editando, setEditando] = useState(false);
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
    setFormulario({
      ...formulario,
      imagen: e.target.files[0],
    });
  };

  /* =========================
     CREAR / EDITAR
  ========================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("nombre", formulario.nombre);
      formData.append("descripcion", formulario.descripcion);
      formData.append("precio", formulario.precio);
      formData.append("categoria", formulario.categoria);
      formData.append("stock", formulario.stock);

      if (formulario.imagen) {
        formData.append("imagen", formulario.imagen);
      }

      if (editando) {
        await updateProducto(idProducto, formData);

        alert("Producto actualizado ✅");
        setEditando(false);
      } else {
        await createProducto(formData);

        alert("Producto creado ✅");
      }

      limpiarFormulario();
      obtenerProductos();
    } catch (error) {
      console.error(error);
      alert("Error al guardar producto");
    }
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
      imagen: null,
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
      imagen: null,
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
                    required
                  />

                  {/* IMAGEN */}

                  <div className="mb-3">
                    <label className="form-label text-dark">
                      Imagen del producto
                    </label>

                    <input
                      className="form-control"
                      type="file"
                      accept="image/*"
                      onChange={handleImagen}
                    />
                  </div>

                  {/* PREVIEW */}

                  {formulario.imagen && (
                    <div className="text-center mb-3">
                      <img
                        src={URL.createObjectURL(formulario.imagen)}
                        alt="Preview"
                        className="img-fluid rounded shadow"
                        style={{
                          height: "150px",
                          objectFit: "cover",
                        }}
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
