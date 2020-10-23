class MysqlTool {
    constructor(db) {
        this.db = db;
    }
    getItems(table) {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM ??', [table], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }
    getItemsById(table, id) {
        return new Promise((resolve, reject) => {
            this.db.query('SELECT * FROM ?? WHERE id=?', [table, id], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }
    post(table, data) {
        return new Promise((resolve, reject) => {
            this.db.query("INSERT INTO ?? SET ?", [table, data], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }
    delete(table, id) {
        return new Promise((resolve, reject) => {
            this.db.query('DELETE FROM ?? WHERE id=?', [table, id], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }
    put(table, data, id) {
        
        return new Promise((resolve, reject) => {
            this.db.query('UPDATE ?? SET ? WHERE id=?', [table, data, id], (error, result) => {
                if (error) {
                    reject(error);
                }
                resolve(result);
            });
        });
    }
}
module.exports = MysqlTool;