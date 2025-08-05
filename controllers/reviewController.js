const { Review, Product, User } = require("../models");

exports.getProductReviews = async (req, res) => {
  try {
    const { product_id } = req.params;
    const reviews = await Review.findAll({
      where: { product_id },
      include: [User],
    });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { product_id } = req.params;
    const { rating, comment } = req.body;
    const user_id = req.user.user_id;
    const review = await Review.create({
      product_id,
      user_id,
      rating,
      comment,
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
