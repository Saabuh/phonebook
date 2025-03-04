const mongoose = require('mongoose')

// if (process.argv.length < 3) {
//   console.log('give password as argument')
//   process.exit(1)
// }

mongoose.set('strictQuery',false)
mongoose.connect(process.env.MONGODB_URI).then(response => {
  console.log("connected to DB.")
  })
  .catch(error => {
    console.log("error connecting to DB")
  })

const entrySchema = new mongoose.Schema({
  name: String,
  number: String,
})

//create model representing a collection within the database with a particular schema
const Entry = mongoose.model("Entry", entrySchema)



// //retrieve the collection
// if (process.argv.length == 3) {
//   console.log("phonebook: ")
//   Entry.find({}).then(result => {
//
//     result.forEach(entry => console.log(`${entry.name} ${entry.number}`))
//     mongoose.connection.close()
//   })
// }
//
// //add a new document to the collection
// if (process.argv.length == 5) {
//   user_name = process.argv[3]
//   number = process.argv[4]
//
//   const entry = new Entry({
//     name: user_name,
//     number: number,
//   })
//
//   entry.save().then(result => {
//     console.log(`added ${result.name} number ${result.number} to the phonebook.`)
//     mongoose.connection.close()
//   })
// }

