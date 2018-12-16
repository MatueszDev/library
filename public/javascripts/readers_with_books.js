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
                output.innerHTML = "<p>Nikt jeszcze nie wypożyczył książki</p>";
            }else{
                let html = `<table><tr>
                <th>Imie</th><th>Nazwisko</th><th>Tytul</th><th>Data zwrotu</th></tr>`;
                for(let reader of response){
                    console.log(reader);
                    if(new Date(reader['data_zwrotu']) < new Date()){
                        html += `<tr style="color:red">`;
                    }else{
                        html += `<tr>`;
                    }
                    html +=`
                    <td>${reader['imie']}</td>
                    <td>${reader['nazwisko']}</td>
                    <td>${reader['tytul']}</td>
                    <td>${reader['data_zwrotu'].slice(0,10)}</td>
                    </tr>`;
                }
                html += `</table>`;
                output.innerHTML = html;
            }
            
        }
    }
    
    xmlhttp.open("GET", `/api/reader/reader_book`);
    xmlhttp.send();
}

window.onload = ()=>{
    load_readers();
}