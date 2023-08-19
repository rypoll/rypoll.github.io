function getCurrentMonth(d) {
  d = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  return d.getUTCMonth() + 1; // +1 because months are zero-based in JavaScript
}



function filterByMonthNumber(monthNumber) {
  const filteredData = data.filter(row => {
    // Extract month from the 'wc_date' column
    const month = row['Date'].split('/')[1];
    return month === String(monthNumber).padStart(2, '0'); // Convert monthNumber to string and pad with leading zero if necessary
  });

  filteredData.sort((a, b) => b["L"] - a["L"]);

  const numPages = Math.ceil(filteredData.length / rowsPerPage);

  displayRows(1, filteredData);
  populatePagination(numPages);

  const buttons = document.querySelectorAll('.month-button');
  buttons.forEach(button => {
    button.classList.remove('active');
    if (+button.dataset.monthNumber === monthNumber) {
      button.classList.add('active');
    }
  });
  adjustTableToFit();
}





// Define function to convert month number to three-letter abbreviation
function monthNumberToName(monthNumber) {
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  return months[monthNumber - 1];
}

// Modify the generateMonthButtonsInRange function to use this new function
function generateMonthButtonsInRange(startingMonth, endingMonth) {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  const currentMonth = getCurrentMonth(new Date());
  let buttonsHTML = "";

  const downArrowClass = startingMonth <= 1 ? 'disabled' : '';
  buttonsHTML += `<div class="month-button-container">
                      <button class="arrow-button ${downArrowClass}" onclick="showPreviousMonths(${startingMonth - 1})">↓</button>
                  </div>`;

  for (let i = startingMonth; i <= endingMonth; i++) {
    buttonsHTML += `<div class="month-button-container">
                        <button class="month-button ${i === currentMonth ? 'active' : ''}" data-month-number="${i}" onclick="filterByMonthNumber(${i})">${monthNumberToName(i)}</button>
                    </div>`;
  }

  const upArrowClass = endingMonth >= currentMonth ? 'disabled' : '';
  buttonsHTML += `<div class="month-button-container">
                      <button class="arrow-button ${upArrowClass}" onclick="showNextMonths(${startingMonth + 1})">↑</button>
                  </div>`;

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}








function showPreviousMonths(startingMonth) {
  const numMonthsToShow = 5;

  if (startingMonth < 1) return;

  const endingMonth = Math.min(startingMonth + numMonthsToShow - 1, getCurrentMonth(new Date()));
  generateMonthButtonsInRange(startingMonth, endingMonth);
}


function showNextMonths(startingMonth) {
  const numMonthsToShow = 5;
  const currentMonth = getCurrentMonth(new Date());

  // If starting month + 5 (i.e., next set of months) would surpass the current month,
  // we should start from currentMonth - 4 to just display previous 5 months without changing the count.
  if (startingMonth + numMonthsToShow - 1 > currentMonth) {
    startingMonth = currentMonth - numMonthsToShow + 1;
  }

  const endingMonth = Math.min(startingMonth + numMonthsToShow - 1, currentMonth);
  generateMonthButtonsInRange(startingMonth, endingMonth);
}








function generateMonthButtons() {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  const currentMonth = getCurrentMonth(new Date());
  const numMonthsToShow = 5;
  let startingMonth = Math.max(1, currentMonth - numMonthsToShow + 1);

  if (currentMonth < numMonthsToShow) {
    startingMonth = 1;
  }

  startingMonth = Math.min(startingMonth, currentMonth);

  let buttonsHTML = "";

  if (startingMonth > 1) {
    buttonsHTML += `<div class="month-button-container">
                        <button class="arrow-button" onclick="showPreviousMonths(${startingMonth - 1})">↓</button>
                    </div>`;
  }

  for (let i = startingMonth; i <= currentMonth; i++) {
    buttonsHTML += `<div class="month-button-container">
                        <button class="month-button ${i === currentMonth ? 'active' : ''}" data-month-number="${i}" onclick="filterByMonthNumber(${i})">${monthNumberToName(i)}</button>
                    </div>`;
  }

  // Add a condition to check if the last button displayed is the current month and add 'disabled' class to up arrow
  buttonsHTML += `<div class="month-button-container">
                      <button class="arrow-button ${currentMonth === startingMonth + numMonthsToShow - 1 ? 'disabled' : ''}" onclick="showNextMonths(${startingMonth + 1})">↑</button>
                  </div>`;

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}





function showCurrentMonths() {
  const numMonthsToShow = 5; 
  const currentMonth = getCurrentMonth(new Date()); 
  const startingMonth = Math.max(1, currentMonth - numMonthsToShow + 1);

  generateMonthButtonsInRange(startingMonth, currentMonth);
}


