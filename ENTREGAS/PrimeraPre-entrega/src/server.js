import express from 'express';
import cartRouter from './routes/carrito-router.js'
import productsRouter from './routes/products-router.js';
import morgan from 'morgan';
import { __dirname } from './path.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express()

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))

app.use('/api/carritos', cartRouter);
app.use('/api/productos', productsRouter);

app.use(errorHandler);

const PORT = 8080


app.listen(PORT,()=>{
    console.log(`Escuchando en el puerto ${PORT}`)
})