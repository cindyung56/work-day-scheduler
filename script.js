// VARIABLES

var timeblockContainer = $(".container");
var currentDay = $("#currentDay");

var currentHour = moment().format("h");
var currentAPM = moment().format("A");

var eventsArray;


// FUNCTIONS

// initialize page on load/refresh
// grab localStorage and update all blocks with whatever is in there
function init(){
    setInterval(function(){
        currentDay.text(moment().format("dddd, MMMM D, YYYY hh:mm A"));
    }, 1000);
    
    eventStorage();
    createTimeblocks();
    updateTimeblocks();
}

// get events from localStorage, if there are no events then just initialize the array
function eventStorage(){
    eventsArray = JSON.parse(localStorage.getItem("events"));
    if (eventsArray === null){
        eventsArray = [];
        localStorage.setItem("events", JSON.stringify(eventsArray));
    }
}

// create the timeblocks with timestamps
function createTimeblocks(){
    var time = 9;
    var APM = "AM";

    
    // 9am - 5pm is 9 blocks in total
    for (var i = 0; i < 9; i++){
        //each time block is a row
        var hourRow = $("<div>");
        hourRow.attr("class", "row time-block");

        // hour block includes the time and spans a column of size 1
        var hourBlock = $("<div>");
        var hourBlockTime = time + APM;
        hourBlock.attr("class", "hour col-1");
        hourBlock.text(hourBlockTime);

        // event block is a textarea and spans 10 columns
        var eventBlock = $("<textarea>");
        eventBlock.attr("class", "col-10");
        // the blocks will be different colors based on current time
        if(currentHour+currentAPM === time+APM){
            eventBlock.addClass("present");
        } 
        else if (
            ((currentAPM === "PM" && APM === "AM")) ||
            (currentAPM === APM && parseInt(currentHour) > time && parseInt(currentHour) !== 12) ||
            (time === 12 && currentAPM === "PM") 
        ){
            eventBlock.addClass("past");
        } 
        else if (
            parseInt(time) > parseInt(currentHour) && time !== 12 || 
            (currentHour === 12 && currentAPM == "PM" && APM === "PM") ||
            (APM === "PM" && currentAPM == "AM") ||
            (parseInt(currentHour) === 12 && currentAPM === "AM")
        ){
            eventBlock.addClass("future");
        }

        // save block includes a save icon and spans a column of size 1
        var saveBlock = $("<div>");
        saveBlock.attr("class", "col-1 saveBtn");
        saveBlock.append('<i class="fa fa-save"></i>'); //adds save icon to the div

        // append all three sections to the row
        hourRow.append(hourBlock);
        hourRow.append(eventBlock);
        hourRow.append(saveBlock);

        // add each row to the timeblockContainer
        timeblockContainer.append(hourRow);

        // change 11AM to 12PM
        if(time === 11){
            APM = "PM";
        }

        // change 12 to 1, if not then just increase by 1
        if (time === 12){
            time = 1;
        } else{
            time++;
        }
    }
}

// parse localStorage and update values of textboxes with previously saved events
function updateTimeblocks(){
    eventsArray = JSON.parse(localStorage.getItem("events"));
    for (var i = 0; i < eventsArray.length; i++){
        var iObjectTime = eventsArray[i].time;

        for (var j = 0; j < $(".container").children().length; j++){
            var blockTime = $(".container").children().eq(j).children().eq(0).eq(0).text();  
            if (iObjectTime === blockTime){
                $(".container").children().eq(j).children().eq(1).eq(0).text(eventsArray[i].event);
            }
        }
    }
}

// whenever the save button has been pressed, update eventsArray and localStorage with the new change
timeblockContainer.on("click", function(event){
    event.stopPropagation();
    var element = event.target;

    if (element.matches("i")){
        var currentTimeBlock = $(element).parent().parent().eq(0);
        var childrenObject = $(currentTimeBlock).children();

        var objectTime = $(childrenObject[0]).text();
        var objectEvent = $(childrenObject[1]).val();

        // update the array with the newly saved event
        for (var i = 0; i < eventsArray.length; i++){
            if (eventsArray[i].time == objectTime){
                eventsArray.splice(i, 1);
            }
        }
        eventsArray.push({time: objectTime, event: objectEvent});
        localStorage.setItem("events", JSON.stringify(eventsArray));
    }
})

// start the page when loaded
init();