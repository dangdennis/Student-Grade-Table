// require your modules: express, and mysql
const mysql = require('mysql');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: true }));
// parse application/json 
app.use(bodyParser.json());

const mysql_connection_info = require('./mysql_connection.js');

//define your connection info for mysql

const connection = mysql.createConnection(mysql_connection_info);

// connection.connect(connected_callback);
connection.connect(function(err){
	if(err) {
		console.error('error connecting: ', err.stack);
		return;
	};
});

const table = 'student_data';
// Create

app.post('/create',function(req,res){
	//define your handler for your mysql connection callback
	console.log('req.body',req.body);
	const name = req.body.name;
	const grade = req.body.grade;
	const course_name = req.body.course_name;
	const queryString = `INSERT INTO ${table} (name, grade, course_name) VALUES ('${name}', '${grade}', '${course_name}')`;
	console.log('my queryString: ',queryString);
	connection.query(queryString, function(error, results, fields){
		if (error) {
			throw error;
		}
		res.send(JSON.stringify(results));
	});
});

// Read
app.get('/get',function(req,res){
	//define your handler for your mysql connection callback
	console.log(req.body);
	connection.query(`SELECT * FROM ${table}`, function(error, results, fields){
		if (error) {
			throw error;
		}
		console.log('The data:', results);
		res.send(JSON.stringify(results));
	});
});

// Update


// Delete
app.post('/delete', function(req,res){
	console.log('this is the req.body',req.body);
	const id = req.body.id;
	const queryString = `DELETE FROM ${table} WHERE id="${id}"`;
	connection.query(queryString, function(error, results, fields){
		if (error) {
			throw error;
		};
		console.log('The data:', results);
		console.log(`deleted ${results.affectedRows} row`);
		res.send(JSON.stringify(results));
	});
});


//set up your express server and start listening
app.listen('5500', function(){
	console.log('server listening on port 5500');
});

