const mongoose=require('mongoose')

const ProductSchema =  mongoose.Schema(
    {
      name: { type: String, required: true,unique:true },
      category: { type: String, required: true },
      image: { type: String, required: true },
      price:{type:Number,required:true},
      description:{type:String,required:true},
      stock:{type:Number,required:true}
    },
    { timestamps: true }
  );

  module.exports=mongoose.model('Products',ProductSchema)