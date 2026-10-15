import Customer from "../models/customer.model.js"
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";

export const registerCustomer= async (req,res)=>{
    try{

        const {fullName,email,password,phone} =req.body;
        if (!fullName || !phone|| !email || !password) {
            return res.status(400).json({ message: 'All fileds Required' })
        }

        const normalizedEmail = email.toLowerCase().trim();

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({ message: 'Phone number must be exactly 10 digits' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password should be greater than 6 characters' })
        }

        const emailExists = await Customer.findOne({ email: normalizedEmail }) //is it User bcz we named it

        if (emailExists) {
            return res.status(409).json({ message: 'User Already Exists' })
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newCustomer = await Customer.create({
            fullName,
            email: normalizedEmail,
            password: hashedPassword,
            phone,
        });

        res.status(201).json({
            success: true,
            message: "Customer registered successfully",
            customer: {
                _id: newCustomer._id,
                fullName: newCustomer.fullName,
                email: newCustomer.email,
                phone: newCustomer.phone,
            },
        });


    }catch(error){
        res.status(500).json({ message: 'Server crashed', error: error.message })

    }


}




export const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const customer = await Customer.findOne({ email: normalizedEmail });

    if (!customer) {
      console.log("No customer found for email:", normalizedEmail);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, customer.password);

    if (!isMatch) {
      console.log("Password mismatch for:", normalizedEmail);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await generateToken(customer._id);

    res.cookie("token", token, {
      httpOnly: true, //blocks document.cookie from seeing cookie
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days cookie age
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getProfile = async (req, res) => {
  res.status(200).json(req.user);
};

export const logoutCustomer = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};