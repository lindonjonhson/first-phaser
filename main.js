import './style.css'
import Phaser from 'phaser'

const gameStartDiv = document.querySelector('#gameStartDiv')
const gameStartBtn = document.querySelector('#gameStartBtn')
const gameEndDiv = document.querySelector('#gameEndDiv')
const gameWinLoseSpan = document.querySelector('#gameWinLoseSpan')
const gameEndScoreSpan = document.querySelector('#gameEndScoreSpan')


//  Creating obj Scene
class GameScene extends Phaser.Scene{
    constructor(){
        super('scene-game')
        this.player
        this.cursor
        this.playerSpeed = speedDown * 5
        this.target
        this.textScore
        this.points=0
        this.textTime
        this.timedEvent
        this.remainingTime
        this.coinMusic
        this.bgMusic
        this.emitter
    }
    preload(){
        this.load.image('bg', '/assets/bg.png')
        this.load.image('bsk', '/assets/basket.png')
        this.load.image('apl', '/assets/apple.png')
        this.load.image('money', '/assets/money.png')
        this.load.audio('bgMusic', '/assets/bgMusic.mp3')
        this.load.audio('coin', '/assets/coin.mp3')
    }
    create(){

        this.scene.pause('scene-game')

        this.coinMusic = this.sound.add('coin')
        this.bgMusic = this.sound.add('bgMusic')

        //this.bgMusic.play()
        //  Adding background
        this.add.image(0,0,'bg').setOrigin(0,0)

        //  Adding the player sprite and physics, but setting it as immovable
        this.player = this.physics.add
            .image(0,sizes.height-100,'bsk')
            .setOrigin(0,0)
        this.player.setImmovable(true)
        this.player.body.allowGravity = false
        this.player.setImmovable(true)

        //  Decreasing the hitbox for the basket
        this.player.setSize(80,15).setOffset(10,70)

        //  Allowing movements from the cursor to influence the player
        this.cursor = this.input.keyboard.createCursorKeys()

        //  Setting bounds
        this.player.setCollideWorldBounds(true)

        //  Adding apple
        this.target  = this.physics.add
        .image(0,0,'apl')
        .setOrigin(0,0)
        //  Setting the max speed for the apples
        this.target.setMaxVelocity(0,speedDown);

        //  Creating a function which will detect when the apple hits the basket
        this.physics.add.overlap(this.target, this.player, targetHit, null, this)

        //  Adding Text Score
        this.textScore = this.add.text(sizes.width -120, 10, 'Score:0',{
            font:'25px Arial',
            fill:'#000000'
        })

        //  Adding Text Time
        this.textTime = this.add.text(10, 10, 'Remainig Time: 00',{
            font:'25px Arial',
            fill:'#000000'
        })

        this.timedEvent = this.time.delayedCall(3000, gameOver, [], this)

        this.emitter = this.add.particles(0, 0,'money',{
            speed:100,
            gravityY:speedDown-200,
            scale:0.04,
            duration:100,
            emitting:false
        })
        this.emitter.startFollow(this.player, this.player.width/2, this.player.height/2, true)

    }
    update(){

        this.remainingTime = this.timedEvent.getRemainingSeconds()
        this.textTime.setText(`Remaining Time: ${Math.round(this.remainingTime).toString()}`)

        //  Adding the cursor
        const{left, right} = this.cursor

        if(left.isDown){
            this.player.setVelocityX(-this.playerSpeed);
        }else if(right.isDown){
            this.player.setVelocityX(this.playerSpeed);
        }else{
            this.player.setVelocityX(0);
        }

        //  Preventing the apple from falling into the abyss
        if(this.target.y >= sizes.height){
            this.target.setY(0);
            this.target.setX(getRandomX());
        }



    }
}

//  Setting up sizes
const sizes={
    width:500,
    height:500
}

//  Setting up gravity force
const speedDown = 150


const config ={
    type:Phaser.WEBGL,
    width:sizes.width,
    height:sizes.height,
    canvas:gameCanvas,
    //  Adding physics
    physics:{
        default:'arcade',
        arcade:{
            //  Setting up gravity
            gravity:{y:speedDown},
            debug:true
        }
    },
    //  Declaring Scene
    scene:[GameScene]
}


function getRandomX() {
    return Math.floor(Math.random() * 480);
}

function targetHit(){
    this.coinMusic.play()
    this.target.setY(0);
    this.target.setX(getRandomX());
    this.points++;
    this.textScore.setText(`Score: ${this.points}`)
    this.emitter.start()
}

function gameOver(){
    console.log('Game Over')
    this.sys.game.destroy(true)
    gameEndDiv.style.display='flex'
    if(this.points >=10){
        gameEndScoreSpan.textContent = this.points
        gameWinLoseSpan.textContent = 'Win!'
    }else{
        gameEndScoreSpan.textContent = this.points
        gameWinLoseSpan.textContent = 'Lose!'
    }
}

const game = new Phaser.Game(config)

gameStartBtn.addEventListener('click', ()=>(
    gameStartDiv.style.display='none',
    game.scene.resume('scene-game')
))
