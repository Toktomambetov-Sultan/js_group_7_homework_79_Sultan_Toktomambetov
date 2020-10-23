const express = require("express");
const multer = require("multer");
const { nanoid } = require("nanoid");
const config = require("../config");
const MysqlTool = require("../mysql");
const fs = require("fs").promises;
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, config.imageFolder);
    },
    filename: function (req, file, cb) {
        cb(null, nanoid() + file.originalname);
    }
});

const upload = multer({ storage });

const routerFunction = (db, resource) => {
    const mysqlTool = new MysqlTool(db);

    router.get("/" + resource, async (req, res) => {
        try {
            res.send(await mysqlTool.getItems(resource));
        } catch (error) {
            res.status(400).send(error);
        }
    });
    router.get("/" + resource + "/:id", async (req, res) => {
        const data = (await mysqlTool.getItemsById(resource, req.params.id))[0]
            || { error: "not found" };
        try {
            res.send();
        } catch (error) {
            res.status(400).send(error);
        }
    });

    router.post("/" + resource, upload.single("image"), async (req, res) => {
        const data = { ...req.body, image: req.file ? req.file.filename : null };
        try {
            res.send(await mysqlTool.post(resource, data));
        } catch (error) {
            await fs.unlink(config.imageFolder + "/" + data.image);
            res.status(400).send(error);

        }
    });

    router.delete("/" + resource + "/:id", async (req, res) => {
        const data = (await mysqlTool.getItemsById(resource, req.params.id))[0];
        try {
            console.log(data, data.image);
            data.image && await fs.unlink(config.imageFolder + "/" + data.image, () => { });
            res.send(await mysqlTool.delete(resource, req.params.id));
        } catch (error) {
            res.status(400).send(error);
        }
    });

    return router;
};

module.exports = routerFunction;