# what is myavatar3d
An out-of-the-box 3d avatar ( virtual human ) engine for three.js based projects

# online documentation
english: https://techbrood.com/myavatar/en
chinese: https://techbrood.com/myavatar

# how to use myavatar3d

1. import dependencies
myavatar3d engine is depending on three.js and socket.io library, so you have to import them in your html page:

<script type="importmap">
  {
      "imports": {
          "three": "https://techbrood.com/threejs/r163/build/three.module.js",
          "three/addons/": "https://techbrood.com/threejs/r163/examples/jsm/",
          "socket.io-client": "https://techbrood.com/socketio/4.4.1/socket.io.esm.min.js"
      }
  }
</script>

2. import myavatar module in your script

import { MyAvatar } from './myavatar.module.js'

3. init myavatar engine

init(appId, appKey, options, onReady)

4. create avatar instances

spawn(name, options)

# apis

1. chat

chat(text, mode, options)
stopChat()

2. animation

motion(name, loop)
stopMotion()

3. navigation

nav(points, options)

6. avatar transform

setPosition(position)
setRotation(rotation)

position and rotation are array as [x, y, z], for example: [0, 0, -1.5]

# demo app

for details, please read the demo app, all of available api usages are shown in index.js

# run the demo app

install dependencies

> npm i

run in development mode

> npm run dev

release the app

> npm run build

click "Spawn" button in the control panel ui to create an avatar instance

# contact

any questions, please leave a comment here, or send mail to 24739149@qq.com