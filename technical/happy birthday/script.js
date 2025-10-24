document.addEventListener("DOMContentLoaded", () => {
    const NUM_CANDLES = 5;
    const BLOW_RMS_THRESHOLD = 0.07;
    const FLICKER_THRESHOLD = 0.03;
    const BLOW_MIN_TIME = 100;
  
    const cakeEl = document.getElementById("cake");
    const candlesEl = document.getElementById("candles");
    const statusEl = document.getElementById("status");
  
    // Create candles + flames
    for (let i = 0; i < NUM_CANDLES; i++) {
      const candle = document.createElement("div");
      candle.className = "candle";
      const flame = document.createElement("div");
      flame.className = "flame";
      flame.innerHTML = `
        <svg viewBox="0 0 16 28" xmlns="http://www.w3.org/2000/svg">
          <linearGradient id="grad${i}" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stop-color="var(--flame-color1)"/>
            <stop offset="0.4" stop-color="var(--flame-color2)"/>
            <stop offset="1" stop-color="var(--flame-color3)"/>
          </linearGradient>
          <path d="M8 0c2 2 4 4 3.7 7-.4 3.6-4.2 5.4-3.7 10-0.5-4.6-3.3-6.3-3.7-10C3.6 4 6 2 8 0z"
            fill="url(#grad${i})"/>
        </svg>`;
      candle.appendChild(flame);
      candlesEl.appendChild(candle);
    }
  
    const flames = [...document.querySelectorAll(".flame")];
  
    // Puff animation
    const canvas = document.getElementById("puffCanvas");
    const ctx = canvas.getContext("2d");
  
    function resizeCanvas() {
      canvas.width = cakeEl.clientWidth * devicePixelRatio;
      canvas.height = cakeEl.clientHeight * devicePixelRatio;
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();
  
    function puff(centerX) {
      const particles = [];
      for (let i = 0; i < 15; i++) {
        particles.push({
          x: centerX + (Math.random() - 0.5) * 30,
          y: 30,
          vx: (Math.random() - 0.5) * 2,
          vy: -(Math.random() * 2 + 0.8),
          life: 600 + Math.random() * 400,
          age: 0,
          r: 4 + Math.random() * 5,
        });
      }
      let last = performance.now();
      function frame(now) {
        const dt = now - last;
        last = now;
        ctx.clearRect(0, 0, cakeEl.clientWidth, cakeEl.clientHeight);
        particles.forEach((p) => {
          p.age += dt;
          p.x += p.vx * (dt / 16);
          p.y += p.vy * (dt / 16);
          const a = 1 - p.age / p.life;
          if (a > 0) {
            ctx.globalAlpha = a;
            ctx.fillStyle = "#eee";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1;
        if (particles.some((p) => p.age < p.life)) requestAnimationFrame(frame);
      }
      requestAnimationFrame(frame);
    }
  
    function extinguish() {
      flames.forEach((f) => {
        f.style.transform =
          "translateX(-50%) translateY(-10px) scale(0.3) rotate(20deg)";
        f.style.opacity = "0";
      });
      puff(cakeEl.clientWidth / 2);
      statusEl.textContent = "Candles blown out 🎉 Happy Birthday!";
    }
  
    function relight() {
      flames.forEach((f) => {
        f.style.opacity = "1";
        f.style.transform = "translateX(-50%)";
      });
      statusEl.textContent = "Make a wish and blow!";
    }
  
    // Microphone logic
    async function startMicrophone() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const audioCtx = new AudioContext();
        const source = audioCtx.createMediaStreamSource(stream);
        const analyser = audioCtx.createAnalyser();
        analyser.fftSize = 1024;
        source.connect(analyser);
        const data = new Uint8Array(analyser.fftSize);
  
        statusEl.textContent = "Listening for your blow... 🎂";
        let blowTime = 0;
        let last = performance.now();
  
        function loop(now) {
          analyser.getByteTimeDomainData(data);
          const rms = Math.sqrt(
            data.reduce((sum, v) => sum + ((v - 128) / 128) ** 2, 0) / data.length
          );
          const dt = now - last;
          last = now;
  
          if (rms > FLICKER_THRESHOLD) {
            const intensity = Math.min((rms - FLICKER_THRESHOLD) * 40, 1);
            flames.forEach((f) => {
              f.style.transform = `translateX(-50%) rotate(${
                (Math.random() - 0.5) * intensity * 40
              }deg) scale(${1 - intensity * 0.2})`;
            });
          } else {
            flames.forEach((f) => (f.style.transform = "translateX(-50%)"));
          }
  
          if (rms > BLOW_RMS_THRESHOLD) {
            blowTime += dt;
            if (blowTime > BLOW_MIN_TIME) {
              extinguish();
              blowTime = 0;
              setTimeout(relight, 2500);
            }
          } else {
            blowTime = Math.max(0, blowTime - dt * 2);
          }
          requestAnimationFrame(loop);
        }
        requestAnimationFrame(loop);
      } catch (err) {
        statusEl.textContent = "🎤 Please allow microphone access!";
      }
    }
  
    // Automatically request microphone when page loads
    startMicrophone();
  });
  