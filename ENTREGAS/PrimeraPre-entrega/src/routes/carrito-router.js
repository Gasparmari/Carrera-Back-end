import { Router } from "express";
const router = Router();

import CarritoManager from "../manager/carrito.manager.js";
import { __dirname } from "../path.js";
const carritoManager = new CarritoManager(`${__dirname}/db/carts.json`);

router.post("/:idCart/productos/:idProd", async (req, res, next) => {
   try {
      const { idProd } = req.params;
      const { idCart } = req.params;
      const response = await carritoManager.saveProductToCarrito(idCart, idProd);
      res.json(response)
   } catch (error) {
    next(error)
   }
});

router.post("/", async (req, res, next) => {
  try {
    const response = await carritoManager.addCarrito();
    res.json(response);
  } catch (error) {
    next(error);
  }
});

router.get("/:idCarrito", async (req, res, next) => {
  try {
    const {idCart} = req.params
    res.json(await carritoManager.getCarritoById(idCart))
  } catch (error) {
    next(error);
  }
});

export default router;