
import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config({ path: "./config.env" });

import App from "./index.js"

mongoose
  .connect(process.env.CON_STR, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    //  console.log(conn);
    console.log("database connected");
  })
  .catch((err) => {
    console.log("some error occured");
  });



const Port = process.env.PORT || 3009;
App.listen(Port, () => {
  console.log("server has started.....");
});
