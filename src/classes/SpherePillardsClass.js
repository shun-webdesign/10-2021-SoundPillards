import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import * as THREE from 'three'
import { TextureLoader } from 'three';
import SoundReactor from './SoundReactor'
import MyGUI from '../utils/MyGUI'
import LoadingController from './LoadingController'

class SpherePillardsClass {
  constructor() {
      this.bind()
      this.modelLoader = new GLTFLoader(LoadingController)
      this.texLoader = new THREE.TextureLoader(LoadingController)
      this.params = {
        waveSpeed : 1,
        subDiv :3,
        pillardSize : .2
      }
  }

  init(scene) {
      this.scene = scene
      this.upVec = new THREE.Vector3(0,1,0)
      this.pillards = new THREE.Group()
      this.pillard

      const gTex = this.texLoader.load('./assets/textures/grayMetal.png')
      const bTex = this.texLoader.load('./assets/textures/blackMetal.png')

      this.gMatCap = new THREE.MeshMatcapMaterial({
        matcap:gTex
      })
      this.bMatCap = new THREE.MeshMatcapMaterial({
        matcap:bTex
      })

      this.modelLoader.load('./assets/models/pillates.glb',(glb)=>{
        console.log(glb)
        glb.scene.traverse(child => {
          if(child.name == "base"){
            this.pillard = child
            child.material = this.bMatCap
          }
          if(child.name == "Cylinder")
          child.material = this.gMatCap
        })
        this.computePositions()
      })

      const sphereFolder = MyGUI.addFolder('Sphere Pillards')
      sphereFolder.open()
      sphereFolder.add(this.params,'waveSpeed',0.001, 3).name('Wave Speed')
      sphereFolder.add(this.params,'subDiv',1, 5).step(1).name('Ico Subdivisions').onChange(this.computePositions)
      sphereFolder.add(this.params,'pillardSize',0.01, 5).name('Pill Size').onChange(this.computePositions)
  }

  computePositions(){
    let ico
    this.scene.traverse(child =>{
      if(child.name == 'Ico'){
        ico = child
      }
    })

    if(ico)
    this.scene.remove(ico)

    const sphereGeom = new THREE.IcosahedronGeometry(2,this.params.subDiv)//球体の画数
    const sphereMat = this.gMatCap
    const sphere = new THREE.Mesh(sphereGeom,sphereMat)
    sphere.name = 'Ico'
    this.scene.add(sphere)

    this.pillards.clear()

    let verArray =[]
    for(let i = 0; i < sphereGeom.attributes.position.array.length; i+= 3){
      const x = sphereGeom.attributes.position.array[i]
      const y = sphereGeom.attributes.position.array[i + 1]
      const z = sphereGeom.attributes.position.array[i + 2]
      verArray.push({
        x: x,
        y: y,
        z: z,
      })
    }

    let pillPos = []
    for(let i =0; i < verArray.length; i++){
      let existsFlag =false
      for(let j = 0; j < pillPos.length; j++){
        if(pillPos[j] == verArray[i].x && pillPos[j].y == verArray[i].y&& pillPos[j].z == verArray[i].z){
          existsFlag = true
      }
    }
      if(!existsFlag){
        pillPos.push({
          x: verArray[i].x,
          y: verArray[i].y,
          z: verArray[i].z,
        })
        const c = this.pillard.clone()//オブジェクト増殖
        const posVec = new THREE.Vector3(verArray[i].x,verArray[i].y,verArray[i].z)//配置
        c.position.copy(posVec)
        c.scale.multiplyScalar(this.params.pillardSize)//大きさ
        c.quaternion.setFromUnitVectors(this.upVec,posVec.normalize())//ポジション正規化
        this.pillards.add(c)
      }
    }
    this.scene.add(this.pillards)
  }

  update() {
    if(SoundReactor.playFlag){
      let i = 0
      while(i < this.pillards.children.length){
        this.pillards.children[i].children[0].position.y = SoundReactor.fdata[i] / 400 * 4
        i++
      }

    }else{
      let i = 0
      while(i < this.pillards.children.length){
        this.pillards.children[i].children[0].position.y = (Math.sin(Date.now() * 0.01* this.params.waveSpeed + this.pillards.children[i].position.x)+ 0.5)
        i++
      }
    }
  }

  bind() {
    this.computePositions = this.computePositions.bind(this)
  }
}

const _instance = new SpherePillardsClass()
export default _instance