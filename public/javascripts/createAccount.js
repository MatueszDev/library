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

function check_if_exists(value, field){
    xmlhttp.onreadystatechange=function(){
       if (xmlhttp.readyState==4 && xmlhttp.status==200){
           let parent = document.getElementById("for");
           let alert = document.getElementById("alert");
           if(alert){
               parent.removeChild(alert);
           }
           let response = JSON.parse(xmlhttp.responseText); 
           console.log(response);
           if(response.exists){
               let div = document.createElement("div");
               div.innerHTML = `<p style='color:red;'>Podany ${field} już istnieje</p>`;
               div.id = "alert"
               let input = document.getElementById(field);
               parent.insertBefore(div, input); 
               return;
           }
       }
   }
   console.log(`/api/user/${field}/${value}`);
   xmlhttp.open("GET", `/api/user/${field}/${value}`, true );
   xmlhttp.send(); 
}

function check_password_matach(){
    let pass1 = document.getElementById("pass1");
    let pass2 = document.getElementById("pass2");
    let alert = document.getElementById("alertPass");
    if(alert){
        alert.parentNode.removeChild(alert);
    }
    if(!pass2.value){
        return;
    }
    if(pass1.value !== pass2.value){
        let div = document.createElement("div");
        div.innerHTML = `<p style='color:red;'>Hasła nie są identyczne</p>`;
        div.id = "alertPass";
        let input = document.getElementById("pass1"); // = content + `<p style='color=red;'>Podany ${field} już istnieje</p>`;
        document.getElementById("for").insertBefore(div, input); 
        return;
    }
}

