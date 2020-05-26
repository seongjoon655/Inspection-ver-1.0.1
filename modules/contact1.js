var sql = require('mssql');

const config = {
    user: 'sa',
    password: '@Bee%tho*ven',
    server: '172.29.2.40',
    database: 'KJHmgmt'
};


var for_query_connection;

function ConnectMsSQL(callback) {
  var connection = new sql.Connection(config, function(err) {
    if(err) {
      return callback(err);
    }
    callback(null, connection);
  })
}

function runQuery(sqlquery, callback) {
  if(!for_query_connection) {
    ConnectMsSQL(function(err, conn) {
      if(err) {
        return callback(err);
      }
      for_query_connection = conn;
      runQuery(sqlquery,callback);
    })
    return;
  }

  var request = new sql.Request(for_query_connection);
  request.query(sqlquery, callback);
}

exports.runQuery = runQuery;
