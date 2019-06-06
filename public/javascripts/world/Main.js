var zaleznosci= {};
$(document).ready(function () {
    mainMove = {
        nick: "",
        root: $("#root"),
        renderer: new THREE.WebGLRenderer({ antialias: true }),
        scene: new THREE.Scene(),
        camera: new THREE.PerspectiveCamera(
            45,    // kąt patrzenia kamery (FOV - field of view)
            $(document).width() / $(document).height(),    // proporcje widoku, powinny odpowiadać proporjom naszego ekranu przeglądarki
            0.1,    // minimalna renderowana odległość
            10000    // maxymalna renderowana odległość od kamery 
        ),
        // camera: new THREE.OrthographicCamera(
        //     window.innerWidth / -2,
        //     window.innerWidth / 2,
        //     window.innerHeight / 2,
        //     window.innerHeight / -2,
        //     0, // minimalny zasięg musi być >= 0
        //     10000
        // ),
        raycasterOver: new THREE.Raycaster(),
        mouseVectorOver: new THREE.Vector2(),
        raycaster: new THREE.Raycaster(),
        mouseVector: new THREE.Vector2(),
        planeGeometry: new THREE.PlaneGeometry(1000, 1000, 30, 30),
        planeMaterial: new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load('mats/table.jpg'), side: THREE.DoubleSide }),
        geometrySp: new THREE.SphereGeometry(5, 5, 5),
        materialSp: new THREE.MeshBasicMaterial({ color: 0xffff00 }),
        directionalLight: new THREE.DirectionalLight(0xffffff, 1),
        net: new NetTexture(),
        init: function () {
            $("#ready").click(()=>{
                this.nick = $("#nick").val()
                this.net.ready(this.nick);
                $("#wait").html("OCZEKIWANIE");
            })
            
            this.renderer.setClearColor(0xffffff);
            this.renderer.setSize($(document).width(), $(document).height());
            this.root.append(this.renderer.domElement);
            this.camera.position.set(0, 400, 500)
            this.addResizeListener()
            this.mouseOver()
            this.addRaycaster()
            var stack = new Stack
            this.scene.add(stack)
            this.directionalLight.position.set(200, 200, -200)
            this.scene.add(this.directionalLight)
            var plane = new THREE.Mesh(this.planeGeometry, this.planeMaterial)
            plane.rotation.x = Math.PI / 2
            this.scene.add(plane)
            this.orbit()
            this.render()
        },
        render: function () {
            requestAnimationFrame(this.render.bind(this))
            this.renderer.render(this.scene, this.camera)
            if (this.player) {

                this.camera.position.x = this.player.getPlayerCont().position.x
                this.camera.position.z = this.player.getPlayerCont().position.z + 200
                this.camera.position.y = this.player.getPlayerCont().position.y + 300
                this.camera.lookAt(this.player.getPlayerCont().position)
            }
        },
        addResizeListener: function () {
            $(window).on("resize", () => {
                this.camera.aspect = window.innerWidth / window.innerHeight
                this.camera.updateProjectionMatrix()
                this.renderer.setSize(window.innerWidth, window.innerHeight)
            })
        },
        addRaycaster: function () {
            $(document).mousedown((e) => {
                this.move(e)
            })
        },
        connect(){

        },
        orbit() {
            var orbitControl = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.renderer.render(this.scene, this.camera)
        },
        move(e) {
            this.raycaster.setFromCamera(this.mouseVector, this.camera)
            this.mouseVector.x = (e.clientX / $(window).width()) * 2 - 1
            this.mouseVector.y = -(e.clientY / $(window).height()) * 2 + 1

            this.raycaster.setFromCamera(this.mouseVector, this.camera)
            
            this.intersects = this.raycaster.intersectObjects(this.scene.children, true)
            this.activeMesh
            if (this.intersects.length > 0) {
                if (this.intersects[0].object.type == "Mesh") {
                    console.log("LOOLL")
                    if (this.intersects[0].object.name == "STACK") {
                        this.net.getCard();
                    }
                    else {
                        if (this.activeMesh) {
                            this.activeMesh.material[2].color.set("white")
                        }
                        // for (let i in this.obj) {
                        //     this.obj[i].unHover()
                        // }
                    }
                }

            }
        },
        mouseOver: function () {
            $(document).mousemove((e) => {
                if (e.target.tagName == "CANVAS") {
                    this.over(e)
                }
            })
        },
        over(e) {
            this.raycasterOver.setFromCamera(this.mouseVectorOver, this.camera)
            this.mouseVectorOver.x = (e.clientX / $(window).width()) * 2 - 1
            this.mouseVectorOver.y = -(e.clientY / $(window).height()) * 2 + 1

            this.intersects2 = this.raycasterOver.intersectObjects(this.scene.children, true)
            this.activeMesh
            if (this.intersects2.length > 0) {
                if (this.intersects2[0].object.type == "Mesh") {
                    if (this.intersects2[0].object.name == "STACK") {
                        this.intersects2[0].object.material[2].color.set("yellow")
                        this.activeMesh = this.intersects2[0].object
                        // this.intersects2[0].object.material.color.set("red")
                    }
                    else {
                        if (this.activeMesh) {
                            this.activeMesh.material[2].color.set("white")
                        }
                        // for (let i in this.obj) {
                        //     this.obj[i].unHover()
                        // }
                    }
                }

            }
            else {
                //this.intersects2[0].object.material.color.set("white")
                // for (let i in this.obj) {
                //     this.obj[i].unHover()
                // }
            }
        },
    }
    mainMove.init()
})

