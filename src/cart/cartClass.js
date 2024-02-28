import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import { productos } from '../product/productUse.js';

class Cart{
    constructor(){
        this.id = uuidv4()
        this.products = []
    }
}

const arrayProductos = await productos.getProducts()


export class Carts {

    
    constructor(){
        this.carts=[]
        this.dirName = "./src/data";
        this.path = `${this.dirName}/carrito.json`;

    }

    async #readFile() {
        if(!fs.existsSync(this.path)) return []
        const resultado = await (fs.promises.readFile(this.path, 'utf8'));
        if(!resultado)return []
        return JSON.parse(resultado)
    }

    async #createDir(){
        if(!fs.existsSync(this.dirName))
        await fs.promises.mkdir(this.dirName)
    }

    async createCart(){
        await this.#createDir()
        const cart = new Cart()
        const prev = await this.#readFile()
        this.carts = [cart, ...prev]
        console.log(this.carts);
        return await fs.promises.writeFile(this.path, JSON.stringify(this.carts))
    }

    async getCartById(id) {
        const carts = await this.#readFile()
        if (!carts.find(carrito => carrito.id === id)) 
        {
           console.error(`No se encontro carrito con el id: ${id}`)
           return;
        }
        return carts.find(carrito => carrito.id === id)
        
    }

    async addProductsToCart(cid,pid){
        const carts = await this.#readFile()
        const nuevoCarrito = [...carts]
        if(!carts.find(carrito => carrito.id === cid) ){
            console.error(`No se encontro carrito con el id: ${cid}`)
            return false
        }
        if(!arrayProductos.find(producto => producto.id === pid) ){
            console.error(`No se encontro producto con el id: ${pid}`)
            return false
        }
        const producto = arrayProductos.find(producto => producto.id === pid)
        const productPosition = carts.findIndex(cart => cart.id === cid)  
        const cart = carts.find(carrito => carrito.id === cid)
        const {products} = cart

        if(products.find(producto=> producto.product === pid)){
            const quantity = products.find(producto=> producto.product === pid)
            quantity.quantity = (!quantity.quantity)? 2 :quantity.quantity + 1
            const quantityPosition = cart.products.findIndex(producto => producto.product === pid)
            cart.products[quantityPosition] = quantity
            nuevoCarrito[productPosition] = cart
            await fs.promises.writeFile(this.path, JSON.stringify(nuevoCarrito))
            return true
        }
        cart.products.push({product:producto.id})
        nuevoCarrito[productPosition] = cart
        fs.promises.writeFile(this.path, JSON.stringify(nuevoCarrito))
        return true
        
    }

}

// const cartQuantity = cart.products.map(carQ =>{
//     if(carQ.product === pid){
//         return quantity
//     }else{
//         return carQ
//     }
// })
// console.log(cartQuantity);