
class Player {
  constructor() {
    this.x = mouseX;
    this.y = height - 30;
  }

  display() {
    this.x = mouseX;
    textSize(50); 
    textAlign(CENTER, CENTER);
    text("👨‍🎤", this.x, this.y); 
  }
}

class Circle {
  constructor(x, y, size, speed) {
    this.x = x;
    this.y = y;
    this.size = 50;
    this.velocity = createVector(0, speed);
    this.emoji = random(minionEmojis); 
  }

  update() {
    this.y += this.velocity.y;
  }

  display() {
    textSize(this.size);           
    textAlign(CENTER, CENTER);
    text(this.emoji, this.x, this.y); 
  }
}

class Shot {
  constructor(x, y, angleOffset) {
    this.x = x;
    this.y = y;
    this.size = random(20, 50);
    this.angle = 0;
    this.rotationSpeed = random(0.05, 0.1);
    this.velocity = p5.Vector.fromAngle(-PI / 2 + angleOffset).mult(random(3, 7));//velocity was asked for the GPT
    this.image = random(shotImages);  
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.angle += this.rotationSpeed;
  }

  display() {
    push();
    translate(this.x, this.y);
    rotate(this.angle);
    imageMode(CENTER);
    image(this.image, 0, 0, this.size, this.size);
    pop();
  }

  checkCollision(circle) {
    let d = dist(this.x, this.y, circle.x, circle.y);
    return d < (this.size / 2 + circle.size / 2);
  }
}

class Boss {
  constructor() {
    this.x = random(width);        
    this.y = -100;                 
    this.size = random(100, 150);  
    this.health = 10;
    this.speedX = random(1, 3);    
    this.emoji = random(bossEmojis); 
    this.edgeBuffer = 5;           
  }

  update() {
    
    this.x += this.speedX;

    if (this.x < this.size / 2 + this.edgeBuffer || this.x > width - this.size / 2 - this.edgeBuffer) {
      this.speedX *= -1;
    }
    
    
    this.y += 1;  

   
  }

  display() {
    textSize(this.size);             
    textAlign(CENTER, CENTER);
    text(this.emoji, this.x, this.y); 
   
    fill(255, 0, 0);
    rect(this.x - this.size / 2, this.y - this.size, this.size * (this.health / 10), 5);
  }

  hit() {
    this.health -= 1; // Reduce health when hit
  }
}

//particle system was Designed via basic programming aids
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = random(2, 5);
    this.velocity = p5.Vector.random2D().mult(random(1, 3));
    this.lifespan = 255;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.lifespan -= 5;
  }

  display() {
    
    noStroke();
    fill(255, 150, 0, this.lifespan); 
    ellipse(this.x, this.y, this.size);
  }
}
class BlackParticle {
  constructor() {
   
    let edge = int(random(4));  
    if (edge === 0) {
      this.x = random(width);
      this.y = 0;  // Top edge
    } else if (edge === 1) {
      this.x = width;
      this.y = random(height);  
    } else if (edge === 2) {
      this.x = random(width);
      this.y = height;  
    } else {
      this.x = 0;
      this.y = random(height); 
    }

    this.size = random(1, 10); 
    this.lifespan = 255; 
    this.velocity = createVector(width / 2 - this.x, height / 2 - this.y); 
    this.velocity.setMag(random(1, 3));  
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    this.size = max(0, this.size - 0.05);
    
    this.lifespan -= 3;
  }

  display() {
   
    noStroke();
    fill(0, this.lifespan); 
    ellipse(this.x, this.y, this.size);
  }

  isDead() {
    return this.lifespan <= 0 || this.size <= 0;  
  }
}