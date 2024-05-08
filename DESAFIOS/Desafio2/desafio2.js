const fs = require('fs');


class ProductManager {
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
    
    async updateProduct(productId, updatedFields) {
        try {
            let products = await this.getProducts();
            const index = products.findIndex(product => product.id === productId);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields };
                await fs.promises.writeFile(this.path, JSON.stringify(products));
                console.log('Producto actualizado correctamente.');
            } else {
                console.log('No se encontró ningún producto con el ID proporcionado.');
            }
        } catch (error) {
            console.log('Error al actualizar el producto')
        }
    }

    async deleteProduct(productId) {
        try {
            let products = await this.getProducts();
            const index = products.findIndex(product => product.id === productId);
            if (index !== -1) {
                products.splice(index, 1);
                await fs.promises.writeFile(this.path, JSON.stringify(products));
                console.log('Producto eliminado correctamente.');
            } else {
                console.log('No se encontró ningún producto con el ID proporcionado.');
            }
        } catch (error) {
            console.log('Error al eliminar el producto:', error);
        }
    }
}

async function test() {
    const productManager = new ProductManager("productos.json");

    await productManager.addProduct('Leche', 'Leche entera', 200, 'lala.jpg', 123456, 10);
    await productManager.addProduct('Arroz', 'Arroz blanco', 500, 'arroz.jpg', 789012, 15);
    await productManager.addProduct('Fideos', 'Fideos tirabuzones', 900, 'fideos.jpg', 345678, 8);

    console.log(await productManager.getProducts());

    const productId = 2; 
    console.log(await productManager.getProductById(productId));

    const productIdToUpdate = 1; 
    const updatedFields = {
        price: 220, 
        stock: 12 
    };
    await productManager.updateProduct(productIdToUpdate, updatedFields);

    const productIdToDelete = 3; 
    await productManager.deleteProduct(productIdToDelete);

    console.log(await productManager.getProducts());
}

test();