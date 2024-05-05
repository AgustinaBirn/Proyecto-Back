import { Router } from "express";
import { ProductManager } from "../../product-manager/product-manager.js";
import { uploader } from "../uploader.js";

const middlewer = (req, res, next) => {
  console.log("Se procesa middlware");
  next();
};
const router = Router();

const manager = new ProductManager("../../product-manager/product-manager.js");

router.get("/", middlewer, async (req, res) => {
  const limit = +req.query.limit || 0;
  const products = await manager.getProducts(limit);
  res.status(200).send({ status: "1", payload: products });
});

router.get("/:pid", async (req, res) => {
  const pid = +req.params.pid;
  const productId = await manager.getProductById(pid);
  //   const productId = await manager.getProductById(+req.params.pid);
  res.status(200).send({ status: "1", payload: productId });
});

router.post("/", uploader.single("thumbnail"), async (req, res) => {
  const body = req.body;
  const socketServer = req.app.get("socketServer");
  const thumbnail = req.file.originalname;
  body.thumbnail = thumbnail;

  const newProduct = await manager.addProduct(body)
  console.log( thumbnail);
  res.status(200).send({
    status: "1",
    payload: body,
  });
  socketServer.emit("newProduct", body);
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const nid = +id;
  const { title, description, price, thumbnail, code, stock } = req.body;

  if (nid <= 0 || isNaN(nid)) {
    res.status(400).send({
      status: "ERROR",
      payload: {},
      error: "El id debe ser mayor a 0",
    });
  }
  // else if (!title || !price || !stock) {
  //   res.status(400).send({
  //     status: "ERROR",
  //     payload: {},
  //     error: "Debe completar los 3 campos: title, price, stock",
  //   });
  // }
  else {
    res.status(200).send({
      status: "1",
      payload: { title, description, price, thumbnail, code, stock },
    });
    manager.getProducts();
    manager.updateProduct(nid, req.body);
  }
});

router.delete("/:id",async (req, res) => {
  const { id } = req.params;
  const nid = +id;
  const socketServer = req.app.get("socketServer");

  if (nid <= 0 || isNaN(nid)) {
    res.status(400).send({
      origin: "server1",
      payload: {},
      error: "El id debe ser mayor a 0",
    });
  } else {
    res
      .status(200)
      .send({ origin: "server1", payload: `Desea elimininar el id: ${id}` });
    // await manager.deleteProduct(nid);
    const productDeleted =  await manager.deleteProduct(nid);;
    const getProducts = await manager.getProducts()
    socketServer.emit("productDeleted", getProducts);
  }
});

export default router;
