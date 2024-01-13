//Elements from HTML
const LimitTimeElement = document.getElementById("LimitTime")
const LimitButtonElement = document.getElementById("LimitButton")
const LimitWebsiteElement = document.getElementById("LimitWebsite")


const BlockButtonElement = document.getElementById("BlockButton")
const BlockWebsiteElement = document.getElementById("BlockWebsite")

const RemainTimeElement = document.getElementById("RemainTime")

const ScoldButtonElement = document.getElementById("ScoldButton")
const ScoldTimeElement = document.getElementById("ScoldTime")
const PlayButtonElement = document.getElementById("PlayButton")
const ScoldListElement = document.querySelector("#ScoldList select")
const ScoldTextElement = document.getElementById("ScoldText")


const SaveButtonElement = document.getElementById("SaveButton")


var MyAudios = []
function stopAllJavaScriptAudio() {
    MyAudios.forEach(function(audio) {
        audio.pause(); // Pause the audio
        audio.currentTime = 0; // Reset the time
    });
}

SaveButtonElement.onclick = () => {
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
        ScoldText: ScoldTextElement.value
    }

    chrome.runtime.sendMessage({event: "onStart", prefs});
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
    if(LimitButtonElement.value == "Limit on"){
        chrome.runtime.sendMessage({action: "Limit on"});
    }
    else{
        chrome.runtime.sendMessage({action: "Limit off"});
    }
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

chrome.storage.local.get(["LimitTime", "LimitButton", "LimitWebsite", "BlockButton", "BlockWebsite", "RemainTime", "ScoldButton", "ScoldTime", "ScoldList", "ScoldText"], (result) => {
    const {LimitTime, LimitButton, LimitWebsite, BlockButton, BlockWebsite, RemainTime, ScoldButton, ScoldTime, ScoldList, ScoldText} = result;
    if(LimitTime){
        LimitTimeElement.value = LimitTime;
    }
    if(LimitButton){
        LimitButtonElement.value = LimitButton;
        ButtonLoad(LimitButtonElement, "Limit on");
        if(LimitButton == "Limit on"){
            chrome.runtime.sendMessage({action: "Limit on"});
        }
        else{
            chrome.runtime.sendMessage({action: "Limit off"});
        }
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
    
})