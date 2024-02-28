import { Router } from "express";
import { carts } from "../cart/cartUse.js";

const router = Router()


router.get("/:cid",  async (req, res) => {
    const cartId = req.params.cid;
    const cartSearch = await carts.getCartById(cartId)
    
    !cartSearch ? res.send({ error: 'Usuario no encontrado' }) : res.send({ cart: cartSearch })
  
  })
  
  router.post("/", (req, res) => {
    try {
      carts.createCart()
      return res.send({ status: "success", message: "carrito creado con exito!" })
    } catch (error) {
      console.error(error);
    }
  })
  
  router.post("/:cid/product/:pid", async (req, res) =>{
    const cid = req.params.cid
    const pid = req.params.pid
  
      const producto = await carts.addProductsToCart(cid, pid)
      
      if(!producto){
        return res.status(400).send({status:"error", error:"Revisar el valor de entrada"})
      }
      return res.send({ status: "success", message: "Producto agregado con exito!" })
  
  
  })

  export default router;