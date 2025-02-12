import { Scene } from "phaser";

export class Game extends Scene {
	balls: Metaball[] = [];
	rt: Phaser.GameObjects.RenderTexture;

	constructor() {
		super("Game");
	}

	preload() {
		this.load.setPath("assets");
		this.load.image("ball", "ball.png");
		//	this.load.image("background", "bg.png");
		//		this.load.image("logo", "logo.png");
	}

	create() {
		/*this.add.image(512, 384, "background");
		this.add.image(512, 350, "logo").setDepth(100);
		this.add
			.text(
				512,
				490,
				"Make something fun!\nand share it with us:\nsupport@phaser.io",
				{
					fontFamily: "Arial Black",
					fontSize: 38,
					color: "#ffffff",
					stroke: "#000000",
					strokeThickness: 8,
					align: "center",
				},
			)
			.setOrigin(0.5)
			.setDepth(100);
*/

		this.rt = this.make
			.renderTexture({
				x: this.game.canvas.width / 2,
				y: this.game.canvas.height / 2,

				width: this.scale.width, //this.game.canvas.width,
				height: this.scale.height,
			})
			.setOrigin(0.5, 0.5);

		for (let i = 0; i < 10; i++) {
			this.balls.push(
				new Metaball(
					this,
					Math.random() * this.game.canvas.width,
					Math.random() * this.game.canvas.height,
				),
			);
		}
		this.scale.on("resize", this.resize, this);
	}

	update(_time: number, delta: number): void {
		const scaledDelta = delta / 1000.0;

		for (const ball of this.balls) {
			ball.update(scaledDelta);
		}

		this.rt.clear();

		this.rt.draw(
			new Phaser.GameObjects.Rectangle(
				this,
				this.game.canvas.width / 2,
				this.game.canvas.height / 2,
				999999,
				999999,
				0xff00ff,
				0.5,
			).setOrigin(0.5, 0.5),
		);
		this.rt.draw(this.balls);
	}

	resize(
		gameSize: Phaser.Structs.Size,
		_baseSize: Phaser.Structs.Size,
		_displaySize: Phaser.Structs.Size,
		_resolution: Phaser.Structs.Size,
	) {
		this.rt.resize(gameSize.width, gameSize.height);
		this.rt.x = gameSize.width / 2;
		this.rt.y = gameSize.height / 2;
		console.log(this.rt.width, this.rt.height);
		console.log("cam", this.cameras);
	}
}

class Metaball extends Phaser.GameObjects.Image {
	velocity: Phaser.Math.Vector2;
	accel: Phaser.Math.Vector2;
	jolt: Phaser.Math.Vector2;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "ball");
		this.velocity = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 64);
		this.accel = Phaser.Math.RandomXY(new Phaser.Math.Vector2(), 16);
		this.jolt = Phaser.Math.RandomXY(new Phaser.Math.Vector2());
	}

	update(delta: number): void {
		if (Math.random() < 0.01) {
			this.jolt.x = (Math.random() - 0.5) * 2;
			this.jolt.y = (Math.random() - 0.5) * 2;
		}
		this.accel.x += this.jolt.x * delta;
		this.accel.y += this.jolt.y * delta;
		this.accel.limit(16);
		this.velocity.x += this.accel.x * delta;
		this.velocity.y += this.accel.y * delta;
		this.velocity.limit(64);
		this.x += this.velocity.x * delta;
		this.y += this.velocity.y * delta;
		//console.log(this);
		this.wrap();
	}

	wrap() {
		if (this.y < -this.displayHeight / 2) {
			this.y = this.scene.game.canvas.height + this.displayHeight / 2;
		} else if (
			this.y >
			this.scene.game.canvas.height + this.displayHeight / 2
		) {
			this.y = -this.displayHeight / 2;
		}
		if (this.x < -this.displayWidth / 2) {
			this.x = this.scene.game.canvas.width + this.displayWidth / 2;
		} else if (
			this.x >
			this.scene.game.canvas.width + this.displayWidth / 2
		) {
			this.x = -this.displayWidth / 2;
		}
	}
}
