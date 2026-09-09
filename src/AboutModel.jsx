import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import modelUrl from './assets/realistic_laptopcolour_black.glb?url'

const idleResumeDelay = 2600
const modelLift = 0.42

function AboutModel() {
  const mountRef = useRef()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mount = mountRef.current
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearAlpha(0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    mount.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100)
    camera.position.set(0.9, 0.7, 2.6)

    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = environment.texture

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4)
    keyLight.position.set(3, 4, 5)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.9)
    fillLight.position.set(-4, 1.5, -3)
    scene.add(keyLight, fillLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.08
    controls.enableZoom = false
    controls.enablePan = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 0.9
    controls.minPolarAngle = 0.6
    controls.maxPolarAngle = 1.9
    controls.enabled = window.matchMedia('(pointer: fine)').matches

    let resumeTimeout
    const pauseSpin = () => {
      window.clearTimeout(resumeTimeout)
      controls.autoRotate = false
    }
    const resumeSpin = () => {
      resumeTimeout = window.setTimeout(() => {
        controls.autoRotate = true
      }, idleResumeDelay)
    }
    controls.addEventListener('start', pauseSpin)
    controls.addEventListener('end', resumeSpin)

    let model
    const loader = new GLTFLoader()
    loader.load(modelUrl, (gltf) => {
      model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const size = box.getSize(new THREE.Vector3())
      const center = box.getCenter(new THREE.Vector3())

      model.position.sub(center)
      model.scale.setScalar(1.7 / Math.max(size.x, size.y, size.z))
      scene.add(model)
      controls.target.set(0, -modelLift, 0)
      controls.update()
      setReady(true)
    })

    const resize = () => {
      const { clientWidth, clientHeight } = mount

      if (!clientWidth || !clientHeight) {
        return
      }

      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      camera.updateProjectionMatrix()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()

    let frame
    const render = () => {
      frame = window.requestAnimationFrame(render)
      controls.update()
      renderer.render(scene, camera)
    }
    render()

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(resumeTimeout)
      observer.disconnect()
      controls.removeEventListener('start', pauseSpin)
      controls.removeEventListener('end', resumeSpin)
      controls.dispose()
      scene.traverse((child) => {
        if (!child.isMesh) {
          return
        }

        child.geometry.dispose()
        const materials = Array.isArray(child.material) ? child.material : [child.material]
        materials.forEach((material) => {
          Object.values(material).forEach((value) => {
            if (value?.isTexture) {
              value.dispose()
            }
          })
          material.dispose()
        })
      })
      environment.texture.dispose()
      pmrem.dispose()
      renderer.dispose()
      renderer.domElement.remove()
    }
  }, [])

  return <div className={`about-model ${ready ? 'is-ready' : ''}`} ref={mountRef} />
}

export default AboutModel
