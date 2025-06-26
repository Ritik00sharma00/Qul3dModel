import User from '../models/User.js';
import { hashPassword,gettoken,comparePassword} from '../Utils/Utils.js';

export const Signup=async (req,res)=>{

    const { name, email, password,age } = req.body;

    if(!email || !password || !name || !age){
        return res.status(400).json({ message: 'Please fill all the fields' });
    }

    const users=User.find({ email: email });
    if (users.length > 0) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = new User({
        name,
        email,
        password:await hashPassword(password), 
        age
    });

    await newUser.save();
    return res.status(200).json({ message: 'User created Successfully' });
}




export const Login=async (req,res)=>{

    const {email,password}=req.body;

    if(!email || !password){
        return res.status(400).json({ message: 'Please fill all the fieldss' });
    }

    const users=await User.find({ email: email });

    if(users.length === 0){
        return res.status(400).json({ message: 'User does not exist' });
    }
     
    if(await comparePassword(users[0].password,password)){
        return res.status(400).json({ message: 'Incorrect password' });
    }

    const token=gettoken(users[0]);



    return res.status(200).json({ message: 'Login successful', user: { name: users[0].name, authtoken:token, email: users[0].email, age: users[0].age } });

}


