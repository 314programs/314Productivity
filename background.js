let data = {
    "events": "onStop/onStart",
    "prefs":{
        "LimitTime": "30", 
        "LimitButton:": "Limit off",
        "LimitWebsite": "",

        "BlockButton": "Block off",
        "BlockWebsite": "",

        "RemindButton": "Timer on",

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
            console.log(prefs);
        default:
            break;
    }
    
})