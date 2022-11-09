const express = require("express");
const { placeOrder, orderList, orderDetails, updateOrder, orderDelete } = require("../Controller/orderController");
const router = express.Router();

router.post('/postorder',placeOrder)
router.get('/orders',orderList);
router.get('/orderdetails/:id',orderDetails);
router.put('/orderupdate/:id',updateOrder);
router.delete('/orderdelete/:id',orderDelete)


module.exports = router
