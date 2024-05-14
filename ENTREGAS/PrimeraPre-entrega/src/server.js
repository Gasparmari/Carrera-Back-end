import express from "express"
import ProductManager from "./manager/products.manager.js"

const productManager = new ProductManager("./products.json")

const app = express();
app.use(express.json());

app.get("/products", async (req, res) => {
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

app.get("/products/:idProduct", async (req, res) => {
    try {
        const { idProduct } = req.params;
        const product = await productManager.getProductById(idProduct);
        if (!product) res.status(404).json({ msg: "Prodcut not found" });
        else res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
});


const PORT = 8080
app.listen(PORT, () => console.log(`Server ok on port ${PORT}`));