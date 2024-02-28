import { Router } from "express";
import { productos } from "../product/productUse.js";


const router = Router()

const arrayProducts = await productos.getProducts()

const calculoLimit = (cantidad = null) => {
    if (cantidad === null) return null
    const nuevoproducto = []
    for (let i = 0; i <= cantidad - 1; i++) {
        const element = arrayProducts[i];

        nuevoproducto.push(element)
    }
    return nuevoproducto
}

// Listar usuarios
router.get('/', (req, res) => {
    let limit = req.query.limit
    if (limit) {
        let productLimit = calculoLimit(parseInt(limit))
        return res.send(productLimit)
    }
    return res.send(arrayProducts)

})

//Listar usuarios por su id
// router.get('/:pid', async(req, res) => {
//     let productId = req.params.pid;

//     let productSearch = await productos.getProductById(productId)

//     !productSearch ?res.send({error :'Usuario no encontrado'}):res.send({Producto: productSearch})

// })

// Crear un Producto nuevo
router.post('/', async (req, res) => {
    let product = req.body;
    if (!product.title || !product.description || !product.code || !product.price || !product.stock || !product.category) {
        return res.status(400).send({ status: "error", error: "incomplete values" })
    }
    const { title, description, code, price, stock, category, status } = product
    const nuevoProducto = await productos.addProduct(title, description, code, category, price, stock, status);

    if (!nuevoProducto) {
        return res.status(400).send({ status: "error", error: "Revisar el valor de entrada" })
    }

    return res.send({ status: "success", message: "producto agregado con exito!" })

})

// Actualizar un producto existente
router.put('/:pid', async (req, res) => {

    const pid = req.params.pid;
    const product = req.body;
    const resultado = await productos.updateProduct(pid, product)

    if (!resultado) {
        return res.status(404).send({ status: "info", error: "Usuario no encontrado" })
    }

    return res.send({ status: "success", message: "Usuario Actualizado." })

})

// Borrar un producto existente
router.delete('/:pid', async (req, res) => {
    const pid = req.params.pid
    const resultado = await productos.deleteProduct(pid)

    if (!resultado) {
        return res.status(404).send({ status: "info", error: "Usuario no encontrado" })
    }
    return res.send({ status: "success", message: "Usuario Eliminado exitosamente." })

})

router.get('/home', async (req, res) => {
    const products = await productos.getProducts()
    const user = {
        nombre: 'Urbano',
    }
    res.render('home', {
        usuario: user,
        style: 'index.css',
        products

    });
});

router.get('/realtimeproducts', async (req, res) => {

    res.render('realTimeProducts', {
        style: 'index.css',
    });
});



// router.post('/realtimeproducts', async (req, res) => {
//     try {
//         const newProducto = req.body
//         const { title, description, code, category, price, stock } = newProducto

//         await productos.addProduct(title, description, code, category, price, stock)
//         const products = await productos.getProducts()
//         console.log(products);
//         res.send(products)
//     }
//     catch (error) {
//         console.log(error);
//     }


//     // res.render('realTimeProducts');
// });


export default router;