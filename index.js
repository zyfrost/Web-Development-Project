const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7
//position - position of object and velocity takes in account the speed
const background = new Sprite({
  position: {
    x: 0,
    y: 0
  },
  imageSrc: './img/background.png'
})

const shop = new Sprite({
  position: {
    x: 600,
    y: 128
  },
  imageSrc: './img/shop.png',
  scale: 2.75,
  framesMax: 6
})

//player Structure
const player = new Fighter({
  position: {
    x: 100,
    y: 0
  },
  velocity: {
    x: 0,
    y: 0
  },
  offset: {
    x: 0,
    y: 0
  },
  imageSrc: './img/hero/Idle.png',
  framesMax: 11,
  scale: 2.5,
  offset: {
    x: 115,
    y: 130
  },
  sprites: {
    idle: {
      imageSrc: './img/hero/Idle.png',
      framesMax: 11
    },
    run: {
      imageSrc: './img/hero/Run.png',
      framesMax: 8
    },
    jump: {
      imageSrc: './img/hero/Jump.png',
      framesMax: 3
    },
    fall: {
      imageSrc: './img/hero/Fall.png',
      framesMax: 3
    },
    attack1: {
      imageSrc: './img/hero/Attack1.png',
      framesMax: 7
    },
    takeHit: {
      imageSrc: './img/Hero/Take Hit.png',
      framesMax: 4
    },
    takeHit: {
      imageSrc: './img/Hero/Take Hit.png',
      framesMax: 4
    },
    death: {
      imageSrc: './img/hero/Death.png',
      framesMax: 11
    }
  },
  attackBox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 120,
    height: 50
  }
})

//ene my Structure
const enemy = new Fighter({
  position: {
    x: 800,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/warrior/Idle.png',
  framesMax: 10,
  scale: 2.5,
  offset: {
    x: 215,
    y: 60
  },
  sprites: {
    idle: {
      imageSrc: './img/warrior/Idle.png',
      framesMax: 10
    },
    run: {
      imageSrc: './img/warrior/Run.png',
      framesMax: 6
    },
    jump: {
      imageSrc: './img/warrior/Jump.png',
      framesMax: 2
    },
    fall: {
      imageSrc: './img/warrior/Fall.png',
      framesMax: 2
    },
    attack1: {
      imageSrc: './img/warrior/Attack3.png',
      framesMax: 5
    },
    takeHit: {
      imageSrc: './img/warrior/Get Hit.png',
      framesMax: 5
    },
    death: {
      imageSrc: './img/warrior/Death.png',
      framesMax: 6
    }
  },
  attackBox: {
    offset: {
      x: -215,
      y: 50
    },
    width: 250,
    height: 50
  }
})

const keys = {
  a: {
    pressed: false
  },
  d: {
    pressed: false
  },
  ArrowRight: {
    pressed: false
  },
  ArrowLeft: {
    pressed: false
  }
}

const game = {
  started: false
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId)
  document.querySelector('#displayText').style.display = 'flex'
  if (player.health === enemy.health) {
    console.log('tie')
    document.querySelector('#displayText').innerHTML = 'Tie'
  } else if (player.health > enemy.health) {
    document.querySelector('#displayText').innerHTML = 'Player 1 Wins'
  } else if (enemy.health > player.health) {
    document.querySelector('#displayText').innerHTML = 'Player 2 Wins'
  }
}

decreaseTimer()
//this helps in animating object frame by frame
function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255,255,255,0.15)'
  c.fillRect(0, 0, canvas.width, canvas.height)

  if (!game.started) return
  player.update()
  enemy.update()

  player.velocity.x = 0
  enemy.velocity.x = 0

  //player movement
  if (keys.a.pressed && player.lastKey === 'a') {
    player.velocity.x = -5
    player.switchSprite('run')
  } else if (keys.d.pressed && player.lastKey === 'd') {
    player.velocity.x = 5
    player.switchSprite('run')
  } else {
    player.switchSprite('idle')
  }

  if (player.velocity.y < 0) {
    player.switchSprite('jump')
  } else if (player.velocity.y > 0) {
    player.switchSprite('fall')
  }

  //enemy movement
  // if (enemy.position.y >= canvas.height - enemy.height) {
  //   enemyJumps = 0;
  // }
  if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
    enemy.velocity.x = -5
    enemy.switchSprite('run')
  } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
    enemy.velocity.x = 5
    enemy.switchSprite('run')
  } else {
    enemy.switchSprite('idle')
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite('jump')
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite('fall')
  }

  //detect for collision
  if (
    rectangleCollision({ rectangle1: player, rectangle2: enemy }) &&
    player.isAttacking &&
    player.frameCurrent === 4
  ) {
    enemy.takeHit()
    player.isAttacking = false
    // document.querySelector('#enemyHealth').style.width = enemy.health + '%'
    gsap.to('#enemyHealth', {
      width: enemy.health + '%'
    })
  }

  //player misses
  if (player.isAttacking && player.frameCurrent === 4) {
    player.isAttacking = false
  }

  if (
    rectangleCollision({ rectangle1: enemy, rectangle2: player }) &&
    enemy.isAttacking &&
    enemy.frameCurrent === 2
  ) {
    player.takeHit()
    enemy.isAttacking = false
    // document.querySelector('#playerHealth').style.width = player.health + '%'
    gsap.to('#playerHealth', {
      width: player.health + '%'
    })
  }

  if (enemy.isAttacking && enemy.frameCurrent === 2) {
    enemy.isAttacking = false
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId })
  }
}
animate()

document.querySelector('#beginButton').addEventListener('click', () => {
  document.querySelector('#beginButton').style.display = 'none'
  document.querySelector('#tutorial').style.display = 'flex'
})

document.querySelector('#startButton').addEventListener('click', () => {
  decreaseTimer()
  document.querySelector('#tutorial').style.display = 'none'
  game.started = true
})

window.addEventListener('keydown', (event) => {
  if (!player.dead) {
    switch (event.key) {
      case 'd':
        keys.d.pressed = true
        player.lastKey = 'd'
        break
      case 'a':
        keys.a.pressed = true
        player.lastKey = 'a'
        break
      case 'w':
        player.velocity.y = -15
        break
      case ' ':
        player.attack()
        break
    }
  }

  if (!enemy.dead) {
    switch (event.key) {
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        enemy.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        enemy.lastKey = 'ArrowLeft'
        break

      case 'ArrowUp':
        enemy.velocity.y = -15
        break
      case 'ArrowDown':
        enemy.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    //enemy keys
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})
