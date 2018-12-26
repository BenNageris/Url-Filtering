
window.onload = page_load;

function page_load() {
    chrome.storage.sync.get(['token','child','categories','domains'], function (result){
        if(result.token!=null && result.child!=null ){ // remebers in cache the selected user & child was selected
            window.location.href = "description_page.html";
        }
        else{
            document.getElementById("submit").onclick = function aaa() {
            var username = document.getElementById("username").value;
            var password = document.getElementById("password").value;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    // Typical action to be performed when the document is ready:

                    var object = JSON.parse(xhttp.responseText);
                    if (object.err != null) {
                        alert("err");
                        return;
                    }
                    chrome.storage.sync.set({ "token": object.token }, function () {
                        //console.log('Value is set to ' + value);
                        window.location.href = "home.html";
                    });
                }
            };
            xhttp.open("POST", "<ENTER_YOUR_SERVER_ADDRESS>/api/login", true);
            xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhttp.send("obj=" + JSON.stringify({ username: username, password: password }));
            //var bgPage = chrome.extension.getBackgroundPage();
            //bgPage.NegFlag();
            return false;
            //else {
            //    document.getElementById("error").innerHTML = "user name or password are incorrect";
            //    return false;
            //}
            }
        };
    });
}