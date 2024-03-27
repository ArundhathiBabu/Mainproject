const express=require('express')
   const router= express.Router();
   const Products= require("../Model/Product");
   const upload=require('../Middleware/multer');
   const path=require('path');


   //add product
   router.post("/Addproduct",upload.single('image'), async (req,res)=>{
    try {
    const  {name,category,price,description,stock} = req.body;
    const image=req.file.filename;

    const products = new Products({
        name,category,image,price,description,stock})
        await products.save()
        res.status(200).json({messege:"product added succesfully"})
        } catch (error) {
            console.log(error);
            res.status(500).json({message:"error adding products"}); 
        }  
});


//get all product
router.get('/allproducts', async (req, res) => {
    try {
        const product = await Products.find();
        
        if(product.length === 0){
            return res.status(404).json({ message: "No product found!" });
        }
        
        return res.status(200).json(product);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



//get product by id
router.get("/singleproduct/:id", async (req, res) => {
    const  productId = req.params.id
    // Finding all products in the database
    const product = await Products.findById({_id : productId});
  
    // Checking if any products were found
    if (!product) {
      // Sending a 404 response if no products were found
      return res.status(404).json({ message: "No Product Found!" });
    }
  
    // Sending a success response with the found products
    return res.status(200).json(product);
  });


  
 //delete a product by id
 router.delete('/deleteproduct/:id', async (req ,res)=> {
     const prodId = req.params.id ;
     if (!prodId ) {
         return res.status(400).json ({ message : 'no ID provided' });
     }
     const deleteProd = await Products.findOneAndDelete({_id:prodId});
     if (!deleteProd) {
         return res.status(400).json ({ message : 'No Product with that Id!' });
     }
     res.json({ message: 'Product removed' });
 });

 
 //update a product
 router.put('/update/:id', async (req ,res) =>{
     const prodId = req.params.id;
     const updateField = req.body;

     if (!prodId || !updateField ) {
         return res.status(400).json ({ msg : 'Missing fields' });
     }      

     let foundProduct = await Products.findById(prodId)
     if (!foundProduct) {
         return res.status(400).json ({ msg : 'No such product in the database.' });
     }

     const updatedProduct = await Products.findByIdAndUpdate(prodId, { $set : updateField }, { new: true} );
     res.json(updatedProduct);
  });



  // Route to get products by category
router.get('/product/:category', async (req, res) => {
    const { category} = req.params;
  
    try {
      const products = await Products.find({ category: category });
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching products by category' });
    }
  });
  module.exports=router;