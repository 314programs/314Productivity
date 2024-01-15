let data = {
    "events": "onStop/onStart",
    "prefs":{
        "LimitTime": "60", 
        "LimitButton": "Limit on",
        "LimitWebsite": "",

        "BlockButton": "Block on",
        "BlockWebsite": "",

        "RemainTime": "3600",

        "ScoldButton": "Scolding on",
        "ScoldTime": "20",
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

var LimitWebsiteList = [];
var BlockWebsiteList = [];

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "updateTimer") {
        message.time = Math.max(0, message.time);
        var hour = Math.floor(message.time/3600);
        var minute = Math.floor(message.time/60);
        var second = Math.floor(message.time%60);

        if(hour < 10) hour = "0" + hour;
        if(minute < 10) minute = "0" + minute;
        if(second < 10) second = "0" + second;

        RemainTimeElement.textContent = hour + ":" + minute + ":" + second;
    }

    if(message.action == "LimitChange"){
        LimitWebsiteList = message.content.split("\n");
    }
    if(message.action == "BlockChange"){
        BlockWebsiteList = message.content.split("\n");
    }
});

function CheckBlocked(CurSite){
    if(BlockWebsiteList.length == 0) return false;
    for(var item of BlockWebsiteList){
        if(CurSite.includes(item) && item != ''){
            return true
        }
    }
    return false;
}

function CheckLimited(CurSite){
    if(LimitWebsiteList.length == 0) return false;
    for(var item of LimitWebsiteList){
        if(CurSite.includes(item) && item != ''){
            return true
        }
    }
    return false;
}


var LimitOn = false;
var BlockOn = false;
var RedirectUrl = "https://en.wikipedia.org/wiki/Procrastination";
var TimeOver = false;

// Function to check the active tab's URL
function checkActiveTabUrl() {
    var CurTab;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
            var activeTab = tabs[0];
            var activeTabURL = activeTab.url;
            CurTab = activeTabURL;

            if(CheckLimited(activeTabURL) && LimitButtonOn){
                LimitOn = true;
            }
            else LimitOn = false;
            if(CheckBlocked(activeTabURL) && BlockButtonOn){
                BlockOn = true;
            }
            else BlockOn = false;
        }
    });

    if((BlockOn || (TimeOver && LimitOn)) && CurTab != RedirectUrl){
        chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.update(tab.id, {url: RedirectUrl});
        });
        BlockOn = false;
        LimitOn = false;
    }
}
const pollingInterval = 1000; 
setInterval(checkActiveTabUrl, pollingInterval);


var LimitButtonOn = false;
var BlockButtonOn = false;
var Changed = false;
var TimeLimit = 60;


chrome.storage.local.get(["LimitTime", "LimitButton", "LimitWebsite", "BlockButton", "BlockWebsite"], (result) => {
    const {LimitTime, LimitButton, LimitWebsite, BlockButton, BlockWebsite} = result;
    if(LimitButton == undefined){
        LimitButtonOn = true;
    }
    else{
        if(LimitButton == "Limit on") LimitButtonOn = true;
    }

    if(BlockButton == undefined){
        BlockButtonOn = true;
    }
    else{
        if(BlockButton == "Block on") BlockButtonOn = true;
    }

    if(LimitWebsite != undefined) LimitWebsiteList = LimitWebsite.split("\n");
    if(BlockWebsite != undefined) BlockWebsiteList = BlockWebsite.split("\n");
    if(TimeLimit != undefined) TimeLimit = LimitTime;
    startCountdown(TimeLimit);
})


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action == "LimitButton"){
        if(message.content == "Limit on") LimitButtonOn = true;
        else LimitButtonOn = false;
    }
    
    if (message.action == "BlockButton"){
        if(message.content == "Block on") BlockButtonOn = true;
        else BlockButtonOn = false;
    }

    if(message.action == "LimitTime" && message.content != TimeLimit && message.content != ''){
        Changed = true;
        TimeLimit = message.content;

        if(TimeOver){
            Changed = false;
            TimeOver = false;
            startCountdown(Math.max(TimeLimit - TimePassed, 1));
        }
    }

});


var TimePassed = 0;

function startCountdown(durationInSeconds) {
    let remainingTime = durationInSeconds;

    // Update the countdown every second
    const interval = setInterval(() => {
        if(Changed){
            Changed = false;
            startCountdown(Math.max(TimeLimit - TimePassed, 1));
            clearInterval(interval);
            return;
        }
        // Decrease the remaining time
        if(LimitOn){
            remainingTime--;
            TimePassed++;
        }
        

        // Check if the countdown is finished
        if (remainingTime <= 0) {
            TimeOver = true;
            clearInterval(interval);
        }
        chrome.runtime.sendMessage({action: "updateTimer", time: remainingTime});

    }, 1000); // 1000 milliseconds = 1 second
}


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




const interval = setInterval(() => {
    if(GetDate() == "0:0:0"){
        TimeOver = false;
        Changed = true;
        startCountdown(TimeLimit);
    }
}, 1000); // 1000 milliseconds = 1 second




