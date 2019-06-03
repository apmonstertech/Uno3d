
			var camera, scene, renderer, controls;

			var objects = [];
			var little = [];
			var raycaster;

			var moveForward = false;
			var moveBackward = false;
			var moveLeft = false;
			var moveRight = false;
			var canJump = false;
			var lookAtVector = new THREE.Vector3(0,0, -1);
			var prevTime = performance.now();
			var velocity = new THREE.Vector3();
			var direction = new THREE.Vector3();
			var vertex = new THREE.Vector3();
			var color = new THREE.Color();
			init();
			animate();
			function addItem(){
				var items = $(".item")
				for(var x = 0; x < items.length; x++){
					var item = items[x];
					if(item.innerHTML == ""){
						item.innerHTML = "YOLO";
						break;
					}
				}
			}
			function addBlock(pos){
				var boxGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
				boxGeometry = boxGeometry.toNonIndexed(); // ensure each face has unique vertices
				var boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors } );
				boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
				var box = new THREE.Mesh( boxGeometry, boxMaterial );
				box.position.set(pos.x,pos.y,pos.z)
				scene.add(box);
				objects.push(box);
			}
			function init() {
				$(".item")[0].classList.add("active")
				camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 1, 1000 );

				scene = new THREE.Scene();
				scene.background = new THREE.Color( 0xffffff );
				scene.fog = new THREE.Fog( 0xffffff, 0, 750 );

				var light = new THREE.HemisphereLight( 0xeeeeff, 0x777788, 0.75 );
				light.position.set( 0.5, 1, 0.75 );
				scene.add( light );

				controls = new THREE.PointerLockControls( camera );

				var blocker = document.getElementById( 'blocker' );
				var instructions = document.getElementById( 'instructions' );

				instructions.addEventListener( 'click', function () {

					controls.lock();

				}, false );

				controls.addEventListener( 'lock', function () {

					instructions.style.display = 'none';
					blocker.style.display = 'none';

				} );

				controls.addEventListener( 'unlock', function () {

					blocker.style.display = 'block';
					instructions.style.display = '';

				} );

				scene.add( controls.getObject() );

				var onKeyDown = function ( event ) {
					switch ( event.keyCode ) {
						case 49: 
						case 50: 
						case 51: 
						case 52: 
						case 53:
						case 54: 
						case 55: 
						case 56: 
						case 57: 
							var act = $(".active");
							if(act[0])act[0].classList.remove("active");
							$("#it" + event.key).addClass("active");
							break;

						case 38: // up
						case 87: // w
							moveForward = true;
							break;

						case 37: // left
						case 65: // a
							moveLeft = true;
							break;

						case 40: // down
						case 83: // s
							moveBackward = true;
							break;

						case 39: // right
						case 68: // d
							moveRight = true;
							break;

						case 32: // space
							if ( canJump === true ) velocity.y += 350;
							canJump = false;
							break;

					}

				};

				var onKeyUp = function ( event ) {

					switch ( event.keyCode ) {

						case 38: // up
						case 87: // w
							moveForward = false;
							break;

						case 37: // left
						case 65: // a
							moveLeft = false;
							break;

						case 40: // down
						case 83: // s
							moveBackward = false;
							break;

						case 39: // right
						case 68: // d
							moveRight = false;
							break;

					}

				};

				document.addEventListener( 'keydown', onKeyDown, false );
				document.addEventListener( 'keyup', onKeyUp, false );
				document.addEventListener( 'mousedown', function (event) {
					var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
					var mouseVector = new THREE.Vector2() // ten wektor czyli pozycja w przestrzeni 2D na ekranie(x,y) wykorzystany będzie do określenie pozycji myszy na ekranie a potem przeliczenia na pozycje 3D
					mouseVector.x = (event.clientX / window.innerWidth) * 2 - 1;
					mouseVector.y = -(event.clientY / window.innerHeight) * 2 + 1;
					var raycaster = new THREE.Raycaster(); // obiekt symulujący "rzucanie" promieni
					raycaster.setFromCamera(mouseVector, camera);
					var intersects = raycaster.intersectObjects(scene.children,true);
					if(event.which == 1){
						if (intersects.length > 0) {
							if(intersects[0].distance < 50){
								console.log("little")
								intersects[0].object.scale.set(0.1,0.1,0.1);
								intersects[0].object.position.y = 2	
								intersects[0].object.name = "little";
								little.push(intersects[0].object)
							}
						}
					}
					
					if(event.which == 3){
						var act = $(".active")
						if(act[0].innerHTML != ""){
							if (intersects.length > 0) {
								if(intersects[0].distance < 50){
									var obj = intersects[0].object.clone();
									addBlock(obj.position)
									act[0].innerHTML = "";
								}
							}
						}
					}
				})

				raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

				// floor

				var floorGeometry = new THREE.PlaneBufferGeometry( 2000, 2000, 100, 100 );
				floorGeometry.rotateX( - Math.PI / 2 );

				// vertex displacement

				var position = floorGeometry.attributes.position;

				for ( var i = 0, l = position.count; i < l; i ++ ) {

					vertex.fromBufferAttribute( position, i );

					vertex.x += Math.random() * 20 - 10;
					vertex.y += Math.random() * 2;
					vertex.z += Math.random() * 20 - 10;

					position.setXYZ( i, vertex.x, vertex.y, vertex.z );

				}

				floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

				position = floorGeometry.attributes.position;
				var colors = [];

				for ( var i = 0, l = position.count; i < l; i ++ ) {

					color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
					colors.push( color.r, color.g, color.b );

				}

				floorGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

				var floorMaterial = new THREE.MeshBasicMaterial( { vertexColors: THREE.VertexColors } );

				var floor = new THREE.Mesh( floorGeometry, floorMaterial );
				scene.add( floor );

				// objects

				var boxGeometry = new THREE.BoxBufferGeometry( 20, 20, 20 );
				boxGeometry = boxGeometry.toNonIndexed(); // ensure each face has unique vertices

				position = boxGeometry.attributes.position;
				colors = [];

				for ( var i = 0, l = position.count; i < l; i ++ ) {

					color.setHSL( Math.random() * 0.3 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );
					colors.push( color.r, color.g, color.b );

				}

				boxGeometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );

				for ( var i = 0; i < 500; i ++ ) {

					var boxMaterial = new THREE.MeshPhongMaterial( { specular: 0xffffff, flatShading: true, vertexColors: THREE.VertexColors } );
					boxMaterial.color.setHSL( Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75 );

					var box = new THREE.Mesh( boxGeometry, boxMaterial );
					box.position.x = Math.floor( Math.random() * 20 - 10 ) * 20;
					box.position.y = Math.floor( Math.random() * 20 ) * 20 + 10;
					box.position.z = Math.floor( Math.random() * 20 - 10 ) * 20;

					scene.add( box );
					objects.push( box );

				}

				//

				renderer = new THREE.WebGLRenderer( { antialias: true } );
				renderer.setPixelRatio( window.devicePixelRatio );
				renderer.setSize( window.innerWidth, window.innerHeight );
				document.body.appendChild( renderer.domElement );

				//

				window.addEventListener( 'resize', onWindowResize, false );

			}

			function onWindowResize() {

				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();

				renderer.setSize( window.innerWidth, window.innerHeight );

			}

			function animate() {

				requestAnimationFrame( animate );

				if ( controls.isLocked === true ) {
					lookAtVector.applyQuaternion(camera.quaternion);

					raycaster.ray.origin.copy( controls.getObject().position );
					raycaster.ray.origin.y -= 10;
					var raycasterC = new THREE.Raycaster();
					var ray = new THREE.Ray(controls.getObject().position, lookAtVector)
					raycasterC.ray = ray
					var intersectsC = raycasterC.intersectObjects(little, true);
					if (intersectsC[0]) {
						if(intersectsC[0].distance < 20 && intersectsC[0].object.name =="little"){
							addItem()
							scene.remove(intersectsC[0].object)
							for(var x = 0; x < little.length; x++){
								if(JSON.stringify(little[x]) == JSON.stringify(intersectsC[0].object)) {
									little.splice(x,1)
									break;
								}
							}
						}
					}
					var intersections = raycaster.intersectObjects( objects );
					var onObject = intersections.length > 0;

					if(!onObject || intersections[0].distance >4){
						var time = performance.now();
						var delta = ( time - prevTime ) / 1000;
						velocity.x -= velocity.x * 5.0 * delta;
						velocity.z -= velocity.z * 5.0 * delta;
	
						velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass
						direction.z = Number( moveForward ) - Number( moveBackward );
						direction.x = Number( moveLeft ) - Number( moveRight );
						direction.normalize(); // this ensures consistent movements in all directions
	
						if ( moveForward || moveBackward ) velocity.z -= direction.z * 600.0 * delta;
						if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
	
						if ( onObject === true ) {
	
							velocity.y = Math.max( 10, velocity.y );
							canJump = true;
	
						}
						controls.getObject().translateX( velocity.x * delta );
						controls.getObject().position.y += ( velocity.y * delta ); // new behavior
						controls.getObject().translateZ( velocity.z * delta );
	
						if ( controls.getObject().position.y < 5) {
							velocity.y = 0;
							controls.getObject().position.y = 5;
							canJump = true;
						}
	
						prevTime = time;
					} else {
						controls.getObject().position.y +=3
					}
				}
				for(var x =0 ; x < little.length; x++){
					little[x].rotation.y+= 0.1
				}
				renderer.render( scene, camera );

			}
