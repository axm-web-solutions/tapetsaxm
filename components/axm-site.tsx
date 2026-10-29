'use client'

import { Suspense, useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from 'react'
import Image from 'next/image'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, useTexture } from '@react-three/drei'
import * as THREE from 'three'
import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Menu, MessageCircle, Phone, Send, ShieldCheck, Sparkles, Truck, Upload, X, Zap } from 'lucide-react'

// Datos de contacto: cambia aquí el número y se actualizan todos los botones
const contact = {
  whatsapp: '573001234567',
  phoneLabel: '+57 300 123 4567',
  instagram: 'https://www.instagram.com/axm_tapetes/',
  instagramUser: '@axm_tapetes',
}
const wa = (text = 'Hola AXM, quiero información sobre tapetes personalizados.') => `https://wa.me/${contact.whatsapp}?text=${encodeURIComponent(text)}`

// Colores del pavo real del logo AXM
const peacock = 'linear-gradient(90deg, #cf2639, #f7891f, #f9ee00, #07b266, #039ee0, #5b3c99)'
// Catálogo real de fibra PVC (ver /galeria/catalogo-colores.jpg)
const fibers = [
  { name: 'Negro', hex: '#222220' },
  { name: 'Gris oscuro', hex: '#4a4b48' },
  { name: 'Gris claro', hex: '#9a958c' },
  { name: 'Café', hex: '#5e4a3e' },
  { name: 'Beige', hex: '#b3a184' },
  { name: 'Blanco', hex: '#ecebe6' },
  { name: 'Vinotinto oscuro', hex: '#4a2a2c' },
  { name: 'Vinotinto claro', hex: '#7a2834' },
  { name: 'Rojo', hex: '#c62a22' },
  { name: 'Naranja', hex: '#f2541b' },
  { name: 'Ocre', hex: '#b8923f' },
  { name: 'Amarillo', hex: '#f2b52a' },
  { name: 'Verde manzana', hex: '#84a33a' },
  { name: 'Verde luminoso', hex: '#3f8f3c' },
  { name: 'Verde oscuro', hex: '#2f3d33' },
  { name: 'Azul cielo', hex: '#6fa1e2' },
  { name: 'Azul rey', hex: '#253a8c' },
  { name: 'Azul oscuro', hex: '#1f2433' },
  { name: 'Morado', hex: '#45285a' },
  { name: 'Fucsia', hex: '#e0305a' },
  { name: 'Rosado', hex: '#f08a8a' },
]
// thickness/bump/loops solo controlan cómo se ve cada material en el 3D
const materials = [
  { name: 'PVC atrapamugre', note: 'Fibra en rizo para uso diario en oficinas, locales y hogares.', image: '/materiales/atrapamugre.jpg', thickness: 0.02, bump: 0.5, loops: 1, loopSize: 1 },
  { name: 'PVC alto tráfico', note: 'Rizo más denso y firme para entradas con flujo constante de personas.', image: '/materiales/alto-trafico.jpg', thickness: 0.036, bump: 0.8, loops: 1.7, loopSize: 0.7 },
  { name: 'PVC texturizado', note: 'Relieve marcado que le da más presencia a tu logo y a sus colores.', image: '/materiales/texturizado.jpg', thickness: 0.028, bump: 1.6, loops: 0.8, loopSize: 1.5 },
]
const sizes = [
  { label: '60 × 90 cm', w: 90, h: 60 },
  { label: '80 × 120 cm', w: 120, h: 80 },
  { label: 'A medida', w: 0, h: 0 },
]
// Fotos de tapetes reales enderezadas para usarlas como textura del modelo 3D
const realDesigns = [
  { src: '/texturas/tht-moda-cris.jpg', client: 'THT Moda Cris' },
  { src: '/texturas/mr-cigar.jpg', client: 'Mr. Cigar' },
  { src: '/texturas/mas-x-menos.jpg', client: 'Más x Menos' },
]
// Mejores trabajos de instagram.com/axm_tapetes; focus centra el tapete en el recorte cuadrado
const gallery = [
  { src: '/galeria/mr-cigar.jpg', focus: '50% 50%', client: 'Mr. Cigar', tag: 'Comercio', alt: 'Tapete rojo con logo dorado y negro de Mr. Cigar y la palabra Welcome, sobre piso de baldosa' },
  { src: '/galeria/tht-moda-cris.jpg', focus: '50% 60%', client: 'THT Moda Cris', tag: 'Moda', alt: 'Tapete negro con logo azul de THT, texto blanco Moda Cris y lema amarillo Vístete con actitud' },
  { src: '/galeria/pantera-sport.jpg', focus: '50% 85%', client: 'Pantera Sport', tag: 'Deportes', alt: 'Entrada de Pantera Sport con tapete verde en forma de cancha de fútbol' },
  { src: '/galeria/jardin-del-quindio-pets.jpg', focus: '50% 50%', client: 'Jardín del Quindío Pets', tag: 'Mascotas', alt: 'Tapete Jardín del Quindío Pets con perro y gato, con perfil en caucho, fibra PVC y base antideslizante señalados' },
  { src: '/galeria/tec-plus.jpg', focus: '40% 50%', client: 'Tec Plus', tag: 'Tecnología', alt: 'Dos tapetes negros de Tec Plus con letras blancas: celulares, accesorios, repuestos y servicio técnico' },
  { src: '/galeria/cholao-oscar.jpg', focus: '50% 92%', client: 'Cholao Oscar', tag: 'Restaurante', alt: 'Entrada del local Cholao Oscar con tapete amarillo y el logo de la marca' },
  { src: '/galeria/mas-x-menos.jpg', focus: '50% 55%', client: 'Más x Menos', tag: 'Comercio', alt: 'Tapete gris con logo azul, amarillo y rojo de Más x Menos' },
  { src: '/galeria/tu-celu.jpg', focus: '50% 92%', client: 'Tu Celu', tag: 'Tecnología', alt: 'Tienda Tu Celu con tapete negro y logo naranja de celulares y accesorios en la entrada' },
]
// Preguntas frecuentes del asistente. Sin precios ni plazos fijos: se confirman al cotizar.
const faqs = [
  { q: '¿Cuánto vale un tapete?', keys: ['precio', 'vale', 'cuesta', 'costo', 'valor', 'cotiz', 'tarifa', 'barato', 'caro', 'plata'], a: 'El valor depende de la medida, de cuántos colores tiene tu logo y de cuántas unidades necesitas. Cuéntanos esos datos por WhatsApp y te enviamos la cotización sin compromiso. 😊', cta: true },
  { q: '¿Cómo se lava?', keys: ['lav', 'limpi', 'mantenimiento', 'sucio', 'aspir', 'jabon', 'cuid'], a: 'Es muy sencillo: sacúdelo o aspíralo a diario para retirar el polvo. Para una limpieza profunda, lávalo con agua y jabón neutro (sirve manguera o hidrolavadora suave) y déjalo secar a la sombra, en posición vertical. Evita el cloro y los solventes.' },
  { q: '¿Cuánto dura?', keys: ['dura', 'vida util', 'resist', 'garant', 'gasta', 'desgast', 'aguanta'], a: 'La fibra PVC está hecha para el paso diario: con un mantenimiento básico, tu tapete te acompaña por varios años. La duración exacta depende de cuántas personas pasan por tu entrada; si es de mucho flujo te recomendamos el PVC alto tráfico.' },
  { q: '¿Qué materiales usan?', keys: ['material', 'pvc', 'fibra', 'caucho', 'base', 'hecho', 'fabric', 'antidesliz', 'compo'], a: 'Usamos fibra PVC en rizo, que atrapa polvo, arena y humedad; base antideslizante para que no se corra y perfil en caucho en el borde. Tu logo se arma con fibras de colores del mismo material.' },
  { q: '¿Cuánto tardan en entregar?', keys: ['tard', 'demora', 'entreg', 'cuando llega', 'dias', 'tiempo', 'listo', 'produc', 'pronto', 'rapido'], a: 'Depende del diseño y de la cantidad. Apenas apruebes tu diseño te confirmamos la fecha exacta de producción y entrega. Si lo necesitas para una fecha especial, cuéntanos y hacemos lo posible. 🚚', cta: true },
  { q: '¿Hacen envíos?', keys: ['envi', 'despach', 'ciudad', 'domicil', 'llegan', 'bogota', 'medellin', 'cali', 'nacional', 'transport', 'armenia'], a: 'Sí, enviamos a todo Colombia con guía de seguimiento para que sepas en todo momento dónde va tu pedido.' },
  { q: '¿Qué medidas manejan?', keys: ['medid', 'tamañ', 'tamano', 'grande', 'pequeñ', 'dimension', 'cm', 'metro', 'ancho', 'largo'], a: 'Las más pedidas son 60 × 90 cm y 80 × 120 cm, y también fabricamos a la medida exacta de tu entrada. En el diseñador puedes ver cada tamaño frente a una puerta.' },
  { q: '¿Qué colores hay?', keys: ['color', 'tono', 'negro', 'rojo', 'azul', 'gris', 'verde'], a: 'Tenemos 21 colores de fibra: grises, negro, café, vinotintos, rojo, naranja, ocre, beige, blanco, amarillo, verdes, azules, morado, fucsia y rosado. Pruébalos con tu logo en el diseñador. 🎨' },
  { q: '¿Puedo poner mi logo?', keys: ['logo', 'diseñ', 'disen', 'personaliz', 'marca', 'imagen', 'texto', 'nombre', 'letra'], a: '¡Claro! Es nuestra especialidad. Envíanos tu logo (ideal en PNG, PDF o vector) y lo adaptamos a la fibra. Si no tienes un buen archivo, pídenos el diseño y te ayudamos.' },
  { q: '¿Cómo puedo pagar?', keys: ['pag', 'tarjeta', 'pse', 'transfer', 'nequi', 'efectivo', 'factura', 'credito'], a: 'Puedes pagar con tarjeta, PSE o transferencia, y tenemos opciones para empresas. Un asesor te confirma los detalles al cotizar.' },
  { q: '¿Sirve para exteriores?', keys: ['exterior', 'afuera', 'lluvia', 'sol', 'mojad', 'humed', 'intemperie', 'agua'], a: 'Sí, la fibra PVC no absorbe agua y funciona muy bien en entradas exteriores y zonas húmedas. Para que dure más, evita dejarlo encharcado por mucho tiempo.' },
]

const TEX_W = 1200
const WALL_Z = -0.6
const HERO_MAT = { w: 1.2, d: 0.8 }

const isLight = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  return ((n >> 16) * 299 + ((n >> 8) & 255) * 587 + (n & 255) * 114) / 1000 > 150
}
const normalize = (text: string) => text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
const seeded = (start: number) => { let seed = start; return () => ((seed = (seed * 16807) % 2147483647) / 2147483647) }

// Rizos de fibra PVC dibujados como pequeños arcos de luz y sombra
function drawLoops(ctx: CanvasRenderingContext2D, width: number, height: number, count: number, size: number, alpha: number) {
  const rand = seeded(7)
  ctx.lineWidth = 1.6 * size
  for (let i = 0; i < count; i++) {
    ctx.strokeStyle = i % 2 ? `rgba(0,0,0,${0.22 * alpha})` : `rgba(255,255,255,${0.12 * alpha})`
    ctx.beginPath()
    ctx.arc(rand() * width, rand() * height, (2 + rand() * 5) * size, rand() * Math.PI * 2, rand() * Math.PI * 2 + 2.5)
    ctx.stroke()
  }
}

// Mapa de relieve que se repite cada 25 cm para dar volumen real al rizo
function makeBumpTexture(loops: number, loopSize: number) {
  const canvas = Object.assign(document.createElement('canvas'), { width: 512, height: 512 })
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 512, 512)
  drawLoops(ctx, 512, 512, Math.round(5000 * loops), loopSize * 1.4, 4)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  return texture
}

function makeTileTexture() {
  const canvas = Object.assign(document.createElement('canvas'), { width: 256, height: 256 })
  const ctx = canvas.getContext('2d')!
  const rand = seeded(3)
  ctx.fillStyle = '#d6d0c6'
  ctx.fillRect(0, 0, 256, 256)
  for (let i = 0; i < 1800; i++) {
    ctx.fillStyle = `rgba(0,0,0,${rand() * 0.05})`
    ctx.fillRect(rand() * 256, rand() * 256, 2, 2)
  }
  ctx.strokeStyle = '#aaa294'
  ctx.lineWidth = 3
  ctx.strokeRect(0, 0, 256, 256)
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(10 / 0.6, 10 / 0.6)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = 8
  return texture
}

// Carga el logo subido; opcionalmente vuelve transparente el fondo blanco (típico en JPG)
function loadLogo(url: string, removeWhite: boolean) {
  return new Promise<HTMLCanvasElement>((resolve, reject) => {
    const img = new window.Image()
    img.onload = () => {
      const scale = Math.min(1, 1000 / Math.max(img.width, img.height))
      const canvas = Object.assign(document.createElement('canvas'), { width: Math.round(img.width * scale), height: Math.round(img.height * scale) })
      const ctx = canvas.getContext('2d')!
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      if (removeWhite) {
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height)
        for (let i = 0; i < data.data.length; i += 4) {
          if (data.data[i] > 232 && data.data[i + 1] > 232 && data.data[i + 2] > 232) data.data[i + 3] = 0
        }
        ctx.putImageData(data, 0, 0)
      }
      resolve(canvas)
    }
    img.onerror = reject
    img.src = url
  })
}

type Design = { fiber: string; logoUrl: string | null; removeWhite: boolean; text: string; textColor: string; ratio: number; material: (typeof materials)[number] }

// Textura 2D del tapete del cliente: fondo de fibra + logo + texto, actualizada en vivo
function useDesignTexture({ fiber, logoUrl, removeWhite, text, textColor, ratio, material }: Design) {
  const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null)
  const [logo, setLogo] = useState<HTMLCanvasElement | null>(null)
  const [fontsReady, setFontsReady] = useState(false)
  const height = Math.round(Math.min(2400, Math.max(300, TEX_W / ratio)))

  useEffect(() => { document.fonts?.ready.then(() => setFontsReady(true)) }, [])

  // Una textura nueva por proporción: WebGL no permite cambiar el tamaño de una ya subida
  useEffect(() => {
    const tex = new THREE.CanvasTexture(Object.assign(document.createElement('canvas'), { width: TEX_W, height }))
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    setTexture(tex)
    return () => tex.dispose()
  }, [height])

  useEffect(() => {
    if (!logoUrl) { setLogo(null); return }
    let active = true
    loadLogo(logoUrl, removeWhite).then((image) => { if (active) setLogo(image) }).catch(() => active && setLogo(null))
    return () => { active = false }
  }, [logoUrl, removeWhite])

  useEffect(() => {
    if (!texture) return
    const canvas = texture.image as HTMLCanvasElement
    const ctx = canvas.getContext('2d')!
    const W = canvas.width
    const H = canvas.height
    const font = getComputedStyle(document.body).fontFamily
    const contrast = isLight(fiber) ? 'rgba(20,19,22,0.75)' : 'rgba(255,255,255,0.8)'
    ctx.fillStyle = fiber
    ctx.fillRect(0, 0, W, H)

    const hasText = text.trim().length > 0
    const box = { w: W * 0.74, h: H * (hasText ? 0.54 : 0.72), cy: H * (hasText ? 0.4 : 0.5) }
    if (logo) {
      const scale = Math.min(box.w / logo.width, box.h / logo.height)
      ctx.drawImage(logo, (W - logo.width * scale) / 2, box.cy - (logo.height * scale) / 2, logo.width * scale, logo.height * scale)
    } else {
      ctx.strokeStyle = contrast
      ctx.lineWidth = 6
      ctx.setLineDash([22, 16])
      ctx.strokeRect((W - box.w) / 2, box.cy - box.h / 2, box.w, box.h)
      ctx.setLineDash([])
      ctx.fillStyle = contrast
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.font = `900 ${Math.min(82, box.h * 0.3)}px ${font}`
      ctx.fillText('TU LOGO AQUÍ', W / 2, box.cy)
    }

    if (hasText) {
      let size = Math.min(120, H * 0.13)
      ctx.font = `900 ${size}px ${font}`
      while (ctx.measureText(text.toUpperCase()).width > W * 0.86 && size > 30) {
        size -= 4
        ctx.font = `900 ${size}px ${font}`
      }
      ctx.fillStyle = textColor
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(text.toUpperCase(), W / 2, H * 0.84)
    }

    drawLoops(ctx, W, H, Math.round(16000 * material.loops * (H / 800)), material.loopSize, 1)
    texture.needsUpdate = true
  }, [texture, fiber, logo, text, textColor, fontsReady, material])

  return texture
}

function useReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(query.matches)
    const onChange = () => setReduced(query.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])
  return reduced
}

// Encuadra puerta y tapete; se aleja en pantallas angostas o con tapetes grandes
function FitCamera({ span, target, base }: { span: number; target: [number, number, number]; base: number }) {
  const { camera, size } = useThree()
  useEffect(() => {
    const distance = base * Math.max(1, span / 1.3) * Math.max(1, 1.35 / (size.width / size.height))
    const elevation = 0.3
    camera.position.set(target[0], target[1] + distance * Math.sin(elevation), target[2] + distance * Math.cos(elevation))
    camera.lookAt(...target)
  }, [camera, size.width, size.height, span, base, target[0], target[1], target[2]])
  return null
}

// Etiqueta dibujada dentro de la escena (sin DOM): aparece y desaparece con un fundido
function Label3D({ text, position, visible = true, accent = false, height = 0.12 }: { text: string; position: [number, number, number]; visible?: boolean; accent?: boolean; height?: number }) {
  const sprite = useRef<THREE.Sprite>(null)
  const { texture, aspect } = useMemo(() => {
    const px = 96
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')!
    const font = `800 ${px * 0.42}px ${getComputedStyle(document.body).fontFamily}`
    ctx.font = font
    const dot = accent ? px * 0.42 : 0
    canvas.width = Math.ceil(ctx.measureText(text).width + px * 0.9 + dot)
    canvas.height = px
    ctx.font = font
    ctx.fillStyle = 'rgba(20,19,22,0.92)'
    ctx.strokeStyle = accent ? '#f7891f' : 'rgba(255,255,255,0.35)'
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.roundRect(2, 2, canvas.width - 4, px - 4, (px - 4) / 2)
    ctx.fill()
    ctx.stroke()
    if (accent) {
      ctx.fillStyle = '#f7891f'
      ctx.beginPath()
      ctx.arc(px * 0.45 + 6, px / 2, px * 0.1, 0, Math.PI * 2)
      ctx.fill()
    }
    ctx.fillStyle = '#ffffff'
    ctx.textBaseline = 'middle'
    ctx.fillText(text, px * 0.45 + dot, px / 2 + 2)
    const tex = new THREE.CanvasTexture(canvas)
    tex.colorSpace = THREE.SRGBColorSpace
    return { texture: tex, aspect: canvas.width / canvas.height }
  }, [text, accent])
  useEffect(() => () => texture.dispose(), [texture])
  useFrame((_, delta) => {
    const s = sprite.current
    if (!s) return
    const material = s.material as THREE.SpriteMaterial
    material.opacity += ((visible ? 1 : 0) - material.opacity) * Math.min(1, delta * 6)
    s.visible = material.opacity > 0.02
  })
  return <sprite ref={sprite} position={position} scale={[height * aspect, height, 1]} renderOrder={10}><spriteMaterial map={texture} transparent opacity={0} depthTest={false} /></sprite>
}

// Entrada de un local: piso de baldosa, fachada clara, puerta con interior iluminado y placa con el logo AXM
function Entrance() {
  const tiles = useMemo(makeTileTexture, [])
  const logo = useTexture('/galeria/logo-axm.jpg', (tex) => { (tex as THREE.Texture).colorSpace = THREE.SRGBColorSpace })
  const wall = <meshStandardMaterial color="#b9b0a4" roughness={0.95} />
  const frame = <meshStandardMaterial color="#121212" metalness={0.6} roughness={0.35} />
  return <group>
    <mesh rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[10, 10]} /><meshStandardMaterial map={tiles} roughness={0.55} /></mesh>
    <mesh position={[-2.75, 1.5, WALL_Z - 0.075]} receiveShadow><boxGeometry args={[4.5, 3, 0.15]} />{wall}</mesh>
    <mesh position={[2.75, 1.5, WALL_Z - 0.075]} receiveShadow><boxGeometry args={[4.5, 3, 0.15]} />{wall}</mesh>
    <mesh position={[0, 2.55, WALL_Z - 0.075]}><boxGeometry args={[1, 0.9, 0.15]} />{wall}</mesh>
    <mesh position={[0, 1.05, WALL_Z - 0.4]}><planeGeometry args={[1.2, 2.2]} /><meshStandardMaterial color="#3a2a1d" emissive="#ff9a3c" emissiveIntensity={0.18} /></mesh>
    <mesh position={[0.18, 1.05, WALL_Z - 0.03]}><planeGeometry args={[0.6, 2.06]} /><meshStandardMaterial color="#9fb7c4" transparent opacity={0.18} metalness={0.9} roughness={0.05} /></mesh>
    {[-0.52, 0.52].map((x) => <mesh key={x} position={[x, 1.07, WALL_Z - 0.06]}><boxGeometry args={[0.05, 2.14, 0.18]} />{frame}</mesh>)}
    <mesh position={[0, 2.12, WALL_Z - 0.06]}><boxGeometry args={[1.09, 0.05, 0.18]} />{frame}</mesh>
    <mesh position={[0, 0.006, WALL_Z - 0.04]}><boxGeometry args={[1.04, 0.012, 0.12]} /><meshStandardMaterial color="#8d8a85" metalness={0.5} roughness={0.4} /></mesh>
    <mesh position={[0.95, 1.45, WALL_Z + 0.01]}><boxGeometry args={[0.42, 0.42, 0.03]} />{frame}</mesh>
    <mesh position={[0.95, 1.45, WALL_Z + 0.027]}><planeGeometry args={[0.38, 0.38]} /><meshStandardMaterial map={logo} emissive="#ffffff" emissiveMap={logo} emissiveIntensity={0.35} /></mesh>
    <mesh position={[-0.95, 2.0, WALL_Z + 0.04]}><boxGeometry args={[0.16, 0.05, 0.08]} />{frame}</mesh>
    <pointLight position={[-0.95, 1.9, WALL_Z + 0.2]} intensity={1.2} color="#ffd29a" distance={2.5} />
  </group>
}

function Stage({ children, span, target, base = 3 }: { children: ReactNode; span: number; target: [number, number, number]; base?: number }) {
  return <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ fov: 50, position: [0, 2, 3.5] }} dpr={[1, 1.75]}>
    <color attach="background" args={['#1c1b1f']} />
    <fog attach="fog" args={['#1c1b1f', 6, 13]} />
    <FitCamera span={span} target={target} base={base} />
    <ambientLight intensity={0.85} />
    <directionalLight position={[1.5, 4, 3]} intensity={2.2} color="#fff6ea" castShadow shadow-mapSize={[1024, 1024]} shadow-camera-left={-3} shadow-camera-right={3} shadow-camera-top={3} shadow-camera-bottom={-3} shadow-bias={-0.0005} />
    <pointLight position={[0, 1.4, WALL_Z - 0.5]} intensity={2} color="#ffb36b" distance={3} />
    <Suspense fallback={null}><Entrance />{children}</Suspense>
    <OrbitControls target={target} enableZoom={false} enablePan={false} minPolarAngle={0.7} maxPolarAngle={1.4} minAzimuthAngle={-0.7} maxAzimuthAngle={0.7} />
  </Canvas>
}

type MaterialSpec = (typeof materials)[number]

// Tapete con perfil en caucho; anima suavemente los cambios de medida y grosor
function Mat({ texture, width, depth, material, labels }: { texture: THREE.Texture; width: number; depth: number; material: MaterialSpec; labels?: { w: string; d: string } }) {
  const bumpMap = useMemo(() => makeBumpTexture(material.loops, material.loopSize), [material])
  const current = useRef({ w: width, d: depth, t: material.thickness })
  const base = useRef<THREE.Mesh>(null)
  const top = useRef<THREE.Mesh>(null)
  const front = useRef<THREE.Group>(null)
  const side = useRef<THREE.Group>(null)
  useEffect(() => () => bumpMap.dispose(), [bumpMap])
  useFrame((_, delta) => {
    const k = 1 - Math.exp(-delta * 7)
    const c = current.current
    c.w += (width - c.w) * k
    c.d += (depth - c.d) * k
    c.t += (material.thickness - c.t) * k
    base.current?.scale.set(c.w + 0.06, c.t, c.d + 0.06)
    base.current?.position.set(0, c.t / 2, 0)
    top.current?.scale.set(c.w, c.d, 1)
    top.current?.position.set(0, c.t + 0.0015, 0)
    bumpMap.repeat.set(c.w / 0.25, c.d / 0.25)
    front.current?.position.set(0, 0.03, c.d / 2 + 0.12)
    side.current?.position.set(c.w / 2 + 0.2, 0.03, 0)
  })
  return <group>
    <mesh ref={base} castShadow receiveShadow><boxGeometry args={[1, 1, 1]} /><meshStandardMaterial color="#141414" roughness={0.85} /></mesh>
    <mesh ref={top} rotation-x={-Math.PI / 2} receiveShadow><planeGeometry args={[1, 1]} /><meshStandardMaterial map={texture} bumpMap={bumpMap} bumpScale={material.bump} roughness={1} /></mesh>
    {labels && <>
      <group ref={front}><Label3D text={labels.w} position={[0, 0, 0]} height={0.1} /></group>
      <group ref={side}><Label3D text={labels.d} position={[0, 0, 0]} height={0.1} /></group>
    </>}
  </group>
}

// Animación del inicio: el tapete cae frente a la puerta, muestra sus partes y se cambia por el siguiente diseño
function HeroMat({ index, onNext, still }: { index: number; onNext: () => void; still: boolean }) {
  const textures = useTexture(realDesigns.map((design) => design.src), (loaded) => {
    for (const tex of [loaded].flat() as THREE.Texture[]) {
      tex.colorSpace = THREE.SRGBColorSpace
      tex.anisotropy = 8
    }
  })
  const narrow = useThree((state) => state.size.width < 520)
  const group = useRef<THREE.Group>(null)
  const start = useRef<number | null>(null)
  const settledRef = useRef(still)
  const [settled, setSettled] = useState(still)
  const z = WALL_Z + 0.08 + HERO_MAT.d / 2

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    if (still) { g.position.set(0, 0, z); g.rotation.set(0, 0, 0); return }
    if (start.current === null) start.current = clock.elapsedTime
    const t = clock.elapsedTime - start.current
    let y = 0
    let tilt = 0
    let spin = 0
    if (t < 1.3) {
      const k = t / 1.3
      const bounce = k < 0.75 ? (k / 0.75) ** 2 : 1 - Math.sin(((k - 0.75) / 0.25) * Math.PI) * 0.06
      y = (1 - bounce) * 2.2
      tilt = (1 - bounce) * 0.6
      spin = (1 - bounce) * 0.5
    } else if (t > 7.3) {
      const k = Math.min(1, (t - 7.3) / 0.7)
      y = k * k * 3
      tilt = -k * 0.5
    }
    if (t >= 8) { start.current = clock.elapsedTime; onNext() }
    g.position.set(0, y, z)
    g.rotation.set(tilt, spin, 0)
    const isSettled = t > 1.4 && t < 7.1
    if (isSettled !== settledRef.current) { settledRef.current = isSettled; setSettled(isSettled) }
  })

  return <>
    <group ref={group} position={[0, 0, z]}>
      <Mat texture={textures[index]} width={HERO_MAT.w} depth={HERO_MAT.d} material={materials[0]} />
    </group>
    <Label3D accent text="FIBRA PVC EN RIZO" position={[0.15, 0.32, z - 0.05]} visible={settled} />
    <Label3D accent text="PERFIL EN CAUCHO" position={[HERO_MAT.w / 2 + 0.3, 0.12, z + 0.25]} visible={settled && !narrow} />
    <Label3D accent text="BASE ANTIDESLIZANTE" position={[-HERO_MAT.w / 2 - 0.25, 0.08, z + HERO_MAT.d / 2]} visible={settled && !narrow} />
  </>
}

function InstagramIcon({ size = 18 }: { size?: number }) {
  return <svg aria-hidden width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" /></svg>
}

type ChatMessage = { from: 'bot' | 'user'; text: string; cta?: boolean }

function findAnswer(question: string): ChatMessage {
  const text = normalize(question)
  if (/\b(hola|buenas|buenos dias|buenas tardes|buenas noches|hey|saludos)\b/.test(text) && text.split(' ').length <= 4) {
    return { from: 'bot', text: '¡Hola! 👋 Qué gusto saludarte. ¿Qué te gustaría saber de nuestros tapetes? Puedes escribirme o tocar una de las preguntas de abajo.' }
  }
  if (/\b(gracias|muchas gracias|listo|perfecto|genial)\b/.test(text)) {
    return { from: 'bot', text: '¡Con mucho gusto! 🧡 Si quieres avanzar con tu tapete, un asesor te atiende por WhatsApp.', cta: true }
  }
  let best: (typeof faqs)[number] | null = null
  let bestScore = 0
  for (const faq of faqs) {
    const score = faq.keys.filter((key) => text.includes(normalize(key))).length
    if (score > bestScore) { best = faq; bestScore = score }
  }
  if (best) return { from: 'bot', text: best.a, cta: best.cta }
  return { from: 'bot', text: 'Mmm, esa todavía no me la sé 🙈. Pero el equipo de AXM te puede responder por WhatsApp. ¿Quieres que te comunique con un asesor?', cta: true }
}

function ChatAssistant() {
  const [open, setOpen] = useState(false)
  const [question, setQuestion] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([{ from: 'bot', text: '¡Hola! Soy el asistente de AXM Tapetes 👋 Te ayudo con precios, medidas, materiales, lavado y envíos. ¿Qué quieres saber?' }])
  const [asked, setAsked] = useState<string[]>([])
  const list = useRef<HTMLDivElement>(null)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => { list.current?.scrollTo({ top: list.current.scrollHeight, behavior: 'smooth' }) }, [messages, typing])
  useEffect(() => {
    if (!open) return
    input.current?.focus({ preventScroll: true })
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const ask = (text: string) => {
    if (!text.trim() || typing) return
    setMessages((current) => [...current, { from: 'user', text: text.trim() }])
    setQuestion('')
    setTyping(true)
    const faq = faqs.find((item) => item.q === text)
    if (faq) setAsked((current) => [...current, faq.q])
    window.setTimeout(() => {
      setMessages((current) => [...current, faq ? { from: 'bot', text: faq.a, cta: faq.cta } : findAnswer(text)])
      setTyping(false)
    }, 650)
  }
  const suggestions = faqs.filter((faq) => !asked.includes(faq.q)).slice(0, messages.length > 1 ? 4 : 6)

  return <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-40 flex flex-col items-end gap-3 sm:right-5">
    {open && <div role="dialog" aria-label="Asistente AXM" className="flex h-[min(560px,calc(100dvh-6rem))] w-[min(380px,calc(100vw-2rem))] max-sm:h-[calc(100dvh-5.5rem)] flex-col overflow-hidden rounded-[1.75rem] bg-[#f7f3ee] text-[#141316] shadow-[0_24px_80px_rgba(0,0,0,0.45)] ring-1 ring-black/10 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="relative flex items-center gap-3 bg-[#141316] px-4 py-3.5 text-white">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1" style={{ backgroundImage: peacock }} />
        <Image src="/galeria/logo-axm.jpg" alt="" width={40} height={40} className="size-10 rounded-full ring-2 ring-[#f7891f]" />
        <div className="min-w-0 flex-1"><p className="text-sm font-extrabold">Asistente AXM</p><p className="flex items-center gap-1.5 text-xs text-white/70"><span className="size-2 rounded-full bg-[#07b266]" /> En línea · responde al instante</p></div>
        <button type="button" aria-label="Cerrar asistente" onClick={() => setOpen(false)} className="grid size-10 place-items-center text-white/80 hover:bg-white/10"><X size={18} /></button>
      </div>
      <div ref={list} aria-live="polite" className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.map((message, index) => message.from === 'user'
          ? <p key={index} className="max-w-[85%] self-end rounded-2xl rounded-br-md bg-[#f7891f] px-3.5 py-2.5 text-sm font-medium leading-5 text-[#141316]">{message.text}</p>
          : <div key={index} className="flex max-w-[92%] items-end gap-2"><Image src="/galeria/logo-axm.jpg" alt="" width={28} height={28} className="size-7 shrink-0 rounded-full" /><div className="rounded-2xl rounded-bl-md bg-white px-3.5 py-2.5 text-sm leading-5 shadow-sm ring-1 ring-black/5"><p>{message.text}</p>{message.cta && <a href={wa('Hola AXM, vengo del asistente de la página y quiero cotizar un tapete.')} target="_blank" rel="noopener noreferrer" className="mt-2.5 inline-flex items-center gap-2 bg-[#25d366] px-3.5 py-2 text-xs font-extrabold text-[#0b3d1f]"><Phone size={14} /> Hablar por WhatsApp</a>}</div></div>)}
        {typing && <div className="flex items-end gap-2"><Image src="/galeria/logo-axm.jpg" alt="" width={28} height={28} className="size-7 rounded-full" /><div aria-label="Escribiendo" className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3.5 shadow-sm ring-1 ring-black/5">{[0, 150, 300].map((delay) => <span key={delay} className="size-1.5 animate-bounce rounded-full bg-[#141316]/50" style={{ animationDelay: `${delay}ms` }} />)}</div></div>}
      </div>
      {suggestions.length > 0 && <div className="flex gap-2 overflow-x-auto px-4 pb-3 [scrollbar-width:none]">{suggestions.map((faq) => <button key={faq.q} type="button" onClick={() => ask(faq.q)} className="shrink-0 border border-[#f7891f]/60 bg-white px-3 py-2 text-xs font-bold text-[#141316] hover:bg-[#f7891f]/15">{faq.q}</button>)}</div>}
      <form onSubmit={(event) => { event.preventDefault(); ask(question) }} className="flex items-center gap-2 border-t border-black/10 bg-white p-3">
        <input ref={input} aria-label="Escribe tu pregunta" value={question} onChange={(event) => setQuestion(event.target.value)} placeholder="Escribe tu pregunta…" className="min-w-0 flex-1 bg-[#f1ece5] px-4 py-2.5 text-base outline-none focus:ring-2 focus:ring-[#f7891f]/50" style={{ borderRadius: 999 }} />
        <button type="submit" aria-label="Enviar pregunta" disabled={!question.trim() || typing} className="grid size-11 shrink-0 place-items-center bg-[#f7891f] text-[#141316] disabled:opacity-40"><Send size={18} /></button>
      </form>
    </div>}
    <div className={`flex flex-col items-end gap-3 sm:flex-row sm:items-center ${open ? 'max-sm:hidden' : ''}`}>
      {!open && <button type="button" onClick={() => setOpen(true)} aria-label="Abrir asistente AXM" className="relative grid size-14 place-items-center bg-[#141316] text-white shadow-lg ring-1 ring-[#f7891f]/70 sm:flex sm:size-auto sm:min-h-12 sm:gap-2 sm:px-4"><MessageCircle size={22} className="text-[#f7891f] sm:size-[18px]" /><span className="hidden text-xs font-extrabold sm:inline">¿Dudas? Pregúntame</span><span aria-hidden className="absolute right-0.5 top-0.5 size-3 rounded-full bg-[#07b266] ring-2 ring-[#141316] sm:hidden" /></button>}
      <a href={wa()} target="_blank" rel="noopener noreferrer" aria-label="Escríbenos por WhatsApp" className="grid size-14 place-items-center bg-[#25d366] text-white shadow-lg"><Phone size={24} /></a>
    </div>
  </div>
}

export function AXMSite() {
  const reducedMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [material, setMaterial] = useState(materials[0])
  const [size, setSize] = useState(sizes[0])
  const [custom, setCustom] = useState({ w: 150, h: 100 })
  const [fiber, setFiber] = useState(fibers[1])
  const [logoUrl, setLogoUrl] = useState<string | null>(null)
  const [logoName, setLogoName] = useState('')
  const [removeWhite, setRemoveWhite] = useState(true)
  const [matText, setMatText] = useState('')
  const [textColor, setTextColor] = useState(fibers[5])
  const [heroDesign, setHeroDesign] = useState(0)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const closeLightbox = useRef<HTMLButtonElement>(null)

  const clampCm = (value: number) => Math.min(400, Math.max(40, Number.isFinite(value) ? value : 40))
  const dims = size.w ? { w: size.w, h: size.h } : { w: clampCm(custom.w), h: clampCm(custom.h) }
  const sizeLabel = `${dims.w} × ${dims.h} cm`
  const designTexture = useDesignTexture({ fiber: fiber.hex, logoUrl, removeWhite, text: matText, textColor: textColor.hex, ratio: dims.w / dims.h, material })
  const configTarget = useMemo<[number, number, number]>(() => [0, 0.5, WALL_Z + dims.h / 200], [dims.h])

  const showPhoto = (step: number) => setLightbox((current) => current === null ? null : (current + step + gallery.length) % gallery.length)
  useEffect(() => {
    if (lightbox === null) return
    closeLightbox.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(null)
      if (event.key === 'ArrowRight') showPhoto(1)
      if (event.key === 'ArrowLeft') showPhoto(-1)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', onKey) }
  }, [lightbox !== null])
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])
  useEffect(() => {
    if (!reducedMotion) return
    const timer = window.setInterval(() => setHeroDesign((current) => (current + 1) % realDesigns.length), 7000)
    return () => window.clearInterval(timer)
  }, [reducedMotion])
  useEffect(() => () => { if (logoUrl) URL.revokeObjectURL(logoUrl) }, [logoUrl])

  const onLogo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setLogoUrl(URL.createObjectURL(file))
    setLogoName(file.name)
  }
  const quote = `Hola AXM, quiero cotizar un tapete ${material.name}, ${sizeLabel}, fibra ${fiber.name.toLowerCase()}${logoName ? ', con mi logo' : ''}${matText.trim() ? `, con el texto "${matText.trim()}" en ${textColor.name.toLowerCase()}` : ''}.`

  const swatch = (selected: (typeof fibers)[number], onPick: (item: (typeof fibers)[number]) => void, label: string) => <div className="flex flex-wrap gap-2">{fibers.map((item) => <button key={item.name} type="button" title={item.name} aria-label={`${label}: ${item.name}`} aria-pressed={selected.name === item.name} onClick={() => onPick(item)} className={`grid size-10 place-items-center border-2 ${selected.name === item.name ? 'border-[#f7891f] ring-2 ring-[#f7891f]/30' : 'border-[#141316]/10'}`} style={{ backgroundColor: item.hex }}>{selected.name === item.name && <Check size={16} className={isLight(item.hex) ? 'text-[#141316]' : 'text-white'} />}</button>)}</div>
  const sectionTitle = 'text-[clamp(2.5rem,7vw,4.5rem)] font-black uppercase leading-[0.9] tracking-[-0.06em]'
  const eyebrow = 'mb-3 text-[11px] font-extrabold uppercase tracking-[0.22em]'

  return <main className="min-h-screen overflow-x-clip bg-[#141316] text-[#f7f3ee]">
    <div className="bg-[#f7891f] px-5 py-2 text-center text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#141316] sm:tracking-[0.22em]">Tapetes personalizados en PVC · Envíos a todo Colombia<span className="hidden sm:inline"> · WhatsApp {contact.phoneLabel}</span></div>
    <header className="sticky top-0 z-30 bg-[#141316]/90 backdrop-blur-xl">
      <nav aria-label="Principal" className="mx-auto flex max-w-[1360px] items-center justify-between gap-3 px-5 py-3 lg:px-8 lg:py-4">
        <a href="#inicio" className="flex min-w-0 items-center gap-3"><Image src="/galeria/logo-axm.jpg" alt="" width={44} height={44} priority className="size-11 shrink-0 rounded-xl" /><span className="truncate text-base font-black uppercase tracking-[0.12em] sm:text-lg sm:tracking-[0.16em]">AXM <span className="text-[#f7891f]">TAPETES</span></span></a>
        <div className="hidden items-center gap-7 text-[11px] font-extrabold uppercase tracking-[0.16em] text-white/75 lg:flex"><a href="#coleccion" className="hover:text-[#f7891f]">Materiales</a><a href="#trabajos" className="hover:text-[#f7891f]">Trabajos</a><a href="#configurador" className="hover:text-[#f7891f]">Diseñador</a><a href="#historia" className="hover:text-[#f7891f]">AXM LAB</a><a href="#contacto" className="hover:text-[#f7891f]">Contacto</a></div>
        <div className="flex shrink-0 items-center gap-2"><a href={contact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram de AXM Tapetes" className="hidden size-11 place-items-center border border-white/20 hover:border-[#f7891f] hover:text-[#f7891f] sm:grid"><InstagramIcon /></a><a href={wa()} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 bg-[#25d366] px-4 py-3 text-[11px] font-extrabold uppercase tracking-wider text-[#0b3d1f] sm:flex"><Phone size={15} /> WhatsApp</a><button aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="menu-movil" onClick={() => setMenuOpen(!menuOpen)} className="grid size-11 place-items-center border border-white/20 lg:hidden">{menuOpen ? <X size={20} /> : <Menu size={20} />}</button></div>
      </nav>
      <div aria-hidden className="h-1" style={{ backgroundImage: peacock }} />
      {menuOpen && <div id="menu-movil" className="bg-[#242227] px-5 pb-5 text-sm font-extrabold uppercase tracking-wider lg:hidden"><div className="flex flex-col">{[['#coleccion', 'Materiales'], ['#trabajos', 'Trabajos'], ['#configurador', 'Diseñador'], ['#historia', 'AXM LAB'], ['#contacto', 'Contacto']].map(([href, label]) => <a key={href} href={href} onClick={() => setMenuOpen(false)} className="border-b border-white/10 py-4">{label}</a>)}<div className="mt-5 grid grid-cols-2 gap-3"><a href={wa()} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#25d366] px-4 py-4 text-[#0b3d1f]"><Phone size={16} /> WhatsApp</a><a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border border-white/25 px-4 py-4"><InstagramIcon size={16} /> Instagram</a></div></div></div>}
    </header>

    <section id="inicio" className="mx-auto grid max-w-[1360px] gap-8 px-5 pb-16 pt-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center lg:px-8 lg:pb-24 lg:pt-16">
      <div><div className="mb-6 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#f7891f]"><span aria-hidden className="h-2 w-8" style={{ backgroundImage: peacock }} /> Fabricamos identidad para tus entradas</div><h1 className="max-w-2xl text-[clamp(2.9rem,7vw,6.6rem)] font-black uppercase leading-[0.88] tracking-[-0.06em]">Que tu<br /><span className="text-[#f7891f]">marca</span><br />pise fuerte.</h1><p className="mt-7 max-w-lg text-base leading-7 text-white/75">Tapetes atrapamugres personalizados en fibra PVC para empresas que quieren una entrada limpia, resistente y difícil de olvidar.</p><div className="mt-8 flex flex-wrap gap-3"><a href="#configurador" className="inline-flex items-center gap-3 bg-[#f7891f] px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[#141316]">Diseñar mi tapete <ArrowUpRight size={16} /></a><a href={wa()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-[#25d366] px-5 py-4 text-xs font-extrabold uppercase tracking-wider text-[#25d366]"><Phone size={16} /> Cotizar por WhatsApp</a></div><div className="mt-12 grid max-w-md grid-cols-3 border-y border-white/10 py-5"><div><p className="text-2xl font-black text-[#f7891f]">+100</p><p className="mt-1 text-[11px] uppercase tracking-wider text-white/65">Empresas</p></div><div className="border-l border-white/10 pl-4"><p className="text-2xl font-black text-[#f7891f]">21</p><p className="mt-1 text-[11px] uppercase tracking-wider text-white/65">Colores</p></div><div className="border-l border-white/10 pl-4"><p className="text-2xl font-black text-[#f7891f]">10+</p><p className="mt-1 text-[11px] uppercase tracking-wider text-white/65">Años</p></div></div></div>
      <div className="relative min-h-[440px] overflow-hidden border border-white/10 bg-[#1c1b1f] lg:min-h-[620px]"><div className="absolute inset-0"><Stage span={HERO_MAT.w} target={[0, 0.9, -0.25]}><HeroMat index={heroDesign} still={reducedMotion} onNext={() => setHeroDesign((current) => (current + 1) % realDesigns.length)} /></Stage></div><div className="pointer-events-none absolute left-5 top-5 border border-[#f7891f] bg-[#141316]/80 px-3 py-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-[#f7891f]">Diseño real · 3D</div><div className="pointer-events-none absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-3"><div className="border-l-4 border-[#f7891f] bg-[#141316]/85 px-4 py-3"><p className="text-[10px] font-extrabold uppercase tracking-wider text-[#f7891f]">Fabricado por AXM</p><p className="mt-1 text-sm font-black uppercase">{realDesigns[heroDesign].client}</p></div><div className="flex gap-1.5 bg-[#141316]/70 px-3 py-2">{realDesigns.map((design, index) => <span key={design.src} aria-hidden className={`h-2 transition-all ${heroDesign === index ? 'w-6 bg-[#f7891f]' : 'w-2 bg-white/40'}`} />)}</div></div></div>
    </section>

    <section id="coleccion" className="bg-[#f7f3ee] px-5 py-16 text-[#141316] lg:px-8 lg:py-24"><div className="mx-auto max-w-[1360px]"><div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className={`${eyebrow} text-[#c96a0f]`}>Materiales de batalla</p><h2 className={`${sectionTitle} max-w-2xl`}>Elegir bien<br /><span className="text-[#f7891f]">se siente.</span></h2></div><p className="max-w-sm text-sm leading-6 text-[#141316]/70">Fibra PVC en rizo con base antideslizante y perfil en caucho. Así se ve de cerca en tapetes que ya fabricamos.</p></div><div className="mt-12 grid gap-4 md:grid-cols-3">{materials.map((item, i) => <article key={item.name} className="group flex flex-col border border-[#141316]/10 bg-white"><div className="relative h-64 overflow-hidden"><Image src={item.image} alt={`Primer plano de la fibra ${item.name} en un tapete fabricado por AXM`} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover transition-transform duration-500 group-hover:scale-110 motion-reduce:transition-none" /><span className="absolute left-5 top-5 bg-[#f7891f] px-3 py-1.5 text-[11px] font-black text-[#141316]">0{i + 1}</span><span className="absolute bottom-4 right-4 bg-[#141316]/80 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white">Foto real</span></div><div className="flex flex-1 flex-col p-5"><h3 className="text-xl font-black uppercase tracking-[-0.03em]">{item.name}</h3><p className="mt-2 flex-1 text-sm leading-6 text-[#141316]/70">{item.note}</p><a href="#configurador" onClick={() => setMaterial(item)} className="mt-5 inline-flex w-fit items-center gap-2 border border-[#141316]/20 px-4 py-2.5 text-[11px] font-extrabold uppercase tracking-wider hover:border-[#f7891f]">Probar en 3D <ArrowUpRight size={14} /></a></div></article>)}</div></div></section>

    <section id="trabajos" aria-labelledby="trabajos-titulo" className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-[1360px]">
      <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><p className={`${eyebrow} text-[#f7891f]`}>Galería / Trabajos reales</p><h2 id="trabajos-titulo" className={sectionTitle}>Entradas que<br /><span className="text-[#f7891f]">ya pisan fuerte.</span></h2></div><div className="flex max-w-sm flex-col gap-4"><p className="text-sm leading-6 text-white/75">Una selección de negocios que ya reciben a sus clientes con un tapete AXM.</p><a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-2 border border-white/25 px-5 py-3 text-xs font-extrabold uppercase tracking-wider hover:border-[#f7891f] hover:text-[#f7891f]"><InstagramIcon size={16} /> Ver más en {contact.instagramUser}</a></div></div>
      <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">{gallery.map((item, index) => <li key={item.src}><button type="button" onClick={() => setLightbox(index)} aria-label={`Ampliar trabajo: ${item.client}`} className="group relative block aspect-square w-full overflow-hidden rounded-[1.25rem] text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f7891f] md:rounded-[1.75rem]"><Image src={item.src} alt={item.alt} fill sizes="(min-width: 1024px) 25vw, 50vw" style={{ objectPosition: item.focus }} className="object-cover transition-transform duration-500 group-hover:scale-[1.06] motion-reduce:transition-none" /><span className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-gradient-to-t from-[#141316]/95 via-[#141316]/60 to-transparent p-3 pt-10 md:p-4 md:pt-12"><span className="w-fit bg-[#f7891f] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-[#141316]">{item.tag}</span><span className="text-xs font-black uppercase leading-tight md:text-sm">{item.client}</span></span></button></li>)}</ul>
    </div></section>

    {lightbox !== null && <div role="dialog" aria-modal="true" aria-label={`Trabajo: ${gallery[lightbox].client}`} className="fixed inset-0 z-50 flex flex-col bg-[#141316]/95 p-4 backdrop-blur-sm sm:p-8" onClick={() => setLightbox(null)}>
      <div className="flex items-center justify-between gap-4 pb-4"><p className="min-w-0 truncate text-sm font-black uppercase tracking-wider"><span className="text-[#f7891f]">{lightbox + 1}/{gallery.length}</span> · {gallery[lightbox].client}</p><button ref={closeLightbox} type="button" aria-label="Cerrar galería" onClick={() => setLightbox(null)} className="grid size-11 shrink-0 place-items-center border border-white/20"><X size={20} /></button></div>
      <div className="relative min-h-0 flex-1" onClick={(event) => event.stopPropagation()}><Image src={gallery[lightbox].src} alt={gallery[lightbox].alt} fill sizes="100vw" className="object-contain" /></div>
      <div className="flex items-center justify-center gap-4 pt-4" onClick={(event) => event.stopPropagation()}><button type="button" aria-label="Foto anterior" onClick={() => showPhoto(-1)} className="grid size-12 place-items-center bg-[#f7f3ee] text-[#141316]"><ChevronLeft size={22} /></button><a href={wa(`Hola AXM, quiero un tapete como el de ${gallery[lightbox].client}`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-[#25d366] px-5 py-3.5 text-xs font-extrabold uppercase tracking-wider text-[#0b3d1f]"><Phone size={15} /> Quiero uno así</a><button type="button" aria-label="Foto siguiente" onClick={() => showPhoto(1)} className="grid size-12 place-items-center bg-[#f7f3ee] text-[#141316]"><ChevronRight size={22} /></button></div>
    </div>}

    <section id="configurador" aria-labelledby="configurador-titulo" className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto max-w-[1360px]">
      <div className="mb-10 flex items-end justify-between gap-5"><div><p className={`${eyebrow} text-[#f7891f]`}>AXM configurador</p><h2 id="configurador-titulo" className={sectionTitle}>Hazlo<br /><span className="text-[#f7891f]">tuyo.</span></h2></div><p className="hidden max-w-xs text-sm leading-6 text-white/70 md:block">Sube tu logo, elige fibra, material y medida, y míralo frente a una puerta real a escala.</p></div>
      <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr] lg:items-start">
        <div className="sticky top-[4.5rem] z-10 border border-white/10 bg-[#242227] p-3 shadow-[0_18px_40px_rgba(0,0,0,0.45)] sm:p-5 md:p-6 lg:top-24 lg:shadow-none">
          <div className="mb-4 hidden items-center justify-between gap-3 sm:flex"><div><p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#f7891f]">Vista previa 3D a escala</p><p className="mt-1 text-xl font-black uppercase">Tu entrada, en proceso</p></div><span className="flex shrink-0 items-center gap-2 text-[10px] font-extrabold uppercase text-[#07b266]"><span className="size-2 rounded-full bg-[#07b266]" /> En vivo</span></div>
          <div className="grid gap-3 xl:grid-cols-[1fr_11rem]">
            <div className="relative aspect-[16/10] overflow-hidden border border-white/10 bg-[#1c1b1f] sm:aspect-[1.5]"><div className="absolute inset-0">{designTexture && <Stage span={dims.w / 100} target={configTarget} base={2.3}><group position={[0, 0, WALL_Z + 0.08 + dims.h / 200]}><Mat texture={designTexture} width={dims.w / 100} depth={dims.h / 100} material={material} labels={{ w: `${dims.w} cm`, d: `${dims.h} cm` }} /></group></Stage>}</div><span className="pointer-events-none absolute left-3 top-3 bg-[#141316]/85 px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-white/85">{material.name} · Fibra {fiber.name}</span></div>
            <div className="flex flex-col gap-3">
              <div><p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">Medida</p><div className="grid grid-cols-3 gap-2 xl:grid-cols-1">{sizes.map((option) => <button key={option.label} type="button" aria-pressed={size.label === option.label} onClick={() => setSize(option)} className={`border px-2 py-2.5 text-[11px] font-extrabold transition-colors ${size.label === option.label ? 'border-[#f7891f] bg-[#f7891f] text-[#141316]' : 'border-white/15 text-white hover:border-[#f7891f]'}`}>{option.label}</button>)}</div>{!size.w && <div className="mt-2 grid grid-cols-2 gap-2">{([['w', 'Ancho'], ['h', 'Largo']] as const).map(([key, label]) => <label key={key} className="text-[10px] font-bold uppercase tracking-wider text-white/70">{label} (cm)<input type="number" inputMode="numeric" min={40} max={400} value={custom[key]} onChange={(event) => setCustom((current) => ({ ...current, [key]: Number(event.target.value) }))} onBlur={() => setCustom((current) => ({ ...current, [key]: clampCm(current[key]) }))} className="mt-1 w-full border border-white/15 bg-[#141316] px-3 py-2 text-base font-bold text-white outline-none focus:border-[#f7891f]" /></label>)}</div>}</div>
              <div><p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.18em] text-white/70">Material</p><div className="grid grid-cols-3 gap-2 xl:grid-cols-1">{materials.map((item) => <button key={item.name} type="button" aria-pressed={material.name === item.name} onClick={() => setMaterial(item)} className={`flex flex-col items-center gap-1.5 border px-1 py-2 text-center transition-colors xl:flex-row xl:gap-2 xl:p-1.5 xl:pr-3 xl:text-left ${material.name === item.name ? 'border-[#f7891f] bg-[#f7891f]/20' : 'border-white/15 hover:border-[#f7891f]'}`}><span className="relative size-8 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20"><Image src={item.image} alt="" fill sizes="32px" className="object-cover" /></span><span className="min-w-0 break-words text-[10px] font-extrabold uppercase leading-tight text-white">{item.name.replace('PVC ', '')}</span></button>)}</div></div>
            </div>
          </div>
          <p className="mt-3 hidden text-xs leading-5 text-white/65 sm:block">La puerta mide 1 m de ancho para que compares el tamaño. Arrastra para girar. Un asesor ajusta tu logo a la técnica de fibra antes de fabricar.</p>
        </div>
        <div className="border border-white/10 bg-[#f7f3ee] p-5 text-[#141316] md:p-8"><div className="flex flex-col gap-7">
          <div><p className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.18em]">1. Logo o diseño</p><label className="flex cursor-pointer items-center justify-center gap-3 border border-dashed border-[#141316]/30 px-4 py-5 text-xs font-extrabold uppercase tracking-wider transition-colors hover:border-[#f7891f] focus-within:border-[#f7891f]"><Upload size={16} /> <span className="min-w-0 truncate">{logoName || 'Subir imagen (PNG, JPG, SVG)'}</span><input type="file" accept="image/*" className="sr-only" onChange={onLogo} /></label><label className="mt-3 flex cursor-pointer items-center gap-3 text-sm"><input type="checkbox" checked={removeWhite} onChange={(event) => setRemoveWhite(event.target.checked)} className="size-5 accent-[#f7891f]" /> Quitar fondo blanco del logo</label></div>
          <div><div className="mb-3 flex items-baseline justify-between gap-3"><p className="text-[11px] font-extrabold uppercase tracking-[0.18em]">2. Color de la fibra <span className="font-semibold normal-case tracking-normal text-[#141316]/70">· {fiber.name}</span></p><a href="/galeria/catalogo-colores.jpg" target="_blank" rel="noopener noreferrer" className="shrink-0 text-xs font-bold text-[#c96a0f] underline underline-offset-2">Ver catálogo real</a></div>{swatch(fiber, setFiber, 'Color de fibra')}</div>
          <div><label htmlFor="texto-tapete" className="mb-3 block text-[11px] font-extrabold uppercase tracking-[0.18em]">3. Texto (opcional)</label><input id="texto-tapete" value={matText} maxLength={28} onChange={(event) => setMatText(event.target.value)} placeholder="Ej.: Bienvenidos" className="w-full border border-[#141316]/20 bg-white px-4 py-3 text-base outline-none focus:border-[#f7891f]" />{matText.trim() && <div className="mt-3"><p className="mb-2 text-xs font-bold">Color del texto · {textColor.name}</p>{swatch(textColor, setTextColor, 'Color del texto')}</div>}</div>
          <div className="border-t border-[#141316]/10 pt-5 text-sm leading-6"><p className="text-[11px] font-extrabold uppercase tracking-[0.18em]">Tu tapete</p><p className="mt-2 text-[#141316]/80">{material.name} · {sizeLabel} · Fibra {fiber.name.toLowerCase()}{matText.trim() ? ` · "${matText.trim()}"` : ''}</p></div>
          <a href={wa(quote)} target="_blank" rel="noopener noreferrer" className="-mt-2 flex items-center justify-center gap-2 bg-[#25d366] px-4 py-4 text-xs font-extrabold uppercase tracking-wider text-[#0b3d1f]"><Phone size={16} /> Cotizar mi diseño por WhatsApp</a>
          {logoName && <p className="-mt-4 text-xs leading-5 text-[#141316]/70">Al abrir WhatsApp, adjunta tu logo en el chat para que el asesor lo revise.</p>}
        </div></div>
      </div>
    </div></section>

    <section id="historia" className="bg-[#242227] px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-[1360px] gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><div><p className={`${eyebrow} text-[#f7891f]`}>AXM LAB / Nuestra historia</p><h2 className={sectionTitle}>No hacemos<br /><span className="text-[#f7891f]">tapetes.</span><br />Hacemos entradas.</h2></div><div className="grid gap-7 border-l-4 pl-6 md:grid-cols-2" style={{ borderImage: `${peacock.replace('90deg', '180deg')} 1` }}><p className="text-lg leading-8 text-white/75">Cada tapete empieza con una conversación: qué quieres que sienta alguien al cruzar tu puerta. Luego vienen el diseño, la fibra, los colores y el oficio.</p><p className="text-lg leading-8 text-white/75">Trabajamos con empresas de todo el país para convertir una superficie funcional en una pieza que comunica, resiste y representa.</p></div></div></section>

    <section id="envios" className="bg-[#f7891f] px-5 py-16 text-[#141316] lg:px-8 lg:py-20"><div className="mx-auto max-w-[1360px]"><div className="mb-10 flex items-end justify-between gap-5"><div><p className={eyebrow}>Servicio sin fronteras</p><h2 className={sectionTitle}>Del diseño<br />a tu puerta.</h2></div><p className="hidden max-w-xs text-sm leading-6 text-[#141316]/80 md:block">Nos ocupamos de producir, empacar y enviar. Tú solo disfruta la entrada.</p></div><div className="grid gap-3 md:grid-cols-3"><div className="border border-[#141316]/25 p-6"><Truck size={24} /><h3 className="mt-10 text-2xl font-black uppercase">Envíos nacionales</h3><p className="mt-2 text-sm leading-6 text-[#141316]/80">Llegamos a todo Colombia con seguimiento.</p></div><div className="border border-[#141316]/25 p-6"><ShieldCheck size={24} /><h3 className="mt-10 text-2xl font-black uppercase">Hecho para durar</h3><p className="mt-2 text-sm leading-6 text-[#141316]/80">Fibra PVC lavable, base antideslizante y perfil en caucho.</p></div><div className="border border-[#141316]/25 p-6"><Zap size={24} /><h3 className="mt-10 text-2xl font-black uppercase">Pago fácil</h3><p className="mt-2 text-sm leading-6 text-[#141316]/80">Tarjetas, PSE, transferencia y opciones empresa.</p></div></div></div></section>

    <section id="contacto" aria-labelledby="contacto-titulo" className="px-5 py-16 lg:px-8 lg:py-24"><div className="mx-auto grid max-w-[1360px] gap-8 lg:grid-cols-[1fr_1fr] lg:items-center">
      <div><p className={`${eyebrow} text-[#f7891f]`}>Contacto</p><h2 id="contacto-titulo" className={sectionTitle}>Hablemos de<br /><span className="text-[#f7891f]">tu entrada.</span></h2><p className="mt-6 max-w-md text-base leading-7 text-white/75">Escríbenos con tu logo y la medida de tu entrada, y te enviamos la propuesta de diseño y la cotización.</p></div>
      <div className="grid gap-3 sm:grid-cols-2">
        <a href={wa()} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-6 rounded-[2rem] bg-[#25d366] p-6 text-[#0b3d1f]"><span className="grid size-12 place-items-center bg-white/30"><Phone size={22} /></span><span><span className="block text-[11px] font-extrabold uppercase tracking-[0.18em]">WhatsApp</span><span className="mt-1 block text-xl font-black">{contact.phoneLabel}</span><span className="mt-2 inline-flex items-center gap-1 text-sm font-bold">Escribir ahora <ArrowUpRight size={15} /></span></span></a>
        <a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="group flex flex-col gap-6 rounded-[2rem] border border-white/15 bg-[#242227] p-6"><span className="grid size-12 place-items-center text-white" style={{ backgroundImage: peacock }}><InstagramIcon size={22} /></span><span><span className="block text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#f7891f]">Instagram</span><span className="mt-1 block text-xl font-black">{contact.instagramUser}</span><span className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-white/75">Ver trabajos <ArrowUpRight size={15} /></span></span></a>
        <div className="flex items-center gap-4 rounded-[2rem] border border-white/15 p-5 sm:col-span-2"><Sparkles size={22} className="shrink-0 text-[#f7891f]" /><p className="text-sm leading-6 text-white/75">¿Tienes una duda rápida? Pregúntale al asistente AXM: precios, lavado, medidas, materiales y envíos.</p></div>
      </div>
    </div></section>

    <footer className="border-t border-white/10 bg-[#141316] px-5 pb-28 pt-10 lg:px-8 lg:pb-10"><div className="mx-auto flex max-w-[1360px] flex-col gap-8 md:flex-row md:items-end md:justify-between"><div className="flex items-center gap-4"><Image src="/galeria/logo-axm.jpg" alt="Logo Tapetes & Alfombras AXM" width={72} height={72} className="size-16 rounded-2xl" /><div><p className="text-2xl font-black uppercase tracking-[0.1em] sm:text-3xl">AXM <span className="text-[#f7891f]">TAPETES</span></p><p className="mt-2 text-sm text-white/65">Personalizamos superficies para marcas que dejan huella.</p></div></div><div className="flex flex-col gap-4 md:items-end"><div className="flex flex-wrap items-center gap-5 text-[11px] font-extrabold uppercase tracking-wider text-white/75"><a href="#coleccion">Materiales</a><a href="#trabajos">Trabajos</a><a href="#configurador">Diseñador</a><a href="#contacto">Contacto</a></div><div className="flex flex-wrap items-center gap-3 text-sm"><a href={wa()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/85 hover:text-[#25d366]"><Phone size={16} /> {contact.phoneLabel}</a><span aria-hidden className="text-white/30">·</span><a href={contact.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-white/85 hover:text-[#f7891f]"><InstagramIcon size={16} /> {contact.instagramUser}</a></div></div></div></footer>

    <ChatAssistant />
  </main>
}
