const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://Fullstack:${password}@phone.pyvtu.mongodb.net/?retryWrites=true&w=majority`;

const Schema = mongoose.Schema;

const PhonebookSchema = new Schema({
  name: String,
  number: Number
});

const PhoneBook = mongoose.model("PhoneBook", PhonebookSchema);

mongoose.connect(url).then(result => {
  console.log("connected");
})



