import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import modelUrl from './assets/realistic_laptopcolour_black.glb?url'

const frameFill = 1.22
const nameRevealEnd = 1710
const spinSpeed = 0.22

function AboutModel() {
  const mountRef = useRef()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const mountedAt = performance.now()
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

    let radius = 1
    const frameModel = () => {
      const verticalFov = THREE.MathUtils.degToRad(camera.fov)
      let distance = radius / Math.sin(verticalFov / 2) / frameFill

      if (camera.aspect < 1) {
        distance /= camera.aspect
      }

      camera.position.setLength(distance)
      camera.lookAt(0, 0, 0)
      camera.near = distance / 100
      camera.far = distance * 10
      camera.updateProjectionMatrix()
    }

    const pmrem = new THREE.PMREMGenerator(renderer)
    const environment = pmrem.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = environment.texture

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.4)
    keyLight.position.set(3, 4, 5)
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.9)
    fillLight.position.set(-4, 1.5, -3)
    scene.add(keyLight, fillLight)

    camera.lookAt(0, 0, 0)

    let revealTimeout
    let model
    const loader = new GLTFLoader()
    loader.load(modelUrl, (gltf) => {
      model = gltf.scene
      const box = new THREE.Box3().setFromObject(model)
      const center = box.getCenter(new THREE.Vector3())

      model.position.sub(center)
      scene.add(model)
      radius = box.getBoundingSphere(new THREE.Sphere()).radius
      frameModel()
      revealTimeout = window.setTimeout(
        () => setReady(true),
        Math.max(0, nameRevealEnd - (performance.now() - mountedAt)),
      )
    })

    const resize = () => {
      const { clientWidth, clientHeight } = mount

      if (!clientWidth || !clientHeight) {
        return
      }

      renderer.setSize(clientWidth, clientHeight, false)
      camera.aspect = clientWidth / clientHeight
      frameModel()
    }

    const observer = new ResizeObserver(resize)
    observer.observe(mount)
    resize()

    let frame
    const clock = new THREE.Clock()
    const render = () => {
      frame = window.requestAnimationFrame(render)

      if (model) {
        model.rotation.y += clock.getDelta() * spinSpeed
      }

      renderer.render(scene, camera)
    }
    render()

    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(revealTimeout)
      observer.disconnect()
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
