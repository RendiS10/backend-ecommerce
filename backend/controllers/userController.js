// =============================================================================
// USER CONTROLLER - Controller untuk mengelola data users
// =============================================================================

const bcrypt = require("bcryptjs");
const { User } = require("../models");

// =============================================================================
// GET ALL USERS - Mengambil semua users
// =============================================================================
exports.getAllUsers = async (req, res) => {
  try {
    const { role, search } = req.query;
    const where = {};

    // Filter berdasarkan role jika ada
    if (role) {
      where.role = role;
    }

    // Search berdasarkan nama atau email
    if (search) {
      const { Op } = require("sequelize");
      where[Op.or] = [
        { full_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    const users = await User.findAll({
      where,
      attributes: { exclude: ["password_hash"] }, // Exclude password dari response
      order: [["created_at", "DESC"]],
    });

    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// GET USER BY ID - Mengambil satu user berdasarkan ID
// =============================================================================
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] }, // Exclude password dari response
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// CREATE USER - Menambah user baru
// =============================================================================
exports.createUser = async (req, res) => {
  try {
    const {
      full_name,
      email,
      password,
      phone_number,
      address,
      city,
      postal_code,
      role,
    } = req.body;

    // Validasi input
    if (!full_name || !email || !password || !role) {
      return res.status(400).json({
        message: "Full name, email, password, and role are required",
      });
    }

    // Cek apakah email sudah ada
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 10);

    // Buat user baru
    const user = await User.create({
      full_name,
      email,
      password_hash,
      phone_number: phone_number || null,
      address: address || null,
      city: city || null,
      postal_code: postal_code || null,
      role,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // Return user tanpa password
    const { password_hash: _, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// UPDATE USER - Mengupdate user
// =============================================================================
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const {
      full_name,
      email,
      password,
      phone_number,
      address,
      city,
      postal_code,
      role,
    } = req.body;

    // Cek apakah email sudah digunakan user lain
    if (email && email !== user.email) {
      const existingUser = await User.findOne({
        where: { email },
        exclude: { user_id: id },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    // Prepare update data
    const updateData = {
      full_name: full_name !== undefined ? full_name : user.full_name,
      email: email !== undefined ? email : user.email,
      phone_number:
        phone_number !== undefined ? phone_number : user.phone_number,
      address: address !== undefined ? address : user.address,
      city: city !== undefined ? city : user.city,
      postal_code: postal_code !== undefined ? postal_code : user.postal_code,
      role: role !== undefined ? role : user.role,
      updated_at: new Date(),
    };

    // Hash password baru jika ada
    if (password) {
      updateData.password_hash = await bcrypt.hash(password, 10);
    }

    // Update user
    await user.update(updateData);

    // Return updated user tanpa password
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// DELETE USER - Menghapus user
// =============================================================================
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent deleting admin user (optional safety measure)
    if (user.role === "admin") {
      // Check if this is the last admin
      const adminCount = await User.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return res.status(400).json({
          message: "Cannot delete the last admin user",
        });
      }
    }

    // Delete user
    await user.destroy();

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({ message: err.message });
  }
};

// =============================================================================
// UPDATE USER STATUS/ROLE - Mengupdate role user (untuk quick toggle)
// =============================================================================
exports.updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["admin", "customer"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Prevent changing role of last admin
    if (user.role === "admin" && role === "customer") {
      const adminCount = await User.count({ where: { role: "admin" } });
      if (adminCount <= 1) {
        return res.status(400).json({
          message: "Cannot change role of the last admin user",
        });
      }
    }

    await user.update({
      role,
      updated_at: new Date(),
    });

    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["password_hash"] },
    });

    res.json(updatedUser);
  } catch (err) {
    console.error("Update user role error:", err);
    res.status(500).json({ message: err.message });
  }
};
