var gameport = document.getElementById("gameport");

var scale = 2;
var renderer = PIXI.autoDetectRenderer(448, 448);
gameport.appendChild(renderer.view);

var stage = new PIXI.Container();
stage.scale.x = scale;
stage.scale.y = scale;

var gameContainer = new PIXI.Container();
var menuContainer = new PIXI.Container();
var endContainer = new PIXI.Container();
var instructionsContainer = new PIXI.Container();
var onGame = false;
var style = {fill: "white"};
var style2 = {font: '16px Arial', fill: "white", workWrap: true};
var creditsDisplay = new PIXI.Text("By: Matthew Siewierski", style);
var instructionsDisplay = new PIXI.Text("How to Play:\n Use the left and right arrow keys or the 'a' and 'd' keys to rotate around the planet.\n You can fire your lasers by pressing space or the 'w' key.\n\n Goal:\n Stop the rocks from hitting the planet by destroying them with your laser.\n The number of lasers that can be on the screen at once is limited so use your shots wisely.\n You lose when enough rocks hit the planet to destroy it.", style2);

var playButton;
var instructionsButton;
var returnHome;
var title;

var music;
var currScene;
var player;
var world;
var person;

	//.add("music.mp3")
//load stuff 
PIXI.loader
	.add('map', "assets/worldmap.json")
	.add('tileset', "assets/worldmap.png")
	.add('person', "assets/world32.png")
	.load(ready);
	
function ready() {
	var tu = new TileUtilities(PIXI);
	world = tu.makeTiledWorld("map", "assets/worldmap.png");
	stage.addChild(world);
	
	player = new PIXI.Sprite(PIXI.loader.resources.person.texture);
	
	
	//playButton = new PIXI.Sprite(PIXI.Texture.fromFrame("playButton.png"));
	//instructionsButton = new PIXI.Sprite(PIXI.Texture.fromFrame("instructionsButton.png"));
	
	//music = PIXI.audioManager.getAudio("music.mp3");
	//music.loop = true;
	//music.volume = 0.6;
	
	currScene = new playGame();
	animate();
}

/*
//main menu
var mainMenu = function () {
	music.play();
	
	creditsDisplay.anchor.x = 0.5;
	creditsDisplay.anchor.y = 0.5;
	creditsDisplay.position.x = renderer.width/2;
	creditsDisplay.position.y = renderer.height-25;
	
	title.anchor.x = 0.5;
	title.anchor.y = 0.5;
	title.position.x = renderer.width/2;
	title.position.y = 130;
	
	//place play button
	playButton.anchor.x = 0.5;
	playButton.anchor.y = 0.5;
	playButton.position.x = renderer.width/2;
	playButton.position.y = renderer.height/2;
	
	instructionsButton.anchor.x = 0.5;
	instructionsButton.anchor.y = 0.5;
	instructionsButton.position.x = renderer.width/2;
	instructionsButton.position.y = renderer.height/2+100;
	
	menuContainer.addChild(title);
	menuContainer.addChild(playButton);
	menuContainer.addChild(instructionsButton);
	menuContainer.addChild(creditsDisplay);
	menuContainer.addChild(playerSprite1);
	
	playButton.interactive = true;
	instructionsButton.interactive = true;
	
	stage.addChild(menuContainer);
	
	playButton.mousedown = function(mouseData) {
		menuContainer.removeChildren();
		stage.removeChild(menuContainer);
		stage.addChild(gameContainer);
		menuMusic.stop();
		currScene = new playGame();
	}
	
	instructionsButton.mousedown = function(mousedata) {
		menuContainer.removeChildren();
		stage.removeChild(menuContainer);
		stage.addChild(instructionsContainer);
		currScene = new instructionsPage();
	}
}
*/

var left = 0;
var right = 1;
var up = 0;
var down = 1;
var stop = 2;
var tilex = 7;
var tiley = 6;

//play game
var playGame = function() {
	this.directionHor = stop;
	this.directionVer = stop;
	this.movingHor = false;
	this.movingVer = false;
	
	
	player.x = renderer.width/2;
	player.y = renderer.height/2;
	player.anchor.x = 0;
	player.anchor.y = 1.0;
	
	gameContainer.addChild(player);
	stage.addChild(gameContainer);
	
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
		if (tilex == 3 || (tilex == 7 && (tiley == 21 || tiley == 22 || tiley == 24)) || (tilex == 9 && tiley == 24) || (tilex == 11 && tiley >= 18 && tiley <= 23) || (tilex == 18 && tiley >= 8 && tiley <= 10) || (tilex == 19 && tiley >= 17) || (tilex == 21 && tiley >= 19 && tiley <= 25) || (tilex == 22 && tiley == 16) || (tilex == 23 && (tiley == 4 || tiley == 5 || tiley == 19 || (tiley >= 21 && tiley <= 25))) || (tilex == 25 && tiley == 10) || (tilex == 26 && (tiley == 8 || tiley == 9 || tiley == 18 || (tiley >= 21 && tiley <= 23)))) {
			currScene.movingHor = false;
			return;
		}
		tilex--;
		createjs.Tween.get(player).to({x: player.x - 32}, 250).call(currScene.moveHor);
	}
	if (currScene.directionHor == right) {
		if (tilex == 26 || (tilex == 4 && tiley >= 19 && tiley <= 23) || (tilex == 5 && (tiley == 18 || tiley == 24)) || (tilex == 7 && (tiley == 22 || tiley == 24)) || (tilex == 8 && tiley == 21) || (tilex == 14 && tiley >= 8 && tiley <= 10) || (tilex == 17 && tiley >= 16) || (tilex == 19 && ((tiley >= 5 && tiley <= 7) || (tiley >= 18 && tiley <= 25))) || (tilex == 20 && tiley == 4) || (tilex == 21 && ((tiley >= 8 && tiley <= 10) || (tiley >= 19 && tiley <= 25))) || (tilex == 22 && tiley == 16) || (tilex == 23 && tiley >= 3 && tiley <= 5) || (tilex == 24 && tiley >= 21 && tiley <= 23)) {
			currScene.movingHor = false;
			return;
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
	
	currScene.movingVer = true;
	
	if (currScene.directionVer == up) {
		if (tiley == 3 || (tiley == 8 && (tilex == 20 || tilex == 21 || tilex == 26)) || (tiley == 10 && tilex == 25) || (tiley == 11 && ((tilex >= 15 && tilex <= 17) || (tilex >= 22 && tilex <= 24))) || (tiley == 17 && ((tilex >= 19 && tilex <= 21) || (tilex >= 23))) || (tiley == 19 && (tilex == 21 || (tilex >= 23 && tilex <= 25))) || (tiley == 21 && (tilex == 7 || tilex == 8 || tilex == 23 || tilex == 24 || tilex == 26)) || (tiley == 24 && (tilex == 5 || tilex == 7 || tilex == 9 || tilex == 10 || tilex == 25)) || (tiley == 25 && (tilex == 6 || tilex == 8)) || (tiley == 26 && (tilex == 20 || tilex == 22))) {
			currScene.movingVer = false;
			return;
		}
		tiley--;
		createjs.Tween.get(player).to({y: player.y - 32}, 250).call(currScene.moveVer);
	}
	if (currScene.directionVer == down) {
		if (tiley == 26 || (tiley == 3 && (tilex == 21 || tilex == 22)) || (tiley == 4 && tilex == 20) || (tiley == 5 && tilex == 23) || (tiley == 7 && tilex >= 15 && tilex <= 17) || (tiley == 15 && ((tilex >= 18 && tilex <= 21) || tilex >= 23)) || (tiley == 17 && ((tilex >= 6 && tilex <= 10) || (tilex >= 20 && tilex <= 25))) || (tiley == 18 && tilex == 5) || (tiley == 19 && tilex >= 23) || (tiley == 21 && tilex == 8) || (tiley == 22 && tilex == 7)) {
			currScene.movingVer = false;
			return;
		}
		tiley++;
		createjs.Tween.get(player).to({y: player.y + 32}, 250).call(currScene.moveVer);
	}
}

playGame.prototype.updateCamera = function() {
	stage.x = -player.x*scale + renderer.width/2 - player.width/2*scale;
	stage.y = -player.y*scale + renderer.height/2 + player.height/2*scale;
}

playGame.prototype.checkCollision = function() {
	
}

/*
var endScreen = function() {
	returnHome.anchor.x = 0.5;
	returnHome.anchor.y = 0.5;
	returnHome.position.x = renderer.width/2;
	returnHome.position.y = renderer.height/2 + 200;
	
	gameOver.anchor.x = 0.5;
	gameOver.anchor.y = 0.5;
	gameOver.position.x = renderer.width/2;
	gameOver.position.y = renderer.height/2 - 200;
	
	explosionContainer.removeChildren();
	gameContainer.removeChildren();
	endContainer.addChild(planetSprite);
	endContainer.addChild(scoreDisplay);
	endContainer.addChild(returnHome);
	endContainer.addChild(gameOver);
	
	stage.removeChild(gameContainer);
	stage.addChild(endContainer);
	
	returnHome.interactive = true;
	returnHome.mousedown = function(mouseData) {
		stage.removeChild(endContainer);
		stage.addChild(menuContainer);
		gameMusic.stop();
		currScene = new mainMenu();
	}
}

var instructionsPage = function() {
	instructionsDisplay.position.x = 10;
	instructionsDisplay.position.y = 10;
	
	planetSprite = new PIXI.Sprite(planets[0]);
	
	planetSprite.anchor.x = 0.5;
	planetSprite.anchor.y = 0.5;
	planetSprite.position.x = renderer.width/2;
	planetSprite.position.y = renderer.height/2;
	
	playerSprite1.anchor.x = 0.5;
	playerSprite1.anchor.y = 0.5;
	playerSprite1.position.x = renderer.width/2;
	playerSprite1.position.y = renderer.height/2-100;
	
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
	
	instructionsContainer.addChild(planetSprite);
	instructionsContainer.addChild(playerSprite1);
	instructionsContainer.addChild(returnHome);
	instructionsContainer.addChild(instructionsDisplay);
}
*/

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
	currScene.updateCamera();
	
	renderer.render(stage);
}


document.addEventListener('keydown', keydownEventHandler);
document.addEventListener('keyup', keyupEventHandler);