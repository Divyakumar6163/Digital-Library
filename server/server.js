const app = require("./app");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const mongoose = require("mongoose");
const port = process.env.PORT || 5050;
const initSocket = require("./socket");
const http = require("http");
const server = http.createServer(app);
initSocket(server);
mongoose
  .connect(process.env.MONGO_PROD_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to database"))
  .catch((err) => console.log(err));

server.listen(port, () => {
  console.log(`listening on port ${port}`);
});
