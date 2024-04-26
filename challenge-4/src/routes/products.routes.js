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
  console.log(req.file);

  const {
    title = "",
    description = "",
    code = "",
    price = "",
    status = true,
    stock = "",
    category = "",
    thumbnail = "",
  } = req.body;

  body.thumbnail = req.file.originalname;
  if (title && description && code && price && status && stock && category) {
    res.status(200).send({
      status: "1",
      payload: body,
    });
    const newProduct = await manager.addProduct(body);
  } else {
    res.status(400).send({
      status: "ERROR",
      payload: {},
      error:
        "Debe completar los campos de titulo, descripcion, codigo, precio, status y category",
    });
  }
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

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const nid = +id;

  if (nid <= 0 || isNaN(nid)) {
    res.status(400).send({
      origin: "server1",
      payload: {},
      error: "El id debe ser mayor a 0",
    });
  } else {
    res
      .status(200)
      .send({ origin: "server1", payload: `Desea eliminina el id: ${id}` });
    manager.deleteProduct(nid);
  }
});

export default router;
