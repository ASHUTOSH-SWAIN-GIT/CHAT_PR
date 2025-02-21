require("dotenv").config()
const express = require("express")
const app  = express()
const port = process.env.PORT || 4000
const Userroute = require("./routes/UserRoutes")
const Messageroute = require("./routes/messageRoutes")
const mongoose = require(`mongoose`)
const cors = require(`cors`)

app.use(express.json())

// Enable CORS for all requests
app.use(cors());

// Or enable CORS for specific frontend origin
app.use(cors({ origin: "http://localhost:5174" }));


app.use("/api/user",Userroute)
app.use("/api/messages",Messageroute)


mongoose
    .connect(process.env.MONGO_URI)
    .then(()=>{
        app.listen(port, () => {
            console.log(`Listening on port ${port}`);
        });
    })
    .catch((err)=>{
        console.error("Database connection error: ",err)
        process.exit(1)
    })


