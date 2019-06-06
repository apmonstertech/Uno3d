
class NetTexture {
    constructor() {
    }
    ready(nick){
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
                                var cards = data[1]
                                var content = "";
                                for(var x = 0; x < cards.length; x++){
                                    content+= "<span class='item' style='background-color:"+ cards[x].color +"'>" + cards[x].value + "</span>"
                                }
                                $("#items").html(content);
                                $(".item").click((e)=>{
                                    var act =  $(".active");
                                    if(act[0]) act[0].classList.remove("active");
                                    e.target.classList.add("active")
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
            success: function (data) {
                console.log(data,nick)
                if(data == nick){
                    $("#ui").hide();
                } else {
                    $("#ui").html("Ruch gracza" + data);
                    $("#ui").show();
                }
            }
        })
    }
    getCard(){
        $.ajax({
            url: "/card",
            type: "POST",
            success: function (dat) {
                var data = JSON.parse(dat)
                var content = $("#items").html()
                content+= "<span class='item' style='background-color:"+ data.color +"'>" + data.value + "</span>"
                $("#items").html(content);
                $(".item").click((e)=>{
                    var act =  $(".active");
                    if(act[0]) act[0].classList.remove("active");
                    e.target.classList.add("active")
                })
            }
        })
    }
}