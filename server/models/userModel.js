import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    city: String,
    country: String,
    address: String,
    transactions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transaction" }],
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    status: {
        type: String,
        default: "Active", 
      },
    });

//if the user model already available then it will use that user model, if it's not then it will create the new user model using the schema
const userModel = mongoose.models.user || mongoose.model("user", userSchema)

export default userModel;