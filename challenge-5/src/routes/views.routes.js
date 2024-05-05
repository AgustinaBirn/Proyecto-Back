import { Router } from "express";
import fs from "fs";

const router = Router();

const route = "./products.json";
const data = await fs.promises.readFile(route, "utf-8");
const dataJson = JSON.parse(data);

router.get("/welcome", async (req, res) => {
  const user = { name: "Agustina" };

  res.render("index", user);
});

router.get("/realtimeproducts", async (req, res) => {
  res.render("realTimeProducts", { data: dataJson });
});

router.get("/", async (req, res) => {
  res.render("home", { data: dataJson });
});

router.get("/chat", async (req, res) => {
  res.render("chat", {});
});

export default router;
