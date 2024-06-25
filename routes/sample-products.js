const express = require('express');
const router = express.Router();
// const mongoose = require('mongoose');
const Product = require('../models/sample-product');

router.get('/:id', async (req, res) => {
    console.log("get id", 'request came', req.params.id);
    // const product = await Product.findById(req.params.id).populate('category');
    //
    // if (!product) {
    //     res.status(500).json({ success: false, message: 'The product with the given ID not exists' })
    // }
    res.status(200).send(`success ${req.params.id}`)
});

router.get('/', async (req, res) => {
    const productList  = await Product.find();
    console.log("product list", productList);
    res.send(productList);
});

router.put('/', async (req, res) => {
    let product = new Product({
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: '',
        brand: req.body.brand,
        price: req.body.price,
        priceLast: req.body.priceLast,
        currency: req.body.currency,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    })

    product = await product.save();

    if (!product)
        return res.status(500).send('Product cannot be created')

    res.send(product);
});


module.exports = router;