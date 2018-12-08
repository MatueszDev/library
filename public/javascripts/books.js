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
            let books_hook = document.getElementById("books");
            let books = JSON.parse(xmlhttp.responseText); 
            let html = generate_html(books);
            books_hook.innerHTML = html;
            console.log(books);
        }
    }
    xmlhttp.open("GET", "/api/books/all", true);
    xmlhttp.send();
}

window.onload = function() {
    load_books();
}

function search_books(){
    let pattern = document.getElementById("books").value;
    xmlhttp.open("GET", `api/books/by_pattern?pattern=${pattern}`);
    xmlhttp.send();
}

function generate_html(books){
    let html = "<ul>";
    for(let book in books){
        let book_in = books[book];
        html += `<li> ${book_in['tytul']} 
                <ul><li> liczba stron: ${book_in['l_stron']}</li>
                    <li> język: ${book_in['jezyk']}</li>
                    <li> liczba komentarzy: ${book_in['kom']}</li></ul>
        </li>
        <a href=/main/book/${book_in['id_ksiazka']}> Szczegóły </a>`;
    }
    html += "</ul>";
    return html;
}







