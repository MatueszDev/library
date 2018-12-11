'use strict';

let cost = 0;
let multiplier = 0;

let calc_date = async function(){
    let date_el = document.getElementById("date");
    let days_el = document.getElementById("days");
    let days = parseInt(days_el.value);
    let today = new Date();
    today.setDate(today.getDate() + days);
    date_el.innerHTML = today.toISOString().slice(0,10);
}

let calc_cost = function(){
    let cost_el = document.getElementById("cost");
    let days_el = document.getElementById("days");
    let days = parseInt(days_el.value);
    let message_el = document.getElementById("message");
    message_el.innerHTML = "";
    let submit_button = document.getElementById("btnsubmit");
    if(days < 7){
        message.innerHTML = "Nie można wypożyczyć ksiązki na krócej niż 7 dni.";
        submit_button.onclick = "";
        return;
    }
    calc_date();
    let curr_cost = cost + (days - 7)*multiplier;
    console.log(cost, multiplier);
    cost_el.innerHTML = `${curr_cost} zł`;
    submit_button.onclick = "check_account_money()";
}

let get_lend_constants = function(){
    let xmlhttp;
    if (window.XMLHttpRequest) {
        // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else {
        // code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }    
    xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
       let response = JSON.parse(xmlhttp.responseText); 
       console.log(response);
       cost = parseInt(response[0]['c_bazowa']);
       multiplier = parseFloat(response[0]['mnoznik']);
    }
}
    let id_book= location.pathname.split("/");
    id_book = id_book[id_book.length-1];
    console.log(`/api/books/cost_constatnt/${id_book}`);
    xmlhttp.open("GET", `/api/books/cost_constatnt/${id_book}`, true );
    xmlhttp.send(); 
}

let check_account_money = function(){
    let xmlhttp;
    if (window.XMLHttpRequest) {
        xmlhttp=new XMLHttpRequest();
    }
    else {
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }    
    xmlhttp.onreadystatechange=function(){
    if (xmlhttp.readyState==4 && xmlhttp.status==200){
       let response = JSON.parse(xmlhttp.responseText); 
       let cost_span = document.getElementById("cost");
       let account_bilans = response[0].saldo;
       if(account_bilans - cost_span.value < 0){
           cost_span.appendChild("<p>Nie masz wystarczajaco srodków na koncie</p>");
       }else{
           let form = document.getElementById("form");
           let input = document.createElement("input");
           input.name="cost";
           input.value=cost_span.value;
           input.style="display:none";
           form.appendChild(input);
           form.submit();
       }
    }
}
    xmlhttp.open("GET", `/api/reader/saldo`);
    xmlhttp.send(); 
}

window.onload = function(){
    get_lend_constants();
}