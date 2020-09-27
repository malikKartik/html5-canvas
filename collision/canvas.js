let canvas = document.querySelector('canvas')
canvas.width = window.innerWidth
canvas.height = window.innerHeight

var c = canvas.getContext('2d')

// c.fillStyle = "red"
// c.fillRect(100,100, 100,100)

//Line
// c.beginPath();
// c.moveTo(50,300);
// c.lineTo(300,100);
// c.strokeStyle = "blue"
// c.stroke()

// arc
// c.beginPath()
// c.arc(300,300,30, 1, Math.PI,false)
// c.stroke();

// for(let i = 0;i<1000;i++){
//     let x = Math.random() * canvas.width
//     let y = Math.random() * canvas.height
//     c.beginPath()
//     c.arc(x,y,10, 0, Math.PI * 2,false)
//     const arr = ["red","green","blue"]
//     c.strokeStyle = arr[Math.floor(Math.random()*arr.length)]
//     c.stroke();
// }
function rotate(velocity, angle) {
    const rotatedVelocities = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
    };

    return rotatedVelocities;
}

/**
 * Swaps out two colliding particles' x and y velocities after running through
 * an elastic collision reaction equation
 *
 * @param  Object | particle      | A particle object with x and y coordinates, plus velocity
 * @param  Object | otherParticle | A particle object with x and y coordinates, plus velocity
 * @return Null | Does not return a value
 */

function resolveCollision(particle, otherParticle) {
    const xVelocityDiff = particle.velocity.x - otherParticle.velocity.x;
    const yVelocityDiff = particle.velocity.y - otherParticle.velocity.y;

    const xDist = otherParticle.x - particle.x;
    const yDist = otherParticle.y - particle.y;

    // Prevent accidental overlap of particles
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {

        // Grab angle between the two colliding particles
        const angle = -Math.atan2(otherParticle.y - particle.y, otherParticle.x - particle.x);

        // Store mass in var for better readability in collision equation
        const m1 = particle.mass;
        const m2 = otherParticle.mass;

        // Velocity before equation
        const u1 = rotate(particle.velocity, angle);
        const u2 = rotate(otherParticle.velocity, angle);

        // Velocity after 1d collision equation
        const v1 = { x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y };
        const v2 = { x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y };

        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1, -angle);
        const vFinal2 = rotate(v2, -angle);

        // Swap particle velocities for realistic bounce effect
        particle.velocity.x = vFinal1.x;
        particle.velocity.y = vFinal1.y;

        otherParticle.velocity.x = vFinal2.x;
        otherParticle.velocity.y = vFinal2.y;
    }
}
let mouse = {
    x: undefined,
    y: undefined
}

window.addEventListener('mousemove', (event)=>{
    mouse.x = event.x
    mouse.y = event.y
})

window.addEventListener('resize',()=>{
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
})

let distance = (x1, y1, x2, y2) =>{
    const xDist = x1 - x2;
    const yDist = y1 - y2;
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}

const colorArr = [
    "#fa4659",
    "#feffe4",
    "#a3de83",
    "#2eb872"
]
// function Circle(x,y,dx,dy,r){
//     this.x = x;
//     this.y = y;
//     this.dx = dx;
//     this.dy = dy;
//     this.r = r
//     this.color = colorArr[Math.floor(Math.random()*colorArr.length)]
//     this.draw = () =>{
//         c.beginPath()
//         c.arc(this.x,this.y,this.r, 0, Math.PI * 2,false)
//         c.fillStyle = this.color
//         c.fill()
//     }
//     this.update = () =>{
//         if(this.x >= innerWidth-this.r) this.dx = -this.dx
//         if(this.x <= this.r) this.dx = -this.dx
//         if(this.y >= innerHeight-this.r) this.dy = -this.dy
//         if(this.y <= this.r) this.dy = -this.dy

//         this.x = this.x + this.dx
//         this.y = this.y + this.dy
        
//         if(mouse.x - this.x < 25 &&
//             mouse.x - this.x > -25 &&
//             mouse.y - this.y < 25 &&
//             mouse.y - this.y > -25){
//             if(this.r < 4*r) this.r = this.r + 4
//         }else{
//             if(this.r >= 0.4){
//                 if(this.r - 0.4<=0.4){
//                     this.r = 0
//                 }else{
//                     this.r = this.r = this.r - 0.4
//                 }
//             }
//         }

//         this.draw()
//     }
// }

function Circle(x, y, dx, dx, r){
    this.x = x;
    this.y = y;
    this.velocity = {
        x: dx,
        y: dy
    }
    // this.dx = dx;
    // this.dy = dy;
    this.r = r;
    this.mass = 1

    this.draw = () =>{
        c.beginPath()
        c.arc(this.x,this.y,this.r, 0, Math.PI * 2,false)
        c.strokeStyle = "blue"
        c.stroke()
    }

    this.update = (circleArr) =>{
        if(this.x >= innerWidth-this.r) this.velocity.x = -this.velocity.x
        if(this.x <= this.r) this.velocity.x = -this.velocity.x
        if(this.y >= innerHeight-this.r) this.velocity.y = -this.velocity.y
        if(this.y <= this.r) this.velocity.y = -this.velocity.y

        this.x = this.x + this.velocity.x
        this.y = this.y + this.velocity.y
        for(let i = 0;i < circleArr.length; i++){
            if(this ===circleArr[i]) continue;
            if(distance(this.x, this.y, circleArr[i].x, circleArr[i].y) < this.r*2){
                // console.log("Collision!!")
                resolveCollision(this, circleArr[i])
            }
        }
        this.draw()
    }
}



let circleArr = []

for(let i = 0;i<30;i++){
    var r =20
    var x = Math.random() * (innerWidth - 2*r) + r
    var y = Math.random() * (innerHeight - 2*r) + r
    if(i !== 0){
        for(let j = 0;j<circleArr.length;j++){
            while(distance(x, y, circleArr[j].x, circleArr[j].y) < 2*r){
                x = Math.random() * (innerWidth - 2*r) + r
                y = Math.random() * (innerHeight - 2*r) + r
                j = 0
            }
        }
    }
    var velCoff = 10
    var dx = (Math.random()-0.5)*velCoff
    var dy = (Math.random()-0.5)*velCoff
    circleArr.push(new Circle(x,y,dx,dy,r))
}


const animate = () =>{
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight)
    for(let i = 0;i<circleArr.length;i++){
        circleArr[i].update(circleArr)
    }
}

animate()