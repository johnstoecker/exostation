var weapons = {
  pistol: {
    fireRate: 1000,
    damage: 1000,
    speed: 1,
    numberOfBullets: 1,
    maxDistance: 100
  },
  shotgun: {
    fireRate: 2000,
    damage: 5000,
    speed: .5,
    numberOfBullets: 5,
    maxDistance: 10
  }
}
  var gameState = {
    gameOver: false,
    carMode: false,
    carSpawned: false,
    playerSpawned: true,
    maxPoint: new Point(view.size.width, view.size.height),
    playerLives: 3,
    invulernable: true,
    curZombieCount: 1,
    maxZombies: 3,
    maxGameZombies: 100,
    zombieSpeed: 0,
    speedZombieSpeed: 1.8,
    maxZombieSpeed: 1.7,
    hulkZombieHealth: 5,
    speedZombieMax: 5,
    hulkZombieMax: 8,
    pathArrays: {
      arrayOfZombies: [],
      arrayOfBullets: [],
      arrayOfBloodSplatters: [],
      arrayOfGasTanks: [],
      groupOfZombieGuts: new Group(),
      grenadeArray: [],
    },
    globalPositions: {
      playerPosition: view.center,
      carPosition: view.center,
      tempMousePosition: view.center
    },
    carSpeed: "",
    center: view.center,
    score: 0,
    gasTanksCollected: 0,
    animationCounter: 0,
    weapon: 'pistol'
  }
export default {
  sunsetAudio: sunsetAudio,
  playPause: playPause,
  nextStream: nextStream
}
