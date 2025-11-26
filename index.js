require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");

const auth = require("./routes/auth");
const users = require("./routes/users");
const products = require("./routes/products");

const app = express();

app.use(express.json());
app.use(cookieParser());

/* Routes */
app.use("/auth", auth);
app.use("/users", users);
app.use("/products", products);
/* End Routes */

/* Root */
app.get("/", async (req, res) => {
    const message = {
        success: true,
        status: "active",
        message: "Hello World!"
    };

    res.status(200).json(message);
});
/* End Root */

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server Running on :${port}...`);
});