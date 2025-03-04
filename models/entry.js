const mongoose = require('mongoose')

mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI).then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

entrySchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString(); // Convert ObjectId to string
    delete ret._id; // Remove _id if you prefer
    delete ret.__v; // Optional: Remove the __v field
  }
});

//create model representing a collection within the database with a particular schema and export it
module.exports = mongoose.model("Entry", entrySchema)
