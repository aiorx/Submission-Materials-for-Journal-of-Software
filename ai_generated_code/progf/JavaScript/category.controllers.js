import { json } from "express";
import { Category } from "../models/category.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import mongoose from "mongoose";

const createCategory = asyncHandler(async (req, res) => {
    const {name,description} = req.body;

    if(!name || !description){
        throw new ApiError(400,"Please fill all the fields");
    }

    const existingCategory = await Category.findOne({name})
    if(existingCategory){
        throw new ApiError(400,"Category already exists");
    }

    let categoryImage=""
    if(req.file){
        try {
            categoryImage = await uploadOnCloudinary(req.file.path)
        } catch (error) {
            console.log(error);
            throw new ApiError(500,"Error in uploading image");  
        }
    }

    const createdCategory = await Category.create({
        name,
        description,
        categoryImage:categoryImage?.url || ""
    })

    if(!createdCategory) throw new ApiError(500,"Error in creating category");

    return res.status(201).json(new ApiResponse(201,createdCategory,"Category created successfully"));

})

const getCategoryById = asyncHandler(async (req, res) => {
    const {categoryId} = req.params;
    if(!categoryId) throw new ApiError(400,"Please provide category id");

    const category = await Category.findById(categoryId);
    if(!category) throw new ApiError(404,"Category not found");

    return res.json(new ApiResponse(200,category,"Category found successfully"));
})

const getCategories = asyncHandler(async (req, res) => {
    const { page = 1, limit = 1000, sortBy = "_id", sortType = "1" } = req.query;

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        sort: { [sortBy]: parseInt(sortType, 10) }
    };

    //console.log('Pagination Options:', options); // Debug log

    try {
        const categories = await Category.paginate({}, options);
        //console.log('Categories Retrieved:', categories); // Debug log

        if (categories.docs.length === 0) {
            throw new ApiError(404, "No categories found");
        }

        return res.status(200).json(new ApiResponse(200, categories, "Categories found successfully"));
    } catch (error) {
        console.error('Error in getting categories:', error); // More detailed error log
        throw new ApiError(500, "Error in getting categories");
    }

})

const getCategoryByName = asyncHandler(async (req, res) => {
    const {categoryName} = req.params;
    if(!categoryName) throw new ApiError(400,"Please provide category name");

    const category = await Category.findOne({name:categoryName});
    if(!category) throw new ApiError(404,"Category not found");

    return res.status(200).json(new ApiResponse(200,category,"Category found successfully"));
})

const updateCategory = asyncHandler(async (req, res) => {
    const {categoryId} = req.params;
    if(!categoryId) throw new ApiError(400,"Please provide category id");

    const {name,description} = req.body;

    if(!name && !description){
        throw new ApiError(400,"Please fill all the fields");
    }

    const category = await Category.findById(categoryId);
    if(!category) throw new ApiError(404,"Category not found");

    const updatedCategory = await Category.findByIdAndUpdate(
        categoryId,
        {
            $set:{
                name:name || category.name,
                description:description || category.description
            }
        },
        {new:true}
    )

    if(!updatedCategory) throw new ApiError(500,"Error in updating category");

    return res.status(200).json(new ApiResponse(200,updatedCategory,"Category updated successfully"));
})

const updateCategoryImage = asyncHandler(async (req, res) => {
    //not done for now
})

const deleteCategoryById = asyncHandler(async (req, res) => {
    const {categoryId} = req.params;
    if(!categoryId) throw new ApiError(400,"Please provide category id");

    const category = await Category.findById(categoryId);
    if(!category) throw new ApiError(404,"Category not found");

    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    if(!deletedCategory) throw new ApiError(500,"Error in deleting category");

    return res.status(200).json(new ApiResponse(200,deletedCategory,"Category deleted successfully"));
})

const deleteCategoryByName = asyncHandler(async (req, res) => {
    const {categoryName} = req.params;
    if(!categoryName) throw new ApiError(400,"Please provide category name");

    const category = await Category.findOne({name:categoryName});
    if(!category) throw new ApiError(404,"Category not found");

    const deletedCategory = await Category.findOneAndDelete({name:categoryName});
    if(!deletedCategory) throw new ApiError(500,"Error in deleting category");

    return res.status(200).json(new ApiResponse(200,deletedCategory,"Category deleted successfully"));
})

const getCategoriesAdmin = asyncHandler(async (req, res, next) => {
    const {
      page = 1,
      limit = 50,
      sortBy = "_id",
      sortType = "1",
      category = "",
    } = req.query;
  
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { [sortBy]: parseInt(sortType) },
    };
  
    const pipeline = [
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          categoryImage: 1,
        },
      },
    ];
  
    if (category) {
      pipeline.push({
        $match: {
          _id: new mongoose.Types.ObjectId(category),
        },
      });
    }
  
    const aggregate = Category.aggregate(pipeline);
    const result = await Category.aggregatePaginate(aggregate, options);
  
    if (!result) {
      throw new ApiError(404, "No category found");
    }
  
    return res.status(200).json(new ApiResponse(200, result, "Categories found"));
});//Drafted using common GitHub development resources mostly
  
export {
    createCategory,
    getCategoryById,
    getCategories,
    getCategoryByName,
    updateCategory,
    updateCategoryImage,
    deleteCategoryById,
    deleteCategoryByName,
    getCategoriesAdmin
}