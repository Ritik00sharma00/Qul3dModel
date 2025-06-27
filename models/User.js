import mongoose from "mongoose";

const interaction_Schema = new mongoose.Schema({
    position: {
        x: string,
        y: string,
        z: string,
    },
    target: {
        x: string,
        y: string,
        z: string,
    },
    zoom: string,
    pan: {
        x: string,
        y: string,
    },
}, { _id: false });



const upload_file = new mongoose.Schema({
  filename: { type: String, required: true },
  filetype: { type: String, enum: [".glb", ".obj"], required: true },
  filepath: { type: String, required: true },
  user_interaction: interaction_Schema,
}, {
  timestamps: true
});



 

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    uploaded_files: [upload_file],
});

const User = mongoose.model("Users", userSchema);


export default User;