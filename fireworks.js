class Firework {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.fireworks = [];
        this.particles = [];
        this.init();
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.animate();
        this.canvas.addEventListener('click', (e) => this.addFirework(e.clientX, e.clientY));
        
        // 调整发射频率
        setInterval(() => {
            this.addFirework();
            // 40%概率额外发射烟花
            if (Math.random() < 0.4) {
                setTimeout(() => this.addFirework(), 200);
            }
        }, 700);
    }

    addFirework(targetX, targetY) {
        // 从底部随机位置发射
        const startX = this.canvas.width * 0.1 + Math.random() * (this.canvas.width * 0.8);
        const startY = this.canvas.height;

        // 随机选择目标高度和位置
        let newTargetX, newTargetY;
        
        if (targetX && targetY) {
            newTargetX = targetX;
            newTargetY = targetY;
        } else {
            newTargetX = this.canvas.width * 0.1 + Math.random() * (this.canvas.width * 0.8);
            newTargetY = this.canvas.height * (0.05 + Math.random() * 0.3);
        }
        
        const angle = Math.atan2(newTargetY - startY, newTargetX - startX);
        const velocity = 8 + Math.random() * 2;
        
        this.fireworks.push({
            x: startX,
            y: startY,
            targetX: newTargetX,
            targetY: newTargetY,
            vx: Math.cos(angle) * velocity,
            vy: Math.sin(angle) * velocity,
            hue: Math.random() * 360,
            brightness: Math.random() * 20 + 80,
            alpha: 1,
            trail: [],
            acceleration: 0.995,
            stage: 'rising'
        });
    }

    createParticles(x, y, hue) {
        const particleCount = 180 + Math.floor(Math.random() * 40);
        for (let i = 0; i < particleCount; i++) {
            const angle = (Math.PI * 2 * i) / particleCount;
            const velocity = Math.random() * 7 + 2;
            const spread = Math.random() * 0.2 + 0.9;
            
            const particle = {
                x: x,
                y: y,
                vx: Math.cos(angle) * velocity * spread,
                vy: Math.sin(angle) * velocity * spread,
                hue: hue + Math.random() * 30 - 15,
                brightness: Math.random() * 20 + 80,
                alpha: 1,
                decay: Math.random() * 0.002 + 0.001,
                gravity: 0.04
            };
            this.particles.push(particle);
        }
    }

    animate() {
        // Create semi-transparent background for trail effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Update and draw rising fireworks
        for (let i = this.fireworks.length - 1; i >= 0; i--) {
            const fw = this.fireworks[i];
            
            // Update position
            fw.x += fw.vx;
            fw.y += fw.vy;
            
            // 应用缓动和重力效果
            if (fw.stage === 'rising') {
                fw.vx *= fw.acceleration;
                fw.vy *= fw.acceleration;
                fw.vy += 0.015;
            }

            // Add trail effect
            fw.trail.push({ x: fw.x, y: fw.y });
            if (fw.trail.length > 8) {
                fw.trail.shift();
            }

            // Draw trail with gradient
            if (fw.trail.length > 1) {
                const gradient = this.ctx.createLinearGradient(
                    fw.trail[0].x, fw.trail[0].y,
                    fw.trail[fw.trail.length - 1].x, fw.trail[fw.trail.length - 1].y
                );
                gradient.addColorStop(0, `hsla(${fw.hue}, 100%, ${fw.brightness}%, 0)`);
                gradient.addColorStop(1, `hsla(${fw.hue}, 100%, ${fw.brightness}%, ${fw.alpha})`);
                
                this.ctx.beginPath();
                this.ctx.moveTo(fw.trail[0].x, fw.trail[0].y);
                for (let j = 1; j < fw.trail.length; j++) {
                    this.ctx.lineTo(fw.trail[j].x, fw.trail[j].y);
                }
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = 2;
                this.ctx.stroke();
            }

            // Check if firework should explode
            const distanceToTarget = Math.hypot(fw.targetX - fw.x, fw.targetY - fw.y);
            const speed = Math.hypot(fw.vx, fw.vy);
            
            // 调整爆炸条件
            if (speed < 3 || distanceToTarget < 5 || fw.y < fw.targetY) {
                this.createParticles(fw.x, fw.y, fw.hue);
                this.fireworks.splice(i, 1);
            }
        }

        // Update and draw particles with smoother movement
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            
            // Update position with smoother movement
            p.x += p.vx * 0.95;  
            p.y += p.vy * 0.95;  
            p.vy += p.gravity;
            
            // Fade out more slowly
            p.alpha -= p.decay;

            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
            this.ctx.closePath();
            this.ctx.fillStyle = `hsla(${p.hue}, 100%, ${p.brightness}%, ${p.alpha})`;
            this.ctx.fill();

            // Remove dead particles
            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        requestAnimationFrame(() => this.animate());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
}

// Initialize when page loads
window.addEventListener('load', () => {
    const canvas = document.getElementById('fireworks');
    new Firework(canvas);
});
