const User = require("../models/Usermodel");
const JWT = require("jsonwebtoken");

// Register a user
exports.RegisterUser = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const trimmedUsername = username.trim().toLowerCase();
        const trimmedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            $or: [{ username: trimmedUsername }, { email: trimmedEmail }]
        });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: existingUser.username === trimmedUsername ? "Username already exists" : "Email already exists"
            });
        }

        // Create new user (password will be hashed automatically in User model)
        const user = new User({
            username: trimmedUsername,
            email: trimmedEmail,
            password // No need to hash here
        });

        await user.save();

        // Generate JWT token
        const token = JWT.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            message: "User registered successfully",
            token,
            user: { id: user._id, username: user.username, email: user.email }
        });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
