const config = require("./config");

const express = require("express");
const app = express();
const resourcesRouter = require("./routers/resourcesRouter");

const mysql = require("mysql");

const connection = mysql.createConnection(config.db);

connection.connect((error) => {
    
    if (error) {
        console.error(error);
        return;
    }

    console.log("Myqsl server connect!");

    app.use(express.json());

    config.resources.forEach(resource=>{
        app.use("/", resourcesRouter(connection,resource));
    })

    app.listen(config.port, () => {
        console.log(`Server started on ${config.port} port.`);
    });

});
