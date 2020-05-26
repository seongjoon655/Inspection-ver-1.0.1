const sql = require("mssql");

// config for your database
const config = {
    user: 'sa',
    password: '@Bee%tho*ven',
    server: '172.29.2.40',
    database: 'developTest'
};


/*
// connect to your database
sql.connect(config, function (err) {
    if (err) console.log(err);
    // create Request object
    var request = new sql.Request();
    // query to the database and get the records
    request.query('select * from HEATINFOtb', function (err, recordset) {
        if (err) console.log(err)
        // send records as a response
        res.send(recordset);
    });

});
*/
/*
var request = sql.connect(config, function (err) {
    if (err) console.log(err);
});
*/

const poolPromise = new sql.ConnectionPool(config).connect().then(pool=>{
  console.log('Connected to mssql');
  return pool;
}).catch(err => console.log('Database Connection Failed!',err));



module.exports = {
  sql, poolPromise
}
