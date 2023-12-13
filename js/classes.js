class Sprite {
  constructor({ position, imageSrc, scale = 1, framesMax = 1 , offset}) {
    this.position = position;
    this.width = 50;
    this.height = 150;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.frameCurrent = 0;
    this.frameElaspsed = 0;
    this.framesHold = 5;
    this.offset =offset;
  }
  draw() {
    c.drawImage(
      this.image,
      this.frameCurrent * (this.image.width / this.framesMax), //this.image.width / 6 for the amount of frames to be animatedthis.image.width
      0,
      this.image.width / this.framesMax,
      this.image.height,
      this.position.x,
      this.position.y,
      (this.image.width / this.framesMax) * this.scale,
      this.image.height * this.scale
    );
  }
  update() {
    this.draw();
    this.frameElaspsed++;
    if (this.frameElaspsed % this.framesHold === 0) {
      if (this.frameCurrent < this.framesMax - 1) {
        this.frameCurrent++;
      } else {
        this.frameCurrent = 0;
      }
    }
  }
}

class Fighter extends Sprite {
  constructor({ position, velocity, color = "red", offset, imageSrc, scale = 1, framesMax = 1 }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
    });
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.frameCurrent = 0;
    this.frameElaspsed = 0;
    this.framesHold = 50;
  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (this.isAttacking) {
      c.fillStyle="green"
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }
  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    if (this.position.y + this.height >= canvas.height - 90) {
      this.position.y = canvas.height - this.height - 90;
      this.velocity.y = 0;
      // Reset jumps when on the ground
      if (this === player) {
        playerJumps = 0;
      } else if (this === enemy) {
        enemyJumps = 0;
      }
    } else {
      this.velocity.y += gravity; 
    }

  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}
