const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app =express();
const PORT = 8001;

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/product-inventorydb')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error(err));

//model of the products
const Product =mongoose.model('Product', {
    pro_code:{
        type:String,
        unique : true,
        required : true
    },
    pro_name:{type: String , required : true},
    pro_category:{type:String , required : true},
    price:{type : Number , required : true}
},
    connection='productcollection'
);

//create products
app.post('/api/productcollection', async (req, res)=>{
    try {
        console.log(req.body); // 🔴 IMPORTANT FOR DEBUGGING
        const product = new Product(req.body);
        await product.save();
        res.status(201).json(product);
    }catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//get products
app.get('/api/productcollection', async (req, res)=> {
    const products = await Product.find();
    res.json(products);
});

//get products by id
app.get('/api/productcollection/:id', async (req, res)=> {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.json([]);
        res.json([product]);
    }catch {
        res.json([]);
    }
});

//update product
app.put('/api/productcollection/:id', async (req, res)=> {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {new :true});
        res.json(product);   
    }catch {
        res.status(400).json({message:'Invalid Id'});
    }
});

//delete
app.delete('/api/productcollection/:id', async(req, res)=> {
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        res.json({message:'Product deleted successfully'});
    }catch {
        res.status(400).json("Invalid Id")
    }
});

app.listen(PORT, ()=> {
    console.log(`Server is running on http://localhost: ${PORT}`);
});

