$(document).ready(function () {
    var net = new Net()
    $(".img_texture").on("click", (e) => {
        console.log(e.target.name)
        net.sendTexture(e.target.name)
    })
})