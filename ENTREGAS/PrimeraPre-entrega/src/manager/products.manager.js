import fs from "fs";
import { v4 as uuidv4 } from "uuid";


export default class ProductManager {
    constructor(path){
        this.path= path;    
        
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.path)) {
                const products = await fs.promises.readFile(this.path, "utf8");
                return JSON.parse(products);
            } else return [];
        } catch (error) {
            console.log(error);
        }
    }
    
    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            const products = await this.getProducts();
            const newProduct = {
                id: await this.getMaxId(products),
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            };
            const productExist = products.find((p) => p.title === newProduct.title);
            if (productExist) return "User already exists";
            products.push(newProduct);
            await fs.promises.writeFile(this.path, JSON.stringify(products));
            console.log('Producto agregado correctamente.');
        } catch (error) {
            console.log(error);
        }
    }
    
    async getMaxId(products) {
        try {
            if (products.length === 0) {
                return 1;
            }
            const maxId = Math.max(...products.map(product => product.id));
            return maxId + 1;
        } catch (error) {
            console.log(error);
        }
    }


    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.id === id);
            if (product) {
                return product;
            } else {
                console.log('Producto no encontrado.');
            }
        } catch (error) {
            console.log('Error al obtener el producto por ID')
        }
    }
    
    async updateProducts(obj, id) {
        try {
            const products = await this.getProducts();
            let productExist = await this.getProductById(id);
            if (!productExist) return null;
            productExist = { ...productExist, ...obj };
            const newArray = products.filter((p) => p.id !== id);
            newArray.push(productExist)
            await fs.promises.writeFile(this.path, JSON.stringify(newArray));
            return productExist;
        } catch (error) {
            console.log(error);
        }
    }

    async deleteProduct(id) {
        const products = await this.getProducts();
        if (products.length > 0) {
        const productExist = await this.getProductById(id);
        if (productExist) {
            const newArray = products.filter((u) => u.id !== id);
            await fs.promises.writeFile(this.path, JSON.stringify(newArray));
            return productExist
            } 
        } else return null
    }
}