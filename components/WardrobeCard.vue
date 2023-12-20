<template>
    <div id="dummy" style="position: absolute; width: 100%; height: 100%; top:0; left: 0;"></div>
</template>

<script>
    import {
        Scene,
        HemisphereLight,
        PerspectiveCamera,
        Color,
        WebGLRenderer,
        OrbitControls,
        MeshStandardMaterial,
        GLTFLoader
    } from "three-full";
    export default {
        name: 'WardrobeCard',
        data() {
            return {
                global: {
                    scene: null,
                    loader: null,
                    camera: null,
                    renderer: null,
                    controls: null,
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
                },
                scenes: {}
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
                global.scene.background = new Color(0xffffff); //new THREE.TextureLoader().load(require('@/assets/dummy-bg.png'));

                global.loader = new GLTFLoader();

                global.camera = new PerspectiveCamera(
                    45,
                    t.$el.offsetWidth / t.$el.offsetHeight,
                    1,
                    100
                )
                global.camera.position.set( 0, 2.37, 0 );

                global.renderer = new WebGLRenderer( { antialias: true } )
                global.renderer.setSize(t.$el.offsetWidth, t.$el.offsetHeight)
                //this.renderer.outputEncoding = 3001; //THREE.sRGBEncoding;
                global.renderer.shadowMap.enabled = true;
                t.$el.appendChild(global.renderer.domElement)

                global.controls = new OrbitControls( global.camera, global.renderer.domElement );
                global.controls.enablePan = false;
                global.controls.screenSpacePanning = false;
                global.controls.enableZoom = false;
                global.controls.enableRotate = true;
                global.controls.minPolarAngle = Math.PI / 2.2; //Math.PI/2;
                global.controls.maxPolarAngle = 0; //Math.PI/2;
                global.controls.target.set( 0, 1, 0 );
                global.controls.update();
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
            changeClothes: function (settings) {
                let t = this
                for (let i = 0; i < settings.length; i++) {
                    this.global.loader.load( this.activeClothes[settings[i].model_name].path + '/' + settings[i].model_type + '.glb', function(gltf) {
                        t.global.scene.add(gltf.scene)
                        if (settings[i].color) {
                            let newcolor = new MeshStandardMaterial({color: Number(settings[i].color.replace('#', '0x'))});
                            gltf.scene.traverse(function (object3D){
                            if (object3D.isMesh) {
                                object3D.material = newcolor;
                            }
                        });
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
            cleanModel: function () {
                for (let i in this.activeClothes) {
                    this.activeClothes[i].color = null
                    this.global.scene.remove(this.activeClothes[i].active)
                    this.activeClothes[i].active = null
                }
            }
        },
        props: {
            settings: Array
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
            if(this.settings !== undefined) {
                this.changeClothes(this.settings);
            }
            this.$eventHub.$on('wardrobe:dummy_reload_tshirt', (settings) => {
                this.changeClothes(this.settings);
            }).$on('wardrobe:changecolor_tshirt', (element, color) => {
                this.changecolor(element, color);
            }).$on('wardrobe:clean_model', () => {
                this.cleanModel();
            });
        }
    }
</script>
