import express from 'express'
import productsRoutes from './routes/products.routes.js'
import cartRoutes from'./routes/carts.routes.js'
import __dirname from '../utils.js'
import { engine } from 'express-handlebars'
import { Server } from 'socket.io'
import { productos } from './product/productUse.js'


const app = express()
const port = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get("/ping", (req, res) => {
  console.log(__dirname);
  res.send({ status: "ok" })
})


app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/src/views`);

app.use(express.static(`${__dirname}/src/public`));


// Punto de entrada Productos
app.use("/api/products", productsRoutes)
app.use("/api/carts", cartRoutes)

const httpServer = app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

const socketServer = new Server(httpServer)

socketServer.on('connection', async socket=>{
  const getProductos = await productos.getProducts()
  socket.emit('products', getProductos)
  socket.on('form', async data=>{
    const { title, description, code, category, price, stock, id } = data
    await productos.addProduct(id, title, description, code, category, price, stock)
    const nuevosProductos = await productos.getProducts()
    
    socket.emit('form-add', nuevosProductos)
  })
  socket.on('delete', async data=>{
    await productos.deleteProduct(data)
    const nuevosProductos = await productos.getProducts()
    console.log(nuevosProductos);
    socket.emit('delete-product', nuevosProductos)
  })
})
















