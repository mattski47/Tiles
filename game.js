var gameport = document.getElementById("gameport");

var scale = 2;
var renderer = PIXI.autoDetectRenderer(448, 448);
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();

var gameContainer = new PIXI.Container();
var menuContainer = new PIXI.Container();
var endContainer = new PIXI.Container();
var instructionsContainer = new PIXI.Container();
var onGame = false;
var style = {fill: "white"};
var style2 = {font: '16px Arial', fill: "black", wordWrap: true, wordWrapWidth: 190};
var creditsDisplay = new PIXI.Text("By: Matthew Siewierski", style);
var instructionsDisplay = new PIXI.Text("How to Play:\n\nUse 'wasd' to move around and find various items around the map. Once you think you have them all, go back to the house to return to the main menu.", style2);

var playButton;
var instructionsButton;
var returnHome;
var background;
var title;

var music;
var currScene;
var player;
var world;
var person;
var loltres;
var boat;
var shipfront;
var shipback;
var sidekick;
var playerObject;
var loltresObject;
var shipObject;
var sidekickObject;
var entitiesLayer;

	//.add("music.mp3")
//load stuff 
PIXI.loader
	.add('map', "assets/worldmap.json")
	.add('tileset', "assets/worldmap.png")
	.add("assets/entities.json")
	.load(ready);
	
function ready() {
	var tu = new TileUtilities(PIXI);
	world = tu.makeTiledWorld("map", "assets/worldmap.png");
	
	player = new PIXI.Sprite(PIXI.Texture.fromFrame("player.png"));
	loltres = new PIXI.Sprite(PIXI.Texture.fromFrame("loltres.png"));
	boat = new PIXI.Sprite(PIXI.Texture.fromFrame("shipfront.png"));
	shipfront = new PIXI.Sprite(PIXI.Texture.fromFrame("shipfront.png"));
	shipback = new PIXI.Sprite(PIXI.Texture.fromFrame("shipback.png"));
	sidekick = new PIXI.Sprite(PIXI.Texture.fromFrame("sidekick.png"));
	background = new PIXI.Sprite(PIXI.Texture.fromFrame("background.png"));
	title = new PIXI.Sprite(PIXI.Texture.fromFrame("title.png"));
	playButton = new PIXI.Sprite(PIXI.Texture.fromFrame("playButton.png"));
	instructionsButton = new PIXI.Sprite(PIXI.Texture.fromFrame("instructionsButton.png"));
	returnHome = new PIXI.Sprite(PIXI.Texture.fromFrame("mainMenuButton.png"));
	
	//music = PIXI.audioManager.getAudio("music.mp3");
	//music.loop = true;
	//music.volume = 0.6;
	
	stage.addChild(menuContainer);
	currScene = new mainMenu();
	animate();
}

//main menu
var mainMenu = function () {
	//music.play();
	
	onGame = false;
	
	
	title.anchor.x = 0.5;
	title.anchor.y = 0.5;
	title.position.x = renderer.width/2;
	title.position.y = 130;
	
	//background.anchor.x = 0.5;
	//background.anchor.y = 0.5;
	//background.position.x = renderer.width/2;
	//background.position.y = renderer.height/2;
	
	//place play button
	playButton.anchor.x = 0.5;
	playButton.anchor.y = 0.5;
	playButton.position.x = renderer.width/2;
	playButton.position.y = renderer.height/2+75;
	
	instructionsButton.anchor.x = 0.5;
	instructionsButton.anchor.y = 0.5;
	instructionsButton.position.x = renderer.width/2;
	instructionsButton.position.y = renderer.height/2+150;
	
	menuContainer.addChild(background);
	menuContainer.addChild(title);
	menuContainer.addChild(playButton);
	menuContainer.addChild(instructionsButton);
	
	playButton.interactive = true;
	instructionsButton.interactive = true;
	
	
	playButton.mousedown = function(mouseData) {
		menuContainer.removeChildren();
		stage.removeChild(menuContainer);
		stage.addChild(gameContainer);
		currScene = new playGame();
	}
	
	instructionsButton.mousedown = function(mousedata) {
		menuContainer.removeChildren();
		stage.removeChild(menuContainer);
		stage.addChild(instructionsContainer);
		currScene = new instructionsPage();
	}
}

var left = 0;
var right = 1;
var up = 0;
var down = 1;
var stop = 2;
var tilex;
var tiley;

//play game
var playGame = function() {
	this.directionHor = stop;
	this.directionVer = stop;
	this.movingHor = false;
	this.movingVer = false;
	this.hasloltres = false;
	this.hasship = false;
	this.hassidekick = false;
	
	gameContainer.addChild(world);
	
	tilex = 7;
	tiley = 6;
	
	stage.scale.x = scale;
	stage.scale.y = scale;
	
	playerObject = world.getObject("player");
	loltresObject = world.getObject("loltres");
	shipObject = world.getObject("boat");
	sidekickObject = world.getObject("sidekick");
	
	loltres.x = loltresObject.x;
	loltres.y = loltresObject.y;
	loltres.anchor.x = 0.0;
	loltres.anchor.y = 1.0;
	
	boat.x = shipObject.x;
	boat.y = shipObject.y;
	boat.anchor.x = 0.0;
	boat.anchor.y = 1.0;
	
	sidekick.x = sidekickObject.x;
	sidekick.y = sidekickObject.y;
	sidekick.anchor.x = 0.0;
	sidekick.anchor.y = 1.0;
	
	player.x = playerObject.x;
	player.y = playerObject.y;
	player.anchor.x = 0.0;
	player.anchor.y = 1.25;
	
	entitiesLayer = world.getObject("Entities");
	entitiesLayer.addChild(loltres);
	entitiesLayer.addChild(boat);
	entitiesLayer.addChild(shipfront);
	entitiesLayer.addChild(shipback);
	entitiesLayer.addChild(sidekick);
	entitiesLayer.addChild(player);
	
	shipback.visible = false;
	
	stage.x = -player.x*scale + renderer.width/2 - player.width/2*scale;
	stage.y = -player.y*scale + renderer.height/2 + player.height/2*scale;
		
	onGame = true;
}

//move character while key is down
playGame.prototype.moveHor = function() {
	if (currScene.directionHor == stop) {
		currScene.movingHor = false;
		return;
	}
	
	currScene.movingHor = true;
	
	if (currScene.directionHor == left) {
		if (tilex == 3 || (tilex == 7 && tiley >= 21 && tiley <= 24) || (tilex == 9 && tiley == 24) || (tilex == 11 && tiley >= 18 && tiley <= 23) || (tilex == 18 && tiley >= 8 && tiley <= 10) || (tilex == 19 && tiley >= 17) || (tilex == 21 && tiley >= 19 && tiley <= 25) || (tilex == 22 && tiley == 16) || (tilex == 23 && (tiley == 4 || tiley == 5 || tiley == 19 || (tiley >= 21 && tiley <= 25))) || (tilex == 25 && tiley == 10) || (tilex == 26 && (tiley == 8 || tiley == 9 || tiley == 18 || (tiley >= 21 && tiley <= 23)))) {
			currScene.movingHor = false;
			return;
		}
		tilex--;
		createjs.Tween.get(player).to({x: player.x - 32}, 250).call(currScene.moveHor);
	}
	if (currScene.directionHor == right) {
		if (tilex == 26 || (tilex == 4 && tiley >= 19 && tiley <= 23) || (tilex == 5 && (tiley == 18 || tiley == 24)) || (tilex == 7 && tiley >= 22 && tiley <= 24) || (tilex == 8 && tiley == 21) || (tilex == 14 && tiley >= 8 && tiley <= 10) || (tilex == 17 && tiley >= 16) || (tilex == 19 && ((tiley >= 5 && tiley <= 7) || (tiley >= 18 && tiley <= 25))) || (tilex == 20 && tiley == 4) || (tilex == 21 && ((tiley >= 8 && tiley <= 10) || (tiley >= 19 && tiley <= 25))) || (tilex == 22 && tiley == 16) || (tilex == 23 && tiley >= 3 && tiley <= 5) || (tilex == 24 && tiley >= 21 && tiley <= 23)) {
			currScene.movingHor = false;
			return;
		} else if (tilex == 7 && tiley == 21 && currScene.hassidekick == false) {
			entitiesLayer.removeChild(sidekick);
			currScene.hassidekick = true;
		}
		createjs.Tween.get(player).to({x: player.x + 32}, 250).call(currScene.moveHor);
		tilex++;
	}
	
}

playGame.prototype.moveVer = function() {
	if (currScene.directionVer == stop) {
		
		currScene.movingVer = false;
		return;
	}
	
	if (shipback.visible) {
		shipback.visible = false;
		player.visible = true;
	}
	
	if (shipfront.visible) {
		shipfront.visible = false;
		player.visible = true;
	}
	
	currScene.movingVer = true;
	
	if (currScene.directionVer == up) {
		if (tiley == 3 || (tiley == 8 && (tilex == 20 || tilex == 21 || tilex == 26)) || (tiley == 10 && tilex == 25) || (tiley == 11 && ((tilex == 15 || (tilex == 16 && (currScene.hasloltres == false || currScene.hassidekick == false)) || tilex == 17) || (tilex >= 22 && tilex <= 24))) || (tiley == 17 && ((tilex >= 19 && tilex <= 21) || (tilex >= 23))) || (tiley == 19 && (tilex == 21 || (tilex >= 23 && tilex <= 25))) || (tiley == 21 && (tilex == 7 || tilex == 8 || tilex == 23 || tilex == 24 || tilex == 26)) || (tiley == 24 && (tilex == 5 || (tilex == 7 && currScene.hasship == false) || tilex == 9 || tilex == 10 || tilex == 25)) || (tiley == 25 && (tilex == 6 || tilex == 8)) || (tiley == 26 && (tilex == 20 || tilex == 22))) {
			currScene.movingVer = false;
			return;
		} else if (tiley == 22 && tilex == 26 && currScene.hasloltres == false) {
			entitiesLayer.removeChild(loltres);
			currScene.hasloltres = true;
			tiley--;
			createjs.Tween.get(player).to({y: player.y - 32}, 250).call(currScene.moveVer);
		} else if (tiley == 11 & tilex == 16 && currScene.hasloltres && currScene.hassidekick) {
			entitiesLayer.removeChildren();
			gameContainer.removeChildren();
			stage = new PIXI.Container();
			stage.addChild(menuContainer);
			currScene = new mainMenu();
		} else if (tilex == 7 && tiley == 24 && currScene.hasship) {
			shipback.x = player.x;
			shipback.y = player.y-32;
			player.visible = false;
			shipback.visible = true;
			tiley -= 2;
			createjs.Tween.get(shipback).to({y: shipback.y - 64}, 500);
			createjs.Tween.get(player).to({y: player.y - 64}, 500).call(currScene.moveVer);
		} else {
			tiley--;
			createjs.Tween.get(player).to({y: player.y - 32}, 250).call(currScene.moveVer);
		}
		
	}
	
	if (currScene.directionVer == down) {
		if (tiley == 26 || (tiley == 3 && (tilex == 21 || tilex == 22)) || (tiley == 4 && tilex == 20) || (tiley == 5 && tilex == 23) || (tiley == 7 && tilex >= 15 && tilex <= 17) || (tiley == 15 && ((tilex >= 18 && tilex <= 21) || tilex >= 23)) || (tiley == 17 && ((tilex >= 6 && tilex <= 10) || (tilex >= 20 && tilex <= 25))) || (tiley == 18 && tilex == 5) || (tiley == 19 && tilex >= 23) || (tiley == 21 && tilex == 8) || (tiley == 22 && tilex == 7 && currScene.hasship == false)) {
			currScene.movingVer = false;
			return;
		} else if (tiley == 4 && tilex == 23 && currScene.hasship == false) {
			entitiesLayer.removeChild(boat);
			currScene.hasship = true;
		}
		
		if (tilex == 7 && tiley == 22 && currScene.hasship) {
			shipfront.x = player.x;
			shipfront.y = player.y-32;
			player.visible = false;
			shipfront.visible = true;
			tiley += 2;
			createjs.Tween.get(shipfront).to({y: shipfront.y + 64}, 500);
			createjs.Tween.get(player).to({y: player.y + 64}, 500).call(currScene.moveVer);
		} else {
			tiley++;
			createjs.Tween.get(player).to({y: player.y + 32}, 250).call(currScene.moveVer);
		}
	}
}

playGame.prototype.updateCamera = function() {
	stage.x = -player.x*scale + renderer.width/2 - player.width/2*scale;
	stage.y = -player.y*scale + renderer.height/2 + player.height/2*scale;
}

var instructionsPage = function() {
	instructionsDisplay.position.x = 12;
	instructionsDisplay.position.y = 40;
	
	
	returnHome.anchor.x = 0.5;
	returnHome.anchor.y = 0.5;
	returnHome.position.x = renderer.width/2;
	returnHome.position.y = renderer.height/2 + 200;
	
	returnHome.interactive = true;
	returnHome.mousedown = function(mouseData) {
		instructionsContainer.removeChildren();
		stage.removeChild(instructionsContainer);
		stage.addChild(menuContainer);
		currScene = new mainMenu();
	}
	
	instructionsContainer.addChild(background);
	instructionsContainer.addChild(returnHome);
	instructionsContainer.addChild(instructionsDisplay);
}

function keydownEventHandler(e) {
	e.preventDefault();
	if (onGame) {
		if (e.keyCode == 65 || e.keyCode == 68) {
			if (currScene.movingHor) {
				return;
			}
			currScene.directionHor = stop;
			
			if (e.keyCode == 65) { //move left
				currScene.directionHor = left;
			} else { //move right
				currScene.directionHor = right;
			}
			currScene.moveHor();
		} else if (e.keyCode == 87 || e.keyCode == 83) {
			if (currScene.movingVer) {
				return;
			}
			currScene.directionVer = stop;
			
			if (e.keyCode == 87) { //move up
				currScene.directionVer = up;
			} else { //move down
				currScene.directionVer = down;
			}
			currScene.moveVer();
		}
	}
}

//set direction to false when key is up
function keyupEventHandler(e) {
	if (onGame) {
		if (e.keyCode == 65 || e.keyCode == 68) {
			currScene.directionHor = stop;
		}
		if (e.keyCode == 87 || e.keyCode == 83) {
			currScene.directionVer = stop;
		}
	}
}



function animate() {
	requestAnimationFrame(animate);
	
	if (onGame) {
		currScene.updateCamera();
	}
	
	renderer.render(stage);
}


document.addEventListener('keydown', keydownEventHandler);
document.addEventListener('keyup', keyupEventHandler);