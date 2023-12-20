<template>
    <div id="dummy"></div>
</template>

<script>
    import * as THREE from "three-full";
    import {
        Scene,
        HemisphereLight,
        PerspectiveCamera,
        Color,
        WebGLRenderer,
        OrbitControls,
        MeshStandardMaterial,
        GLTFLoader,
        LightProbe,
        LightProbeGenerator,
        DirectionalLight
    } from "three-full";
    export default {
        name: 'Dummy3D',
        data() {
            return {
                global: {
                    scene: null,
                    loader: null,
                    camera: null,
                    renderer: null,
                    controls: null,
                },
                models: {
                    man: null,
                    woman:null
                },
                activeModel: null,
                controls: {
                    lightProbeIntensity: 1.0,
                    directionalLightIntensity: 0.2,
                    envMapIntensity: 1
                },
                activeClothes: {
                    bodyFront: {
                        color: null,
                        active: null,
                        path: 'models/man/front'
                    },
                    bodyBack: {
                        color: null,
                        active: null,
                        path: 'models/man/back'
                    },
                    bodyNeck: {
                        color: null,
                        active: null,
                        path: 'models/man/neck'
                    },
                    leftArm: {
                        color: null,
                        active: null,
                        path: 'models/man/sleeves/left'
                    },
                    rightArm: {
                        color: null,
                        active: null,
                        path: 'models/man/sleeves/right'
                    },
                    legs: {
                        color: null,
                        active: null,
                        path: 'models/man/legs'
                    }
                }
            }
        },
        methods: {
            init: function () {
                let t = this
                let global = this.global

                global.scene = new Scene()
                const hemiLight = new HemisphereLight( 0xffffff, 0x444444 );
                hemiLight.position.set( 0, 20, 0 );
                global.scene.add( hemiLight );
                global.scene.background = new Color(0x7d7d7d); //new THREE.TextureLoader().load(require('@/assets/dummy-bg.png'));
                let lightProbe = new LightProbe();
				global.scene.add( lightProbe );
                let directionalLight = new DirectionalLight( 0xffffff, this.controls.directionalLightIntensity );
				directionalLight.position.set( 10, 10, 10 );
				global.scene.add( directionalLight );

                global.loader = new GLTFLoader();
                global.loader.load('models/maneken/man.glb', function ( gltf ) {
                    t.models.man = gltf.scene;
                    global.loader.load( 'models/maneken/woman.glb', function ( gltf ) {
                        t.models.woman = gltf.scene;
                        t.$eventHub.$emit('dummy:dummy_load');
                    });
                    /*let modelColor = new MeshStandardMaterial({color: 0x999999});
                    t.models.man.traverse(function (object3D){
                        if (object3D.isMesh) {
                            object3D.material = modelColor;
                        }
                    });*/
                });
                global.camera = new PerspectiveCamera(
                    45,
                    t.$el.offsetWidth / t.$el.offsetHeight,
                    1,
                    100
                )
                global.camera.position.set( 0, 3.7, 1 );
 
                global.renderer = new WebGLRenderer( { antialias: true } )
                global.renderer.setSize(t.$el.offsetWidth, t.$el.offsetHeight)
                //this.renderer.outputEncoding = 3001; //THREE.sRGBEncoding;
                global.renderer.shadowMap.enabled = true;
                global.renderer.toneMapping = THREE.NoToneMapping;
				//global.renderer.outputEncoding = THREE.sRGBEncoding;
                t.$el.appendChild(global.renderer.domElement)

                global.controls = new OrbitControls( global.camera, global.renderer.domElement );
                global.controls.enablePan = true;
                global.controls.screenSpacePanning = true;
                global.controls.enableZoom = true;
                global.controls.enableRotate = true;
                global.controls.minPolarAngle = Math.PI / 2.2; //Math.PI/2;
                global.controls.maxPolarAngle = Math.PI / 1.8; //Math.PI/2;
                global.controls.target.set( 0, 1, 0 );
                global.controls.update();

                //let gui = new GUI();
            },
            animate: function () {
                requestAnimationFrame(this.animate)
                this.global.renderer.render(this.global.scene, this.global.camera)
            },
            resize: function () {
                this.global.renderer.setSize(this.$el.offsetWidth, this.$el.offsetHeight);
                this.global.camera.aspect = this.$el.offsetWidth / this.$el.offsetHeight;
                this.global.camera.updateProjectionMatrix();
                this.global.renderer.render(this.global.scene, this.global.camera);
            },
            reloadsex: function (sex) {
                if (this.activeModel) {
                    this.global.scene.remove(this.activeModel);
                }
                if (sex === 'man') {
                    this.activeModel = this.models.man;
                } else {
                    this.activeModel = this.models.woman;
                }
                this.global.scene.add(this.activeModel);
            },
            changeClothes: function (type, modelName, color = false) {
                let t = this
                if (type in this.activeClothes) {
                    this.global.loader.load( this.activeClothes[type].path + '/' + modelName + '.glb', function(gltf) {
                        t.global.scene.remove(t.activeClothes[type].active)
                        t.activeClothes[type].active = gltf.scene
                        t.global.scene.add(t.activeClothes[type].active)
                        if (color) {
                            t.changecolor(type, color)
                        }
                    }) 
                }
            },
            changecolor: function (type, color) {
                let newcolor = new MeshStandardMaterial({color: Number(color.replace('#', '0x'))});
                this.activeClothes[type].active.traverse(function (object3D){
                    if (object3D.isMesh) {
                        object3D.material = newcolor;
                    }
                });
            },
            cleanModelByType: function (type, modelName, color = false) {
                if (type in this.activeClothes) {
                    this.global.scene.remove(this.activeClothes[type].active)
                    this.activeClothes[type].active = null
                    this.activeClothes[type].color = null
                }
            },
            cleanModel: function () {
                for (let i in this.activeClothes) {
                    this.activeClothes[i].color = null
                    this.global.scene.remove(this.activeClothes[i].active)
                    this.activeClothes[i].active = null
                }
            }
        },
        mounted() {
            this.init();
            this.animate();
            window.addEventListener(
                "resize",
                () => {
                    this.resize();
                },
                true
            );
            this.$eventHub.$on('dummy:dummy_load', () => {
                this.reloadsex('man');
            }).$on('sexchecker', (value) => {
                this.reloadsex(value);
                this.cleanModel();
            }).$on('dummy:dummy_reload_tshirt', (type, modelName, color = null) => {
                this.changeClothes(type, modelName, color);
            }).$on('dummy:changecolor_tshirt', (element, color) => {
                this.changecolor(element, color);
            }).$on('dummy:clean_model_by_type', (type, modelName, color = null) => {
                this.cleanModelByType(type, modelName, color);
            }).$on('dummy:clean_model', () => {
                this.cleanModel();
            });
        }
    }
</script>

