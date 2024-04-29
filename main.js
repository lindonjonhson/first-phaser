import './style.css'
import Phaser from 'phaser'

//  Creating obj Scene
class GameScene extends Phaser.Scene{
    constructor(){
        super('scene-game')
        this.player
        this.cursor
        this.playerSpeed = speedDown * 5
        this.target
    }
    preload(){
        this.load.image('bg', '/assets/bg.png')
        this.load.image('bsk', '/assets/basket.png')
        this.load.image('apl', '/assets/apple.png')
    }
    create(){
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

    }
    update(){
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
const speedDown = 300

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

const game = new Phaser.Game(config)

function getRandomX() {
    return Math.floor(Math.random() * 480);
}

function targetHit(){
    this.target.setY(0);
    this.target.setX(getRandomX());
    this.points++;
}
