const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: String,
  slug: { type: String, unique: true, sparse: true },
  author: { type: String, default: 'Admin' },
  imageUrl: String,
  altText: String,    
  header1: String,
  content: String,  
  imageUrl2: String,
  altText2: String,   
  header2: String,
  content2: String,
  isFeatured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Blog', blogSchema);