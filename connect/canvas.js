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
    x: innerWidth/2,
    y: innerHeight/2,
    velocity: {
        x: 1,
        y: 1
    },
    m: 1,
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
        c.strokeStyle = "red"
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
            if(distance(this.x, this.y, circleArr[i].x, circleArr[i].y) < 100){
                c.beginPath();
                c.moveTo(this.x,this.y);
                c.lineTo(circleArr[i].x,circleArr[i].y);
                c.strokeStyle = "rgba(40,40,40,0.4)"
                c.stroke()
            }
            if(distance(this.x, this.y, mouse.x, mouse.y) <= 100){
                if(this.x > mouse.x && this.x < innerWidth - this.r) this.x = this.x + 2
                if(this.y > mouse.y && this.y < innerHeight - this.r) this.y = this.y + 2
                if(this.x < mouse.x && this.x > this.r) this.x = this.x - 2
                if(this.y < mouse.y && this.y > this.r) this.y = this.y - 2
            }
            // if(mouse.x - this.x < 100 &&
            //     mouse.x - this.x > -100 &&
            //     mouse.y - this.y < 100 &&
            //     mouse.y - this.y > -100){
            //         this.velocity.x = -this.velocity.x;
            //         this.velocity.y = -this.velocity.y;
            //     }
        }
        this.draw()
    }
}



let circleArr = []

for(let i = 0;i<200;i++){
    var r = 2
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
    var velCoff = 3
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