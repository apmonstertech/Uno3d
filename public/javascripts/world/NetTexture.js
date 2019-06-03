
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
                console.log(data)
            },
            error: function (xhr, status, error) {
                console.log(xhr);
            }
        });
    }
}