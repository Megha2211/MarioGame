var backgroundImage;
var mario, marioRunning, marioCollided;
var edge;
var ground, groundImage, invisibleGround;
var brick, brickImage;
var obstacle, obstacleImage;
var PLAY=1;
var END=0;
var gameState= PLAY;
var gameOver, gameOverImage;
var restart, restartImage;
var coin, coinImage;
var score=0;
var coinCollected=0;
var checkPointSound, dieSound, jumpSound;

function preload(){
  backgroundImage=loadImage("bg.png");
  
  marioRunning= loadAnimation("mario00.png","mario01.png","mario02.png","mario03.png");
  
  marioCollided= loadAnimation("collided.png");
  
  groundImage=loadImage("ground2.png");
  
  brickImage=loadImage("brick.png");
  
  obstacleImage=loadAnimation("obstacle1.png","obstacle2.png","obstacle3.png","obstacle4.png");
  
  coinImage= loadAnimation("coin1.png","coin2.png","coin3.png","coin4.png");
  
  gameOverImage= loadImage("gameOver.png");
  
  restartImage= loadImage("restart.png");
  
  checkPointSound= loadSound("checkPoint.mp3");
  
  dieSound= loadSound("die.mp3");
  
  jumpSound= loadSound("jump.mp3");
}

function setup(){
  createCanvas(600,300);
  
  //mario
  mario= createSprite(60,230,20,40);
  mario.addAnimation("running", marioRunning);
  mario.addAnimation("collided", marioCollided);
  mario.scale=1.5;
  
  ground= createSprite(10,290,600,20);
  ground.addImage("ground",groundImage);
  ground.scale=1;
  
  invisibleGround= createSprite(10,260,600,10);
  invisibleGround.visible= false;
  
  gameOver= createSprite(300,130,50,50);
  gameOver.addImage("gameover", gameOverImage);
  gameOver.scale=0.7;
  
  restart= createSprite(320,170,10,10);
  restart.addImage("restart", restartImage);
  restart.scale=0.5;
  
  brickGroup = new Group();
  obstacleGroup= new Group();
  coinGroup= new Group();
  
  edge= createEdgeSprites();
}

function draw(){
  background(backgroundImage);
  
  stroke("black");
  textSize(20);
  text("Score= "+ score, 450,20);
  
  stroke("black");
  textSize(20);
  text("Coin= "+ coinCollected, 350,20);
  //console.log(mario.y);
  
  if(gameState===PLAY){
    gameOver.visible=false;
    restart.visible=false;
    
    ground.velocityX=-8;
    
    if(ground.x<0){
    ground.x=ground.width/2;
  }
    
    if(keyDown("space") && mario.y>225) {
    mario.velocityY=-20;
    jumpSound.play();
  }
  mario.velocityY=mario.velocityY+1;
    
   for (var i = 0; i < brickGroup.length; i++) {

        if(brickGroup.get(i).isTouching(mario)){
        brickGroup.get(i).remove()
        score =score+1;
        }
   }
    
    for (var a = 0; a < coinGroup.length; a++) {

        if(coinGroup.get(a).isTouching(mario)){
        coinGroup.get(a).remove()
        coinCollected =coinCollected+5;
        }
   }
  
    
    if((coinCollected>0 && coinCollected%100===0) || (score>0 && score%10===0)){
      checkPointSound.play();
    }
    
    spawnCoin();
    spawnBrick();
    spawnObastacle();
    
    if(mario.isTouching(obstacleGroup)){
      gameState=END;
      dieSound.play();
    }
    
    
  }
  else if(gameState===END){
    gameOver.visible=true;
    restart.visible=true;
    
    mario.velocityY=0;
    
    ground.velocityX=0;
    
    mario.changeAnimation("collided",marioCollided);
    
    coinGroup.setLifetimeEach(-1);
    obstacleGroup.setLifetimeEach(-1);
    brickGroup.setLifetimeEach(-1);
    
    coinGroup.setVelocityXEach(0);
    obstacleGroup.setVelocityXEach(0);
    brickGroup.setVelocityXEach(0);
    
    if(mousePressedOver(restart)){
      reset();
    }
    
  }
  
  mario.collide(invisibleGround);
  
  
  drawSprites();
  
}

function spawnBrick(){
  if(frameCount%100===0){
    brick=createSprite(600,160,20,20);
    brick.addImage("brick",brickImage);
    brick.y= Math.round(random(120,160));
    brick.velocityX=-3;
    brick.lifetime=200;
    brick.depth=mario.depth;
    mario.depth=mario.depth+1;
    brickGroup.add(brick)
  }
}

function spawnObastacle(){
  if(frameCount%110===0){
    obstacle= createSprite(600,230,30,30);
    obstacle.addAnimation("obstacle", obstacleImage);
    obstacle.velocityX=-5;
    obstacle.scale=0.9;
    obstacle.lifetime=200;
    obstacleGroup.add(obstacle);
  }
}

function reset(){
  gameState=PLAY
  
  mario.changeAnimation("running", marioRunning);
  
  gameOver.visible= false;
  restart.visible= false;
  
  score=0;
  coinCollected=0;
  
  coinGroup.destroyEach();
  brickGroup.destroyEach();
  obstacleGroup.destroyEach();
  
}

function spawnCoin(){
  if(frameCount%200===0){
    coin= createSprite(600,120,30,30);
    coin.addAnimation("coin", coinImage);
    coin.y= Math.round(random(100,150));
    coin.velocityX=-3;
    coin.scale=0.1;
    coin.lifetime=200;
    coinGroup.add(coin);
  }
}