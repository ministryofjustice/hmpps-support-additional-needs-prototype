//
// For guidance on how to create filters see:
// https://prototype-kit.service.gov.uk/docs/filters
//

const govukPrototypeKit = require('govuk-prototype-kit')
const addFilter = govukPrototypeKit.views.addFilter

// Add your filters here

addFilter('nl2br', function(str) {
    return str.replace(/\r|\n|\r\n/g, '<br />')
})

addFilter('toGovDate', function(str) {

    const thisdate = new Date(str);

    const monthNames = ["Jan", "Feb", "Mar", "Apr",
                        "May", "Jun", "Jul", "Aug",
                        "Sep", "Oct", "Nov", "Dec"];
    
    const day = thisdate.getDate();
    
    const monthIndex = thisdate.getMonth();
    const monthName = monthNames[monthIndex];
    
    const year = thisdate.getFullYear();
    
    return `${day} ${monthName} ${year}`;

})

addFilter('dateReplaceSlash', function (str) {

    const dateArray = str.split("/");

    const monthNames = ["Jan", "Feb", "Mar", "Apr",
                        "May", "Jun", "Jul", "Aug",
                        "Sep", "Oct", "Nov", "Dec"];

    const monthNumber = parseInt(dateArray[1]) - 1;
                    
    const monthName = monthNames[monthNumber];
    
    return `${dateArray[0]} ${monthName} ${dateArray[2]}`;
})