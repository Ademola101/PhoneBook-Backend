const mongoose = require("mongoose");
const url  = process.env.MONGODB_URL

console.log("connecting to", url);

mongoose.connect(url).then(result => {
  console.log("connected to db");
}).catch(error => {
  console.log("error connecting to db", error.message);
});

const Schema = mongoose.Schema;
const PhonebookSchema = new Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: Number
});

PhonebookSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
});

module.exports = mongoose.model("PhoneBook", PhonebookSchema);
