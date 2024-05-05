import express from "express";
import config from "./config.js";
import productRoutes from "./routes/products.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import viewsRoutes from "./routes/views.routes.js";
import handlebars from "express-handlebars";
import { Server } from "socket.io";

const app = express();
const messages = [];

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());

app.set("views", `${config.DIRNAME}/views`);

app.set("view engine", "handlebars");

app.use("/", viewsRoutes);

app.use("/api/products", productRoutes);

app.use("/api/carts", cartRoutes);

app.use("/static", express.static(`${config.DIRNAME}/public`));

const httpServer = app.listen(config.PORT, () => {
  console.log(`Servidor activo en puerto ${config.PORT}`);
});

const socketServer = new Server(httpServer);
app.set("socketServer", socketServer);
// console.log(socketServer);

socketServer.on("connection", (socket) => {
  socket.emit("chatLog", messages);
  console.log(
    `Cliente conectado, id ${socket.id} desde ${socket.handshake.address}`
  );
  socket.on("newMessage", (data) => {
    messages.push(data);
    console.log(
      `Mensaje recibido desde ${socket.id}: ${data.user}, ${data.message}`
    );
    socketServer.emit("messageArrived", data);
  });
});
