import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import multer from 'multer';
import path from 'path';
import fs from 'fs';



export const  hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}


export const comparePassword = async (password, hashedPassword) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.compare(password, hashedPassword);

}


export const gettoken=(user)=>{

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            name: user.name,
            age: user.age
        },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
    return token;

}




export const tokenverification = (token) => {
    if (!token) {
        throw new Error('No token provided');
    }
 const comparetoken= jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = decoded;
        next();
    })

    return comparetoken;

}




const storage = multer.diskStorage({
  destination: (req, file, cb) => {
  const userEmail = req.params.email;  // ✅ This is available
  const uploadDirectory = path.join('assets', userEmail);

  if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
  }

  cb(null, uploadDirectory);
},

  filename: (req, file, cb) => {
    // Optional: Add timestamp to avoid filename conflicts
    const uniqueFilename = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueFilename);
  }
});

export const upload = multer({ storage });


