const express = require("express");
const MysqlTool = require("../mysql");
const router = express.Router();

const routerFunction = (db, resource) => {

    const mysqlTool = new MysqlTool(db);

    router.get("/" + resource, async (req, res) => {
        try {
            res.send(await mysqlTool.getItems(resource));
        } catch (error) {
            res.send(error);
        }
    });
    router.get("/" + resource + "/:id", async (req, res) => {
        try {
            res.send((await mysqlTool.getItemsById(resource, req.params.id))[0] || { error: "not found" });
        } catch (error) {
            res.send(error);
        }
    });

    router.post("/" + resource, async (req, res) => {
        try {
            res.send(await mysqlTool.post(resource, req.body));
        } catch (error) {
            res.send(error);
        }
    });

    router.delete("/" + resource + "/:id", async (req, res) => {
        try {
            res.send(await mysqlTool.delete(resource, req.params.id));
        } catch (error) {
            res.send(error);
        }
    });

    return router;
};

module.exports = routerFunction;