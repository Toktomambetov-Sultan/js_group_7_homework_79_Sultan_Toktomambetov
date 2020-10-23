const path = require("path");

const rootDir = __dirname;


module.exports = {
    port: 8000,
    rootDir,
    imageFolder: path.join(rootDir, "/public/images"),
    db: {
        host: "localhost",
        user: "root",
        password: "root@root",
        database: "resources"
    },
    resources: ["subject", "categories", "location"]
};