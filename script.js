document.addEventListener("DOMContentLoaded", function() {
    let currentPage = 1;
    const rowsPerPage = 20; // Each row in your CSV results in 5 rows in the table, so this essentially gets 4 original CSV rows per page
    let allData = [];
    let filteredData = [];  // Declare it here
    function sortByBacklinks(a, b) {
        return b["L"] - a["L"]; // This sorts in descending order
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


    function formatDate(cellDateStr) {
        if (!cellDateStr) return "Invalid Date"; 
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Resetting the time part, considering only the date part
    
        const [day, month, year] = cellDateStr.split("/");
        const cellDate = new Date(year, month - 1, day);
    
        const msInADay = 24 * 60 * 60 * 1000;
        const daysDifference = Math.round((today - cellDate) / msInADay);
    
        if (daysDifference === 0) {
            return "Today";
        } else if (daysDifference < 30) {
            return `${daysDifference} days ago`;
        } else {
            const months = Math.ceil(daysDifference / 30);  // Using Math.ceil to round up
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
    
        slicedData.forEach((row, rowIndex) => {
                    // Create a tbody for each 'X'
            let tbody = document.createElement('tbody');
            setInnerRowPadding(tbody)
            tbody.style.border = "0px solid #000";  // Give it a border
            tbody.style.background = "#38333e";
             // Set background color to white

             // Add the border to the last 'tr' of each group (i.e., the 'tr' for 'L' / SEO Stats in your example)

            // Add above space

            let trSpacer1 = document.createElement('tr');
            let tdSpacer1 = document.createElement('td');
            tdSpacer1.style.height = "10px";  // Adjust this value as needed

            trSpacer1.appendChild(tdSpacer1);
            table.appendChild(trSpacer1);
            // Format the date
            let formattedDate = formatDate(row.Date);
            
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
            try {
                links = JSON.parse(row['Associated Links'].replace(/'/g, "\""));
            } catch (e) {
                console.error("Failed to parse links:", row['Associated Links']);
            }
            // Check if links were successfully parsed
            if (links && Array.isArray(links)) {
                links.forEach((link, index) => {
                    // Extract the desired part of the URL
                    let withoutHttps = link.replace('https://', '');
                    let extractedPart = withoutHttps.startsWith('www.') ? withoutHttps.split('www.')[1].split('.')[0] : withoutHttps.split('.')[0];
                    
                    // Capitalize the first letter
                    let capitalizedPart = extractedPart.charAt(0).toUpperCase() + extractedPart.slice(1);

                    // Create a link element
                    let linkElement = document.createElement('a');
                    linkElement.href = link;
                    linkElement.target = "_blank";  // Open in a new tab
                    linkElement.textContent = `${index + 1}. ${capitalizedPart}`;

                    // Style the link
                    linkElement.style.fontSize = '10px';         // Small font size
                    linkElement.style.color = '#6767bf';              // Default text color
                    linkElement.style.padding = '5px 0px';      // Some padding
                    linkElement.style.paddingRight = "15px";
                    linkElement.style.borderRadius = '20px';     // Rounded corners
                    linkElement.style.marginRight = '0px';      // Some spacing between links if there are multiple

                    // Append the link to the td
                    tdLinks.appendChild(linkElement);
                });
            }

            trLinks.appendChild(tdLinks);
            table.appendChild(trLinks);





            // Create row for 'Category'
            let trCategory = document.createElement('tr');
            let tdCategory = document.createElement('td');
            setInnerRowPadding(tdCategory);
            let categories = row.Category.slice(1, -1).split(',').map(item => item.trim().slice(1, -1));

            console.log(row.Category, typeof row.Category);

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
            if (!row.L && row.L !== 0) {
                formattedNumber = 'N/A';
                
                // Log the row to console to inspect its data
                console.log('Row with N/A value for L:', row);
                
            } else if (row.L < 1000) {
                formattedNumber = row.L;
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
            combinedSpan.style.background = "#5f5179";
            combinedSpan.style.padding = "8px 10px";
            combinedSpan.style.borderRadius = "20px";
            combinedSpan.style.color = "white";
            combinedSpan.style.lineHeight = "2.5";

            let linkIcon = document.createTextNode('🔗');  // Using a text node to keep them together
            combinedSpan.appendChild(linkIcon);

            let spanNumber = document.createElement('span');
            spanNumber.textContent = formattedNumber;
            combinedSpan.appendChild(spanNumber);

            // Tooltip for the combined span
            combinedSpan.title = "Backlinks are incoming links to a webpage. They serve as a proxy for content quality and popularity in SEO metrics.";

            // Appending elements to the tdSeoStats
            tdSeoStats.appendChild(combinedSpan);
            tdSeoStats.style.fontSize = "11px";  // Setting the font size
            tdSeoStats.style.fontWeight = "bold";
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
    
            // Spacer is outside of the tbody
            let trSpacer = document.createElement('tr');
            let tdSpacer = document.createElement('td');
            tdSpacer.style.height = "10px";  // Adjust this value as needed
            tdSpacer.style.borderBottom = "1px solid rgb(50, 50, 50)"; // Spacer's border color
            tdSpacer.style.backgroundColor = "transparent"; // Make sure it's transparent

            
            trSpacer.appendChild(tdSpacer);
            table.appendChild(trSpacer);



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
    
    updateDropdown2();
    dropdown2.addEventListener('change', filterDataByDate);
    dropdown3.addEventListener('change', filterDataByDate);
    function filterDataByDate() {
        filteredData = [...allData]; // Start with all the data. Using spread syntax to ensure we get a new array
        
    
        // Check if we're in the 'Daily' mode
        if (dropdown1.value === 'Daily') {
            const selectedDate = new Date(dropdown2.value);
            const formattedDate = `${('0' + selectedDate.getDate()).slice(-2)}/${('0' + (selectedDate.getMonth() + 1)).slice(-2)}/${selectedDate.getFullYear()}`;
            filteredData = filteredData.filter(row => row.Date === formattedDate);
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


