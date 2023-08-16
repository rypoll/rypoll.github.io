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
}





// Define function to convert month number to three-letter abbreviation
function monthNumberToName(monthNumber) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return months[monthNumber - 1];
}

// Modify the generateMonthButtonsInRange function to use this new function
function generateMonthButtonsInRange(startingMonth, endingMonth) {
  const dynamicButtonsContainer = document.querySelector(".dynamic-buttons-container");
  const currentMonth = getCurrentMonth(new Date());
  let buttonsHTML = "";

  if (startingMonth > 1) {
    buttonsHTML += `<div class="month-button-container">
                        <button class="arrow-button" onclick="showPreviousMonths(${startingMonth - 1})">↑</button>
                    </div>`;
  }

  for (let i = startingMonth; i <= endingMonth; i++) {
    buttonsHTML += `<div class="month-button-container">
                        <button class="month-button ${i === currentMonth ? 'active' : ''}" data-month-number="${i}" onclick="filterByMonthNumber(${i})">${monthNumberToName(i)}</button>
                    </div>`;
  }

  buttonsHTML += `<div class="month-button-container">
                      <button class="arrow-button ${endingMonth >= currentMonth ? 'invisible' : ''}" onclick="showNextMonths(${startingMonth + 1})">↓</button>
                  </div>`;

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}






function showPreviousMonths(startingMonth) {
  const numMonthsToShow = 5;
  const endingMonth = Math.min(startingMonth + numMonthsToShow - 1, getCurrentMonth(new Date()));

  generateMonthButtonsInRange(startingMonth, endingMonth);
}

function showNextMonths(startingMonth) {
  const numMonthsToShow = 5;
  const endingMonth = Math.min(startingMonth + numMonthsToShow - 1, getCurrentMonth(new Date()));

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
                        <button class="arrow-button" onclick="showPreviousMonths(${startingMonth - 1})">↑</button>
                    </div>`;
  }

  for (let i = startingMonth; i <= currentMonth; i++) {
    buttonsHTML += `<div class="month-button-container">
                        <button class="month-button ${i === currentMonth ? 'active' : ''}" data-month-number="${i}" onclick="filterByMonthNumber(${i})">${monthNumberToName(i)}</button>
                    </div>`;
  }

  buttonsHTML += `<div class="month-button-container">
                      <button class="arrow-button ${currentMonth >= currentMonth ? 'invisible' : ''}" onclick="showNextMonths(${startingMonth + 1})">↓</button>
                  </div>`;

  dynamicButtonsContainer.innerHTML = buttonsHTML;
}





function showCurrentMonths() {
  const numMonthsToShow = 5; 
  const currentMonth = getCurrentMonth(new Date()); 
  const startingMonth = Math.max(1, currentMonth - numMonthsToShow + 1);

  generateMonthButtonsInRange(startingMonth, currentMonth);
}


