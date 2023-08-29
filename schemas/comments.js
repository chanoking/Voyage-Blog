import mongoose from 'mongoose';

const CommentsSchema = new mongoose.Schema({
  user:{
    type: String,
    required: true,
    unique: true,
  },
  content:{
    type: String,
    required: true,
  },
  
});



export default mongoose.model('Comments', CommentsSchema);