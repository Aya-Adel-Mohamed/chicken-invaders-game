particlesJS('particles-js',
{
    "particles": {
      "number": {
        "value": 200,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 1,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 30,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": false,
        "distance": 500,
        "color": "#ffffff",
        "opacity": 1,
        "width": 2
      },
      "move": {
        "enable": true,
        "speed": 2,
        "direction": "bottom",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": false,
          "mode": "bubble"
        },
        "onclick": {
          "enable": true,
          "mode": "repulse"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 4,
          "duration": 0.3,
          "opacity": 1,
          "speed": 3
        },
        "repulse": {
          "distance": 200,
          "duration":0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  }
);
const canvas = document.querySelector('canvas')
const scoreEl = document.querySelector('#scoreEl')
const startGame = $('.startGame button')
const c = canvas.getContext('2d')
var isMusic1Playing = false;
var isMusic2Playing = false;
var $audio1 = $('#BombAudio')
var $audio2 = $("#chicken");
var heads = ['./assets/img/chicken.png','./assets/img/chicken2.png','./assets/img/chicken3.png','./assets/img/chicken4.png']; 
var bkGround = new Image();
bkGround.src = './assets/img/startScreenBackground2.png';
canvas.width = innerWidth
canvas.height = innerHeight
class Player {
    constructor() {
        this.velocity = {
            x: 0,
            y: 0
        }
        this.rotation = 0
        this.opacity = 1
        const image = new Image()
        image.src = './assets/img/spaceship3.png'
        image.onload = () => {
            this.image = image
            const scale = 0.35
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: canvas.width / 2 - this.width / 2,
                y: canvas.height - this.height - 20
            }
        }
    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}
class Projectile {
    constructor({
        position,
        velocity
    }) {
        this.position = position
        this.velocity = velocity
        this.radius = 4
    }
    draw() {
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = 'red'
        c.fill()
        c.closePath()
    }
    update() {
        this.draw()
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
    }
}
class Particle {
    constructor({
        position,
        velocity,
        radius,
        color,
        fades,
        src
    }) {
        this.position = position
        this.velocity = velocity
        this.radius = radius
        this.color = color
        this.opacity = 1
        this.fades = fades
    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.beginPath()
        c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2)
        c.fillStyle = this.color
        c.fill()
        c.closePath()
        c.restore()
    }
    update() {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        if (this.fades) {
            this.opacity -= 0.01
        }
    }
}
class ParticleImage {
    constructor({
        position,
        velocity,
        fades,
        src
    }) {
        const image = new Image()
        image.src = src
        this.position = position
        this.velocity = velocity
        this.opacity = 1
        this.fades = fades
        image.onload = () => {
            this.image = image
            const scale = 0.3
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: this.position.x ,
                y: this.position.y-20
            }
        }
    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
        if (this.fades) {
            this.opacity -= 0.01
        }
    }
}
class InvaderProjectile {
    constructor({
        position,
        velocity
    }) {
        this.position = position
        this.velocity = velocity
        const image = new Image()
        image.src = './assets/img/egg.png'
        image.onload = () => {
            this.image = image
            const scale = 0.11
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = position
            this.velocity = velocity
        }
    }
    draw() {
        c.save()
        c.translate(player.position.x + player.width / 2, player.position.y + player.height / 2)
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width / 2, -player.position.y - player.height / 2)
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}
class Invader {
    constructor({
        position
    }) {
        this.velocity = {
            x: 0,
            y: 0
        }
        const image = new Image()
        let number = Math.floor(Math.random()*heads.length); 
        image.src = heads[number]
        image.onload = () => {
            this.image = image
            const scale = 0.13
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = {
                x: position.x,
                y: position.y
            }
        }
    }
    draw() {
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
    }
    update({
        velocity
    }) {
        if (this.image) {
            this.draw()
            this.position.x += velocity.x
            this.position.y += velocity.y
        }
    }
    shoot(invaderProjectiles) {
        invaderProjectiles.push(new InvaderProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
    eat(PlayerProjectiles) {
        PlayerProjectiles.push(new PlayerProjectile({
            position: {
                x: this.position.x + this.width / 2,
                y: this.position.y + this.height
            },
            velocity: {
                x: 0,
                y: 5
            }
        }))
    }
}
class Grid {
    constructor() {
        this.position = {
            x: 0,
            y: 0
        }
        this.velocity = {
            x: 3,
            y: 0
        }
        this.invaders = []
        invaders = this.invaders;
        const rows =  Math.floor(Math.random() * 2 + 2)
        const columns =Math.floor(Math.random() * 5 + 5)
        this.width = columns * 80
        for (let x = 0; x < columns; x++) {
            for (let y = 0; y < rows; y++) {
                this.invaders.push(new Invader({
                    position: {
                        x: x * 80,
                        y: y * 80
                    }
                }))
            }
        }
    }
    update() {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.velocity.y = 0
        if (this.position.x + this.width >= canvas.width || this.position.x <= 0) {
            this.velocity.x = -this.velocity.x
            this.velocity.y = 40
        }
        if (this.position.y >= canvas.height) {
            game.over = true
        }
    }
}
class PlayerProjectile {
    constructor({
        position,
        velocity
    }) {
        this.position = position
        this.velocity = velocity
        this.opacity = 1
        const image = new Image()
        image.src = './assets/img/chickenSmall.png'
        image.onload = () => {
            this.image = image
            const scale = 0.2
            this.width = image.width * scale
            this.height = image.height * scale
            this.position = position
            this.velocity = velocity
        }
    }
    draw() {
        c.save()
        c.globalAlpha = this.opacity
        c.translate(player.position.x + player.width , player.position.y + player.height )
        c.rotate(this.rotation)
        c.translate(-player.position.x - player.width , -player.position.y - player.height )
        c.drawImage(this.image, this.position.x, this.position.y, this.width, this.height)
        c.restore()
    }
    update() {
        if (this.image) {
            this.draw()
            this.position.x += this.velocity.x
            this.position.y += this.velocity.y
        }
    }
}
const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
var invaders = []
const particles = []
const playerProjectiles = []
const keys = {
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowUp: {
        pressed: false
    },  
    ArrowDown: {
        pressed: false
    },
    space: {
        pressed: false
    },
}
let frames = 0;
let randomInterval = Math.floor((Math.random() * 500) + 500)
let game = {
    over: false,
    active: true
}
let score = 0;
for (let i = 0; i < 100; i++) {
    particles.push(new Particle({
        position: {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height
        },
        velocity: {
            x: 0,
            y: 1
        },
        radius: Math.random() * 4,
        color: '#c1c1c1',
    }))
}
function createParticles({
    object,
    color,
    fades,
    rad,
    src
}) {
    for (let i = 0; i < 15; i++) {
        particles.push(new Particle({
            position: {
                x: object.position.x + object.width / 2,
                y: object.position.y + object.height / 2
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            radius: Math.random() * rad || Math.random() * 4,
            color: color || '#fff',
            fades: true,
        }))
    }
}
function createParticlesImages({
    object,
    fades,
    src,
    posx,
    posy,
}) {
        particles.push(new ParticleImage({
            position: {
                x: posx,
                y: posy
            },
            velocity: {
                x: (Math.random() - 0.5) * 2,
                y: (Math.random() - 0.5) * 2
            },
            fades: true,
            src: src || './assets/img/fire.png'
        }))
    }
let animationId;
function animate() {
    var promise = document.getElementById('chicken').play();
    if (promise !== undefined) {
        promise.then(_ => {
        }).catch(error => {
        });
    }
    if (!game.active) return
    animationId = requestAnimationFrame(animate)
    c.drawImage(bkGround, 0, 0, canvas.width, canvas.height);
    player.update()
    particles.forEach((particle, i) => {
        if (particle.position.y - particle.radius >= canvas.height) {
            particle.position.x = Math.random() * canvas.width
            particle.position.y = -particle.radius
        }
        if (particle.opacity <= 0) {
            setTimeout(() => {
                particles.splice(i, 1)
            }, 0)
        } else {
            particle.update()
        }
    })
    invaderProjectiles.forEach((invaderProjectile, index) => {
        if (invaderProjectile.position.y + invaderProjectile.height >= canvas.height) {
            setTimeout(() => {
                invaderProjectiles.splice(index, 1)
            }, 0)
        } else {
            invaderProjectile.update()
            if (invaderProjectile.position.y + invaderProjectile.height >= player.position.y && invaderProjectile.position.x + invaderProjectile.width >= player.position.x && invaderProjectile.position.x <= player.position.x + player.width) {
                promise = document.getElementById('BombAudio').play();
                if (promise !== undefined) {
                    promise.then(_ => {
                    }).catch(error => {
                    });
                }
                setTimeout(() => {
                    invaderProjectiles.splice(index, 1)
                    player.opacity = 0
                    game.over = true
                }, 0)
                setTimeout(() => {
                    game.active = false
                    $('.canv').addClass('d-none')
                    $('.gameOver').addClass('d-flex').removeClass('d-none')
                }, 3000)
                createParticlesImages({
                    object: player,
                    rad: 20,
                    color: '#FF9C2A',
                    fades: true,
                    posx:player.position.x,
                    posy:player.position.y-20
                })
            }
        }
    })
    playerProjectiles.forEach((playerProjectile, index) => {
        if (playerProjectile.position.y + playerProjectile.height >= canvas.height) {
            setTimeout(() => {
                playerProjectiles.splice(index, 1)
            }, 0)
        } else {
            playerProjectile.update()
            if (playerProjectile.position.y + playerProjectile.height >= player.position.y && playerProjectile.position.x + playerProjectile.width >= player.position.x && playerProjectile.position.x <= player.position.x + player.width) {
               setTimeout(() => {
                promise = document.getElementById('Eat').play();
                playerProjectile.opacity = 0
                if (promise !== undefined) {
                    promise.then(_ => {
                    }).catch(error => {
                    });
                }
               }, 0);
            }
        }
    })
    invaders.forEach((invader, index) => {
        if (invaders[index].position?.y + invaders[index].height >= canvas.height) {
            setTimeout(() => {
                invaders.splice(index, 1)
                game.over = true
            }, 0)
        } else {
            if (invaders[index].position?.y + invaders[index].height >= player.position.y && invaders[index].position.x + invaders[index].width >= player.position.x && invaders[index].position.x <= player.position.x + player.width) {
                var promise = document.getElementById('BombAudio').play();
                if (promise !== undefined) {
                    promise.then(_ => {
                    }).catch(error => {
                    });
                }
                setTimeout(() => {
                    invaders.splice(index, 1)
                    player.opacity = 0
                    player.position.x = 0
                    player.position.y = canvas.height - 100
                    game.over = true
                }, 0)
                setTimeout(() => {
                    game.active = false
                    $('.canv').addClass('d-none')
                    $('.gameOver').addClass('d-flex').removeClass('d-none')
                }, 3000)
                createParticlesImages({
                    object: player,
                    rad: 20,
                    color: '#FF9C2A',
                    fades: true,
                    posx:player.position.x,
                    posy:player.position.y-20
                })
            }
        }
    })
    projectiles.forEach((projectile, index) => {
        if (projectile.position.y + projectile.radius <= 0) {
            setTimeout(() => {
                projectiles.splice(index, 1)
            }, 0)
        } else {
            projectile.update()
        }
    })
    grids.forEach((grid, gridIndex) => {
        grid.update()
        if (frames % 100 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
        }
        if (frames % 600 === 0 && grid.invaders.length > 0) {
            grid.invaders[Math.floor(Math.random() * grid.invaders.length )].eat(playerProjectiles)
        }
        grid.invaders.forEach((invader, i) => {
            invader.update({
                velocity: grid.velocity
            })
            projectiles.forEach((projectile, j) => {
                if (projectile.position.y - projectile.radius <= invader.position.y + invader.height && projectile.position.x + projectile.radius >= invader.position.x && projectile.position.x - projectile.radius <= invader.position.x + invader.width && projectile.position.y + projectile.radius >= invader.position.y) {
                    setTimeout(() => {
                        const invaderFound = grid.invaders.find(invader2 => {
                            return invader2 === invader
                        })
                        const projectileFound = projectiles.find(projectile2 => {
                            return projectile2 === projectile
                        })
                        if (invaderFound && projectileFound) {
                            score += 1
                            scoreEl.innerHTML = score
                            createParticles({
                                object: invader,
                                rad: 7,
                                fades: true
                            })
                            createParticlesImages({
                                object: invader,
                                fades: true,
                                src:'./assets/img/2.png',
                                posx:invader.position.x ,
                                posy:invader.position.y 
                            })
                            grid.invaders.splice(i, 1)
                            if (invaders.length == 0) {
                                setTimeout(() => {
                                    game.active = false
                                }, 1000)
                            }
                            projectiles.splice(j, 1)
                            if (grid.invaders.length > 0) {
                                const firstInvader = grid.invaders[0]
                                const lastInvader = grid.invaders[grid.invaders.length - 1]
                                grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
                                grid.position.x = firstInvader.position.x
                            } else {
                                grids.splice(gridIndex, 1)
                            }
                        }
                    }, 0)
                }
            })
        })
    })
    if (keys.ArrowLeft.pressed && player.position.x >= 0) {
        player.velocity.x = -7
        player.rotation = -0.15
    } else if (keys.ArrowRight.pressed && player.position.x + player.width <= canvas.width) {
        player.velocity.x = 7
        player.rotation = 0.15
    } else {
        player.velocity.x = 0
        player.rotation = 0
    }
    if (keys.ArrowUp.pressed && player.position.y >= 0) {
        player.velocity.y = -7
    } else if (keys.ArrowDown.pressed && player.position.y + player.height <= canvas.height) {
        player.velocity.y = 7
    } else {
        player.velocity.y = 0
        player.rotation = 0
    }
    if (frames % randomInterval === 0) {
        grids.push(new Grid())
        randomInterval = Math.floor((Math.random() * 500) + 2000)
        frames = 0
    }
    frames++
}
startGame.on('click',function(){
$('.canv').removeClass('d-none')
$('.startGame').addClass('d-none').removeClass('d-flex')
game.active = true
game.over = false
player.opacity = 1

animate()

})
$('.endGame button').on('click', function(){
    $('.canv').addClass('d-none')
    $('.startGame').addClass('d-flex').removeClass('d-none')
    $('.gameOver').addClass('d-none').removeClass('d-flex')
  
  

})
addEventListener('keydown', ({
    key
}) => {
    if (game.over) return
    switch (key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            break
            case 'ArrowUp':
                keys.ArrowUp.pressed = true
                break
            case 'ArrowDown':
                keys.ArrowDown.pressed = true
                break
        case ' ':
            projectiles.push(new Projectile({
                position: {
                    x: player.position.x + player.width / 2,
                    y: player.position.y
                },
                velocity: {
                    x: 0,
                    y: -5
                }
            }))
            break
    }
})
addEventListener('keyup', ({
    key
}) => {
    switch (key) {
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
            case 'ArrowUp':
                keys.ArrowUp.pressed = false
                break
            case 'ArrowDown':
                keys.ArrowDown.pressed = false
                break
        case ' ':
            break
    }
})