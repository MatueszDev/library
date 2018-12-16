'use strict';
let xmlhttp;
if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
}
else {
    // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
}

function load_readers(){
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            let response = JSON.parse(xmlhttp.responseText);
            let output = document.getElementById("readers");
            if(!Array.isArray(response) || !response.length){
                output.innerHTML = "<p> Nie ma w tej chwili czytelników, którzy przetrzymują ksiązki</p>";
            }else{
                let html = `<table><tr>
                <th>Imie</th><th>Nazwisko</th><th> L.książek </th></tr>`;
                for(let reader of response){
                    console.log(reader);
                    html += `<tr>
                    <td>${reader['imie']}</td>
                    <td>${reader['nazwisko']}</td>
                    <td>${reader['count']}</td>
                    </tr>`;
                }
                html += `</table>`;
                output.innerHTML = html;
            }            
        }
    }
    
    xmlhttp.open("GET", `/api/reader/after_limit`);
    xmlhttp.send();
}

window.onload = ()=>{
    load_readers();
}