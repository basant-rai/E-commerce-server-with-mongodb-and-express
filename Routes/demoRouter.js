const express = require('express');
const { demoFunction } = require('../Controller/demoController');
const router = express.Router();

router.get('/path',(req,res)=>{
    res.send('This is from route')
})
router.get('/control',demoFunction)

module.exports = router