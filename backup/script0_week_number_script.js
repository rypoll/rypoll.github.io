document.addEventListener('DOMContentLoaded', function () {
  adjustTableToFit();
  window.addEventListener('resize', adjustTableToFit);
});

document.addEventListener('DOMContentLoaded', function () {
  adjustTableToFit();
  window.addEventListener('resize', adjustTableToFit);
});

function adjustTableToFit() {
  const tableContainer = document.querySelector('.table-container');
  const table = document.querySelector('.table-container table');
  const container4 = document.querySelector('.container-4');
  const paginationHeight = document.getElementById('pagination').offsetHeight;

  if (!tableContainer || !container4 || !table) return;

  const containerHeight = container4.clientHeight - paginationHeight;
  const containerWidth = container4.clientWidth;

  // Set widths to ensure tableContainer and table take up full width of container4
  tableContainer.style.width = `${containerWidth}px`;
  table.style.minWidth = `${containerWidth}px`;  // We're using minWidth to override any intrinsic table width.

  // Set height of the tableContainer to match container-4 height
  tableContainer.style.height = `${containerHeight}px`;

  if (table.scrollHeight > containerHeight) {
      let scaleFactor = containerHeight / table.scrollHeight;
      tableContainer.style.transform = `scale(${scaleFactor})`;
      tableContainer.style.transformOrigin = "left top";
  } else {
      tableContainer.style.transform = 'scale(1)';
  }
}


function resetPagination() {
  currentPage = 1;
  currentStartPage = 1;
  const numPages = Math.ceil(data.length / rowsPerPage); // Assuming data is your dataset; adjust if otherwise
  populatePagination(numPages);
}

function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}




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
  adjustTableToFit();
}
  


function getWeekLabel(weekNumber) {
  const currentWeek = getWeekNumber(new Date());

  if (weekNumber === currentWeek) {
    return "This Week";
  } else if (weekNumber === currentWeek - 1) {
    return "Last Week";
  } else {
    return weekLabels[weekNumber];
  }
}


function generateWeekButtonsInRange(startingWeek, endingWeek) {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  const currentWeek = getWeekNumber(new Date());
  const weekNumbers = Object.keys(weekLabels).map(Number).sort((a, b) => a - b);
  const maxWeekNumber = Math.max(...weekNumbers);
  const minWeekNumber = Math.min(...weekNumbers);
  let buttonsHTML = "";

  const downArrowClass = startingWeek > minWeekNumber ? '' : 'disabled';
  buttonsHTML += `<div class="week-button-container">
                      <button class="arrow-button ${downArrowClass}" onclick="showPreviousWeeks(${startingWeek - 1})">↓</button>
                  </div>`;

  for (let i = startingWeek; i <= endingWeek; i++) {
    if (weekLabels[i]) {
      buttonsHTML += `<div class="week-button-container">
                        <button class="week-button ${i === currentWeek ? 'active' : ''}" data-week="${i}" onclick="filterByWeekNumber(${i})">${getWeekLabel(i, new Date().getFullYear())}</button>
                    </div>`;
    }
  }

  const upArrowClass = endingWeek >= currentWeek ? 'disabled' : '';
  buttonsHTML += `<div class="week-button-container">
                      <button class="arrow-button ${upArrowClass}" onclick="showNextWeeks(${startingWeek + 1})">↑</button>
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

  generateWeekButtonsInRange(startingWeek, startingWeek + numWeeksToShow - 1);
}












// Function to show the next weeks

function showCurrentWeeks() {
  const numWeeksToShow = 5;
  const currentWeek = getWeekNumber(new Date());
  const startingWeek = Math.max(1, currentWeek - numWeeksToShow + 1);

  generateWeekButtons(startingWeek, currentWeek);
}

