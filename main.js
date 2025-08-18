alert(`
    ============================
              SkyHack
    ============================
    
        Written & Edited By:
            Logan Engle
    ============================
`);

alert("⚠️ DISCLAIMER ⚠️\n\nThis tool is for harmless pranks and light-hearted fun only.\nDo not use it to deceive, harm, or mislead anyone.");


//Split Full Name Logic


let schedule = {
	"8:05 AM - 8:55 AM": 1,
	"9:00 AM - 9:50 AM": 2,
	"9:55 AM - 10:45 AM": 3,
	"10:50 AM - 11:40 AM": 4,
	"11:45 AM - 12:58 PM": 5, // Lunch A (Lunch)
	"1:03 PM - 1:25 PM": 6,
	"1:30 PM - 2:20 PM": 7,
	"2:25 PM - 3:15 PM": 8, // MTSS
};


let changeTeacher = prompt("Y/N, Change Teacher Info?") == "Y" ? true : false;
let doGenMissingAssignments = prompt("Y/N, Synthesize Missing Assignments?") == "Y" ? true : false;
let changeGrades = prompt("Y/N, Change Grades?") == "Y" ? true : false;

//name changing
let fullName = prompt("Enter the full name:").trim() || "N A N";
let classes = [];
let missingAssignmentsTable = document.getElementById("grid_missingAssignmentsModule")

let firstName;
let lastName;

if (fullName !== null) {
	let parts = fullName.trim().split(" ");
	firstName = parts[0];
	lastName = parts[2] || parts[1] || "";


	let overallLabel = document.getElementById("sf_StudentLabel");
	if (overallLabel) {
		overallLabel.innerText = fullName;
	}

	// Update all Name elements
	let elements = document.querySelectorAll(".notranslate");
	elements.forEach((element, index) => {
		if (index === 0) return;
		if (index === 1) {
			element.innerText = `${firstName} ${lastName}`;
		} else {
			element.innerText = firstName;
		}
	});
}
// Prompt once for default grade
if (changeGrades) {
	let defaultGrade = prompt("Please Enter Default Grade For All Edge Cases:", "DEFAULT");
	if (defaultGrade !== null) {
		let term;
		do {
			term = prompt("Enter Term (1, 2, 3, or 4):");
		} while (!['1', '2', '3', '4'].includes(term));
		classes = getHours(parseInt(term) >= 3 ? "S2" : "S1");
		//grabs all grade boxes
		let gradeElements = document.querySelectorAll(`[id="showGradeInfo"][data-bkt="TERM ${term}"]`);
        let secondGradeElements = document.querySelectorAll(`[id="showGradeInfo"][data-bkt="TERM ${parseInt(term) == 4 ? 3 : parseInt(term)+1}"]`)
		let semGradeElements = document.querySelectorAll((`[id="showGradeInfo"][data-bkt="SEM ${parseInt(term) >= 3 ? "2" : "1"}"]`));
		gradeElements.forEach((el, index) => {
			if (el) {

				let grade = prompt(`New Grade for hour ${index+1}, ${classes[index].className}:`, el.innerText);
				el.innerText = grade !== null ? grade : defaultGrade;
                secondGradeElements[index].innerText = grade !== null ? grade : defaultGrade;
				semGradeElements[index].innerText = grade !== null ? grade : deafaultGrade;
			} else {
				el.innerText = defaultGrade;
			}
		});
	}
}

if (changeTeacher) {
	classes.forEach((el) => {
		changeTeacherInfo(el.classNameElement);
	})
}

if (doGenMissingAssignments) {
	genMissingAssignments()
}


function getHours(classType) {
	let timeElements = Array.from(document.querySelectorAll('.fXs.fWn'));
    timeElements.splice(0, 2);
	let classNames = document.querySelectorAll('.bld.classDesc a'); // This will select the educational class names
    console.log(timeElements);
	let filteredClasses = []; // Array to store filtered results

	// Make sure classType is a valid input and convert it to uppercase for consistency
	classType = classType.toUpperCase();

	if (timeElements.length > 0) {
		timeElements.forEach((element, index) => {
			let timeText = element.textContent.trim(); // Get the time content
			let className = classNames[index] ? classNames[index].textContent.trim() : "Class Name Not Found"; // Get the corresponding class name

			// Check for A/S1 classes, matching A or S2
			if ((classType === 'A' || classType === 'S1') && (className.endsWith('A') || className.endsWith('S1'))) {
				filteredClasses.push({
					index,
					time: timeText,
					className,
					classNameElement: classNames[index]
				});
			}
			// Check for B/S2 classes, matching B or S2
			else if ((classType === 'B' || classType === 'S2') && (className.endsWith('B') || className.endsWith('S2'))) {
				filteredClasses.push({
					index,
					time: timeText,
					className,
					classNameElement: classNames[index]
				});
			} else if ((/[9A-Za-z]$/.test(className))) {
				let istaking = prompt("Y/N, are you currently taking " + className + " for hour " + (schedule[timeText.replace(/[()]/g, "")] !== undefined ? schedule[timeText.replace(/[()]/g, "")] : "") + "?");
				if (istaking.toUpperCase() == "Y") {
					filteredClasses.push({
						index,
						time: timeText,
						className,
						classNameElement: classNames[index]
					});
					console.log("Pushed Manuel Class");
				}
			};
		});
	} else {
		console.log("No elements found");
	}

	return filteredClasses;
}


function changeTeacherInfo(classDescElement) {
	// Go two levels up: <span class="bld classDesc"> -> <td> -> <tr>
	let classRow = classDescElement.closest("tr");
	if (!classRow) return null;

	// Then navigate to the parent <tbody> and get all <tr> children
	let tbody = classRow.parentElement;
	let rows = tbody.querySelectorAll("tr");


	//indexes are magic numbers, deal with it.
	rows[0].children[1].children[0].children[0].innerText = prompt("Class Name: ", rows[0].innerText)

	//period stuff, really annoyingly formatted. TBD
	//rows[1].innerText = prompt("Period Time Slot: ", rows[1].innerText)

	rows[2].children[0].children[0].innerText = prompt("Teacher Name: ", rows[2].innerText)
}

function promptUserToSelectClass() {
	const classNames = document.querySelectorAll('.bld.classDesc');

	if (classNames.length === 0) {
		alert("No class elements found.");
		return null;
	}

	// Build a numbered list of class names
	let list = "Select a class:\n";
	classNames.forEach((el, i) => {
		list += `${i + 1}: ${el.textContent.trim()}\n`;
	});

	// Prompt user
	let selectedIndex;
	do {
		selectedIndex = parseInt(prompt(list)) - 1;
	} while (isNaN(selectedIndex) || selectedIndex < 0 || selectedIndex >= classNames.length);

	return classNames[selectedIndex];
}

//Genearl Function For User Freindly
function genMissingAssignments() {
	let count;
	do {
		count = prompt("How many Missing Assignments to Add (0 for none): ")
	} while (isNaN(parseInt(count)))
	for (let i = 0; i < count; i++) {
		populateMissingAssignmentsTable(missingAssignmentsTable, firstName, count, prompt(`Due Date For Assignment ${i+1}: `), prompt(`Name For Assignment ${i+1}: `), prompt(`Period For Assignment ${i+1}: `), prompt(`Class Name for Assignment${i+1}: `), prompt(`Teacher Name for Assignment ${i+1}: `), i == 0 ? true : false)
	}
}

//HTML Generator
function populateMissingAssignmentsTable(outerTable, studentName, numMissing, dueDate, assignmentName, period, className, teacherName, init) {



	// Clear only tbody; preserve thead





	// THEAD
	if (init) {
		const thead = document.createElement("thead");
		const headerRow = document.createElement("tr");
		const headerTh = document.createElement("th");
		headerTh.scope = "col";
		headerTh.style.color = "red";
		headerTh.innerHTML = `Missing Assignments &nbsp;
            <font class="fWn">
                <a id="missingAssignments" name="missingAssignments" data-ttxt="Assignments" href="javascript:void(0)">
                    (Show All)
                </a>
            </font>`;
		headerRow.appendChild(headerTh);
		thead.appendChild(headerRow);
		outerTable.appendChild(thead);

		const existingTbody = outerTable.querySelector("tbody");
		if (existingTbody) {
			outerTable.removeChild(existingTbody);
		}
	}
	// TBODY
	const tbody = document.createElement("tbody");

	// Row 1: student summary
		const summaryRow = document.createElement("tr");
		const summaryTd = document.createElement("td");
		summaryTd.scope = "row";

		const scrollDiv = document.createElement("div");
		scrollDiv.style.cssText = "overflow:auto;padding:2px;width:800px;";

		const gridWrap = document.createElement("div");
		gridWrap.className = "gridWrap";
		gridWrap.id = "grid_studentsMissingAssignments_26069_gridWrap";

		const sfWrap = document.createElement("div");
		sfWrap.className = "sf_gridTableWrap";

		const studentTable = document.createElement("table");
		studentTable.setAttribute("vpaginate", "no");
		studentTable.id = "grid_studentsMissingAssignments_26069";
		studentTable.setAttribute("grid-table", "");
		studentTable.setAttribute("zebra", "false");
		studentTable.style.width = "auto";

		const studentTbody = document.createElement("tbody");

		const nameRow = document.createElement("tr");
		const nameTd = document.createElement("td");
		nameTd.scope = "row";
		nameTd.style.paddingRight = "10px";
		nameTd.innerHTML = `${studentName} has <span class="bld" style="color:red;">${numMissing}</span> missing assignment${numMissing === "1" ? "" : "s"}:`;
		nameRow.appendChild(nameTd);
        if(init){
		    studentTbody.appendChild(nameRow);
        }
	
	// Row 2: assignment info
	const assignmentRow = document.createElement("tr");
	const assignmentTd = document.createElement("td");
	assignmentTd.scope = "row";
	assignmentTd.style.paddingLeft = "10px";

	const assignmentGridWrap = document.createElement("div");
	assignmentGridWrap.className = "gridWrap";
	assignmentGridWrap.id = "grid_missingAssignments_26069_gridWrap";

	const assignmentTableWrap = document.createElement("div");
	assignmentTableWrap.className = "sf_gridTableWrap";

	const assignmentTable = document.createElement("table");
	assignmentTable.setAttribute("vpaginate", "no");
	assignmentTable.id = "grid_missingAssignments_26069";
	assignmentTable.setAttribute("grid-table", "");
	assignmentTable.setAttribute("zebra", "false");
	assignmentTable.style.width = "auto";

	const assignmentTbody = document.createElement("tbody");

	const row = document.createElement("tr");

	const labelTd = document.createElement("td");
	labelTd.scope = "row";
	labelTd.className = "fXs fIl";
	labelTd.style.cssText = "padding-top:5px;padding-right:6px;";
	const label = document.createElement("label");
	label.className = "sf_labelRight";
	label.textContent = "Due:";
	labelTd.appendChild(label);

	const dateTd = document.createElement("td");
	dateTd.style.cssText = "padding-top:5px;padding-right:8px;";
	dateTd.textContent = dueDate;

	const detailsTd = document.createElement("td");
	detailsTd.style.paddingTop = "5px";

	const assignmentLink = document.createElement("a");
	assignmentLink.href = "javascript:void(0)";
	assignmentLink.textContent = assignmentName;

	const span = document.createElement("span");
	span.className = "fWn";

	const classLink = document.createElement("a");
	classLink.href = "javascript:void(0)";
	classLink.textContent = className;

	const periodSpan = document.createElement("span");
	periodSpan.className = "fXs";
	periodSpan.innerHTML = `(Period <b>${period}</b>)`;

	const teacherLink = document.createElement("a");
	teacherLink.href = "javascript:void(0)";
	teacherLink.textContent = teacherName;

	span.append(" ");
	span.appendChild(classLink);
	span.append("\u00A0");
	span.appendChild(periodSpan);
	span.append("\u00A0");
	span.appendChild(teacherLink);

	detailsTd.appendChild(assignmentLink);
	detailsTd.append(", ");
	detailsTd.appendChild(span);

	row.appendChild(labelTd);
	row.appendChild(dateTd);
	row.appendChild(detailsTd);
	assignmentTbody.appendChild(row);
	assignmentTable.appendChild(assignmentTbody);
	assignmentTableWrap.appendChild(assignmentTable);
	assignmentGridWrap.appendChild(assignmentTableWrap);
	assignmentTd.appendChild(assignmentGridWrap);
	assignmentRow.appendChild(assignmentTd);
	studentTbody.appendChild(assignmentRow);

	studentTable.appendChild(studentTbody);
	sfWrap.appendChild(studentTable);
	gridWrap.appendChild(sfWrap);
	scrollDiv.appendChild(gridWrap);
	summaryTd.appendChild(scrollDiv);
	summaryRow.appendChild(summaryTd);
	tbody.appendChild(summaryRow);

	outerTable.appendChild(tbody);
}
