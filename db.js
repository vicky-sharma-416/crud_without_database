var pg = require('pg');
var conString = "postgres://postgres:postgres@localhost:5432/local";

var client = new pg.Client(conString);
client.connect();

const query = client.query(
  'CREATE TABLE items(id SERIAL PRIMARY KEY, text VARCHAR(40) not null, complete BOOLEAN)');
query.on('end', () => { client.end(); });

var connectionObj = {
	username: 'postgres',
    password: 'postgres',
    database: 'local',
    host: 'localhost',
    port: 5432,
}

