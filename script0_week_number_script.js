function getWeekNumber(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  d.setUTCDate(d.getUTCDate() + 4 - (d.getUTCDay() || 7));
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((d - yearStart) / 86400000) + 1) / 7);

  console.log("Week Number:", weekNo); // Add this line to log the week number

  return weekNo;
}


  


function filterByWeekNumber(weekNumber) {
  const filteredData = data.filter(row => +row["Week Number"] === weekNumber);
  filteredData.sort((a, b) => b["L"] - a["L"]);

  const numPages = Math.ceil(filteredData.length / rowsPerPage);

  displayRows(1, filteredData);
  populatePagination(numPages);

  const buttons = document.querySelectorAll('.week-button');
  buttons.forEach(button => {
    button.classList.remove('active');
    if (+button.dataset.week === weekNumber) {
      button.classList.add('active');
    }
  });
}
  


function getWeekLabel(weekNumber) {
  return weekLabels[weekNumber];
}



function generateWeekButtonsInRange(startingWeek, endingWeek) {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  const currentWeek = getWeekNumber(new Date());
  const weekNumbers = Object.keys(weekLabels).map(Number).sort((a, b) => a - b);
  const maxWeekNumber = Math.max(...weekNumbers);
  const minWeekNumber = Math.min(...weekNumbers);
  let buttonsHTML = "";

  if (startingWeek > minWeekNumber) {
    buttonsHTML += `<div class="week-button-container">
                        <button class="arrow-button" onclick="showPreviousWeeks(${startingWeek - 1})"><<</button>
                    </div>`;
  }

  for (let i = startingWeek; i <= endingWeek; i++) {
    // Check if the week number has a corresponding label in weekLabels
    if (weekLabels[i]) {
      buttonsHTML += `<div class="week-button-container">
                        <button class="week-button ${i === currentWeek ? 'active' : ''}" data-week="${i}" onclick="filterByWeekNumber(${i})">${getWeekLabel(i, new Date().getFullYear())}</button>
                    </div>`;
    }
  }

  buttonsHTML += `<div class="week-button-container">
                      <button class="arrow-button ${endingWeek >= maxWeekNumber ? 'invisible' : ''}" onclick="showNextWeeks(${startingWeek + 1})">>></button>
                  </div>`;

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}






// Function to show the previous weeks
function showPreviousWeeks(startingWeek) {
  const numWeeksToShow = 5; // Number of weeks to show in the buttons
  const endingWeek = Math.min(startingWeek + numWeeksToShow - 1, getWeekNumber(new Date())); // Calculate the ending week number to show

  generateWeekButtonsInRange(startingWeek, endingWeek);
}

// Function to show the next weeks
function showNextWeeks(startingWeek) {
  const numWeeksToShow = 5; // Number of weeks to show in the buttons
  const endingWeek = Math.min(startingWeek + numWeeksToShow - 1, getWeekNumber(new Date())); // Calculate the ending week number to show

  generateWeekButtonsInRange(startingWeek, endingWeek);
}





function generateWeekButtons() {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  const currentWeek = getWeekNumber(new Date());
  const weekNumbers = Object.keys(weekLabels).map(Number).sort((a, b) => a - b);
  const maxWeekNumber = Math.max(...weekNumbers);
  const minWeekNumber = Math.min(...weekNumbers);
  const numWeeksToShow = Math.min(5, maxWeekNumber - minWeekNumber + 1);
  let startingWeek = Math.max(minWeekNumber, currentWeek - numWeeksToShow + 1);

  let buttonsHTML = "";

  if (startingWeek > minWeekNumber) {
    buttonsHTML += `<div class="week-button-container">
                        <button class="arrow-button" onclick="showPreviousWeeks(${startingWeek - 1})"><<</button>
                    </div>`;
  }

  for (let i = startingWeek; i <= startingWeek + numWeeksToShow - 1; i++) {
    // Check if the week number has a corresponding label in weekLabels
    if (weekLabels[i]) {
      buttonsHTML += `<div class="week-button-container">
                        <button class="week-button ${i === currentWeek ? 'active' : ''}" data-week="${i}" onclick="filterByWeekNumber(${i})">${getWeekLabel(i, new Date().getFullYear())}</button>
                    </div>`;
    }
  }

  buttonsHTML += `<div class="week-button-container">
                      <button class="arrow-button ${currentWeek >= maxWeekNumber ? 'invisible' : ''}" onclick="showNextWeeks(${startingWeek + numWeeksToShow})">>></button>
                  </div>`;

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}











// Function to show the next weeks

function showCurrentWeeks() {
  const numWeeksToShow = 5;
  const currentWeek = getWeekNumber(new Date());
  const startingWeek = Math.max(1, currentWeek - numWeeksToShow + 1);

  generateWeekButtons(startingWeek, currentWeek);
}

