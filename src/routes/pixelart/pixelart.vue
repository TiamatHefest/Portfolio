<script setup lang="ts">
import { onMounted, ref } from 'vue';

type Sprite = { src: string; title: string };
const sprites = ref<Sprite[]>([]);

onMounted(() => {
  document.title = 'Pixel Art | Portfólio';
});
</script>

<template>
  <div class="main-content">
    <main class="portfolio-cat">
    <h1>Pixel Art</h1>
    <section class="pricing" aria-labelledby="pix-pricing-heading">
      <h2 id="pix-pricing-heading">Tabela de Valores & Especificações</h2>
      <div class="pricing-grid">
        <div class="group">
          <h3>Tamanho (Canvas)</h3>
          <ul>
            <li><span>32x32</span><strong>15+</strong></li>
            <li><span>64x64</span><strong>30+</strong></li>
            <li><span>128x128</span><strong>45+</strong></li>
          </ul>
        </div>
        <div class="group">
          <h3>Background (Tipo)</h3>
          <ul>
            <li><span>Simples</span><strong>15+</strong></li>
            <li><span>Complexo</span><strong>30+</strong></li>
          </ul>
        </div>
        <div class="group">
          <h3>Tipo de Animação</h3>
          <ul>
            <li><span>Simples</span><strong>20+</strong></li>
            <li><span>Complexa</span><strong>40+</strong></li>
          </ul>
        </div>
        <div class="group">
          <h3>Background (Tamanho)</h3>
          <ul>
            <li><span>Médio</span><strong>100+</strong></li>
            <li><span>Grande</span><strong>125+</strong></li>
          </ul>
        </div>
        <div class="group">
          <h3>Background Animado</h3>
          <ul>
            <li><span>Simples</span><strong>40+</strong></li>
            <li><span>Complexo</span><strong>80+</strong></li>
          </ul>
        </div>
        <div class="group">
          <h3>Personagem (Quantidade)</h3>
          <ul>
            <li><span>1 Não Animado Simples</span><strong>125+</strong></li>
            <li><span>1 Animado Simples</span><strong>175+</strong></li>
            <li><span>1 Não Animado Complexo</span><strong>150+</strong></li>
            <li><span>1 Animado Complexo</span><strong>200+</strong></li>
          </ul>
        </div>
        <div class="group">
          <h3>Extras</h3>
          <ul>
            <li><span>+1 Simples Não Anim.</span><strong>20+</strong></li>
            <li><span>+1 Complexo Não Anim.</span><strong>55+</strong></li>
            <li><span>+1 Simples Animado</span><strong>35+</strong></li>
            <li><span>+1 Complexo Animado</span><strong>70+</strong></li>
          </ul>
        </div>
        <div class="group">
          <h3>KIT / Packs</h3>
          <ul>
            <li><span>6 Personagens</span><strong>45+</strong></li>
            <li><span>15 Personagens</span><strong>90+</strong></li>
            <li><span>3 Construções</span><strong>120+</strong></li>
            <li><span>Tilesheet 6 Terrenos*</span><strong>20+</strong></li>
          </ul>
        </div>
      </div>
    <p class="obs">Valores em <b>USD</b>. O número com "+" indica um valor base inicial <b>negociável</b> (pode ajustar conforme complexidade, quantidade de frames, revisões e escopo). Para orçamento fechado envie: resolução desejada, quantidade de frames por animação, referências visuais e prazo.</p>
    </section>
      <div class="gallery">
        <p v-if="sprites.length === 0">Em breve...</p>
        <figure v-for="s in sprites" :key="s.src">
          <img :src="s.src" :alt="s.title" />
          <figcaption>{{ s.title }}</figcaption>
        </figure>
      </div>
    </main>
  </div>
</template>

<style>
.portfolio-cat {
  margin-left: var(--sidebar-width, 260px);
  transition: margin-left .3s;
}
@media (max-width: 980px) {
  .portfolio-cat { margin-left: var(--sidebar-width-tablet, 72px); }
}
@media (max-width: 600px) {
  .portfolio-cat { margin-left: 0; }
}
.portfolio-cat{max-width:1250px;margin:0 auto;padding:3.5rem 1.5rem 5rem 2.5rem;color:#fff;font-family:system-ui,Segoe UI,Arial,sans-serif}
@media (max-width: 600px) {
  .portfolio-cat { padding-left: 1.1rem; }
}
.portfolio-cat h1{font-size:clamp(2rem,4.5vw,3.3rem);margin:0 0 2rem;letter-spacing:.5px;line-height:1.05;background:linear-gradient(90deg,#ff6fb1,#ffa14d);-webkit-background-clip:text;background-clip:text;color:transparent;}
.pricing{background:linear-gradient(160deg,#1a121d,#14121c);border:1px solid #2e2432;border-radius:24px;padding:2.2rem clamp(1.2rem,2.5vw,2.6rem) 2.4rem;box-shadow:0 18px 40px -22px #000,0 0 0 1px #ffffff08,0 2px 4px -2px #000 inset;position:relative;overflow:hidden;margin:0 0 3.2rem;}
.pricing::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 70% 20%,#ff52b540,transparent 65%),radial-gradient(circle at 20% 85%,#ff9f2e33,transparent 60%);mix-blend-mode:overlay;pointer-events:none;opacity:.9;}
.pricing h2{margin:0 0 1.6rem;font-size: clamp(1.35rem,2.2vw,2rem);letter-spacing:.06em;text-transform:uppercase;font-weight:600;color:#f7f4f8;display:flex;align-items:center;gap:.6rem;}
.pricing h2::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,#ffffff25,#ffffff04);border-radius:1px;}
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.4rem 1.2rem;}
.pricing .group{background:#221726d4;border:1px solid #37273d;border-radius:18px;padding:1.05rem 1rem 1.2rem;position:relative;display:flex;flex-direction:column;gap:.55rem;box-shadow:0 4px 16px -8px #000,0 0 0 1px #ffffff08;backdrop-filter:blur(4px) saturate(1.15);-webkit-backdrop-filter:blur(4px) saturate(1.15);}
.pricing .group h3{margin:0;font-size:.8rem;letter-spacing:.28em;text-transform:uppercase;font-weight:600;color:#ffcfe6;opacity:.9;}
.pricing .group ul{list-style:none;margin:.1rem 0 0;padding:0;display:flex;flex-direction:column;gap:.42rem;font-size:.78rem;}
.pricing .group li{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.45rem .65rem .42rem;border:1px solid #3a2a40;border-radius:10px;background:#2b1d30bf;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);position:relative;overflow:hidden;font-weight:500;}
.pricing .group li::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,#ff6fb120,#ff9f2e08);opacity:0;transition:.4s opacity, .5s filter;}
.pricing .group li:hover::before{opacity:1;filter:brightness(1.1) saturate(1.15);}
.pricing .group li span{color:#e8dee9;flex:1;}
.pricing .group li strong{font-weight:600;font-size:.75rem;letter-spacing:.14em;color:#ffbdf1;background:#392334;padding:.25rem .5rem;border-radius:6px;box-shadow:0 0 0 1px #513447,0 2px 4px -2px #000;}
.pricing .obs{margin:2rem 0 0;font-size:.68rem;line-height:1.4;letter-spacing:.12em;text-transform:uppercase;color:#d7d0d9;background:#221726;border:1px solid #382b3d;padding:.9rem 1rem;border-radius:14px;box-shadow:0 2px 10px -6px #000,0 0 0 1px #ffffff08;}
.pricing .obs b{color:#fff;font-weight:600;}
.gallery{display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(170px,1fr));}
figure{margin:0;background:#201626;border:1px solid #322237;border-radius:10px;overflow:hidden;box-shadow:0 4px 14px -8px #000,0 0 0 1px #ffffff05;}
img{width:100%;display:block;image-rendering:pixelated}
@media (max-width:780px){.pricing{padding:1.8rem 1.1rem 2rem;border-radius:20px}.pricing-grid{grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:1.1rem}.pricing .group{border-radius:16px;padding:.9rem .85rem 1rem}.pricing .group h3{font-size:.7rem;letter-spacing:.24em}.pricing .group li{padding:.42rem .55rem .4rem}.pricing .group li strong{font-size:.68rem}}
@media (max-width:520px){.portfolio-cat{padding:3rem 1rem 4.2rem}.pricing h2{font-size:1.15rem}.pricing-grid{gap:1rem}.pricing .group ul{gap:.36rem}.pricing .obs{font-size:.6rem;letter-spacing:.1em}}
</style>
