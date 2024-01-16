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
        "ScoldTime": "15",
        "ScoldList": "0",
        "ScoldText": "You should be productive... NOW!",
        "ScoldAudio": "None"
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
        if(item == RedirectUrl) continue;
        if(CurSite.includes(item) && item != ''){
            return true
        }
    }
    return false;
}

function CheckLimited(CurSite){
    if(LimitWebsiteList.length == 0) return false;
    for(var item of LimitWebsiteList){
        if(item == RedirectUrl) continue;
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
            
            if(ScoldButtonOn && CheckLimited(CurTab)){
                ScoldTimer++;
                if(ScoldTimer >= ScoldLimit*60){
                    playAudio(AudioName);
                    createNotification(UserMessage);
                    ScoldTimer = 0;
                }
                chrome.runtime.sendMessage({action: "updateScold", time: ScoldLimit*60 - ScoldTimer});
            }
            else{
                ScoldTimer = 0;
                chrome.runtime.sendMessage({action: "updateScold", time: ScoldLimit*60});
            }
        }
    });

    if((BlockOn || (TimeOver && LimitOn)) && CurTab != RedirectUrl){
        chrome.tabs.query({currentWindow: true, active: true}, function (tab) {
            chrome.tabs.update(tab.id, {url: RedirectUrl});
        });
        BlockOn = false;
    }

    if(LimitOn){
        chrome.action.setIcon({path: "images/icon-32-true.png"});
    }
    else{
        chrome.action.setIcon({path: "images/icon-32-false.png"});
    }

    
}
const pollingInterval = 1000; 
setInterval(checkActiveTabUrl, pollingInterval);

function playAudio(name_) {
    chrome.tabs.create({ url: chrome.runtime.getURL("audioSite/"+name_+".html") });
}

// Call the playAudio function when needed


var LimitButtonOn = true;
var BlockButtonOn = true;
var ScoldButtonOn = true;
var Changed = false;
var TimeLimit = 60;
var ScoldLimit = 15;
var ScoldTimer = 0;
var UserMessage = "You should be productive... NOW!";
var AudioName = "None";

function createNotification(MessageContent) {
    chrome.notifications.create('', {
        type: 'basic',
        iconUrl: 'images/placeholder.png', // Path to the icon
        title: '314Productivity',
        message: MessageContent,
        priority: 2
    });
}



chrome.storage.local.get(["LimitTime", "LimitButton", "LimitWebsite", "BlockButton", "BlockWebsite", "ScoldButton", "ScoldText", "ScoldTime", "ScoldAudio"], (result) => {
    const {LimitTime, LimitButton, LimitWebsite, BlockButton, BlockWebsite, ScoldButton, ScoldText, ScoldTime, ScoldAudio} = result;
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

    if(ScoldButton == undefined){
        ScoldButtonOn = true;
    }
    else{
        if(ScoldButton == "Scolding on") ScoldButtonOn = true;
    }

    if(LimitWebsite != undefined) LimitWebsiteList = LimitWebsite.split("\n");
    if(BlockWebsite != undefined) BlockWebsiteList = BlockWebsite.split("\n");
    if(LimitTime != undefined) TimeLimit = LimitTime;
    if(ScoldText != undefined) UserMessage = ScoldText;
    if(ScoldTime != undefined) ScoldLimit = ScoldTime;
    if(ScoldAudio != undefined) AudioName = ScoldAudio;
    startCountdown(TimeLimit*60);
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

    if (message.action == "ScoldButton"){
        if(message.content == "Scolding on") ScoldButtonOn = true;
        else ScoldButtonOn = false;
    }

    if(message.action == "LimitTime" && message.content != TimeLimit && message.content != ''){
        Changed = true;
        TimeLimit = message.content;

        if(TimeOver){
            Changed = false;
            TimeOver = false;
            startCountdown(Math.max(TimeLimit*60 - TimePassed, 1));
        }
    }

    if(message.action == "ScoldMessage"){
        UserMessage = message.content;
    }
    if(message.action == "ScoldChange" && message.content != ScoldLimit){
        ScoldTimer = 0;
        ScoldLimit = message.content;
    }
    if(message.action == "AudioChange"){
        AudioName = message.content;
    }
});


var TimePassed = 0;
var newDay = false;
function startCountdown(durationInSeconds) {
    let remainingTime = durationInSeconds;

    // Update the countdown every second
    const interval = setInterval(() => {
        if(Changed){
            Changed = false;
            startCountdown(Math.max(TimeLimit*60 - TimePassed, 1));
            clearInterval(interval);
            return;
        }
        if(newDay){
            clearInterval(interval);
            newDay = false;
            return;
        }
        // Decrease the remaining time
        if(LimitOn){
            if(remainingTime == 300){
                createNotification("5 minutes left!");
            }
            if(remainingTime == 60){
                createNotification("1 minute left!");
            }
            if(remainingTime == 10){
                createNotification("10 seconds left!");
            }

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


function doSomething() {
    newDay = true;
    Changed = false;
    TimeOver = false;
    TimePassed = 0;
    startCountdown(TimeLimit*60);
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

chrome.storage.local.get(['lastRunDate'], function(result) {
    const today = new Date().toDateString();
    if (result.lastRunDate !== today) {
        // Run your daily function
        doSomething();

        // Update the last run date
        chrome.storage.local.set({ 'lastRunDate': today });
    }
});


