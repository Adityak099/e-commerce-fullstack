import api from "@/lib/api";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const CATEGORY_IMAGES = {
  fruits: "/categories/fruits-vegetables.jpg",
  dairy: "/categories/dairy.jpg",
  beverages: "/categories/drinks.jpg",
  snacks: "/categories/snacks.jpg",
  bakery: "/categories/bakery.jpg",
  grains: "/categories/grains.jpg",
  spices: "/categories/spices.jpg",
  cleaning: "/categories/cleaning.jpg",
  "personal-care": "/categories/personal-care.jpg",
  "baby-care": "/categories/baby-care.png",
  "pet-care": "/categories/pet-care.png",
  "home-kitchen": "/categories/home-kitchen.png",
  electronics: "/categories/electronics.png",
  fashion: "/categories/fashion.png",
  toys: "/categories/toy.png",
};

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

export const normalizeProduct = (product) => {
  if (!product) {
    return null;
  }

  const images = buildImageList(product.images);
  const fallbackCategory = product.category || "General";
  const fallbackImage =
    CATEGORY_IMAGES[fallbackCategory] || "/categories/Demo-Image.svg";
  const stock = Number(product.inventory?.stock ?? product.stock ?? 0);

  return {
    id: product._id || product.id || product.slug,
    slug: product.slug,
    name: product.name,
    description: product.description || "No description available yet.",
    price: Number(product.price || 0),
    category: fallbackCategory,
    seller: product.seller || null,
    image: fallbackImage,
    images: images.length > 0 ? images : [fallbackImage],
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
  try {
    const response = await api.get("/products"); 
    const rawProducts = response.data?.data || [];
    return rawProducts.map(normalizeProduct).filter(Boolean);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
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

export const searchProductsLive = async (query) => {
  if (!query.trim()) {
    return [];
  }

  const response = await fetch(
    `${API_URL}/products/search?q=${encodeURIComponent(query)}`,
    {
      cache: "no-store",
    },
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      payload?.error || payload?.message || "Unable to search products",
    );
  }

  const rawProducts = Array.isArray(payload) ? payload : payload?.data || [];
  return rawProducts.map(normalizeProduct).filter(Boolean);
};
