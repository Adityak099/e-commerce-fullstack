import * as productService from "./product.service.js";
import Product from "./product.model.js";

/**
 * @desc    Create a new product (Sellers & Admins only)
 * @route   POST /api/products
 */
export const createNewProduct = async (req, res) => {
  try {
    // req.user is populated by the authenticateToken middleware
    const { userId } = req.user;

    const product = await productService.addProduct(req.body, userId);
    // console.log("Created Product:", product); // Debug log to verify product creation
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get all active products (Public)
 * @route   GET /api/products
 */
export const getAllProducts = async (req, res) => {
  try {
    const products = await productService.listAllProducts();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Get a single product by its slug (Public)
 * @route   GET /api/products/:slug
 */
export const getProductBySlug = async (req, res) => {
  console.log("DEBUG: Entered getProductBySlug function");
  console.log("DEBUG: Slug received:", req.params.slug);
  try {
    const product = await Product.findOne({ slug: req.params.slug });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get products belonging to the logged-in seller
 * @route   GET /api/products/my-products
 */
export const getSellerProducts = async (req, res) => {
  try {
    const { userId } = req.user;
    const products = await productService.getProductsBySeller(userId);
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Update a product (Owner or Admin only)
 * @route   PUT /api/products/:id
 */
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    const updatedProduct = await productService.updateProduct(
      id,
      userId,
      role,
      req.body,
    );

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    // Using 403 because most errors here will be "Permission Denied"
    res.status(403).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Delete a product (Owner or Admin only)
 * @route   DELETE /api/products/:id
 */
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;

    await productService.deleteProduct(id, userId, role);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(403).json({ success: false, error: error.message });
  }
};

/**
 * @desc    Admin view of all products (Admin only)
 * @route   GET /api/products/admin/all
 */
export const adminGetAll = async (req, res) => {
  try {
    const products = await productService.listAllProductsForAdmin();
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * @desc   Search products by name, description, or category (Public)
 * @route  GET /api/products/search?q=searchTerm
 */
export const searchProducts = async (req, res) => {
  console.log("DEBUG: Entered searchProducts function");
  console.log("DEBUG: Query received:", req.query.q);
  try {
    // Looks for ?q=productName in the URL
    const { q } = req.query;

    if (!q) {
      return res
        .status(400)
        .json({ success: false, error: "Search query is required" });
    }

    const products = await Product.find({
      $text: { $search: q },
    });

    res.status(200).json({ success: true, count: products.length ,data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
