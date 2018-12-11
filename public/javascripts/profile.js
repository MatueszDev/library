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

function load_profile(){
    xmlhttp.onreadystatechange=function(){
        if (xmlhttp.readyState==4 && xmlhttp.status==200){
            let profile_hook = document.getElementById("profile");
            let profile = JSON.parse(xmlhttp.responseText); 
            console.log(profile);
            let html = `<p> Login: ${profile[0]['login']}</p>`;
            html += `<p> Adres e-mail: ${profile[0]['email']}`;
            if(profile[0]['id_czytelnik'] == 1){
                html += "<p>Nie masz jeszcze konta czytelnika załóż je <a href='/users/create_reader'>tutaj</a> by wypożczać ksiązki!</p>";
                profile_hook.innerHTML = html;
                return;
            }
            let xmlhttp_2 = new XMLHttpRequest();
            xmlhttp_2.onreadystatechange=function(){
                if(xmlhttp_2.readyState==4 && xmlhttp_2.status==200){
                    let response = JSON.parse(xmlhttp_2.responseText);
                    console.log(response);
                    html = `<p>Imie: ${response[0]['imie']}</p>`;
                    html += `<p>Nazwisko: ${response[0]['nazwisko']}</p>`;
                    html += `<p>Telefon: ${response[0]['nr_telefonu']}</p>`;
                    html += `<p>Data otwarcia kontra: ${response[0]['data_o'].slice(0,10)}`;
                    html += `<p>Saldo: ${response[0]['saldo']} </p>`;
                    html += `<form method="GET" action="/api/reader/charge/${response[0]['id_czytelnik']}">
                    <input type="text" name="money" placeholder="Doładuj konto!"/>
                    <input type="submit"  value="doładuj"/>
                    </form>`;
                    if(response.length == 1){
                        html += '<p> Nie masz jeszcze wypożyczonych książek</p>';
                    }else{
                        html += "<ul> Wypożyczone książki"
                        for(let i=1; i < response.length; i++){
                            html += `<li> Tytul: ${response[i]['tytul']} Data zwrotu: ${response[i]['data_zwrotu']} <br/>
                            <a href='/main/book/return/${response[i]['id_egzemplarz']}'>Zwróć teraz</a></li>`;
                        }
                        html += "</ul>";
                    }
                    profile_hook.innerHTML = profile_hook.innerHTML + html;
                }
            }
            xmlhttp_2.open("GET", `/api/reader/${profile[0]['id_czytelnik']}`);
            xmlhttp_2.send();
            profile_hook.innerHTML = html;
        }
    }
    
    xmlhttp.open("GET", `/api/profile/`, true);
    xmlhttp.send();
}

window.onload = ()=>{
    load_profile();
}