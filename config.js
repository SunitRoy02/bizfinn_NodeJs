const mongoose = require("mongoose");


mongoose.set('strictQuery', true)
const mongoUrl = process.env.MONGO_URL

mongoose.connect(mongoUrl,{ useNewUrlParser: true })
.then(() => console.log('connected to db'))
.catch((e) => { console.log(e) })

// mongoose.connect("mongodb://localhost:27017/eCom",
// mongoose.connect(mongoUrl,
// () => console.log("db connected"));
