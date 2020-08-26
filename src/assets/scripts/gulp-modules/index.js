@@include('./libs.js');

  const vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

 const fragment = `
	varying vec2 vUv;
	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform float u_time;
	uniform sampler2D u_texture;
	uniform sampler2D u_map;
	uniform sampler2D u_sky;
	uniform sampler2D u_weed;
	uniform vec4 res;

	void main() {
			// gl_FragColor = vec4(vec3(0.0,0.0,abs(cos(u_time*0.5))),1.0);
			// vec2 st = gl_FragCoord.xy/u_resolution;
			// gl_FragColor = vec4(st.x,st.y,0.0,1.0);


			vec2 uv = 0.5 * gl_FragCoord.xy / (res.xy);
			vec2 myUV = (uv - vec2(0.5)) * res.zw + vec2(0.5);
			
			
			
			
			
			
			
			
			
			
			
			


					float m = (u_mouse.x / u_resolution.x - 0.8) * 0.003;
					float mSky = (u_mouse.x / u_resolution.x - 1.0) * -0.005;
					float mWeed = (u_mouse.x / u_resolution.x - 1.0) * -0.001;
					float mWeedY = (u_mouse.y / u_resolution.y - 1.0) * -0.001;


		 			float distort = sin(myUV.y*100.0 + u_time)*0.003 + m;
		 			float distortX = sin(myUV.x*100.0 + u_time)*0.003 + mSky;
		 			float distortWeed = sin(myUV.y*5.0 + u_time)*0.003 + mWeed;


					float map  = vec4(texture2D(u_map, myUV)).r;
					float sky  = vec4(texture2D(u_sky, myUV)).r;
					float weed  = vec4(texture2D(u_weed, myUV)).r;


					vec4 foto = vec4(texture2D(u_texture, vec2(myUV.x + distortWeed*weed + distortX*sky + distort*map, myUV.y + weed*mWeedY)));
					gl_FragColor = vec4(foto.rgb, 1.0);
	}

 `;



var mouse = {
	x: 0,
	y: 0
}

var parent = document.querySelector('.parent');
var renderer, scene, camera, uniforms;
var imagesRatio = parent.offsetHeight / parent.offsetWidth;
/**********************************/
/*
* init function start
*/
function init(){

	/* scene */
	scene = new THREE.Scene();
	/* camera */
	camera = new THREE.OrthographicCamera(
		parent.offsetWidth / -2,
		parent.offsetWidth / 2,
		parent.offsetHeight / 2,
		parent.offsetHeight / -2,
		1,
		1000
	);
		camera.position.z = 1;
		
	/* renderer */
	renderer = new THREE.WebGLRenderer({
		antialias: false,
		alpha: true
	});

	renderer.setPixelRatio(2.0);
	renderer.setClearColor(0xffffff, 0.0);
	renderer.setSize(parent.offsetWidth, parent.offsetHeight);
	parent.appendChild(renderer.domElement);

	/* loader */
	var loader = new THREE.TextureLoader();
	
	
	/* image aspect */
	let a1, a2;
	let imageAspect = imagesRatio;
	checkAspect();


	/* uniform data */
	uniforms = {
		u_time: {
			type: "f",
			value: 1.0
			},
			u_animation: {
				type: "f",
				value: 0.0
			},
			u_mouse: {
				type: "v2",
				value: new THREE.Vector2()
			},
			u_resolution: {
				type: "v2",
				value: new THREE.Vector2()
			},
			u_size: {
				type: "v2",
				value: new THREE.Vector2(parent.offsetWidth, parent.offsetHeight)
			},
			 res: {
				 type: 'vec4',
				 value: new THREE.Vector4(parent.offsetWidth, parent.offsetHeight, a1, a2)
			 },
			 u_texture: {
				 value: MyTexture,
				},
			u_map: {
				value: loader.load("/assets/images/123.jpg")
			},
			u_sky: {
				value: loader.load("/assets/images/sky.jpg")
			},
			u_weed: {
				value: loader.load("/assets/images/weed.jpg")
			},
	};
	/* matireal shaders */
	var mat = new THREE.ShaderMaterial({
		uniforms,
		vertexShader: vertex,
		fragmentShader: fragment,
		transparent: true,
		opacity: 1.0,
	});
	/*  */
	var geometry = new THREE.PlaneBufferGeometry(parent.offsetWidth, parent.offsetHeight, 1);
	/*  */
	var object = new THREE.Mesh(geometry, mat);
	/*  */
	scene.add(object);


	/* init handlers */
	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);
	
	function onWindowResize(event) {
		uniforms.u_resolution.value.x = renderer.domElement.width;
		uniforms.u_resolution.value.y = renderer.domElement.height;
		uniforms.u_mouse.value.x = mouse.x;
		uniforms.u_mouse.value.y = mouse.y;
		
		checkAspect();
		object.material.uniforms.res.value = new THREE.Vector4(parent.offsetWidth, parent.offsetHeight, a1, a2);
		renderer.setSize(parent.offsetWidth, parent.offsetHeight);


		render();

	}
	function checkAspect() {
		if (parent.offsetHeight / parent.offsetWidth < imageAspect) {
			a1 = 1;
			a2 = parent.offsetHeight / parent.offsetWidth / imageAspect;
		} else {
			a1 = (parent.offsetWidth / parent.offsetHeight) * imageAspect;
			a2 = 1;
		}
	}
}	
/*
* init function end
*/
/**********************************/



var render = function () {
	// This will be called by the TextureLoader as well as TweenMax.
	uniforms.u_time.value += 0.05;
	renderer.render(scene, camera);
};

var MyTexture = new THREE.TextureLoader().load('/assets/images/foto.jpg', function () {
	init();
	animate();
});


function animate() {
	requestAnimationFrame(animate);
	render();
}


document.onmousemove = getMouseXY;

function getMouseXY(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
	uniforms.u_mouse.value.x = mouse.x;
	uniforms.u_mouse.value.y = mouse.y;
}








