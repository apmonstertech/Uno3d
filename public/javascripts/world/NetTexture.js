
class NetTexture {
    constructor() {
        this.getTexture()
    }
    getTexture() {
        var obj
        $.ajax({
            url: "/world",
            type: "POST",
            success: function (data) {
                var cards = JSON.parse(data)
                // JSON.parse(data).map(m => {
                //     cards.push({ "value": m.value, "color": m.color })
                // })
                console.log(cards)
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            }
        });
    }
}