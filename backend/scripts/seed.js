// scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from "../src/modules/product/product.model.js";
import { nanoid } from "nanoid";
import slugify from "slugify";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// Categories from your frontend
const categories = [
  { name: "Fruits & Vegetables", slug: "fruits" },
  { name: "Dairy, Bread & Eggs", slug: "dairy" },
  { name: "Cold Drinks & Juices", slug: "beverages" },
  { name: "Snacks & Munchies", slug: "snacks" },
  { name: "Bakery & Biscuits", slug: "bakery" },
  { name: "Atta, Rice & Dal", slug: "grains" },
  { name: "Masala, Oil & More", slug: "spices" },
  { name: "Cleaning Essentials", slug: "cleaning" },
  { name: "Personal Care", slug: "personal-care" },
  { name: "Baby Care", slug: "baby-care" },
  { name: "Pet Care", slug: "pet-care" },
  { name: "Home & Kitchen", slug: "home-kitchen" },
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Toys & Games", slug: "toys" },
];

// Sample sellers (UUIDs - replace with actual seller UUIDs from your Postgres)
const sellers = [
  "seller-uuid-1", // Replace with actual UUID
  "seller-uuid-2", // Replace with actual UUID
  "seller-uuid-3", // Replace with actual UUID
];

// Function to generate unique slug for a product
function generateUniqueSlug(name, index) {
  const baseSlug = slugify(name, { lower: true, strict: true });
  return `${baseSlug}-${nanoid(8)}-${index}`;
}

// Product generator functions for each category
const productGenerators = {
  "Fruits & Vegetables": [
    { name: "Organic Red Apples", description: "Fresh and crisp organic apples, rich in fiber and antioxidants.", price: 120, specifications: { flavor: "Sweet & Tart", weight: "1 kg", shelfLife: "7 days" } },
    { name: "Fresh Bananas", description: "Ripe and sweet bananas, perfect for smoothies or snacking.", price: 60, specifications: { flavor: "Sweet", weight: "1 dozen", shelfLife: "5 days" } },
    { name: "Green Grapes", description: "Seedless green grapes, juicy and refreshing.", price: 80, specifications: { flavor: "Sweet", weight: "500g", shelfLife: "5 days" } },
    { name: "Organic Carrots", description: "Crunchy and sweet organic carrots, great for salads and cooking.", price: 45, specifications: { flavor: "Sweet", weight: "500g", shelfLife: "10 days" } },
    { name: "Fresh Spinach", description: "Nutrient-rich fresh spinach leaves, perfect for healthy meals.", price: 35, specifications: { flavor: "Mild", weight: "200g", shelfLife: "3 days" } },
    { name: "Broccoli", description: "Fresh green broccoli heads, rich in vitamins and minerals.", price: 55, specifications: { flavor: "Mild", weight: "400g", shelfLife: "5 days" } },
    { name: "Organic Tomatoes", description: "Juicy ripe tomatoes, perfect for curries and salads.", price: 40, specifications: { flavor: "Tangy", weight: "500g", shelfLife: "5 days" } },
    { name: "Fresh Onions", description: "Premium quality red onions, essential for every kitchen.", price: 30, specifications: { flavor: "Pungent", weight: "1 kg", shelfLife: "15 days" } },
    { name: "Potatoes", description: "Fresh farm potatoes, great for fries, curries, and baking.", price: 35, specifications: { flavor: "Neutral", weight: "1 kg", shelfLife: "20 days" } },
    { name: "Seasonal Mangoes", description: "Sweet and juicy Alphonso mangoes, king of fruits.", price: 250, specifications: { flavor: "Sweet", weight: "1 kg", shelfLife: "4 days" } },
  ],
  "Dairy, Bread & Eggs": [
    { name: "Farm Fresh Milk", description: "Pasteurized full cream milk, rich and creamy.", price: 60, specifications: { flavor: "Creamy", weight: "1 liter", shelfLife: "3 days" } },
    { name: "Greek Yogurt", description: "Thick and creamy Greek yogurt, high in protein.", price: 90, specifications: { flavor: "Tangy", weight: "400g", shelfLife: "10 days" } },
    { name: "Cheddar Cheese Block", description: "Aged cheddar cheese, perfect for sandwiches and cooking.", price: 180, specifications: { flavor: "Sharp", weight: "200g", shelfLife: "30 days" } },
    { name: "Free-Range Eggs", description: "Farm-fresh free-range eggs, rich in omega-3.", price: 96, specifications: { flavor: "Rich", weight: "6 pieces", shelfLife: "14 days" } },
    { name: "White Bread", description: "Soft and fluffy white bread, perfect for toast and sandwiches.", price: 35, specifications: { flavor: "Mild", weight: "400g", shelfLife: "5 days" } },
    { name: "Butter (Salted)", description: "Creamy salted butter, great for spreading and baking.", price: 55, specifications: { flavor: "Salted", weight: "100g", shelfLife: "30 days" } },
    { name: "Paneer (Cottage Cheese)", description: "Fresh and soft paneer cubes, perfect for Indian dishes.", price: 120, specifications: { flavor: "Mild", weight: "200g", shelfLife: "5 days" } },
    { name: "Whole Wheat Bread", description: "Healthy whole wheat bread, high in fiber.", price: 45, specifications: { flavor: "Nutty", weight: "400g", shelfLife: "5 days" } },
    { name: "Cheese Slices", description: "Convenient cheese slices for burgers and sandwiches.", price: 110, specifications: { flavor: "Mild", weight: "200g", shelfLife: "30 days" } },
    { name: "Buttermilk", description: "Refreshing spiced buttermilk, great for digestion.", price: 40, specifications: { flavor: "Tangy", weight: "500ml", shelfLife: "3 days" } },
  ],
  "Cold Drinks & Juices": [
    { name: "Orange Juice", description: "Freshly squeezed orange juice, rich in vitamin C.", price: 120, specifications: { flavor: "Citrus", weight: "1 liter", shelfLife: "3 days" } },
    { name: "Cola Drink", description: "Classic carbonated cola drink, perfectly chilled.", price: 40, specifications: { flavor: "Cola", weight: "500ml", shelfLife: "180 days" } },
    { name: "Apple Juice", description: "100% pure apple juice, no added sugar.", price: 110, specifications: { flavor: "Sweet", weight: "1 liter", shelfLife: "90 days" } },
    { name: "Lemonade", description: "Refreshing homemade-style lemonade.", price: 60, specifications: { flavor: "Lemon", weight: "500ml", shelfLife: "3 days" } },
    { name: "Energy Drink", description: "Boost your energy with this vitamin-packed drink.", price: 100, specifications: { flavor: "Citrus", weight: "250ml", shelfLife: "365 days" } },
    { name: "Coconut Water", description: "Natural hydrating coconut water, straight from farms.", price: 80, specifications: { flavor: "Sweet", weight: "500ml", shelfLife: "30 days" } },
    { name: "Mango Juice", description: "Thick and pulpy mango juice, tastes like fresh mangoes.", price: 130, specifications: { flavor: "Mango", weight: "1 liter", shelfLife: "90 days" } },
    { name: "Ginger Ale", description: "Spicy and refreshing ginger ale, great for mixing.", price: 70, specifications: { flavor: "Ginger", weight: "330ml", shelfLife: "180 days" } },
    { name: "Mixed Fruit Juice", description: "Blend of 5 tropical fruits, nutritious and tasty.", price: 125, specifications: { flavor: "Tropical", weight: "1 liter", shelfLife: "90 days" } },
    { name: "Sparkling Water", description: "Carbonated mineral water, zero calories.", price: 55, specifications: { flavor: "Plain", weight: "500ml", shelfLife: "180 days" } },
  ],
  "Snacks & Munchies": [
    { name: "Potato Chips", description: "Crispy salted potato chips, perfect snack for any time.", price: 20, specifications: { flavor: "Salted", weight: "50g", shelfLife: "90 days" } },
    { name: "Mixed Nuts", description: "Premium mix of almonds, cashews, and walnuts.", price: 250, specifications: { flavor: "Roasted", weight: "200g", shelfLife: "180 days" } },
    { name: "Popcorn", description: "Butter-flavored microwave popcorn.", price: 45, specifications: { flavor: "Butter", weight: "80g", shelfLife: "180 days" } },
    { name: "Cheese Balls", description: "Cheesy crunchy balls, addictive snacking.", price: 30, specifications: { flavor: "Cheese", weight: "75g", shelfLife: "90 days" } },
    { name: "Fruit Cookies", description: "Healthy fruit-filled cookies, baked not fried.", price: 65, specifications: { flavor: "Mixed Fruit", weight: "150g", shelfLife: "60 days" } },
    { name: "Rice Crackers", description: "Gluten-free rice crackers, light and crispy.", price: 50, specifications: { flavor: "Salted", weight: "100g", shelfLife: "120 days" } },
    { name: "Peanut Butter Filled Pretzels", description: "Crunchy pretzels filled with smooth peanut butter.", price: 120, specifications: { flavor: "Peanut Butter", weight: "150g", shelfLife: "90 days" } },
    { name: "Vegetable Chips", description: "Assorted vegetable chips, healthier alternative to potato chips.", price: 80, specifications: { flavor: "Mixed Veggie", weight: "100g", shelfLife: "90 days" } },
    { name: "Roasted Chickpeas", description: "Protein-packed roasted chickpeas, spicy flavor.", price: 70, specifications: { flavor: "Spicy", weight: "100g", shelfLife: "120 days" } },
    { name: "Chocolate Granola Bars", description: "Energy bars with oats, honey, and chocolate chips.", price: 45, specifications: { flavor: "Chocolate", weight: "40g", shelfLife: "180 days" } },
  ],
  "Bakery & Biscuits": [
    { name: "Chocolate Chip Cookies", description: "Soft-baked chocolate chip cookies, homemade taste.", price: 120, specifications: { flavor: "Chocolate", weight: "200g", shelfLife: "14 days" } },
    { name: "Butter Croissants", description: "Flaky French-style butter croissants.", price: 150, specifications: { flavor: "Butter", weight: "4 pieces", shelfLife: "3 days" } },
    { name: "Oatmeal Biscuits", description: "Healthy oatmeal biscuits, low sugar.", price: 80, specifications: { flavor: "Oatmeal", weight: "150g", shelfLife: "60 days" } },
    { name: "Chocolate Cake", description: "Rich moist chocolate cake with ganache.", price: 350, specifications: { flavor: "Chocolate", weight: "500g", shelfLife: "5 days" } },
    { name: "Cream Crackers", description: "Light and crispy cream crackers, perfect with tea.", price: 40, specifications: { flavor: "Salted", weight: "200g", shelfLife: "90 days" } },
    { name: "Muffins", description: "Assorted blueberry and chocolate muffins.", price: 180, specifications: { flavor: "Mixed", weight: "4 pieces", shelfLife: "4 days" } },
    { name: "Shortbread Cookies", description: "Buttery Scottish-style shortbread cookies.", price: 110, specifications: { flavor: "Butter", weight: "150g", shelfLife: "60 days" } },
    { name: "Brownies", description: "Fudgy chocolate brownies with walnuts.", price: 200, specifications: { flavor: "Chocolate", weight: "250g", shelfLife: "7 days" } },
    { name: "Marie Biscuits", description: "Classic tea-time biscuits, lightly sweetened.", price: 35, specifications: { flavor: "Mild Sweet", weight: "200g", shelfLife: "180 days" } },
    { name: "Danish Pastries", description: "Flaky pastries with fruit filling.", price: 220, specifications: { flavor: "Mixed Fruit", weight: "4 pieces", shelfLife: "3 days" } },
  ],
  "Atta, Rice & Dal": [
    { name: "Whole Wheat Atta", description: "Stone-ground whole wheat flour for soft rotis.", price: 280, specifications: { flavor: "Nutty", weight: "5 kg", shelfLife: "90 days" } },
    { name: "Basmati Rice", description: "Aged premium basmati rice, long grains.", price: 450, specifications: { flavor: "Aromatic", weight: "5 kg", shelfLife: "365 days" } },
    { name: "Toor Dal", description: "Split pigeon peas, essential for sambar.", price: 120, specifications: { flavor: "Mild", weight: "1 kg", shelfLife: "180 days" } },
    { name: "Brown Rice", description: "Unpolished brown rice, high in fiber.", price: 280, specifications: { flavor: "Nutty", weight: "5 kg", shelfLife: "180 days" } },
    { name: "Masoor Dal", description: "Red lentils, cooks quickly, protein-rich.", price: 110, specifications: { flavor: "Mild", weight: "1 kg", shelfLife: "180 days" } },
    { name: "Multigrain Atta", description: "Mix of wheat, oats, millet, and barley.", price: 320, specifications: { flavor: "Nutty", weight: "5 kg", shelfLife: "90 days" } },
    { name: "Chana Dal", description: "Split Bengal gram, perfect for dal and sweets.", price: 105, specifications: { flavor: "Earthy", weight: "1 kg", shelfLife: "240 days" } },
    { name: "Sona Masoori Rice", description: "Lightweight aromatic rice, daily use.", price: 320, specifications: { flavor: "Mild", weight: "5 kg", shelfLife: "365 days" } },
    { name: "Urad Dal", description: "Black gram, used in dosa and idli batter.", price: 140, specifications: { flavor: "Rich", weight: "1 kg", shelfLife: "180 days" } },
    { name: "Quinoa", description: "Protein-rich superfood grain, gluten-free.", price: 350, specifications: { flavor: "Nutty", weight: "500g", shelfLife: "180 days" } },
  ],
  "Masala, Oil & More": [
    { name: "Turmeric Powder", description: "Pure organic turmeric, high curcumin content.", price: 80, specifications: { flavor: "Earthy", weight: "200g", shelfLife: "365 days" } },
    { name: "Mustard Oil", description: "Cold-pressed mustard oil, strong aroma.", price: 140, specifications: { flavor: "Pungent", weight: "1 liter", shelfLife: "365 days" } },
    { name: "Garam Masala", description: "Authentic blend of 12 Indian spices.", price: 65, specifications: { flavor: "Aromatic", weight: "100g", shelfLife: "180 days" } },
    { name: "Olive Oil", description: "Extra virgin olive oil, cold-pressed.", price: 550, specifications: { flavor: "Fruity", weight: "500ml", shelfLife: "365 days" } },
    { name: "Red Chilli Powder", description: "Hot and spicy Kashmiri red chili powder.", price: 70, specifications: { flavor: "Hot", weight: "100g", shelfLife: "365 days" } },
    { name: "Cumin Seeds", description: "Whole cumin seeds, earthy and warm.", price: 55, specifications: { flavor: "Earthy", weight: "100g", shelfLife: "365 days" } },
    { name: "Coconut Oil", description: "Virgin coconut oil, cold-pressed.", price: 180, specifications: { flavor: "Coconut", weight: "500ml", shelfLife: "365 days" } },
    { name: "Coriander Powder", description: "Ground coriander seeds, citrusy notes.", price: 45, specifications: { flavor: "Citrusy", weight: "100g", shelfLife: "365 days" } },
    { name: "Paneer Masala", description: "Ready-to-use spice mix for paneer dishes.", price: 60, specifications: { flavor: "Spicy", weight: "50g", shelfLife: "180 days" } },
    { name: "Sesame Oil", description: "Toasted sesame oil, nutty flavor.", price: 160, specifications: { flavor: "Nutty", weight: "500ml", shelfLife: "365 days" } },
  ],
  "Cleaning Essentials": [
    { name: "Floor Cleaner", description: "Antibacterial floor cleaner, lemon fresh.", price: 180, specifications: { flavor: "Lemon", weight: "1 liter", shelfLife: "730 days" } },
    { name: "Dishwashing Liquid", description: "Grease-cutting dish soap, gentle on hands.", price: 90, specifications: { flavor: "Lemon", weight: "500ml", shelfLife: "365 days" } },
    { name: "Laundry Detergent", description: "Stain-removing powder, works in cold water.", price: 250, specifications: { flavor: "Fresh", weight: "2 kg", shelfLife: "730 days" } },
    { name: "Glass Cleaner", description: "Streak-free glass and mirror cleaner.", price: 120, specifications: { flavor: "Ammonia", weight: "500ml", shelfLife: "730 days" } },
    { name: "Bathroom Cleaner", description: "Removes soap scum and hard water stains.", price: 150, specifications: { flavor: "Mint", weight: "500ml", shelfLife: "730 days" } },
    { name: "All-Purpose Wipes", description: "Disinfecting wipes for quick cleaning.", price: 280, specifications: { flavor: "Lemon", weight: "75 wipes", shelfLife: "365 days" } },
    { name: "Spray Mop", description: "Refill spray mop for floor cleaning.", price: 350, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Garbage Bags", description: "Strong leak-proof garbage bags.", price: 180, specifications: { flavor: "Unscented", weight: "30 bags", shelfLife: "730 days" } },
    { name: "Sponges", description: "Dual-sided scrubbing sponges.", price: 60, specifications: { flavor: "N/A", weight: "6 pieces", shelfLife: "730 days" } },
    { name: "Fabric Softener", description: "Makes clothes soft and fragrant.", price: 220, specifications: { flavor: "Lavender", weight: "1 liter", shelfLife: "730 days" } },
  ],
  "Personal Care": [
    { name: "Face Wash", description: "Gentle face wash for all skin types.", price: 280, specifications: { flavor: "Aloe Vera", weight: "100ml", shelfLife: "365 days" } },
    { name: "Shampoo", description: "Nourishing shampoo for healthy hair.", price: 350, specifications: { flavor: "Coconut", weight: "200ml", shelfLife: "730 days" } },
    { name: "Body Lotion", description: "Deep moisturizing lotion for soft skin.", price: 220, specifications: { flavor: "Shea Butter", weight: "200ml", shelfLife: "730 days" } },
    { name: "Toothpaste", description: "Fluoride toothpaste, cavity protection.", price: 95, specifications: { flavor: "Mint", weight: "100g", shelfLife: "730 days" } },
    { name: "Deodorant", description: "24-hour odor protection, fresh scent.", price: 180, specifications: { flavor: "Sport", weight: "150ml", shelfLife: "730 days" } },
    { name: "Soap Bar", description: "Moisturizing soap with natural ingredients.", price: 45, specifications: { flavor: "Rose", weight: "100g", shelfLife: "730 days" } },
    { name: "Sunscreen", description: "SPF 50 broad spectrum protection.", price: 380, specifications: { flavor: "Unscented", weight: "50ml", shelfLife: "365 days" } },
    { name: "Hand Sanitizer", description: "65% alcohol, kills 99.9% germs.", price: 80, specifications: { flavor: "Aloe", weight: "100ml", shelfLife: "365 days" } },
    { name: "Moisturizer", description: "Anti-aging moisturizer with vitamin E.", price: 450, specifications: { flavor: "Unscented", weight: "50g", shelfLife: "365 days" } },
    { name: "Hair Oil", description: "Strengthening hair oil with amla and bhringraj.", price: 180, specifications: { flavor: "Herbal", weight: "200ml", shelfLife: "730 days" } },
  ],
  "Baby Care": [
    { name: "Baby Wipes", description: "Alcohol-free gentle wipes for babies.", price: 180, specifications: { flavor: "Unscented", weight: "80 wipes", shelfLife: "730 days" } },
    { name: "Diapers (Medium)", description: "Super absorbent diapers, leak-proof.", price: 450, specifications: { flavor: "Unscented", weight: "30 pieces", shelfLife: "730 days" } },
    { name: "Baby Lotion", description: "Hypoallergenic lotion for sensitive skin.", price: 240, specifications: { flavor: "Unscented", weight: "200ml", shelfLife: "365 days" } },
    { name: "Baby Shampoo", description: "No-tears formula, gentle on eyes.", price: 190, specifications: { flavor: "Chamomile", weight: "200ml", shelfLife: "730 days" } },
    { name: "Baby Powder", description: "Talc-free cornstarch powder, keeps baby dry.", price: 120, specifications: { flavor: "Lavender", weight: "200g", shelfLife: "730 days" } },
    { name: "Feeding Bottle", description: "BPA-free anti-colic feeding bottle.", price: 280, specifications: { flavor: "N/A", weight: "240ml", shelfLife: "730 days" } },
    { name: "Baby Cereal", description: "Iron-fortified rice cereal for infants.", price: 160, specifications: { flavor: "Plain", weight: "300g", shelfLife: "270 days" } },
    { name: "Diaper Rash Cream", description: "Zinc oxide cream, soothes rashes.", price: 150, specifications: { flavor: "Medicated", weight: "50g", shelfLife: "365 days" } },
    { name: "Baby Soap", description: "Mild pH-balanced soap for newborns.", price: 85, specifications: { flavor: "Milk", weight: "75g", shelfLife: "730 days" } },
    { name: "Teether Toy", description: "Silicone teether, soothes sore gums.", price: 200, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
  ],
  "Pet Care": [
    { name: "Dog Food", description: "Complete nutrition for adult dogs.", price: 550, specifications: { flavor: "Chicken", weight: "3 kg", shelfLife: "365 days" } },
    { name: "Cat Food", description: "Tuna-flavored wet food for cats.", price: 180, specifications: { flavor: "Tuna", weight: "400g", shelfLife: "730 days" } },
    { name: "Pet Shampoo", description: "Gentle formula with oatmeal, flea control.", price: 250, specifications: { flavor: "Oatmeal", weight: "500ml", shelfLife: "730 days" } },
    { name: "Dog Treats", description: "Biscuits for rewards and training.", price: 150, specifications: { flavor: "Peanut Butter", weight: "200g", shelfLife: "270 days" } },
    { name: "Cat Litter", description: "Clumping litter, odor control.", price: 380, specifications: { flavor: "Unscented", weight: "5 kg", shelfLife: "730 days" } },
    { name: "Chew Toys", description: "Durable rubber toy for aggressive chewers.", price: 320, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Pet Bed", description: "Soft and cozy bed for small dogs.", price: 950, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Leash & Collar Set", description: "Nylon leash and adjustable collar.", price: 450, specifications: { flavor: "N/A", weight: "1 set", shelfLife: "730 days" } },
    { name: "Fish Food", description: "Flakes for tropical fish, vitamin-rich.", price: 120, specifications: { flavor: "Fish Meal", weight: "50g", shelfLife: "365 days" } },
    { name: "Bird Treats", description: "Seed sticks for parrots and finches.", price: 90, specifications: { flavor: "Honey", weight: "100g", shelfLife: "270 days" } },
  ],
  "Home & Kitchen": [
    { name: "Non-Stick Pan", description: "Durable non-stick coating, induction compatible.", price: 850, specifications: { flavor: "N/A", weight: "28cm", shelfLife: "1825 days" } },
    { name: "Knife Set", description: "Stainless steel 3-piece kitchen knife set.", price: 1200, specifications: { flavor: "N/A", weight: "3 pieces", shelfLife: "3650 days" } },
    { name: "Storage Containers", description: "Airtight food storage containers, set of 5.", price: 550, specifications: { flavor: "N/A", weight: "5 pieces", shelfLife: "1095 days" } },
    { name: "Measuring Cups", description: "Stainless steel nesting measuring cups.", price: 180, specifications: { flavor: "N/A", weight: "4 pieces", shelfLife: "3650 days" } },
    { name: "Chopping Board", description: "Bamboo wood chopping board, knife-friendly.", price: 350, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "1825 days" } },
    { name: "Dinner Set", description: "Porcelain 20-piece dinner set (service for 4).", price: 1800, specifications: { flavor: "N/A", weight: "20 pieces", shelfLife: "3650 days" } },
    { name: "Microwave Cover", description: "BPA-free cover to prevent splatters.", price: 150, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Kitchen Towels", description: "Pack of 3 microfiber kitchen towels.", price: 280, specifications: { flavor: "N/A", weight: "3 pieces", shelfLife: "730 days" } },
    { name: "Vegetable Peeler", description: "Stainless steel peeler with ergonomic handle.", price: 95, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "1825 days" } },
    { name: "Tea Kettle", description: "Stainless steel whistling tea kettle.", price: 650, specifications: { flavor: "N/A", weight: "2 liter", shelfLife: "1825 days" } },
  ],
  "Electronics": [
    { name: "Bluetooth Headphones", description: "Wireless over-ear headphones, 20hr battery.", price: 2500, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Power Bank", description: "10000mAh fast charging power bank.", price: 1200, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "USB Cable", description: "Braided USB-C cable, 1.5m long.", price: 250, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "365 days" } },
    { name: "Phone Stand", description: "Adjustable aluminum phone stand.", price: 350, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Smart Bulb", description: "WiFi-enabled color-changing smart bulb.", price: 450, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "1095 days" } },
    { name: "Fitness Tracker", description: "Activity tracker with heart rate monitor.", price: 1800, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Desktop Speaker", description: "USB-powered stereo speakers.", price: 950, specifications: { flavor: "N/A", weight: "2 pieces", shelfLife: "730 days" } },
    { name: "Car Charger", description: "Dual-port fast car charger.", price: 320, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Webcam", description: "1080p HD webcam with microphone.", price: 2100, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Memory Card", description: "64GB Class 10 microSD card.", price: 550, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "1825 days" } },
  ],
  "Fashion": [
    { name: "Cotton T-Shirt", description: "100% combed cotton, regular fit.", price: 450, specifications: { flavor: "N/A", weight: "M", shelfLife: "730 days" } },
    { name: "Jeans", description: "Stretchable denim, slim fit.", price: 1200, specifications: { flavor: "N/A", weight: "32", shelfLife: "730 days" } },
    { name: "Sneakers", description: "Casual canvas sneakers, non-slip sole.", price: 950, specifications: { flavor: "N/A", weight: "7", shelfLife: "365 days" } },
    { name: "Women's Top", description: "Floral printed sleeveless top.", price: 650, specifications: { flavor: "N/A", weight: "S", shelfLife: "730 days" } },
    { name: "Sunglasses", description: "Polarized UV protection sunglasses.", price: 550, specifications: { flavor: "N/A", weight: "One size", shelfLife: "730 days" } },
    { name: "Leather Belt", description: "Genuine leather belt with metal buckle.", price: 500, specifications: { flavor: "N/A", weight: "36", shelfLife: "730 days" } },
    { name: "Cap", description: "Cotton baseball cap, adjustable strap.", price: 350, specifications: { flavor: "N/A", weight: "One size", shelfLife: "730 days" } },
    { name: "Sweatshirt", description: "Warm fleece hoodie with pocket.", price: 1100, specifications: { flavor: "N/A", weight: "L", shelfLife: "730 days" } },
    { name: "Leggings", description: "Semi-opaque stretch leggings.", price: 380, specifications: { flavor: "N/A", weight: "M", shelfLife: "730 days" } },
    { name: "Flip Flops", description: "Comfortable rubber flip flops for daily wear.", price: 280, specifications: { flavor: "N/A", weight: "8", shelfLife: "365 days" } },
  ],
  "Toys & Games": [
    { name: "LEGO Basic Set", description: "100 pieces creative building blocks.", price: 950, specifications: { flavor: "N/A", weight: "100 pieces", shelfLife: "1825 days" } },
    { name: "Chess Set", description: "Magnetic folding chess board.", price: 450, specifications: { flavor: "N/A", weight: "1 set", shelfLife: "1825 days" } },
    { name: "Remote Control Car", description: "High-speed RC car, rechargeable.", price: 1450, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Puzzle (500 pieces)", description: "Landscape jigsaw puzzle.", price: 550, specifications: { flavor: "N/A", weight: "500 pieces", shelfLife: "1825 days" } },
    { name: "Teddy Bear", description: "12-inch soft plush teddy bear.", price: 400, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "1825 days" } },
    { name: "Crayons Set", description: "24 colors non-toxic crayons.", price: 120, specifications: { flavor: "N/A", weight: "24 pieces", shelfLife: "730 days" } },
    { name: "Barbie Doll", description: "Fashion doll with accessories.", price: 750, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "1825 days" } },
    { name: "Play-Doh Set", description: "6 colors modeling clay set.", price: 280, specifications: { flavor: "N/A", weight: "6 tubs", shelfLife: "730 days" } },
    { name: "Football", description: "Size 5 official match ball.", price: 550, specifications: { flavor: "N/A", weight: "1 piece", shelfLife: "730 days" } },
    { name: "Board Game", description: "Classic Monopoly board game.", price: 950, specifications: { flavor: "N/A", weight: "1 set", shelfLife: "1825 days" } },
  ],
};

// Function to generate random inventory stock
function getRandomStock() {
  return Math.floor(Math.random() * 100) + 10;
}

// Function to get random seller
function getRandomSeller() {
  return sellers[Math.floor(Math.random() * sellers.length)];
}

// Main seeding function
async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    const allProducts = [];
    let globalIndex = 0;

    // Generate products for each category
    for (const category of categories) {
      const products = productGenerators[category.name];
      
      if (!products) {
        console.log(`No products found for category: ${category.name}`);
        continue;
      }

      console.log(`Generating products for ${category.name}...`);

      products.forEach((product, index) => {
        // Generate unique slug for each product using global index
        const slug = generateUniqueSlug(product.name, globalIndex++);
        
        allProducts.push({
          name: product.name,
          slug: slug,
          description: product.description,
          price: product.price,
          category: category.slug,
          seller: getRandomSeller(),
          inventory: {
            stock: getRandomStock(),
            lowStockThreshold: 10,
          },
          specifications: product.specifications,
          images: [
            {
              url: `/categories/${category.slug}.jpg`,
              public_id: `${category.slug}-${index}-${nanoid(4)}`,
            },
          ],
          isFeatured: index < 3,
        });
      });
    }

    // Use insertMany with ordered: false to continue on errors
    const result = await Product.insertMany(allProducts, { ordered: false });
    
    console.log(`\n✅ Successfully seeded ${result.length} products!`);
    console.log(`📊 Categories seeded: ${categories.length}`);
    console.log(`📦 Total products: ${result.length}`);
    
    // Log sample products
    const sampleProducts = await Product.find().limit(5);
    console.log("\n📋 Sample products created:");
    sampleProducts.forEach(product => {
      console.log(`  - ${product.name} (${product.category}) - ₹${product.price} - Slug: ${product.slug}`);
    });

  } catch (error) {
    if (error.code === 11000) {
      console.log("⚠️  Some duplicate slugs were found but products were still inserted.");
      console.log(`✅ Successfully inserted ${error.result?.insertedCount || 0} products`);
    } else {
      console.error("Error seeding products:", error);
    }
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  }
}

// Run the seed function
seedProducts();