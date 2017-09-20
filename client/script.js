var sgt = new SGT();

function SGT() {
	var self = this;
	var student_array = [];
	var sortingState = { name: true, course: true, grade: true };
	var formValidated = false;

	self.init = function() {
		$(document).ready(function() {
			self.eventHandlers();
			self.getStudentData();
		});
	};

	self.eventHandlers = function() {
		$(document).on("keydown", function(e) {
			var key = e.which || e.keyCode;
			if (key === 13) {
				self.clickAdd();
			}
		});
		$(".enterKey").on("click", function() {
			self.clickAdd();
		});
		$(".cancelKey").on("click", function() {
			self.clickCancel();
		});
		$(".getDataKey").on("click", function() {
			self.getStudentData();
		});
		$(".fa-sort--name").on("click", function() {
			self.sortByName();
		});
		$(".fa-sort--course").on("click", function() {
			self.sortByCourse();
		});
		$(".fa-sort--grade").on("click", function() {
			self.sortByGrade();
		});
		$("#studentName, #course_name, #studentGrade").on("focus", function() {
			self.validateForm();
			if (
				$(this)
					.parent()
					.hasClass("has-error")
			) {
				$(this)
					.parent()
					.removeClass("has-error");
				$(".input-errors")
					.removeClass("alert alert-danger")
					.html("");
			}
		});
	};

	// Form function
	self.addStudent = function() {
		var name = $("#studentName")
			.val()
			.trim();
		var course_name = $("#course_name")
			.val()
			.trim();
		var grade = $("#studentGrade")
			.val()
			.trim();
		var studentObj = {
			name,
			course_name,
			grade
		};
		student_array.push(studentObj);
		return studentObj;
	};

	self.clickAdd = function() {
		self.validateForm();
		if (formValidated) {
			var student = self.addStudent();
			self.addStudentDB(student);
			self.updateStats();
			self.clearStudentForm();
			$("#studentName").focus();
			formValidated = false;
			$(".input-errors")
				.removeClass("alert alert-danger")
				.html("");
		} else {
			self.indicateFormError();
		}
	};

	self.clickCancel = function() {
		self.clearStudentForm();
		$("#studentName").focus();
		$(".input-errors")
			.removeClass("alert alert-danger")
			.html("");
	};

	self.clearStudentForm = function() {
		$("input").val("");
		$("#studentName, #course_name, #studentGrade")
			.parent()
			.removeClass("has-error");
	};

	self.validateForm = function() {
		var name = $("#studentName")
			.val()
			.trim();
		var course = $("#course_name")
			.val()
			.trim();
		var grade = $("#studentGrade")
			.val()
			.trim();
		if (!(name === "") && !(course === "") && !isNaN(parseInt(grade))) {
			formValidated = true;
		}
	};

	self.indicateFormError = function() {
		var $name = $("#studentName");
		var $course = $("#course_name");
		var $grade = $("#studentGrade");
		var name = $name.val().trim();
		var course = $course.val().trim();
		var grade = $grade.val().trim();
		if (!name) {
			$name.parent().addClass("has-error");
			$name.attr("placeholder", "Please enter a student name");
			var alert = $("<p>").html("Please enter a student name.");
			$(".input-errors")
				.addClass("alert alert-danger")
				.append(alert);
		}
		if (isNaN(parseInt(grade))) {
			$grade.attr("placeholder", "Please enter a grade");
			$grade.parent().addClass("has-error");
			var alert = $("<p>").html("Please enter a grade.");
			$(".input-errors")
				.addClass("alert alert-danger")
				.append(alert);
		}
		if (!course) {
			$course.attr("placeholder", "Please enter a course name");
			$course.parent().addClass("has-error");
			var alert = $("<p>").html("Please enter a course name.");
			$(".input-errors")
				.addClass("alert alert-danger")
				.append(alert);
		}
	};

	// Stats Update
	self.updateStats = function() {
		average = self.calculateAverage(student_array);
		if (isNaN(average)) {
			average = 0;
		}
		$(".avgGrade").text(average);
		self.updateStudentList();
	};

	self.calculateAverage = function(arr) {
		var average = 0;
		student_array.forEach(function(student) {
			average += parseFloat(student.grade);
		});
		average = average / student_array.length;
		return average.toFixed(2);
	};

	// Database Interaction
	self.getStudentData = function() {
		student_array = [];
		$.ajax({
			method: "GET",
			dataType: "json",
			url: "/get",
			success: function(response) {
				if (response) {
					response.forEach(function(el) {
						student_array.push(el);
					});
				}
				self.updateStats();
				console.log("Student data retrieved: success");
			},
			error: function(err) {
				throw err;
			}
		});
	};

	self.addStudentDB = function(student) {
		$.ajax({
			method: "POST",
			dataType: "json",
			url: "/create",
			data: {
				name: student.name,
				course_name: student.course_name,
				grade: student.grade
			},
			success: function(response) {
				console.log("Student data post: success");
			},
			error: function(err) {
				console.log("Student data post: error", err);
			}
		});
	};

	self.deleteStudentDB = function(studentObj) {
		$.ajax({
			method: "POST",
			dataType: "json",
			url: "/delete",
			data: {
				id: studentObj.id
			},
			success: function(response) {
				console.log("Student data delete: success");
				var index = student_array.indexOf(studentObj);
				student_array.splice(index, 1);
			},
			error: function(err) {
				console.log("Student data delete: error");
			}
		});
	};

	// DOM Manipulation
	self.updateStudentList = function() {
		$("tbody").text("");
		for (var i = 0; i < student_array.length; i++) {
			self.addStudentToDom(student_array[i]);
		}
	};

	self.addStudentToDom = function(studentObj) {
		var tableRow = $("<tr>").addClass("row");
		var tName = $("<td>").text(studentObj.name);
		var tCourse = $("<td>").text(studentObj.course_name);
		var tGrade = $("<td>").text(studentObj.grade);
		var tDelete = $("<td>");
		var tButton = $("<button>", {
			class: "btn btn-danger",
			text: "Delete"
		});
		(function() {
			tButton.on("click", function() {
				self.deleteStudentDB(studentObj);
				tableRow.remove();
			});
		})();
		tDelete.append(tButton);
		tableRow.append(tName, tCourse, tGrade, tDelete);
		$(".student-list tbody").append(tableRow);
	};

	self.sortByName = function() {
		if (sortingState.name) {
			sortingState.name = !sortingState.name;
			student_array.sort(function(a, b) {
				var nameA = a.name.toUpperCase();
				var nameB = b.name.toUpperCase();
				if (nameA < nameB) {
					return -1;
				}
				if (nameA > nameB) {
					return 1;
				}
				return 0;
			});
		} else {
			sortingState.name = !sortingState.name;
			student_array.sort(function(a, b) {
				var nameA = a.name.toUpperCase();
				var nameB = b.name.toUpperCase();
				if (nameA < nameB) {
					return 1;
				}
				if (nameA > nameB) {
					return -1;
				}
				return 0;
			});
		}
		self.updateStudentList();
	};

	self.sortByCourse = function() {
		if (sortingState.course) {
			sortingState.course = !sortingState.course;
			student_array.sort(function(a, b) {
				var courseA = a.course_name.toUpperCase();
				var courseB = b.course_name.toUpperCase();
				if (courseA < courseB) {
					return -1;
				}
				if (courseA > courseB) {
					return 1;
				}
				return 0;
			});
		} else {
			sortingState.course = !sortingState.course;
			student_array.sort(function(a, b) {
				var courseA = a.course_name.toUpperCase();
				var courseB = b.course_name.toUpperCase();
				if (courseA < courseB) {
					return 1;
				}
				if (courseA > courseB) {
					return -1;
				}
				return 0;
			});
		}
		self.updateStudentList();
	};

	self.sortByGrade = function() {
		if (sortingState.grade) {
			sortingState.grade = !sortingState.grade;
			student_array.sort(function(a, b) {
				var gradeA = a.grade;
				var gradeB = b.grade;
				if (gradeA < gradeB) {
					return 1;
				}
				if (gradeA > gradeB) {
					return -1;
				}
				return 0;
			});
		} else {
			sortingState.grade = !sortingState.grade;
			student_array.sort(function(a, b) {
				var gradeA = a.grade;
				var gradeB = b.grade;
				if (gradeA < gradeB) {
					return -1;
				}
				if (gradeA > gradeB) {
					return 1;
				}
				return 0;
			});
		}
		self.updateStudentList();
	};

	self.init();
}
