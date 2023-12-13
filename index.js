const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);
const gravity = 0.5;
//position - position of object and velocity takes in account the speed
class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
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
  }
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
    if (player.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    } else if (enemy.isAttacking) {
      c.fillStyle = "green";
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
    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.velocity.y = 0;
    } else this.velocity.y += gravity;
  }
  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}
//player Structure
const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

//ene my Structure
const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

let playerJumps = 0;
let enemyJumps = 0;

const maxJumps = 2;
// drawing the player and enemy as this will start when website loads but update will loop every tick
// player.draw();
// enemy.draw();

console.log(player);

function rectangleCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.attackBox.position.x + rectangle2.attackBox.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.attackBox.position.y + rectangle2.attackBox.height
  );
}

// this is used to decrease timer
let timer = 31;
function decreaseTimer() {
  if (timer > 0) {
    timer--;
    setTimeout(decreaseTimer, 1000);
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    document.querySelector("#displayText").style.display = "flex";
    if (player.health === enemy.health) {
      console.log("tie");
      document.querySelector("#displayText").innerHTML = "Tie";
    } else if (player.health > enemy.health) {
      document.querySelector("#displayText").innerHTML = "Player 1 Wins";
    } else if (enemy.health > player.health ) {
      document.querySelector("#displayText").innerHTML = "Player 2 Wins";
    }
  }
}

decreaseTimer();
//this helps in animating object frame by frame
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  if (player.position.y >= canvas.height - player.height) {
    playerJumps = 0;
  }

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //player movement
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5.5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5.5;
  }

  //enemy movement
  if (enemy.position.y >= canvas.height - enemy.height) {
    enemyJumps = 0;
  }
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5.5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5.5;
  }

  //detect for collision
  if (rectangleCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (rectangleCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
    console.log("enemy hit");
  }
}
animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      if (playerJumps < maxJumps) {
        player.velocity.y = -16;
        playerJumps++;
      }
      break;
    case " ":
      player.attack();
      break;
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      if (enemyJumps < maxJumps) {
        enemy.velocity.y = -16;
        enemyJumps++;
      }
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
  console.log(event.key);
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    //enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
  console.log(event.key);
});
