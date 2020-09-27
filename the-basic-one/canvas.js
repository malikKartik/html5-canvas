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

const colorArr = [
    "#fa4659",
    "#feffe4",
    "#a3de83",
    "#2eb872"
]
function Circle(x,y,dx,dy,r){
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.r = r
    this.color = colorArr[Math.floor(Math.random()*colorArr.length)]
    this.draw = () =>{
        c.beginPath()
        c.arc(this.x,this.y,this.r, 0, Math.PI * 2,false)
        c.fillStyle = this.color
        c.fill()
    }
    this.update = () =>{
        if(this.x >= innerWidth-this.r) this.dx = -this.dx
        if(this.x <= this.r) this.dx = -this.dx
        if(this.y >= innerHeight-this.r) this.dy = -this.dy
        if(this.y <= this.r) this.dy = -this.dy

        this.x = this.x + this.dx
        this.y = this.y + this.dy
        
        if(mouse.x - this.x < 25 &&
            mouse.x - this.x > -25 &&
            mouse.y - this.y < 25 &&
            mouse.y - this.y > -25){
            if(this.r < 4*r) this.r = this.r + 4
        }else{
            if(this.r >= 0.4){
                if(this.r - 0.4<=0.4){
                    this.r = 0
                }else{
                    this.r = this.r = this.r - 0.4
                }
            }
        }

        this.draw()
    }
}





let circleArr = []

for(let i = 0;i<2000;i++){
    var r = 5
    var x = Math.random() * (innerWidth - 2*r) + r
    var y = Math.random() * (innerHeight - 2*r) + r
    var velCoff = 5
    var dx = (Math.random()-0.5)*velCoff
    var dy = (Math.random()-0.5)*velCoff
    circleArr.push(new Circle(x,y,dx,dy,r))
}
const animate = () =>{
    requestAnimationFrame(animate);
    c.clearRect(0,0,innerWidth,innerHeight)
    for(let i = 0;i<circleArr.length;i++){
        circleArr[i].update()
    }
}

animate()