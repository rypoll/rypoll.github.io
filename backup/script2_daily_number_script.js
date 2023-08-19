function getCurrentDate() {
  const today = new Date();
  let dd = String(today.getUTCDate()).padStart(2, '0');
  let mm = String(today.getUTCMonth() + 1).padStart(2, '0'); 
  let yyyy = today.getUTCFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

function filterByDate(dateStr) {
  const filteredData = data.filter(row => row['Date'] === dateStr);
  filteredData.sort((a, b) => b["L"] - a["L"]);

  const numPages = Math.ceil(filteredData.length / rowsPerPage);

  displayRows(1, filteredData);
  populatePagination(numPages);

  const buttons = document.querySelectorAll('.date-button');
  buttons.forEach(button => {
    button.classList.remove('active');
    if (button.dataset.date === dateStr) {
      button.classList.add('active');
    }
  });
  adjustTableToFit();
}

function stringToDate(dateStr) {
  const [day, month, year] = dateStr.split('/').map(Number);
  return new Date(year, month - 1, day);
}

function dateToString(dateObj) {
  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

function addDaysToDate(dateStr, days) {
  const dateObj = stringToDate(dateStr);
  dateObj.setDate(dateObj.getDate() + days);
  return dateToString(dateObj);
}


function generateDateButtonsInRange(startDateStr, endDateStr) {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  const currentDate = getCurrentDate();
  let buttonsHTML = "";

  const downArrowClass = startDateStr === "01/01/1970" ? 'disabled' : ''; // Using 01/01/1970 as an example lower limit.
  buttonsHTML += `<div class="date-button-container">
                    <button class="arrow-button ${downArrowClass}" onclick="showPreviousDates('${addDaysToDate(startDateStr, -1)}')">↓</button>
                  </div>`;

  for (let d = startDateStr; d !== addDaysToDate(endDateStr, 1); d = addDaysToDate(d, 1)) {
    buttonsHTML += `<div class="date-button-container">
                      <button class="date-button ${d === currentDate ? 'active' : ''}" data-date="${d}" onclick="filterByDate('${d}')">${d}</button>
                    </div>`;
  }

  const upArrowClass = endDateStr === currentDate ? 'disabled' : '';
  buttonsHTML += `<div class="date-button-container">
                    <button class="arrow-button ${upArrowClass}" onclick="showNextDates('${addDaysToDate(startDateStr, 1)}')">↑</button>
                  </div>`;

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}


function showPreviousDates(startDateStr) {
  const numDaysToShow = 5;

  if (startDateStr === "01/01/1970") return;

  const endDateStr = addDaysToDate(startDateStr, numDaysToShow - 1);
  generateDateButtonsInRange(startDateStr, endDateStr);
}

function showNextDates(startDateStr) {
  const numDaysToShow = 5;
  const currentDate = getCurrentDate();

  if (addDaysToDate(startDateStr, numDaysToShow) > currentDate) {
    startDateStr = addDaysToDate(currentDate, -numDaysToShow + 1);
  }

  const endDateStr = addDaysToDate(startDateStr, numDaysToShow - 1);
  generateDateButtonsInRange(startDateStr, endDateStr);
}


function generateDateButtons() {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  const currentDate = getCurrentDate();
  const numDaysToShow = 5;
  let startDateStr = addDaysToDate(currentDate, -numDaysToShow + 1);

  if (startDateStr < "01/01/1970") {
    startDateStr = "01/01/1970"; // Again using 01/01/1970 as a starting example.
  }

  let buttonsHTML = "";

  if (startDateStr !== "01/01/1970") {
    buttonsHTML += `<div class="date-button-container">
                      <button class="arrow-button" onclick="showPreviousDates('${addDaysToDate(startDateStr, -1)}')">↓</button>
                    </div>`;
  }

  for (let d = startDateStr; d !== addDaysToDate(currentDate, 1); d = addDaysToDate(d, 1)) {
    buttonsHTML += `<div class="date-button-container">
                      <button class="date-button ${d === currentDate ? 'active' : ''}" data-date="${d}" onclick="filterByDate('${d}')">${d}</button>
                    </div>`;
  }

  buttonsHTML += `<div class="date-button-container">
                    <button class="arrow-button ${currentDate === addDaysToDate(startDateStr, numDaysToShow - 1) ? 'disabled' : ''}" onclick="showNextDates('${addDaysToDate(startDateStr, 1)}')">↑</button>
                  </div>`;

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}



function showCurrentDates() {
  const numDaysToShow = 5; 
  const currentDate = getCurrentDate(); 
  const startDateStr = addDaysToDate(currentDate, -numDaysToShow + 1);

  generateDateButtonsInRange(startDateStr, currentDate);
}

