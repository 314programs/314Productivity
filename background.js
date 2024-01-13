let data = {
    "events": "onStop/onStart",
    "prefs":{
        "LimitTime": "30", 
        "LimitButton:": "Limit on",
        "LimitWebsite": "",

        "BlockButton": "Block on",
        "BlockWebsite": "https://twitter.com/",

        "RemainTime": "1800",

        "ScoldButton": "Scolding on",
        "ScoldTime": "15",
        "ScoldList": "None",
        "ScoldText": "You should be productive... NOW!"
    }
}

chrome.runtime.onMessage.addListener(data => {
    const{event, prefs} = data
    switch(event){
        case("onStart"):
            chrome.storage.local.set(prefs);
        default:
            break;
    }
    
})

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "updateTimer") {
        var hour = Math.floor(message.time/3600);
        var minute = Math.floor(message.time/60);
        var second = Math.floor(message.time%60);

        if(hour < 10) hour = "0" + hour;
        if(minute < 10) minute = "0" + minute;
        if(second < 10) second = "0" + second;

        RemainTimeElement.textContent = hour + ":" + minute + ":" + second;
    }
});

// background.js

// Function to check the active tab's URL
function checkActiveTabUrl() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            var activeTab = tabs[0];
            var activeTabURL = activeTab.url;
            console.log("Active tab URL:", activeTabURL);
        }
    });
}
// Poll every 5 seconds (5000 milliseconds)
const pollingInterval = 1000; 
setInterval(checkActiveTabUrl, pollingInterval);


var LimitOn = false;
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "Limit on") {
        LimitOn = true;
    }
    else{
        LimitOn = false;
    }
});


function startCountdown(durationInSeconds) {
    let remainingTime = durationInSeconds;

    // Update the countdown every second
    const interval = setInterval(() => {
        // Calculate minutes and seconds from remainingTime
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;

        // Format the output string
        const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;

        // Decrease the remaining time
        console.log(LimitOn);
        if(LimitOn){
            console.log(data.prefs.LimitButton);
            remainingTime--;
        }

        // Check if the countdown is finished
        if (remainingTime < 0) {
            clearInterval(interval);
        }
        chrome.runtime.sendMessage({action: "updateTimer", time: remainingTime});

    }, 1000); // 1000 milliseconds = 1 second
}
startCountdown(45);


function GetDate(){
    // Get the current date and time
    const now = new Date();

    // Extract the hours, minutes, and seconds
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    // Format the time. This example uses a 24-hour format.
    const currentTime = `${hours}:${minutes}:${seconds}`;
    return currentTime;
}



