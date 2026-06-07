export const generarTicket = (venta) => {
  let ticket = "";

  ticket += "===============================\n";
  ticket += "        VIVERO POS 🌱\n";
  ticket += "===============================\n\n";

  ticket += `Cliente: ${venta.cliente}\n`;
  ticket += `Fecha: ${new Date().toLocaleString()}\n\n`;

  ticket += "--------------------------------\n";

  venta.productos.forEach((producto) => {
    ticket += `${producto.nombre}\n`;

    ticket += `x${producto.cantidad}  $${producto.precio}\n`;

    ticket += "--------------------------------\n";
  });

  ticket += `\nTOTAL: $${venta.total}\n\n`;

  ticket += "Gracias por su compra 🌿\n";

  ticket += "===============================\n";

  return ticket;
};
