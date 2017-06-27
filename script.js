$(document).ready(function(){
	enterKeyStudent();
})

/**
 * Define all global variables here
 */
/**
 * student_array - global array to hold student objects
 * @type {Array}
 */ var student_array = [
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
 */ var inputIds = ["studentName","course","studentGrade","operation"];

/**
 * addClicked - Event Handler when user clicks the add button
 */
 function addClicked() {
	// Need faster way of checking if all inputs !== ""
 	// if( $("#studentName").val() !== "" && $("#course").val() !== "" && 
		// $("#studentGrade").val() !== "" ) {
		 	var student = addStudent();
		 	addStudentData(addStudent());
		 	updateData();
		 	clearAddStudentForm();
		 	$("#studentName").focus();
 	// }
 }


/**
 * cancelClicked - Event Handler when user clicks the cancel button, should clear out student form
 */
 function cancelClicked() {
 	clearAddStudentForm();
 }

/**
 * addStudent - creates a student objects based on input fields in the form and adds the object to global student array
 *
 * @return undefined
 */
 function addStudent() {
 	var studentName = $("#"+inputIds[0]).val();
 	var studentCourse = $("#"+inputIds[1]).val();
 	var studentGrade = $("#"+inputIds[2]).val();
 	var studentObj = {
 		name: studentName,
 		course: studentCourse,
 		grade: studentGrade

 	};
 	student_array.push(studentObj);
 	return studentObj;
 }

// Adds event listener for enter key - adds student. 
// Reduces mouse movement to and fro adding student data
 function enterKeyStudent(){ 
 	$(document).on("keydown",function(e){
		var key = e.which || e.keyCode;
		if(key === 13){
			addClicked()
		}
	})
 }

/**
 * clearAddStudentForm - clears out the form values based on inputIds variable
 */
 function clearAddStudentForm() {
 	$("input").val('');
 }

/**
 * calculateAverage - loop through the global student array and calculate average grade and return that value
 * @returns {number}
 */
 function calculateAverage(arr) {
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
 function updateData() {
 	average = calculateAverage(student_array);
 	if(isNaN(average)){
 		average = 0;
 	}
 	$(".avgGrade").text(average);
 	updateStudentList();
 }

function getStudentData() {
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

function addStudentData(studentObj){
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

function deleteStudentData(studentObj){
	$.ajax({
		method: "POST",
		dataType: "json",
		url: "http://s-apis.learningfuze.com/sgt/delete",
		data: {
			api_key: "Pr0R1gXBEt",
			student_id: studentObj.id
		},
		success: function(response){
			if(response.error === "true"){
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
 function updateStudentList() {
 	$("tbody").text("");
 	for(var i=0;i<student_array.length;i++){
 		addStudentToDom(student_array[i]);
 	}
 }

/**
 * addStudentToDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param studentObj*/

function addStudentToDom(studentObj) {
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
	 			deleteStudentData(studentObj);
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
 function reset(){
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
 	updateData();
 }


/**
 * Listen for the document to load and reset the data to the initial state
 */
 $(document).ready(function(){
 	reset();
 })