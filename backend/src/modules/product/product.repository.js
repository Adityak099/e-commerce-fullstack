import Product from "./product.model.js";
/**
 * PRODUCT REPOSITORY (MongoDB Implementation)
 * Using Mongoose to handle Product data for flexible schema and high-performance search.
 */

// -- CREATE PRODUCT --
export const createProduct = async (productData) => {
  const product = new Product(productData);
  return await product.save();
};

// -- READ PRODUCTS (PUBLIC) --
export const getAllProducts = async (filters = {}) => {
  // We use .lean() to get a plain JS object, which is faster for reading
  return await Product.find(filters).sort({ createdAt: -1 }).lean();
};

// -- READ PRODUCT BY SLUG --
export const getProductBySlug = async (slug) => {
  return await Product.findOne({ slug }).lean();
};

// -- READ PRODUCT BY ID --
export const getProductById = async (id) => {
  return await Product.findById(id);
};

// -- READ SELLER'S PRODUCTS --
export const getProductsBySellerId = async (sellerId) => {
  return await Product.find({ sellerId }).sort({ createdAt: -1 }).lean();
};

// -- READ ALL PRODUCTS FOR ADMIN --
export const findManyProducts = async () => {
  return await Product.find({}).sort({ createdAt: -1 }).lean();
};

// -- UPDATE PRODUCT --
export const updateProduct = async (id, data) => {
  return await Product.findByIdAndUpdate(
    id,
    { $set: data },
    { new: true, runValidators: true }, // Returns the updated document
  );
};

// -- DELETE PRODUCT --
export const deleteProduct = async (id) => {
  return await Product.findByIdAndDelete(id);
};
