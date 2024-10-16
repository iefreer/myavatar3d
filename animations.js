async function load_animations( mixer, gltf_loader, actions ) {

  let gltf = await gltf_loader.loadAsync( 'assets/models/robot/look-around.glb' )

  console.log( "Look Around animation loaded" );

  let action = mixer.clipAction(gltf.animations[0]);
  actions.push({name: 'look-around', action});

  gltf = await gltf_loader.loadAsync( 'assets/models/robot/gangnam-style.glb' )

  console.log( "Gangnam Style animation loaded" );

  action = mixer.clipAction(gltf.animations[0]);
  actions.push({name: 'dance', action});


  gltf = await gltf_loader.loadAsync( 'assets/models/robot/yawn.glb' )

  console.log( "Gangnam Style animation loaded" );

  action = mixer.clipAction(gltf.animations[0]);
  actions.push({name: 'yawn', action});

}

export { load_animations }