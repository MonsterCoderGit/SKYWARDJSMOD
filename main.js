//Split Full Name Logic
const fullName = prompt("Enter the full name:");
let classes = [];
if (fullName !== null) {
    const parts = fullName.trim().split(" ");
    const firstName = parts[0];
    const lastName = parts[2] || parts[1] || "";


    const overallLabel = document.getElementById("sf_StudentLabel");
    if (overallLabel) {
        overallLabel.innerText = fullName;
    }

    // Update all Name elements
    const elements = document.querySelectorAll(".notranslate");
    elements.forEach((element, index) => {
        if (index === 0) return;
        if (index === 1) {
            element.innerText = `${firstName} ${lastName}`;
        } else {
            element.innerText = firstName;
        }
    });

    // Prompt once for default grade
    const defaultGrade = prompt("Please Enter Default Grade For All Edge Cases:", "DEFAULT");
    if (defaultGrade !== null) {

        let term;
        do {
            term = prompt("Enter Term (1, 2, 3, or 4):");
        } while (!['1', '2', '3', '4'].includes(term));
        classes = getHours(parseInt(term) >= 3 ? "B" : "A");
        //grabs all grade boxes
        const gradeElements = document.querySelectorAll(`[id="showGradeInfo"][data-bkt="TERM ${term}"]`);
        gradeElements.forEach((el, index) => {
            if (el) {

                const grade = prompt(`New Grade for hour ${index+1}, ${classes[index].className}:`);
                el.innerText = grade !== null ? grade : defaultGrade;
            } else {
                el.innerText = defaultGrade;
            }
        });
    }
}



function getHours(classType) {
    let timeElements = document.querySelectorAll('.fXs.fWn');
    let classNames = document.querySelectorAll('.bld.classDesc a'); // This will select the educational class names
    let filteredClasses = []; // Array to store filtered results

    // Make sure classType is a valid input and convert it to uppercase for consistency
    classType = classType.toUpperCase();

    if (timeElements.length > 0) {
        timeElements.forEach((element, index) => {
                let timeText = element.textContent.trim(); // Get the time content
                let className = classNames[index] ? classNames[index].textContent.trim() : "Class Name Not Found"; // Get the corresponding class name

                // Check for A/S1 classes, matching A or S2
                if ((classType === 'A' || classType === 'S1') && (className.endsWith('A') || className.endsWith('S2'))) {
                    filteredClasses.push({
                        index,
                        time: timeText,
                        className
                    });
                }
                // Check for B/S2 classes, matching B or S2
                else if ((classType === 'B' || classType === 'S2') && (className.endsWith('B') || className.endsWith('S2'))) {
                    filteredClasses.push({
                        index,
                        time: timeText,
                        className
                    });
                } else if (className.endsWith('8')){
                    let istaking = prompt("Y/N, are you currently taking " + className + "?");
                    if (istaking == "Y") {
                        filteredClasses.push({
                            index,
                            time: timeText,
                            className
                        });
                        console.log("Pushed Manuel Class");
                    }
                };
        });
    }
        else {
            console.log("No elements found");
        }

        return filteredClasses;
    }

