(function (root) {
  const W = root.WORLD_CONFIG;

  // Deterministic pseudo-random for consistent grass tufts, pebbles, and wildflowers
  function seededRand(seed) {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return function () {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  }

  function roundRectPath(ctx, x, y, w, h, r) {
    const radius = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + w, y, x + w, y + h, radius);
    ctx.arcTo(x + w, y + h, x, y + h, radius);
    ctx.arcTo(x, y + h, x, y, radius);
    ctx.arcTo(x, y, x + w, y, radius);
    ctx.closePath();
  }

  function shadeHex(hex, percent) {
    const clean = hex.replace('#', '');
    const num = parseInt(clean, 16);
    const r = Math.min(255, Math.max(0, ((num >> 16) & 0xff) + percent));
    const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + percent));
    const b = Math.min(255, Math.max(0, (num & 0xff) + percent));
    return `rgb(${r}, ${g}, ${b})`;
  }

  // Generate deterministic static nature details once
  const rand = seededRand(20261119);
  const grassPatches = [];
  for (let i = 0; i < 65; i++) {
    grassPatches.push({
      x: 60 + rand() * (W.WORLD_WIDTH - 120),
      y: 60 + rand() * (W.WORLD_HEIGHT - 120),
      rx: 45 + rand() * 80,
      ry: 28 + rand() * 55,
      color: rand() > 0.5 ? 'rgba(130, 164, 118, 0.35)' : 'rgba(164, 194, 146, 0.32)',
    });
  }

  const grassTufts = [];
  for (let i = 0; i < 180; i++) {
    const x = 60 + rand() * (W.WORLD_WIDTH - 120);
    const y = 60 + rand() * (W.WORLD_HEIGHT - 120);
    if (W.isInPondWater(x, y, 24)) continue;
    if (Math.hypot(x - W.PLAZA.x, y - W.PLAZA.y) < W.PLAZA.stoneRadius + 16) continue;
    grassTufts.push({
      x,
      y,
      phase: rand() * Math.PI * 2,
      size: 4 + rand() * 4,
      hasFlower: rand() < 0.28,
      flowerColor: ['#fdf6e3', '#f7cf6c', '#f0a68b', '#e8d7f1'][Math.floor(rand() * 4)],
    });
  }

  const floatingMotes = [];
  for (let i = 0; i < 36; i++) {
    floatingMotes.push({
      x: rand() * W.WORLD_WIDTH,
      y: rand() * W.WORLD_HEIGHT,
      speedX: 6 + rand() * 10,
      speedY: -3 + rand() * 6,
      phase: rand() * Math.PI * 2,
      radius: 1.6 + rand() * 2.2,
    });
  }

  const koiFish = [
    { cx: 1305, cy: 635, rx: 52, ry: 28, speed: 0.48, phase: 0.2, color: '#e67e45', accent: '#fff7eb' },
    { cx: 1410, cy: 760, rx: 48, ry: 26, speed: -0.4, phase: 2.1, color: '#f2b84b', accent: '#ffffff' },
    { cx: 1365, cy: 715, rx: 36, ry: 20, speed: 0.35, phase: 4.3, color: '#df6548', accent: '#f7e6cf' },
  ];

  // Underwater fish shadows gliding near the fishing pier!
  const fishShadows = [
    { cx: 1335, cy: 758, rx: 52, ry: 22, speed: 0.42, phase: 0.5, size: 1.15 },
    { cx: 1390, cy: 785, rx: 44, ry: 18, speed: -0.34, phase: 1.8, size: 1.45 }, // Big catfish shadow!
    { cx: 1290, cy: 742, rx: 34, ry: 15, speed: 0.55, phase: 3.1, size: 0.85 },
    { cx: 1435, cy: 742, rx: 38, ry: 19, speed: -0.46, phase: 4.4, size: 1.0 },
    { cx: 1350, cy: 625, rx: 46, ry: 22, speed: 0.38, phase: 2.6, size: 1.05 },
  ];

  const lilyPads = [
    { x: 1255, y: 615, r: 16, angle: 0.6, lotus: true },
    { x: 1280, y: 598, r: 12, angle: 2.2, lotus: false },
    { x: 1455, y: 780, r: 17, angle: 4.0, lotus: true },
    { x: 1480, y: 755, r: 13, angle: 1.1, lotus: false },
    { x: 1375, y: 805, r: 14, angle: 3.1, lotus: false },
    { x: 1375, y: 595, r: 13, angle: 5.0, lotus: true },
  ];

  // Natural stepping stone path segments connecting all landmarks
  function buildDefaultPathStones() {
    const stones = [];
    const r = seededRand(88421);

    function addLine(x1, y1, x2, y2, spacing, widthJitter) {
      const dist = Math.hypot(x2 - x1, y2 - y1);
      const steps = Math.max(1, Math.floor(dist / spacing));
      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const bx = x1 + (x2 - x1) * t;
        const by = y1 + (y2 - y1) * t;
        // Skip pond water except bridge approaches
        if (W.isInPondWater(bx, by, 6)) continue;
        stones.push({
          x: bx + (r() - 0.5) * widthJitter,
          y: by + (r() - 0.5) * widthJitter,
          rx: 15 + r() * 7,
          ry: 11 + r() * 5,
          rot: (r() - 0.5) * 0.45,
          shade: r() > 0.5 ? '#ece3d0' : '#e3d8c1',
        });
      }
    }

    // South Gate -> Alun-alun (double-wide welcoming walkway)
    addLine(882, 1060, 882, 728, 30, 6);
    addLine(918, 1060, 918, 728, 30, 6);

    // Alun-alun -> North plots corridor
    addLine(900, 440, 900, 210, 32, 10);
    addLine(900, 210, 695, 210, 32, 8);
    addLine(900, 210, 1085, 210, 32, 8);

    // Alun-alun -> Pendopo Modern (West)
    addLine(765, 560, 585, 500, 32, 8);

    // Alun-alun -> Pond Wooden Bridge (East)
    addLine(1035, 628, 1188, 695, 32, 8);

    // East of Bridge -> Kavling Timur & Kavling Selatan B
    addLine(1488, 695, 1550, 515, 34, 8);
    addLine(1488, 695, 1480, 885, 34, 8);

    // West branch -> Kavling Barat & Kavling Selatan A
    addLine(740, 695, 585, 765, 34, 8);
    addLine(845, 865, 795, 920, 34, 6);
    addLine(955, 865, 1020, 940, 34, 6);

    return stones;
  }

  const defaultPathStones = buildDefaultPathStones();

  function drawStoneTile(ctx, x, y, scale) {
    const s = scale || 1;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);
    // Subtle natural grass seam underneath
    const pieces = [
      { ox: -10, oy: -8, rx: 11, ry: 8, rot: -0.15, c: '#ebe2cf' },
      { ox: 10, oy: -7, rx: 10, ry: 8, rot: 0.2, c: '#e3d8c2' },
      { ox: -8, oy: 9, rx: 10, ry: 8, rot: 0.12, c: '#e5dac5' },
      { ox: 10, oy: 9, rx: 11, ry: 7.5, rot: -0.18, c: '#eee6d6' },
    ];
    for (let i = 0; i < pieces.length; i++) {
      const p = pieces[i];
      ctx.save();
      ctx.translate(p.ox, p.oy);
      ctx.rotate(p.rot);
      ctx.fillStyle = 'rgba(84, 72, 52, 0.22)';
      ctx.beginPath();
      ctx.ellipse(1, 2.2, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = p.c;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 252, 245, 0.45)';
      ctx.beginPath();
      ctx.ellipse(-2, -2, p.rx * 0.55, p.ry * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.restore();
  }

  function drawPavingTileAuto(ctx, x, y, jalanSet) {
    const s = 40;
    const half = s / 2;
    const key = (gx, gy) => `${Math.round(gx / 40) * 40},${Math.round(gy / 40) * 40}`;
    const hasConn = (nx, ny) => {
      if (jalanSet && jalanSet.has(key(nx, ny))) return true;
      if (W.isOnBuiltInRoad && W.isOnBuiltInRoad(nx, ny, 14)) return true;
      return false;
    };

    const n = hasConn(x, y - s);
    const so = hasConn(x, y + s);
    const e = hasConn(x + s, y);
    const w = hasConn(x - s, y);

    ctx.save();
    ctx.translate(x, y);

    const x0 = w ? -half - 1 : -half + 2;
    const y0 = n ? -half - 1 : -half + 2;
    const x1 = e ? half + 1 : half - 2;
    const y1 = so ? half + 1 : half - 2;
    const rw = x1 - x0;
    const rh = y1 - y0;

    // Outer stone curb border on unconnected edges
    ctx.fillStyle = '#b9a686';
    roundRectPath(ctx, x0 - (w ? 0 : 2), y0 - (n ? 0 : 2), rw + (w ? 0 : 2) + (e ? 0 : 2), rh + (n ? 0 : 2) + (so ? 0 : 2), !n && !so && !e && !w ? 7 : 3);
    ctx.fill();

    // Warm sandstone paving block fill
    ctx.fillStyle = '#e2d5bc';
    roundRectPath(ctx, x0, y0, rw, rh, !n && !so && !e && !w ? 5 : 2);
    ctx.fill();

    // Subtle interlocking brick-paver pattern inside tile
    ctx.strokeStyle = 'rgba(154, 134, 102, 0.38)';
    ctx.lineWidth = 1;
    for (let row = -1; row <= 1; row++) {
      const py = row * 12;
      ctx.beginPath();
      ctx.moveTo(x0 + 2, py);
      ctx.lineTo(x1 - 2, py);
      ctx.stroke();
    }
    const offsets = [
      { y: -18, h: 12, xs: [-6, 10] },
      { y: -6, h: 12, xs: [-12, 4] },
      { y: 6, h: 12, xs: [-6, 10] },
    ];
    for (let i = 0; i < offsets.length; i++) {
      const o = offsets[i];
      for (let j = 0; j < o.xs.length; j++) {
        const px = o.xs[j];
        if (px > x0 + 2 && px < x1 - 2) {
          ctx.beginPath();
          ctx.moveTo(px, Math.max(y0 + 1, o.y));
          ctx.lineTo(px, Math.min(y1 - 1, o.y + o.h));
          ctx.stroke();
        }
      }
    }

    // Soft warm highlight on top-left paving bricks
    ctx.fillStyle = 'rgba(255, 250, 238, 0.34)';
    ctx.fillRect(x0 + 3, y0 + 3, Math.max(6, rw * 0.38), 7);
    ctx.fillRect(x0 + rw * 0.48, y0 + 14, Math.max(6, rw * 0.36), 7);

    ctx.restore();
  }

  function drawNeighborhoodRoads(ctx) {
    if (!W.NEIGHBORHOOD_ROADS) return;
    ctx.save();

    // Pass 1: Continuous warm stone curb backing so intersections join cleanly without seam lines
    ctx.fillStyle = '#b9a88a';
    for (let i = 0; i < W.NEIGHBORHOOD_ROADS.length; i++) {
      const r = W.NEIGHBORHOOD_ROADS[i];
      roundRectPath(ctx, r.x - 3, r.y - 3, r.w + 6, r.h + 6, 8);
      ctx.fill();
    }

    // Pass 2: Warm sandstone paving-block surface
    ctx.fillStyle = '#e0d3ba';
    for (let i = 0; i < W.NEIGHBORHOOD_ROADS.length; i++) {
      const r = W.NEIGHBORHOOD_ROADS[i];
      roundRectPath(ctx, r.x, r.y, r.w, r.h, 6);
      ctx.fill();
    }

    // Pass 3: Neat staggered paving-block texture seams
    ctx.strokeStyle = 'rgba(156, 136, 106, 0.32)';
    ctx.lineWidth = 1;
    for (let i = 0; i < W.NEIGHBORHOOD_ROADS.length; i++) {
      const r = W.NEIGHBORHOOD_ROADS[i];
      ctx.save();
      roundRectPath(ctx, r.x, r.y, r.w, r.h, 6);
      ctx.clip();

      const isHoriz = r.w >= r.h;
      if (isHoriz) {
        for (let gx = r.x + 14; gx < r.x + r.w; gx += 16) {
          ctx.beginPath();
          ctx.moveTo(gx, r.y);
          ctx.lineTo(gx, r.y + r.h);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(r.x, r.y + r.h * 0.5);
        ctx.lineTo(r.x + r.w, r.y + r.h * 0.5);
        ctx.stroke();
      } else {
        for (let gy = r.y + 14; gy < r.y + r.h; gy += 16) {
          ctx.beginPath();
          ctx.moveTo(r.x, gy);
          ctx.lineTo(r.x + r.w, gy);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(r.x + r.w * 0.5, r.y);
        ctx.lineTo(r.x + r.w * 0.5, r.y + r.h);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore();
  }

  function drawMainRoad(ctx) {
    const mr = W.MAIN_ROAD;
    if (!mr) return;
    ctx.save();

    // Soft roadside green verge shadow
    ctx.fillStyle = 'rgba(54, 68, 46, 0.16)';
    ctx.fillRect(0, mr.northSidewalkY - 3, W.WORLD_WIDTH, 4);
    ctx.fillRect(0, mr.southSidewalkY + mr.southSidewalkH, W.WORLD_WIDTH, 4);

    // North & South Natural Stone Sidewalks (Trotoar Batu Alam)
    const drawSidewalk = (sy, sh) => {
      const grad = ctx.createLinearGradient(0, sy, 0, sy + sh);
      grad.addColorStop(0, '#e4dac6');
      grad.addColorStop(1, '#d3c6ae');
      ctx.fillStyle = grad;
      ctx.fillRect(0, sy, W.WORLD_WIDTH, sh);

      // Granite curb lines
      ctx.fillStyle = '#b4a58d';
      ctx.fillRect(0, sy, W.WORLD_WIDTH, 2);
      ctx.fillRect(0, sy + sh - 2.5, W.WORLD_WIDTH, 2.5);

      // Stone slab expansion joints
      ctx.strokeStyle = 'rgba(136, 122, 98, 0.34)';
      ctx.lineWidth = 1;
      for (let x = 0; x < W.WORLD_WIDTH; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, sy + 2);
        ctx.lineTo(x, sy + sh - 2);
        ctx.stroke();
      }
    };
    drawSidewalk(mr.northSidewalkY, mr.northSidewalkH);
    drawSidewalk(mr.southSidewalkY, mr.southSidewalkH);

    // Modern Dark Slate-Gray Asphalt Roadway
    const aspGrad = ctx.createLinearGradient(0, mr.asphaltY, 0, mr.asphaltY + mr.asphaltH);
    aspGrad.addColorStop(0, '#464d54');
    aspGrad.addColorStop(0.5, '#3b4148');
    aspGrad.addColorStop(1, '#444b52');
    ctx.fillStyle = aspGrad;
    ctx.fillRect(0, mr.asphaltY, W.WORLD_WIDTH, mr.asphaltH);

    // Crisp solid shoulder markings
    ctx.fillStyle = 'rgba(244, 242, 234, 0.55)';
    ctx.fillRect(0, mr.asphaltY + 4, W.WORLD_WIDTH, 2);
    ctx.fillRect(0, mr.asphaltY + mr.asphaltH - 6, W.WORLD_WIDTH, 2);

    // Dashed white center lane divider (breaks cleanly around Zebra Cross)
    const centerY = mr.asphaltY + mr.asphaltH / 2;
    ctx.strokeStyle = 'rgba(248, 246, 238, 0.88)';
    ctx.lineWidth = 2.8;
    ctx.setLineDash([24, 20]);
    ctx.beginPath();
    ctx.moveTo(0, centerY);
    ctx.lineTo(mr.zebraX - 14, centerY);
    ctx.moveTo(mr.zebraX + mr.zebraW + 14, centerY);
    ctx.lineTo(W.WORLD_WIDTH, centerY);
    ctx.stroke();
    ctx.setLineDash([]);

    // Zebra Cross directly in front of Gerbang Kampung
    const stripeCount = 6;
    const padY = 6;
    const availH = mr.asphaltH - padY * 2;
    const stripeH = 6.2;
    const gap = (availH - stripeCount * stripeH) / (stripeCount - 1);
    ctx.fillStyle = 'rgba(252, 250, 244, 0.94)';
    for (let i = 0; i < stripeCount; i++) {
      const sy = mr.asphaltY + padY + i * (stripeH + gap);
      roundRectPath(ctx, mr.zebraX, sy, mr.zebraW, stripeH, 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawPjuLamp(ctx, x, y, time, ambiance) {
    ctx.save();
    ctx.translate(x, y);

    // Pole base shadow
    ctx.fillStyle = 'rgba(36, 42, 34, 0.25)';
    ctx.beginPath();
    ctx.ellipse(2, 4, 8, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Base collar
    ctx.fillStyle = '#3a4247';
    roundRectPath(ctx, -4.5, -5, 9, 8, 2);
    ctx.fill();

    // Tall sleek dark-slate steel pole curving out toward asphalt
    ctx.strokeStyle = '#475158';
    ctx.lineWidth = 3.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(0, -4);
    ctx.lineTo(0, -48);
    ctx.quadraticCurveTo(0, -56, 11, -55);
    ctx.lineTo(16, -54);
    ctx.stroke();

    // Warm LED lamp hood
    ctx.fillStyle = '#31383d';
    roundRectPath(ctx, 10, -57, 12, 5, 2.5);
    ctx.fill();

    const glow = ambiance === 'senja' ? 1 : ambiance === 'sore' ? 0.78 : 0.45;
    ctx.fillStyle = `rgba(255, 224, 130, ${glow})`;
    ctx.beginPath();
    ctx.ellipse(16, -52, 5, 2.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Soft downward light cone on dusk/night
    if (ambiance !== 'pagi') {
      const cone = ctx.createRadialGradient(16, -24, 3, 16, -6, 38);
      cone.addColorStop(0, `rgba(255, 214, 110, ${0.24 * glow})`);
      cone.addColorStop(1, 'rgba(255, 200, 80, 0)');
      ctx.fillStyle = cone;
      ctx.beginPath();
      ctx.arc(16, -12, 38, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawMiniHalte(ctx, halte, time) {
    ctx.save();
    ctx.translate(halte.x, halte.y);

    // Shadow
    ctx.fillStyle = 'rgba(38, 42, 36, 0.22)';
    roundRectPath(ctx, -40, -2, 82, 16, 6);
    ctx.fill();

    // Glass back wall framed in warm timber
    ctx.fillStyle = 'rgba(214, 236, 240, 0.72)';
    roundRectPath(ctx, -36, -34, 72, 28, 4);
    ctx.fill();
    ctx.strokeStyle = '#6c4728';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wooden waiting bench inside shelter
    ctx.fillStyle = '#a46e3f';
    roundRectPath(ctx, -28, -12, 56, 7, 2.5);
    ctx.fill();
    ctx.fillStyle = '#5e3c20';
    ctx.fillRect(-24, -5, 4, 8);
    ctx.fillRect(20, -5, 4, 8);

    // Support posts
    ctx.fillStyle = '#5c3c22';
    ctx.fillRect(-37, -38, 4.5, 42);
    ctx.fillRect(32.5, -38, 4.5, 42);

    // Sleek warm-wood & sage eco shelter roof
    ctx.fillStyle = '#4e784b';
    roundRectPath(ctx, -42, -44, 84, 9, 4);
    ctx.fill();
    ctx.strokeStyle = '#385736';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Warm overhead shelter bulb
    const pulse = 0.8 + Math.sin(time * 2.8) * 0.14;
    ctx.fillStyle = `rgba(255, 230, 140, ${pulse})`;
    ctx.beginPath();
    ctx.arc(0, -34, 3.2, 0, Math.PI * 2);
    ctx.fill();

    // Mini bus stop pole + '🚏 Halte' signboard
    ctx.fillStyle = '#46525a';
    ctx.fillRect(42, -38, 3, 42);
    ctx.fillStyle = '#3d6d8e';
    roundRectPath(ctx, 35, -46, 17, 14, 4);
    ctx.fill();
    ctx.strokeStyle = '#fff9ec';
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.font = '9.5px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🚏', 43.5, -39);

    ctx.font = '800 8.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#fff9ea';
    ctx.fillText('HALTE KAMPUNG', 0, -39.5);

    ctx.restore();
  }

  function drawMiniTrafficSign(ctx, sign) {
    ctx.save();
    ctx.translate(sign.x, sign.y);

    // Pole
    ctx.fillStyle = '#525b63';
    ctx.fillRect(-1.6, -28, 3.2, 30);

    if (sign.kind === 'zebra') {
      // Yellow diamond pedestrian crossing warning sign
      ctx.save();
      ctx.translate(0, -30);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#f6c344';
      roundRectPath(ctx, -8.5, -8.5, 17, 17, 2.5);
      ctx.fill();
      ctx.strokeStyle = '#3b3326';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.restore();

      ctx.font = '10px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🚸', 0, -29.5);
    } else {
      // White/red circular eco speed limit (20 km/h)
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -30, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d1493f';
      ctx.lineWidth = 2.4;
      ctx.stroke();

      ctx.font = '800 8.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      ctx.fillStyle = '#2d2d2d';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(sign.label || '20', 0, -29.5);
    }

    ctx.restore();
  }

  function drawRoadDirectionSign(ctx, sign) {
    ctx.save();
    ctx.translate(sign.x, sign.y);

    // Ground shadow
    ctx.fillStyle = 'rgba(42, 38, 28, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 9, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Timber signpost
    ctx.fillStyle = '#6f4624';
    roundRectPath(ctx, -3, -34, 6, 38, 2);
    ctx.fill();

    // Warm wooden directional plank
    ctx.font = '700 9px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const tw = ctx.measureText(sign.text).width + 16;
    ctx.fillStyle = '#f5e7ca';
    roundRectPath(ctx, -tw / 2, -40, tw, 18, 5);
    ctx.fill();
    ctx.strokeStyle = '#8b5c34';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    ctx.fillStyle = '#47301b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sign.text, 0, -31);

    ctx.restore();
  }

  function drawRoadVehicles(ctx, time, ambiance, players) {
    const mr = W.MAIN_ROAD;
    if (!mr) return;

    // 1. Mini Eco Electric Car cruising smoothly Eastbound on lower lane
    const span = W.WORLD_WIDTH + 280;
    const evX = ((time * 74) % span) - 140;
    const evY = mr.asphaltY + mr.asphaltH * 0.72;

    ctx.save();
    ctx.translate(evX, evY);

    // Soft drop shadow
    ctx.fillStyle = 'rgba(20, 24, 28, 0.36)';
    roundRectPath(ctx, -28, -9, 58, 22, 9);
    ctx.fill();

    // Headlight beam forward (East)
    const beamAlpha = ambiance === 'senja' ? 0.36 : ambiance === 'sore' ? 0.18 : 0.06;
    const beamGrad = ctx.createLinearGradient(26, 0, 92, 0);
    beamGrad.addColorStop(0, `rgba(255, 242, 180, ${beamAlpha})`);
    beamGrad.addColorStop(1, 'rgba(255, 242, 180, 0)');
    ctx.fillStyle = beamGrad;
    ctx.beginPath();
    ctx.moveTo(26, -8);
    ctx.lineTo(92, -18);
    ctx.lineTo(92, 18);
    ctx.lineTo(26, 8);
    ctx.closePath();
    ctx.fill();

    // Compact rounded Sage-Cream EV hatchback body
    ctx.fillStyle = '#75a37a';
    roundRectPath(ctx, -26, -12, 52, 24, 9);
    ctx.fill();
    ctx.strokeStyle = '#3f6243';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Cream eco roof & windshield glass
    ctx.fillStyle = '#d7ebf0';
    roundRectPath(ctx, -14, -9, 30, 18, 5);
    ctx.fill();
    ctx.fillStyle = '#f6f0e2';
    roundRectPath(ctx, -10, -7, 17, 14, 4);
    ctx.fill();

    // Tiny green eco leaf badge on roof
    ctx.fillStyle = '#5c9159';
    ctx.beginPath();
    ctx.ellipse(-1, 0, 4, 2.3, -0.35, 0, Math.PI * 2);
    ctx.fill();

    // Front headlights & rear brake lights
    ctx.fillStyle = '#fff3b8';
    ctx.fillRect(23, -9, 3.5, 5);
    ctx.fillRect(23, 4, 3.5, 5);
    ctx.fillStyle = '#e55447';
    ctx.fillRect(-26.5, -9, 2.8, 5);
    ctx.fillRect(-26.5, 4, 2.8, 5);
    ctx.restore();

    // 2. Cheerful Eco-Bicycle / Electric Scooter cruising Westbound on upper lane
    const bikeX = W.WORLD_WIDTH + 140 - (((time * 52) + 720) % span);
    const bikeY = mr.asphaltY + mr.asphaltH * 0.28 + Math.sin(time * 8) * 0.9;

    ctx.save();
    ctx.translate(bikeX, bikeY);

    // Shadow
    ctx.fillStyle = 'rgba(20, 24, 28, 0.3)';
    ctx.beginPath();
    ctx.ellipse(0, 4, 15, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Front beam West
    const bGrad = ctx.createLinearGradient(-14, 0, -52, 0);
    bGrad.addColorStop(0, `rgba(255, 240, 178, ${beamAlpha})`);
    bGrad.addColorStop(1, 'rgba(255, 240, 178, 0)');
    ctx.fillStyle = bGrad;
    ctx.beginPath();
    ctx.moveTo(-14, -4);
    ctx.lineTo(-52, -11);
    ctx.lineTo(-52, 11);
    ctx.lineTo(-14, 4);
    ctx.closePath();
    ctx.fill();

    // Wheels & slim frame
    ctx.fillStyle = '#2d3338';
    roundRectPath(ctx, -15, -2.5, 9, 5, 2);
    roundRectPath(ctx, 6, -2.5, 9, 5, 2);
    ctx.fill();

    ctx.fillStyle = '#d98845';
    roundRectPath(ctx, -10, -4.5, 20, 9, 4);
    ctx.fill();
    ctx.strokeStyle = '#7e481e';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Rider helmet & jacket
    ctx.fillStyle = '#4c8e99';
    ctx.beginPath();
    ctx.arc(1, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff5dc';
    ctx.beginPath();
    ctx.arc(-1, -1, 4.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d98845';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Tiny yellow handlebar lamp
    ctx.fillStyle = '#ffec99';
    ctx.beginPath();
    ctx.arc(-13, 0, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // ==================== Area Komplek Perumahan (Cluster Hunian Warga) ====================
  function drawHousingClusterGround(ctx, time, housingCluster, buildState) {
    const hc = W.HOUSING_CLUSTER;
    if (!hc) return;
    const b = hc.bounds;
    const blockCount = (housingCluster && housingCluster.blockCount) || hc.defaultBlockCount;
    const kavlings =
      (housingCluster && Array.isArray(housingCluster.kavlings) && housingCluster.kavlings) ||
      W.generateClusterKavlings(blockCount);
    const isHouseBuild = Boolean(buildState && buildState.selectedType === 'rumah');
    const snappedId = buildState && buildState.snappedKavlingId;

    ctx.save();

    // Soft landscaped compound lawn & subtle eco-hedge border
    ctx.fillStyle = 'rgba(136, 174, 126, 0.56)';
    roundRectPath(ctx, b.x, b.y, b.w, b.h, 24);
    ctx.fill();
    ctx.strokeStyle = '#6c9164';
    ctx.lineWidth = 3;
    roundRectPath(ctx, b.x, b.y, b.w, b.h, 24);
    ctx.stroke();

    // Inner decorative hedge trim dashed line
    ctx.strokeStyle = 'rgba(244, 238, 222, 0.52)';
    ctx.lineWidth = 1.4;
    ctx.setLineDash([8, 6]);
    roundRectPath(ctx, b.x + 8, b.y + 8, b.w - 16, b.h - 16, 19);
    ctx.stroke();
    ctx.setLineDash([]);

    // Tidy Internal Cluster Paving Road Network (Boulevard + Block Alleys + Perimeter Walks)
    const cRoads = W.getClusterRoads(blockCount);
    ctx.fillStyle = '#b9a88a';
    for (let i = 0; i < cRoads.length; i++) {
      const r = cRoads[i];
      roundRectPath(ctx, r.x - 3, r.y - 3, r.w + 6, r.h + 6, 7);
      ctx.fill();
    }
    ctx.fillStyle = '#e2d5bc';
    for (let i = 0; i < cRoads.length; i++) {
      const r = cRoads[i];
      roundRectPath(ctx, r.x, r.y, r.w, r.h, 5);
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(156, 136, 106, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < cRoads.length; i++) {
      const r = cRoads[i];
      ctx.save();
      roundRectPath(ctx, r.x, r.y, r.w, r.h, 5);
      ctx.clip();
      const horiz = r.w >= r.h;
      if (horiz) {
        for (let gx = r.x + 14; gx < r.x + r.w; gx += 16) {
          ctx.beginPath();
          ctx.moveTo(gx, r.y);
          ctx.lineTo(gx, r.y + r.h);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(r.x, r.y + r.h * 0.5);
        ctx.lineTo(r.x + r.w, r.y + r.h * 0.5);
        ctx.stroke();
      } else {
        for (let gy = r.y + 14; gy < r.y + r.h; gy += 16) {
          ctx.beginPath();
          ctx.moveTo(r.x, gy);
          ctx.lineTo(r.x + r.w, gy);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.moveTo(r.x + r.w * 0.5, r.y);
        ctx.lineTo(r.x + r.w * 0.5, r.y + r.h);
        ctx.stroke();
      }
      ctx.restore();
    }

    // Subtle zone title watermark at top of compound
    ctx.font = '700 11px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = 'rgba(60, 82, 54, 0.72)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      `🏡 KOMPLEK HUNIAN WARGA · ${blockCount} BLOK (${kavlings.length} KAVLING)`,
      b.x + b.w / 2,
      b.y + 24
    );

    // Draw Uniform Ready-to-Build Kavling Plots (Blok A-01, A-02, ...)
    for (let i = 0; i < kavlings.length; i++) {
      const k = kavlings[i];
      const occupied = Boolean(k.occupiedByBuildingId);
      const isSnapped = isHouseBuild && snappedId === k.id;
      const pulse = 0.5 + Math.sin(time * 4.2 + i * 0.5) * 0.5;

      // Garden plot base pad
      if (isSnapped && !occupied) {
        ctx.fillStyle = `rgba(98, 194, 108, ${0.34 + pulse * 0.14})`;
      } else if (isHouseBuild && !occupied) {
        ctx.fillStyle = `rgba(148, 206, 146, ${0.32 + pulse * 0.08})`;
      } else if (occupied) {
        ctx.fillStyle = 'rgba(176, 202, 156, 0.52)';
      } else {
        ctx.fillStyle = 'rgba(176, 208, 158, 0.44)';
      }
      roundRectPath(ctx, k.x, k.y, k.w, k.h, 12);
      ctx.fill();

      // Thin neat garden hedge border
      ctx.lineWidth = isSnapped ? 2.8 : isHouseBuild && !occupied ? 2 : 1.5;
      ctx.strokeStyle = isSnapped
        ? occupied
          ? '#d65548'
          : '#3fa34d'
        : isHouseBuild && !occupied
        ? '#559e59'
        : occupied
        ? 'rgba(139, 104, 62, 0.52)'
        : 'rgba(244, 238, 220, 0.85)';
      if (!occupied && !isSnapped) {
        ctx.setLineDash([7, 5]);
      }
      roundRectPath(ctx, k.x, k.y, k.w, k.h, 12);
      ctx.stroke();
      ctx.setLineDash([]);

      // Tiny decorative wooden corner garden markers
      const corners = [
        [k.x + 6, k.y + 6],
        [k.x + k.w - 6, k.y + 6],
        [k.x + 6, k.y + k.h - 6],
        [k.x + k.w - 6, k.y + k.h - 6],
      ];
      ctx.fillStyle = occupied ? '#9a6b3d' : '#6c9c64';
      for (let c = 0; c < corners.length; c++) {
        ctx.beginPath();
        ctx.arc(corners[c][0], corners[c][1], 2.6, 0, Math.PI * 2);
        ctx.fill();
      }

      // Small entrance driveway paver tab connecting plot front to alley
      ctx.fillStyle = '#ddd0b7';
      roundRectPath(ctx, k.centerX - 13, k.y + k.h - 2, 26, 20, 3);
      ctx.fill();

      // Kavling Number / Owner Name Plaque at front of plot
      const plaqueText = occupied
        ? `${k.code} · ${k.ownerName || 'Terisi'}`
        : `${k.code} · Tersedia`;
      ctx.font = '700 9.2px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      const maxPw = k.w - 6;
      let displayPlaque = plaqueText;
      while (ctx.measureText(displayPlaque).width + 12 > maxPw && displayPlaque.length > 8) {
        displayPlaque = displayPlaque.slice(0, -2) + '…';
      }
      const pw = Math.min(maxPw, ctx.measureText(displayPlaque).width + 12);
      const py = k.y + k.h - 13;

      ctx.fillStyle = occupied
        ? 'rgba(255, 245, 218, 0.96)'
        : isSnapped
        ? 'rgba(54, 128, 62, 0.96)'
        : 'rgba(251, 246, 234, 0.92)';
      roundRectPath(ctx, k.centerX - pw / 2, py - 8.5, pw, 17, 8.5);
      ctx.fill();
      ctx.strokeStyle = occupied ? '#d49e3c' : isSnapped ? '#b7f0be' : '#94b68c';
      ctx.lineWidth = 1.1;
      ctx.stroke();

      ctx.fillStyle = isSnapped && !occupied ? '#ffffff' : occupied ? '#5c3b10' : '#3a5738';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(displayPlaque, k.centerX, py);
    }

    ctx.restore();
  }

  function drawClusterGate(ctx, time) {
    const g = W.HOUSING_CLUSTER.gate;
    ctx.save();
    ctx.translate(g.x, g.y);

    // Subtle ground shadows for twin timber-glass columns
    ctx.fillStyle = 'rgba(38, 44, 34, 0.22)';
    ctx.beginPath();
    ctx.ellipse(-60, 7, 13, 5.5, 0, 0, Math.PI * 2);
    ctx.ellipse(60, 7, 13, 5.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Modern Warm Timber + Glass Pillars
    [-66, 52].forEach((px) => {
      ctx.fillStyle = '#7e502a';
      roundRectPath(ctx, px, -54, 14, 60, 4);
      ctx.fill();
      ctx.strokeStyle = '#533217';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Frosted glass architectural accent strip
      ctx.fillStyle = '#d7ecef';
      ctx.fillRect(px + 4, -46, 6, 38);

      // Warm wall sconce glow on inner pillar
      const pulse = 0.8 + Math.sin(time * 2.8) * 0.14;
      ctx.fillStyle = `rgba(255, 224, 126, ${pulse})`;
      ctx.beginPath();
      ctx.arc(px + 7, -26, 3.2, 0, Math.PI * 2);
      ctx.fill();
    });

    // Green Eco Portal Barrier Arm (portal hijau) gently open on left side
    ctx.save();
    ctx.translate(-52, -16);
    ctx.fillStyle = '#4e8a52';
    roundRectPath(ctx, -4, -6, 10, 22, 3);
    ctx.fill();
    ctx.rotate(-0.55); // Raised friendly welcome angle so citizens walk through easily!
    ctx.fillStyle = '#59a65d';
    roundRectPath(ctx, 2, -3.5, 58, 7, 3.5);
    ctx.fill();
    ctx.fillStyle = '#f8f5ec';
    ctx.fillRect(14, -3.5, 8, 7);
    ctx.fillRect(34, -3.5, 8, 7);
    ctx.strokeStyle = '#2f5e32';
    ctx.lineWidth = 1.1;
    roundRectPath(ctx, 2, -3.5, 58, 7, 3.5);
    ctx.stroke();
    ctx.restore();

    // Sleek Wood-Glass Overhanging Arch Canopy
    ctx.fillStyle = '#5c4632';
    roundRectPath(ctx, -78, -64, 156, 14, 6);
    ctx.fill();
    ctx.fillStyle = 'rgba(218, 239, 240, 0.72)';
    roundRectPath(ctx, -68, -53, 136, 7, 3);
    ctx.fill();

    // Crisp Signboard: '🏡 Komplek Hunian Warga'
    ctx.fillStyle = '#fbf5e6';
    roundRectPath(ctx, -74, -82, 148, 22, 9);
    ctx.fill();
    ctx.strokeStyle = '#5f8d63';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '800 10.2px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#334d32';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏡 Komplek Hunian Warga', 0, -71);

    ctx.restore();
  }

  function drawGuardPost(ctx, time) {
    const gp = W.HOUSING_CLUSTER.guardPost;
    ctx.save();
    ctx.translate(gp.x, gp.y);

    // Shadow
    ctx.fillStyle = 'rgba(38, 46, 34, 0.22)';
    roundRectPath(ctx, -32, 0, 66, 22, 8);
    ctx.fill();

    // Timber base plinth
    ctx.fillStyle = '#9c6c3f';
    roundRectPath(ctx, -28, 6, 56, 12, 4);
    ctx.fill();

    // Stucco & timber security cabin
    ctx.fillStyle = '#f6efe0';
    roundRectPath(ctx, -26, -24, 52, 34, 5);
    ctx.fill();
    ctx.strokeStyle = '#754b27';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Cozy amber glass lookout window
    const glow = 0.88 + Math.sin(time * 2.4) * 0.1;
    ctx.fillStyle = `rgba(255, 226, 140, ${glow})`;
    roundRectPath(ctx, -19, -16, 38, 16, 3);
    ctx.fill();
    ctx.strokeStyle = '#5c3c20';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Wooden desk counter sill
    ctx.fillStyle = '#8b5830';
    roundRectPath(ctx, -21, -1, 42, 5, 2);
    ctx.fill();

    // Sage-green overhanging eco roof
    ctx.fillStyle = '#4e784c';
    roundRectPath(ctx, -32, -33, 64, 11, 5);
    ctx.fill();
    ctx.strokeStyle = '#355434';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Label tag '🛡️ Pos Ronda'
    ctx.font = '700 9px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const label = '🛡️ Pos Ronda';
    const tw = ctx.measureText(label).width + 12;
    ctx.fillStyle = 'rgba(251, 246, 234, 0.96)';
    roundRectPath(ctx, -tw / 2, 20, tw, 15, 7.5);
    ctx.fill();
    ctx.strokeStyle = '#5f8d63';
    ctx.lineWidth = 1.1;
    ctx.stroke();
    ctx.fillStyle = '#364d35';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 27.5);

    ctx.restore();
  }

  function drawClusterDirectoryBoard(ctx, time, isHovered, occupiedCount, totalCount) {
    const db = W.HOUSING_CLUSTER.directoryBoard;
    ctx.save();
    ctx.translate(db.x, db.y);

    // Shadow
    ctx.fillStyle = 'rgba(38, 46, 34, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 26, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Twin timber support legs
    ctx.fillStyle = '#704725';
    roundRectPath(ctx, -22, -6, 6, 22, 2);
    roundRectPath(ctx, 16, -6, 6, 22, 2);
    ctx.fill();

    // Framed directory board housing
    ctx.fillStyle = '#8a5930';
    roundRectPath(ctx, -30, -44, 60, 40, 7);
    ctx.fill();
    ctx.strokeStyle = isHovered ? '#f2b43b' : '#583619';
    ctx.lineWidth = isHovered ? 2.4 : 1.6;
    ctx.stroke();

    // Cream glass-covered directory map face
    ctx.fillStyle = '#fbf6e9';
    roundRectPath(ctx, -25, -39, 50, 30, 4);
    ctx.fill();

    // Mini colored block grid illustration inside board
    const miniColors = ['#7cb077', '#e5b85c', '#7cb077', '#7cb077'];
    for (let r = 0; r < 2; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = r * 4 + c < occupiedCount ? '#e5b248' : '#a8c89d';
        ctx.fillRect(-20 + c * 10.5, -34 + r * 11, 8, 8);
      }
    }

    // Small wooden protective roof cap
    ctx.fillStyle = '#4e784c';
    roundRectPath(ctx, -34, -49, 68, 7, 3.5);
    ctx.fill();

    // Occupancy badge below board
    const tag = `📋 Direktori (${occupiedCount}/${totalCount})`;
    ctx.font = '700 9px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const tw = ctx.measureText(tag).width + 12;
    ctx.fillStyle = isHovered ? '#fff2cf' : 'rgba(251, 246, 234, 0.96)';
    roundRectPath(ctx, -tw / 2, 18, tw, 16, 8);
    ctx.fill();
    ctx.strokeStyle = isHovered ? '#e2a332' : '#8a5930';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#3f2e1d';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(tag, 0, 26);

    if (isHovered) {
      const hint = '📋 Buka Direktori Warga Komplek';
      ctx.font = '800 10.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      const hw = ctx.measureText(hint).width + 18;
      ctx.fillStyle = 'rgba(68, 108, 66, 0.96)';
      roundRectPath(ctx, -hw / 2, -72, hw, 21, 10.5);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(hint, 0, -61.5);
    }

    ctx.restore();
  }

  function drawGround(ctx, time, buildMode) {
    // Base lush sage-meadow canvas
    ctx.fillStyle = '#92b386';
    ctx.fillRect(0, 0, W.WORLD_WIDTH, W.WORLD_HEIGHT);

    // Subtle organic meadow variation patches
    for (let i = 0; i < grassPatches.length; i++) {
      const p = grassPatches[i];
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.rx, p.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Eco-Plots (Kavling Lahan Hijau Kosong)
    for (let i = 0; i < W.PLOTS.length; i++) {
      const plot = W.PLOTS[i];
      ctx.save();
      roundRectPath(ctx, plot.x, plot.y, plot.w, plot.h, 22);
      ctx.fillStyle = buildMode
        ? 'rgba(176, 206, 156, 0.52)'
        : 'rgba(167, 197, 150, 0.36)';
      ctx.fill();

      ctx.setLineDash([10, 8]);
      ctx.lineWidth = buildMode ? 2.5 : 1.8;
      ctx.strokeStyle = buildMode
        ? 'rgba(248, 242, 225, 0.85)'
        : 'rgba(237, 230, 210, 0.58)';
      ctx.stroke();
      ctx.setLineDash([]);

      // Tiny wooden corner stakes
      const corners = [
        [plot.x + 8, plot.y + 8],
        [plot.x + plot.w - 8, plot.y + 8],
        [plot.x + 8, plot.y + plot.h - 8],
        [plot.x + plot.w - 8, plot.y + plot.h - 8],
      ];
      for (let c = 0; c < corners.length; c++) {
        const [cx, cy] = corners[c];
        ctx.fillStyle = 'rgba(60, 44, 24, 0.2)';
        ctx.beginPath();
        ctx.ellipse(cx + 1, cy + 3, 5, 3, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#9b6e45';
        ctx.beginPath();
        ctx.arc(cx, cy, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d4aa78';
        ctx.beginPath();
        ctx.arc(cx - 1, cy - 1, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Soft plot name tag
      ctx.font = '600 12px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      ctx.fillStyle = buildMode
        ? 'rgba(58, 76, 52, 0.85)'
        : 'rgba(64, 84, 58, 0.62)';
      ctx.textAlign = 'left';
      ctx.fillText(plot.name, plot.x + 20, plot.y + 24);
      ctx.restore();
    }

    // Structured Neighborhood Paving-Block Roads & Main Asphalt Road
    drawNeighborhoodRoads(ctx);
    drawMainRoad(ctx);

    // Subtle organic garden stepping stones connecting pond & outer garden spurs
    for (let i = 0; i < defaultPathStones.length; i++) {
      const s = defaultPathStones[i];
      if (W.isOnBuiltInRoad && W.isOnBuiltInRoad(s.x, s.y, 4)) continue;
      ctx.save();
      ctx.translate(s.x, s.y);
      ctx.rotate(s.rot);
      ctx.fillStyle = 'rgba(72, 66, 48, 0.16)';
      ctx.beginPath();
      ctx.ellipse(1.5, 2.5, s.rx, s.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = s.shade;
      ctx.beginPath();
      ctx.ellipse(0, 0, s.rx, s.ry, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 252, 244, 0.4)';
      ctx.beginPath();
      ctx.ellipse(-3, -2, s.rx * 0.55, s.ry * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Central Alun-Alun Taman Rumput
    const pz = W.PLAZA;
    ctx.save();
    // Outer lush lawn ring
    ctx.fillStyle = '#87ab7c';
    ctx.beginPath();
    ctx.arc(pz.x, pz.y, pz.outerRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(236, 229, 210, 0.55)';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Inner stone plaza
    ctx.fillStyle = 'rgba(70, 62, 46, 0.14)';
    ctx.beginPath();
    ctx.arc(pz.x, pz.y + 4, pz.stoneRadius + 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ebe2cf';
    ctx.beginPath();
    ctx.arc(pz.x, pz.y, pz.stoneRadius, 0, Math.PI * 2);
    ctx.fill();

    // Decorative stone rings & subtle radial seams
    ctx.strokeStyle = '#d7cab0';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(pz.x, pz.y, pz.stoneRadius - 10, 0, Math.PI * 2);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(pz.x, pz.y, 46, 0, Math.PI * 2);
    ctx.fillStyle = '#e2d6be';
    ctx.fill();
    ctx.stroke();

    for (let a = 0; a < 8; a++) {
      const ang = (a * Math.PI) / 4;
      ctx.beginPath();
      ctx.moveTo(pz.x + Math.cos(ang) * 46, pz.y + Math.sin(ang) * 46);
      ctx.lineTo(pz.x + Math.cos(ang) * (pz.stoneRadius - 10), pz.y + Math.sin(ang) * (pz.stoneRadius - 10));
      ctx.strokeStyle = 'rgba(186, 171, 145, 0.45)';
      ctx.lineWidth = 1.4;
      ctx.stroke();
    }

    // Center botanical leaf medallion
    ctx.fillStyle = '#88a982';
    ctx.beginPath();
    ctx.arc(pz.x, pz.y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f5f0e6';
    ctx.beginPath();
    ctx.ellipse(pz.x - 4, pz.y, 8, 4.5, -0.5, 0, Math.PI * 2);
    ctx.ellipse(pz.x + 4, pz.y, 8, 4.5, 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Corner flower arcs around Alun-alun outer lawn
    const flowerAngles = [Math.PI * 0.25, Math.PI * 0.75, Math.PI * 1.25, Math.PI * 1.75];
    for (let i = 0; i < flowerAngles.length; i++) {
      const baseA = flowerAngles[i];
      for (let j = -2; j <= 2; j++) {
        const ang = baseA + j * 0.14;
        const fx = pz.x + Math.cos(ang) * 168;
        const fy = pz.y + Math.sin(ang) * 168;
        const sway = Math.sin(time * 2.1 + i + j) * 1.6;
        ctx.fillStyle = '#628a5d';
        ctx.beginPath();
        ctx.arc(fx, fy + 2, 7.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = j % 2 === 0 ? '#f6d272' : '#f4ece0';
        ctx.beginPath();
        ctx.arc(fx + sway, fy - 1, 3.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    ctx.restore();

    // Gently swaying grass tufts & wildflowers
    for (let i = 0; i < grassTufts.length; i++) {
      const g = grassTufts[i];
      const sway = Math.sin(time * 1.9 + g.phase) * 2.1;
      ctx.strokeStyle = 'rgba(84, 118, 76, 0.55)';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(g.x, g.y);
      ctx.quadraticCurveTo(g.x - 2, g.y - g.size * 0.6, g.x - 3 + sway, g.y - g.size);
      ctx.moveTo(g.x + 2, g.y);
      ctx.quadraticCurveTo(g.x + 3, g.y - g.size * 0.6, g.x + 4 + sway, g.y - g.size * 0.9);
      ctx.stroke();

      if (g.hasFlower) {
        ctx.fillStyle = g.flowerColor;
        ctx.beginPath();
        ctx.arc(g.x + 1 + sway, g.y - g.size - 1, 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  function drawPondAndBridge(ctx, time) {
    ctx.save();
    // Sandy pebble bank rim
    ctx.fillStyle = '#dcd2bc';
    for (let i = 0; i < W.POND.ellipses.length; i++) {
      const e = W.POND.ellipses[i];
      ctx.beginPath();
      ctx.ellipse(e.cx, e.cy, e.rx + 12, e.ry + 12, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer shallow clear blue-teal water
    ctx.fillStyle = '#73c4cc';
    for (let i = 0; i < W.POND.ellipses.length; i++) {
      const e = W.POND.ellipses[i];
      ctx.beginPath();
      ctx.ellipse(e.cx, e.cy, e.rx, e.ry, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Deeper crystal blue water interior
    ctx.fillStyle = '#55aab8';
    for (let i = 0; i < W.POND.ellipses.length; i++) {
      const e = W.POND.ellipses[i];
      ctx.beginPath();
      ctx.ellipse(e.cx, e.cy + 4, e.rx * 0.84, e.ry * 0.82, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Gentle animated water ripples
    ctx.strokeStyle = 'rgba(218, 246, 249, 0.42)';
    ctx.lineWidth = 1.6;
    const rippleCenters = [
      { x: 1300, y: 635, offset: 0 },
      { x: 1425, y: 765, offset: 1.7 },
      { x: 1350, y: 735, offset: 3.1 },
    ];
    for (let i = 0; i < rippleCenters.length; i++) {
      const rc = rippleCenters[i];
      const prog = ((time * 0.35 + rc.offset) % 1);
      ctx.globalAlpha = (1 - prog) * 0.55;
      ctx.beginPath();
      ctx.ellipse(rc.x, rc.y, 12 + prog * 36, 7 + prog * 21, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;

    // Shimmering sunlight glints on water
    ctx.fillStyle = 'rgba(255, 252, 238, 0.55)';
    for (let i = 0; i < 6; i++) {
      const sx = 1260 + i * 42 + Math.sin(time * 1.2 + i) * 6;
      const sy = 620 + (i % 3) * 62;
      if (!W.isInPondWater(sx, sy, -16)) continue;
      const w = 10 + Math.sin(time * 2.4 + i * 1.5) * 5;
      ctx.beginPath();
      ctx.ellipse(sx, sy, Math.max(3, w), 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // Swimming koi fish
    for (let i = 0; i < koiFish.length; i++) {
      const k = koiFish[i];
      const ang = time * k.speed + k.phase;
      const fx = k.cx + Math.cos(ang) * k.rx;
      const fy = k.cy + Math.sin(ang) * k.ry;
      const vx = -Math.sin(ang) * k.rx * k.speed;
      const vy = Math.cos(ang) * k.ry * k.speed;
      const heading = Math.atan2(vy, vx);
      const tailWag = Math.sin(time * 7 + i * 2) * 0.35;

      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(heading);
      // Fish shadow
      ctx.fillStyle = 'rgba(25, 65, 75, 0.25)';
      ctx.beginPath();
      ctx.ellipse(0, 4, 9, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Tail
      ctx.fillStyle = k.accent;
      ctx.beginPath();
      ctx.moveTo(-7, 0);
      ctx.lineTo(-14, -4 + tailWag * 5);
      ctx.lineTo(-14, 4 + tailWag * 5);
      ctx.closePath();
      ctx.fill();
      // Body
      ctx.fillStyle = k.color;
      ctx.beginPath();
      ctx.ellipse(0, 0, 8.5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = k.accent;
      ctx.beginPath();
      ctx.ellipse(2, 0, 3.2, 2.2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // Animated dark underwater fish shadows swimming near the fishing pier!
    for (let i = 0; i < fishShadows.length; i++) {
      const fs = fishShadows[i];
      const ang = time * fs.speed + fs.phase;
      const fx = fs.cx + Math.cos(ang) * fs.rx;
      const fy = fs.cy + Math.sin(ang) * fs.ry;
      const vx = -Math.sin(ang) * fs.rx * fs.speed;
      const vy = Math.cos(ang) * fs.ry * fs.speed;
      const heading = Math.atan2(vy, vx);
      const wag = Math.sin(time * 6.5 + i * 1.7) * 4;

      ctx.save();
      ctx.translate(fx, fy);
      ctx.rotate(heading);
      ctx.scale(fs.size, fs.size);
      ctx.fillStyle = 'rgba(20, 62, 74, 0.34)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 12, 4.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-10, 0);
      ctx.lineTo(-18, -4.5 + wag * 0.5);
      ctx.lineTo(-18, 4.5 + wag * 0.5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }

    // Floating lily pads & lotus flowers
    for (let i = 0; i < lilyPads.length; i++) {
      const l = lilyPads[i];
      const bobX = Math.sin(time * 1.3 + i) * 1.8;
      const bobY = Math.cos(time * 1.1 + i * 2) * 1.2;
      ctx.save();
      ctx.translate(l.x + bobX, l.y + bobY);
      ctx.rotate(l.angle + Math.sin(time * 0.8 + i) * 0.08);
      ctx.fillStyle = '#5c9665';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, l.r, 0.25, Math.PI * 2 - 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#74ad79';
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, l.r * 0.72, 0.35, Math.PI * 2 - 0.35);
      ctx.closePath();
      ctx.fill();

      if (l.lotus) {
        ctx.fillStyle = '#f8e0de';
        for (let p = 0; p < 5; p++) {
          const pa = (p * Math.PI * 2) / 5;
          ctx.beginPath();
          ctx.ellipse(Math.cos(pa) * 4, Math.sin(pa) * 4, 4.2, 2.3, pa, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = '#f6c85f';
        ctx.beginPath();
        ctx.arc(0, 0, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    // Warm Wooden Bridge across the pond
    const br = W.BRIDGE;
    // Shadow on water
    ctx.fillStyle = 'rgba(26, 62, 72, 0.28)';
    roundRectPath(ctx, br.x + 4, br.y + 10, br.w, br.h, 8);
    ctx.fill();

    // Bridge base timber frame
    ctx.fillStyle = '#7e522d';
    roundRectPath(ctx, br.x, br.y - 2, br.w, br.h + 4, 8);
    ctx.fill();

    // Individual wooden planks with gentle arch highlight in center
    const plankCount = 16;
    const plankW = br.w / plankCount;
    for (let i = 0; i < plankCount; i++) {
      const px = br.x + i * plankW;
      const arch = Math.sin((i / (plankCount - 1)) * Math.PI);
      ctx.fillStyle = i % 2 === 0 ? '#be8b5b' : '#b27f50';
      roundRectPath(ctx, px + 1.5, br.y + 3 - arch * 2, plankW - 3, br.h - 6, 3);
      ctx.fill();
    }

    // Bridge side handrails & warm timber posts
    const postPositions = [0, 0.25, 0.5, 0.75, 1];
    ctx.fillStyle = '#8b5a2f';
    ctx.fillRect(br.x, br.y - 4, br.w, 6);
    ctx.fillRect(br.x, br.y + br.h - 2, br.w, 6);
    ctx.fillStyle = '#d29f6d';
    ctx.fillRect(br.x, br.y - 4, br.w, 2.5);
    ctx.fillRect(br.x, br.y + br.h - 2, br.w, 2.5);

    for (let i = 0; i < postPositions.length; i++) {
      const px = br.x + postPositions[i] * (br.w - 10) + 5;
      for (const py of [br.y - 2, br.y + br.h + 1]) {
        ctx.fillStyle = '#6c4322';
        ctx.beginPath();
        ctx.arc(px, py, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#d4a372';
        ctx.beginPath();
        ctx.arc(px - 1, py - 1, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Dermaga Kayu Mancing (Wooden Fishing Pier jutting into the fishing lagoon)
    const pr = W.FISHING_PIER;
    // Water reflection shadow beneath pier
    ctx.fillStyle = 'rgba(22, 58, 68, 0.3)';
    roundRectPath(ctx, pr.x + 4, pr.y + 8, pr.w, pr.h, 8);
    ctx.fill();

    // Timber pilings in water
    ctx.fillStyle = '#5f3a1c';
    for (const [px, py] of [
      [pr.x + 8, pr.y + 4],
      [pr.x + pr.w - 8, pr.y + 4],
      [pr.x + 8, pr.y + pr.h - 6],
      [pr.x + pr.w - 8, pr.y + pr.h - 6],
    ]) {
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pier base timber frame
    ctx.fillStyle = '#7b4f2a';
    roundRectPath(ctx, pr.x, pr.y, pr.w, pr.h, 7);
    ctx.fill();

    // Horizontal warm cedar deck planks
    const pPlanks = 7;
    const pPlankH = (pr.h - 6) / pPlanks;
    for (let i = 0; i < pPlanks; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#bd8a5a' : '#b07d4d';
      roundRectPath(ctx, pr.x + 4, pr.y + 3 + i * pPlankH, pr.w - 8, pPlankH - 2, 2.5);
      ctx.fill();
    }

    // Left & Right wooden railings (front water edge stays open for casting!)
    ctx.fillStyle = '#85552c';
    ctx.fillRect(pr.x - 2, pr.y + 2, 6, pr.h - 4);
    ctx.fillRect(pr.x + pr.w - 4, pr.y + 2, 6, pr.h - 4);
    ctx.fillStyle = '#d3a271';
    ctx.fillRect(pr.x - 1, pr.y + 2, 2.5, pr.h - 4);
    ctx.fillRect(pr.x + pr.w - 3, pr.y + 2, 2.5, pr.h - 4);

    // Bait bucket (Ember Umpan) on front-left corner of pier
    const bx = pr.x + 18;
    const by = pr.y + 18;
    ctx.fillStyle = 'rgba(48, 36, 20, 0.25)';
    ctx.beginPath();
    ctx.ellipse(bx + 1, by + 5, 9, 5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5c7f99';
    ctx.beginPath();
    ctx.ellipse(bx, by, 8, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#8db4cf';
    ctx.beginPath();
    ctx.ellipse(bx, by - 2.5, 7, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#6ec1c8';
    ctx.beginPath();
    ctx.ellipse(bx, by - 2.5, 5, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();
    // Tiny red/white spare bobber beside bucket
    ctx.fillStyle = '#e05344';
    ctx.beginPath();
    ctx.arc(bx + 10, by + 3, 2.8, 0, Math.PI * 2);
    ctx.fill();

    // Warm Hanging Fishing Lantern Post on front-right corner of pier
    const lx = pr.x + pr.w - 10;
    const ly = pr.y + 8;
    ctx.fillStyle = '#5c381a';
    ctx.fillRect(lx - 2.5, ly - 32, 5, 34);
    ctx.fillRect(lx - 14, ly - 32, 16, 4);
    const swayL = Math.sin(time * 2.4) * 1.4;
    ctx.strokeStyle = '#4a2e16';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(lx - 12, ly - 28);
    ctx.lineTo(lx - 12 + swayL, ly - 20);
    ctx.stroke();
    ctx.fillStyle = '#473322';
    roundRectPath(ctx, lx - 17 + swayL, ly - 21, 10, 12, 3);
    ctx.fill();
    ctx.fillStyle = '#ffd36e';
    roundRectPath(ctx, lx - 15 + swayL, ly - 19, 6, 8, 2);
    ctx.fill();

    // Cozy pier label on south entry edge
    ctx.font = '700 10px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#59371b';
    ctx.textAlign = 'center';
    ctx.fillText('🎣 DERMAGA MANCING', pr.x + pr.w / 2, pr.y + pr.h - 7);

    ctx.restore();
  }

  function drawFishingBoard(ctx, time, hovered) {
    const fb = W.FISHING_BOARD;
    ctx.save();
    ctx.translate(fb.x, fb.y);

    // Shadow
    ctx.fillStyle = 'rgba(42, 48, 34, 0.22)';
    ctx.beginPath();
    ctx.ellipse(2, 16, 26, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    if (hovered) {
      ctx.strokeStyle = '#f6b93b';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(0, 13, 30, 12, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Wooden posts
    ctx.fillStyle = '#6c4221';
    ctx.fillRect(-16, -2, 6, 18);
    ctx.fillRect(10, -2, 6, 18);

    // Board frame
    ctx.fillStyle = '#8b5a2f';
    roundRectPath(ctx, -24, -30, 48, 32, 5);
    ctx.fill();
    ctx.fillStyle = '#f5ecd8';
    roundRectPath(ctx, -20, -26, 40, 24, 3);
    ctx.fill();

    // Mini trophy & leaderboard lines
    ctx.font = '13px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏆', 0, -18);
    ctx.fillStyle = '#9e8969';
    ctx.fillRect(-13, -10, 26, 2);
    ctx.fillRect(-10, -6, 20, 2);

    // Floating interactive label
    const badgeY = -44 + Math.sin(time * 2.4 + 1) * 2;
    const text = hovered ? '🏆 Buka Klasemen Mancing' : '🏆 Klasemen Mancing';
    ctx.font = '700 10.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const tw = ctx.measureText(text).width + 16;
    ctx.fillStyle = hovered ? '#5a7f56' : 'rgba(251, 246, 234, 0.94)';
    roundRectPath(ctx, -tw / 2, badgeY - 10, tw, 20, 10);
    ctx.fill();
    ctx.strokeStyle = hovered ? '#3e5e3b' : '#c9b899';
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.fillStyle = hovered ? '#ffffff' : '#4a3b2b';
    ctx.fillText(text, 0, badgeY);

    ctx.restore();
  }

  function drawFishingAction(ctx, player, time) {
    const f = player.fishing;
    if (!f || f.state === 'idle') return;
    const isStrike = f.state === 'strike';

    // Rod starts near player's right hand and arches toward bobber
    const handX = player.x + 9;
    const handY = player.y - 12;
    const dx = f.bobberX - handX;
    const dy = f.bobberY - handY;
    const angle = Math.atan2(dy, dx);
    const rodLen = 34;
    const bend = isStrike ? Math.sin(time * 26) * 5 : Math.sin(time * 2.5) * 1.5;
    const tipX = handX + Math.cos(angle) * rodLen;
    const tipY = handY + Math.sin(angle) * rodLen - 14 + bend;

    ctx.save();
    // Bamboo fishing rod
    ctx.strokeStyle = '#7c5329';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(handX, handY);
    ctx.quadraticCurveTo(
      (handX + tipX) / 2,
      (handY + tipY) / 2 - 8,
      tipX,
      tipY
    );
    ctx.stroke();

    // Delicate fishing line stretching to bobber
    const bobDip = isStrike
      ? Math.sin(time * 24) * 5 + 3
      : Math.sin(time * 3.4 + player.x) * 2;
    const bx = f.bobberX + (isStrike ? Math.cos(time * 20) * 3 : 0);
    const by = f.bobberY + bobDip;

    ctx.strokeStyle = 'rgba(255, 253, 245, 0.85)';
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(tipX, tipY);
    ctx.quadraticCurveTo(
      (tipX + bx) / 2,
      (tipY + by) / 2 + (isStrike ? 4 : 14),
      bx,
      by
    );
    ctx.stroke();

    // Expanding water ripple rings around bobber
    const ringCount = isStrike ? 3 : 2;
    for (let i = 0; i < ringCount; i++) {
      const p = ((time * (isStrike ? 1.8 : 0.7) + i / ringCount) % 1);
      const rx = 5 + p * (isStrike ? 26 : 16);
      const ry = rx * 0.55;
      ctx.strokeStyle = isStrike
        ? `rgba(255, 252, 236, ${(1 - p) * 0.9})`
        : `rgba(224, 248, 252, ${(1 - p) * 0.6})`;
      ctx.lineWidth = isStrike ? 2.2 : 1.4;
      ctx.beginPath();
      ctx.ellipse(bx, f.bobberY + 2, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Little red-and-white bobber (pelampung kecil)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(bx, by + 1, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e04f3e';
    ctx.beginPath();
    ctx.arc(bx, by - 1, 4.5, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#6c2b22';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(bx, by, 4.5, 0, Math.PI * 2);
    ctx.stroke();

    // Splash droplets during STRIKE!
    if (isStrike) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.92)';
      for (let d = 0; d < 5; d++) {
        const da = (d / 5) * Math.PI * 2 + time * 8;
        const dist = 8 + Math.abs(Math.sin(time * 14 + d)) * 10;
        ctx.beginPath();
        ctx.arc(bx + Math.cos(da) * dist, f.bobberY - Math.abs(Math.sin(da)) * 10, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }

      // Vibrant bouncing "❗ STRIKE!" sign above the angler's head!
      const bounce = Math.abs(Math.sin(time * 12)) * 7;
      const sy = player.y - 66 - bounce;
      const txt = '❗ STRIKE!';
      ctx.font = '800 13.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      const tw = ctx.measureText(txt).width + 22;

      ctx.fillStyle = '#d94536';
      roundRectPath(ctx, player.x - tw / 2, sy - 14, tw, 28, 14);
      ctx.fill();
      ctx.strokeStyle = '#ffe082';
      ctx.lineWidth = 2.2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(txt, player.x, sy);
    }

    ctx.restore();
  }

  function drawPendopoFloor(ctx) {
    const p = W.PENDOPO;
    ctx.save();
    // Outer stone foundation & soft shadow
    ctx.fillStyle = 'rgba(52, 48, 36, 0.18)';
    roundRectPath(ctx, p.x - 4, p.y + 6, p.w + 12, p.h + 10, 18);
    ctx.fill();

    ctx.fillStyle = '#ded4be';
    roundRectPath(ctx, p.x - 6, p.y - 6, p.w + 12, p.h + 12, 16);
    ctx.fill();

    // Warm honey timber deck floor
    ctx.fillStyle = '#c49668';
    roundRectPath(ctx, p.x, p.y, p.w, p.h, 12);
    ctx.fill();

    // Wood deck plank lines
    ctx.strokeStyle = 'rgba(128, 86, 48, 0.25)';
    ctx.lineWidth = 1.2;
    for (let y = p.y + 18; y < p.y + p.h; y += 18) {
      ctx.beginPath();
      ctx.moveTo(p.x + 6, y);
      ctx.lineTo(p.x + p.w - 6, y);
      ctx.stroke();
    }

    // Cozy woven sage-cream mat in center
    ctx.fillStyle = '#efe7d5';
    roundRectPath(ctx, p.x + 34, p.y + 34, p.w - 68, p.h - 68, 12);
    ctx.fill();
    ctx.strokeStyle = '#9bb592';
    ctx.lineWidth = 3;
    roundRectPath(ctx, p.x + 40, p.y + 40, p.w - 80, p.h - 80, 9);
    ctx.stroke();

    // Low wooden gathering coffee table in center
    const tx = p.x + p.w / 2;
    const ty = p.y + p.h / 2;
    ctx.fillStyle = 'rgba(72, 48, 26, 0.2)';
    roundRectPath(ctx, tx - 38, ty - 16, 80, 40, 10);
    ctx.fill();
    ctx.fillStyle = '#9b673c';
    roundRectPath(ctx, tx - 40, ty - 20, 80, 38, 9);
    ctx.fill();
    ctx.fillStyle = '#b98253';
    roundRectPath(ctx, tx - 37, ty - 18, 74, 32, 7);
    ctx.fill();

    // Warm ceramic teapot & 3 coffee mugs on pendopo table
    ctx.fillStyle = '#f5efe2';
    ctx.beginPath();
    ctx.arc(tx - 10, ty - 3, 6.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#c86d4b';
    ctx.beginPath();
    ctx.arc(tx - 10, ty - 3, 3, 0, Math.PI * 2);
    ctx.fill();
    for (const [mx, my] of [[tx + 12, ty - 8], [tx + 18, ty + 4], [tx - 24, ty + 5]]) {
      ctx.fillStyle = '#fbf7ee';
      ctx.beginPath();
      ctx.arc(mx, my, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6b4226';
      ctx.beginPath();
      ctx.arc(mx, my, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Soft floor cushions around table
    const cushions = [
      { x: tx - 56, y: ty - 2, c: '#7b9c74' },
      { x: tx + 56, y: ty - 2, c: '#d1835e' },
      { x: tx - 18, y: ty - 38, c: '#d9a452' },
      { x: tx + 22, y: ty - 38, c: '#7b9c74' },
      { x: tx - 18, y: ty + 36, c: '#d1835e' },
      { x: tx + 22, y: ty + 36, c: '#d9a452' },
    ];
    for (let i = 0; i < cushions.length; i++) {
      const cu = cushions[i];
      ctx.fillStyle = 'rgba(60, 44, 24, 0.16)';
      ctx.beginPath();
      ctx.arc(cu.x + 1, cu.y + 3, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = cu.c;
      ctx.beginPath();
      ctx.arc(cu.x, cu.y, 10.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 250, 240, 0.25)';
      ctx.beginPath();
      ctx.arc(cu.x - 2, cu.y - 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Corner timber pillars
    const pillars = [
      [p.x + 14, p.y + 14],
      [p.x + p.w - 14, p.y + 14],
      [p.x + 14, p.y + p.h - 14],
      [p.x + p.w - 14, p.y + p.h - 14],
    ];
    for (let i = 0; i < pillars.length; i++) {
      const [px, py] = pillars[i];
      ctx.fillStyle = '#6c4221';
      ctx.beginPath();
      ctx.arc(px, py, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a36e42';
      ctx.beginPath();
      ctx.arc(px - 1, py - 1, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Subtle label on front deck edge
    ctx.font = '700 11px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#6a4526';
    ctx.textAlign = 'center';
    ctx.fillText('PENDOPO HARMONI', tx, p.y + p.h - 8);
    ctx.restore();
  }

  function drawPendopoRoofOverlay(ctx, me) {
    const p = W.PENDOPO;
    const playerInside =
      me &&
      me.x >= p.x - 16 &&
      me.x <= p.x + p.w + 16 &&
      me.y >= p.y - 16 &&
      me.y <= p.y + p.h + 16;

    ctx.save();
    // Fade the canopy gently when local player walks inside so everyone inside stays clearly visible!
    ctx.globalAlpha = playerInside ? 0.28 : 0.72;

    // Modern eco-pendopo pitched timber & translucent skylight roof
    ctx.fillStyle = '#8b5a34';
    roundRectPath(ctx, p.x - 14, p.y - 22, p.w + 28, p.h + 12, 18);
    ctx.fill();

    // Inner glass skylight frame
    ctx.fillStyle = 'rgba(246, 232, 198, 0.75)';
    roundRectPath(ctx, p.x + 16, p.y + 4, p.w - 32, p.h - 40, 10);
    ctx.fill();
    ctx.strokeStyle = '#6f4524';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Timber ridge beams
    ctx.beginPath();
    ctx.moveTo(p.x + 16, p.y + (p.h - 32) / 2);
    ctx.lineTo(p.x + p.w - 16, p.y + (p.h - 32) / 2);
    ctx.moveTo(p.x + p.w / 2, p.y + 4);
    ctx.lineTo(p.x + p.w / 2, p.y + p.h - 36);
    ctx.strokeStyle = '#7b4e2b';
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.restore();
  }

  function drawMadingBoard(ctx, time, hovered, noteCount) {
    const m = W.MADING;
    ctx.save();
    ctx.translate(m.x, m.y);

    // Soft ground shadow
    ctx.fillStyle = 'rgba(48, 42, 30, 0.22)';
    ctx.beginPath();
    ctx.ellipse(2, 22, 42, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hover highlight aura
    if (hovered) {
      ctx.strokeStyle = '#f6b93b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(0, 18, 48, 17, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Wooden legs
    ctx.fillStyle = '#6f4624';
    ctx.fillRect(-30, -2, 8, 26);
    ctx.fillRect(22, -2, 8, 26);

    // Outer wooden board frame
    ctx.fillStyle = '#8b5a2f';
    roundRectPath(ctx, -38, -36, 76, 44, 6);
    ctx.fill();

    // Corkboard interior
    ctx.fillStyle = '#d8b384';
    roundRectPath(ctx, -33, -31, 66, 34, 4);
    ctx.fill();

    // Tiny pinned colorful paper notes
    const notes = [
      { x: -27, y: -26, w: 15, h: 12, c: '#fbf5e6', pin: '#c86d4b' },
      { x: -8, y: -27, w: 16, h: 13, c: '#fef1cc', pin: '#5f8d63' },
      { x: 12, y: -25, w: 15, h: 12, c: '#e8f3e4', pin: '#d99b38' },
      { x: -22, y: -11, w: 17, h: 11, c: '#fceddf', pin: '#4c8e99' },
      { x: 4, y: -11, w: 18, h: 11, c: '#fbf5e6', pin: '#c86d4b' },
    ];
    for (let i = 0; i < notes.length; i++) {
      const n = notes[i];
      ctx.fillStyle = n.c;
      ctx.fillRect(n.x, n.y, n.w, n.h);
      ctx.fillStyle = n.pin;
      ctx.beginPath();
      ctx.arc(n.x + n.w / 2, n.y + 2, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    // Pitched shingle roof overhang
    ctx.fillStyle = '#6a4020';
    ctx.beginPath();
    ctx.moveTo(-45, -34);
    ctx.lineTo(0, -52);
    ctx.lineTo(45, -34);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#996235';
    ctx.beginPath();
    ctx.moveTo(-41, -35);
    ctx.lineTo(0, -49);
    ctx.lineTo(41, -35);
    ctx.closePath();
    ctx.fill();

    // Warm little amber lantern bulb under roof peak
    const pulse = 0.85 + Math.sin(time * 3) * 0.15;
    ctx.fillStyle = `rgba(255, 212, 118, ${0.9 * pulse})`;
    ctx.beginPath();
    ctx.arc(0, -34, 4, 0, Math.PI * 2);
    ctx.fill();

    // Floating interactive badge
    const badgeY = -62 + Math.sin(time * 2.5) * 2.5;
    const text = hovered
      ? `📌 Buka Mading Kampung (${noteCount})`
      : `📌 Mading Kampung`;
    ctx.font = '700 11.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const tw = ctx.measureText(text).width + 18;
    ctx.fillStyle = hovered ? '#5a7f56' : 'rgba(251, 246, 234, 0.94)';
    roundRectPath(ctx, -tw / 2, badgeY - 11, tw, 22, 11);
    ctx.fill();
    ctx.strokeStyle = hovered ? '#3e5e3b' : '#c9b899';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    ctx.fillStyle = hovered ? '#ffffff' : '#4a3b2b';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, badgeY);

    ctx.restore();
  }

  function drawGate(ctx, time) {
    const g = W.GATE;
    ctx.save();
    ctx.translate(g.x, g.y);

    // Pillar shadows
    ctx.fillStyle = 'rgba(48, 42, 28, 0.2)';
    ctx.beginPath();
    ctx.ellipse(-74, 14, 18, 9, 0, 0, Math.PI * 2);
    ctx.ellipse(74, 14, 18, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stone bases
    ctx.fillStyle = '#ddd3bd';
    roundRectPath(ctx, -84, -4, 20, 20, 5);
    ctx.fill();
    roundRectPath(ctx, 64, -4, 20, 20, 5);
    ctx.fill();

    // Timber pillars
    ctx.fillStyle = '#84542d';
    ctx.fillRect(-80, -68, 12, 68);
    ctx.fillRect(68, -68, 12, 68);

    // Modern pergola overhead beam
    ctx.fillStyle = '#6f4422';
    roundRectPath(ctx, -96, -78, 192, 15, 6);
    ctx.fill();
    ctx.fillStyle = '#a36e42';
    roundRectPath(ctx, -92, -76, 184, 6, 3);
    ctx.fill();

    // Climbing green ivy accents
    const vineSway = Math.sin(time * 2) * 1.5;
    ctx.fillStyle = '#5c8c59';
    for (const vx of [-76, -64, 64, 76]) {
      ctx.beginPath();
      ctx.arc(vx + vineSway, -66, 7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center wooden signboard
    ctx.fillStyle = '#fbf5e6';
    roundRectPath(ctx, -60, -84, 120, 24, 8);
    ctx.fill();
    ctx.strokeStyle = '#7e512d';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '800 11px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#486846';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('KAMPUNG HIJAU', 0, -72);

    ctx.restore();
  }

  function drawLushTree(ctx, x, y, scale, shadeIdx, time, withFlowers) {
    const s = scale || 1;
    const sway = Math.sin(time * 1.7 + x * 0.03 + y * 0.02) * 2.6 * s;
    const palettes = [
      ['#567e54', '#6f9a69', '#8cb681'],
      ['#4e7552', '#668f64', '#82ad7c'],
      ['#618756', '#7ba36c', '#98bd85'],
    ];
    const pal = palettes[shadeIdx % palettes.length];

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);

    // Soft ground shadow
    ctx.fillStyle = 'rgba(42, 54, 38, 0.2)';
    ctx.beginPath();
    ctx.ellipse(4, 10, 28, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Flower ring at base for player-planted trees
    if (withFlowers) {
      const fColors = ['#fbf3dc', '#f6c95d', '#ee9e83', '#f5e6cc'];
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI * 2) / 6 + 0.3;
        const fx = Math.cos(a) * 23;
        const fy = 6 + Math.sin(a) * 10;
        ctx.fillStyle = '#5d8a58';
        ctx.beginPath();
        ctx.arc(fx, fy + 1, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = fColors[i % fColors.length];
        ctx.beginPath();
        ctx.arc(fx + sway * 0.25, fy - 1, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Warm wooden trunk
    ctx.fillStyle = '#7b5130';
    roundRectPath(ctx, -6, -18, 12, 26, 4);
    ctx.fill();
    ctx.fillStyle = '#9a6a42';
    ctx.fillRect(-3, -16, 4, 22);

    // Layered swaying canopy
    ctx.fillStyle = pal[0];
    ctx.beginPath();
    ctx.arc(-12 + sway * 0.6, -24, 18, 0, Math.PI * 2);
    ctx.arc(13 + sway * 0.6, -23, 17, 0, Math.PI * 2);
    ctx.arc(0 + sway * 0.7, -34, 21, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = pal[1];
    ctx.beginPath();
    ctx.arc(-8 + sway * 0.85, -30, 15, 0, Math.PI * 2);
    ctx.arc(10 + sway * 0.85, -28, 14, 0, Math.PI * 2);
    ctx.arc(0 + sway, -38, 17, 0, Math.PI * 2);
    ctx.fill();

    // Sunlit crown highlight
    ctx.fillStyle = pal[2];
    ctx.beginPath();
    ctx.arc(-4 + sway * 1.05, -40, 10, 0, Math.PI * 2);
    ctx.arc(7 + sway * 1.05, -35, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  function drawLantern(ctx, x, y, time) {
    ctx.save();
    ctx.translate(x, y);

    // Soft shadow
    ctx.fillStyle = 'rgba(42, 48, 34, 0.22)';
    ctx.beginPath();
    ctx.ellipse(2, 8, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Stone base
    ctx.fillStyle = '#d9ceb8';
    roundRectPath(ctx, -7, 0, 14, 9, 3);
    ctx.fill();

    // Timber-iron slim post
    ctx.fillStyle = '#5a4230';
    ctx.fillRect(-2.5, -26, 5, 28);

    // Lantern housing
    ctx.fillStyle = '#473629';
    roundRectPath(ctx, -8, -39, 16, 15, 4);
    ctx.fill();

    // Warm amber glowing core
    const pulse = 0.88 + Math.sin(time * 3.4 + x * 0.1) * 0.12;
    ctx.fillStyle = `rgba(255, 208, 106, ${pulse})`;
    roundRectPath(ctx, -5.5, -36.5, 11, 10, 2.5);
    ctx.fill();
    ctx.fillStyle = '#fff6d6';
    ctx.beginPath();
    ctx.arc(0, -31.5, 3, 0, Math.PI * 2);
    ctx.fill();

    // Little cap roof
    ctx.fillStyle = '#3f2f23';
    ctx.beginPath();
    ctx.moveTo(-11, -38);
    ctx.lineTo(0, -45);
    ctx.lineTo(11, -38);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  function drawMinimalistHouse(ctx, x, y, label, time) {
    ctx.save();
    ctx.translate(x, y);

    // Soft architectural ground shadow
    ctx.fillStyle = 'rgba(40, 48, 36, 0.22)';
    roundRectPath(ctx, -56, -8, 118, 48, 12);
    ctx.fill();

    // Wooden front deck porch
    ctx.fillStyle = '#b98859';
    roundRectPath(ctx, -48, 12, 96, 24, 6);
    ctx.fill();
    ctx.strokeStyle = 'rgba(116, 76, 40, 0.35)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-46, 20);
    ctx.lineTo(46, 20);
    ctx.moveTo(-46, 28);
    ctx.lineTo(46, 28);
    ctx.stroke();

    // Main walls (Warm cream eco-stucco + cedar timber siding)
    ctx.fillStyle = '#f2ead9';
    roundRectPath(ctx, -52, -32, 104, 48, 6);
    ctx.fill();

    // Right timber accent wall
    ctx.fillStyle = '#a97449';
    roundRectPath(ctx, 14, -32, 38, 48, 4);
    ctx.fill();

    // Large minimalist glass window facade glowing warm amber!
    const glow = 0.9 + Math.sin(time * 2.2 + x * 0.05) * 0.08;
    const winGrad = ctx.createLinearGradient(-44, -24, 6, 10);
    winGrad.addColorStop(0, `rgba(255, 226, 145, ${glow})`);
    winGrad.addColorStop(1, `rgba(246, 180, 74, ${glow})`);
    ctx.fillStyle = winGrad;
    roundRectPath(ctx, -44, -24, 52, 32, 4);
    ctx.fill();

    // Glass reflection & dark timber mullions
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-38, -20);
    ctx.lineTo(-26, 4);
    ctx.moveTo(-12, -20);
    ctx.lineTo(-2, 4);
    ctx.stroke();

    ctx.strokeStyle = '#5b3f29';
    ctx.lineWidth = 2.4;
    roundRectPath(ctx, -44, -24, 52, 32, 4);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-18, -24);
    ctx.lineTo(-18, 8);
    ctx.stroke();

    // Modern timber entrance door with warm glass transom
    ctx.fillStyle = '#734828';
    roundRectPath(ctx, 22, -16, 20, 32, 3);
    ctx.fill();
    ctx.fillStyle = '#ffd680';
    ctx.fillRect(25, -13, 14, 7);
    ctx.fillStyle = '#e7c27d';
    ctx.beginPath();
    ctx.arc(38, 2, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Potted plant on porch
    ctx.fillStyle = '#c5724d';
    ctx.fillRect(-44, 14, 9, 8);
    ctx.fillStyle = '#5c8c58';
    ctx.beginPath();
    ctx.arc(-39.5, 11, 6, 0, Math.PI * 2);
    ctx.fill();

    // Sleek slanted modern eco-roof with overhang
    ctx.fillStyle = '#4e6353';
    ctx.beginPath();
    ctx.moveTo(-60, -28);
    ctx.lineTo(-52, -52);
    ctx.lineTo(54, -44);
    ctx.lineTo(60, -24);
    ctx.closePath();
    ctx.fill();

    // Warm timber fascia trim along roof front edge
    ctx.strokeStyle = '#c89664';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(-60, -28);
    ctx.lineTo(60, -24);
    ctx.stroke();

    // Subtle green-roof planter strip on roof top
    ctx.fillStyle = '#7ca371';
    ctx.beginPath();
    ctx.moveTo(-42, -45);
    ctx.lineTo(38, -39);
    ctx.lineTo(34, -33);
    ctx.lineTo(-44, -38);
    ctx.closePath();
    ctx.fill();

    // Owner label nameplate badge
    if (label) {
      ctx.font = '700 11px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      const tw = Math.min(130, ctx.measureText(label).width + 16);
      ctx.fillStyle = 'rgba(251, 246, 234, 0.94)';
      roundRectPath(ctx, -tw / 2, 35, tw, 20, 10);
      ctx.fill();
      ctx.strokeStyle = '#c9b694';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      ctx.fillStyle = '#4a3b2a';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, 0, 45);
    }

    ctx.restore();
  }

  function drawCoffeeBench(ctx, x, y, time) {
    ctx.save();
    ctx.translate(x, y);

    // Soft ground shadow
    ctx.fillStyle = 'rgba(42, 48, 34, 0.18)';
    ctx.beginPath();
    ctx.ellipse(2, 10, 38, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    // Left & Right wooden benches
    for (const bx of [-31, 20]) {
      ctx.fillStyle = '#734a28';
      ctx.fillRect(bx + 2, 6, 3, 8);
      ctx.fillRect(bx + 7, 6, 3, 8);
      ctx.fillStyle = '#b48051';
      roundRectPath(ctx, bx, -12, 11, 24, 3);
      ctx.fill();
      ctx.fillStyle = '#c99768';
      roundRectPath(ctx, bx + 1, -11, 4, 22, 2);
      ctx.fill();
    }

    // Center round/oval outdoor wooden coffee table
    ctx.fillStyle = '#6f4624';
    ctx.fillRect(-3, 2, 6, 11);
    ctx.fillStyle = '#9a6539';
    ctx.beginPath();
    ctx.ellipse(0, 0, 17, 13, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#be8958';
    ctx.beginPath();
    ctx.ellipse(0, -2, 15, 11, 0, 0, Math.PI * 2);
    ctx.fill();

    // Two ceramic coffee cups with subtle rising steam
    for (const [cx, cy] of [[-5, -4], [6, 0]]) {
      ctx.fillStyle = '#fbf6eb';
      ctx.beginPath();
      ctx.arc(cx, cy, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#6b4022';
      ctx.beginPath();
      ctx.arc(cx, cy, 2, 0, Math.PI * 2);
      ctx.fill();

      // Gentle steam wisp
      const steamOffset = ((time * 12 + cx * 3) % 10);
      ctx.strokeStyle = `rgba(255, 250, 240, ${Math.max(0, 0.65 - steamOffset * 0.06)})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 3 - steamOffset * 0.5);
      ctx.quadraticCurveTo(
        cx + Math.sin(time * 3 + cx) * 2.5,
        cy - 7 - steamOffset * 0.7,
        cx,
        cy - 11 - steamOffset * 0.8
      );
      ctx.stroke();
    }

    ctx.restore();
  }

  function drawGardenBed(ctx, x, y, time) {
    ctx.save();
    ctx.translate(x, y);

    // Shadow
    ctx.fillStyle = 'rgba(42, 48, 34, 0.2)';
    roundRectPath(ctx, -34, -10, 70, 32, 8);
    ctx.fill();

    // Raised cedar wooden planter frame
    ctx.fillStyle = '#8b5b34';
    roundRectPath(ctx, -34, -14, 54, 30, 5);
    ctx.fill();
    ctx.fillStyle = '#a87447';
    roundRectPath(ctx, -32, -16, 50, 26, 4);
    ctx.fill();

    // Rich dark soil bed
    ctx.fillStyle = '#5c4330';
    roundRectPath(ctx, -27, -12, 40, 18, 3);
    ctx.fill();

    // Swaying leafy vegetables & tiny cherry tomatoes
    const sway = Math.sin(time * 2.2 + x * 0.05) * 1.4;
    const veggies = [
      [-18, -6, '#6ba25b', false],
      [-7, -7, '#7cb565', true],
      [4, -6, '#5c9352', false],
      [-15, 2, '#7cb565', true],
      [-4, 2, '#629856', false],
      [6, 1, '#79b262', true],
    ];
    for (let i = 0; i < veggies.length; i++) {
      const [vx, vy, col, hasTomato] = veggies[i];
      ctx.fillStyle = col;
      ctx.beginPath();
      ctx.arc(vx + sway, vy, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#97ca7b';
      ctx.beginPath();
      ctx.arc(vx - 1.5 + sway, vy - 1.5, 2.5, 0, Math.PI * 2);
      ctx.fill();
      if (hasTomato) {
        ctx.fillStyle = '#df6848';
        ctx.beginPath();
        ctx.arc(vx + 2 + sway, vy - 1, 1.9, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Two terracotta pots on the right side
    for (const [px, py, r] of [[28, -5, 6.5], [27, 9, 5.5]]) {
      ctx.fillStyle = '#c9714b';
      ctx.beginPath();
      ctx.arc(px, py + 2, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#de8860';
      ctx.beginPath();
      ctx.arc(px, py, r * 0.9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#5b8e55';
      ctx.beginPath();
      ctx.arc(px + sway * 0.6, py - 2, r * 0.72, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f6cb64';
      ctx.beginPath();
      ctx.arc(px + sway * 0.6, py - 3, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  function drawKopdesBuilding(ctx, x, y, time) {
    ctx.save();
    ctx.translate(x, y);

    // Architectural soft ground shadow
    ctx.fillStyle = 'rgba(36, 44, 32, 0.24)';
    roundRectPath(ctx, -68, -6, 142, 54, 14);
    ctx.fill();

    // Natural cream-stone terrace & front steps
    ctx.fillStyle = '#e5dac3';
    roundRectPath(ctx, -66, 12, 132, 28, 8);
    ctx.fill();
    ctx.fillStyle = '#d3c5aa';
    roundRectPath(ctx, -28, 34, 56, 8, 3);
    ctx.fill();

    // Main modern timber & cream facade
    ctx.fillStyle = '#f3ebd8';
    roundRectPath(ctx, -62, -38, 124, 54, 7);
    ctx.fill();

    // Warm cedar vertical timber columns
    ctx.fillStyle = '#8b5a2f';
    ctx.fillRect(-60, -38, 10, 54);
    ctx.fillRect(50, -38, 10, 54);
    ctx.fillRect(-16, -38, 6, 54);
    ctx.fillRect(10, -38, 6, 54);

    // Wide warm-amber glowing glass panels (left & right wings)
    const glow = 0.9 + Math.sin(time * 2.1 + x * 0.04) * 0.08;
    const gGrad = ctx.createLinearGradient(-46, -28, 46, 12);
    gGrad.addColorStop(0, `rgba(255, 228, 148, ${glow})`);
    gGrad.addColorStop(1, `rgba(244, 178, 70, ${glow})`);

    ctx.fillStyle = gGrad;
    roundRectPath(ctx, -47, -26, 28, 34, 3);
    ctx.fill();
    roundRectPath(ctx, 19, -26, 28, 34, 3);
    ctx.fill();

    // Center double glass doors
    ctx.fillStyle = `rgba(255, 236, 176, ${glow})`;
    roundRectPath(ctx, -9, -20, 18, 36, 3);
    ctx.fill();
    ctx.strokeStyle = '#634022';
    ctx.lineWidth = 2;
    roundRectPath(ctx, -47, -26, 28, 34, 3);
    ctx.stroke();
    roundRectPath(ctx, 19, -26, 28, 34, 3);
    ctx.stroke();
    roundRectPath(ctx, -9, -20, 18, 36, 3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.lineTo(0, 16);
    ctx.stroke();

    // Twin potted eco-shrubs flanking entrance
    for (const px of [-54, 46]) {
      ctx.fillStyle = '#c46f4a';
      ctx.fillRect(px, 16, 10, 9);
      ctx.fillStyle = '#538652';
      ctx.beginPath();
      ctx.arc(px + 5, 13, 6.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Modern tiered wood-and-sage architectural roof
    ctx.fillStyle = '#3f5c47';
    ctx.beginPath();
    ctx.moveTo(-74, -34);
    ctx.lineTo(-64, -58);
    ctx.lineTo(64, -58);
    ctx.lineTo(74, -34);
    ctx.closePath();
    ctx.fill();

    // Warm timber fascia beam
    ctx.fillStyle = '#a87243';
    roundRectPath(ctx, -74, -38, 148, 8, 3);
    ctx.fill();

    // Green roof skylight strip
    ctx.fillStyle = '#7ea874';
    roundRectPath(ctx, -50, -52, 100, 9, 4);
    ctx.fill();

    // Prominent "KOPDES" Wooden-Gold Signboard mounted on facade roof
    ctx.fillStyle = '#5d3a1b';
    roundRectPath(ctx, -38, -56, 76, 22, 7);
    ctx.fill();
    ctx.strokeStyle = '#f2c15a';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.font = '800 11.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#fff5d8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏛️ KOPDES', 0, -45);

    // Subtle bottom nameplate
    const sub = 'Koperasi Desa';
    ctx.font = '700 10.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const tw = ctx.measureText(sub).width + 16;
    ctx.fillStyle = 'rgba(251, 246, 234, 0.95)';
    roundRectPath(ctx, -tw / 2, 43, tw, 19, 9.5);
    ctx.fill();
    ctx.strokeStyle = '#c8b28c';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#473623';
    ctx.fillText(sub, 0, 52.5);

    ctx.restore();
  }

  function drawBusinessShop(ctx, x, y, b, time) {
    const biz = (b && b.business) || {};
    const catMeta =
      (W.BUSINESS_CATEGORIES || []).find((c) => c.id === biz.category) ||
      { icon: '🏪', awning: '#9c6644' };
    const shopName = biz.name || (b && b.label) || 'Tempat Usaha';
    const likes = Number(b && b.likes) || 0;

    ctx.save();
    ctx.translate(x, y);

    // Soft ground shadow
    ctx.fillStyle = 'rgba(40, 48, 36, 0.22)';
    roundRectPath(ctx, -56, -6, 116, 48, 12);
    ctx.fill();

    // Wooden porch & display terrace
    ctx.fillStyle = '#c29263';
    roundRectPath(ctx, -50, 12, 100, 24, 6);
    ctx.fill();

    // Cream stucco & timber kiosk body
    ctx.fillStyle = '#f7f0e0';
    roundRectPath(ctx, -52, -32, 104, 48, 6);
    ctx.fill();
    ctx.strokeStyle = '#8b5c34';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Glowing warm amber shopfront display window
    const glow = 0.9 + Math.sin(time * 2.3 + x * 0.05) * 0.08;
    const winGrad = ctx.createLinearGradient(-42, -20, 14, 10);
    winGrad.addColorStop(0, `rgba(255, 230, 152, ${glow})`);
    winGrad.addColorStop(1, `rgba(244, 182, 76, ${glow})`);
    ctx.fillStyle = winGrad;
    roundRectPath(ctx, -43, -18, 56, 28, 4);
    ctx.fill();
    ctx.strokeStyle = '#6c4424';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Wooden outdoor service shelf under display window
    ctx.fillStyle = '#9a6539';
    roundRectPath(ctx, -45, 7, 60, 7, 2.5);
    ctx.fill();

    // Entrance door on the right
    ctx.fillStyle = '#7b4d28';
    roundRectPath(ctx, 21, -16, 21, 32, 3);
    ctx.fill();
    ctx.fillStyle = '#ffe094';
    ctx.fillRect(24, -12, 15, 11);

    // Striped modern eco-awning over shopfront!
    const stripeCount = 7;
    const awningW = 114;
    const stripeW = awningW / stripeCount;
    for (let i = 0; i < stripeCount; i++) {
      ctx.fillStyle = i % 2 === 0 ? catMeta.awning : '#fbf5e6';
      ctx.beginPath();
      ctx.moveTo(-57 + i * stripeW, -35);
      ctx.lineTo(-57 + (i + 1) * stripeW, -35);
      ctx.lineTo(-59 + (i + 1) * stripeW, -19);
      ctx.lineTo(-59 + i * stripeW, -19);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(72, 48, 24, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-57, -35, awningW, 16);

    // Sleek warm-wood flat roof cap
    ctx.fillStyle = '#5c4632';
    roundRectPath(ctx, -56, -46, 112, 12, 5);
    ctx.fill();

    // Category icon medallion centered on roof
    ctx.fillStyle = '#fbf5e6';
    ctx.beginPath();
    ctx.arc(0, -40, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = catMeta.awning;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '13px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(catMeta.icon, 0, -39.5);

    // Nameplate + Thumbs-up support count pill below
    const labelText = likes > 0 ? `${shopName} · 👍 ${likes}` : shopName;
    ctx.font = '700 11px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const tw = Math.min(156, ctx.measureText(labelText).width + 18);
    ctx.fillStyle = 'rgba(251, 246, 234, 0.96)';
    roundRectPath(ctx, -tw / 2, 37, tw, 20, 10);
    ctx.fill();
    ctx.strokeStyle = catMeta.awning;
    ctx.lineWidth = 1.3;
    ctx.stroke();

    ctx.fillStyle = '#3f3021';
    ctx.fillText(labelText, 0, 47);

    ctx.restore();
  }

  function drawBuilding(ctx, b, time) {
    switch (b.type) {
      case 'rumah':
        drawMinimalistHouse(ctx, b.x, b.y, b.label, time);
        break;
      case 'pohon':
        drawLushTree(ctx, b.x, b.y, 1.0, Math.abs(Math.round(b.x + b.y)) % 3, time, true);
        break;
      case 'lampu':
        drawLantern(ctx, b.x, b.y, time);
        break;
      case 'bangku':
        drawCoffeeBench(ctx, b.x, b.y, time);
        break;
      case 'kebun':
        drawGardenBed(ctx, b.x, b.y, time);
        break;
      case 'jalan':
        drawStoneTile(ctx, b.x, b.y, 1);
        break;
      case 'usaha':
        drawBusinessShop(ctx, b.x, b.y, b, time);
        break;
      case 'kopdes':
        drawKopdesBuilding(ctx, b.x, b.y, time);
        break;
    }
  }

  function drawCharacterSprite(ctx, x, y, avatar, dir, moving, time, scale) {
    const s = scale || 1;
    const shirt = (avatar && avatar.shirtColor) || '#5f8d63';
    const hair = (avatar && avatar.hairStyle) || 'pendek';
    const bob = moving ? Math.abs(Math.sin(time * 10)) * 3.8 : Math.sin(time * 2.6 + x * 0.05) * 1.1;
    const stride = moving ? Math.sin(time * 10) * 4.5 : 0;

    ctx.save();
    ctx.translate(x, y);
    ctx.scale(s, s);

    // Soft elliptical shadow
    ctx.fillStyle = 'rgba(38, 46, 34, 0.24)';
    ctx.beginPath();
    ctx.ellipse(0, 6, 14, 6.2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Animated little shoes/feet
    ctx.fillStyle = '#5c4330';
    ctx.beginPath();
    ctx.ellipse(-5, 3 + stride * 0.45, 4.2, 2.8, 0, 0, Math.PI * 2);
    ctx.ellipse(5, 3 - stride * 0.45, 4.2, 2.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(0, -bob);

    // Long hair back layer (if panjang)
    if (hair === 'panjang') {
      ctx.fillStyle = '#4a3528';
      roundRectPath(ctx, -12.5, -31, 25, 25, 10);
      ctx.fill();
    }

    // Body / Eco Tunic
    ctx.fillStyle = shirt;
    roundRectPath(ctx, -11, -17, 22, 18, 8);
    ctx.fill();

    // Subtle shirt shading & cream collar accent
    ctx.fillStyle = shadeHex(shirt, -18);
    roundRectPath(ctx, -11, -5, 22, 6, 4);
    ctx.fill();
    ctx.fillStyle = '#f6f0e2';
    ctx.beginPath();
    ctx.arc(0, -16, 4.5, 0, Math.PI);
    ctx.fill();

    // Cute swinging hands
    ctx.fillStyle = '#f2caa8';
    ctx.beginPath();
    ctx.arc(-11.5, -8 - stride * 0.35, 3.3, 0, Math.PI * 2);
    ctx.arc(11.5, -8 + stride * 0.35, 3.3, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#f5cfb0';
    ctx.beginPath();
    ctx.arc(0, -26, 11.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes & rosy cheeks oriented toward facing direction
    if (dir !== 'up') {
      const lookX = dir === 'left' ? -3 : dir === 'right' ? 3 : 0;
      ctx.fillStyle = '#382a22';
      ctx.beginPath();
      ctx.arc(-4 + lookX, -25.5, 1.7, 0, Math.PI * 2);
      ctx.arc(4 + lookX, -25.5, 1.7, 0, Math.PI * 2);
      ctx.fill();

      // Warm rosy cheeks
      ctx.fillStyle = 'rgba(226, 125, 112, 0.35)';
      ctx.beginPath();
      ctx.arc(-6.8 + lookX, -23, 2.3, 0, Math.PI * 2);
      ctx.arc(6.8 + lookX, -23, 2.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Hair / Hat Styles
    if (hair === 'pendek') {
      ctx.fillStyle = '#473326';
      ctx.beginPath();
      ctx.arc(0, -28.5, 11.8, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-6, -31, 6, 4, -0.3, 0, Math.PI * 2);
      ctx.ellipse(5, -31.5, 6.5, 4, 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (hair === 'panjang') {
      ctx.fillStyle = '#4a3528';
      ctx.beginPath();
      ctx.arc(0, -28.5, 12, Math.PI * 0.92, Math.PI * 2.08);
      ctx.fill();
      ctx.fillRect(-12, -29, 3.5, 14);
      ctx.fillRect(8.5, -29, 3.5, 14);
    } else if (hair === 'sanggul') {
      ctx.fillStyle = '#473326';
      ctx.beginPath();
      ctx.arc(0, -40, 5.8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d99b38';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, -37.5, 5.2, 0.2, Math.PI - 0.2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, -28.5, 11.8, Math.PI, Math.PI * 2);
      ctx.fill();
    } else if (hair === 'topi_jerami') {
      // Wide warm straw sun hat
      ctx.fillStyle = '#e5c17b';
      ctx.beginPath();
      ctx.ellipse(0, -33, 17, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c49b52';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.fillStyle = '#edd093';
      ctx.beginPath();
      ctx.arc(0, -33.5, 10.5, Math.PI, Math.PI * 2);
      ctx.fill();
      // Sage ribbon band
      ctx.fillStyle = '#5f8d63';
      ctx.fillRect(-10, -35.5, 20, 3);
    } else if (hair === 'beanie') {
      ctx.fillStyle = '#c66d4e';
      ctx.beginPath();
      ctx.arc(0, -30, 12, Math.PI, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#a8563a';
      roundRectPath(ctx, -12.5, -33, 25, 5, 2.5);
      ctx.fill();
      ctx.fillStyle = '#f5e8d0';
      ctx.beginPath();
      ctx.arc(0, -42.5, 3.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (hair === 'bucket') {
      ctx.fillStyle = '#6f8f69';
      ctx.beginPath();
      ctx.ellipse(0, -32.5, 15, 4.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#82a37a';
      roundRectPath(ctx, -10.5, -42, 21, 10, 4);
      ctx.fill();
      ctx.fillStyle = '#f3ebd8';
      ctx.fillRect(-10.5, -34.5, 21, 2.2);
    }

    ctx.restore();
  }

  // ==================== Area Pasar Malam & Hiburan Visuals ====================
  function drawNightMarketGround(ctx, time, ambiance, festivalMode, hasPerformer) {
    const nm = W.NIGHT_MARKET;
    if (!nm) return;
    const b = nm.bounds;
    const glowFactor = festivalMode ? 1.15 : ambiance === 'senja' ? 0.95 : ambiance === 'sore' ? 0.55 : 0.22;

    ctx.save();

    // Stepping stone paths connecting Pasar Malam to the North road (West) and Kavling Timur (South)
    const connStones = [
      { x: 1120, y: 204 },
      { x: 1152, y: 206 },
      { x: 1184, y: 206 },
      { x: 1212, y: 206 },
      { x: 1396, y: 336 },
      { x: 1396, y: 360 },
      { x: 1396, y: 384 },
    ];
    for (let i = 0; i < connStones.length; i++) {
      drawStoneTile(ctx, connStones[i].x, connStones[i].y, 0.85);
    }

    // Soft outer border & warm sandstone plaza base
    ctx.fillStyle = '#c8ba9b';
    roundRectPath(ctx, b.x - 4, b.y - 4, b.w + 8, b.h + 8, 22);
    ctx.fill();

    const plazaGrad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.h);
    plazaGrad.addColorStop(0, '#ebe0c9');
    plazaGrad.addColorStop(1, '#dfd1b4');
    ctx.fillStyle = plazaGrad;
    roundRectPath(ctx, b.x, b.y, b.w, b.h, 18);
    ctx.fill();

    // Cobblestone tile pattern inside courtyard
    ctx.strokeStyle = 'rgba(155, 134, 102, 0.28)';
    ctx.lineWidth = 1;
    for (let gx = b.x + 24; gx < b.x + b.w - 10; gx += 28) {
      ctx.beginPath();
      ctx.moveTo(gx, b.y + 8);
      ctx.lineTo(gx, b.y + b.h - 8);
      ctx.stroke();
    }
    for (let gy = b.y + 24; gy < b.y + b.h - 10; gy += 24) {
      ctx.beginPath();
      ctx.moveTo(b.x + 8, gy);
      ctx.lineTo(b.x + b.w - 8, gy);
      ctx.stroke();
    }

    // Warm festive center medallion walkway
    ctx.fillStyle = 'rgba(246, 232, 198, 0.72)';
    ctx.beginPath();
    ctx.ellipse(b.x + b.w * 0.48, b.y + b.h * 0.56, 86, 36, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(196, 152, 92, 0.55)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Ambient warm light wash over Pasar Malam courtyard (stronger in Sore/Malam & Festival!)
    if (glowFactor > 0.1) {
      const wash = ctx.createRadialGradient(
        b.x + b.w * 0.5,
        b.y + b.h * 0.5,
        24,
        b.x + b.w * 0.5,
        b.y + b.h * 0.5,
        b.w * 0.58
      );
      wash.addColorStop(0, `rgba(255, 206, 108, ${0.26 * glowFactor})`);
      wash.addColorStop(1, 'rgba(255, 192, 88, 0)');
      ctx.fillStyle = wash;
      roundRectPath(ctx, b.x - 10, b.y - 10, b.w + 20, b.h + 20, 22);
      ctx.fill();
    }

    // Wooden Entertainment Stage Deck (Panggung Hiburan Warga)
    const st = nm.stage;
    ctx.fillStyle = 'rgba(42, 34, 24, 0.22)';
    roundRectPath(ctx, st.x + 4, st.y + 6, st.w, st.h, 10);
    ctx.fill();

    // Raised wooden stage frame
    ctx.fillStyle = '#7c4e2a';
    roundRectPath(ctx, st.x, st.y + 5, st.w, st.h, 10);
    ctx.fill();

    const deckGrad = ctx.createLinearGradient(st.x, st.y, st.x, st.y + st.h);
    deckGrad.addColorStop(0, '#c6935f');
    deckGrad.addColorStop(1, '#a77242');
    ctx.fillStyle = deckGrad;
    roundRectPath(ctx, st.x, st.y, st.w, st.h - 4, 10);
    ctx.fill();
    ctx.strokeStyle = '#683f20';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Plank lines across stage floor
    ctx.strokeStyle = 'rgba(92, 56, 28, 0.35)';
    ctx.lineWidth = 1;
    for (let sy = st.y + 12; sy < st.y + st.h - 8; sy += 11) {
      ctx.beginPath();
      ctx.moveTo(st.x + 4, sy);
      ctx.lineTo(st.x + st.w - 4, sy);
      ctx.stroke();
    }

    // Small front steps on the West edge of stage
    ctx.fillStyle = '#b4804e';
    roundRectPath(ctx, st.x - 10, st.y + 18, 12, 30, 3);
    ctx.fill();
    ctx.strokeStyle = '#683f20';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Stage footlights along front edge
    for (let i = 0; i < 5; i++) {
      const lx = st.x + 16 + i * 23;
      const ly = st.y + st.h - 7;
      const pulse = 0.72 + Math.sin(time * 4.5 + i * 0.9) * 0.25;
      ctx.fillStyle = hasPerformer || festivalMode ? `rgba(255, 224, 118, ${pulse})` : '#ffe3a3';
      ctx.beginPath();
      ctx.arc(lx, ly, 3.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // Warm stage spotlight cones (shimmer when someone is performing or during Festival!)
    const spotAlpha = hasPerformer ? 0.34 : festivalMode ? 0.22 : 0.12;
    const sway = hasPerformer ? Math.sin(time * 2.4) * 14 : 0;
    const spotGrad = ctx.createRadialGradient(
      st.centerX + sway,
      st.centerY,
      6,
      st.centerX + sway,
      st.centerY,
      58
    );
    spotGrad.addColorStop(0, `rgba(255, 232, 146, ${spotAlpha})`);
    spotGrad.addColorStop(1, 'rgba(255, 212, 102, 0)');
    ctx.fillStyle = spotGrad;
    ctx.beginPath();
    ctx.arc(st.centerX + sway, st.centerY, 58, 0, Math.PI * 2);
    ctx.fill();

    // Acoustic guitar & microphone icons resting on upper corners of stage
    ctx.font = '15px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎸', st.x + 22, st.y + 18);
    ctx.fillText('🎤', st.x + st.w - 22, st.y + 18);

    // Stage title ribbon
    ctx.font = '800 9.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#fff5dc';
    ctx.fillText('PANGGUNG WARGA', st.centerX, st.y + 11);

    ctx.restore();
  }

  function drawNightMarketGate(ctx, time, festivalMode) {
    const g = W.NIGHT_MARKET.gate;
    ctx.save();
    ctx.translate(g.x, g.y);

    // Subtle ground shadow
    ctx.fillStyle = 'rgba(40, 36, 26, 0.2)';
    ctx.beginPath();
    ctx.ellipse(-66, 6, 12, 5, 0, 0, Math.PI * 2);
    ctx.ellipse(66, 6, 12, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Twin warm wooden pillars
    ctx.fillStyle = '#7e4e29';
    roundRectPath(ctx, -72, -52, 13, 58, 4);
    roundRectPath(ctx, 59, -52, 13, 58, 4);
    ctx.fill();
    ctx.strokeStyle = '#563218';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Crossbeam arch & scalloped awning top
    ctx.fillStyle = '#9a6337';
    roundRectPath(ctx, -82, -58, 164, 15, 6);
    ctx.fill();
    ctx.strokeStyle = '#563218';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Festive mini triangular bunting flags under beam
    const flagColors = ['#e86850', '#f6c34d', '#5fa886', '#f28c4b', '#f8e6b4'];
    for (let i = 0; i < 9; i++) {
      const fx = -64 + i * 16;
      ctx.fillStyle = flagColors[i % flagColors.length];
      ctx.beginPath();
      ctx.moveTo(fx - 7, -43);
      ctx.lineTo(fx + 7, -43);
      ctx.lineTo(fx, -33);
      ctx.closePath();
      ctx.fill();
    }

    // Hanging warm paper lanterns on left & right gate posts
    const lanternGlow = festivalMode ? 0.96 : 0.8 + Math.sin(time * 3.4) * 0.14;
    [-77, 77].forEach((lx, idx) => {
      const sway = Math.sin(time * 2.5 + idx) * 1.8;
      ctx.strokeStyle = '#563218';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(lx, -44);
      ctx.lineTo(lx + sway, -34);
      ctx.stroke();

      const halo = ctx.createRadialGradient(lx + sway, -28, 2, lx + sway, -28, 18);
      halo.addColorStop(0, `rgba(255, 208, 96, ${0.65 * lanternGlow})`);
      halo.addColorStop(1, 'rgba(255, 190, 70, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(lx + sway, -28, 18, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = idx === 0 ? '#e8684a' : '#f4b53f';
      ctx.beginPath();
      ctx.ellipse(lx + sway, -28, 6, 7.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#75391e';
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Crisp signboard '🎪 Pasar Malam Kampung'
    ctx.fillStyle = '#3f2816';
    roundRectPath(ctx, -74, -76, 148, 22, 8);
    ctx.fill();
    ctx.strokeStyle = festivalMode ? '#ffd86b' : '#dfb25c';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = '800 10.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#fff5d8';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎪 Pasar Malam Kampung', 0, -65);

    ctx.restore();
  }

  function drawFoodStall(ctx, stall, time, isHovered, festivalMode) {
    ctx.save();
    ctx.translate(stall.x, stall.y);

    // Shadow
    ctx.fillStyle = 'rgba(42, 34, 24, 0.2)';
    roundRectPath(ctx, -38, -2, 78, 30, 8);
    ctx.fill();

    // Wooden cart wheels (for classic night market gerobak charm!)
    ctx.fillStyle = '#5c391d';
    ctx.beginPath();
    ctx.arc(-26, 22, 7.5, 0, Math.PI * 2);
    ctx.arc(26, 22, 7.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#d4a66a';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // Wooden counter body
    ctx.fillStyle = '#9a6539';
    roundRectPath(ctx, -36, -6, 72, 28, 5);
    ctx.fill();
    ctx.strokeStyle = '#633c1e';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Decorative front wood panel & glowing warm counter interior
    ctx.fillStyle = '#f5e8ce';
    roundRectPath(ctx, -31, 0, 62, 16, 4);
    ctx.fill();
    ctx.fillStyle = '#ffe5a1';
    ctx.fillRect(-29, -18, 58, 13);

    // Support poles
    ctx.fillStyle = '#6f4423';
    ctx.fillRect(-34, -36, 5, 32);
    ctx.fillRect(29, -36, 5, 32);

    // Striped festive stall awning
    const stripes = 6;
    const aw = 82;
    const sw = aw / stripes;
    for (let i = 0; i < stripes; i++) {
      ctx.fillStyle = i % 2 === 0 ? stall.color : stall.stripe;
      ctx.beginPath();
      ctx.moveTo(-41 + i * sw, -40);
      ctx.lineTo(-41 + (i + 1) * sw, -40);
      ctx.lineTo(-43 + (i + 1) * sw, -25);
      ctx.lineTo(-43 + i * sw, -25);
      ctx.closePath();
      ctx.fill();
    }
    ctx.strokeStyle = 'rgba(72, 44, 22, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-41, -40, aw, 15);

    // Hanging warm bulb under awning
    const bulbPulse = 0.8 + Math.sin(time * 4 + stall.x * 0.04) * 0.16;
    const bGlow = ctx.createRadialGradient(0, -19, 1, 0, -19, festivalMode ? 22 : 15);
    bGlow.addColorStop(0, `rgba(255, 224, 122, ${0.72 * bulbPulse})`);
    bGlow.addColorStop(1, 'rgba(255, 200, 80, 0)');
    ctx.fillStyle = bGlow;
    ctx.beginPath();
    ctx.arc(0, -19, festivalMode ? 22 : 15, 0, Math.PI * 2);
    ctx.fill();

    // Rising cozy steam curls for warm stalls (wedang & bakso)
    if (stall.id !== 'eskrim') {
      ctx.strokeStyle = 'rgba(255, 252, 240, 0.65)';
      ctx.lineWidth = 1.5;
      for (let s = 0; s < 2; s++) {
        const phase = (time * 1.1 + s * 0.5) % 1;
        const sx = -10 + s * 18 + Math.sin(time * 3 + s) * 2.5;
        const sy = -10 - phase * 14;
        ctx.globalAlpha = (1 - phase) * 0.7;
        ctx.beginPath();
        ctx.arc(sx, sy, 2.5 + phase * 2, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    // Center stall food icon badge
    ctx.fillStyle = '#fff9eb';
    ctx.beginPath();
    ctx.arc(0, -40, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = stall.color;
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.font = '13px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(stall.icon, 0, -39.5);

    // Label tag underneath
    ctx.font = '700 9.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const tw = ctx.measureText(stall.shortName).width + 12;
    ctx.fillStyle = 'rgba(251, 246, 234, 0.95)';
    roundRectPath(ctx, -tw / 2, 27, tw, 16, 8);
    ctx.fill();
    ctx.strokeStyle = stall.color;
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#3f2e1f';
    ctx.fillText(stall.shortName, 0, 35);

    // Hover highlight & prompt
    if (isHovered) {
      ctx.strokeStyle = '#f2b43b';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([6, 4]);
      roundRectPath(ctx, -45, -52, 90, 96, 12);
      ctx.stroke();
      ctx.setLineDash([]);

      const hint = `${stall.icon} Jajan / Pesan`;
      ctx.font = '800 10.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      const hw = ctx.measureText(hint).width + 16;
      ctx.fillStyle = 'rgba(138, 76, 36, 0.96)';
      roundRectPath(ctx, -hw / 2, -68, hw, 20, 10);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(hint, 0, -58);
    }

    ctx.restore();
  }

  function getFerrisCabinPosition(fw, cabinIndex, time) {
    const r = fw.wheelRadius || 38;
    const count = fw.cabinCount || 6;
    const baseAngle = time * 0.55;
    const theta = baseAngle + (cabinIndex / count) * Math.PI * 2;
    const hubX = fw.x;
    const hubY = fw.y - 36;
    return {
      x: hubX + Math.cos(theta) * r,
      y: hubY + Math.sin(theta) * r,
    };
  }

  function drawFerrisWheel(ctx, fw, time, riders, isHovered, festivalMode) {
    const r = fw.wheelRadius || 38;
    const count = fw.cabinCount || 6;
    const baseAngle = time * 0.55;
    const hubY = -36;

    ctx.save();
    ctx.translate(fw.x, fw.y);

    // Base shadow
    ctx.fillStyle = 'rgba(40, 34, 24, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, 14, 34, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Warm base platform
    ctx.fillStyle = '#8b5830';
    roundRectPath(ctx, -32, 4, 64, 12, 5);
    ctx.fill();
    ctx.strokeStyle = '#5c381c';
    ctx.lineWidth = 1.6;
    ctx.stroke();

    // A-frame support legs behind wheel
    ctx.strokeStyle = '#6f4423';
    ctx.lineWidth = 4.5;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-24, 8);
    ctx.lineTo(0, hubY);
    ctx.lineTo(24, 8);
    ctx.stroke();

    // Outer & inner brass rims
    ctx.strokeStyle = '#d49a42';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.arc(0, hubY, r, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = '#f6d482';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(0, hubY, r * 0.58, 0, Math.PI * 2);
    ctx.stroke();

    // Rotating spokes + rim fairy bulbs
    const festColors = ['#ffd86b', '#ff8c69', '#8ce0b5', '#ffd86b', '#ffa96b', '#b8e4ff'];
    for (let i = 0; i < count; i++) {
      const theta = baseAngle + (i / count) * Math.PI * 2;
      const cx = Math.cos(theta) * r;
      const cy = hubY + Math.sin(theta) * r;

      ctx.strokeStyle = 'rgba(136, 90, 44, 0.78)';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(0, hubY);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      // Twinkling bulb on rim
      const bulbX = Math.cos(theta + Math.PI / count) * r;
      const bulbY = hubY + Math.sin(theta + Math.PI / count) * r;
      const twinkle = 0.65 + Math.sin(time * 5.2 + i * 1.3) * 0.35;
      ctx.fillStyle = festivalMode ? festColors[i % festColors.length] : `rgba(255, 224, 118, ${twinkle})`;
      ctx.beginPath();
      ctx.arc(bulbX, bulbY, festivalMode ? 3.4 : 2.6, 0, Math.PI * 2);
      ctx.fill();
    }

    // Center glowing hub
    ctx.fillStyle = '#c85a42';
    ctx.beginPath();
    ctx.arc(0, hubY, 8.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffe296';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 6 Upright Swinging Gondola Cabins + any riding players!
    const cabinColors = ['#d86c52', '#5b9279', '#e5a93c', '#5e88a6', '#c9788b', '#7f9b58'];
    for (let i = 0; i < count; i++) {
      const theta = baseAngle + (i / count) * Math.PI * 2;
      const cx = Math.cos(theta) * r;
      const cy = hubY + Math.sin(theta) * r;
      const rider = riders && riders.find((p) => p.ferrisRide && p.ferrisRide.cabinIndex === i);

      ctx.save();
      ctx.translate(cx, cy);
      // Hanger rod
      ctx.strokeStyle = '#5c3c22';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, 8);
      ctx.stroke();

      // If a citizen is riding this cabin, draw them sitting happily inside!
      if (rider) {
        drawCharacterSprite(ctx, 0, 18, rider.avatar, 'down', false, time, 0.62);
      }

      // Cabin basket (front rim overlaps lower body cleanly)
      ctx.fillStyle = cabinColors[i % cabinColors.length];
      roundRectPath(ctx, -9, 10, 18, 12, 4);
      ctx.fill();
      ctx.strokeStyle = '#fff5dc';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Tiny cabin roof cap
      ctx.fillStyle = '#fff3d4';
      roundRectPath(ctx, -10, 5, 20, 4, 2);
      ctx.fill();

      if (rider) {
        ctx.font = '700 9px "Plus Jakarta Sans", "Segoe UI", sans-serif';
        const rtw = ctx.measureText(rider.name).width + 10;
        ctx.fillStyle = 'rgba(255, 248, 228, 0.94)';
        roundRectPath(ctx, -rtw / 2, 24, rtw, 13, 6);
        ctx.fill();
        ctx.fillStyle = '#47331e';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(rider.name, 0, 30.5);
      }
      ctx.restore();
    }

    // Label below Ferris Wheel
    ctx.font = '700 9.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const label = '🎡 Bianglala Mini';
    const tw = ctx.measureText(label).width + 12;
    ctx.fillStyle = 'rgba(251, 246, 234, 0.95)';
    roundRectPath(ctx, -tw / 2, 20, tw, 16, 8);
    ctx.fill();
    ctx.strokeStyle = '#d49a42';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#3f2e1f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 28);

    if (isHovered) {
      ctx.strokeStyle = '#f2b43b';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([6, 4]);
      roundRectPath(ctx, -48, -82, 96, 122, 16);
      ctx.stroke();
      ctx.setLineDash([]);

      const hint = '🎡 Klik Naik Wahana';
      ctx.font = '800 10.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      const hw = ctx.measureText(hint).width + 16;
      ctx.fillStyle = 'rgba(138, 76, 36, 0.96)';
      roundRectPath(ctx, -hw / 2, -98, hw, 20, 10);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(hint, 0, -88);
    }

    ctx.restore();
  }

  function drawLuckyWheelBooth(ctx, lw, time, wheelSpinAnim, isHovered, festivalMode) {
    ctx.save();
    ctx.translate(lw.x, lw.y);

    // Shadow
    ctx.fillStyle = 'rgba(40, 34, 24, 0.2)';
    roundRectPath(ctx, -34, 2, 68, 22, 8);
    ctx.fill();

    // Wooden booth counter
    ctx.fillStyle = '#8b5830';
    roundRectPath(ctx, -32, -4, 64, 22, 5);
    ctx.fill();
    ctx.strokeStyle = '#5a361a';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Festive red-gold booth skirt stripes
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#cf5242' : '#fbf1d8';
      ctx.fillRect(-28 + i * 9.3, 1, 9.3, 13);
    }

    // Wheel stand pole
    ctx.fillStyle = '#683f20';
    ctx.fillRect(-3.5, -36, 7, 34);

    // Spinning Prize Wheel
    let wheelAngle = time * 0.35;
    if (wheelSpinAnim && wheelSpinAnim.active) {
      const elapsed = Math.max(0, Date.now() - wheelSpinAnim.startedAt);
      const dur = wheelSpinAnim.durationMs || 2600;
      const t = Math.min(1, elapsed / dur);
      // Ease-out cubic spin
      const ease = 1 - Math.pow(1 - t, 3);
      wheelAngle = wheelSpinAnim.startAngle + ease * wheelSpinAnim.totalSpin;
    }

    const wheelY = -30;
    const wr = 24;
    const segColors = ['#e36b54', '#f4c24d', '#5fa47b', '#5d8eb5', '#d9845b', '#9b76b8'];

    ctx.save();
    ctx.translate(0, wheelY);
    ctx.rotate(wheelAngle);
    for (let i = 0; i < 6; i++) {
      const a0 = (i / 6) * Math.PI * 2;
      const a1 = ((i + 1) / 6) * Math.PI * 2;
      ctx.fillStyle = segColors[i];
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, wr, a0, a1);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#fff7e0';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    // Outer brass rim & sparkling pegs
    ctx.strokeStyle = festivalMode ? '#ffe078' : '#d6a03e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, wr, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#fff5d6';
    ctx.beginPath();
    ctx.arc(0, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#8b5830';
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.restore();

    // Top red pointer arrow
    ctx.fillStyle = '#d83f31';
    ctx.beginPath();
    ctx.moveTo(0, wheelY - wr + 4);
    ctx.lineTo(-5.5, wheelY - wr - 6);
    ctx.lineTo(5.5, wheelY - wr - 6);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#fff5d8';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Label below Lucky Wheel
    ctx.font = '700 9.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const label = '🎯 Roda Hiburan';
    const tw = ctx.measureText(label).width + 12;
    ctx.fillStyle = 'rgba(251, 246, 234, 0.95)';
    roundRectPath(ctx, -tw / 2, 22, tw, 16, 8);
    ctx.fill();
    ctx.strokeStyle = '#cf5242';
    ctx.lineWidth = 1.2;
    ctx.stroke();
    ctx.fillStyle = '#3f2e1f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(label, 0, 30);

    if (isHovered) {
      ctx.strokeStyle = '#f2b43b';
      ctx.lineWidth = 2.2;
      ctx.setLineDash([6, 4]);
      roundRectPath(ctx, -38, -62, 76, 102, 14);
      ctx.stroke();
      ctx.setLineDash([]);

      const hint = '🎯 Putar Roda Hiburan';
      ctx.font = '800 10.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      const hw = ctx.measureText(hint).width + 16;
      ctx.fillStyle = 'rgba(182, 66, 48, 0.96)';
      roundRectPath(ctx, -hw / 2, -78, hw, 20, 10);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillText(hint, 0, -68);
    }

    ctx.restore();
  }

  function drawNightMarketStringLightsAndEffects(ctx, time, ambiance, festivalMode, stagePerformers) {
    const nm = W.NIGHT_MARKET;
    if (!nm) return;
    const b = nm.bounds;
    const glowStrength = festivalMode
      ? 1.15
      : ambiance === 'senja'
      ? 1.0
      : ambiance === 'sore'
      ? 0.72
      : 0.36;

    // 4 Corner Wooden String-Light Poles + Overhead Sagging Fairy Light Strands
    const strands = [
      [
        { x: b.x + 12, y: b.y + 8 },
        { x: b.x + b.w - 12, y: b.y + 8 },
      ],
      [
        { x: b.x + 12, y: b.y + 8 },
        { x: b.x + b.w * 0.5, y: b.y + b.h - 14 },
      ],
      [
        { x: b.x + b.w - 12, y: b.y + 8 },
        { x: b.x + b.w * 0.5, y: b.y + b.h - 14 },
      ],
    ];

    const festPalette = ['#ffd76a', '#ff8d6b', '#7ce0b2', '#ffdf80', '#96d7ff', '#ff9fb8'];

    ctx.save();
    for (let s = 0; s < strands.length; s++) {
      const p1 = strands[s][0];
      const p2 = strands[s][1];
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 + 24;

      // Thin dark cord
      ctx.strokeStyle = 'rgba(72, 52, 34, 0.52)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.quadraticCurveTo(midX, midY, p2.x, p2.y);
      ctx.stroke();

      // Warm glowing bulbs along quadratic curve
      const bulbs = 11;
      for (let i = 1; i < bulbs; i++) {
        const t = i / bulbs;
        const inv = 1 - t;
        const bx = inv * inv * p1.x + 2 * inv * t * midX + t * t * p2.x;
        const by = inv * inv * p1.y + 2 * inv * t * midY + t * t * p2.y;
        const twinkle = 0.72 + Math.sin(time * (festivalMode ? 6.5 : 3.2) + i * 1.1 + s * 2) * 0.28;
        const bulbColor = festivalMode
          ? festPalette[(i + s * 2 + Math.floor(time * 2)) % festPalette.length]
          : '#ffda79';

        // Soft warm aura
        const auraR = (festivalMode ? 14 : 10) * glowStrength;
        if (auraR > 2) {
          const g = ctx.createRadialGradient(bx, by, 1, bx, by, auraR);
          g.addColorStop(0, festivalMode ? `rgba(255, 224, 120, ${0.62 * twinkle})` : `rgba(255, 212, 102, ${0.52 * twinkle * glowStrength})`);
          g.addColorStop(1, 'rgba(255, 200, 80, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(bx, by, auraR, 0, Math.PI * 2);
          ctx.fill();
        }

        // Crisp glowing bulb core
        ctx.fillStyle = bulbColor;
        ctx.globalAlpha = 0.7 + twinkle * 0.3;
        ctx.beginPath();
        ctx.arc(bx, by, festivalMode ? 3.2 : 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }

    // Floating Animated Musical Notes around Panggung Hiburan whenever a citizen performs!
    if (stagePerformers && stagePerformers.length > 0) {
      const st = nm.stage;
      const notes = ['🎵', '🎶', '🎸', '✨', '🎵', '🎶'];
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      for (let i = 0; i < 6; i++) {
        const phase = (time * 0.55 + i / 6) % 1;
        const nx = st.x + 18 + ((i * 23) % (st.w - 30)) + Math.sin(time * 3 + i) * 9;
        const ny = st.centerY - 12 - phase * 68;
        const alpha = phase < 0.2 ? phase / 0.2 : phase > 0.78 ? (1 - phase) / 0.22 : 1;
        ctx.save();
        ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
        ctx.font = `${13 + (i % 2) * 3}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
        ctx.fillText(notes[i], nx, ny);
        ctx.restore();
      }
    }

    // Festive Miniature Fireworks in the village sky when Pak Kades activates 'Festival Pasar Malam'!
    if (festivalMode) {
      const fwSpots = [
        { x: 1320, y: 120, offset: 0.0, color: '#ffcf56' },
        { x: 1560, y: 112, offset: 1.15, color: '#ff7b6b' },
        { x: 920, y: 160, offset: 2.25, color: '#7de3b5' },
        { x: 1445, y: 190, offset: 3.1, color: '#a8d4ff' },
      ];
      for (let f = 0; f < fwSpots.length; f++) {
        const fw = fwSpots[f];
        const cycle = (time * 0.52 + fw.offset) % 2.4;
        if (cycle < 1.15) {
          const p = cycle / 1.15;
          const radius = 8 + Math.sin(p * Math.PI * 0.5) * 44;
          const alpha = p < 0.7 ? 0.92 : (1 - p) / 0.3;
          const sparks = 12;
          ctx.save();
          ctx.globalAlpha = Math.max(0, alpha);
          for (let k = 0; k < sparks; k++) {
            const ang = (k / sparks) * Math.PI * 2 + f * 0.4;
            const sx = fw.x + Math.cos(ang) * radius;
            const sy = fw.y + Math.sin(ang) * radius + p * p * 14;
            const tx = fw.x + Math.cos(ang) * Math.max(0, radius - 12);
            const ty = fw.y + Math.sin(ang) * Math.max(0, radius - 12) + p * p * 10;

            ctx.strokeStyle = fw.color;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tx, ty);
            ctx.lineTo(sx, sy);
            ctx.stroke();

            ctx.fillStyle = '#fff9e0';
            ctx.beginPath();
            ctx.arc(sx, sy, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.restore();
        }
      }
    }

    ctx.restore();
  }

  function drawPlayer(ctx, player, isMe, isHovered, isFocused, time, now) {
    // Pulsing spotlight ring when camera is spotlighting this visitor
    if (isFocused) {
      const pulse = 22 + Math.sin(time * 5.2) * 5;
      ctx.save();
      ctx.strokeStyle = 'rgba(246, 185, 59, 0.95)';
      ctx.fillStyle = 'rgba(255, 224, 130, 0.22)';
      ctx.lineWidth = 2.6;
      ctx.beginPath();
      ctx.ellipse(player.x, player.y + 5, pulse, pulse * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }

    // Subtle soft ring beneath local player
    if (isMe) {
      ctx.save();
      ctx.strokeStyle = 'rgba(246, 185, 59, 0.78)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(player.x, player.y + 6, 18, 8.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    drawCharacterSprite(
      ctx,
      player.x,
      player.y,
      player.avatar,
      player.dir || 'down',
      player.moving,
      time,
      1
    );

    // Held Night Market Snack / Drink in character's hand (real-time synced!)
    const curNow = now || Date.now();
    if (player.heldSnack && player.heldSnack.icon && (!player.heldSnack.until || curNow < player.heldSnack.until)) {
      const bob = Math.sin(time * 4.5) * 1.8;
      ctx.save();
      ctx.fillStyle = 'rgba(255, 250, 236, 0.92)';
      ctx.beginPath();
      ctx.arc(player.x + 17, player.y - 12 + bob, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d9a441';
      ctx.lineWidth = 1.4;
      ctx.stroke();
      ctx.font = '12px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(player.heldSnack.icon, player.x + 17, player.y - 11.5 + bob);
      ctx.restore();
    }

    // Performing Music on Stage indicator beside character
    if (player.performing) {
      const sway = Math.sin(time * 7) * 2.5;
      ctx.save();
      ctx.font = '14px "Segoe UI Emoji", "Apple Color Emoji", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🎸', player.x - 16, player.y - 12 + sway);
      ctx.restore();
    }

    // Nameplate cleanly BELOW character so the area above head stays 100% clear for Chat & Greeting Bubbles!
    ctx.save();
    ctx.font = '700 11.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const isChamp = Boolean(player.isFishingChampion);
    const champPrefix = isChamp ? '🏅 ' : '';
    const displayName = isMe ? `${champPrefix}${player.name} (Kamu)` : `${champPrefix}${player.name}`;
    const tw = ctx.measureText(displayName).width + 16;
    const ny = player.y + 21;

    ctx.fillStyle = isMe
      ? 'rgba(78, 114, 74, 0.94)'
      : isFocused
      ? 'rgba(218, 148, 42, 0.95)'
      : isChamp
      ? 'rgba(255, 245, 214, 0.96)'
      : 'rgba(251, 246, 234, 0.94)';
    roundRectPath(ctx, player.x - tw / 2, ny - 9.5, tw, 19, 9.5);
    ctx.fill();
    ctx.strokeStyle = isChamp
      ? '#dfa230'
      : isMe
      ? '#3f633c'
      : isFocused
      ? '#9b6318'
      : 'rgba(182, 165, 136, 0.8)';
    ctx.lineWidth = isChamp ? 1.8 : 1.1;
    ctx.stroke();

    ctx.fillStyle = isMe || isFocused ? '#ffffff' : isChamp ? '#5d3b0b' : '#3f3427';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(displayName, player.x, ny);

    // Small clickable pencil edit button right next to local player's nameplate
    if (isMe) {
      const ex = player.x + tw / 2 + 12;
      const ey = ny;
      player._editBtnHit = { x: ex, y: ey, r: 12 };

      ctx.fillStyle = isHovered ? '#fff2ce' : 'rgba(251, 246, 234, 0.96)';
      ctx.beginPath();
      ctx.arc(ex, ey, 9.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isHovered ? '#d99b38' : '#b7a482';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Tiny crisp pencil vector icon
      ctx.save();
      ctx.translate(ex, ey);
      ctx.rotate(-Math.PI / 4);
      ctx.fillStyle = '#6f4624';
      ctx.fillRect(-4, -1.5, 6.5, 3);
      ctx.beginPath();
      ctx.moveTo(2.5, -1.5);
      ctx.lineTo(5.2, 0);
      ctx.lineTo(2.5, 1.5);
      ctx.closePath();
      ctx.fillStyle = '#d99b38';
      ctx.fill();
      ctx.restore();
    }

    // Temporary Fun Title from Roda Keberuntungan (e.g. 'Bintang Pasar Malam ✨')
    let extraOffsetY = 0;
    if (player.funTitle && player.funTitle.label && (!player.funTitle.expiresAt || curNow < player.funTitle.expiresAt)) {
      ctx.font = '800 9.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      const ftw = ctx.measureText(player.funTitle.label).width + 14;
      ctx.fillStyle = 'rgba(255, 242, 202, 0.96)';
      roundRectPath(ctx, player.x - ftw / 2, ny + 11, ftw, 16, 8);
      ctx.fill();
      ctx.strokeStyle = '#df9a2f';
      ctx.lineWidth = 1.2;
      ctx.stroke();
      ctx.fillStyle = '#6c3e08';
      ctx.fillText(player.funTitle.label, player.x, ny + 19);
      extraOffsetY = 18;
    }

    // Optional role/hobby pill below nameplate when hovered or focused
    if ((isHovered || isFocused) && player.role) {
      ctx.font = '600 10px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      const rw = ctx.measureText(player.role).width + 12;
      ctx.fillStyle = 'rgba(255, 250, 238, 0.94)';
      roundRectPath(ctx, player.x - rw / 2, ny + 12 + extraOffsetY, rw, 16, 8);
      ctx.fill();
      ctx.strokeStyle = 'rgba(182, 165, 136, 0.65)';
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = '#5c4b39';
      ctx.fillText(player.role, player.x, ny + 20 + extraOffsetY);
    }
    ctx.restore();
  }

  function wrapLines(ctx, text, maxWidth) {
    const words = text.split(' ');
    const lines = [];
    let current = '';
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const test = current ? `${current} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && current) {
        lines.push(current);
        current = word;
      } else {
        current = test;
      }
    }
    if (current) lines.push(current);
    return lines.slice(0, 3);
  }

  function drawChatBubble(ctx, x, y, bubble, now, time) {
    const elapsed = now - bubble.createdAt;
    const duration = 6000;
    if (elapsed > duration) return;

    // Smooth pop-in (220ms) and gradual fade-out across final 1200ms
    let alpha = 1;
    if (elapsed < 220) {
      alpha = elapsed / 220;
    } else if (elapsed > duration - 1200) {
      alpha = (duration - elapsed) / 1200;
    }
    alpha = Math.max(0, Math.min(1, alpha));

    const popScale = elapsed < 200 ? 0.85 + 0.15 * (elapsed / 200) : 1;
    const floatY = Math.sin((time || 0) * 2.8 + x * 0.02) * 2;
    const isGreeting = Boolean(bubble.isGreeting);

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = isGreeting
      ? '700 12.5px "Plus Jakarta Sans", "Segoe UI", sans-serif'
      : '600 12px "Plus Jakarta Sans", "Segoe UI", sans-serif';

    const lines = wrapLines(ctx, bubble.text, 180);
    let maxW = 54;
    for (let i = 0; i < lines.length; i++) {
      maxW = Math.max(maxW, ctx.measureText(lines[i]).width);
    }

    const padX = 13;
    const padY = 8;
    const lineH = 16.5;
    const boxW = maxW + padX * 2;
    const boxH = lines.length * lineH + padY * 2;
    const anchorY = y - 54 + floatY;

    ctx.translate(x, anchorY);
    ctx.scale(popScale, popScale);

    const bx = -boxW / 2;
    const by = -boxH;

    // Warm cream bubble soft shadow
    ctx.fillStyle = 'rgba(54, 42, 24, 0.18)';
    roundRectPath(ctx, bx + 2, by + 3.5, boxW, boxH, 14);
    ctx.fill();

    // Warm cream bubble body
    ctx.fillStyle = isGreeting ? '#fff7e3' : '#fbf5e6';
    roundRectPath(ctx, bx, by, boxW, boxH, 14);
    ctx.fill();
    ctx.strokeStyle = isGreeting ? '#e3bb64' : '#d8c5a3';
    ctx.lineWidth = isGreeting ? 1.8 : 1.5;
    ctx.stroke();

    // Pointer triangle pointing down right above the head
    ctx.beginPath();
    ctx.moveTo(-6.5, -1);
    ctx.lineTo(0, 7.5);
    ctx.lineTo(6.5, -1);
    ctx.closePath();
    ctx.fillStyle = isGreeting ? '#fff7e3' : '#fbf5e6';
    ctx.fill();
    ctx.strokeStyle = isGreeting ? '#e3bb64' : '#d8c5a3';
    ctx.lineWidth = 1.4;
    ctx.stroke();

    // Cover inner seam of pointer
    ctx.fillStyle = isGreeting ? '#fff7e3' : '#fbf5e6';
    ctx.fillRect(-5.5, -2.5, 11, 3);

    ctx.fillStyle = isGreeting ? '#4a351b' : '#3a2e21';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], 0, by + padY + lineH * i + lineH / 2);
    }
    ctx.restore();
  }

  function drawWhisperBubble(ctx, x, y, whisper, now, time, offsetY) {
    const elapsed = now - whisper.createdAt;
    const duration = 6000;
    if (elapsed > duration) return;

    let alpha = 1;
    if (elapsed < 220) {
      alpha = elapsed / 220;
    } else if (elapsed > duration - 1200) {
      alpha = (duration - elapsed) / 1200;
    }
    alpha = Math.max(0, Math.min(1, alpha));

    const floatY = Math.sin((time || 0) * 2.5 + x * 0.03) * 1.8;

    ctx.save();
    ctx.globalAlpha = alpha;
    const headerText = `💌 Bisikan · ${whisper.fromName}`;
    ctx.font = '600 11.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const lines = wrapLines(ctx, whisper.text, 176);

    ctx.font = '800 10px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    let maxW = Math.max(82, ctx.measureText(headerText).width);
    ctx.font = '600 11.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    for (let i = 0; i < lines.length; i++) {
      maxW = Math.max(maxW, ctx.measureText(lines[i]).width);
    }

    const padX = 12;
    const padY = 7;
    const headerH = 14;
    const lineH = 15.5;
    const boxW = maxW + padX * 2;
    const boxH = headerH + lines.length * lineH + padY * 2 + 2;
    const anchorY = y - 54 - (offsetY || 0) + floatY;
    const bx = x - boxW / 2;
    const by = anchorY - boxH;

    // Soft shadow
    ctx.fillStyle = 'rgba(72, 46, 22, 0.18)';
    roundRectPath(ctx, bx + 2, by + 3, boxW, boxH, 13);
    ctx.fill();

    // Cozy warm wood-cream whisper bubble with dashed border
    ctx.fillStyle = '#fef4e4';
    roundRectPath(ctx, bx, by, boxW, boxH, 13);
    ctx.fill();
    ctx.setLineDash([5, 3]);
    ctx.strokeStyle = '#b9834c';
    ctx.lineWidth = 1.6;
    ctx.stroke();
    ctx.setLineDash([]);

    // Pointer triangle
    ctx.beginPath();
    ctx.moveTo(x - 6, anchorY - 1);
    ctx.lineTo(x, anchorY + 6.5);
    ctx.lineTo(x + 6, anchorY - 1);
    ctx.closePath();
    ctx.fillStyle = '#fef4e4';
    ctx.fill();
    ctx.strokeStyle = '#b9834c';
    ctx.lineWidth = 1.3;
    ctx.stroke();
    ctx.fillStyle = '#fef4e4';
    ctx.fillRect(x - 5, anchorY - 2.5, 10, 3);

    // Whisper header tag
    ctx.font = '800 10px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#8b5a2f';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(headerText, x, by + padY + headerH / 2);

    // Whisper body lines
    ctx.font = '600 11.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    ctx.fillStyle = '#473422';
    for (let i = 0; i < lines.length; i++) {
      ctx.fillText(lines[i], x, by + padY + headerH + 2 + lineH * i + lineH / 2);
    }
    ctx.restore();
  }

  function drawTargetGreetEffect(ctx, x, y, effect, now, time) {
    const elapsed = now - effect.createdAt;
    const duration = 3800;
    if (elapsed > duration) return;

    const prog = elapsed / duration;
    const alpha = prog < 0.14 ? prog / 0.14 : prog > 0.72 ? (1 - prog) / 0.28 : 1;
    const rise = prog * 30;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));

    // Gentle glowing mini greeting pill with waving hand & hearts above greeted target
    const pillY = y - 60 - rise;
    const sway = Math.sin((time || 0) * 6.5) * 3;

    // Floating warm heart & sparkle particles orbiting gently
    const particles = [
      { ox: -19, oy: -6 - prog * 14, icon: '❤️', size: 12 },
      { ox: 18, oy: -10 - prog * 18, icon: '✨', size: 12 },
      { ox: 0, oy: -18 - prog * 12, icon: '👋', size: 14 },
    ];
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < particles.length; i++) {
      const pt = particles[i];
      ctx.font = `${pt.size}px "Segoe UI Emoji", "Apple Color Emoji", sans-serif`;
      ctx.fillText(pt.icon, x + pt.ox + sway * (i === 2 ? 1 : -0.6), pillY + pt.oy);
    }

    // Small warm badge showing who greeted them
    const tag = `Disapa ${effect.fromName} ❤️`;
    ctx.font = '700 10.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const tw = ctx.measureText(tag).width + 16;
    ctx.fillStyle = 'rgba(255, 246, 232, 0.96)';
    roundRectPath(ctx, x - tw / 2, pillY - 8, tw, 20, 10);
    ctx.fill();
    ctx.strokeStyle = '#e49f7e';
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.fillStyle = '#6f3d28';
    ctx.fillText(tag, x, pillY + 2);

    ctx.restore();
  }

  function drawReactionFloat(ctx, x, y, reaction, now) {
    const elapsed = now - reaction.createdAt;
    const duration = 3400;
    if (elapsed > duration) return;

    const prog = elapsed / duration;
    const rise = prog * 36;
    const alpha = prog < 0.12 ? prog / 0.12 : prog > 0.78 ? (1 - prog) / 0.22 : 1;
    const pop = prog < 0.16 ? 0.75 + Math.sin((prog / 0.16) * (Math.PI / 2)) * 0.3 : 1;

    ctx.save();
    ctx.globalAlpha = Math.max(0, Math.min(1, alpha));
    ctx.translate(x, y - 78 - rise);
    ctx.scale(pop, pop);

    const text = `${reaction.emoji} ${reaction.label}`;
    ctx.font = '700 12px "Plus Jakarta Sans", "Segoe UI", sans-serif';
    const tw = ctx.measureText(text).width + 20;

    ctx.fillStyle = 'rgba(255, 248, 232, 0.96)';
    roundRectPath(ctx, -tw / 2, -14, tw, 28, 14);
    ctx.fill();
    ctx.strokeStyle = '#e5be67';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    ctx.fillStyle = '#4a3822';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 0, 0);
    ctx.restore();
  }

  function drawLightingAndParticles(ctx, time, ambiance, buildings) {
    // Ambiance color grade
    if (ambiance === 'sore') {
      ctx.fillStyle = 'rgba(248, 198, 118, 0.09)';
      ctx.fillRect(0, 0, W.WORLD_WIDTH, W.WORLD_HEIGHT);
    } else if (ambiance === 'senja') {
      ctx.fillStyle = 'rgba(24, 38, 42, 0.38)';
      ctx.fillRect(0, 0, W.WORLD_WIDTH, W.WORLD_HEIGHT);
    }

    // Warm Amber Light Halos (lamps, house windows, mading, pendopo)
    const lightIntensity =
      ambiance === 'senja' ? 0.52 : ambiance === 'sore' ? 0.24 : 0.1;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    function drawWarmHalo(lx, ly, radius, strength) {
      const pulse = 0.94 + Math.sin(time * 2.6 + lx * 0.05) * 0.06;
      const r = radius * pulse;
      const grad = ctx.createRadialGradient(lx, ly, 4, lx, ly, r);
      grad.addColorStop(0, `rgba(255, 206, 102, ${strength})`);
      grad.addColorStop(0.45, `rgba(246, 174, 62, ${strength * 0.45})`);
      grad.addColorStop(1, 'rgba(246, 174, 62, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(lx, ly, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Static village lanterns
    for (let i = 0; i < W.STATIC_LANTERNS.length; i++) {
      const l = W.STATIC_LANTERNS[i];
      drawWarmHalo(l.x, l.y - 30, 82, lightIntensity);
    }

    // Main Road PJU Streetlights warm golden halos along Jalan Raya Utama
    if (W.MAIN_ROAD && Array.isArray(W.MAIN_ROAD.pjuLights)) {
      for (let i = 0; i < W.MAIN_ROAD.pjuLights.length; i++) {
        const px = W.MAIN_ROAD.pjuLights[i];
        drawWarmHalo(px + 16, W.MAIN_ROAD.northSidewalkY - 22, 108, lightIntensity * 1.12);
      }
      if (W.MAIN_ROAD.halte) {
        drawWarmHalo(W.MAIN_ROAD.halte.x, W.MAIN_ROAD.halte.y - 24, 86, lightIntensity * 0.95);
      }
    }

    // Housing Cluster corner garden lamps & guard post warm halos
    if (W.HOUSING_CLUSTER && typeof W.getClusterLamps === 'function') {
      const cLamps = W.getClusterLamps(
        (buildings && buildings._clusterBlockCount) || W.HOUSING_CLUSTER.defaultBlockCount
      );
      for (let i = 0; i < cLamps.length; i++) {
        drawWarmHalo(cLamps[i].x, cLamps[i].y - 28, 76, lightIntensity * 0.92);
      }
      drawWarmHalo(W.HOUSING_CLUSTER.guardPost.x, W.HOUSING_CLUSTER.guardPost.y - 10, 74, lightIntensity * 0.95);
    }

    // Mading warm bulb
    drawWarmHalo(W.MADING.x, W.MADING.y - 32, 74, lightIntensity * 0.9);

    // Fishing pier hanging lantern warm halo
    drawWarmHalo(
      W.FISHING_PIER.x + W.FISHING_PIER.w - 22,
      W.FISHING_PIER.y - 8,
      96,
      lightIntensity * 1.15
    );

    // Pendopo warm interior glow
    drawWarmHalo(
      W.PENDOPO.x + W.PENDOPO.w / 2,
      W.PENDOPO.y + W.PENDOPO.h / 2,
      140,
      lightIntensity * 0.85
    );

    // Player-placed lanterns, minimalist houses, shops, & KOPDES
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      if (b.type === 'lampu') {
        drawWarmHalo(b.x, b.y - 30, 92, lightIntensity * 1.1);
      } else if (b.type === 'rumah') {
        drawWarmHalo(b.x - 16, b.y - 6, 108, lightIntensity * 0.95);
      } else if (b.type === 'usaha') {
        drawWarmHalo(b.x - 10, b.y - 4, 114, lightIntensity * 1.0);
      } else if (b.type === 'kopdes') {
        drawWarmHalo(b.x, b.y - 8, 142, lightIntensity * 1.1);
      }
    }
    ctx.restore();

    // Drifting ambient pollen / golden firefly motes
    ctx.save();
    for (let i = 0; i < floatingMotes.length; i++) {
      const m = floatingMotes[i];
      const mx = (m.x + time * m.speedX) % W.WORLD_WIDTH;
      const my =
        (m.y + time * m.speedY + Math.sin(time * 1.4 + m.phase) * 14 + W.WORLD_HEIGHT) %
        W.WORLD_HEIGHT;
      const twinkle = 0.4 + 0.55 * Math.sin(time * 2.5 + m.phase);
      ctx.fillStyle =
        ambiance === 'senja'
          ? `rgba(255, 224, 128, ${twinkle * 0.9})`
          : `rgba(255, 250, 232, ${twinkle * 0.52})`;
      ctx.beginPath();
      ctx.arc(mx, my, ambiance === 'senja' ? m.radius * 1.25 : m.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function worldToScreen(wx, wy, cam, viewportW, viewportH) {
    const zoom = (cam && cam.zoom) || 1;
    const tiltY = (cam && cam.tiltY) || 1;
    const skewX = (cam && cam.skewX) || 0;
    const cx = cam && typeof cam.cx === 'number' ? cam.cx : (cam ? cam.x + viewportW / 2 : W.PLAZA.x);
    const cy = cam && typeof cam.cy === 'number' ? cam.cy : (cam ? cam.y + viewportH / 2 : W.PLAZA.y);
    const dx = wx - cx;
    const dy = wy - cy;
    return {
      x: viewportW / 2 + zoom * (dx + skewX * dy),
      y: viewportH / 2 + zoom * (tiltY * dy),
    };
  }

  function screenToWorld(sx, sy, cam, viewportW, viewportH) {
    const zoom = (cam && cam.zoom) || 1;
    const tiltY = (cam && cam.tiltY) || 1;
    const skewX = (cam && cam.skewX) || 0;
    const cx = cam && typeof cam.cx === 'number' ? cam.cx : (cam ? cam.x + viewportW / 2 : W.PLAZA.x);
    const cy = cam && typeof cam.cy === 'number' ? cam.cy : (cam ? cam.y + viewportH / 2 : W.PLAZA.y);
    const dy = (sy - viewportH / 2) / (zoom * tiltY);
    const dx = (sx - viewportW / 2) / zoom - skewX * dy;
    return {
      x: cx + dx,
      y: cy + dy,
    };
  }

  function withUpright(ctx, ax, ay, cam, drawFn) {
    const tiltY = (cam && cam.tiltY) || 1;
    const skewX = (cam && cam.skewX) || 0;
    const elevation = (cam && cam.elevation) || 0;
    if (Math.abs(tiltY - 1) < 0.002 && Math.abs(skewX) < 0.002) {
      drawFn();
      return;
    }
    const h = 1 + elevation * 0.1;
    ctx.save();
    ctx.translate(ax, ay);
    ctx.transform(1, 0, -(h * skewX) / tiltY, h / tiltY, 0, 0);
    ctx.translate(-ax, -ay);
    drawFn();
    ctx.restore();
  }

  function drawIsoDepthAccent(ctx, b, elevation) {
    if (elevation < 0.05) return;
    if (b.type !== 'rumah' && b.type !== 'usaha' && b.type !== 'kopdes') return;
    const depth = (b.type === 'kopdes' ? 20 : 16) * elevation;
    const w = b.type === 'kopdes' ? 62 : 52;
    const hTop = b.type === 'kopdes' ? -38 : -32;
    const hBot = 16;
    ctx.save();
    ctx.translate(b.x, b.y);
    // Elongated 3D diorama shadow cast to upper-right
    ctx.fillStyle = `rgba(34, 44, 30, ${0.22 * elevation})`;
    ctx.beginPath();
    ctx.moveTo(w, hBot);
    ctx.lineTo(w + depth * 1.45, hBot - depth * 0.65);
    ctx.lineTo(w + depth * 1.45, hTop - depth * 0.45);
    ctx.lineTo(w, hTop);
    ctx.closePath();
    ctx.fill();
    // 3D shaded timber right side wall for architectural depth
    ctx.fillStyle = b.type === 'kopdes' ? '#704723' : '#855632';
    ctx.beginPath();
    ctx.moveTo(w - 1, hTop);
    ctx.lineTo(w + depth * 0.72, hTop - depth * 0.42);
    ctx.lineTo(w + depth * 0.72, hBot - depth * 0.35);
    ctx.lineTo(w - 1, hBot);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  function renderWorld(ctx, state) {
    const {
      viewportW,
      viewportH,
      camera,
      time,
      now,
      ambiance,
      players,
      mySocketId,
      buildings,
      madingCount,
      hoveredMading,
      hoveredPlayerId,
      buildState,
      walkTarget,
      bubbles,
    } = state;

    const zoom = (camera && camera.zoom) || 1;
    const tiltY = (camera && camera.tiltY) || 1;
    const skewX = (camera && camera.skewX) || 0;
    const elevation = (camera && camera.elevation) || 0;
    const camCx =
      camera && typeof camera.cx === 'number' ? camera.cx : camera.x + viewportW / 2;
    const camCy =
      camera && typeof camera.cy === 'number' ? camera.cy : camera.y + viewportH / 2;
    const camProj = { cx: camCx, cy: camCy, zoom, tiltY, skewX, elevation };

    ctx.save();
    // Scenic outer meadow backdrop visible when zoomed out (Drone) or tilted (Iso 2.5D)
    ctx.fillStyle = ambiance === 'senja' ? '#496148' : '#7b9d70';
    ctx.fillRect(0, 0, viewportW, viewportH);

    // Apply exact ground-plane camera affine transform
    ctx.transform(
      zoom,
      0,
      zoom * skewX,
      zoom * tiltY,
      viewportW / 2 - zoom * (camCx + skewX * camCy),
      viewportH / 2 - zoom * (tiltY * camCy)
    );

    // Subtle elevated 2.5D diorama base rim around the village map when tilted or zoomed out
    if (elevation > 0.05 || zoom < 0.92) {
      const rim = Math.max(10, 22 * elevation);
      ctx.fillStyle = 'rgba(42, 56, 36, 0.34)';
      roundRectPath(ctx, 10, rim, W.WORLD_WIDTH, W.WORLD_HEIGHT, 26);
      ctx.fill();
      ctx.fillStyle = '#6f5236';
      roundRectPath(ctx, 0, Math.min(14, rim * 0.7), W.WORLD_WIDTH, W.WORLD_HEIGHT, 24);
      ctx.fill();
    }

    // 1. Ground, Kavling plots, Natural stone paths, Alun-alun, & Komplek Perumahan Ground
    const housingCluster = state.housingCluster || null;
    drawGround(ctx, time, Boolean(buildState && buildState.selectedType));
    drawHousingClusterGround(ctx, time, housingCluster, buildState);

    // 2. Player-placed ground layer items (Auto-Tiling Paving Jalan Lingkungan!)
    const jalanSet = new Set();
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      if (b.type === 'jalan') {
        jalanSet.add(`${Math.round(b.x / 40) * 40},${Math.round(b.y / 40) * 40}`);
      }
    }
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      if (b.type === 'jalan') {
        drawPavingTileAuto(ctx, b.x, b.y, jalanSet);
      }
    }

    // 2b. Eco-friendly animated vehicles cruising smoothly on Jalan Raya Utama
    drawRoadVehicles(ctx, time, ambiance, players);

    // 3. Pond, Swimming Koi, Lily Pads, Wooden Bridge, & Fishing Pier
    drawPondAndBridge(ctx, time);

    // 4. Pendopo Modern Floor Deck & Pasar Malam Courtyard/Stage (underneath characters)
    drawPendopoFloor(ctx);
    const festivalMode = Boolean(state.festivalMode);
    const stagePerformers = players.filter((p) => Boolean(p.performing));
    const ferrisRiders = players.filter((p) => Boolean(p.ferrisRide));
    drawNightMarketGround(ctx, time, ambiance, festivalMode, stagePerformers.length > 0);

    // 5. Tap-to-walk subtle destination ripple
    if (walkTarget) {
      const pulse = 8 + Math.sin(time * 7) * 3;
      ctx.save();
      ctx.strokeStyle = 'rgba(255, 248, 224, 0.85)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(walkTarget.x, walkTarget.y, pulse, pulse * 0.5, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // 6. Y-Sorted Render Queue for 2.5D depth (all upright elements stand tall in Iso 2.5D!)
    const renderables = [];

    // Perimeter trees
    for (let i = 0; i < W.BORDER_TREES.length; i++) {
      const t = W.BORDER_TREES[i];
      renderables.push({
        sortY: t.y + 8,
        draw: () =>
          withUpright(ctx, t.x, t.y, camProj, () =>
            drawLushTree(ctx, t.x, t.y, t.scale, t.shade, time, false)
          ),
      });
    }

    // Static village lanterns
    for (let i = 0; i < W.STATIC_LANTERNS.length; i++) {
      const l = W.STATIC_LANTERNS[i];
      renderables.push({
        sortY: l.y + 6,
        draw: () => withUpright(ctx, l.x, l.y, camProj, () => drawLantern(ctx, l.x, l.y, time)),
      });
    }

    // Mading Kampung
    renderables.push({
      sortY: W.MADING.y + 20,
      draw: () =>
        withUpright(ctx, W.MADING.x, W.MADING.y + 18, camProj, () =>
          drawMadingBoard(ctx, time, hoveredMading, madingCount)
        ),
    });

    // Fishing Leaderboard Signboard beside the pier
    renderables.push({
      sortY: W.FISHING_BOARD.y + 14,
      draw: () =>
        withUpright(ctx, W.FISHING_BOARD.x, W.FISHING_BOARD.y + 12, camProj, () =>
          drawFishingBoard(ctx, time, Boolean(state.hoveredFishingBoard))
        ),
    });

    // Gerbang Kampung
    renderables.push({
      sortY: W.GATE.y + 12,
      draw: () => withUpright(ctx, W.GATE.x, W.GATE.y + 10, camProj, () => drawGate(ctx, time)),
    });

    // Main Road upright infrastructure: PJU Streetlights, Mini Halte, Traffic Signs
    if (W.MAIN_ROAD) {
      const mr = W.MAIN_ROAD;
      for (let i = 0; i < mr.pjuLights.length; i++) {
        const px = mr.pjuLights[i];
        const py = mr.northSidewalkY + 4;
        renderables.push({
          sortY: py + 6,
          draw: () =>
            withUpright(ctx, px, py, camProj, () => drawPjuLamp(ctx, px, py, time, ambiance)),
        });
      }
      if (mr.halte) {
        renderables.push({
          sortY: mr.halte.y + 8,
          draw: () =>
            withUpright(ctx, mr.halte.x, mr.halte.y, camProj, () =>
              drawMiniHalte(ctx, mr.halte, time)
            ),
        });
      }
      for (let i = 0; i < mr.signs.length; i++) {
        const sg = mr.signs[i];
        renderables.push({
          sortY: sg.y + 6,
          draw: () => withUpright(ctx, sg.x, sg.y, camProj, () => drawMiniTrafficSign(ctx, sg)),
        });
      }
    }

    // Wooden Directional Signposts at Neighborhood Road Intersections
    if (Array.isArray(W.ROAD_SIGNS)) {
      for (let i = 0; i < W.ROAD_SIGNS.length; i++) {
        const rs = W.ROAD_SIGNS[i];
        renderables.push({
          sortY: rs.y + 6,
          draw: () => withUpright(ctx, rs.x, rs.y, camProj, () => drawRoadDirectionSign(ctx, rs)),
        });
      }
    }

    // Area Komplek Perumahan upright structures (Gate, Pos Ronda, Papan Direktori, Corner Lamps)
    if (W.HOUSING_CLUSTER) {
      const hc = W.HOUSING_CLUSTER;
      const cBlockCount = (housingCluster && housingCluster.blockCount) || hc.defaultBlockCount;
      const cKavlings =
        (housingCluster && Array.isArray(housingCluster.kavlings) && housingCluster.kavlings) ||
        W.generateClusterKavlings(cBlockCount);
      const occCount = cKavlings.filter((k) => Boolean(k.occupiedByBuildingId)).length;

      renderables.push({
        sortY: hc.gate.y + 8,
        draw: () =>
          withUpright(ctx, hc.gate.x, hc.gate.y, camProj, () => drawClusterGate(ctx, time)),
      });
      renderables.push({
        sortY: hc.guardPost.y + 10,
        draw: () =>
          withUpright(ctx, hc.guardPost.x, hc.guardPost.y, camProj, () =>
            drawGuardPost(ctx, time)
          ),
      });
      renderables.push({
        sortY: hc.directoryBoard.y + 12,
        draw: () =>
          withUpright(ctx, hc.directoryBoard.x, hc.directoryBoard.y, camProj, () =>
            drawClusterDirectoryBoard(
              ctx,
              time,
              Boolean(state.hoveredClusterDirectory),
              occCount,
              cKavlings.length
            )
          ),
      });
      const cLamps = W.getClusterLamps(cBlockCount);
      for (let i = 0; i < cLamps.length; i++) {
        const cl = cLamps[i];
        renderables.push({
          sortY: cl.y + 6,
          draw: () => withUpright(ctx, cl.x, cl.y, camProj, () => drawLantern(ctx, cl.x, cl.y, time)),
        });
      }
    }

    // Area Pasar Malam & Hiburan upright attractions (Gate, 3 Food Stalls, Bianglala Mini, Roda Keberuntungan)
    if (W.NIGHT_MARKET) {
      const nm = W.NIGHT_MARKET;
      const hovNm = state.hoveredNightMarket;

      // Gerbang Kayu '🎪 Pasar Malam Kampung'
      renderables.push({
        sortY: nm.gate.y + 8,
        draw: () =>
          withUpright(ctx, nm.gate.x, nm.gate.y, camProj, () =>
            drawNightMarketGate(ctx, time, festivalMode)
          ),
      });

      // 3 Stand Kuliner & Jajanan
      for (let i = 0; i < nm.foodStalls.length; i++) {
        const stall = nm.foodStalls[i];
        const isHov = Boolean(hovNm && hovNm.kind === 'food' && hovNm.id === stall.id);
        renderables.push({
          sortY: stall.y + 22,
          draw: () =>
            withUpright(ctx, stall.x, stall.y + 12, camProj, () =>
              drawFoodStall(ctx, stall, time, isHov, festivalMode)
            ),
        });
      }

      // Bianglala Mini (with any riding players inside rotating gondolas!)
      renderables.push({
        sortY: nm.ferrisWheel.y + 16,
        draw: () =>
          withUpright(ctx, nm.ferrisWheel.x, nm.ferrisWheel.y + 8, camProj, () =>
            drawFerrisWheel(
              ctx,
              nm.ferrisWheel,
              time,
              ferrisRiders,
              Boolean(hovNm && hovNm.kind === 'ferris'),
              festivalMode
            )
          ),
      });

      // Booth Roda Keberuntungan (Lucky Wheel)
      renderables.push({
        sortY: nm.luckyWheel.y + 18,
        draw: () =>
          withUpright(ctx, nm.luckyWheel.x, nm.luckyWheel.y + 10, camProj, () =>
            drawLuckyWheelBooth(
              ctx,
              nm.luckyWheel,
              time,
              state.wheelSpinAnim,
              Boolean(hovNm && hovNm.kind === 'wheel'),
              festivalMode
            )
          ),
      });
    }

    // Non-ground player buildings
    const hovInt = state.hoveredInteractiveBuilding;
    for (let i = 0; i < buildings.length; i++) {
      const b = buildings[i];
      if (b.type === 'jalan') continue;
      const offsetY =
        b.type === 'kopdes' ? 28 : b.type === 'rumah' || b.type === 'usaha' ? 22 : b.type === 'bangku' ? 10 : 8;
      const isHoveredInteractive = Boolean(hovInt && hovInt.id === b.id);
      renderables.push({
        sortY: b.y + offsetY,
        draw: () =>
          withUpright(ctx, b.x, b.y + 12, camProj, () => {
            drawIsoDepthAccent(ctx, b, elevation);
            drawBuilding(ctx, b, time);
            if (isHoveredInteractive) {
              const halfW = b.type === 'kopdes' ? 76 : 62;
              const topY = b.type === 'kopdes' ? b.y - 62 : b.y - 54;
              const boxH = b.type === 'kopdes' ? 122 : 108;
              ctx.save();
              ctx.strokeStyle = '#f2b43b';
              ctx.lineWidth = 2.4;
              ctx.setLineDash([7, 5]);
              roundRectPath(ctx, b.x - halfW, topY, halfW * 2, boxH, 14);
              ctx.stroke();
              ctx.setLineDash([]);

              const hint = hovInt.hint || 'Klik untuk berinteraksi';
              ctx.font = '700 11px "Plus Jakarta Sans", "Segoe UI", sans-serif';
              const tw = ctx.measureText(hint).width + 18;
              ctx.fillStyle =
                b.type === 'kopdes'
                  ? 'rgba(116, 72, 26, 0.96)'
                  : b.type === 'usaha'
                  ? 'rgba(146, 86, 44, 0.96)'
                  : 'rgba(72, 106, 68, 0.95)';
              roundRectPath(ctx, b.x - tw / 2, topY - 24, tw, 22, 11);
              ctx.fill();
              ctx.fillStyle = '#ffffff';
              ctx.textAlign = 'center';
              ctx.textBaseline = 'middle';
              ctx.fillText(hint, b.x, topY - 13);
              ctx.restore();
            }
          }),
      });
    }

    // All online players
    let me = null;
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      const isMe = p.socketId === mySocketId;
      if (isMe) me = p;
      // Citizens currently riding Bianglala Mini are rendered inside its rotating cabin!
      if (p.ferrisRide) continue;
      const isFocused = Boolean(
        (state.focusSocketId && p.socketId === state.focusSocketId) ||
        (state.selectedPlayerId && p.socketId === state.selectedPlayerId)
      );
      renderables.push({
        sortY: p.y + 6,
        draw: () =>
          withUpright(ctx, p.x, p.y, camProj, () =>
            drawPlayer(ctx, p, isMe, p.socketId === hoveredPlayerId, isFocused, time, now)
          ),
      });
    }

    renderables.sort((a, b) => a.sortY - b.sortY);
    for (let i = 0; i < renderables.length; i++) {
      renderables[i].draw();
    }

    // 7. Pendopo Roof Canopy (semi-translucent when player enters!)
    drawPendopoRoofOverlay(ctx, me);

    // 8. Build Mode Ghost Preview or Delete Mode Highlight
    if (buildState && buildState.selectedType && buildState.previewPos) {
      const { selectedType, previewPos, validation, houseLabel } = buildState;
      const meta = W.BUILD_CATALOG_MAP[selectedType];
      ctx.save();
      // Validation halo ring stays flat on the ground plane
      ctx.strokeStyle = validation && validation.ok ? '#4c9652' : '#d65548';
      ctx.fillStyle =
        validation && validation.ok
          ? 'rgba(116, 192, 114, 0.22)'
          : 'rgba(218, 92, 78, 0.22)';
      ctx.lineWidth = 2.4;
      ctx.setLineDash([7, 5]);
      ctx.beginPath();
      ctx.ellipse(
        previewPos.x,
        previewPos.y + 6,
        (meta ? meta.width : 50) * 0.56,
        (meta ? meta.height : 40) * 0.42,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();
      ctx.setLineDash([]);

      // Ghost preview sprite (upright for 3D buildings/trees, auto-tiled flat for Paving Jalan Lingkungan)
      const drawGhost = () => {
        ctx.save();
        ctx.globalAlpha = 0.78;
        if (selectedType === 'jalan') {
          drawPavingTileAuto(ctx, previewPos.x, previewPos.y, jalanSet);
        } else {
          drawBuilding(
            ctx,
            {
              type: selectedType,
              x: previewPos.x,
              y: previewPos.y,
              label: selectedType === 'rumah' ? houseLabel || 'Rumah Baru' : '',
            },
            time
          );
        }
        ctx.restore();
      };
      if (selectedType === 'jalan') {
        drawGhost();
      } else {
        withUpright(ctx, previewPos.x, previewPos.y + 12, camProj, drawGhost);
      }

      // Short floating placement tip (always upright and legible)
      const snapLabel =
        buildState.snappedKavlingCode && validation && validation.ok
          ? `🏡 Snap ke ${buildState.snappedKavlingCode} — Klik bangun!`
          : '';
      const tipText =
        snapLabel ||
        (validation && validation.ok
          ? `Klik untuk bangun ${meta ? meta.shortName : ''}`
          : validation
          ? validation.reason
          : '');
      if (tipText) {
        withUpright(ctx, previewPos.x, previewPos.y, camProj, () => {
          ctx.font = '700 11.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
          const tw = ctx.measureText(tipText).width + 18;
          ctx.fillStyle =
            validation && validation.ok
              ? 'rgba(57, 102, 59, 0.92)'
              : 'rgba(186, 66, 56, 0.94)';
          roundRectPath(ctx, previewPos.x - tw / 2, previewPos.y - 68, tw, 22, 11);
          ctx.fill();
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(tipText, previewPos.x, previewPos.y - 57);
        });
      }
      ctx.restore();
    } else if (buildState && buildState.deleteMode && buildState.hoveredBuilding) {
      const hb = buildState.hoveredBuilding;
      const meta = W.BUILD_CATALOG_MAP[hb.type];
      ctx.save();
      ctx.strokeStyle = '#d65548';
      ctx.fillStyle = 'rgba(214, 85, 72, 0.2)';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(
        hb.x,
        hb.y + 6,
        (meta ? meta.width : 50) * 0.58,
        (meta ? meta.height : 40) * 0.44,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.stroke();

      withUpright(ctx, hb.x, hb.y, camProj, () => {
        const msg = `🗑️ Klik untuk hapus ${meta ? meta.shortName : ''}`;
        ctx.font = '700 11.5px "Plus Jakarta Sans", "Segoe UI", sans-serif';
        const tw = ctx.measureText(msg).width + 18;
        ctx.fillStyle = 'rgba(182, 62, 52, 0.94)';
        roundRectPath(ctx, hb.x - tw / 2, hb.y - 60, tw, 22, 11);
        ctx.fill();
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(msg, hb.x, hb.y - 49);
      });
      ctx.restore();
    }

    // 9. Warm Amber Lighting, Drifting Motes, Pasar Malam String Lights, Music Notes & Fireworks
    drawLightingAndParticles(ctx, time, ambiance, buildings);
    drawNightMarketStringLightsAndEffects(ctx, time, ambiance, festivalMode, stagePerformers);

    // 10. Social Overlay Layer (Fishing Rods/Bobbers/STRIKE, Chat, Greeting, Whisper & Megaphone — upright!)
    const whispers = state.whispers;
    const greetEffects = state.greetEffects;
    const megaphoneSpeakers = state.megaphoneSpeakers;
    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      if (p.fishing && p.fishing.state !== 'idle') {
        drawFishingAction(ctx, p, time);
      }
      let ox = p.x;
      let oy = p.y;
      if (p.ferrisRide && W.NIGHT_MARKET) {
        const cab = getFerrisCabinPosition(W.NIGHT_MARKET.ferrisWheel, p.ferrisRide.cabinIndex || 0, time);
        ox = cab.x;
        oy = cab.y + 12;
      }
      withUpright(ctx, ox, oy, camProj, () => {
        const meg = megaphoneSpeakers && megaphoneSpeakers.get(p.socketId);
        if (meg && (meg.talking || now < meg.until)) {
          ctx.save();
          for (let rIdx = 0; rIdx < 3; rIdx++) {
            const prog = ((time * 1.15 + rIdx * 0.33) % 1);
            const rad = 18 + prog * 54;
            ctx.strokeStyle = `rgba(246, 178, 52, ${(1 - prog) * 0.78})`;
            ctx.lineWidth = 2.4;
            ctx.beginPath();
            ctx.arc(ox, oy - 20, rad, 0, Math.PI * 2);
            ctx.stroke();
          }
          const badgeText = meg.talking ? '🎙️ Sedang Bicara...' : '📢 Megafon Kampung';
          ctx.font = '800 11px "Plus Jakarta Sans", "Segoe UI", sans-serif';
          const tw = ctx.measureText(badgeText).width + 18;
          const by = oy - 68;
          ctx.fillStyle = 'rgba(218, 128, 38, 0.96)';
          roundRectPath(ctx, ox - tw / 2, by - 11, tw, 22, 11);
          ctx.fill();
          ctx.strokeStyle = '#fff5d8';
          ctx.lineWidth = 1.5;
          ctx.stroke();
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(badgeText, ox, by);
          ctx.restore();
        }
        const bubble = bubbles.get(p.socketId);
        if (bubble) {
          drawChatBubble(ctx, ox, oy, bubble, now, time);
        }
        const whisper = whispers && whispers.get(p.socketId);
        if (whisper) {
          drawWhisperBubble(ctx, ox, oy, whisper, now, time, bubble ? 54 : 0);
        }
        const gx = greetEffects && greetEffects.get(p.socketId);
        if (gx) {
          drawTargetGreetEffect(ctx, ox, oy - (bubble || whisper ? 48 : 0), gx, now, time);
        }
      });
    }

    ctx.restore();

    // 11. Screen-space Off-Screen Directional Pointer Arrows for Visitors Outside Viewport
    if (Array.isArray(state.offscreenHits)) {
      state.offscreenHits.length = 0;
    }
    const padLeft = 74;
    const padRight = viewportW > 860 ? 355 : 74;
    const padTop = 82;
    const padBottom = 132;

    for (let i = 0; i < players.length; i++) {
      const p = players[i];
      if (p.socketId === mySocketId) continue;

      const sp = worldToScreen(p.x, p.y, camProj, viewportW, viewportH);
      const margin = 24;
      if (sp.x >= margin && sp.x <= viewportW - margin && sp.y >= margin && sp.y <= viewportH - margin) {
        continue; // Visitor is already visible inside viewport!
      }

      const dx = sp.x - viewportW / 2;
      const dy = sp.y - viewportH / 2;
      const angle = Math.atan2(dy, dx);
      const distMeters = Math.max(1, Math.round(Math.hypot(p.x - camCx, p.y - camCy) / 10));

      const minX = padLeft;
      const maxX = Math.max(minX + 40, viewportW - padRight);
      const minY = padTop;
      const maxY = Math.max(minY + 40, viewportH - padBottom);
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;
      const halfW = (maxX - minX) / 2;
      const halfH = (maxY - minY) / 2;

      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const tx = Math.abs(cos) > 0.0001 ? halfW / Math.abs(cos) : Infinity;
      const ty = Math.abs(sin) > 0.0001 ? halfH / Math.abs(sin) : Infinity;
      const t = Math.min(tx, ty);
      const px = Math.max(minX, Math.min(maxX, cx + cos * t));
      const py = Math.max(minY, Math.min(maxY, cy + sin * t));

      const label = `${p.name} · ${distMeters}m`;
      ctx.save();
      ctx.font = '700 11px "Plus Jakarta Sans", "Segoe UI", sans-serif';
      const pillW = Math.min(148, ctx.measureText(label).width + 34);
      const pillH = 26;

      // Soft pill shadow
      ctx.fillStyle = 'rgba(42, 37, 25, 0.2)';
      roundRectPath(ctx, px - pillW / 2 + 1, py - pillH / 2 + 2, pillW, pillH, 13);
      ctx.fill();

      // Warm cream pill
      ctx.fillStyle = 'rgba(251, 246, 234, 0.96)';
      roundRectPath(ctx, px - pillW / 2, py - pillH / 2, pillW, pillH, 13);
      ctx.fill();
      ctx.strokeStyle = '#d6b267';
      ctx.lineWidth = 1.6;
      ctx.stroke();

      // Directional arrow indicator pointing toward visitor
      ctx.save();
      ctx.translate(px + Math.cos(angle) * (pillW / 2 + 7), py + Math.sin(angle) * (pillH / 2 + 7));
      ctx.rotate(angle);
      ctx.fillStyle = '#d99b38';
      ctx.beginPath();
      ctx.moveTo(6, 0);
      ctx.lineTo(-4, -5);
      ctx.lineTo(-2, 0);
      ctx.lineTo(-4, 5);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Visitor shirt color dot
      ctx.fillStyle = (p.avatar && p.avatar.shirtColor) || '#5f8d63';
      ctx.beginPath();
      ctx.arc(px - pillW / 2 + 12, py, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // Visitor name & distance
      ctx.fillStyle = '#3d3022';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(label, px - pillW / 2 + 21, py);
      ctx.restore();

      if (Array.isArray(state.offscreenHits)) {
        state.offscreenHits.push({
          socketId: p.socketId,
          x: px - pillW / 2,
          y: py - pillH / 2,
          w: pillW,
          h: pillH,
        });
      }
    }
  }

  function renderMinimap(ctx, width, height, state) {
    const sx = width / W.WORLD_WIDTH;
    const sy = height / W.WORLD_HEIGHT;

    ctx.clearRect(0, 0, width, height);

    // Sage grass base
    ctx.fillStyle = '#8eb082';
    ctx.fillRect(0, 0, width, height);

    // Eco-plots (Kavling)
    ctx.fillStyle = 'rgba(176, 206, 158, 0.75)';
    for (let i = 0; i < W.PLOTS.length; i++) {
      const pl = W.PLOTS[i];
      ctx.fillRect(pl.x * sx, pl.y * sy, pl.w * sx, pl.h * sy);
    }

    // Neighborhood Paving Roads & Main Asphalt Road on minimap
    if (Array.isArray(W.NEIGHBORHOOD_ROADS)) {
      ctx.fillStyle = '#ddd0b7';
      for (let i = 0; i < W.NEIGHBORHOOD_ROADS.length; i++) {
        const r = W.NEIGHBORHOOD_ROADS[i];
        ctx.fillRect(r.x * sx, r.y * sy, Math.max(2, r.w * sx), Math.max(2, r.h * sy));
      }
    }
    if (W.MAIN_ROAD) {
      const mr = W.MAIN_ROAD;
      ctx.fillStyle = '#d7cab2';
      ctx.fillRect(0, mr.northSidewalkY * sy, width, (mr.southSidewalkY + mr.southSidewalkH - mr.northSidewalkY) * sy);
      ctx.fillStyle = '#40464d';
      ctx.fillRect(0, mr.asphaltY * sy, width, mr.asphaltH * sy);
      ctx.fillStyle = '#f8f5ec';
      ctx.fillRect(mr.zebraX * sx, mr.asphaltY * sy, Math.max(4, mr.zebraW * sx), mr.asphaltH * sy);
    }

    // Alun-alun plaza
    ctx.fillStyle = '#ebe2cf';
    ctx.beginPath();
    ctx.arc(W.PLAZA.x * sx, W.PLAZA.y * sy, W.PLAZA.stoneRadius * sx, 0, Math.PI * 2);
    ctx.fill();

    // Pendopo Modern
    ctx.fillStyle = '#9b6b41';
    ctx.fillRect(W.PENDOPO.x * sx, W.PENDOPO.y * sy, W.PENDOPO.w * sx, W.PENDOPO.h * sy);

    // Area Pasar Malam & Hiburan on minimap
    if (W.NIGHT_MARKET) {
      const nb = W.NIGHT_MARKET.bounds;
      ctx.fillStyle = state.festivalMode ? '#f6c85f' : '#e6cfa2';
      ctx.fillRect(nb.x * sx, nb.y * sy, nb.w * sx, nb.h * sy);
      ctx.strokeStyle = '#c86d4b';
      ctx.lineWidth = 1;
      ctx.strokeRect(nb.x * sx, nb.y * sy, nb.w * sx, nb.h * sy);
    }

    // Area Komplek Perumahan on minimap
    if (W.HOUSING_CLUSTER) {
      const hb = W.HOUSING_CLUSTER.bounds;
      const hcState = state.housingCluster;
      const bc = (hcState && hcState.blockCount) || W.HOUSING_CLUSTER.defaultBlockCount;
      ctx.fillStyle = 'rgba(154, 194, 142, 0.85)';
      ctx.fillRect(hb.x * sx, hb.y * sy, hb.w * sx, hb.h * sy);
      ctx.strokeStyle = '#5f8d63';
      ctx.lineWidth = 1;
      ctx.strokeRect(hb.x * sx, hb.y * sy, hb.w * sx, hb.h * sy);
      const cRoads = W.getClusterRoads(bc);
      ctx.fillStyle = '#ddd0b7';
      for (let i = 0; i < cRoads.length; i++) {
        const r = cRoads[i];
        ctx.fillRect(r.x * sx, r.y * sy, Math.max(1.5, r.w * sx), Math.max(1.5, r.h * sy));
      }
    }

    // Clear blue Pond & Bridge
    ctx.fillStyle = '#5bb0bc';
    for (let i = 0; i < W.POND.ellipses.length; i++) {
      const e = W.POND.ellipses[i];
      ctx.beginPath();
      ctx.ellipse(e.cx * sx, e.cy * sy, e.rx * sx, e.ry * sy, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = '#b98656';
    ctx.fillRect(W.BRIDGE.x * sx, W.BRIDGE.y * sy, W.BRIDGE.w * sx, W.BRIDGE.h * sy);
    ctx.fillRect(
      W.FISHING_PIER.x * sx,
      W.FISHING_PIER.y * sy,
      W.FISHING_PIER.w * sx,
      W.FISHING_PIER.h * sy
    );

    // Placed houses & trees
    const bList = state.buildings || [];
    for (let i = 0; i < bList.length; i++) {
      const b = bList[i];
      if (b.type === 'rumah') {
        ctx.fillStyle = '#594230';
        ctx.fillRect(b.x * sx - 3.5, b.y * sy - 2.5, 7, 5);
        ctx.fillStyle = '#ffd275';
        ctx.fillRect(b.x * sx - 2, b.y * sy - 1, 3, 2);
      } else if (b.type === 'usaha') {
        ctx.fillStyle = '#c86d4b';
        ctx.fillRect(b.x * sx - 3.5, b.y * sy - 2.5, 7, 5);
        ctx.fillStyle = '#fff5d8';
        ctx.fillRect(b.x * sx - 2, b.y * sy - 1, 4, 2);
      } else if (b.type === 'kopdes') {
        ctx.fillStyle = '#7d4f24';
        ctx.fillRect(b.x * sx - 4.5, b.y * sy - 3, 9, 6);
        ctx.fillStyle = '#f6c85f';
        ctx.fillRect(b.x * sx - 2.5, b.y * sy - 1.5, 5, 3);
      } else if (b.type === 'pohon') {
        ctx.fillStyle = '#4e7a4c';
        ctx.beginPath();
        ctx.arc(b.x * sx, b.y * sy, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Current camera viewport box (projected accurately across Top-Down, Iso 2.5D, Drone, and Zoom!)
    if (state.camera) {
      const tl = screenToWorld(0, 0, state.camera, state.viewportW, state.viewportH);
      const br = screenToWorld(state.viewportW, state.viewportH, state.camera, state.viewportW, state.viewportH);
      const rx = Math.max(0, Math.min(W.WORLD_WIDTH, tl.x));
      const ry = Math.max(0, Math.min(W.WORLD_HEIGHT, tl.y));
      const rx2 = Math.max(0, Math.min(W.WORLD_WIDTH, br.x));
      const ry2 = Math.max(0, Math.min(W.WORLD_HEIGHT, br.y));
      ctx.strokeStyle = 'rgba(255, 250, 236, 0.92)';
      ctx.lineWidth = 1.4;
      ctx.strokeRect(rx * sx, ry * sy, Math.max(6, (rx2 - rx) * sx), Math.max(6, (ry2 - ry) * sy));
    }

    // Online players on minimap
    const pList = state.players || [];
    for (let i = 0; i < pList.length; i++) {
      const p = pList[i];
      const px = p.x * sx;
      const py = p.y * sy;
      const isMe = p.socketId === state.mySocketId;
      const isFocused = Boolean(state.focusSocketId && p.socketId === state.focusSocketId);

      if (isMe || isFocused) {
        const pulse = 5 + Math.sin((state.time || 0) * 5) * 1.6;
        ctx.strokeStyle = isMe ? '#ffd275' : '#ff7b54';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.arc(px, py, pulse, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = isMe ? '#487646' : (p.avatar && p.avatar.shirtColor) || '#d97b43';
      ctx.beginPath();
      ctx.arc(px, py, isMe ? 3.8 : 3.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fffdf8';
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
  }

  function renderAvatarPreview(ctx, width, height, avatar, time) {
    ctx.clearRect(0, 0, width, height);
    // Soft sage radial backdrop
    const grad = ctx.createRadialGradient(width / 2, height * 0.62, 6, width / 2, height * 0.62, width * 0.5);
    grad.addColorStop(0, '#eef5e8');
    grad.addColorStop(1, '#dce9d4');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Small meadow mound
    ctx.fillStyle = '#a3c196';
    ctx.beginPath();
    ctx.ellipse(width / 2, height * 0.78, 36, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    drawCharacterSprite(ctx, width / 2, height * 0.75, avatar, 'down', false, time, 1.55);
  }

  root.VILLAGE_RENDERER = {
    renderWorld,
    renderMinimap,
    renderAvatarPreview,
    worldToScreen,
    screenToWorld,
  };
})(typeof self !== 'undefined' ? self : this);
