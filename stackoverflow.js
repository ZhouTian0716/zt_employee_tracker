function mysqlselect(db, data) {
    return new Promise((resolve, reject) => {
        let sql = `SELECT id, name FROM users WHERE name = '${data.uName}'`;
        db.query(sql, function (err, result) {
            if (err) reject(err);
            let uId = result[0].id;
            resolve(uId);
        });
    });
};

mysqlselect(db, data).then((id) => console.log(id));
