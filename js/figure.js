/* ============================================================
   CortanaX Holographic Figure — js/figure.js
   ------------------------------------------------------------
   A lightweight "hologram" built from a point cloud shaped like
   a humanoid bust (head, torso, arms, a dissolving lower wisp).
   No 3D modeling/rigging pipeline — just particles sampled on
   the surface of a few primitives, gently animated with Three.js.

   States (driven by main.js):
   - idle:     slow cyan breathing rotation
   - thinking: faster violet swirl, while waiting on the AI
   - speaking: brighter cyan with pulses timed to speech —
               Web Speech synthesis doesn't expose raw audio to
               the Web Audio API, so instead of true waveform
               analysis, CortanaFigure.pulse() is called on each
               utterance "boundary" (word) event, giving a
               rhythm that's tied to actual speech pacing
               rather than a random flicker.

   Fails gracefully: if Three.js doesn't load or WebGL isn't
   available, the figure area is hidden and nothing else on the
   site is affected.
   ============================================================ */
window.CortanaFigure = (function(){
  let scene, camera, renderer, points, container, wrap;
  let state = 'idle';
  let speakPulse = 0;
  let t = 0;
  let raf = null;
  let running = false;
  let ready = false;

  function addSphereShell(positions, cx, cy, cz, r, count){
    for(let i = 0; i < count; i++){
      const u = Math.random(), v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const rr = r * (0.82 + Math.random() * 0.18);
      positions.push(
        cx + rr * Math.sin(phi) * Math.cos(theta),
        cy + rr * Math.sin(phi) * Math.sin(theta),
        cz + rr * Math.cos(phi)
      );
    }
  }

  function addCylinderShell(positions, cx, cz, yBase, height, rTop, rBottom, count, thinTowardBottom){
    for(let i = 0; i < count; i++){
      let tt = Math.random();
      if(thinTowardBottom) tt = Math.pow(tt, 0.55); // sparser near the bottom — "not fully materialized" look
      const y = yBase + tt * height;
      const r = rBottom + (rTop - rBottom) * tt;
      const theta = Math.random() * Math.PI * 2;
      const rr = r * (0.85 + Math.random() * 0.15);
      positions.push(cx + rr * Math.cos(theta), y, cz + rr * Math.sin(theta));
    }
  }

  function buildGeometry(){
    const positions = [];
    addSphereShell(positions, 0, 1.55, 0, 0.32, 320);                          // head
    addCylinderShell(positions, 0, 0, 1.28, 0.14, 0.15, 0.13, 40, false);       // neck
    addCylinderShell(positions, 0, 0, 0.55, 0.75, 0.4, 0.32, 480, false);       // torso
    addCylinderShell(positions, -0.46, 0, 0.52, 0.72, 0.11, 0.1, 200, false);   // left arm
    addCylinderShell(positions, 0.46, 0, 0.52, 0.72, 0.11, 0.1, 200, false);    // right arm
    addCylinderShell(positions, 0, 0, 0, 0.5, 0.34, 0.02, 320, true);           // dissolving lower wisp

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }

  function fail(){
    if(wrap) wrap.classList.add('figure-unavailable');
  }

  function init(containerId){
    if(ready) return;
    container = document.getElementById(containerId);
    if(!container) return;
    wrap = container.closest('.cortana-figure-wrap');

    if(typeof THREE === 'undefined'){
      console.warn('CortanaFigure: Three.js did not load — hologram disabled, rest of the site is unaffected.');
      fail();
      return;
    }

    try{
      const w = container.clientWidth || 300;
      const h = container.clientHeight || 220;

      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
      camera.position.set(0, 0.95, 3.1);
      camera.lookAt(0, 0.9, 0);

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(w, h);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.innerHTML = '';
      container.appendChild(renderer.domElement);

      const geo = buildGeometry();
      const material = new THREE.PointsMaterial({
        size: 0.028,
        color: 0x00e5ff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      points = new THREE.Points(geo, material);
      scene.add(points);

      window.addEventListener('resize', onResize);

      // Only render while the figure is actually on-screen — saves battery/perf
      // when the visitor has scrolled to a different section.
      if('IntersectionObserver' in window){
        const obs = new IntersectionObserver(entries => {
          if(entries[0].isIntersecting) startLoop(); else stopLoop();
        }, { threshold: 0.05 });
        obs.observe(wrap || container);
      } else {
        startLoop();
      }

      ready = true;
    } catch(err){
      console.warn('CortanaFigure: WebGL unavailable — hologram disabled.', err);
      fail();
    }
  }

  function onResize(){
    if(!container || !renderer || !camera) return;
    const w = container.clientWidth || 300;
    const h = container.clientHeight || 220;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  function setState(next){
    state = next;
    const label = document.getElementById('figureStateLabel');
    if(label){
      label.textContent = next.toUpperCase();
      label.className = 'cortana-figure__state cortana-figure__state--' + next;
    }
  }

  function pulse(){
    speakPulse = 1;
  }

  function startLoop(){
    if(running || !ready) return;
    running = true;
    raf = requestAnimationFrame(animate);
  }

  function stopLoop(){
    running = false;
    if(raf) cancelAnimationFrame(raf);
  }

  function animate(){
    if(!running) return;
    raf = requestAnimationFrame(animate);
    t += 0.016;
    speakPulse *= 0.90;

    let targetColor = new THREE.Color(0x00e5ff);
    let rotSpeed = 0.15;

    if(state === 'thinking'){
      targetColor = new THREE.Color(0x7c5cff);
      rotSpeed = 0.55;
    } else if(state === 'speaking'){
      targetColor = new THREE.Color(0x00e5ff);
      rotSpeed = 0.25;
    }

    points.material.color.lerp(targetColor, 0.05);
    points.material.size = 0.028 + speakPulse * 0.02 + (state === 'thinking' ? Math.sin(t * 8) * 0.004 : 0);
    points.rotation.y += 0.01 * rotSpeed;
    points.position.y = Math.sin(t * 0.6) * 0.03;
    points.scale.setScalar(1 + Math.sin(t * 2.2) * 0.01 + speakPulse * 0.04);

    renderer.render(scene, camera);
  }

  let arStream = null;

  async function enableAR(){
    if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
      return { ok: false, reason: 'unsupported' };
    }
    try{
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
      const video = document.getElementById('arCameraFeed');
      if(video){
        video.srcObject = stream;
        await video.play().catch(() => {}); // some browsers need an explicit play() after srcObject is set
      }
      arStream = stream;
      if(wrap) wrap.classList.add('ar-active');
      return { ok: true };
    } catch(err){
      console.warn('CortanaFigure: camera permission denied or unavailable.', err);
      return { ok: false, reason: err.name === 'NotAllowedError' ? 'denied' : 'error' };
    }
  }

  function disableAR(){
    if(arStream){
      arStream.getTracks().forEach(track => track.stop());
      arStream = null;
    }
    const video = document.getElementById('arCameraFeed');
    if(video) video.srcObject = null;
    if(wrap) wrap.classList.remove('ar-active');
  }

  return { init, setState, pulse, enableAR, disableAR };
})();
