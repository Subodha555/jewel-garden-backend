const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');
const { GridFsStorage } = require('multer-gridfs-storage');
const { GridFSBucket } = require('mongodb');
const Grid = require('gridfs-stream');
const crypto = require('crypto');
const Product = require('../models/sample-product');

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/');
//     },
//     filename: function (req, file, cb) {
//         cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//     }
// });

const conn = mongoose.connection;

const storage = new GridFsStorage({
    url: process.env.DB_URL,
    file: (req, file) => {
        console.error("file", file);
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                try {
                    debugger;
                    console.log("saving", buf);
                    if (err) {
                        console.log("error", err);
                        return reject(err);
                    }

                    const filename = buf.toString('hex') + path.extname(file.originalname);
                    console.log("filename", filename);
                    const fileInfo = {
                        filename: filename,
                        bucketName: 'uploads' // Collection name in MongoDB
                    };
                    resolve(fileInfo);
                } catch (e) {
                    console.error("error in saving", e);
                }
            });
        });
    }
});


const upload = multer({ storage: storage });

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

router.put('/', upload.single('image'), async (req, res) => {
    const file = req.file;
    let imagePath = '';
 console.log("file", file);
    if (file) {
        imagePath = `uploads/${file.filename}`;
    }

    console.log('Uploaded file:', file);

    if (!file) {
        return res.status(500).send('File upload failed');
    }

    const productData = {
        name: req.body.name,
        description: req.body.description,
        richDescription: req.body.richDescription,
        image: file.id, // Store the file id in the image field
        brand: req.body.brand,
        price: req.body.price,
        priceLast: req.body.priceLast,
        currency: req.body.currency,
        category: req.body.category,
        countInStock: req.body.countInStock,
        rating: req.body.rating,
        numReviews: req.body.numReviews,
        isFeatured: req.body.isFeatured
    };

    try {
        let product = new Product(productData);
        product = await product.save();
        res.send(product);
    } catch (err) {
        return res.status(500).send('Product cannot be created');
    }
});

conn.once('open', () => {
    console.log('MongoDB connection established successfully');
});


// Add a route to serve images
router.get('/image/:id', async (req, res) => {
    try {
        console.log("get image by id", req.params.id);
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const bucket = new GridFSBucket(conn.db, {
            bucketName: 'uploads'
        });
    // console.log("res", res);
        // bucket.openDownloadStream(fileId).pipe(res).on('error', function (error) {
        //     console.log("image not found", error);
        //     res.status(404).send({ error: 'Image not found' });
        // }).on('finish', function () {
        //     console.log('done!');
        // });
        const downloadStream = bucket.openDownloadStream(fileId);
        console.log("downloadStream", fileId);

        downloadStream.on('error', (error) => {
            console.error('Error during download stream:', error);
            res.status(404).send({ error: 'Image not found' });
        });

        downloadStream.pipe(res).on('finish', () => {
            console.log('Image fetch completed');
        });
    } catch (error) {
        console.error('Error fetching image:', error);
        res.status(500).send({ error: 'Failed to fetch image' });
    }
});

// Need to delete the image as well
router.delete('/:id', (req, res) => {
    Product.findByIdAndRemove(req.params.id).then(product => {
        if (product) {
            return res.status(200).json({ success: true, message: 'Product deleted successfully' })
        } else {
            return res.status(404).json({ success: false, message: 'Product cannot find' })
        }
    }).catch(err => {
        return res.status(400).json({ success: false, error: err })
    })
})


module.exports = router;