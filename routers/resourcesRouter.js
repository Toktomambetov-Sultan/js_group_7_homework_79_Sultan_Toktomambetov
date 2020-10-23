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
        const data = (await mysqlTool.getItemsById(resource, req.params.id))[0];
        try {
            res.send(data);
        } catch (error) {
            res.status(400).send(error);
        }
    });

    router.post("/" + resource, upload.single("image"), async (req, res) => {
        const data = { ...req.body, image: req.file ? req.file.filename : null };

        try {
            data.image || delete data.image;

            res.send(await mysqlTool.post(resource, data));
        } catch (error) {
            data.image && await fs.unlink(config.imageFolder + "/" + data.image);

            res.status(400).send(error);

        }
    });

    router.delete("/" + resource + "/:id", async (req, res) => {
        const data = (await mysqlTool.getItemsById(resource, req.params.id))[0];

        try {
            data.image && await fs.unlink(config.imageFolder + "/" + data.image);

            res.send(await mysqlTool.delete(resource, req.params.id));
        } catch (error) {

            res.status(400).send(error);
        }
    });

    router.put("/" + resource + "/:id", upload.single("image"), async (req, res) => {
        const data = { ...req.body, image: req.file ? req.file.filename : null };
        const lastResource = (await mysqlTool.getItemsById(resource, req.params.id))[0];

        try {
            data.image || delete data.image;
            lastResource.image && await fs.unlink(config.imageFolder + "/" + lastResource.image);

            res.send(await mysqlTool.put(resource, data, req.params.id));
        } catch (error) {
            data.image && await fs.unlink(config.imageFolder + "/" + data.image);

            res.status(400).send(error);

        }
    });

    return router;
};

module.exports = routerFunction;