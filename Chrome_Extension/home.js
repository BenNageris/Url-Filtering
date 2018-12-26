
window.onload = page_load;

function page_load() {
    chrome.storage.sync.get(['token'], function (result) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                // Typical action to be performed when the document is ready:
                //var object = JSON.parse(xhttp.responseText);
                //alert(object.childs.length);
                //window.location.href = "home.html";
                document.getElementsByTagName('html')[0].innerHTML = xhttp.responseText;
                document.body.style.width="300px";
                document.body.style.background="#76b852"
                for (var i = 0; i < document.getElementsByTagName("tr").length; i++) {
                    //alert(document.getElementsByTagName("tr")[i].id);
                    document.getElementsByTagName("tr")[i].onclick = click;
                }
            }
        };
        xhttp.open("GET", "<ENTER_YOUR_SERVER_ADDRESS>/api/getchilds", true);
        xhttp.setRequestHeader("x-access-token", result.token);
        //xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send(/*"obj=" + JSON.stringify({ username: username, password: password })*/);
    });
}

function click(e) { // selecting child
    var child = this.id;
    chrome.storage.sync.get(['token'], function (result) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var obj = JSON.parse(xhttp.responseText);
                for (var i = 0; i < obj.domains.length; i++) {
                    obj.domains[i] = "*://*." + obj.domains[i].trim() + "/*";
                }
                //"*://*.google.com/"
                chrome.storage.sync.set({ "child": child,"domains":obj.domains,"categories":obj.categories}, function () {
                    var bgPage = chrome.extension.getBackgroundPage();
                    bgPage.NegFlag(obj.domains, obj.categories);    
                    window.location.href = "description_page.html";               
                });
            }
        };
        xhttp.open("POST", "<ENTER_YOUR_SERVER_ADDRESS>/api/getPolicys", true);
        xhttp.setRequestHeader("x-access-token", result.token);
        xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhttp.send("child=" + child);
    });

}
