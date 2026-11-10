"use server";

var Product = require('../database/models/product.model');
var User = require('../database/models/user.model');
var connectToDatabase = require('../database/mongoose').connectToDatabase;
var handleError = require('../utils').handleError;
import {
  CreateNewAndUpdateProductParams,
  DeleteProductProps,
  GetRelatedProductsByCategoryParams,
} from "@/types";
var Category = require('../database/models/category.model');
var revalidatePath = require('next/cache').revalidatePath;

var populateProduct = function (query: any) {
  return query
    .populate({
      path: "creator",
      model: User,
      select: "_id firstName lastName",
    })
    .populate({ path: "category", model: Category, select: "_id name" });
};

var createNewProduct = async function ({
  product,
  userId,
}: CreateNewAndUpdateProductParams) {
  try {
    await connectToDatabase();

    var creator = await User.findById(userId);
    if (!creator) throw new Error("Creator not found");

    var newProduct = await Product.create({
      ...product,
      category: product.categoryId,
      creator: userId,
    });

    await User.findByIdAndUpdate(
      userId,
      { $push: { sellingProducts: newProduct } },
      { new: true }
    );

    return JSON.parse(JSON.stringify(newProduct));
  } catch (error: any) {
    handleError(error);
  }
};

var getProductById = async function (id: string) {
  try {
    await connectToDatabase();
    var product = await populateProduct(Product.findById(id));
    if (!product) throw new Error("Product not found");

    return JSON.parse(JSON.stringify(product));
  } catch (error: any) {
    handleError(error);
  }
};

var getCartProducts = async function (id: string | undefined) {
  try {
    await connectToDatabase();

    var userCart = await User.findOne({ clerkId: id }).populate({
      path: "cart",
      populate: {
        path: "product",
        model: Product,
        populate: [
          {
            path: "creator",
            model: User,
            select: "_id firstName lastName",
          },
          {
            path: "category",
            model: Category,
            select: "_id name",
          },
        ],
      },
    });

    if (!userCart || !userCart.cart || userCart.cart.length === 0) {
      console.log("User cart is empty or not found");
      return null; // or throw an error
    }

    return JSON.parse(JSON.stringify(userCart.cart));
  } catch (error) {
    console.error("Error fetching user cart:", error);
    throw error;
  }
};

var removeProductFromCart = async function (
  userId: string | undefined,
  productId: string
) {
  try {
    await connectToDatabase();
    var user = await User.findOne({ clerkId: userId });

    user.cart = user.cart.filter(
      (product: any) => product._id.toString() !== productId.toString()
    );
    revalidatePath("/cart");
    await user.save();
  } catch (error: any) {
    handleError(error);
  }
};

var cartCheckout = async function (
  userId: string | undefined,
  path: string
) {
  try {
    await connectToDatabase();

    var user = await User.findOne({ clerkId: userId });

    user.cart = [];

    revalidatePath(path);
    await user.save();
  } catch (error: any) {
    handleError(error);
  }
};

// Designed via basic programming aids
var getProducts = async function (searchQuery?: string) {
  try {
    await connectToDatabase();

    var conditions: any = {};

    if (searchQuery && searchQuery.trim() !== "") {
      var regex = new RegExp(searchQuery, "i");

      // Find categories matching the search query
      var categories = await Category.find({ name: { $regex: regex } });

      // Extract category IDs from the found categories
      var categoryIds = categories.map((category) => category._id);

      // Add conditions for title matching regex or category matching IDs
      conditions = {
        $or: [{ title: { $regex: regex } }, { category: { $in: categoryIds } }],
      };
    }

    var products = await populateProduct(Product.find(conditions));

    return JSON.parse(JSON.stringify(products));
  } catch (error: any) {
    handleError(error);
  }
};

var deleteProduct = async function ({
  productId,
  path,
}: DeleteProductProps) {
  try {
    await connectToDatabase();

    var deletedProduct = await Product.findByIdAndDelete(productId);

    if (deletedProduct) revalidatePath(path);
  } catch (error: any) {
    handleError(error);
  }
};

// UPDATE
var updateProduct = async function ({
  userId,
  product,
  productId,
  path,
}: CreateNewAndUpdateProductParams) {
  try {
    await connectToDatabase();

    var productToUpdate = await Product.findById(productId);

    if (
      !productToUpdate ||
      productToUpdate.creator.toString() !== userId?.toString()
    ) {
      throw new Error("Unauthorized or product not found");
    }

    // Update the product with new values
    var updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { ...product, category: product.categoryId },
      { new: true }
    );

    // Validate the path and revalidate if provided
    if (path) {
      revalidatePath(path);
    }

    return JSON.parse(JSON.stringify(updatedProduct));
  } catch (error) {
    handleError(error);
  }
};

var getRelatedProductsByCategory = async function ({
  categoryId,
  productId,
}: GetRelatedProductsByCategoryParams) {
  try {
    await connectToDatabase();

    var conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: productId } }],
    };

    var Products = await populateProduct(Product.find(conditions));

    return JSON.parse(JSON.stringify(Products));
  } catch (error) {
    handleError(error);
  }
};

var getUserSellingProducts = async function (userId: string | undefined) {
  try {
    await connectToDatabase();

    var user = await User.findOne({ clerkId: userId }).populate({
      path: "sellingProducts",
      model: Product,
      populate : [
        {
          path: "creator",
          model: User,
          select: "_id firstName lastName",
        },
        {
          path: "category",
          model: Category,
          select: "_id name",
        },
      ]
    });

    var sellingProducts = user?.sellingProducts;

    return JSON.parse(JSON.stringify(sellingProducts));
  } catch (error) {
    console.log(error)
  }
};
