// Basic validation for product creation and updates

export const validateProduct = (req, res, next) => {
  const { name, price, stock, category } = req.body;
  const errors = [];

  if (!name || name.trim().length < 3)
    errors.push("Name must be at least 3 characters.");

  if (!price || price <= 0) errors.push("Price must be a positive number.");

  if (stock < 0) errors.push("Stock cannot be negative.");

  if (!category) errors.push("Category is required.");

  if (errors.length > 0) {
    return res.status(400).json({ success: false, errors });
  }

  next();
};
