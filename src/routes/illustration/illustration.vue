<script setup lang="ts">
import { onMounted, ref } from 'vue';

type Work = {
	src: string;
	title: string;
};

const works = ref<Work[]>([]); // preencha com suas artes

onMounted(() => {
	document.title = 'Illustration | Portfólio';
});
</script>

<template>
	<main class="portfolio-cat">
  <h1>Illustration</h1>
  <section class="pricing" aria-labelledby="ill-pricing-heading">
    <h2 id="ill-pricing-heading">Tabela de Valores & Escopo</h2>
    <div class="pricing-grid">
      <div class="group">
        <h3>Personagem (Simples)</h3>
        <ul>
          <li><span>Busto Simples</span><strong>125+</strong></li>
          <li><span>Coxa para Cima Simples</span><strong>150+</strong></li>
          <li><span>Fullbody Simples</span><strong>200+</strong></li>
          <li><span>Chibi Simples</span><strong>75+</strong></li>
          <li><span>Corpo Inteiro Simples</span><strong>325+</strong></li>
        </ul>
      </div>
      <div class="group">
        <h3>Personagem (Renderizado)</h3>
        <ul>
          <li><span>Cabeça Renderizado</span><strong>225+</strong></li>
          <li><span>Busto Renderizado</span><strong>275+</strong></li>
          <li><span>Coxa para Cima Renderizado</span><strong>425+</strong></li>
          <li><span>Corpo Inteiro Renderizado</span><strong>575+</strong></li>
          <li><span>Chibi Renderizado</span><strong>135+</strong></li>
          <li><span>Full Illustration Renderizado</span><strong>525+</strong></li>
        </ul>
      </div>
      <div class="group">
        <h3>Fundo</h3>
        <ul>
          <li><span>Fundo Simples</span><strong>20–60</strong></li>
            <li><span>Fundo Complexo</span><strong>75–175</strong></li>
        </ul>
      </div>
    </div>
    <p class="obs">Valores em <b>USD</b>. O símbolo "+" indica valor base inicial <b>negociável</b> (pode subir com nível de detalhe, personagem extra, design, revisões). Faixa de fundos mostra mínimo–máximo típico. Para orçamento final envie: tipo (busto, full, chibi), nível (simples ou render), referências, resolução e prazo.</p>
  </section>
    <div class="gallery">
      <p v-if="works.length === 0">Em breve...</p>
      <figure v-for="w in works" :key="w.src">
        <img :src="w.src" :alt="w.title" />
        <figcaption>{{ w.title }}</figcaption>
      </figure>
    </div>
  </main>
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

/* Layout */
.portfolio-cat { max-width:1250px; margin:0 auto; padding:3.5rem 1.5rem 5rem 2.5rem; color:#fff; font-family:system-ui,Segoe UI,Arial,sans-serif; }
@media (max-width: 600px) {
  .portfolio-cat { padding-left: 1.1rem; }
}
.portfolio-cat h1{font-size:clamp(2rem,4.5vw,3.3rem);margin:0 0 2.2rem;letter-spacing:.5px;line-height:1.05;background:linear-gradient(90deg,#ad79ff,#ff8db7);-webkit-background-clip:text;background-clip:text;color:transparent;}

/* Pricing */
.pricing{background:linear-gradient(160deg,#181321,#15101c);border:1px solid #2a2034;border-radius:24px;padding:2.2rem clamp(1.2rem,2.5vw,2.6rem) 2.4rem;box-shadow:0 18px 40px -22px #000,0 0 0 1px #ffffff08,0 2px 4px -2px #000 inset;position:relative;overflow:hidden;margin:0 0 3.2rem;}
.pricing::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 65% 25%,#b26bff40,transparent 65%),radial-gradient(circle at 25% 85%,#ff6fb120,transparent 60%);mix-blend-mode:overlay;pointer-events:none;opacity:.95;}
.pricing h2{margin:0 0 1.6rem;font-size:clamp(1.35rem,2.2vw,2rem);letter-spacing:.06em;text-transform:uppercase;font-weight:600;color:#f7f4f8;display:flex;align-items:center;gap:.6rem;}
.pricing h2::after{content:"";flex:1;height:1px;background:linear-gradient(90deg,#ffffff25,#ffffff04);border-radius:1px;}
.pricing-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:1.4rem 1.2rem;}
.pricing .group{background:#211628d4;border:1px solid #36273d;border-radius:18px;padding:1.05rem 1rem 1.15rem;position:relative;display:flex;flex-direction:column;gap:.55rem;box-shadow:0 4px 16px -8px #000,0 0 0 1px #ffffff08;backdrop-filter:blur(4px) saturate(1.15);-webkit-backdrop-filter:blur(4px) saturate(1.15);}
.pricing .group h3{margin:0;font-size:.8rem;letter-spacing:.28em;text-transform:uppercase;font-weight:600;color:#d9c6ff;opacity:.95;}
.pricing .group ul{list-style:none;margin:.1rem 0 0;padding:0;display:flex;flex-direction:column;gap:.42rem;font-size:.78rem;}
.pricing .group li{display:flex;align-items:center;justify-content:space-between;gap:.75rem;padding:.45rem .65rem .42rem;border:1px solid #3a2a40;border-radius:10px;background:#281c30bf;backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);position:relative;overflow:hidden;font-weight:500;}
.pricing .group li::before{content:"";position:absolute;inset:0;background:linear-gradient(120deg,#b67dff20,#ff8db708);opacity:0;transition:.4s opacity,.5s filter;}
.pricing .group li:hover::before{opacity:1;filter:brightness(1.07) saturate(1.12);}
.pricing .group li span{color:#efe5f7;flex:1;}
.pricing .group li strong{font-weight:600;font-size:.75rem;letter-spacing:.14em;color:#f2d0ff;background:#352237;padding:.27rem .55rem;border-radius:6px;box-shadow:0 0 0 1px #513447,0 2px 4px -2px #000;}
.pricing .obs{margin:2rem 0 0;font-size:.66rem;line-height:1.45;letter-spacing:.13em;text-transform:uppercase;color:#d7cedf;background:#211626;border:1px solid #35283b;padding:.9rem 1rem;border-radius:14px;box-shadow:0 2px 10px -6px #000,0 0 0 1px #ffffff08;}
.pricing .obs b{color:#fff;font-weight:600;}

/* Gallery */
.gallery { display:grid; gap:1rem; grid-template-columns:repeat(auto-fill,minmax(260px,1fr)); }
figure { margin:0; background:#201626; border:1px solid #322237; border-radius:14px; overflow:hidden; box-shadow:0 4px 14px -8px #000,0 0 0 1px #ffffff05; }
img { width:100%; height:100%; object-fit:cover; display:block; aspect-ratio:4/3; }
figcaption { padding:.5rem .75rem .7rem; font-size:.8rem; opacity:.85; }

@media (max-width:780px){
  .pricing{padding:1.9rem 1.15rem 2.1rem;border-radius:20px}
  .pricing-grid{grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.1rem}
  .pricing .group{border-radius:16px;padding:.9rem .85rem 1rem}
  .pricing .group h3{font-size:.7rem;letter-spacing:.24em}
  .pricing .group li{padding:.42rem .55rem .4rem}
  .pricing .group li strong{font-size:.68rem}
}
@media (max-width:520px){
  .portfolio-cat{padding:3rem 1rem 4.2rem}
  .pricing h2{font-size:1.15rem}
  .pricing-grid{gap:1rem}
  .pricing .group ul{gap:.36rem}
  .pricing .obs{font-size:.58rem;letter-spacing:.11em}
}
</style>
