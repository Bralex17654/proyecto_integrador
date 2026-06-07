const Navbar = () => {
  const usuario = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="bg-white shadow-sm p-3 mb-4 d-flex justify-content-between align-items-center">
      <h4>Sistema POS 🌱</h4>

      <div>
        <span className="me-3">👤 {usuario?.correo}</span>
      </div>
    </div>
  );
};

export default Navbar;
