<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { catalogue, entriesBySlug, type ArtData } from './page';

const route = useRoute();
const router = useRouter();

const slug = computed(() => String(route.params.slug || ''));
const item = computed<ArtData | null>(() => entriesBySlug[slug.value] ?? null);

const prev = computed<ArtData | null>(() => {
  if (!item.value) return null;
  return catalogue[item.value.index - 1] ?? null;
});

const next = computed<ArtData | null>(() => {
  if (!item.value) return null;
  return catalogue[item.value.index + 1] ?? null;
});

onMounted(() => {
  if (!item.value) {
    router.replace({ name: 'not-found' });
    return;
  }
  document.title = `${item.value.title} — Projeto ${item.value.slug}`;
});
</script>

<template>
  <article v-if="item" class="art-detail">
    <header>
      <h1>{{ item.title }}</h1>
      <h2 v-if="item.subtitle">{{ item.subtitle }}</h2>
    </header>
    <div class="media-wrap">
      <img :src="item.image" :alt="item.title" />
      <div class="screen-glow"></div>
    </div>
    <p v-if="item.description" class="desc">{{ item.description }}</p>
    <nav class="pager">
      <RouterLink v-if="prev" :to="'/art/' + prev.slug" class="prev" aria-label="Anterior">← {{ prev.slug }}</RouterLink>
      <RouterLink to="/" class="home">Voltar</RouterLink>
      <RouterLink v-if="next" :to="'/art/' + next.slug" class="next" aria-label="Próximo">{{ next.slug }} →</RouterLink>
    </nav>
  </article>
</template>

<style>
.art-detail { max-width:min(1200px,92vw); margin:4rem auto 6rem; font-family:system-ui, Arial, sans-serif; color:#e5e6ea; }
header h1 { margin:0 0 .35rem; font-size:clamp(1.8rem,4.5vw,3.2rem); line-height:1.05; letter-spacing:.5px; }
header h2 { margin:.1rem 0 1.5rem; font-size:clamp(.85rem,1.1vw,1rem); opacity:.72; font-weight:500; letter-spacing:.35px; text-transform:uppercase; }
.media-wrap { position:relative; border-radius:28px; overflow:hidden; background:#050505; box-shadow:0 12px 40px -18px #000, 0 0 0 1px #ffffff10, 0 0 80px -30px #4d7dff66; }
.media-wrap img { width:100%; height:auto; display:block; object-fit:cover; filter:contrast(1.08) saturate(1.05); }
.screen-glow { position:absolute; inset:-40%; background:radial-gradient(circle at 50% 45%, rgba(120,150,255,.5), rgba(40,10,60,.15) 40%, transparent 70%); mix-blend-mode:overlay; animation: pulse 6s ease-in-out infinite; opacity:.55; pointer-events:none; }
@keyframes pulse { 0%,100% { transform:scale(1); opacity:.55;} 50% { transform:scale(1.15); opacity:.75;} }
.desc { margin:1.8rem 0 2.4rem; font-size:.92rem; line-height:1.55; max-width:70ch; opacity:.9; }
.pager { display:flex; gap:1rem; align-items:center; justify-content:space-between; font-size:.78rem; text-transform:uppercase; letter-spacing:.15em; }
.pager a { text-decoration:none; color:#b9c7ff; background:#1a1d24; padding:.65rem 1rem .55rem; border-radius:14px; position:relative; overflow:hidden; }
.pager a::before { content:""; position:absolute; inset:0; background:radial-gradient(circle at 30% 30%,rgba(120,150,255,.5),transparent 70%); opacity:0; transition:opacity .4s; mix-blend-mode:overlay; }
.pager a:hover::before, .pager a:focus-visible::before { opacity:.85; }
.pager a:hover, .pager a:focus-visible { outline:none; color:#fff; }
.home { flex:1; text-align:center; }
@media (max-width:700px){ .art-detail { margin:2.5rem auto 4rem; } .pager { flex-wrap:wrap; } .home{order:3; flex:100%; margin-top:1rem;} }
</style>
