window.onload = page_load;
function page_load() {
    chrome.storage.sync.get(['categories','domains'], function (result){
        generate_blocking_discription_page(result.categories,result.domains);
    });
}
function generate_blocking_discription_page(categories,domains){ // creates the blocking description page
    document.body.innerText="";
    document.body.style.width="300px";
    document.body.style.background="#76b852"
    var pagetext=document.body;
    pagetext.innerHTML="<h1>Blocking</h1>";
    if(domains.length>0){ //  handle domains
        pagetext.innerHTML+="<h3>Domains:</h3>";
        pagetext.innerHTML+="<ul>";
        for(var i=0;i<domains.length;i++){
            pagetext.innerHTML+="<li>"+domains[i]+"</li>";
        }
        pagetext.innerHTML+="</ul>";
    }
    if(categories.length>0){ //  handle categories
        pagetext.innerHTML+="<h3>Categories:</h3> <ul>";
        for(var i=0;i<categories.length;i++){
            pagetext.innerHTML+="<li>"+categories[i]+"</li>";
        }
        pagetext.innerHTML+="</ul>";
    }
}
