import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';


class Product {
    constructor(id, title, description, code, category, price, stock, status = true, thumbnails=[]) {
        price = parseInt(price),
        stock = parseInt(stock)
        if (!title || !description || !code || !price || !stock || !category){
            console.log('Todos los campos deben estar llenos')
            return
        }
        if (
            typeof title !== 'string' ||
            typeof description !== 'string' ||
            typeof code !== 'string' ||
            typeof price !== 'number' ||
            typeof stock !== 'number' ||
            typeof category !== 'string' ||
            typeof status !== 'boolean' ||
            typeof thumbnails !== "object"
        ) {
            console.error('Los campos deben tener un tipo de valor especfico')
            return
        }
        this.id = !id ?uuidv4():id
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        this.thumbnails = thumbnails;
    }
}

export class ProductManager {

    constructor() {
        this.products = [];
        this.dirName = "./src/data"
        this.path = `${this.dirName}/productos.json`;
    }

    async #readFile() {
        if(!fs.existsSync(this.path)) return []
        const resultado = await (fs.promises.readFile(this.path, 'utf8'));
        if(!resultado)return []
        return JSON.parse(resultado)
    }

    async createDir(){
        if(!fs.existsSync(this.dirName))
        await fs.promises.mkdir(this.dirName)
    }


    async addProduct(title, description, code, category, price, stock, status ,thumbnails) {
        
        await this.createDir()
        const producto = new Product(title, description, code, category, price, stock, status , thumbnails)
        const key = Object.keys(producto)
        if(key.length === 0){
            return false
        }
        const prev = await this.#readFile()
        this.products = [ ...prev,{...producto}]
            
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2))
        return true
    }

    async getProducts() {
        const productos = await this.#readFile()
        return productos
    }

    async getProductById(id) {
        const productos = await this.#readFile()
        if (!productos.find(producto => producto.id === id)) 
        {
           console.error(`No se encontro producto con el id: ${id}`)
           return;
        }
        return productos.find(producto => producto.id === id)

    }

    async deleteProduct(id) {
        let productos = await this.#readFile()
        if (!productos.find(producto => producto.id === id)) {
            console.error(`No se encontro producto con el id: ${id}`)
            return false
        }

        productos = productos.filter(producto => producto.id !== id)

        await fs.promises.writeFile(this.path, JSON.stringify(productos, null, 2))
        console.log(`Producto con el id: ${id}, fue eliminado`);
        return true
    }

    async updateProduct( id, product ) {
        if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {    
            console.error('Debe contener los campos requeridos');
            return false
        }
        let prevProduct = await this.#readFile()
        const userPosition = prevProduct.findIndex(product => product.id === id)
        if(userPosition < 0){
            console.error('Usuario no encontrado')
            return false
        }
        product.id = id
        prevProduct [userPosition] = product
        await fs.promises.writeFile(this.path, JSON.stringify(prevProduct, null, 2))

        console.log(`El producto con id: ${id} fue actualizado`);
        return true
    }

}




