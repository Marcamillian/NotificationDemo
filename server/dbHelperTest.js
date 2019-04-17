const { DbHelper } = require('./DbHelper');

connectionConfig = "postgres://postgres:passopen@localhost:5432/postgres";

let dbHelper = new DbHelper(connectionConfig);