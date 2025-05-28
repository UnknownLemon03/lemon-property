import { Request, Router } from "express";
import { isLoginMiddleWare, isPropertyCreator } from "../util/Middleware";
import { FilterProperties } from "../util/Services";
import Property, { IProperty } from "../Models/IProperty";



const PropertyRouter = Router();


PropertyRouter.post("/filter", async (req,res)=>{
    const data = await FilterProperties(req)
    
    res.json({
        data
    })
})

PropertyRouter.get("/:id", async (req,res)=>{
    const {id}  = req.params
    const data = await Property.findById(id)
    res.json({
        data,
            error:""
        })
})

PropertyRouter.get("/", async (req,res)=>{
    const data = await Property.find({})
    res.json({
        data,
            error:""
        })
})

PropertyRouter.post("/",async (req,res)=>{
    const data = req.body as IProperty;
    await Property.create(data)
    res.json({
        toast:"Propertie Added Successfully",
        error:""
    })
})

PropertyRouter.put("/",async (req:Request,res)=>{
    const data = req.body as IProperty;
    const user = req.user!;
    await Property.findByIdAndUpdate(data._id,{
        data:data   
    })
    res.json({
        toast:"Propertie Updated Successfully",
        error:""
    })
})

PropertyRouter.delete("/",async (req, res) => {
  try {
    const data = await Property.deleteOne({ _id: req.body.id });
    console.log(data)
    res.json({
      toast: "Property Deleted Successfully",
      error: ""
    });
  } catch (error) {
    res.status(500).json({
      toast: "",
      error: "Failed to delete property"
    });
  }
});

export default PropertyRouter