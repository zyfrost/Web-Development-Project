
// drawing the player and enemy as this will start when website loads but update will loop every tick
// player.draw();
// enemy.draw();

function rectangleCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.attackBox.position.y + rectangle2.height
  );
}

let timer = 31;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timer--;
    timerId = setTimeout(decreaseTimer, 1000);
    document.querySelector("#timer").innerHTML = timer;
  }
  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

