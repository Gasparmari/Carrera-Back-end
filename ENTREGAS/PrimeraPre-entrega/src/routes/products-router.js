import { Router } from "express"
const router = Router()

import { __dirname } from "../path.js";

import ProductManager from "./manager/products.manager.js"
const productManager = new ProductManager(`${__dirname}/db/products.json`)

import { productValidator } from "../middlewares/product.validator.js";



router.get("/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        
        let limit = parseInt(req.query.limit); 
        if (limit > 0) {
            res.status(200).json(products.slice(0, limit));
        } else {
            res.status(200).json(products);
        }
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.get("/products/:idProduct", async (req, res) => {
    try {
        const { idProduct } = req.params;
        const product = await productManager.getProductById(idProduct);
        if (!product) res.status(404).json({ msg: "Prodcut not found" });
        else res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});

router.post("/", productValidator, async (req, res) => {
    try {
      console.log(req.body);
      const product = req.body;
      const newProduct = await productManager.addProduct(product);
      res.json(newProduct);
    } catch (error) {
      next(error);
    }
  });
  
  router.put("/:idProd", async (req, res) => {
    try {
      const { idProd } = req.params;
      const prodUpd = await productManager.updateProduct(req.body, idProd);
      if (!prodUpd) res.status(404).json({ msg: "Error updating prod" });
      res.status(200).json(prodUpd);
    } catch (error) {
      next(error);
    }
  });
  
  router.delete("/:idProd", async (req, res) => {
    try {
      const { idProd } = req.params;
      const delProd = await productManager.deleteProduct(idProd);
      if (!delProd) res.status(404).json({ msg: "Error delete product" });
      else
        res
          .status(200)
          .json({ msg: `product id: ${idProd} deleted successfully` });
    } catch (error) {
      next(error);
    }
  });
  
  router.delete("/", async (req, res) => {
    try {
      await productManager.deleteFile();
      res.send("products deleted successfully");
    } catch (error) {
      next(error);
    }
  });
  

  router.delete("/", async (req, res) => {
    try {
      await productManager.deleteFile();
      res.send("products deleted successfully");
    } catch (error) {
      next(error);
    }
  });
  
  export default router;