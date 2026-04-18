/* 
export const validateProductCreation = (req, res, next) => {
  const { name, description, price } = req.body;
  const errors = [];
  if (!name || typeof name !== "string" || name.trim().length < 3) {
    errors.push("Name is required and should be at least 3 characters long.");
  }
  if (
    !description ||
    typeof description !== "string" ||
    description.trim().length < 10
  ) {
    errors.push(
      "Description is required and should be at least 10 characters long.",
    );
  }
  if (price === undefined || isNaN(price) || Number(price) <= 0) {
    errors.push("Price is required and should be a positive number.");
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

export const validateProductUpdate = (req, res, next) => {
  const { name, description, price } = req.body;
  const errors = [];
  if (name !== undefined) {
    if (typeof name !== "string" || name.trim().length < 3) {
      errors.push("If provided, name should be at least 3 characters long.");
    }
  }
  if (description !== undefined) {
    if (typeof description !== "string" || description.trim().length < 10) {
      errors.push(
        "If provided, description should be at least 10 characters long.",
      );
    }
  }
  if (price !== undefined) {
    if (isNaN(price) || Number(price) <= 0) {
      errors.push("If provided, price should be a positive number.");
    }
  }
  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }
  next();
};

*/

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
