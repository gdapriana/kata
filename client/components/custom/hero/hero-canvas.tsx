"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import * as THREE from "three"

interface HeroCanvasProps {
  scale?: number
}

export default function HeroCanvas({ scale = 1.0 }: HeroCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const groupRef = useRef<THREE.Group | null>(null)
  const { resolvedTheme } = useTheme()

  // Keep references to lights and materials to update them on theme changes without rebuilding context
  const lightsRef = useRef<{
    pointLight1: THREE.PointLight | null
    pointLight2: THREE.PointLight | null
    pointLight3: THREE.PointLight | null
    ambientLight: THREE.AmbientLight | null
  }>({
    pointLight1: null,
    pointLight2: null,
    pointLight3: null,
    ambientLight: null,
  })

  const materialsRef = useRef<{
    centralMaterial: THREE.MeshPhysicalMaterial | null
    wireframeMaterial: THREE.MeshBasicMaterial | null
    particleMaterial: THREE.MeshPhysicalMaterial | null
    ringMaterial: THREE.MeshBasicMaterial | null
  }>({
    centralMaterial: null,
    wireframeMaterial: null,
    particleMaterial: null,
    ringMaterial: null,
  })

  // Dynamic scale updates
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(scale, scale, scale)
    }
  }, [scale])

  // Dynamic theme updates
  useEffect(() => {
    const isDark = resolvedTheme === "dark"
    const { pointLight1, pointLight2, pointLight3, ambientLight } =
      lightsRef.current
    const {
      centralMaterial,
      wireframeMaterial,
      particleMaterial,
      ringMaterial,
    } = materialsRef.current

    if (isDark) {
      // Dark mode: cool stark monochrome (polished black metal & white details)
      if (pointLight1) {
        pointLight1.color.setHex(0xffffff)
        pointLight1.intensity = 35
      }
      if (pointLight2) {
        pointLight2.color.setHex(0xffffff)
        pointLight2.intensity = 30
      }
      if (pointLight3) {
        pointLight3.color.setHex(0xffffff)
        pointLight3.intensity = 20
      }
      if (ambientLight) {
        ambientLight.color.setHex(0xffffff)
        ambientLight.intensity = 0.25
      }
      if (centralMaterial) {
        centralMaterial.color.setHex(0x18181b) // Polished zinc-900 (near black)
        centralMaterial.roughness = 0.08
        centralMaterial.metalness = 0.95 // High metallic shine
        centralMaterial.transmission = 0.1 // Semi-opaque
        centralMaterial.emissive.setHex(0x000000)
      }
      if (wireframeMaterial) {
        wireframeMaterial.color.setHex(0xffffff)
        wireframeMaterial.opacity = 0.22
      }
      if (particleMaterial) {
        particleMaterial.color.setHex(0xffffff) // Silver/chrome particles
        particleMaterial.metalness = 0.95
        particleMaterial.roughness = 0.05
      }
      if (ringMaterial) {
        ringMaterial.color.setHex(0xffffff)
        ringMaterial.opacity = 0.12
      }
    } else {
      // Light mode: pristine clean white glass and dark accents
      if (pointLight1) {
        pointLight1.color.setHex(0xffffff)
        pointLight1.intensity = 20
      }
      if (pointLight2) {
        pointLight2.color.setHex(0xffffff)
        pointLight2.intensity = 15
      }
      if (pointLight3) {
        pointLight3.color.setHex(0xffffff)
        pointLight3.intensity = 10
      }
      if (ambientLight) {
        ambientLight.color.setHex(0xffffff)
        ambientLight.intensity = 0.55
      }
      if (centralMaterial) {
        centralMaterial.color.setHex(0xffffff) // Pure white glass
        centralMaterial.roughness = 0.05
        centralMaterial.metalness = 0.05
        centralMaterial.transmission = 0.85 // High transmission transparency
        centralMaterial.emissive.setHex(0x000000)
      }
      if (wireframeMaterial) {
        wireframeMaterial.color.setHex(0x000000)
        wireframeMaterial.opacity = 0.12
      }
      if (particleMaterial) {
        particleMaterial.color.setHex(0x27272a) // Dark gray chrome particles
        particleMaterial.metalness = 0.85
        particleMaterial.roughness = 0.1
      }
      if (ringMaterial) {
        ringMaterial.color.setHex(0x000000)
        ringMaterial.opacity = 0.08
      }
    }
  }, [resolvedTheme])

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current
    if (!container || !canvas) return

    // Screen dimensions
    let width = container.clientWidth
    let height = container.clientHeight || 500

    // 1. Scene setup
    const scene = new THREE.Scene()

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.z = 8

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0

    // 4. Lights (All Neutral White)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const pointLight1 = new THREE.PointLight(0xffffff, 30, 50, 1.2)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xffffff, 25, 50, 1.2)
    pointLight2.position.set(-5, -5, 5)
    scene.add(pointLight2)

    const pointLight3 = new THREE.PointLight(0xffffff, 15, 50, 1.2)
    pointLight3.position.set(0, 5, -5)
    scene.add(pointLight3)

    // Store lights in ref for dynamic styling
    lightsRef.current = { pointLight1, pointLight2, pointLight3, ambientLight }

    // 5. Geometries & Materials
    const group = new THREE.Group()
    group.scale.set(scale, scale, scale)
    scene.add(group)
    groupRef.current = group

    // A. Central Morphing Mesh
    const centralGeometry = new THREE.IcosahedronGeometry(1.8, 4)
    const positionAttribute = centralGeometry.attributes.position
    const originalPositions = positionAttribute.clone()

    const centralMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.15,
      metalness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.6,
      thickness: 1.2,
      ior: 1.5,
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide,
    })

    const centralMesh = new THREE.Mesh(centralGeometry, centralMaterial)
    group.add(centralMesh)

    // B. Central Wireframe overlay
    const wireframeGeometry = new THREE.IcosahedronGeometry(1.82, 3)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })
    const wireframeMesh = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    group.add(wireframeMesh)

    // C. Orbiting Rings
    const ring1Geometry = new THREE.TorusGeometry(3.0, 0.015, 8, 120)
    const ringMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
    })
    const ring1 = new THREE.Mesh(ring1Geometry, ringMaterial)
    ring1.rotation.x = Math.PI / 3
    ring1.rotation.y = Math.PI / 6
    group.add(ring1)

    const ring2Geometry = new THREE.TorusGeometry(3.3, 0.01, 8, 120)
    const ring2 = new THREE.Mesh(ring2Geometry, ringMaterial)
    ring2.rotation.x = -Math.PI / 4
    ring2.rotation.y = -Math.PI / 3
    group.add(ring2)

    // D. Floating Particles (small abstract geometries)
    const particleCount = 15
    const particles: {
      mesh: THREE.Mesh
      initialPos: THREE.Vector3
      speedX: number
      speedY: number
      speedZ: number
      amplitudeX: number
      amplitudeY: number
      amplitudeZ: number
      phase: number
    }[] = []

    const particleMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      metalness: 0.8,
      transmission: 0.2,
      transparent: true,
      opacity: 0.7,
    })

    const octahedronGeom = new THREE.OctahedronGeometry(0.12, 0)
    const tetrahedronGeom = new THREE.TetrahedronGeometry(0.14, 0)

    for (let i = 0; i < particleCount; i++) {
      const geom = i % 2 === 0 ? octahedronGeom : tetrahedronGeom
      const mesh = new THREE.Mesh(geom, particleMaterial)

      // Random position on a sphere of radius 2.2 to 3.8
      const radius = 2.2 + Math.random() * 1.6
      const u = Math.random()
      const v = Math.random()
      const theta = u * 2.0 * Math.PI
      const phi = Math.acos(2.0 * v - 1.0)

      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)

      mesh.position.set(x, y, z)
      group.add(mesh)

      particles.push({
        mesh,
        initialPos: new THREE.Vector3(x, y, z),
        speedX: 0.2 + Math.random() * 0.4,
        speedY: 0.2 + Math.random() * 0.4,
        speedZ: 0.2 + Math.random() * 0.4,
        amplitudeX: 0.15 + Math.random() * 0.2,
        amplitudeY: 0.15 + Math.random() * 0.2,
        amplitudeZ: 0.15 + Math.random() * 0.2,
        phase: Math.random() * Math.PI * 2,
      })
    }

    // Store materials in ref for theme changes
    materialsRef.current = {
      centralMaterial,
      wireframeMaterial,
      particleMaterial,
      ringMaterial,
    }

    // Run theme color setter once on initial render
    const isDark = resolvedTheme === "dark"
    if (isDark) {
      pointLight1.color.setHex(0xffffff)
      pointLight1.intensity = 35
      pointLight2.color.setHex(0xffffff)
      pointLight2.intensity = 30
      pointLight3.color.setHex(0xffffff)
      pointLight3.intensity = 20
      ambientLight.color.setHex(0xffffff)
      ambientLight.intensity = 0.25
      centralMaterial.color.setHex(0x18181b)
      centralMaterial.emissive.setHex(0x000000)
      wireframeMaterial.color.setHex(0xffffff)
      wireframeMaterial.opacity = 0.22
      particleMaterial.color.setHex(0xffffff)
      ringMaterial.color.setHex(0xffffff)
      ringMaterial.opacity = 0.12
    } else {
      pointLight1.color.setHex(0xffffff)
      pointLight1.intensity = 20
      pointLight2.color.setHex(0xffffff)
      pointLight2.intensity = 15
      pointLight3.color.setHex(0xffffff)
      pointLight3.intensity = 10
      ambientLight.color.setHex(0xffffff)
      ambientLight.intensity = 0.55
      centralMaterial.color.setHex(0xffffff)
      centralMaterial.emissive.setHex(0x000000)
      wireframeMaterial.color.setHex(0x000000)
      wireframeMaterial.opacity = 0.12
      particleMaterial.color.setHex(0x27272a)
      ringMaterial.color.setHex(0x000000)
      ringMaterial.opacity = 0.08
    }

    // 6. Mouse movement parallax tracking
    const mouse = { x: 0, y: 0 }
    const targetMouse = { x: 0, y: 0 }

    const handleMouseMove = (event: MouseEvent) => {
      // Normalize relative to screen center
      targetMouse.x = (event.clientX / window.innerWidth) * 2 - 1
      targetMouse.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    window.addEventListener("mousemove", handleMouseMove)

    // 7. Animation loop
    const clock = new THREE.Clock()
    let animationFrameId: number

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const time = clock.getElapsedTime()

      // A. Morph central sphere
      const pos = positionAttribute.array as Float32Array
      const orig = originalPositions.array as Float32Array

      for (let i = 0; i < pos.length; i += 3) {
        const x = orig[i]
        const y = orig[i + 1]
        const z = orig[i + 2]

        const len = Math.sqrt(x * x + y * y + z * z)

        // Wave displacements based on 3D spatial points
        const wave1 = Math.sin(x * 1.5 + time * 1.5)
        const wave2 = Math.cos(y * 1.5 - time * 2.0)
        const wave3 = Math.sin(z * 1.5 + time * 1.8)

        // Final displacement distance
        const displacement = (wave1 + wave2 + wave3) * 0.12

        // Displace along vertex normal
        pos[i] = x + (x / len) * displacement
        pos[i + 1] = y + (y / len) * displacement
        pos[i + 2] = z + (z / len) * displacement
      }
      positionAttribute.needsUpdate = true
      centralGeometry.computeVertexNormals()

      // B. Slow rotations for main objects
      centralMesh.rotation.y = time * 0.1
      centralMesh.rotation.x = time * 0.05

      wireframeMesh.rotation.y = -time * 0.08
      wireframeMesh.rotation.x = -time * 0.04

      ring1.rotation.z = time * 0.05
      ring2.rotation.z = -time * 0.04

      // C. Orbiting particles movement
      particles.forEach((p) => {
        p.mesh.position.x =
          p.initialPos.x + Math.sin(time * p.speedX + p.phase) * p.amplitudeX
        p.mesh.position.y =
          p.initialPos.y + Math.cos(time * p.speedY + p.phase) * p.amplitudeY
        p.mesh.position.z =
          p.initialPos.z + Math.sin(time * p.speedZ + p.phase) * p.amplitudeZ

        p.mesh.rotation.x += 0.01
        p.mesh.rotation.y += 0.015
      })

      // D. Oscillate point lights to make reflections dynamic
      pointLight1.position.x = 5 * Math.sin(time * 0.5)
      pointLight1.position.y = 5 * Math.cos(time * 0.3)
      pointLight2.position.x = -5 * Math.sin(time * 0.4)
      pointLight2.position.z = 5 * Math.cos(time * 0.6)
      pointLight3.position.y = 5 + Math.sin(time * 0.7) * 2

      // E. Mouse lerp for parallax
      mouse.x += (targetMouse.x - mouse.x) * 0.08
      mouse.y += (targetMouse.y - mouse.y) * 0.08

      group.rotation.x = mouse.y * 0.4
      group.rotation.y = mouse.x * 0.4

      renderer.render(scene, camera)
    }

    animate()

    // 8. Handle resize
    const handleResize = () => {
      if (!container || !canvas) return
      width = container.clientWidth
      height = container.clientHeight || 500

      camera.aspect = width / height
      camera.updateProjectionMatrix()

      renderer.setSize(width, height)
    }

    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)

      // Dispose resources
      centralGeometry.dispose()
      centralMaterial.dispose()
      wireframeGeometry.dispose()
      wireframeMaterial.dispose()
      ring1Geometry.dispose()
      ring2Geometry.dispose()
      ringMaterial.dispose()
      octahedronGeom.dispose()
      tetrahedronGeom.dispose()
      particleMaterial.dispose()
      renderer.dispose()
    }
  }, []) // Empty dependency array means this runs once on mount

  return (
    <div
      ref={containerRef}
      className="relative flex h-[350px] w-full items-center justify-center md:h-[450px]"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block h-full w-full outline-none"
      />
      {/* Visual background ambient glow that matches the monochrome theme */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-neutral-500/5 blur-[100px] dark:bg-neutral-500/10" />
    </div>
  )
}
