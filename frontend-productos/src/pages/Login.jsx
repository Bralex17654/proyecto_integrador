import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginRequest } from "../services/auth.service";
import { registerRequest } from "../services/register.service";
import logo from "../assets/Logo.png";
import fondo from "../assets/fondo_8.png";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [nombre, setNombre] = useState("");
  const [registrando, setRegistrando] = useState(false);

  /* LOGIN */

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const data = await loginRequest({
        correo,
        password,
      });

      login(data);

      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.mensaje || "Credenciales incorrectas");
    }
  };

  /* REGISTER */

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const data = await registerRequest({
        nombre,
        correo,
        password,
      });

      login(data);

      setNombre("");
      setCorreo("");
      setPassword("");

      navigate("/admin");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.mensaje || "Error al registrar");
    }
  };

  return (
    <div
      className="container-fluid d-flex justify-content-center align-items-center position-relative px-3 py-4"
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${fondo})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay oscuro */}

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "rgba(0,0,0,0.45)",
        }}
      />

      {/* CONTENIDO */}

      <div
        className="text-center position-relative w-100"
        style={{
          zIndex: 2,
          maxWidth: "420px",
        }}
      >
        {/* LOGO */}

        <img
          src={logo}
          alt="Logo"
          style={{
            width: "100px",
            height: "100px",
            objectFit: "cover",
            borderRadius: "50%",
            marginBottom: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,.4)",
            border: "3px solid white",
          }}
        />

        {/* CARD */}

        <div
          className="card shadow p-3 p-sm-4 border-0 w-100 mx-auto"
          style={{
            maxWidth: "420px",
            borderRadius: "25px",
            background: "rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "white",
          }}
        >
          <h2 className="text-center mb-3 fw-bold" style={{ fontSize: "1.5rem" }}>
            {registrando ? "Registro 🌱" : "Bienvenido 🌿"}
          </h2>

          <p className="mb-4 text-light" style={{ fontSize: "0.9rem" }}>
            {registrando
              ? "Crea tu cuenta para comenzar"
              : "Ingresa a tu sistema de inventario"}
          </p>

          {registrando ? (
            <form onSubmit={handleRegister}>
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />

              <input
                type="email"
                className="form-control mb-3"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="btn btn-success w-100 rounded-pill">
                Registrarse
              </button>
            </form>
          ) : (
            <form onSubmit={handleLogin}>
              <input
                type="email"
                className="form-control mb-3"
                placeholder="Correo"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />

              <input
                type="password"
                className="form-control mb-3"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button className="btn btn-success w-100 rounded-pill">
                Iniciar sesión
              </button>
            </form>
          )}

          {/* TOGGLE */}

          <button
            className="btn btn-link mt-3 text-white text-decoration-none"
            onClick={() => setRegistrando(!registrando)}
          >
            {registrando
              ? "¿Ya tienes cuenta? Inicia sesión"
              : "¿No tienes cuenta? Regístrate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
