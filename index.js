const express = require('express')
require('dotenv').config()
const db = require('./Database/connection')

const app = express()
const port = process.env.PORT 
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const morgan = require('morgan');
const cors = require('cors')

const DemoRoute =require('./Routes/demoRouter');
const CategoryRoute = require('./Routes/categoryRoute');
const productRoute =require('./Routes/productRoute');
const userroute = require('./Routes/userRoute');
const orderroute = require('./Routes/orderRoute');
const paymentroute = require('./Routes/paymentRoute');

app.use(bodyParser.json())
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors())

app.use('/api',DemoRoute)
app.use('/api',CategoryRoute)
app.use('/api',productRoute)
app.use('/api',userroute)
app.use('/api',orderroute)
app.use('/api',paymentroute)

app.use('/public/uploads',express.static('public/uploads'))

app.get('/', (req,res) => {
    console.log("Welcome to Backend")
    res.send("Welcome for display")
})
app.get('/welcome',(req,res)=>{
    res.send("Express js")
})
app.listen(port, () => {
    console.log(`app started at port ${port}`)
})