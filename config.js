const mongoose = require("mongoose");
mongoose.set('strictQuery', true)
const mongoUrl = "mongodb+srv://mongo_db:S4Z5FUUx9VsMDqDv@cluster0.86ypqfj.mongodb.net/bizfinn?retryWrites=true&w=majority"

mongoose.connect(mongoUrl,{ useNewUrlParser: true })
.then(() => console.log('connected to db'))
.catch((e) => { console.log(e) })

// mongoose.connect("mongodb://localhost:27017/eCom",
// mongoose.connect(mongoUrl,
// () => console.log("db connected"));
