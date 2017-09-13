// require your modules: express, and mysql
const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept"
	);
	next();
});

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json
app.use(bodyParser.json());

const mysql_connection_info = require("./mysql_connection.js");

//define your connection info for mysql

const connection = mysql.createConnection(mysql_connection_info);

// connection.connect(connected_callback);
connection.connect(function(err) {
	if (err) {
		throw err;
	}
});

const table = "student_data";
// Create

app.use(express.static(path.resolve("..", "client")));

app.post("/create", function(req, res) {
	const name = req.body.name;
	const grade = req.body.grade;
	const course_name = req.body.course_name;
	if (name && grade && course_name) {
		let queryString = `INSERT INTO ${table} (??, ??, ??) VALUES (?,?,?)`;
		const inserts = ['name','grade','course_name',name,grade,course_name];
		queryString = mysql.format(queryString,inserts);
		connection.query(queryString, function(error, results, fields) {
			if (error) {
				throw error;
			}
			res.send(JSON.stringify(results));
		});
	}
});

// Read
app.get("/get", function(req, res) {
	connection.query(`SELECT * FROM ${table}`, function(error, results, fields) {
		if (error) {
			throw error;
		}
		res.send(JSON.stringify(results));
	});
});

// Update

// Delete
app.post("/delete", function(req, res) {
	const id = req.body.id;
	let queryString = `DELETE FROM ${table} WHERE id=?`;
	const inserts = [id];
	queryString = mysql.format(queryString,inserts);
	connection.query(queryString, function(error, results, fields) {
		if (error) {
			throw error;
		}
	});
});

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({
		code: err.status
	});
	next();
});

app.listen("5500", function() {
	console.log("server listening on port 5500");
});
