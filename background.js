let data = {
    "events": "onStop/onStart",
    "prefs":{
        "LimitTime": "30", 
        "ScoldList": "None"
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