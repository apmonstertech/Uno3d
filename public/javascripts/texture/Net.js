
class Net {
    constructor() { }
    sendTexture(name) {
        var obj
        $.ajax({
            url: "/choice",
            data: {
                texture: name,
            },
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