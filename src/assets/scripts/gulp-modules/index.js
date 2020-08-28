@@include('./libs.js');

const vertex = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
`;

 const fragment = `
 # define PI 3.14159265359
 
 
 
	varying vec2 vUv;
	uniform vec2 u_resolution;
	uniform vec2 u_mouse;
	uniform float u_time;
	uniform float u_animation;
	uniform sampler2D u_texture;
	uniform sampler2D u_map;
	uniform sampler2D u_sky;
	uniform sampler2D u_weed;
	uniform vec4 res;
	uniform sampler2D disp;


	float rand(vec2 seed) {
		return fract(sin(dot(seed, vec2(12.9898, 78.233))) * 43758.5453123);
	}

	float noise( in vec2 st) {
		vec2 i = floor(st);
		vec2 f = fract(st);

		// Four corners in 2D of a tile
		float a = rand(i);
		float b = rand(i + vec2(1.0, 0.0));
		float c = rand(i + vec2(0.0, 1.0));
		float d = rand(i + vec2(1.0, 1.0));

		vec2 u = f * f * (3.0 - 2.0 * f);

		return mix(a, b, u.x) +
			(c - a) * u.y * (1.0 - u.x) +
			(d - b) * u.x * u.y;
	}
	
	
	
	
	
	
	
	
	
	
	void main() {
		
		vec2 uv = 0.5 * gl_FragCoord.xy / (res.xy);
		vec2 myUV = (uv - vec2(0.5)) * res.zw + vec2(0.5);


		// ******* mASK
		
  	// vec4 disp = texture2D(disp, myUV);
  	// vec2 dispVec = vec2(disp.r, disp.g);
			
				
		// 			float m = (u_mouse.x / u_resolution.x - 0.1) * 0.05;
		// 			float mSky = (u_mouse.x / u_resolution.x - 1.0) * -0.005;
		// 			float mWeed = (u_mouse.x / u_resolution.x - 1.0) * -0.001;
		// 			float mWeedY = (u_mouse.y / u_resolution.y - 1.0) * -0.001;


		//  			float distort = sin(myUV.y * 10.0 + u_time) * 0.3 + m;
		//  			float distortX = sin(myUV.x*100.0 + u_time)*0.003 + mSky;
		//  			float distortWeed = sin(myUV.y*5.0 + u_time)*0.003 + mWeed;


		// 			float map  = vec4(texture2D(u_map, myUV)).r;
		// 			float sky  = vec4(texture2D(u_sky, myUV)).r;
		// 			float weed  = vec4(texture2D(u_weed, myUV)).r;


		// 			vec4 foto = vec4(texture2D(u_texture, vec2(
		// 																							myUV.x +
		// 																								 distortWeed * weed +
		// 																								 distortX * sky +
		// 																								 distort * map * disp.r,
		// 																							myUV.y +
		// 																								 weed * mWeedY

		// 																								 )));
		// 			gl_FragColor = vec4(foto.rgb, 1.0);

		
		// * transition animate
		
		// vec4 disp = texture2D(disp, myUV);
		// vec2 dispVec = vec2(disp.r, disp.g);
		
		// vec4 foto = vec4(texture2D(u_texture, myUV * (1.0 - dispVec * u_animation)));
		// gl_FragColor = vec4(foto.rgb, 1.0);
		
		// * transition animate

		vec2 st = gl_FragCoord.xy / u_resolution.xy;

		float scale = 1.0;
		float offset = 0.05;

		// float angle = noise(st + (u_time * 0.005)+( (u_mouse * 0.5) * 2.4) * 0.3);
		float angle = noise(st + u_time * 0.01) * 8.0;
		float radius = offset;

		st *= scale;
		st += radius * vec2(cos(angle  + u_mouse.x * 0.001), sin(angle  + u_mouse.y * 0.001));
		

		vec2 positionMouse = (u_mouse / u_resolution - 0.5) * 0.07;


		 vec4 color = texture2D(u_texture, st + 0.1 + positionMouse);

		 gl_FragColor = color;
		


















	}

 `;



const imageUrl = '/assets/images/qw.jpg';
const dispImage = '/assets/images/10.jpg';
const parent = document.querySelector('.parent');
let renderer, scene, camera, uniforms, object, a1, a2, mat;
const imagesRatio = parent.offsetHeight / parent.offsetWidth;
let mouse = {
	 x: 0,
	 y: 0
 }
 /**********************************/
/*
* initWebGL function start
*/
function initWebGL(){

	/* scene */
	scene = new THREE.Scene();
	/*  */
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
	/*  */
	/* renderer */
	renderer = new THREE.WebGLRenderer({
		antialias: false,
		alpha: true
	});
	renderer.setPixelRatio(2.0);
	renderer.setClearColor(0xffffff, 0.0);
	renderer.setSize(parent.offsetWidth, parent.offsetHeight);
	parent.appendChild(renderer.domElement);
	/*  */
	/* loader */
	const loader = new THREE.TextureLoader();
	  loader.crossOrigin = '';

	  let disp = loader.load(dispImage, render);
	  disp.magFilter = disp.minFilter = THREE.LinearFilter;
	/*  */
	
	/* image aspect */
	checkAspect();
	/*  */

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
				 disp: {
				 	type: 't',
				 	value: disp
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
	/*  */
	/* matireal shaders */
	mat = new THREE.ShaderMaterial({
		uniforms,
		vertexShader: vertex,
		fragmentShader: fragment,
		transparent: true,
		opacity: 1.0,
	});
	/*  */
	const geometry = new THREE.PlaneBufferGeometry(parent.offsetWidth, parent.offsetHeight, 1);
	/*  */
	object = new THREE.Mesh(geometry, mat);
	/*  */
	scene.add(object);


	/* initWebGL handlers */
	onWindowResize();
	window.addEventListener('resize', onWindowResize, false);
	
}


/*  */
function checkAspect() {
	if (parent.offsetHeight / parent.offsetWidth < imagesRatio) {
		a1 = 1;
		a2 = parent.offsetHeight / parent.offsetWidth / imagesRatio;
	} else {
		a1 = (parent.offsetWidth / parent.offsetHeight) * imagesRatio;
		a2 = 1;
	}
}
/*  */
/*  */
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
/*  */
/*  */
var render = function () {
	// This will be called by the TextureLoader as well as TweenMax.
	uniforms.u_time.value += 0.5;
	renderer.render(scene, camera);
};
/* */
/*  */
var MyTexture = new THREE.TextureLoader().load(imageUrl, function () {
	initWebGL();
	animate();
});
/*  */
/*  */
function animate() {
	requestAnimationFrame(animate);
	render();
}
/*  */
/*  */
document.onmousemove = getMouseXY;
function getMouseXY(e) {
	mouse.x = e.pageX;
	mouse.y = e.pageY;
	uniforms.u_mouse.value.x = mouse.x;
	uniforms.u_mouse.value.y = mouse.y;
}


 parent.addEventListener('mouseenter', transitionIn);
 parent.addEventListener('touchstart', transitionIn);
 parent.addEventListener('mouseleave', transitionOut);
 parent.addEventListener('touchend', transitionOut);

  function transitionIn() {
		console.log(2);
  	TweenMax.to(mat.uniforms.u_animation, 1, {
  		value: 1,
  		onUpdate: render,
  		onComplete: render,
  	});
	}
	
	function transitionOut() {
		TweenMax.to(mat.uniforms.u_animation, 1, {
			value: 0,
			onUpdate: render,
			onComplete: render,
		});
	}


/*  */
/*
* initWebGL function end
*/
/**********************************/



