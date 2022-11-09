const mongoose = require('mongoose')


mongoose.connect (process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true
},()=>{
    console.log('Database connected')
})