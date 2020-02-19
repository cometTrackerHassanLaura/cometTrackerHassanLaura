// app object
const cometApp = {};

// using regex to add commas to numbers - imported from stackoverflow https://stackoverflow.com/questions/3883342/add-commas-to-a-number-in-jquery
cometApp.commaSeparateNumber = function(val) {
    while (/(\d+)(\d{3})/.test(val.toString())) {
        val = val.toString().replace(/(\d+)(\d{3})/, '$1' + ',' + '$2');
    }
    return val;
};

// event listeners

// planet selection listener
cometApp.selectListener = function() {
    $('.closestObjFlex').empty();
    const userChoice = $(this).children('option:selected').text();
    const userChoiceVal = $('#body').val();

    const pendingRespone = cometApp.ajaxCall(userChoice, userChoiceVal); 
    
    pendingRespone.then(function(result) {
    
        cometApp.displayDefaultBodyResults(result, userChoice, userChoiceVal);

    })
};

// collect user input date
cometApp.$minDateInput = $('#min-date');
cometApp.$maxDateInput = $('#max-date');

// date form listener 
cometApp.formListener = function(e){
    e.preventDefault();
    if ($('option:selected').val() !== 'planet') {
        $('.dateSearchResults').empty();
        const userInputMinDate = cometApp.$minDateInput.val();
        const userInputMaxDate = cometApp.$maxDateInput.val();
    
        const userChoice = $(this).children("option:selected").text();
        const userChoiceVal = $('#body').val();   

        const minDate = userInputMinDate ? userInputMinDate : 'now';
        const maxDate = userInputMaxDate ? userInputMaxDate : '+60';
    
        const pendingRespone = cometApp.ajaxCall(userChoice, userChoiceVal, minDate, maxDate); 
    
        pendingRespone.then(function(result) {
        cometApp.displayDateResults(result, minDate, maxDate);
    
    })
        
    }else{
        const errorToAppend = `<h3>please choose a planet first</h3>`;
        $('.dateSearchResults').append(errorToAppend);
    }
}

// Display planet object search  
cometApp.displayDefaultBodyResults = function (result, planetName, planetValue) {
    if (result.count === '0') {
        const htmlToAppend = `<h3>No results for ${planetName} at this time</h3>`;
        $('.closestObjFlex').append(htmlToAppend);
    } else {

        // creating a new array containing the first 3 results of the original array
        const $filteredObjects = result.data.slice(0, 3);

        // appending h3 to container div
        if (result.count === '1') {
            const h3ToAppend = `<h3>Closest ${$filteredObjects.length} object</h3>`;
            $('.closestObjFlex').append(h3ToAppend);
        } else {
            const h3ToAppend = `<h3>Closest ${$filteredObjects.length} objects</h3>`;
            $('.closestObjFlex').append(h3ToAppend);
        }

        // looping over the new filtered array using the .forEach method
        $filteredObjects.forEach(function (currentVal, i) {
            const $convertedDistance = $filteredObjects[i][4] * 149597871;
            const $commaSeperatedDistance = cometApp.commaSeparateNumber($convertedDistance.toFixed(0));

            const htmlToAppend = `
                <ul>
                    <li>
                        <p>Name: ${$filteredObjects[i][11]}</p>
                        <p>Approach date: ${$filteredObjects[i][3]}</p></li>
                        <p>Distance from ${planetName}: ${$commaSeperatedDistance} km </p>
                    </li>
                </ul>
                `;
            $('.closestObjFlex').append(htmlToAppend);
            // end of forEach method
        });
        // end of else condition
    }
}

// Display date search results 
cometApp.displayDateResults = function(result, minDate, maxDate) {
    const $filteredObjects = result.data.slice(0, 15);
    console.log($filteredObjects);

    // looping over the new filtered array using the .forEach method
    $filteredObjects.forEach(function (currentVal, i) {

        const $convertedDistance = $filteredObjects[i][4] * 149597871;
        const $commaSeperatedDistance = cometApp.commaSeparateNumber($convertedDistance.toFixed(0));

        const htmlToAppend = `
            <ul style="color:white;">
                <li>
                    <p>Name: ${$filteredObjects[i][11]}</p>
                    <p>Approach date: ${$filteredObjects[i][3]}</p>
                    <p>Distance: ${$commaSeperatedDistance} km</p>
                </li>
            </ul>
            `;
        $('.dateSearchResults').append(htmlToAppend);
        // end of forEach method
    });
    $('select').change(function() {
        $('.dateSearchResults').empty();
    });
}


// AJAX call function
cometApp.ajaxCall = function(planetName, planetValue, minDate, maxDate) {
    // start of AJAX call
    return $.ajax({
        url: `https://ssd-api.jpl.nasa.gov/cad.api`,
        method: 'GET',
        dataType: 'json',
        data: {
            fullname: true,
            body: planetValue,
            'date-min': minDate,
            'date-max': maxDate,
        } 
    })
};


cometApp.init = function () {
    $('select').change(cometApp.selectListener);
    $('form').on('submit', cometApp.formListener);
}
    
$(() => {
    cometApp.init();
});
