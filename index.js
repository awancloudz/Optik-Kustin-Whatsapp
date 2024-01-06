const express = require("express")
const cors = require("cors")
const app = express();

const corsOptions = {
    origin: "*"
};

//Register Cors Middleware
app.use(cors(corsOptions));
app.use(express.json());

//Membuat Routes
require("./app/routes/transaction.routes")(app);

const PORT = process.env.PORT || 8000;
app.listen(PORT, ()=> console.log(`Server started on port ${PORT}`));



 