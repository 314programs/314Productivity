//Elements from HTML
const LimitTimeElement = document.getElementById("LimitTime")
const LimitButtonElement = document.getElementById("LimitButton")
const LimitWebsiteElement = document.getElementById("LimitWebsite")


const BlockButtonElement = document.getElementById("BlockButton")
const BlockWebsiteElement = document.getElementById("BlockWebsite")


const RemindButtonElement = document.getElementById("RemindButton")


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

        RemindButton: RemindButtonElement.value,

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
}

BlockButtonElement.onclick = function(){
    ToggleButton(BlockButtonElement, "Block on", "Block off");
}

RemindButtonElement.onclick = function(){
    ToggleButton(RemindButtonElement, "Timer on", "Timer off");
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


chrome.storage.local.get(["LimitTime", "LimitButton", "LimitWebsite", "BlockButton", "BlockWebsite", "RemindButton", "ScoldButton", "ScoldTime", "ScoldList", "ScoldText"], (result) => {
    const {LimitTime, LimitButton, LimitWebsite, BlockButton, BlockWebsite, RemindButton, ScoldButton, ScoldTime, ScoldList, ScoldText} = result;
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
    if(RemindButton){
        RemindButtonElement.value = RemindButton;
        ButtonLoad(RemindButtonElement, "Timer on");
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