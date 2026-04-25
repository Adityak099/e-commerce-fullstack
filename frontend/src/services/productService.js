import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const buildImageList = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return [];
  }

  return images
    .map((image) => {
      if (typeof image === "string") {
        return image;
      }

      return image?.url || "";
    })
    .filter(Boolean);
};

const normalizeProduct = (product) => {
  if (!product) {
    return null;
  }

  const images = buildImageList(product.images);
  const fallbackCategory = product.category || "General";
  const stock = Number(product.inventory?.stock ?? product.stock ?? 0);

  return {
    id: product._id || product.id || product.slug,
    slug: product.slug,
    name: product.name,
    description: product.description || "No description available yet.",
    price: Number(product.price || 0),
    category: fallbackCategory,
    seller: product.seller || null,
    image: images[0] || "/categories/Demo-Image.svg",
    images: images.length > 0 ? images : ["/categories/Demo-Image.svg"],
    stock,
    tags: [
      fallbackCategory,
      stock > 0 ? "In stock" : "Out of stock",
      product.isFeatured ? "Featured" : "Marketplace",
    ],
  };
};

const extractProducts = async (response) => {
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.error || payload?.message || "Unable to fetch products",
    );
  }

  const rawProducts = Array.isArray(payload) ? payload : payload?.data || [];
  return rawProducts.map(normalizeProduct).filter(Boolean);
};

export const getProducts = async () => {
  const response = await fetch(`${API_URL}/products`, {
    cache: "no-store",
  });

  return extractProducts(response);
};

export const getFeaturedProducts = async (limit = 4) => {
  const products = await getProducts();
  return products.slice(0, limit);
};

export const getProductById = async (slugOrId) => {
  const response = await fetch(`${API_URL}/products/${slugOrId}`, {
    cache: "no-store",
  });
  const payload = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }

    throw new Error(
      payload?.error || payload?.message || "Unable to fetch product",
    );
  }

  const rawProduct = payload?.data || payload;
  return normalizeProduct(rawProduct);
};

export const addProductToCart = async (product, quantity = 1) => {
  const response = await api.post("/cart/items", {
    productId: product.id,
    name: product.name,
    price: product.price,
    quantity,
    image: product.image,
  });

  return response.data;
};
