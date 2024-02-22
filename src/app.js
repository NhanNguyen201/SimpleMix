import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

import image1 from '/img2.jpg'
import image2 from '/img3.jpg'
import star from '/star.jpg'

import waveImgShader from './glsl/waveImage';

export default class App {
    constructor({dom}){
        this.dom = dom;
        
        this.scene = new THREE.Scene();
        this.clock = new THREE.Clock()
        this.camera = new THREE.PerspectiveCamera(
          45,
          window.innerWidth / window.innerHeight,
          0.01, 
          100000
        );
    
        this.camera.position.z = 1;
        this.camera.position.y = 0.35;
        this.camera.position.x = -0.75;

        this.ambient = new THREE.AmbientLight({color: 0x757575})
        this.scene.add(this.ambient)
        
        this.img = null
    
        this.renderer = new THREE.WebGLRenderer({
          canvas: this.dom,
          antialias: true
        });
    
        this.renderer.setSize(innerWidth, innerHeight);

       
        

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.onResize();
    }
    
    init(){
        this.addLights()
        this.initImage()
        this.addEvents()
    }
   
    addLights(){
        var lights = [];
        lights[0] = new THREE.DirectionalLight( 0xffffff, 0.55 );
        lights[0].position.set( 3, 0, 0 );

        lights[1] = new THREE.DirectionalLight( 0x11E8BB, 1 );
        lights[1].position.set( 4.75, 8, 0.5 );
       
        lights[2] = new THREE.DirectionalLight( 0x8200C9, 0.5 );
        lights[2].position.set( -2.75, -1, 0.5 );
        lights[3] = new THREE.DirectionalLight( 0xffffff, 0.5 );
        lights[3].position.set( 5, 3, -8 );
        this.scene.add( lights[0] );
        this.scene.add( lights[1] );
        this.scene.add( lights[2] );
        this.scene.add( lights[3] );
    }
    initImage() {
        let imgSize = {
            w: 750, 
            h: 1000
        }
        let sizeVec = new THREE.Vector2(imgSize.w, imgSize.h).normalize()
        this.img = new THREE.Mesh(
            new THREE.PlaneGeometry(sizeVec.x, sizeVec.y, 100, 100),
            new THREE.ShaderMaterial({
                vertexShader:  waveImgShader.vertex,
                fragmentShader: waveImgShader.fragment,
                uniforms: {
                    uTexture1: { type: "sample2D", value: new THREE.TextureLoader().load(image1) },
                    uTexture2: { type: "sample2D", value: new THREE.TextureLoader().load(image2) },
                    uMap: { type: "sample2D", value: new THREE.TextureLoader().load(star) },
                    uTime: { type: 'float', value: 0.0 }
                },
                side: THREE.DoubleSide
            })

        )
        this.scene.add(this.img)
    }
    addEvents() {
        window.requestAnimationFrame(this.run.bind(this));
        window.addEventListener("resize", this.onResize.bind(this), false);
    }
    
    run() {
        requestAnimationFrame(this.run.bind(this));
        this.render();
    }
    
    render() {
        let time = this.clock.getElapsedTime()
       
        this.img.material.uniforms.uTime.value = time / 16.

        this.renderer.render(this.scene, this.camera);

    }
    
    onResize() {
        const w = innerWidth;
        const h = innerHeight;
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
    }
}