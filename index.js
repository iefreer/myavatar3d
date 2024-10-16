import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { MyAvatar } from './myavatar.module.js'
import { qas } from './qa.js'
import { load_animations } from "./animations.js";
import { getOption } from "./utils.js";

const mixers = [], actions = [];
let mixer, action;
let newAction, currentAction;
const switchAction = () => {

  if (newAction != currentAction) {

      currentAction.fadeOut(0.3);
      newAction.reset();
      newAction.setEffectiveWeight( 1 );
      newAction.play();
      newAction.fadeIn(0.3);
      currentAction = newAction;

  }

}

// Scene
const scene = new THREE.Scene()

// Lights

const alight = new THREE.AmbientLight(0xffffff, 2.0)
scene.add(alight)

const dlight = new THREE.DirectionalLight(0xffffff, 1.5)
scene.add(dlight)

// Load glb
const loader = new GLTFLoader()
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
loader.setDRACOLoader(dracoLoader)

loader.load(
	'hall.glb',
	function ( gltf ) {
		scene.add( gltf.scene );
	}
);

loader.load(
	'assets/models/robot/idle.glb',
	async function ( gltf ) {
    const model = gltf.scene;
    mixer = new THREE.AnimationMixer( model );
    mixers.push( mixer );

    action = mixer.clipAction( gltf.animations[0] );
    actions.push({name: 'idle', action});

    gltf.scene.scale.multiplyScalar(0.8)
    gltf.scene.position.z = -2.5;
    gltf.scene.position.x = -1.2;
		scene.add( gltf.scene );

    await load_animations(mixer, loader, actions);

    let actBoring = actions.find(a => a.name === 'yawn');
    action.fadeOut(0.3);
    actBoring.action.reset();
    actBoring.action.setEffectiveWeight( 1 );
    actBoring.action.play();
    actBoring.action.fadeIn(0.3);
    currentAction = action = actBoring.action;
	}
);

/**
 * Sizes
 */
const container = document.querySelector('#myavatar')
const sizes = {
  width: container.offsetWidth,
  height: container.offsetHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = container.offsetWidth;
  sizes.height = container.offsetHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  45,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 0;
camera.position.y = 1.2;
camera.position.z = 0.8;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer( {alpha: true, antialias: true} )
renderer.setPixelRatio( window.devicePixelRatio )
renderer.setSize( container.offsetWidth, container.offsetHeight )
renderer.toneMapping = THREE.NoToneMapping
container.appendChild( renderer.domElement )

// controls
let controls = new OrbitControls(camera,
  renderer.domElement)
controls.enableDamping = true
controls.enableZoom = true
controls.autoRotate = false
controls.enablePan = false
controls.minPolarAngle = Math.PI / 2.3
controls.maxPolarAngle = Math.PI / 2.3
controls.target = new THREE.Vector3(0, 1.2, -1)


/**
 * Myavatar instance
 */
let appId = 'techbrood.com'
let appKey = 'bc4c475a1f2f'
let opts = {
  scene
}

let agent = null
const onReady = () => {
  console.log('avatar is ready')
}

MyAvatar.init(
  appId,
  appKey,
  opts,
  onReady
)

/**
 * Event handlers
 */

// character descriptions
let desc = {
  mary: {
    nickname: 'mary',
    gender: 'female',
    model: './assets/models/characters/female.glb',
    voice: 'xiaomo',
    start: [-0.2, 0, -6],
    end: [-0.2, 0, -2],
    rotation: [0, 0, 0]
  },
  ryan: {
    nickname: 'ryan',
    gender: 'male',
    model: './assets/models/characters/male.glb',
    voice: 'yunfeng',
    start: [0.5, 0, -5.5],
    end: [0.5, 0, -2.5],
    rotation: [0, 0, 0]
  }
}

let btnSpawn = document.getElementById('spawn')
btnSpawn.addEventListener('click', async e => {

  let character = 'mary'
  let ratios = document.getElementsByName('character')
  for (let i = 0; i < ratios.length; i++) {
    if (ratios[i].checked) {
      character = ratios[i].value
      break
    }
  }

  let d = desc[character]
  d.head = 'Wolf3D_Head' // head name
  agent = await MyAvatar.spawn(character, d)

  if(character === 'ryan') {
    let act = actions.find(a => a.name === 'look-around');
    newAction = act.action
    switchAction()
  } else {
    let act = actions.find(a => a.name === 'dance');
    newAction = act.action
    switchAction()
  }

  // set position
  agent.setPosition(d.start)
  agent.setRotation(d.rotation)

  const points = [d.start, d.end]
  agent.nav(points, {
    speedFactor: 0.5,
    startDirection:[0, 0, 1],
    onReady: () => {
      const greetings = `我是${character}，很高兴见到您！有什么能为您服务的吗？`
      agent.chat(greetings, 'read', {onChating: res => {
        let eAnswer = document.querySelector('#answer')
        eAnswer.innerText = res.text
      }})
    }
  })

})

const eleMsg = document.querySelector('#words')
eleMsg.addEventListener('change', async (e) => {
  let msg = e.target.value
  const subjectBegin = msg.indexOf('@')
  const subjectEnd = msg.indexOf(' ')
  const subject = msg.substring(subjectBegin+1, subjectEnd)
  if(subject) msg = msg.substring(subjectEnd+1)

  if (msg != '') {
    let mode = getOption('mode')
    let role = getOption('role')
    let style = getOption('style')

    let eAnswer = document.querySelector('#answer')
    let atAgent = MyAvatar.getEntity(subject)

    if(atAgent) agent = atAgent
    if(agent) {
      agent.chat(msg, mode, {
        onChating: res => {
          eAnswer.innerText = res.text
        },
        role,
        style
      })
    }

  }
})

const btnStop = document.querySelector('#stopAnswer')
btnStop.addEventListener('click', () => {
  agent.stopChat()
})

const eleWordlist = document.querySelector('#wordlist')
eleWordlist.addEventListener('change', (e) => {
  const qa = qas[e.target.value]
  if (!qa) return

  let msg = qa.a

  const subjectBegin = msg.indexOf('@')
  const subjectEnd = msg.indexOf(' ')
  const subject = msg.substring(subjectBegin+1, subjectEnd)
  if(subject) msg = msg.substring(subjectEnd+1)

  if (msg != '') {
    let mode = getOption('mode')
    let role = getOption('role')
    let style = getOption('style')

    let eAnswer = document.querySelector('#answer')
    let atAgent = MyAvatar.getEntity(subject)

    if(atAgent) agent = atAgent
    if(agent) {
      agent.chat(msg, mode, {
        onChating: res => {
          eAnswer.innerText = res.text
        },
        role,
        style
      })
    }

  }
})

const eleMotions = document.querySelector('#motions')
eleMotions.addEventListener('change', (e) => {
  const opt = e.target.value
  agent.motion(opt)
})

const btnStopMotion = document.querySelector('#stopMotion')
btnStopMotion.addEventListener('click', (e) => {
  agent.stopMotion()
})

const btnPauseMotion = document.querySelector('#pauseMotion')
btnPauseMotion.addEventListener('click', (e) => {
  agent.pauseMotion()
})

const btnResumeMotion = document.querySelector('#resumeMotion')
btnResumeMotion.addEventListener('click', (e) => {
  agent.resumeMotion()
})

const btnIdleMotion = document.querySelector('#idleMotion')
btnIdleMotion.addEventListener('click', (e) => {
  agent.idle()
})

const btnGo = document.querySelector('#goaway')
btnGo.addEventListener('click', (e) => {
  let d = desc[agent.name]
  const points = [d.end, d.start]
  agent.nav(points, {speedFactor: 0.5})
})

const btnBack = document.querySelector('#comeback')
btnBack.addEventListener('click', (e) => {
  let d = desc[agent.name]
  const points = [d.start, d.end]
  agent.nav(points, {speedFactor: 0.5, startDirection:[0, 0, -1]})
})

/**
 * Animate
 */

const clock = new THREE.Clock();

const tick = () => {
  const delta = clock.getDelta();

  // Update myavatar
  MyAvatar.update(delta)

  // Update Orbital Controls
  if(controls) controls.update()

  // Update animations
  if(mixer) mixer.update( delta );

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();