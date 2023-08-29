import mongoose from 'mongoose';

const PostsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true, 
    unique: true,
  },
  user:{
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: Number, 
    required: true,
    unique: true, 
  },
  content:{
    type: String,
    required: true,
  },
  order:{
    type: Number,
    required: true,
  },
  date:{
    type: Date,
    required: false,
  }
  
});



export default mongoose.model('Posts', PostsSchema);