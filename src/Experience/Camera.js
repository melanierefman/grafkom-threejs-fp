import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor(_options)
    {
        // Options
        this.experience = new Experience()
        this.config = this.experience.config
        this.debug = this.experience.debug
        this.time = this.experience.time
        this.sizes = this.experience.sizes
        this.targetElement = this.experience.targetElement
        this.world = this.experience.world
        this.scene = this.experience.scene

        // Set up
        this.mode = 'default' // default \ debug

        this.setInstance()
        this.setModes()
    }

    setInstance()
    {
        // Set up
        this.instance = new THREE.PerspectiveCamera(20, this.config.width / this.config.height, 0.1, 150)
        this.instance.rotation.reorder('YXZ')

        this.scene.add(this.instance)
    }

    setModes()
    {
        this.modes = {}

        // Default
        this.modes.default = {}
        this.modes.default.instance = this.instance.clone()
        this.modes.default.instance.rotation.reorder('YXZ')

         // Front view
        this.modes.front_view = {}
        this.modes.front_view.instance = this.instance.clone()
        this.modes.front_view.instance.rotation.reorder('YXZ')
        this.modes.front_view.instance.position.set(-2.7, 0.5, 0)
        this.modes.front_view.orbitControls = new OrbitControls(this.modes.front_view.instance, this.targetElement)
        this.modes.front_view.orbitControls.enabled = false
        this.modes.front_view.orbitControls.minAzimuthAngle = -Math.PI / 16 - Math.PI / 2
        this.modes.front_view.orbitControls.maxAzimuthAngle = Math.PI / 16 - Math.PI / 2
        this.modes.front_view.orbitControls.minPolarAngle = THREE.MathUtils.degToRad(75)
        this.modes.front_view.orbitControls.maxPolarAngle = THREE.MathUtils.degToRad(85)
        this.modes.front_view.orbitControls.maxDistance = 3.5
        this.modes.front_view.orbitControls.minDistance = 0.5
        this.modes.front_view.orbitControls.enableDamping = true
        this.modes.front_view.orbitControls.update()

        // Debug
        this.modes.debug = {}
        this.modes.debug.instance = this.instance.clone()
        this.modes.debug.instance.rotation.reorder('YXZ')
        this.modes.debug.instance.position.set(- 15, 15, 15)
        
        this.modes.debug.orbitControls = new OrbitControls(this.modes.debug.instance, this.targetElement)
        this.modes.debug.orbitControls.enabled = false
        this.modes.debug.orbitControls.screenSpacePanning = true
        this.modes.debug.orbitControls.enableKeys = false
        this.modes.debug.orbitControls.zoomSpeed = 0.25
        this.modes.debug.orbitControls.enableDamping = true
        this.modes.debug.orbitControls.update()
    }


    resize()
    {
        this.instance.aspect = this.config.width / this.config.height
        this.instance.updateProjectionMatrix()

        this.modes.default.instance.aspect = this.config.width / this.config.height
        this.modes.default.instance.updateProjectionMatrix()

        this.modes.debug.instance.aspect = this.config.width / this.config.height
        this.modes.debug.instance.updateProjectionMatrix()
    }

    update()
    {
        // Update debug orbit controls
        this.modes.debug.orbitControls.update()

        // Apply coordinates
        this.instance.position.copy(this.modes[this.mode].instance.position)
        this.instance.quaternion.copy(this.modes[this.mode].instance.quaternion)
        this.instance.updateMatrixWorld() // To be used in projection
    }

    destroy()
    {
        this.modes.debug.orbitControls.destroy()
    }
}
