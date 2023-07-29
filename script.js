const table = document.getElementById("myTable");
const pagination = document.getElementById("pagination");
const buttonsContainer = document.querySelector(".buttons-container");
const rowsPerPage = 5;
let data = [];

async function getData() {
  const response = await fetch("03a-summarised-w-seo-csv.csv");
  const csvData = await response.text();
  const parsedData = parseCSV(csvData);

  // Sort the data based on the 'L' column in descending order (biggest numbers first)
  parsedData.sort((a, b) => b["L"] - a["L"]);

  data = parsedData;

  // Get the maximum week number in the data
  const maxWeekNumber = Math.max(...data.map(row => +row["Week Number"]));

  return maxWeekNumber;
}


function parseCSV(csvData) {
  const parsedData = Papa.parse(csvData, { header: true, skipEmptyLines: true });
  return parsedData.data;
}

async function displayRows(pageNum, filteredData) {
  const startIndex = (pageNum - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredData.length);

  table.innerHTML = ""; // Clear existing rows

  // Insert column headings into the table
  const columnHeadings = ["Description", "Links", "Rank"];
  const headerRow = document.createElement("tr");
  columnHeadings.forEach((heading) => {
    const th = document.createElement("th");
    th.textContent = heading;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  for (let i = startIndex; i < endIndex; i++) {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${filteredData[i]["Topic summary"]}</td>
                     <td>${generateLinkList(filteredData[i]["Associated Links"])}</td>
                     <td>${filteredData[i]["L"]}</td>`;
    table.appendChild(row);
  }
}

function generateLinkList(links) {
  const linkList = links
    .slice(1, -1) // Remove the square brackets from the string
    .split(", ") // Convert the comma-separated string into an array
    .slice(0, 9) // Take only the first 9 links
    .map((link, index) => {
      return `${index + 1}. <a href="${link}">${extractLinkText(link)}</a>`; // Include the link number
    });

  const numRows = Math.ceil(linkList.length / 3);

  let tableB = "<table class='inner-table'>"; // Add the 'inner-table' class here

  for (let i = 0; i < 3; i++) {
    tableB += "<tr>";

    for (let j = 0; j < numRows; j++) {
      const index = j * 3 + i; // Change the index calculation to populate along columns

      if (index < linkList.length) {
        tableB += "<td>" + linkList[index] + "</td>";
      } else {
        tableB += "<td></td>";
      }
    }

    tableB += "</tr>";
  }

  tableB += "</table>";

  return tableB;
}

function extractLinkText(link) {
  const match = link.match(/(?:https?:\/\/)?(?:www\.)?([^./]+)\./i);
  const linkText = match ? match[1] : link;
  return linkText.charAt(0).toUpperCase() + linkText.slice(1);
}

function populatePagination(numPages) {
  let paginationHTML = "";
  for (let i = 1; i <= numPages; i++) {
    paginationHTML += `<a href="#" onclick="gotoPage(${i})">${i}</a>`;
  }

  pagination.innerHTML = paginationHTML;
}

function generateWeekButtons() {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  const currentWeek = getWeekNumber(new Date()); // Get the current week number
  const numWeeksToShow = 5; // Number of weeks to show in the buttons
  let startingWeek = Math.max(1, currentWeek - numWeeksToShow + 1);
  startingWeek = Math.min(startingWeek, currentWeek);

  let buttonsHTML = "";

  if (startingWeek > 1) {
    buttonsHTML += `<div class="week-button-container">
                      <button class="arrow-button" onclick="showPreviousWeeks(${startingWeek - 1})"><<</button>
                    </div>`;
  }

  const endingWeek = startingWeek + numWeeksToShow - 1; // Calculate the ending week number

  for (let i = startingWeek; i <= endingWeek; i++) {
    buttonsHTML += `<div class="week-button-container">
                      <button class="week-button ${i === currentWeek ? 'active' : ''}" onclick="filterByWeekNumber(${i})">${i}</button>
                    </div>`;
  }

  if (currentWeek !== endingWeek && currentWeek !== getWeekNumber(new Date(endingWeek + 1))) {
    buttonsHTML += `<div class="week-button-container">
                      <button class="arrow-button" onclick="showNextWeeks(${endingWeek + 1})">>></button>
                    </div>`;
  }

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}















// Function to show the previous weeks
function showCurrentWeeks() {
  const numWeeksToShow = 5; // Number of weeks to show in the buttons
  const currentWeek = getWeekNumber(new Date()); // Get the current week number
  const startingWeek = Math.max(1, currentWeek - numWeeksToShow + 1); // Calculate the starting week number to show
  const endingWeek = currentWeek; // The ending week number to show is the current week number

  generateWeekButtonsInRange(startingWeek, endingWeek);
}

function showNextWeeks(startingWeek) {
  const currentWeek = getWeekNumber(new Date()); // Get the current week number

  // Check if the starting week is less than the current week before proceeding
  if (startingWeek + 5 <= currentWeek) {
    const numWeeksToShow = 5; // Number of weeks to show in the buttons
    const endingWeek = Math.min(startingWeek + numWeeksToShow - 1, currentWeek); // Calculate the ending week number to show
    generateWeekButtonsInRange(startingWeek, endingWeek);
  }
}

function showPreviousWeeks(startingWeek) {
  const numWeeksToShow = 5; // Number of weeks to show in the buttons
  const endingWeek = Math.max(1, startingWeek); // Calculate the ending week number to show
  const newStartingWeek = Math.max(1, endingWeek - numWeeksToShow + 1); // Calculate the new starting week number

  generateWeekButtonsInRange(newStartingWeek, endingWeek);
}


function generateWeekButtonsInRange(startingWeek, endingWeek) {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  let buttonsHTML = "";

  // Get the current week number
  const currentWeek = getWeekNumber(new Date());

  // Add the left arrow button (<<) to go back one week
  if (startingWeek > 1) {
    buttonsHTML += `<div class="week-button-container">
                      <button class="arrow-button" onclick="showPreviousWeeks(${startingWeek - 1})"><<</button>
                    </div>`;
  }

  for (let i = startingWeek; i <= Math.min(endingWeek, currentWeek); i++) {
    // Generate button for each week
    buttonsHTML += `<div class="week-button-container">
                      <button class="week-button ${i === currentWeek ? 'active' : ''}" data-week="${i}" onclick="filterByWeekNumber(${i})">${i}</button>
                    </div>`;
  }

  // Add the right arrow button (>>) to go forward one week
  // Only if the current week number is greater than the ending week number
  if (endingWeek < currentWeek) {
    buttonsHTML += `<div class="week-button-container">
                      <button class="arrow-button" onclick="showNextWeeks(${endingWeek + 1})">>></button>
                    </div>`;
  }

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}




// Helper function to get the week number of a date
function getWeekNumber(date) {
  // Calculate the number of days between the date and the first day of the year
  const oneJan = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date - oneJan) / 86400000);

  // Calculate the number of days between the date and the nearest Monday
  const nearestMonday = (date.getDay() + 6) % 7;
  const daysFromMonday = dayOfYear + nearestMonday;

  // Calculate the week number (1-based) by dividing the total days by 7
  const weekNum = Math.ceil(daysFromMonday / 7);

  return weekNum;
}


function filterByWeekNumber(weekNumber) {
  const activeButtons = document.querySelectorAll(".week-button.active");
  activeButtons.forEach((button) => button.classList.remove("active"));

  // Add the 'active' class to the clicked button
  const clickedButton = document.querySelector(`.week-button[data-week="${weekNumber}"]`);
  clickedButton.classList.add("active");

  // Update the "Weekly" button state to always be active
  const weeklyButton = document.querySelector(".weekly-button");
  weeklyButton.classList.add("active");

  // Filter the data and display the rows
  const filteredData = data.filter((row) => +row["Week Number"] === weekNumber); // convert string to number
  displayRows(1, filteredData);
}



// Month Stuff

// Function to generate buttons for a range of months
function generateMonthButtonsInRange(startingMonth, endingMonth) {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  let buttonsHTML = "";

  const currentMonth = new Date().getMonth() + 1; // Get the current month number

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  if (startingMonth > 1) {
    buttonsHTML += `<div class="month-button-container">
                      <button class="arrow-button" onclick="showPreviousMonths(${startingMonth - 1})"><<</button>
                    </div>`;
  }

  for (let i = startingMonth; i <= endingMonth; i++) {
    buttonsHTML += `<div class="month-button-container">
                      <button class="month-button ${i === currentMonth ? 'active' : ''}" data-month="${i}" onclick="filterByMonthNumber(${i})">${months[i - 1]}</button>
                    </div>`;
  }

  // Display next arrow only if the ending month is less than the current month
  if (endingMonth < currentMonth) {
    buttonsHTML += `<div class="month-button-container">
                      <button class="arrow-button" onclick="showNextMonths(${startingMonth + 1})">>></button>
                    </div>`;
  }

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}

// Function to show next months
function showNextMonths(startingMonth) {
  const currentMonth = new Date().getMonth() + 1;
  // Check if starting month is less than the current month before proceeding
  if (startingMonth < currentMonth) {
    generateMonthButtonsInRange(startingMonth, Math.min(startingMonth + 5, currentMonth));
  }
}



function filterByMonthNumber(monthNumber) {
  // Apply the 'active' class to the clicked button and remove it from others
  document.querySelectorAll(".month-button.active").forEach((button) => {
    button.classList.remove("active");
  });

  document.querySelector(`.month-button[data-month="${monthNumber}"]`).classList.add("active");

  // Filter your data by the selected month
  console.log(`Data is filtered by month number: ${monthNumber}`);
}

// Functions to show previous and next months
function showPreviousMonths(startingMonth) {
  const newStartingMonth = Math.max(1, startingMonth - 5); // Do not go back beyond January
  generateMonthButtonsInRange(newStartingMonth, startingMonth);
}


function showNextMonths(startingMonth) {
  const currentMonth = new Date().getMonth() + 1; // Get the current month number
  const newEndingMonth = Math.min(currentMonth, startingMonth + 5); // Do not go forward beyond the current month
  generateMonthButtonsInRange(startingMonth, newEndingMonth);
}


// New function to handle the click on the type of period
function switchPeriodType(periodType) {
  // Remove 'active' class from all period buttons and add it to the clicked one
  document.querySelectorAll(".period-button.active").forEach((button) => {
    button.classList.remove("active");
  });

  document.querySelector(`.period-button[data-period="${periodType}"]`).classList.add("active");

  // Depending on the period type, generate week or month buttons
  const currentWeek = getWeekNumber(new Date());
  const currentMonth = new Date().getMonth() + 1;

  if (periodType === "weekly") {
    generateWeekButtonsInRange(currentWeek - 2, currentWeek + 2);
  } else if (periodType === "monthly") {
    const startingMonth = Math.max(1, currentMonth - 2); // Do not go back beyond January
    const endingMonth = Math.min(12, currentMonth + 2); // Do not go forward beyond December
    generateMonthButtonsInRange(startingMonth, endingMonth);
  }
}






function setupPagination() {
  getData().then((maxWeekNumber) => {
    // Populate the week buttons container with the maximum week number
    generateWeekButtonsInRange(maxWeekNumber - 4, maxWeekNumber);

    const numPages = Math.ceil(data.length / rowsPerPage);
    populatePagination(numPages);
    displayRows(1, data);
    
    // Make the "Weekly" button active by default
    const weeklyButton = document.querySelector(".weekly-button");
    weeklyButton.classList.add("active");

    // Generate the week buttons as per the "Weekly" button by default
    generateWeekButtons();
  });
}



function gotoPage(pageNum) {
  displayRows(pageNum, data);
}

function deactivateAllButtons() {
  const buttons = buttonsContainer.querySelectorAll("button");
  buttons.forEach((button) => {
    button.classList.remove("active");
  });
}

buttonsContainer.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    deactivateAllButtons();
    event.target.classList.add("active");

    const buttonText = event.target.textContent.trim();
    switch (buttonText) {
      case "Weekly":
        // Add your logic for the Weekly button here
        break;
      case "Monthly":
        // Add your logic for the Monthly button here
        break;
      case "Quarterly":
        // Add your logic for the Quarterly button here
        break;
      case "Biannually":
        // Add your logic for the Biannually button here
        break;
      case "Yearly":
        // Add your logic for the Yearly button here
        break;
      default:
        break;
    }
  }
});

setupPagination();
