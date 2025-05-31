// Warping Circle Animation
class WarpingCircle {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        // Animation variables
        this.time = 0;
        this.amplitudeTime = 0;
        this.image = null;
        this.imageLoaded = false;
        
        // Wave parameters for warping effect
        this.waveSpeed = 0.04;
        this.waveFrequency = 3;
        this.circleRadius = 150;
        this.lineWidth = 2;
        
        // Amplitude oscillation parameters
        this.minAmplitude = 5;
        this.maxAmplitude = 15;
        this.amplitudeSpeed = 0.03;
        
        // Canvas center
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
        
        // Using the new color scheme
        this.primaryColor = '#F6C6C2'; // Peppermint Pink
        this.secondaryColor = '#8A92C7'; // Lightened Silent Night
        
        this.init();
    }
    
    init() {
        this.loadProfileImage();
        this.animate();
    }
    
    loadProfileImage() {
        this.image = new Image();
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.image.onerror = () => {
            console.log('Profile image not found - using fallback pattern');
            this.createFallbackImage();
        };
        this.image.src = 'super.png';
    }
    
    createFallbackImage() {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = 400;
        tempCanvas.height = 400;
        const tempCtx = tempCanvas.getContext('2d');
        
        // Create a gradient using the new color scheme
        const gradient = tempCtx.createRadialGradient(200, 200, 0, 200, 200, 200);
        gradient.addColorStop(0, '#F6C6C2');
        gradient.addColorStop(0.3, '#E8B4B8');
        gradient.addColorStop(0.6, '#8A92C7');
        gradient.addColorStop(0.8, '#6B7AA0');
        gradient.addColorStop(1, '#62709F');
        
        tempCtx.fillStyle = gradient;
        tempCtx.fillRect(0, 0, 400, 400);
        
        // Add some geometric patterns with the color scheme
        tempCtx.fillStyle = 'rgba(246, 198, 194, 0.1)';
        for (let i = 0; i < 8; i++) {
            tempCtx.fillRect(i * 50, 0, 25, 400);
            tempCtx.fillRect(0, i * 50, 400, 25);
        }
        
        // Add some circles for visual interest
        tempCtx.fillStyle = 'rgba(138, 146, 199, 0.2)';
        for (let i = 0; i < 5; i++) {
            const x = Math.random() * 400;
            const y = Math.random() * 400;
            const radius = Math.random() * 30 + 10;
            tempCtx.beginPath();
            tempCtx.arc(x, y, radius, 0, Math.PI * 2);
            tempCtx.fill();
        }
        
        this.image = new Image();
        this.image.onload = () => {
            this.imageLoaded = true;
        };
        this.image.src = tempCanvas.toDataURL();
    }
    
    getWarpingPath() {
        const path = new Path2D();
        const numPoints = 300;
        
        // Calculate current amplitude
        const currentAmplitude = this.minAmplitude +
            (this.maxAmplitude - this.minAmplitude) *
            (Math.sin(this.amplitudeTime) * 0.5 + 0.5);
        
        let firstPoint = true;
        
        for (let i = 0; i <= numPoints; i++) {
            const angle = (i / numPoints) * Math.PI * 2;
            
            // Create warping effect with multiple wave frequencies
            const waveOffset = Math.sin(angle * this.waveFrequency + this.time) * currentAmplitude;
            const secondaryFreq = Math.round(this.waveFrequency * 1.5);
            const secondaryWave = Math.cos(angle * secondaryFreq + this.time * 1.3) * (currentAmplitude * 0.3);
            
            // Add subtle tertiary wave for more organic feel
            const tertiaryWave = Math.sin(angle * this.waveFrequency * 0.7 + this.time * 0.8) * (currentAmplitude * 0.15);
            
            const totalRadius = this.circleRadius + waveOffset + secondaryWave + tertiaryWave;
            
            const x = this.centerX + Math.cos(angle) * totalRadius;
            const y = this.centerY + Math.sin(angle) * totalRadius;
            
            if (firstPoint) {
                path.moveTo(x, y);
                firstPoint = false;
            } else {
                path.lineTo(x, y);
            }
        }
        
        path.closePath();
        return path;
    }
    
    drawMaskedImage() {
        // Clear canvas with transparent background
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!this.imageLoaded || !this.image) return;
        
        // Save the current context state
        this.ctx.save();
        
        // Create the warping path for clipping
        const warpingPath = this.getWarpingPath();
        
        // Set the clipping path
        this.ctx.clip(warpingPath);
        
        // Calculate image scaling to fit the canvas while maintaining aspect ratio
        const scale = Math.max(this.canvas.width / this.image.width, this.canvas.height / this.image.height) * 0.85; // Reduce scale by 30%
        const scaledWidth = this.image.width * scale;
        const scaledHeight = this.image.height * scale;
        const offsetX = (this.canvas.width - scaledWidth) / 2;
        const offsetY = (this.canvas.height - scaledHeight) / 2;
        
        // Draw the image (it will be clipped to the warping circle)
        this.ctx.drawImage(this.image, offsetX, offsetY, scaledWidth, scaledHeight);
        
        // Restore the context to remove clipping
        this.ctx.restore();
        
        // Draw the glowing border with new color scheme
        const currentAmplitude = this.minAmplitude +
            (this.maxAmplitude - this.minAmplitude) *
            (Math.sin(this.amplitudeTime) * 0.5 + 0.5);
        
        const glowIntensity = (currentAmplitude - this.minAmplitude) / (this.maxAmplitude - this.minAmplitude);
        
        // Create gradient stroke for more beautiful effect
        const gradient = this.ctx.createLinearGradient(
            this.centerX - this.circleRadius, 
            this.centerY - this.circleRadius,
            this.centerX + this.circleRadius, 
            this.centerY + this.circleRadius
        );
        gradient.addColorStop(0, `rgba(246, 198, 194, ${0.9 + glowIntensity * 0.3})`);
        gradient.addColorStop(0.5, `rgba(138, 146, 199, ${1.0 + glowIntensity * 0.2})`);
        gradient.addColorStop(1, `rgba(246, 198, 194, ${0.9 + glowIntensity * 0.3})`);
        
        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = this.lineWidth + glowIntensity * 2;
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        
        // Add concentrated outer glow
        this.ctx.shadowBlur = 15 + glowIntensity * 10; // Reduced radius
        this.ctx.shadowColor = `rgba(246, 198, 194, ${0.9 + glowIntensity * 0.6})`; // Higher opacity
        
        this.ctx.stroke(warpingPath);
        
        // Add strong inner glow
        this.ctx.shadowBlur = 12; // Reduced radius
        this.ctx.shadowColor = `rgba(138, 146, 199, ${0.7 + glowIntensity * 0.6})`; // Higher opacity
        this.ctx.lineWidth = 2;
        this.ctx.stroke(warpingPath);
        
        // Add subtle but intense inner glow
        this.ctx.shadowBlur = 8; // Reduced radius
        this.ctx.shadowColor = `rgba(246, 198, 194, ${0.5 + glowIntensity * 0.5})`; // Higher opacity
        this.ctx.lineWidth = 1;
        this.ctx.stroke(warpingPath);
        
        // Reset shadow
        this.ctx.shadowBlur = 0;
    }
    
    animate() {
        this.time += this.waveSpeed;
        this.amplitudeTime += this.amplitudeSpeed;
        this.drawMaskedImage();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize the warping circle when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WarpingCircle('canvas');
});