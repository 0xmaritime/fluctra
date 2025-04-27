<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { browser } from '$app/environment';
    
    export let className: string = '';
  
    let canvas: HTMLCanvasElement;
    let animationFrameId: number;
    let particles: Particle[] = [];
    let mousePosition = { x: 0, y: 0 };
    let time = 0;
  
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      angle: number;
      speed: number;
      originX: number;
      originY: number;
    }
  
    // Get CSS variable value
    function getCssVar(variableName: string): string {
      if (browser) {
        return getComputedStyle(document.documentElement).getPropertyValue(variableName).trim();
      }
      return '#000';
    }
  
    // Convert OKLCH to RGB for canvas rendering
    function oklchToRgb(oklchString: string, alpha: number = 1): string {
      if (!browser) return `rgba(0,0,0,${alpha})`;
      
      // Create a temporary element to let the browser compute the color
      const tempDiv = document.createElement('div');
      tempDiv.style.color = oklchString;
      document.body.appendChild(tempDiv);
      const rgbValue = getComputedStyle(tempDiv).color;
      document.body.removeChild(tempDiv);
      
      // Extract RGB values and add alpha
      const rgb = rgbValue.match(/\d+/g);
      if (rgb && rgb.length >= 3) {
        return `rgba(${rgb[0]},${rgb[1]},${rgb[2]},${alpha})`;
      }
      return `rgba(0,0,0,${alpha})`;
    }
  
    function initParticles(canvas: HTMLCanvasElement) {
      particles = [];
      const particleCount = Math.min(100, Math.floor(canvas.width * canvas.height / 15000));
      
      // Get colors from CSS variables
      const primaryColor = getCssVar('--color-primary-500');
      const secondaryColor = getCssVar('--color-secondary-500');
      const accentColor = getCssVar('--color-primary-300');
      
      const colors = [
        oklchToRgb(primaryColor, 0.5),
        oklchToRgb(secondaryColor, 0.5),
        oklchToRgb(accentColor, 0.5)
      ];
  
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.1 + Math.random() * 0.3;
        const radius = 2 + Math.random() * 3;
        
        const particle: Particle = {
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: radius,
          color: colors[Math.floor(Math.random() * colors.length)],
          angle: angle,
          speed: speed,
          originX: Math.random() * canvas.width,
          originY: Math.random() * canvas.height
        };
        particles.push(particle);
      }
    }
  
    function animate() {
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
  
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.01;
  
      // Draw connections between nearby particles
      particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x;
          const dy = particle.y - otherParticle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
  
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(otherParticle.x, otherParticle.y);
            
            // Use oklch for line colors
            const alpha = (1 - distance / 120) * 0.2;
            ctx.strokeStyle = oklchToRgb(getCssVar('--color-primary-500'), alpha);
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        });
      });
  
      // Update and draw particles
      particles.forEach(particle => {
        // Oscillating movement pattern
        particle.x += particle.vx;
        particle.y += particle.vy;
  
        // Add gentle floating motion
        particle.x += Math.sin(time + particle.angle) * 0.5;
        particle.y += Math.cos(time + particle.angle) * 0.5;
  
        // Mouse interaction
        const dx = mousePosition.x - particle.x;
        const dy = mousePosition.y - particle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 150) {
          const force = (150 - distance) / 150;
          particle.x -= dx * force * 0.02;
          particle.y -= dy * force * 0.02;
        }
  
        // Boundary collision
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
  
        // Keep particles within bounds
        particle.x = Math.max(0, Math.min(canvas.width, particle.x));
        particle.y = Math.max(0, Math.min(canvas.height, particle.y));
  
        // Draw particle with gradient
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, particle.color.replace(/[\d.]+\)$/g, '0)'));
  
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();
      });
  
      animationFrameId = requestAnimationFrame(animate);
    }
  
    function handleResize() {
      if (!browser || !canvas) return;
      
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
        initParticles(canvas);
      }
    }
  
    function handleMouseMove(event: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mousePosition = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
      };
    }
  
    onMount(() => {
      if (!browser) return;
  
      handleResize();
      window.addEventListener('resize', handleResize);
      canvas.addEventListener('mousemove', handleMouseMove);
      
      animate();
  
      // Re-init on theme change
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const themeChangeHandler = () => {
        if (canvas) {
          initParticles(canvas);
        }
      };
      mediaQuery.addEventListener('change', themeChangeHandler);
  
      return () => {
        window.removeEventListener('resize', handleResize);
        if (canvas) {
          canvas.removeEventListener('mousemove', handleMouseMove);
        }
        mediaQuery.removeEventListener('change', themeChangeHandler);
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    });
  
    onDestroy(() => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    });
  </script>
  
  <canvas
    bind:this={canvas}
    class="absolute inset-0 w-full h-full pointer-events-none {className}"
    style="opacity: 0.7;"
  ></canvas>
  
  <style>
    canvas {
      filter: blur(1px);
    }
  </style>