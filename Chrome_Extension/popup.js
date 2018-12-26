var flag = false;
var text = "";
chrome.windows.onCreated.addListener(function (window) {
    chrome.storage.sync.get(['token', 'child'], function (result) {
        var child = result.child;
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(xhttp.responseText);
                chrome.storage.sync.set({ "child": child }, function () {
                    console.log(obj.categories);
                    NegFlag([], obj.categories);
                });
            }
        };
        xhttp.open("POST", "<ENTER_YOUR_SERVER_ADDRESS>/api/getPolicys", true);
        xhttp.setRequestHeader("x-access-token", result.token);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send("child=" + child);
    });
});


function NegFlag(domains, categories) {
    if (domains!=null && domains.length != 0)
        block_domains(domains);
    alert(categories);
    if (categories!=null && categories.length != 0)
        start_page_scaning(categories);
}

function block_domains(domains) {
    chrome.webRequest.onBeforeRequest.addListener(
        function (details) {
            return { redirectUrl: "<PATH_TO_FORBIDDEN_PAGE>/forbbiden.html" };
        }, { urls: domains },
        ['blocking']);
}

function start_page_scaning(categories) {
    chrome.storage.sync.get(['token'], function (result) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                text = xhttp.responseText;
                chrome.webNavigation.onCommitted.addListener(function callback(details) {
                    if (details.frameId != 0)
                        return;
                    onPageLoad(text);
                });
            }
        };
        xhttp.open("POST", "<ENTER_YOUR_SERVER_ADDRESS>/api/getWords", true);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.setRequestHeader("x-access-token", result.token);
        xhttp.send("category=" + categories);
        return false;
    });
}

function onPageLoad(code) {
    chrome.tabs.executeScript(null, {
        code: code
    }, function () {
        // If you try and inject into an extensions page or the webstore/NTP you'll get an error
        if (chrome.runtime.lastError) {
            console.log('There was an error injecting script : \n' + chrome.runtime.lastError.message);
        }
    });
}




var script = "";