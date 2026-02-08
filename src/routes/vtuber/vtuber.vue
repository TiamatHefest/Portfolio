<script setup lang="ts">
import { onMounted, ref } from 'vue';

type Asset = { src: string; title: string };
const assets = ref<Asset[]>([]); // model sheets, logos, etc.

onMounted(() => {
	document.title = 'VTuber | Portfólio';
});
</script>

<template>
	<div class="main-content">
		<main class="portfolio-cat">
    <h1>VTuber</h1>
    <section class="pricing" aria-labelledby="vt-pricing-heading">
      <h2 id="vt-pricing-heading">Tabela VTuber & Serviços</h2>
      <div class="pricing-grid">
        <div class="group">
          <h3>Character Design</h3>
          <ul>
            <li><span>Chibi</span><strong>575+</strong></li>
            <li><span>Full</span><strong>750+</strong></li>
          </ul>
        </div>
        <div class="group">
          <h3>Pacotes / Emotes</h3>
          <ul>
            <li><span>Emotes (6)</span><strong>250+</strong></li>
            <li><span>Chibi + Design</span><strong>425+</strong></li>
          </ul>
        </div>
        <div class="group">
          <h3>Layout & Rig</h3>
          <ul>
            <li><span>Layout VTuber</span><strong>125+</strong></li>
            <li><span>Rig + Design</span><strong>625+</strong></li>
            <li><span>Rig 2D(Apenas)</span><strong>100+</strong></li>
          </ul>
        </div>
        <div class="group">
          <h3>3D / Outros</h3>
          <ul>
            <li><span>VTuber 3D</span><strong>1250+</strong></li>
            <li><span>Rig + Design</span><strong>825+</strong></li>
          </ul>
        </div>
      </div>

      <p class="obs">Canvas Padrão Inicial: <strong>2560×2560</strong></p>

      <p class="obs">Valores em <b>USD</b>. "+" = base inicial negociável (complexidade, props, expressões extras, revisões e prazo podem alterar). Canvas padrão 2560×2560 (pode ajustar conforme necessidade). Para orçamento final envie: referências, estilo desejado, número de expressões / emotes, rig alvo (ex: VTube Studio), prazo e uso pretendido.</p>
    </section>
      <div class="gallery">
        <p v-if="assets.length === 0">Em breve...</p>
        <figure v-for="a in assets" :key="a.src">
          <img :src="a.src" :alt="a.title" />
          <figcaption>{{ a.title }}</figcaption>
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
.portfolio-cat h1{font-size:clamp(2rem,4.5vw,3.3rem);margin:0 0 2.2rem;letter-spacing:.5px;line-height:1.05;background:linear-gradient(90deg,#ff9f2e,#ff5db1);-webkit-background-clip:text;background-clip:text;color:transparent}
.pricing{background:linear-gradient(165deg,#1c1410,#120f18);border:1px solid #33261d;border-radius:24px;padding:2.2rem clamp(1.2rem,2.5vw,2.6rem) 2.4rem;box-shadow:0 18px 40px -22px #000,0 0 0 1px #ffffff08,0 2px 4px -2px #000 inset;position:relative;overflow:hidden;margin:0 0 3.2rem}
.pricing::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 65% 25%,#ff9f2e33,transparent 65%),radial-gradient(circle at 25% 85%,#ff5fb440,transparent 60%);mix-blend-mode:overlay;pointer-events:none;opacity:.9}
.pricing h2{margin:0 0 1.6rem;font-size:clamp(1.35rem,2.2vw,2rem);letter-spacing:.06em;text-transform:uppercase;font-weight:600;color:#fdf9f3;display:flex;align-items:center;gap:.6rem}
.pricing h2::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,#ffffff25,#ffffff04);border-radius:1px}
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1.4rem 1.2rem}
.pricing .group{background:#271b12d4;border:1px solid #3a281e;border-radius:18px;padding:1.05rem 1rem 1.2rem;position:relative;display:flex;flex-direction:column;gap:.55rem;box-shadow:0 4px 16px -8px #000,0 0 0 1px #ffffff08;backdrop-filter:blur(4px) saturate(1.15);-webkit-backdrop-filter:blur(4px) saturate(1.15)}
.pricing .group h3{margin:0;font-size:.8rem;letter-spacing:.28em;text-transform:uppercase;font-weight:600;color:#ffd7b2;opacity:.92}
.pricing .group ul{list-style:none;margin:.1rem 0 0;padding:0;display:flex;flex-direction:column;gap:.42rem;font-size:.78rem}
.pricing .group li{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.45rem .65rem .42rem;border:1px solid #463226;border-radius:10px;background:#302017bf;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);position:relative;overflow:hidden;font-weight:500}
.pricing .group li::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,#ff9f2e1c,#ff5fb40d);opacity:0;transition:.4s opacity,.5s filter}
.pricing .group li:hover::before{opacity:1;filter:brightness(1.08) saturate(1.12)}
.pricing .group li span{color:#f3e7de;flex:1}
.pricing .group li strong{font-weight:600;font-size:.75rem;letter-spacing:.14em;color:#ffcf9b;background:#3a291f;padding:.25rem .5rem;border-radius:6px;box-shadow:0 0 0 1px #503829,0 2px 4px -2px #000}
.pricing .obs{margin:2rem 0 0;font-size:.66rem;line-height:1.45;letter-spacing:.13em;text-transform:uppercase;color:#e2d8d0;background:#281c13;border:1px solid #3a2a1f;padding:.9rem 1rem;border-radius:14px;box-shadow:0 2px 10px -6px #000,0 0 0 1px #ffffff08}
.pricing .obs b{color:#fff;font-weight:600}
.gallery{display:grid;gap:1rem;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
figure{margin:0;background:#201626;border:1px solid #322237;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px -8px #000,0 0 0 1px #ffffff05}
img{width:100%;display:block;object-fit:cover;aspect-ratio:4/3}
@media (max-width:780px){.pricing{padding:1.8rem 1.1rem 2rem;border-radius:20px}.pricing-grid{grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:1.1rem}.pricing .group{border-radius:16px;padding:.9rem .85rem 1rem}.pricing .group h3{font-size:.7rem;letter-spacing:.24em}.pricing .group li{padding:.42rem .55rem .4rem}.pricing .group li strong{font-size:.68rem}}
@media (max-width:520px){.portfolio-cat{padding:3rem 1rem 4.2rem}.pricing h2{font-size:1.15rem}.pricing-grid{gap:1rem}.pricing .group ul{gap:.36rem}.pricing .obs{font-size:.58rem;letter-spacing:.11em}}
</style>
