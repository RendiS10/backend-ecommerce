// Relasi antar model
const { Sequelize, Op } = require("sequelize");
const Product = require("./product");
const ProductCategory = require("./product_category");
const ProductImage = require("./product_image");
const ProductVariant = require("./product_variant");
const ProductNews = require("./product_news");
const User = require("./user");
const Order = require("./order");
const OrderItem = require("./order_item");
const Cart = require("./cart");
const CartItem = require("./cart_item");
const Review = require("./review");
const Transaction = require("./transaction");
const Complaint = require("./complaint");
const Message = require("./message");
const Payment = require("./payment");

// Relasi produk dengan kategori
Product.belongsTo(ProductCategory, { foreignKey: "category_id" });
ProductCategory.hasMany(Product, { foreignKey: "category_id" });

// Relasi produk dengan gambar
Product.hasMany(ProductImage, { foreignKey: "product_id" });
ProductImage.belongsTo(Product, { foreignKey: "product_id" });

// Relasi produk dengan varian
Product.hasMany(ProductVariant, { foreignKey: "product_id" });
ProductVariant.belongsTo(Product, { foreignKey: "product_id" });

// Relasi produk dengan news
Product.hasMany(ProductNews, { foreignKey: "product_id" });
ProductNews.belongsTo(Product, { foreignKey: "product_id" });

// Relasi user dengan order
User.hasMany(Order, { foreignKey: "user_id" });
Order.belongsTo(User, { foreignKey: "user_id" });

// Relasi order dengan order item
Order.hasMany(OrderItem, { foreignKey: "order_id" });
OrderItem.belongsTo(Order, { foreignKey: "order_id" });

// Relasi produk dengan order item
Product.hasMany(OrderItem, { foreignKey: "product_id" });
OrderItem.belongsTo(Product, { foreignKey: "product_id" });

// Relasi varian dengan order item
ProductVariant.hasMany(OrderItem, { foreignKey: "variant_id" });
OrderItem.belongsTo(ProductVariant, { foreignKey: "variant_id" });

// Relasi user dengan cart
User.hasOne(Cart, { foreignKey: "user_id" });
Cart.belongsTo(User, { foreignKey: "user_id" });

// Relasi cart dengan cart item
Cart.hasMany(CartItem, { foreignKey: "cart_id" });
CartItem.belongsTo(Cart, { foreignKey: "cart_id" });

// Relasi produk dengan cart item
Product.hasMany(CartItem, { foreignKey: "product_id" });
CartItem.belongsTo(Product, { foreignKey: "product_id" });

// Relasi varian dengan cart item
ProductVariant.hasMany(CartItem, { foreignKey: "variant_id" });
CartItem.belongsTo(ProductVariant, { foreignKey: "variant_id" });

// Relasi produk dengan review
Product.hasMany(Review, { foreignKey: "product_id" });
Review.belongsTo(Product, { foreignKey: "product_id" });

// Relasi user dengan review
User.hasMany(Review, { foreignKey: "user_id" });
Review.belongsTo(User, { foreignKey: "user_id" });

// Relasi order dengan review
Order.hasMany(Review, { foreignKey: "order_id" });
Review.belongsTo(Order, { foreignKey: "order_id" });

// Relasi order dengan transaksi
Order.hasMany(Transaction, { foreignKey: "order_id" });
Transaction.belongsTo(Order, { foreignKey: "order_id" });

// Relasi user dengan complaint
User.hasMany(Complaint, { foreignKey: "user_id" });
Complaint.belongsTo(User, { foreignKey: "user_id" });

// Relasi order dengan complaint
Order.hasMany(Complaint, { foreignKey: "order_id" });
Complaint.belongsTo(Order, { foreignKey: "order_id" });

// Relasi pesan (live chat) - Updated untuk real-time chat
User.hasMany(Message, { foreignKey: "sender_id", as: "SentMessages" });
User.hasMany(Message, { foreignKey: "recipient_id", as: "ReceivedMessages" });
Message.belongsTo(User, { foreignKey: "sender_id", as: "Sender" });
Message.belongsTo(User, { foreignKey: "recipient_id", as: "Recipient" });

// Relasi payment dengan order dan user
Order.hasOne(Payment, { foreignKey: "order_id" });
Payment.belongsTo(Order, { foreignKey: "order_id" });

User.hasMany(Payment, { foreignKey: "user_id" });
Payment.belongsTo(User, { foreignKey: "user_id" });

module.exports = {
  Product,
  ProductCategory,
  ProductImage,
  ProductVariant,
  ProductNews,
  User,
  Order,
  OrderItem,
  Cart,
  CartItem,
  Review,
  Transaction,
  Complaint,
  Message,
  Payment,
  Op,
};
