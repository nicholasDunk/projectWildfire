

import 'phaser';

import BoardScene from  './scenes/BoardScene';

const gameConfig = {
  parent: "root",
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 200 }
    }
  },
  scene: BoardScene
};




function initializeSystem() {
  const rootDiv = document.getElementById('root');
 // greeting = document.createTextNode("Hello World Dynamic");
 // rootDiv.appendChild(greeting)
  new Phaser.Game(gameConfig);
}

document.addEventListener('DOMContentLoaded', initializeSystem);

