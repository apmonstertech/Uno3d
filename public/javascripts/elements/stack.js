class Stack extends THREE.Object3D {
    constructor() {
        var geometryBlock = new THREE.BoxGeometry(30, 2, 50)
        super()
        var meshA = new THREE.Mesh(geometryBlock)
        var meshB1 = new THREE.Mesh(geometryBlock)
        var meshB2 = new THREE.Mesh(geometryBlock)
        var meshB3 = new THREE.Mesh(geometryBlock)
        var meshB4 = new THREE.Mesh(geometryBlock)
        meshA.position.y = 1.3
        meshB1.position.y = 3.7
        meshB2.position.y = 5.9
        meshB3.position.y = 8.1
        meshB4.position.y = 10.3

        var singleGeometry = new THREE.Geometry();

        meshA.updateMatrix(); // bez tego pozycja geometrii jest zawsze 0,0,0
        singleGeometry.merge(meshA.geometry, meshA.matrix);

        meshB1.updateMatrix();
        singleGeometry.merge(meshB1.geometry, meshB1.matrix);
        // meshB1.material = new THREE.MeshPhongMaterial({
        //     side: THREE.DoubleSide,
        //     color: "red",
        //     transparent: true
        // })
        meshB2.updateMatrix();
        singleGeometry.merge(meshB2.geometry, meshB2.matrix);
        meshB3.updateMatrix();
        singleGeometry.merge(meshB3.geometry, meshB3.matrix);
        meshB4.updateMatrix();
        singleGeometry.merge(meshB4.geometry, meshB4.matrix);
        var materials = [];

        materials.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: "black" }));
        materials.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: "black" }));
        materials.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, map: new THREE.TextureLoader().load('mats/unoPlus.jpg') }));
        materials.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: "black" }));
        materials.push(new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, color: "black" }));

        // var material = new THREE.MeshPhongMaterial({
        //     side: THREE.DoubleSide,
        //     // color: "red",

        //     transparent: true
        // })
        this.singleMesh = new THREE.Mesh(singleGeometry, materials);
        this.singleMesh.name = "STACK"
        return this.singleMesh
    }

}