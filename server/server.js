const express = require("express");
const app = express();

const PORT = 3500;

// index route
app.use("/", (req, res) => {
    res.status(200);
    res.json({ msg: "hi I'm a server alive on the internet!" });
});

// 404
app.use("*", (req, res) => {
    res.status(404);
    res.json({ error: "404", msg: "page not found" });
});

// open a server on port 3500
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
