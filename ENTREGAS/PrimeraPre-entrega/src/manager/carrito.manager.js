import { __dirname } from "../path.js";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

import ProductManager from "./product.manager.js";
const productManager = new ProductManager(`${__dirname}/db/products.json`);

export default class CarritoManager {
    constructor(path) {
        this.path = path;

    }

    async getCarrito() {
        try {
            if (fs.existsSync(this.path)) {
                const carrito = await fs.promises.readFile(this.path, "utf8");
                return JSON.parse(carrito);
            } else return [];
        } catch (error) {
             console.log(error);
        }
    }

    async addCarrito(){
        try {
            const newCarrito = {
                id: uuidv4(),
                products: []
            };
            const carritoFile = await this.getCarrito();
            carritoFile.push(newCarrito)
            await fs.promises.writeFile(this.path, JSON.stringify(carritoFile));
            return newCarrito;
          } catch (error) {
        }
    }

    async getCarritoById(id) {
        try {
            const carritos = await this.getCarrito();
            const carrito = carritos.find(carrito => carrito.id === id);
            if (carrito) {
                return carrito;
            } else {
                console.log('carrito no encontrado.');
            }
        } catch (error) {
            console.log('Error al obtener el carrito por ID')
        }
    }

    async saveProductToCarrito(idCart, idProduct) {
        try {
          const prodExist = await productManager.getProductById(idProduct); 
          if(!prodExist) throw new Error('product not exist');
          const cartExist = await this.getCarritoById(idCart); 
          if(!cartExist) throw new Error('cart not exist');
          let cartsFile = await this.getCarrito();
          const existProdInCart = cartExist.products.find((prod) => prod.id === idProduct); 
          if(!existProdInCart) {

            const product = {
              id: idProduct,
              quantity: 1
            };
            cartExist.products.push(product);
          } else existProdInCart.quantity++;
          const updatedCarts = cartsFile.map((cart) => {
            if(cart.id === idCart) return cartExist
            return cart
          })
          await fs.promises.writeFile(this.path, JSON.stringify(updatedCarts));
          return cartExist 
        } catch (error) {
          throw new Error(error)
        }
      }
}