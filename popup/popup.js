//Elements from HTML
const LimitTimeElement = document.getElementById("LimitTime")
const LimitButtonElement = document.getElementById("LimitButton")
const LimitWebsiteElement = document.getElementById("LimitWebsite")
const LimitWarningElement = document.getElementById("LimitWarning")

const BlockButtonElement = document.getElementById("BlockButton")
const BlockWebsiteElement = document.getElementById("BlockWebsite")

const RemainTimeElement = document.getElementById("RemainTime")

const ScoldButtonElement = document.getElementById("ScoldButton")
const ScoldTimeElement = document.getElementById("ScoldTime")
const PlayButtonElement = document.getElementById("PlayButton")
const ScoldListElement = document.querySelector("#ScoldList select")
const ScoldTextElement = document.getElementById("ScoldText")
const ScoldWarningElement = document.getElementById("ScoldWarning")

const SaveButtonElement = document.getElementById("SaveButton")
const SaveWarningElement = document.getElementById("SaveWarning")


var MyAudios = []
function stopAllJavaScriptAudio() {
    MyAudios.forEach(function(audio) {
        audio.pause(); // Pause the audio
        audio.currentTime = 0; // Reset the time
    });
}

SaveButtonElement.onclick = () => {
    if(LimitValid && ScoldValid){
        SaveWarningElement.textContent = "";
        const prefs = {
            LimitTime: LimitTimeElement.value,
            LimitButton: LimitButtonElement.value,
            LimitWebsite: LimitWebsiteElement.value,
            
            BlockButton: BlockButtonElement.value,
            BlockWebsite: BlockWebsiteElement.value,
    
            RemainTime: RemainTimeElement.value,
    
            ScoldButton: ScoldButtonElement.value,
            ScoldTime: ScoldTimeElement.value,
            ScoldList: ScoldListElement.selectedIndex,
            ScoldText: ScoldTextElement.value,
            ScoldAudio: ScoldListElement.options[ScoldListElement.selectedIndex].id
        }
        chrome.runtime.sendMessage({action: "LimitChange", content: LimitWebsiteElement.value});
        chrome.runtime.sendMessage({action: "BlockChange", content: BlockWebsiteElement.value});
        chrome.runtime.sendMessage({action: "LimitButton", content: LimitButtonElement.value});
        chrome.runtime.sendMessage({action: "BlockButton", content: BlockButtonElement.value});
        chrome.runtime.sendMessage({action: "ScoldButton", content: ScoldButtonElement.value});
        chrome.runtime.sendMessage({action: "LimitTime", content: LimitTimeElement.value});
        chrome.runtime.sendMessage({action: "ScoldMessage", content: ScoldTextElement.value});
        chrome.runtime.sendMessage({action: "ScoldChange", content: ScoldTimeElement.value});
        chrome.runtime.sendMessage({action: "AudioChange", content: ScoldListElement.options[ScoldListElement.selectedIndex].id});
        chrome.runtime.sendMessage({event: "onStart", prefs});
    }
    else{
        SaveWarningElement.textContent = "Cannot save until input is valid";
    }

}

function ToggleButton(ButtonElement, On, Off){
    if(ButtonElement.value == On){
        ButtonElement.value = Off;
        ButtonElement.classList.remove("is-success");
        ButtonElement.classList.add("is-danger");
    }
    else{
        ButtonElement.value = On;
        ButtonElement.classList.add("is-success");
        ButtonElement.classList.remove("is-danger");
    }
}

function ButtonLoad(ButtonElement, On){
    if(ButtonElement.value == On){
        ButtonElement.classList.add("is-success");
        ButtonElement.classList.remove("is-danger");
    }
    else{
        ButtonElement.classList.remove("is-success");
        ButtonElement.classList.add("is-danger");
    }
}

LimitButtonElement.onclick = function(){
    ToggleButton(LimitButtonElement, "Limit on", "Limit off");
}

BlockButtonElement.onclick = function(){
    ToggleButton(BlockButtonElement, "Block on", "Block off");
}

ScoldButtonElement.onclick = function(){
    ToggleButton(ScoldButtonElement, "Scolding on", "Scolding off");
}

PlayButtonElement.onclick = function(){
    stopAllJavaScriptAudio();
    let SelectedOption = ScoldListElement.options[ScoldListElement.selectedIndex];
    var AudioName = SelectedOption.id;
    if(AudioName != "None"){
        var PlayAudio = new Audio("../audio/" + AudioName + ".mp3");
        if(MyAudios.indexOf("../audio/" + AudioName + ".mp3") == -1){
            MyAudios.push(PlayAudio);
        }
        PlayAudio.play();
    }
}

var LimitValid = true;
var ScoldValid = true;
function checkString(string) {
    return /^[0-9]*$/.test(string);
}

LimitTimeElement.onchange = function(){
    if(!checkString(LimitTimeElement.value) || (checkString(LimitTimeElement.value) && LimitTimeElement.value > 1440)){
        LimitWarningElement.textContent = "Please enter a number that is smaller than 1441";
        LimitValid = false;
    }
    else{
        LimitWarningElement.textContent = "";
        LimitValid = true;
    }
}

ScoldTimeElement.onchange = function(){
    console.log(ScoldTimeElement.value);
    if(!checkString(ScoldTimeElement.value) || (checkString(ScoldTimeElement.value) && ScoldTimeElement.value > 1440)){
        ScoldWarningElement.textContent = "Please enter a number that is smaller than 1441";
        ScoldValid = false;
    }
    else{
        ScoldWarningElement.textContent = "";
        ScoldValid = true;
    }
}


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "updateTimer") {
        var hour = Math.floor(message.time/3600);
        message.time -= hour * 3600;
        var minute = Math.floor(message.time/60);
        var second = Math.floor(message.time%60);

        if(hour < 10) hour = "0" + hour;
        if(minute < 10) minute = "0" + minute;
        if(second < 10) second = "0" + second;

        RemainTimeElement.textContent = hour + ":" + minute + ":" + second;
    }
});

chrome.storage.local.get(["LimitTime", "LimitButton", "LimitWebsite", "BlockButton", "BlockWebsite", "RemainTime", "ScoldButton", "ScoldTime", "ScoldList", "ScoldText", "ScoldAudio"], (result) => {
    const {LimitTime, LimitButton, LimitWebsite, BlockButton, BlockWebsite, ScoldButton, ScoldTime, ScoldList, ScoldText, ScoldAudio} = result;
    if(LimitTime){
        LimitTimeElement.value = LimitTime;
    }
    if(LimitButton){
        LimitButtonElement.value = LimitButton;
        ButtonLoad(LimitButtonElement, "Limit on");
    }
    if(LimitWebsite){
        LimitWebsiteElement.value = LimitWebsite;
    }
    if(ScoldList){
        ScoldListElement.selectedIndex = ScoldList;
    }
    if(BlockButton){
        BlockButtonElement.value = BlockButton;
        ButtonLoad(BlockButtonElement, "Block on");
    }
    if(BlockWebsite){
        BlockWebsiteElement.value = BlockWebsite;
    }
    if(ScoldButton){
        ScoldButtonElement.value = ScoldButton;
        ButtonLoad(ScoldButtonElement, "Scolding on");
    }
    if(ScoldTime){
        ScoldTimeElement.value = ScoldTime;
    }
    if(ScoldText){
        ScoldTextElement.value = ScoldText;
    }
    chrome.runtime.sendMessage({action: "LimitChange", content: LimitWebsiteElement.value});
    chrome.runtime.sendMessage({action: "BlockChange", content: BlockWebsiteElement.value});
    chrome.runtime.sendMessage({action: "LimitButton", content: LimitButtonElement.value});
    chrome.runtime.sendMessage({action: "BlockButton", content: BlockButtonElement.value});
    chrome.runtime.sendMessage({action: "ScoldButton", content: ScoldButtonElement.value});
    chrome.runtime.sendMessage({action: "LimitTime", content: LimitTimeElement.value});
    chrome.runtime.sendMessage({action: "ScoldMessage", content: ScoldTextElement.value});
    chrome.runtime.sendMessage({action: "ScoldChange", content: ScoldTimeElement.value});
    chrome.runtime.sendMessage({action: "AudioChange", content: ScoldListElement.options[ScoldListElement.selectedIndex].id});
    
})