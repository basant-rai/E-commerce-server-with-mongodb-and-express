const Order_model = require("../models/orderModel");
const OrderItem_model = require("../models/orderItemModel");

//place order
exports.placeOrder = async (req, res) => {
    let orderItemsIds = await Promise.all(
        req.body.Order_items.map(async orderItem => {
            let new_orderItem = new OrderItem_model({
                product: orderItem.product,
                quantity: orderItem.quantity
            })
            new_orderItem = await new_orderItem.save()
            if (!new_orderItem) {
                return res.status(400).json({ error: "Error 400" })
            }
            return new_orderItem._id
        })
    )

    //calculate total_price
    let individul_order_total = await Promise.all(
        orderItemsIds.map(async orderItem => {
            let order = await OrderItem_model.findById(orderItem).populate('product', 'product_price');
            let individual_total = order.quantity * order.product.product_price
            return individual_total
        })
    )
    // calculate total price
    let total_price = individul_order_total.reduce((acc, cur) => {
        return acc + cur
    })

    //order total
    let order = new Order_model({
        orderItems: orderItemsIds,
        user: req.body.user,
        total_price: total_price,
        shipping_address: req.body.shipping_address,
        alternate_shipping_adddress: req.body.alternate_shipping_adddress,
        country: req.body.country,
        city: req.body.city,
        zip: req.body.zip,
        contact: req.body.contact
    })
    order = await order.save()
    if (!order) {
        res.status(400).json({ error: "Error" })
    }
    res.send(order)
}

exports.orderList = async (req, res) => {
    let orders = await Order_model.find()
    if (!orders) {
        return res.status(400).json({ error: "something went wrong" })
    }
    res.send(orders)
}

exports.orderDetails = async (req, res) => {
    let order_details = await Order_model.findById(req.params.id).populate({ path: 'orderItems', populate: { path: 'product',populate:{path:'product_category'} } })
    if (!order_details) {
        return res.send(400).json({ error: "not found" })
    }
    res.send(order_details)
}

exports.updateOrder = async (req,res)=>{
    let order_update = await Order_model.findByIdAndUpdate(req.params.id,{
        status:req.body.status
    },{new:true});
    if(!order_update){    

        return res.send(400).json({ error: "order not updated" })
    }
    res.send(order_update)

}

exports.userOrder = async(req,res)=>{
    let order = await Order_model.find({user:req.params.user_id}).populate({ path: 'orderItems', populate: { path: 'product',populate:{path:'product_category'} } })
    if(!order_update){    

        return res.send(400).json({ error: "ERROR" })
    }
    res.send(order)

}

exports.orderDelete = async(req,res)=>{
    let order = await Order_model .findByIdAndDelete(req.params.id);
     if(!order){
        return res.status(400).json({ error: "order not found" })
     }
     else{
        order.orderItems.map((orderItemId)=>{
            OrderItem_model.findByIdAndRemove(orderItemId)
            .then(orderItem=>{
                if(!orderItem){
                    return res.status(400).json({ error: "failed to delete item" })

                }
            })
        })
        return res.status(200).json({ error: "Deleted successfully" })

     }
}


