
class Net {
    constructor() { }
    sendTexture(name) {
        var obj
        $.ajax({
            url: "/world",
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