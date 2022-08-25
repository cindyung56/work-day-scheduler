var timeblockContainer = $(".container");
var currentDay = $("#currentDay");

var currentTime = moment().format("hh:mm:ss");
// console.log(currentTime);

var eventsArray;

// initialize page on load/refresh
function init(){
    currentDay.text(moment().format("dddd, MMMM D, YYYY"));
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
    for (var i = 0; i < 9; i++){
        var hourRow = $("<div>");
        hourRow.attr("class", "row time-block");

        var hourBlock = $("<div>");
        hourBlock.attr("class", "hour col-1");
        hourBlock.text(time + APM);

        var eventBlock = $("<textarea>");
        eventBlock.attr("class", "past col-10");

        var saveBlock = $("<div>");
        saveBlock.attr("class", "col-1 saveBtn");
        saveBlock.append('<i class="fa fa-save"></i>');

        hourRow.append(hourBlock);
        hourRow.append(eventBlock);
        hourRow.append(saveBlock);

        timeblockContainer.append(hourRow);

        if (time === 12){
            time = 1;
            APM = "PM";
        } else{
            time++;
        }
        
    }
}

// parse localStorage and update values of textboxes with previous events
function updateTimeblocks(){
    eventsArray = JSON.parse(localStorage.getItem("events"));
    for (var i = 0; i < eventsArray.length; i++){
        var iObjectTime = eventsArray[i].time;
        console.log(iObjectTime);

        for (var j = 0; j < $(".container").children().length; j++){
            var blockTime = $(".container").children().eq(j).children().eq(0).eq(0).text();  
            if (iObjectTime === blockTime){
                $(".container").children().eq(j).children().eq(1).eq(0).text(eventsArray[i].event);
            }
        }
        
    }
}



timeblockContainer.on("click", function(event){
    event.stopPropagation();
    var element = event.target;

    if (element.matches("i")){
        console.log("Save button pressed");
        var currentTimeBlock = $(element).parent().parent().eq(0);
        var childrenObject = $(currentTimeBlock).children();
        console.log(childrenObject);

        var objectTime = $(childrenObject[0]).text();
        var objectEvent = $(childrenObject[1]).val();


        for (var i = 0; i < eventsArray.length; i++){
            if (eventsArray[i].time == objectTime){
                eventsArray.splice(i, 1);
            }
        }
        eventsArray.push({time: objectTime, event: objectEvent});
        localStorage.setItem("events", JSON.stringify(eventsArray));
    }
})























init();