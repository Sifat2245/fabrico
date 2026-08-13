'use client';

import { useMemo } from 'react';
import * as THREE from 'three';
import { CustomizerState, EraserPath } from '../app/customizer/components/types';

const CANVAS_SIZE = 1024;

// ─── Text rendering ──────────────────────────────────────────────────────────

function getFontString(size: number, fontStyle: string, fontWeight: string | number = '700'): string {
  if (fontStyle === 'Italic') return `italic 900 ${size}px Impact, sans-serif`;
  if (fontStyle === 'Script') return `bold ${size}px "Brush Script MT", cursive`;
  if (fontStyle === 'Block') return `900 ${size}px "Courier New", monospace`;
  if (fontStyle === 'Varsity') return `900 ${size}px "Arial Black", sans-serif`;
  if (fontStyle === 'Serif Athletic') return `900 ${size}px "Georgia", serif`;
  if (fontStyle === 'Cyberpunk') return `900 ${size}px "Courier New", monospace`;
  if (fontStyle === 'Neon Glow') return `400 ${size}px "Courier New", monospace`;
  if (fontStyle === 'Gothic') return `400 ${size}px "Times New Roman", serif`;
  if (fontStyle === 'Outline') return `${fontWeight} ${size}px Impact, sans-serif`;
  if (fontStyle === 'Default') return `${fontWeight} ${size}px Impact, sans-serif`;
  return `${fontWeight} ${size}px "${fontStyle}", sans-serif`;
}

function drawTextLayer(ctx: CanvasRenderingContext2D, layer: any) {
  const isOutline = layer.font === 'Outline';
  const isNeon = layer.font === 'Neon Glow';
  const weight = layer.fontWeight || '700';

  ctx.save();
  ctx.translate(layer.x, layer.y);
  ctx.rotate((layer.rotation * Math.PI) / 180);
  ctx.scale(layer.scale, layer.scale);

  const rawLines = layer.text.split('\n');
  const lineH = layer.textSize * (layer.lineSpacing || 1.15);
  const totalH = (rawLines.length - 1) * lineH;
  const vOff = -totalH / 2;

  rawLines.forEach((line: string, li: number) => {
    const curY = vOff + li * lineH;
    ctx.font = getFontString(layer.textSize, layer.font, weight);
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    if (isNeon) {
      ctx.shadowColor = layer.color;
      ctx.shadowBlur = Math.max(12, layer.textSize * 0.18);
      ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
    } else if (layer.shadowEnabled) {
      ctx.shadowColor = layer.shadowColor || '#000';
      ctx.shadowBlur = layer.shadowBlur || 10;
      ctx.shadowOffsetX = layer.shadowOffsetX || 4;
      ctx.shadowOffsetY = layer.shadowOffsetY || 4;
    } else {
      ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
    }

    if (Math.abs(layer.curveRadius) > 0.01) {
      const sweepAngle = Math.abs(layer.curveRadius) * Math.PI / 180;
      
      // Calculate individual character widths
      let totalWidth = 0;
      const charWidths: number[] = [];
      for (let i = 0; i < line.length; i++) {
        const w = ctx.measureText(line[i]).width;
        charWidths.push(w);
        totalWidth += w;
        if (i < line.length - 1) {
          totalWidth += layer.letterSpacing;
        }
      }

      const R = totalWidth / sweepAngle;
      const sign = layer.curveRadius > 0 ? 1 : -1;

      let currentDist = 0;
      for (let i = 0; i < line.length; i++) {
        const charW = charWidths[i];
        const distToCenter = currentDist + charW / 2;
        const alpha = -sweepAngle / 2 + (distToCenter / totalWidth) * sweepAngle;

        // Position coordinates along the arc relative to the layout baseline
        const cx = R * Math.sin(alpha);
        const cy = sign * (R - R * Math.cos(alpha)) + curY;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(alpha);

        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        if (layer.outlineEnabled) {
          ctx.strokeStyle = layer.outlineColor || '#FFF';
          ctx.lineWidth = layer.outlineWidth || 4;
          ctx.strokeText(line[i], 0, 0);
        } else if (isOutline) {
          ctx.strokeStyle = layer.color;
          ctx.lineWidth = Math.max(2, layer.textSize * 0.04);
          ctx.strokeText(line[i], 0, 0);
        }

        if (!isOutline) {
          ctx.fillStyle = layer.color;
          ctx.fillText(line[i], 0, 0);
        }

        ctx.restore();
        currentDist += charW + layer.letterSpacing;
      }
    } else {
      // Flat drawing fallback
      if (layer.outlineEnabled) {
        ctx.strokeStyle = layer.outlineColor || '#FFF';
        ctx.lineWidth = layer.outlineWidth || 4;
        ctx.strokeText(line, 0, curY);
      } else if (isOutline) {
        ctx.strokeStyle = layer.color;
        ctx.lineWidth = Math.max(2, layer.textSize * 0.04);
        ctx.strokeText(line, 0, curY);
      }

      if (!isOutline) {
        ctx.fillStyle = layer.color;
        ctx.fillText(line, 0, curY);
      }
    }
  });

  ctx.restore();
}

// ─── Pattern drawing ─────────────────────────────────────────────────────────

function drawDesignPattern(ctx: CanvasRenderingContext2D, pattern: string, sec: string) {
  if (!pattern || pattern === 'plain') return;
  const S = CANVAS_SIZE;
  const sc = S / 100;
  ctx.save();
  ctx.fillStyle = sec;
  ctx.strokeStyle = sec;

  switch (pattern) {
    case 'strike': ctx.beginPath(); ctx.moveTo(60*sc,10*sc); ctx.lineTo(80*sc,10*sc); ctx.lineTo(50*sc,90*sc); ctx.lineTo(30*sc,90*sc); ctx.closePath(); ctx.fill(); break;
    case 'save': ctx.fillRect(0,0,45*sc,S); break;
    case 'fastbreak': ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(30*sc,0); ctx.lineTo(0,50*sc); ctx.closePath(); ctx.fill(); ctx.beginPath(); ctx.moveTo(100*sc,50*sc); ctx.lineTo(100*sc,100*sc); ctx.lineTo(70*sc,100*sc); ctx.closePath(); ctx.fill(); break;
    case 'final': ctx.fillRect(0,0,35*sc,S); ctx.fillRect(65*sc,0,35*sc,S); break;
    case 'victory': ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(40*sc,0); ctx.lineTo(20*sc,100*sc); ctx.lineTo(0,100*sc); ctx.closePath(); ctx.fill(); break;
    case 'city': ctx.lineWidth=4*sc; [25,50,75].forEach(y=>{ctx.beginPath();ctx.moveTo(0,y*sc);ctx.lineTo(S,y*sc);ctx.stroke();}); break;
    case 'pure': ctx.beginPath(); ctx.moveTo(70*sc,0); ctx.lineTo(100*sc,0); ctx.lineTo(100*sc,40*sc); ctx.closePath(); ctx.fill(); break;
    case 'level': ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(55*sc,0); ctx.lineTo(0,70*sc); ctx.closePath(); ctx.fill(); break;
    case 'vivo': ctx.beginPath(); ctx.moveTo(60*sc,100*sc); ctx.lineTo(100*sc,0); ctx.lineTo(100*sc,100*sc); ctx.closePath(); ctx.fill(); break;
    case 'league': ctx.fillRect(0,0,50*sc,S); break;
    case 'raid': ctx.fillRect(0,0,S,50*sc); break;
    case 'rush': ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(0,100*sc); ctx.lineTo(40*sc,100*sc); ctx.closePath(); ctx.fill(); break;
    case 'score': ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(100*sc,0); ctx.lineTo(100*sc,100*sc); ctx.closePath(); ctx.fill(); break;
    case 'avatar': ctx.beginPath(); ctx.moveTo(0,100*sc); ctx.lineTo(45*sc,0); ctx.lineTo(55*sc,0); ctx.lineTo(0,100*sc); ctx.closePath(); ctx.fill(); break;
    case 'Stripes': {
      ctx.fillStyle='rgba(255,255,255,0.18)';
      for(let i=0;i<S;i+=64){ctx.fillRect(i,0,24,S);ctx.fillRect(i+36,0,4,S);}
      break;
    }
    case 'Diagonal': {
      ctx.strokeStyle='rgba(0,0,0,0.15)'; ctx.lineWidth=14;
      for(let i=-S;i<S*2;i+=80){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i+S,S);ctx.stroke();}
      break;
    }
    case 'Geometric': {
      ctx.strokeStyle='rgba(255,255,255,0.18)'; ctx.lineWidth=2;
      const hr=24,hh=hr*Math.sqrt(3);
      for(let y=-hh;y<S+hh;y+=hh) for(let x=-hr;x<S+hr*3;x+=hr*3){
        ctx.beginPath();
        for(let a=0;a<6;a++){const r=(a*60*Math.PI)/180;ctx.lineTo(x+hr*Math.cos(r),y+hr*Math.sin(r));}
        ctx.closePath(); ctx.stroke();
      }
      break;
    }
    case 'BlueGrungeJersey': drawBlueGrunge(ctx,sec,S); break;
    case 'GreenChevronJersey': drawChevron(ctx,sec,S); break;
    case 'RedCarbonJersey': drawCarbon(ctx,sec,S); break;
    case 'FlameStripeJersey': drawFlame(ctx,sec,S); break;
    case 'GrungeTriangleJersey': drawGrungeTriangle(ctx,sec,S); break;
    default: break;
  }
  ctx.restore();
}

function rng(s:number){const x=Math.sin(s)*10000;return x-Math.floor(x);}

function drawBlueGrunge(ctx: CanvasRenderingContext2D, c: string, S: number) {
  const r=parseInt(c.slice(1,3),16)||30,g=parseInt(c.slice(3,5),16)||30,b=parseInt(c.slice(5,7),16)||40;
  ctx.fillStyle=`rgba(${Math.max(0,r-20)},${Math.max(0,g-20)},${Math.max(0,b-20)},0.9)`; ctx.fillRect(0,0,S*0.32,S); ctx.fillRect(S*0.68,0,S*0.32,S);
  for(let i=0;i<50;i++){const x=rng(i*3)*S*0.4,y=rng(i*3+1)*S,ts=50+rng(i*3+2)*100,a=rng(i*3+3)*Math.PI*2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*ts,y+Math.sin(a)*ts);ctx.lineTo(x+Math.cos(a+2.3)*ts*0.7,y+Math.sin(a+2.3)*ts*0.7);ctx.closePath();rng(i*3+4)>0.5?(ctx.fillStyle=`rgba(${Math.max(0,r-50)},${Math.max(0,g-50)},${Math.max(0,b-50)},0.7)`,ctx.fill()):(ctx.strokeStyle=`rgba(0,0,0,0.6)`,ctx.lineWidth=2+rng(i)*3,ctx.stroke());}
}

function drawChevron(ctx: CanvasRenderingContext2D, c: string, S: number) {
  const r=parseInt(c.slice(1,3),16)||0,g=parseInt(c.slice(3,5),16)||0,b=parseInt(c.slice(5,7),16)||0;
  const cW=50,cH=30,cols=Math.ceil(S/cW)+2,rows=Math.ceil(S/cH)+2;
  for(let row=0;row<rows;row++) for(let col=-1;col<cols;col++){
    const cx=col*cW,cy=row*cH;
    ctx.beginPath();ctx.moveTo(cx,cy+cH);ctx.lineTo(cx+cW/2,cy);ctx.lineTo(cx+cW,cy+cH);
    ctx.strokeStyle=`rgba(${Math.max(0,r-60)},${Math.max(0,g-60)},${Math.max(0,b-60)},0.5)`;ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();
  }
}

function drawCarbon(ctx: CanvasRenderingContext2D, c: string, S: number) {
  const ts=18;
  for(let y=0;y<S;y+=ts) for(let x=0;x<S;x+=ts){
    const even=((x/ts)+(y/ts))%2===0;
    ctx.fillStyle=even?'rgba(255,255,255,0.06)':'rgba(0,0,0,0.15)';
    ctx.fillRect(x,y,ts,ts/2);
    ctx.fillStyle=even?'rgba(0,0,0,0.12)':'rgba(255,255,255,0.04)';
    ctx.fillRect(x,y+ts/2,ts,ts/2);
    ctx.strokeStyle='rgba(0,0,0,0.4)';ctx.lineWidth=0.5;ctx.strokeRect(x,y,ts,ts);
  }
}

function drawFlame(ctx: CanvasRenderingContext2D, c: string, S: number) {
  const r=parseInt(c.slice(1,3),16)||0,g=parseInt(c.slice(3,5),16)||0,b=parseInt(c.slice(5,7),16)||0;
  const colW=S/12;
  for(let col=0;col<12;col++){
    const cx=(col+0.5)*colW;
    for(let s=0;s<3;s++){
      const top=-20+rng(col*10+s)*S*0.15,h=S*0.4+rng(col*10+s+1)*S*0.45,bot=top+h;
      ctx.beginPath();ctx.moveTo(cx,Math.min(bot,S+20));
      ctx.bezierCurveTo(cx-colW*0.3,bot-(bot-top)*0.3,cx-colW*0.8,top,cx+colW*0.8,top);
      ctx.bezierCurveTo(cx+colW,top+(bot-top)*0.5,cx+colW*0.3,bot-(bot-top)*0.3,cx,Math.min(bot,S+20));
      ctx.closePath();ctx.fillStyle=`rgba(${Math.max(0,r-30)},${Math.max(0,g-30)},${Math.max(0,b-30)},0.6)`;ctx.fill();
    }
  }
}

function drawGrungeTriangle(ctx: CanvasRenderingContext2D, c: string, S: number) {
  const r=parseInt(c.slice(1,3),16)||0,g=parseInt(c.slice(3,5),16)||0,b=parseInt(c.slice(5,7),16)||0;
  for(let i=0;i<60;i++){
    const x=rng(i*7)*S,y=rng(i*7+1)*S,ls=30+rng(i*7+2)*100,ss=10+rng(i*7+3)*30,a=rng(i*7+4)*Math.PI*2;
    ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+Math.cos(a)*ls,y+Math.sin(a)*ls);ctx.lineTo(x+Math.cos(a+0.25)*ss,y+Math.sin(a+0.25)*ss);ctx.closePath();
    ctx.fillStyle=`rgba(${Math.max(0,r-50)},${Math.max(0,g-50)},${Math.max(0,b-50)},0.55)`;ctx.fill();
  }
  ctx.fillStyle=`rgba(${Math.max(0,r-40)},${Math.max(0,g-40)},${Math.max(0,b-40)},0.7)`;ctx.fillRect(S*0.33,0,S*0.34,S);
}

// ─── Fabric pattern drawing ─────────────────────────────────────────────────

function drawFabricPattern(
  ctx: CanvasRenderingContext2D,
  patternImg: HTMLImageElement | undefined,
  fgColor: string, bgColor: string, customize: boolean, S: number
) {
  if (!patternImg) return;
  if (!customize) { ctx.drawImage(patternImg, 0, 0, S, S); return; }

  const hex2 = (hex: string) => {
    const n = parseInt(hex.replace('#',''), 16);
    return { r:(n>>16)&255, g:(n>>8)&255, b:n&255 };
  };
  const fg = hex2(fgColor);
  const tmp = document.createElement('canvas'); tmp.width=S; tmp.height=S;
  const tc = tmp.getContext('2d'); if (!tc) return;
  tc.drawImage(patternImg, 0, 0, S, S);
  const imgd = tc.getImageData(0,0,S,S); const d = imgd.data;
  for(let i=0;i<d.length;i+=4){
    const dist = Math.sqrt((255-d[i])**2+(255-d[i+1])**2+(255-d[i+2])**2);
    const t = Math.max(0, Math.min(1, (dist-30)/60));
    d[i]=fg.r; d[i+1]=fg.g; d[i+2]=fg.b; d[i+3]=Math.round(d[i+3]*t);
  }
  tc.putImageData(imgd,0,0);
  if(bgColor && bgColor !== 'transparent'){ ctx.fillStyle=bgColor; ctx.fillRect(0,0,S,S); }
  ctx.drawImage(tmp,0,0,S,S);
}

// ─── Logo image layer (baked into the canvas, with eraser support) ───────────

function drawLogoLayer(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  layer: { x: number; y: number; scale: number; rotation: number; opacity: number; eraserPaths: EraserPath[] }
) {
  const iw = img.naturalWidth || img.width || 200;
  const ih = img.naturalHeight || img.height || 200;

  ctx.save();
  ctx.globalAlpha = typeof layer.opacity === 'number' ? layer.opacity : 1;
  ctx.translate(layer.x, layer.y);
  ctx.rotate((layer.rotation * Math.PI) / 180);
  ctx.scale(layer.scale, layer.scale);

  // Apply eraser strokes (destination-out) on an offscreen copy
  if (layer.eraserPaths?.length) {
    const off = document.createElement('canvas');
    off.width = iw; off.height = ih;
    const octx = off.getContext('2d');
    if (octx) {
      octx.drawImage(img, 0, 0, iw, ih);
      octx.globalCompositeOperation = 'destination-out';
      octx.lineCap = 'round'; octx.lineJoin = 'round';
      layer.eraserPaths.forEach(path => {
        octx.lineWidth = path.size;
        octx.beginPath();
        path.points.forEach((pt, i) => i === 0 ? octx.moveTo(pt.x, pt.y) : octx.lineTo(pt.x, pt.y));
        octx.stroke();
      });
      ctx.drawImage(off, -iw/2, -ih/2, iw, ih);
      ctx.restore();
      return;
    }
  }

  ctx.drawImage(img, -iw/2, -ih/2, iw, ih);
  ctx.restore();
}

// ─── Main hook — produces combined textures (Front & Back) plus a trim tex ──

export function useJerseyTextures(state: CustomizerState): {
  frontTex: THREE.CanvasTexture | null;
  backTex: THREE.CanvasTexture | null;
  trimFrontTex: THREE.CanvasTexture | null;
  trimBackTex: THREE.CanvasTexture | null;
} {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return { frontTex: null, backTex: null, trimFrontTex: null, trimBackTex: null };
    }

    const S = CANVAS_SIZE;

    const finalize = (cv: HTMLCanvasElement): THREE.CanvasTexture => {
      const tex = new THREE.CanvasTexture(cv);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.flipY = true; // canvas top (y=0) → v=1 → garment top
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.generateMipmaps = false;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.anisotropy = 4;
      tex.needsUpdate = true;
      return tex;
    };

    const getBaseColor = (side: 'Front' | 'Back'): string => {
      if (!state.primaryColorSide || state.primaryColorSide === 'Both') {
        return state.primary;
      }
      if (side === 'Front') {
        return state.primaryFront || state.primary;
      }
      return state.primaryBack || state.primary;
    };

    const drawFabric = (ctx: CanvasRenderingContext2D, side: 'Front' | 'Back') => {
      const patSrc = side === 'Front' ? state.fabricPatternFront : state.fabricPatternBack;
      const patImg = patSrc && patSrc !== 'None' ? state.loadedPatterns[patSrc] : undefined;
      const patColor = side === 'Front' ? state.fabricPatternColorFront : state.fabricPatternColorBack;
      const patBg = side === 'Front' ? state.fabricPatternBgFront : state.fabricPatternBgBack;
      const patCustomize = side === 'Front' ? state.fabricPatternCustomizeFront : state.fabricPatternCustomizeBack;
      if (patImg) drawFabricPattern(ctx, patImg, patColor, patBg, patCustomize, S);
    };

    const makeSideTex = (side: 'Front' | 'Back'): THREE.CanvasTexture | null => {
      const cv = document.createElement('canvas'); cv.width=S; cv.height=S;
      const ctx = cv.getContext('2d'); if (!ctx) return null;

      // ── 1. Base body color ───────────────────────────────────────────────
      ctx.fillStyle = getBaseColor(side) || '#FFFFFF';
      ctx.fillRect(0, 0, S, S);

      // ── 2. Fabric pattern ────────────────────────────────────────────────
      drawFabric(ctx, side);

      // ── 3. Design pattern ────────────────────────────────────────────────
      const shouldDrawDesign = state.designPattern && state.designPattern !== 'plain' &&
        (state.designSide === 'Both' || state.designSide === side || !state.designSide);
      if (shouldDrawDesign) {
        drawDesignPattern(ctx, state.designPattern, state.designColor || state.secondary || '#000000');
      }

      // ── 4. Image + text layers (flat) ────────────────────────────────────
      const imageLayers = state.logoLayers.filter(l => l.side === side && (l.type === 'image' || l.type === 'logo'));
      const textLayers = state.textLayers.filter(l => l.side === side);

      const allLayerIds = state.layersOrder.filter(id =>
        imageLayers.find(l => l.id === id) || textLayers.find(l => l.id === id)
      );

      allLayerIds.forEach(id => {
        const imgL = imageLayers.find(l => l.id === id);
        const txtL = textLayers.find(l => l.id === id);
        if (imgL) {
          const img = state.loadedLogoImages[imgL.src];
          if (!img) return;
          drawLogoLayer(ctx, img, imgL);
        } else if (txtL) {
          drawTextLayer(ctx, txtL);
        }
      });

      // Fallback: layers with no order entry
      imageLayers.filter(l => !allLayerIds.includes(l.id)).forEach(l => {
        const img = state.loadedLogoImages[l.src]; if (!img) return;
        drawLogoLayer(ctx, img, l);
      });
      textLayers.filter(l => !allLayerIds.includes(l.id)).forEach(l => drawTextLayer(ctx, l));

      return finalize(cv);
    };

    // Trim texture: base color + fabric pattern only (sleeves, sides, collar, hem)
    const makeTrimTex = (side: 'Front' | 'Back'): THREE.CanvasTexture | null => {
      const cv = document.createElement('canvas'); cv.width=S; cv.height=S;
      const ctx = cv.getContext('2d'); if (!ctx) return null;
      ctx.fillStyle = getBaseColor(side) || '#FFFFFF';
      ctx.fillRect(0, 0, S, S);
      drawFabric(ctx, side);
      return finalize(cv);
    };

    return {
      frontTex: makeSideTex('Front'),
      backTex: makeSideTex('Back'),
      trimFrontTex: makeTrimTex('Front'),
      trimBackTex: makeTrimTex('Back'),
    };
  }, [
    state.primary, state.primaryFront, state.primaryBack, state.primaryColorSide,
    state.secondary, state.designColor,
    state.designPattern, state.designSide,
    state.fabricPatternFront, state.fabricPatternBack,
    state.fabricPatternColorFront, state.fabricPatternColorBack,
    state.fabricPatternBgFront, state.fabricPatternBgBack,
    state.fabricPatternCustomizeFront, state.fabricPatternCustomizeBack,
    state.loadedPatterns,
    state.textLayers, state.logoLayers, state.layersOrder,
    state.loadedLogoImages,
  ]);
}
