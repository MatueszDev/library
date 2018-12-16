'use strict';
let xmlhttp;
let xmlhttp_2;
if (window.XMLHttpRequest) {
    // code for IE7+, Firefox, Chrome, Opera, Safari
    xmlhttp=new XMLHttpRequest();
    xmlhttp_2=new XMLHttpRequest();
}
else {
    // code for IE6, IE5
    xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    xmlhttp_2=new ActiveXObject("Microsoft.XMLHTTP");
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

function search_books(){
    let pattern = document.getElementById("pattern").value;
    let adv_search_panel = document.getElementById("adv_search"); 
    if(adv_search_panel.style.display != "none"){
        let id_genre = document.getElementsByTagName("genre");
        console.log(id_genre);
        // xmlhttp.open("GET", `/api/books/advance?pattern=${pattern}&genre=${id_genre}&binding=${id_binding}&language=${id_lang}`);
        // xmlhttp.send();
    }
    xmlhttp.open("GET", `/api/books/by_pattern?pattern=${pattern}`);
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


async function load_adv_search(){
    let adv_div = document.getElementById("adv_search");
    let genre = await get_data_from_url('/api/books/genre');
    let lang = await get_data_from_url('/api/books/languages');
    let binding = await get_data_from_url('/api/books/binding');
    let html = `<form action=# onsubmit="return search_adv(this);">
    Gatunek <select name="genre">`;
    for(let el in genre){
        html += `<option value=${genre[el]['id_gatunek']}> ${genre[el]['gatunek']}</option>`;
    }
    html += "</select>";
    html += `Język <select name="lang">`
    for(let el in lang){
        html += `<option value=${lang[el]['id_jezyk']}> ${lang[el]['jezyk']}</option>`;
    }
    html += "</select>";
    html += `Forma ksiazki <select name="binding">`
    for(let el in binding){
        html += `<option value=${binding[el]['id_oprawa']}> ${binding[el]['oprawa']}</option>`;
    }
    html += "</select>";
    adv_div.innerHTML = html;
}

function get_data_from_url(url){
    let data;
    xmlhttp_2.onreadystatechange=function(){
        if (xmlhttp_2.readyState==4 && xmlhttp_2.status==200){
            data = JSON.parse(xmlhttp_2.responseText); 
            console.log(data);
        }
    }
    xmlhttp_2.open("GET", url, false);
    xmlhttp_2.send();
    return data;
}

function toogle_advanced_search(){
    let adv_search_panel = document.getElementById("adv_search");
    if(adv_search_panel.style.display == "none"){
        adv_search_panel.style.display = "";
    }else{
        adv_search_panel.style = "display: none;";
    }
    
}

window.onload = function() {
    load_books();
    load_adv_search()
}
