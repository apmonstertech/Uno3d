var cards;
class NetTexture {
    constructor() {
        this.nick;
    }
    ready(nick){
        this.nick = nick;
        $.ajax({
            url: "/ready",
            data: {nick:nick},
            type: "POST",
            success: (data)=> {
                var inter = setInterval(()=>{
                    $.ajax({
                        url: "/start",
                        type: "POST",
                        success: (dat)=> {
                            var data = JSON.parse(dat)
                            if(data[0] == "start"){
                                clearInterval(inter);
                                $("#ui").hide();
                                cards = data[1]
                                var content = "";
                                for(var x = 0; x < cards.length; x++){
                                    content+= "<span class='item' style='background-color:"+ cards[x].color +"'>" + cards[x].value + "</span>"
                                }
                                $("#items").html(content);
                                $(".item").click((e)=>{
                                    if(e.target.classList.contains("can")){
                                        var act =  $(".active");
                                        if(act[0]) act[0].classList.remove("active");
                                        e.target.classList.add("active")
                                    }
                                })
                                this.roundStart(nick);
                            }
                        }
                    })
                },500)
            }
        })
    }
    roundStart(nick){
        $.ajax({
            url: "/roundStart",
            type: "POST",
            success: (dat) => {
                var data = JSON.parse(dat);
                zaleznosci.color = "";
                zaleznosci.getTwo = 0; 
                zaleznosci.block = false;
                $("#info").html("");
                if(data[1][0] == "newCard") {
                    $("#info").html("Gracz wzial nowa karte<br>")
                    data[1][0].shift()
                }
                for(var x =0; x < data[1].length; x++){
                    if(data[1][x].value == "changeColor"){
                        $("#info")[0].innerHTML += "Zmiana koloru na " + data[1][0].changed;
                        zaleznosci.color = data[1][0].changed;
                    }
                    if(data[1][x].value == "block"){
                        $("#info")[0].innerHTML += "Blokada";
                        zaleznosci.block = true;
                    }
                    if(data[1][x].value == "turnback"){
                        $("#info")[0].innerHTML += "Zwrócona tura";
                        data[1].splice(x,1);
                        x--
                    }
                    if(data[1][x].value == "2+"){
                        $("#info")[0].innerHTML += "Bierzesz 2 karty";
                        zaleznosci.getTwo+= 1;
                    }
                    if(data[1][x].value == "4+"){
                        $("#info")[0].innerHTML += "Bierzesz 4 karty";
                        zaleznosci.getFour+= 1;
                    }
                }
                zaleznosci.lastCard = data[1][data[1].length-1];
                var have = false;
                var get = 0;
                if(zaleznosci.getFour != 0 || zaleznosci.getTwo != 0){

                    for(var z = 0; z < cards.length; z++){
                        if(cards[z].value == "2+" || cards[z].value == "4+" || (cards[z].value == "turnback" && (zaleznosci.color != "" ? cards[z].color == zaleznosci.color : cards[z].color == zaleznosci.lastCard.color))) {
                            have = true;
                            $(".item")[z].classList.add("can");
                        }
                    }
                    if(!have) {
                        get = zaleznosci.getFour *4 + zaleznosci.getTwo *2;
                        for(var z =0; z < get; z++){
                            this.addCard()
                        }
                        for(var z = 0; z < data[1].length; z++){
                            if(data[1][z].value == "2+" || data[1][z].value == "4+"){
                                data[1].splice(z,1);
                                z--;
                            }
                        }
                    }
                }
                var blocked = false;
                if(zaleznosci.block){
                    if(zaleznosci.color != ""){
                        if((cards[z].value == "turnback" && cards[z].color == zaleznosci.color)||cards[z].value == "block"){
                            $(".item")[z].classList.add("can");
                            blocked = true;
                        }
                    } else {
                        if((cards[z].value == "turnback" && cards[z].color == zaleznosci.lastCard.color)|| cards[z].value == "block"){
                            $(".item")[z].classList.add("can");
                            blocked = true;
                        }
                    }
                }
                if(zaleznosci.block && !blocked){
                    for(var z = 0; z < cards.length; z++){
                        if(zaleznosci.block){
                            
                        } else if((zaleznosci.getTwo != 0 || zaleznosci.getFour != 0) && have ) {
                            
                        } else {
                            if(zaleznosci.color != ""){
                                if(cards[z].value == zaleznosci.lastCard.value || cards[z].color == zaleznosci.color){
                                    $(".item")[z].classList.add("can");
                                }
                            } else {
                                if(cards[z].value == zaleznosci.lastCard.value || cards[z].color == zaleznosci.lastCard.color){
                                    $(".item")[z].classList.add("can");
                                }
                            }
                            if(cards[z].value == "4+" || cards[z].value =="changeColor"){
                                $(".item")[z].classList.add("can");
                            }
                        }
                    }
                    if(data[0] == nick){
                        $("#ui").hide();
                    } else {
                        $("#ui").html("Ruch gracza" + data);
                        $("#ui").show();
                    }
                } else {
                    this.next("hit")
                }
               
            }
        })
    }
    next(used){
        $.ajax({
            url: "/next",
            data:{used:used},
            type: "POST",
            success: (dat)=> {
                this.roundStart(this.nick)
            }
        })
    }
    getCard(){
        $.ajax({
            url: "/card",
            type: "POST",
            success: (dat)=> {
                var data = JSON.parse(dat)
                cards.push(data);
                var content = $("#items").html()
                content+= "<span class='item' style='background-color:"+ data.color +"'>" + data.value + "</span>"
                $("#items").html(content);
                $(".item").click((e)=>{
                    if(e.target.classList.contains("can")){
                        var act =  $(".active");
                        if(act[0]) act[0].classList.remove("active");
                        e.target.classList.add("active")
                    }
                })
                this.next("newCard")
            }
        })
    }
    addCard(){
        $.ajax({
            url: "/addCard",
            type: "POST",
            success: (dat)=> {
                var data = JSON.parse(dat)
                cards.push(data);
                var content = $("#items").html()
                content+= "<span class='item' style='background-color:"+ data.color +"'>" + data.value + "</span>"
                $("#items").html(content);
                $(".item").click((e)=>{
                    if(e.target.classList.contains("can")){
                        var act =  $(".active");
                        if(act[0]) act[0].classList.remove("active");
                        e.target.classList.add("active")
                    }
                })
            }
        })
    }
}