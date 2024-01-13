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
        ScoldList: ScoldListElement.selectedIndex
    }

    chrome.runtime.sendMessage({event: "onStart", prefs});
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


chrome.storage.local.get(["LimitTime", "ScoldList"], (result) => {
    const {LimitTime, ScoldList} = result;
    if(LimitTime){
        LimitTimeElement.value = LimitTime;
    }
    if(ScoldList){
        ScoldListElement.selectedIndex = ScoldList;
    }
})