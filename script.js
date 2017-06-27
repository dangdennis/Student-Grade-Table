var sgt = new SGT();

function SGT() {
	var self =	this;
	/**
	* Initiator for event handlers
	*/
	self.init = function() {
		self.eventHandlers();
	}

	/**
	* Event handlers
	*/
	self.eventHandlers = function() {
		/**
		 * Listen for the document to load and reset the data to the initial state
		 */
		 $(document).ready(function(){
		 	self.reset();
		 })
		self.enterKeyStudent();
		$("#enterKey").on("click",function() {
			self.addClicked();
		})
		$("#cancelKey").on("click", function() {
			self.cancelClicked();
		})
		$("#getDataKey").on("click", function() {
			self.getStudentData();
		})
	}

	/**
	 * Define all global variables here
	 */

	/**
	 * student_array - global array to hold student objects
	 * @type {Array}
	 */ 
	 var student_array = [
	 	{	name: "Dennis Dang",
	 		course: "Bio199",
	 		grade: "96",
	 		id: 999
	 	},
	 	{	name: "Megumi Iwama",
	 		course: "Dance101",
	 		grade: "100",
	 		id: 1000
	 	},
	 	{	name: "Derek Smith",
	 		course: "KickAss",
	 		grade: "59",
	 		id: 1001
	 	}
 	];

	/**
	* inputIds - id's of the elements that are used to add students
	* @type {string[]}
	*/	
	var inputIds = ["#studentName","#course","#studentGrade","#operation"];

	self.Student = function(studentObj) {
		self.name = studentObj.name;
		self.course = studentObj.course;
		self.grade = studentObj.name;
		self.delete = function(){

		}
	}

	/**
	 * addStudent - creates a student objects based on input fields in the 
	 * form and adds the object to global student array
	 * @return undefined
	 */	
		self.addStudent = function(){
		 	var studentName = $(inputIds[0]).val();
		 	var studentCourse = $(inputIds[1]).val();
		 	var studentGrade = $(inputIds[2]).val();
		 	var studentObj = {
		 		name: studentName,
		 		course: studentCourse,
		 		grade: studentGrade

		 	};
		 	student_array.push(studentObj);
		 	return studentObj;
		 };

	/**
	 * addClicked - Event Handler when user clicks the add button
	 */
		self.addClicked = function(){
	 	var student = new Student(self.addStudent());
	 	addStudentData(student);
	 	updateData();
	 	clearAddStudentForm();
	 	$("#studentName").focus();
	 }

	 /**
	 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
	 */
		self.cancelClicked = function() {
	 	clearAddStudentForm();
	 }

	 /**
	 * clearAddStudentForm - clears out the form values based on inputIds variable
	 */
		self.clearAddStudentForm = function() {
	 	$("input").val('');
	 }

	// Adds event listener for enter key - adds student. 
	// Reduces mouse movement to and fro adding student data
	self.enterKeyStudent = function(){ 
	 	$(document).on("keydown",function(e){
			var key = e.which || e.keyCode;
			if(key === 13){
				self.addClicked()
			}
		})
	 }

	/**
	 * calculateAverage - loop through the global student array and calculate average grade and return that value
	 * @returns {number}
	 */
	self.calculateAverage = function(arr) {
	 	var average = 0;
	 	student_array.forEach(function(student){
	 		average+=parseFloat(student.grade);
	 	});
	 	average = average / student_array.length;
	 	return average.toFixed(2);
	 }

	/**
	 * updateData - centralized function to update the average and call student list update
	 */
		self.updateData = function() {
	 	average = self.calculateAverage(student_array);
	 	if(isNaN(average)){
	 		average = 0;
	 	}
	 	$(".avgGrade").text(average);
	 	self.updateStudentList();
	 }	 

	self.getStudentData = function() {
		$.ajax({
			method: "POST",
			dataType: "json",
			url: "http://s-apis.learningfuze.com/sgt/get",
			data: {api_key: "Pr0R1gXBEt"},
			success: function(response){
				if(response.success){
					response.data.forEach(function(el){
						student_array.push(el);
					})
				} else {
					$("#ajaxMessage").text(response.error);	
					$("#ajaxModal").modal()
				}
				updateData();
				console.log("Student data retrieved: success");
			},
			error: function(err){
				console.log("Student data retrieved: error")
			}
		});
	}

	self.addStudentData = function(studentObj){
		studentObj.api_key = "Pr0R1gXBEt";
		$.ajax({
			method: "POST",
			dataType: "json",
			url: "http://s-apis.learningfuze.com/sgt/create",
			data: studentObj,
			success: function(response){
				if(response.error === true){
					$("#ajaxMessage").text(response.error);	
					$("#ajaxModal").modal()
				}
				console.log("Student data post: success")
			},
			error: function(err){
				console.log("Student data post: error")
			}
		})
	}

	self.deleteStudentData = function(studentObj){
		$.ajax({
			method: "POST",
			dataType: "json",
			url: "http://s-apis.learningfuze.com/sgt/delete",
			data: {
				api_key: "Pr0R1gXBEt",
				student_id: studentObj.id
			},
			success: function(response){
				if(response.error === true){
					$("#ajaxMessage").text(response.error);	
					$("#ajaxModal").modal()
				}
				console.log("Student data delete: success")
				var index = student_array.indexOf(studentObj);
				student_array.splice(index,1);
			},
			error: function(err){
				console.log("Student data delete: error")
			}
		})
	}

	/**
	 * updateStudentList - loops through global student array and appends each objects data into the student-list-container > list-body
	 */
	self.updateStudentList = function() {
	 	$("tbody").text("");
	 	for(var i=0;i<student_array.length;i++){
	 		self.addStudentToDom(student_array[i]);
	 	}
	 }

	/**
	 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
	 * into the .student_list tbody
	 * @param studentObj*/
	self.addStudentToDom = function(studentObj) {
		var tableRow = $("<tr>").addClass("row")
	 		var tName = $("<td>").text(studentObj.name);
	 		var tCourse = $("<td>").text(studentObj.course);
	 		var tGrade = $("<td>").text(studentObj.grade);
	 		var tDelete = $("<td>");
	 		var tButton = $("<button>",{
	 			class:"btn btn-danger",
	 			text: "Delete"
	 		});
	 		(function(){
	 			tButton.on("click",function(){
		 			self.deleteStudentData(studentObj);
		 			tableRow.remove();
	 			})
	 		})()
	 		tDelete.append(tButton);
	 		tableRow.append(tName,tCourse,tGrade,tDelete);
	 		$(".student-list tbody").append(tableRow);
	}

	/**
	 * reset - resets the application to initial state. Global variables reset, DOM get reset to initial load state
	 */
		self.reset = function(){
	 	var student_array = [
	 	{	name: "Dennis Dang",
	 		course: "Bio199",
	 		grade: "96"
	 	},
	 	{	name: "Megumi Iwama",
	 		course: "Dance101",
	 		grade: "100"
	 	},
	 	{	name: "Derek Smith",
	 		course: "KickAss",
	 		grade: "59"
	 	}
		];
	 	self.updateData();
	 }

	self.init();
}

//sort by fields
//form validation
//autocompletion
//server timeout





