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

function load_books(){
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            let response = JSON.parse(xmlhttp.responseText);
            let output = document.getElementById("list");
            if(!Array.isArray(response) || !response.length){
                output.innerHTML = "<p> Brak dostępnych książek</p>";
            }else{
                let html = `<table><tr>
                <th>Tytul</th><th> liczba egzemplarzy </th></tr>`;
                for(let book of response){
                    console.log(book);
                    html += `<tr>
                    <td>${book['tytul']}</td>
                    <td>${book['count']}</td>
                    </tr>`;
                }
                html += `</table>`;
                output.innerHTML = html;
            }            
        }
    }
    
    xmlhttp.open("GET", `/api/books/list_of_available_books`);
    xmlhttp.send();
}

window.onload = ()=>{
    load_books();
}