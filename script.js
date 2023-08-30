// document.addEventListener("DOMContentLoaded", function() {
//     var dropdown = document.getElementById("dropdown1");
//     var today = new Date();
//     var dayOfWeek = today.getDay();

//     if (dayOfWeek === 0 || dayOfWeek === 6) {  // 0 = Sunday, 6 = Saturday
//         for (var i = 0; i < dropdown.options.length; i++) {
//             if (dropdown.options[i].text === 'Weekly') {
//                 dropdown.selectedIndex = i;
//                 break;
//             }
//         }
//     }
// });


function toggleAboutText() {
    var x = document.getElementById("aboutText");
    if (x.style.display === "none") {
        x.style.display = "block";
    } else {
        x.style.display = "none";
    }
}

document.addEventListener("DOMContentLoaded", function() {
    let currentPage = 1;
    const rowsPerPage = 20; // Each row in your CSV results in 5 rows in the table, so this essentially gets 4 original CSV rows per page
    let allData = [];
    let filteredData = [];  // Declare it here
    function sortByBacklinks(a, b) {
        var dropdownValue = document.getElementById('dropdown4').value;

        if (dropdownValue === 'Popularity') {
            return b["L"] - a["L"]; // This sorts in descending order
        } else if (dropdownValue === 'Newest') {
            var dateA = a["datetime_email_date"] ? new Date(a["datetime_email_date"]) : new Date('9999-12-31T23:59:59Z');
            var dateB = b["datetime_email_date"] ? new Date(b["datetime_email_date"]) : new Date('9999-12-31T23:59:59Z');
            return dateB - dateA;
        }
    
        return 0;
    }
    
    // Use PapaParse to read and process the CSV data
    Papa.parse('02a-summarised-w-seo-csv.csv', {
        download: true,
        header: true,
        complete: function(results) {
            allData = results.data.filter(r => r && r['Topic summary'] && r['Topic summary'].trim() !== '');
            filteredData = allData; // Set filteredData to allData initially
            filteredData.sort(sortByBacklinks); // Sorting the initial data
            populateTable(filteredData, 0);
            generatePagination(filteredData.length);
            
            filterDataByDate();  // This will update the filteredData according to today's date
        }
    });

    function formatDate(cellDateStr, cellDateTimeStr) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetting the time part, considering only the date part
        
        const msInAMinute = 60 * 1000;
        const msInAnHour = 60 * msInAMinute;
        const msInADay = 24 * msInAnHour;
    
        if (cellDateTimeStr) {
            // Recognize the new format
            const regexFull = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})([+-]\d{2}:\d{2})/;
            const matchFull = cellDateTimeStr.match(regexFull);
    
            if (matchFull) {
                const [_, year, month, day, hour, minute, second, tz] = matchFull;
                const sign = tz[0];
                const tzHour = Number(tz.substr(1, 2));
                const tzMinute = Number(tz.substr(4, 2));
                
                // Convert the cellDateTime to the UTC time considering the timezone offset
                const utcCellDateTime = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
                utcCellDateTime.setHours(utcCellDateTime.getHours() - (sign === '+' ? tzHour : -tzHour));
                utcCellDateTime.setMinutes(utcCellDateTime.getMinutes() - (sign === '+' ? tzMinute : -tzMinute));
               
                const currentTime = new Date();
                const minutesDifference = (currentTime - utcCellDateTime) / msInAMinute;
                
                if (minutesDifference <= 60) {
                    if (minutesDifference <= 1) {
                        return "Just now";
                    }
                    return `${Math.round(minutesDifference)} minutes ago`;
                }
            
                const hoursDifference = minutesDifference / 60;
                if (hoursDifference <= 24) {
                    return `${Math.round(hoursDifference)} hours ago`;
                }
            }
        }
        
        if (!cellDateStr) return "Invalid Date";  // Added this check here.
    
        // For dates that are older than 24 hours, just display them as days, months etc. as before.
        const [day, month, year] = cellDateStr.split("/");
        const cellDate = new Date(year, month - 1, day);
        const daysDifference = Math.round((today - cellDate) / msInADay);
        
        if (daysDifference === 1) {
            return "1 day ago";
        } else if (daysDifference < 30) {
            return `${daysDifference} days ago`;
        } else {
            const months = Math.ceil(daysDifference / 30);
            return `${months} mo. ago`;
        }
    }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    function setInnerRowPadding(tdElement) {
        tdElement.style.padding = "7px";  // You can adjust the value of padding as per your requirements
        tdElement.style.paddingLeft = "15px";   // Set the left padding
        tdElement.style.paddingRight = "15px";  // Set the right padding
    }



    function populateTable(data, start) {
        let table = document.getElementById('data-table');
        table.innerHTML = ""; // clear previous content
    
        let slicedData = data.slice(start, start + rowsPerPage);

        if (slicedData.length === 0) {
            console.log('No data to populate the table');
        }


        if (data.length === 0) {
            // Create a row and cell
            let messageRow = document.createElement('tr');
            let messageCell = document.createElement('td');
        
            // Set the message and colspan
            messageCell.style.textAlign = 'center';
            messageCell.textContent = "As of yet, there's no news for today! Please filter by 'Weekly' or check out yesterday's news!";
            
            messageCell.colSpan = 5; // or however many columns your table has
        
            // Append the message cell to the message row
            messageRow.appendChild(messageCell);
        
            // Append the message row to the table
            table.appendChild(messageRow);
        
            // Apply margin to the entire table
            table.style.marginTop = '10%'; // or whatever value you want
            return;
        } else {
            table.style.marginTop = '0'; // reset margin to original value
        }
        

    
        slicedData.forEach((row, rowIndex) => {
                    // Create a tbody for each 'X'
            let tbody = document.createElement('tbody');
            setInnerRowPadding(tbody)
            tbody.style.border = "0px solid #000";  // Give it a border
            tbody.style.background = "#FFFFFF";
             // Set background color to white

             // Add the border to the last 'tr' of each group (i.e., the 'tr' for 'L' / SEO Stats in your example)

            // Add above space

            let trSpacer1 = document.createElement('tr');
            let tdSpacer1 = document.createElement('td');
            tdSpacer1.style.height = "10px";  // Adjust this value as needed

            trSpacer1.appendChild(tdSpacer1);
            table.appendChild(trSpacer1);
            //console.log('Before formatting:', row.Date, row.datetime_email_date);

            // Format the date
            let formattedDate = formatDate(row.Date, row.datetime_email_date);
            
            // Create row for 'Date'
            let trDate = document.createElement('tr');
            let td = document.createElement('td');
            
            setInnerRowPadding(td);
            td.classList.add('date-formatted');
            td.textContent = formattedDate;
            td.style.paddingTop = "20px";
            
            trDate.appendChild(td);
            table.appendChild(trDate);

            // Create row for 'Topic summary'
            let trTopicSummary = document.createElement('tr');
            let tdTopic = document.createElement('td');
            tdTopic.innerHTML = row['Topic summary'];
            setInnerRowPadding(tdTopic);  // Apply the padding function
            trTopicSummary.appendChild(tdTopic);
            table.appendChild(trTopicSummary);
            

            // Create row for 'Associated Links'
            let trLinks = document.createElement('tr');
            let tdLinks = document.createElement('td');
            setInnerRowPadding(tdLinks);
            // tdLinks.style.paddingLeft = "0";  
            

            // Parse the string array
            let links;
            function safeJSONParse(str) {
                try {
                    return JSON.parse(str); // Try parsing as is
                } catch (e1) {
                    try {
                        return JSON.parse(str.replace(/'/g, "\"")); // Try replacing single quotes
                    } catch (e2) {
                        console.error("Failed to parse string in both attempts:", str, "Errors:", e1.message, e2.message);
                        return null;
                    }
                }
            }
            
            // Usage
            links = safeJSONParse(row['Associated Links']);
            // Check if links were successfully parsed
            if (links && Array.isArray(links)) {
                links.forEach((link, index) => {
                    // Create a wrapper div for each link
                    let linkWrapper = document.createElement('div');
                    
                    // Create a span for the number
                    let numberSpan = document.createElement('span');
                    numberSpan.textContent = `${index + 1}. `;
                    numberSpan.style.fontSize = '12px';         // Match the font size of the link
                    numberSpan.style.color = 'black';            // White color for the number
                    numberSpan.style.fontWeight = "bold";        // Bold weight

                    // Append the number span to the wrapper
                    linkWrapper.appendChild(numberSpan);
                    
                    // Remove the protocol and 'www.' prefix, then split by '/' to isolate the domain
                    let domainName = link.replace(/(https?:\/\/)?(www\.)?/, '').split('/')[0];
                    // Construct the desired display URL
                    let displayLink = domainName + "";
                    // Create a link element
                    let linkElement = document.createElement('a');
                    linkElement.href = link;
                    linkElement.target = "_blank";  // Open in a new tab
                    linkElement.textContent = displayLink;
                    // Style the link
                    linkElement.style.fontSize = '12px';         // Small font size
                    linkElement.style.color = '#1F77B4';         // Default text color
                    linkElement.style.padding = '5px 0px';       // Some padding
                    linkElement.style.paddingRight = "15px";
                    linkElement.style.borderRadius = '20px';     // Rounded corners
                    linkElement.style.marginRight = '0px';
                    linkElement.style.fontWeight = "bold"; 
                    linkElement.style.textDecoration = "none";   // Remove underline
                    
                    // Append the link to the wrapper
                    linkWrapper.appendChild(linkElement);
                    
                    // Append the wrapper to the td
                    tdLinks.appendChild(linkWrapper);
                });
            }

            

            trLinks.appendChild(tdLinks);
            table.appendChild(trLinks);





            // Create row for 'Category'
            let trCategory = document.createElement('tr');
            let tdCategory = document.createElement('td');
            setInnerRowPadding(tdCategory);
            let categories = row.Category.slice(1, -1).split(',').map(item => item.trim().slice(1, -1));

            //console.log(row.Category, typeof row.Category);

            // Loop through the category array and format each category
            categories.forEach(cat => {
                let span = document.createElement('span');
                
                // Convert and format category for class name
                let className = cat.toLowerCase().replace(/ /g, '-');
                span.className = `category ${className}`;
                
                // Capitalize each word for display, with a special case for 'AI'
                let displayCat = cat.split(/[\s-]/).map(word => {   // Split on spaces or hyphens
                    if (word.toLowerCase() === 'ai') {
                        return 'AI';  // Special case for the word 'AI'
                    }
                    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
                }).join(' ').replace(/ - /g, '-');  // Rejoin with spaces, then replace spaced hyphens with just hyphens
                
                // Set the text content
                span.textContent = displayCat;
                span.style.marginBottom = "5px"; // or any value you see fit

                
                // Append to the table cell
                tdCategory.appendChild(span);
            });

            trCategory.appendChild(tdCategory);
            table.appendChild(trCategory);






                        
            // Create row for 'L'
            let trSeoStats = document.createElement('tr');
            let tdSeoStats = document.createElement('td');
            setInnerRowPadding(tdSeoStats);

            // Format the number from 'L'
            let formattedNumber;
            if (row.L || row.L === 0) {
                if (!row.L && row.L !== 0) {
                    //trSeoStats.style.height = "1px"; // Set the row height to 1px
                    //trSeoStats.style.visibility = "hidden"; // Hide the content of the row
                    formattedNumber = '-'; 
                } else if (row.L < 1000) {
                    formattedNumber = parseInt(row.L);
                } else if (row.L >= 1000 && row.L < 10000) {
                    formattedNumber = `${(row.L / 1000).toFixed(1)}K`;
                } else if (row.L >= 10000 && row.L < 1000000) {
                    formattedNumber = `${Math.round(row.L / 1000)}K`;
                } else if (row.L >= 1000000 && row.L < 10000000) {
                    formattedNumber = `${(row.L / 1000000).toFixed(1)}M`;
                } else {
                    formattedNumber = `${Math.round(row.L / 1000000)}M`;
                }
                

                // Combined span for the link icon and the formatted number with shared background
                let combinedSpan = document.createElement('span');
                combinedSpan.style.background = "#3EB489";
                combinedSpan.style.padding = "8px 10px";
                combinedSpan.style.borderRadius = "20px";
                combinedSpan.style.color = "white";
                combinedSpan.style.lineHeight = "2.5";

                let linkIcon = document.createTextNode('🔗 ');  // Using a text node to keep them together
                combinedSpan.appendChild(linkIcon);

                let spanNumber = document.createElement('span');
                spanNumber.textContent = formattedNumber;
                combinedSpan.appendChild(spanNumber);

                // Tooltip for the combined span
                combinedSpan.title = "Backlinks are incoming links to a webpage. They serve as a proxy for content quality and popularity in SEO metrics.";

                // Appending elements to the tdSeoStats
                tdSeoStats.appendChild(combinedSpan);
        }
            tdSeoStats.style.fontSize = "11px";  // Setting the font size
            tdSeoStats.style.fontWeight = "bold";
            tdSeoStats.style.color = "white";
            tdSeoStats.style.paddingBottom = "20px";

            // Append the table cell to the row, and then append the row to the table
            trSeoStats.appendChild(tdSeoStats);
            table.appendChild(trSeoStats);






            
            tbody.appendChild(trDate);
            tbody.appendChild(trTopicSummary);
            tbody.appendChild(trLinks);
            tbody.appendChild(trCategory);
            tbody.appendChild(trSeoStats);
            
            table.appendChild(tbody);

            // check if this is the last element in slicedData
            if (rowIndex < slicedData.length - 1) {
                // Spacer is outside of the tbody
                let trSpacer = document.createElement('tr');
                let tdSpacer = document.createElement('td');
                tdSpacer.style.height = "10px";
                tdSpacer.style.borderBottom = "1px solid rgb(230, 230, 230)";
                tdSpacer.style.backgroundColor = "transparent";
        
                trSpacer.appendChild(tdSpacer);
                table.appendChild(trSpacer);
            }



        });
    }

        function extractMonthYearFromDate(dateString) {
        const [day, month, year] = dateString.split("/");
        return `${month}/${year}`;
    }
    
    function filterDataByMonth(monthIndex) {
        // Convert the monthIndex to a string format like "01/2023"
        const monthString = (`0${monthIndex}`).slice(-2) + "/2023";
    
        // Filter the data by the selected month
        return filteredData.filter(row => extractMonthYearFromDate(row.Date) === monthString); // return the filtered data
    }

    function generatePagination(totalLength) {
        let paginationContainer = document.getElementById("pagination");
        paginationContainer.innerHTML = ""; // Clear previous pagination

        let totalPages = Math.ceil(totalLength / rowsPerPage);

        for (let i = 1; i <= totalPages; i++) {
            let pageBtn = document.createElement("button");
            pageBtn.textContent = i;
            pageBtn.onclick = function() {
                currentPage = i;
                populateTable(filteredData, (i-1) * rowsPerPage);
                generatePagination(filteredData.length);
            };

            if (currentPage === i) {
                pageBtn.classList.add("active");
            }

            paginationContainer.appendChild(pageBtn);
        }
    }


    //Start dropdown stuff
    const dropdown1 = document.getElementById('dropdown1');
    const dropdown2 = document.getElementById('dropdown2');
    const dropdown3 = document.getElementById('dropdown3');
    const dropdown4 = document.getElementById('dropdown4');
    
    updateDropdown2();
    dropdown2.addEventListener('change', filterDataByDate);
    dropdown3.addEventListener('change', filterDataByDate);
    dropdown4.addEventListener('change', filterDataByDate);


    function filterDataByDate() {
        filteredData = [...allData]; // Start with all the data. Using spread syntax to ensure we get a new array
        
    
        // Check if we're in the 'Daily' mode
        if (dropdown1.value === 'Daily') {
            const selectedDate = new Date(dropdown2.value);
            const currentDate = new Date();  // Current date and time
            const twentyFourHoursAgo = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000));  // Time 24 hours ago
            const thirtySixHoursAgo = new Date(currentDate.getTime() - (24 * 60 * 60 * 1000)); // replace the 24 with 36 here 

        
            //console.log("Selected Date:", selectedDate);
            //console.log("Current Date:", currentDate);
            //console.log("24 Hours Ago:", twentyFourHoursAgo);
        
            // Check if selectedDate is the same as the current date
            if (
                selectedDate.getDate() === currentDate.getDate() &&
                selectedDate.getMonth() === currentDate.getMonth() &&
                selectedDate.getFullYear() === currentDate.getFullYear()
            ) {
                // Filter rows from the last 24 hours
                filteredData = filteredData.filter(row => {
                    
                    if (!row.datetime_email_date) {
                        //console.log("Row with missing datetime_email_date", row);
                        return false;  // Exclude rows with missing datetime_email_date
                    }
                        
                    // Extract the date, time, and timezone offset parts
                    const [datePart, timeWithZonePart] = row.datetime_email_date.split(' ');
                    const [year, month, day] = datePart.split('-').map(Number);  // Adjusted here
                    const [timePart, timezonePart] = timeWithZonePart.split('+');
                    const [hour, minute, second] = timePart.split(':').map(Number);

                    const timezoneOffsetMinutes = (timezonePart) ? 
                                                (parseInt(timezonePart.substr(0,3), 10) * 60) + 
                                                parseInt(timezonePart.substr(3,2), 10) : 
                                                0;

                    // Construct a Date object for datetime_email_date using individual components
                    const emailDateTime = new Date(Date.UTC(year, month - 1, day, hour, minute, second) - timezoneOffsetMinutes*60*1000);

                    //console.log("Row datetime_email_date:", row.datetime_email_date);
                    //console.log("Constructed EmailDateTime:", emailDateTime);

                    return emailDateTime > thirtySixHoursAgo;
                });
            } else {
                const formattedDate = `${('0' + selectedDate.getDate()).slice(-2)}/${('0' + (selectedDate.getMonth() + 1)).slice(-2)}/${selectedDate.getFullYear()}`;
                filteredData = filteredData.filter(row => row.Date === formattedDate);
            }
        
        
        
        
        
        
        
        
        
        
        
        
        
        } else if (dropdown1.value === 'Weekly') {
            const selectedWeekStartDate = dropdown2.value;
            filteredData = filteredData.filter(row => row.wc_date === selectedWeekStartDate);
        } else if (dropdown1.value === 'Monthly') {
            filteredData = filterDataByMonth(dropdown2.value);
        }
    
        if (dropdown3.value !== "All Categories") {
            const normalizedDropdownValue = dropdown3.value.toLowerCase().replace(/-/g, ' ');
            filteredData = filteredData.filter(row => {
                const categories = row.Category.slice(1, -1).split(',').map(item => 
                    item.trim().slice(1, -1).toLowerCase().replace(/-/g, ' ')
                );
                return categories.includes(normalizedDropdownValue);
            });
        }
        filteredData.sort(sortByBacklinks);
        if (filteredData.length === 0) {
            console.log('No data after filtering');
        }
        
        populateTable(filteredData, 0);
        generatePagination(filteredData.length);
    }




    
    dropdown1.addEventListener('change', updateDropdown2);

    function updateDropdown2() {
        
        dropdown2.innerHTML = ''; // Clear previous options
        switch (dropdown1.value) {
            case "Daily":
                populateDaily();
                
                // After populating daily options, filter the data by the default (current) date.
                filterDataByDate();
                break;
            case "Weekly":
                populateWeekly();
                filterDataByDate();
                break;
            case "Monthly":
                populateMonthly();
                filterDataByDate();
                break;
        }
    }

    function populateDaily() {
        let today = new Date();
        today.setHours(0, 0, 0, 0); // Remove time for accurate comparisons
        let startDate = new Date(2023, 3, 1); 
        while(today >= startDate) {
            let option = new Option(`${today.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`, today.toISOString());
            dropdown2.add(option);
            today.setDate(today.getDate() - 1);
        }
    }

    function populateWeekly() {
        let currentDate = new Date(); // Today's date (automatically gets the current date)
        let dayOfWeek = currentDate.getUTCDay();
    
        // Adjust the current date to the beginning of the current week (i.e., Monday)
        currentDate.setUTCDate(currentDate.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    
        let firstMondayOfYear = new Date(currentDate.getFullYear(), 0, 2); // Get the first Monday of the current year
    
        let weekCommencingDates = []; // Array to hold all week commencing dates
        
        while (currentDate >= firstMondayOfYear) {
            weekCommencingDates.push(new Date(currentDate)); // Push the current week commencing date to the array
            currentDate.setDate(currentDate.getDate() - 7); // Go back one week
        }
    
        // Loop through the array in its current order so the most recent week commencing date is added first
        for(let date of weekCommencingDates) {
            let optionText = date.toLocaleDateString('en-GB'); // Format the date
            dropdown2.add(new Option(optionText, optionText)); // Add to dropdown
        }
    
        // Explicitly set the most recent week as the default option
        dropdown2.value = weekCommencingDates[0].toLocaleDateString('en-GB');
    }
    
    
    
    

    function populateMonthly() {
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let today = new Date();
        let month = today.getMonth();
        while (month >= 0) {
            dropdown2.add(new Option(`${months[month]} 2023`, month + 1));
            month--;
        }
    }


    





    


    

    
});


