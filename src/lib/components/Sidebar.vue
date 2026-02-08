<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import texture from '$lib/assets/textures/texture.jpg';

import artstationSvg from '$lib/assets/icons/artstation.svg';
import behanceSvg from '$lib/assets/icons/behance.svg';
import discordSvg from '$lib/assets/icons/Discord.svg';
import facebookSvg from '$lib/assets/icons/facebook.svg';
import instagramSvg from '$lib/assets/icons/instagram.svg';
import newgroundsSvg from '$lib/assets/icons/newgrounds.svg';
import redditSvg from '$lib/assets/icons/reddit.svg';
import substackSvg from '$lib/assets/icons/Substack.svg';
import wattpadSvg from '$lib/assets/icons/wattpad.svg';
import webtoonSvg from '$lib/assets/icons/webtoon.svg';
import xtwitterSvg from '$lib/assets/icons/x-twitter.svg';
import youtubeSvg from '$lib/assets/icons/youtube.svg';

type Social = {
	name: string;
	key: string;
	url: string;
	c1: string;
	c2: string;
	img?: string;
};

const props = withDefaults(defineProps<{ collapsed?: boolean }>(), {
	collapsed: false,
});
const emit = defineEmits<{ (e: 'update:collapsed', value: boolean): void }>();

const isCollapsed = computed({
	get: () => props.collapsed,
	set: (v) => emit('update:collapsed', v),
});

const logo = '/images/logo.svg';
const joker = '/images/joker.svg';
const subtitle = 'Um Ferreiro Artista/Animador Sonhador que trabalha manualmente';

const socials: Social[] = [
	{ name: 'X / Twitter', key: 'x', url: '#', c1: '#1d9bf0', c2: '#0f1419', img: xtwitterSvg },
	{ name: 'YouTube', key: 'yt', url: '#', c1: '#ff0000', c2: '#b80000', img: youtubeSvg },
	{ name: 'ArtStation', key: 'art', url: '#', c1: '#13aff0', c2: '#006a90', img: artstationSvg },
	{ name: 'Behance', key: 'behance', url: '#', c1: '#0057ff', c2: '#003ca8', img: behanceSvg },
	{ name: 'Instagram', key: 'instagram', url: '#', c1: '#f58529', c2: '#dd2a7b', img: instagramSvg },
	{ name: 'Substack', key: 'substack', url: '#', c1: '#ff6719', c2: '#cc4f10', img: substackSvg },
	{ name: 'Reddit', key: 'reddit', url: '#', c1: '#ff4500', c2: '#c23100', img: redditSvg },
	{ name: 'Facebook', key: 'facebook', url: '#', c1: '#1877f2', c2: '#0d52a1', img: facebookSvg },
	{ name: 'Webtoon', key: 'webtoon', url: '#', c1: '#00d564', c2: '#00a84c', img: webtoonSvg },
	{ name: 'Wattpad', key: 'wattpad', url: '#', c1: '#ff6a00', c2: '#e65100', img: wattpadSvg },
	{ name: 'Discord', key: 'discord', url: '#', c1: '#5865f2', c2: '#414cc7', img: discordSvg },
	{ name: 'Newgrounds', key: 'newgrounds', url: '#', c1: '#ff3ca6', c2: '#b8166d', img: newgroundsSvg },
];

const route = useRoute();
const path = computed(() => route.path);

function toggle() {
	isCollapsed.value = !isCollapsed.value;
}

function icon(name: string) {
    switch(name){
      case 'home': return `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 11.5 12 4l9 7.5'/><path d='M5 10v10h14V10'/></svg>`;
      case 'portfolio': return `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M3 9h18'/><path d='M9 5V3h6v2'/></svg>`;
      case 'illustration': return `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><path d='M3 17l6.5-6.5 3 3L21 5l-9.5 14H3z'/></svg>`;
      case 'pixel': return `<svg width='20' height='20' viewBox='0 0 24 24' fill='currentColor'><rect x='4' y='4' width='4' height='4'/><rect x='10' y='4' width='4' height='4'/><rect x='16' y='4' width='4' height='4'/><rect x='4' y='10' width='4' height='4'/><rect x='10' y='10' width='4' height='4'/><rect x='16' y='10' width='4' height='4'/><rect x='4' y='16' width='4' height='4'/><rect x='10' y='16' width='4' height='4'/><rect x='16' y='16' width='4' height='4'/></svg>`;
      case 'vtuber': return `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='4' width='18' height='14' rx='2'/><path d='M10 9l5 3-5 3V9z'/></svg>`;
      case 'mail': return `<svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='5' width='18' height='14' rx='2'/><path d='M3 7l9 6 9-6'/></svg>`;
      case 'x': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M4 4l16 16M20 4L4 20'/></svg>`;
      case 'yt': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><path d='M21.6 7.2s-.2-1.4-.8-2c-.7-.8-1.6-.8-2-0.9C16.8 4 12 4 12 4h0s-4.8 0-6.8.3c-.4.1-1.3.1-2 .9-.6.6-.8 2-.8 2S2 8.9 2 10.5v1c0 1.6.2 3.3.2 3.3s.2 1.4.8 2c.7.8 1.6.8 2 .9 2 .3 6.8.3 6.8.3s4.8 0 6.8-.3c.4-.1 1.3-.1 2-.9.6-.6.8-2 .8-2s.2-1.7.2-3.3v-1c0-1.6-.2-3.3-.2-3.3zM10 14.7V8.8l5 2.95-5 2.95z'/></svg>`;
      case 'kick': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><path d='M4 5h5v5h6V5h5v14h-5v-5h-6v5H4z'/></svg>`;
      case 'tw': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><path d='M6 4h14v10l-5 5h-4l-1 1H8v-4H4V8zM8 6v8h4v4l4-4h2V6z'/></svg>`;
      case 'art': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'><path d='M12 3l3 6 6 .9-4.5 4.4 1.1 6.3L12 17.8 6.4 20.6l1.1-6.3L3 9.9 9 9z'/></svg>`;
  case 'twitch': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><path d='M4 3h17v11.5L17 21h-4l-3 3v-3H7V6H4z'/><path d='M14 7v6M10 7v6' stroke='#fff' stroke-width='2' stroke-linecap='round'/></svg>`;
  case 'behance': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><rect x='3' y='6' width='18' height='12' rx='2'/><path d='M9 10.2c.8 0 1.4.5 1.4 1.3 0 .9-.6 1.4-1.5 1.4H7V10.2h2zM13.5 10.2c-.9 0-1.5.6-1.5 1.4s.6 1.4 1.5 1.4 1.5-.6 1.5-1.4-.6-1.4-1.5-1.4zM9 9H7V8h2c1.8 0 2.8.8 2.8 2.1 0 1-.5 1.6-1.3 1.9.9.3 1.5 1 1.5 2.1C12 15 10.8 16 9 16H5V8h4zM15 9h4v1h-4V9z' fill='#fff'/></svg>`;
  case 'instagram': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6'><rect x='4' y='4' width='16' height='16' rx='4'/><circle cx='12' cy='12' r='3.5'/><circle cx='17' cy='7' r='1.2' fill='currentColor' stroke='none'/></svg>`;
  case 'substack': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><rect x='4' y='5' width='16' height='2'/><rect x='4' y='10' width='16' height='2'/><path d='M4 5v12l8 4 8-4V5z' fill='currentColor'/></svg>`;
  case 'mastodon': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><path d='M6 3h12c2 0 3 1 3 3v6c0 5-3 9-9 9s-9-4-9-9V6c0-2 1-3 3-3z'/><path d='M8 10V8m4 2V8m4 2V8' stroke='#fff' stroke-width='2' stroke-linecap='round'/><path d='M7 11c0 2 1 4 5 4s5-2 5-4' stroke='#fff' stroke-width='2' fill='none' stroke-linecap='round'/></svg>`;
  case 'reddit': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6'><circle cx='12' cy='12' r='8'/><circle cx='9.5' cy='13' r='1.3' fill='currentColor' stroke='none'/><circle cx='14.5' cy='13' r='1.3' fill='currentColor' stroke='none'/><path d='M9.2 16c1.2.8 2.4.8 3.6 0'/><path d='M14 6l1-3 4 1'/></svg>`;
  case 'facebook': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><path d='M13 10V7c0-.6.4-1 1-1h2V3h-3c-2.2 0-4 1.8-4 4v3H7v3h2v8h4v-8h2l1-3h-3z' fill='#fff'/></svg>`;
  case 'webtoons': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><path d='M4 4h16v9l-8 7-8-7V4z'/><path d='M8 9l2 2 3-3 3 3 2-2' stroke='#fff' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/></svg>`;
  case 'tapas': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><rect x='5' y='5' width='14' height='14' rx='4'/><circle cx='10' cy='11' r='1.2' fill='#000'/><circle cx='14' cy='11' r='1.2' fill='#000'/><path d='M9 15c1.5 1 3 1 4.5 0' stroke='#000' stroke-width='1.6' stroke-linecap='round'/></svg>`;
  case 'wattpad': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><path d='M6 7c0-1.1.9-2 2-2s2 .9 2 2v5c0 .6.4 1 1 1s1-.4 1-1V7c0-1.1.9-2 2-2s2 .9 2 2v6c0 2.2-1.8 4-4 4h-1c-2.8 0-5-2.2-5-5V7z'/></svg>`;
  case 'discord': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='currentColor'><path d='M7 4c3-1 7-1 10 0l1 2c2 .3 3 2 3 4v6c0 1.1-.9 2-2 2-4 0-7 0-11 0-1.1 0-2-.9-2-2V10c0-2 1-3.7 3-4l1-2z'/><circle cx='10' cy='12' r='1.3' fill='#fff'/><circle cx='14' cy='12' r='1.3' fill='#fff'/></svg>`;
  case 'wishlist': return `<svg width='18' height='18' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.6'><path d='M12 21s-6-4.5-9-9c-2.5-3.8-.5-9 4-9 2.2 0 4 1.8 5 3.3C13 4.8 14.8 3 17 3c4.5 0 6.5 5.2 4 9-3 4.5-9 9-9 9z'/></svg>`;
      default: return '';
    }
  }

  // ===== Scroll nativo + drag inercial ocultando scrollbar =====
  let sidebarEl: HTMLElement | null = null;
  let dragActive = false;
  let startY = 0;
  let startScroll = 0;
  let lastY = 0;
  let lastTime = 0;
  let velocityY = 0; // px/ms
  let rafMomentum: number | null = null;
  let exceededThreshold = false;
  const DRAG_THRESHOLD = 6;
  const DECAY = 0.94;
  const MIN = 0.02;
  function stopMomentum(){ if (rafMomentum){ cancelAnimationFrame(rafMomentum); rafMomentum=null; } }
  function momentum(){ stopMomentum(); const step=()=>{ velocityY*=DECAY; if (sidebarEl) sidebarEl.scrollTop -= velocityY*16; if (Math.abs(velocityY)>MIN) { rafMomentum=requestAnimationFrame(step); } else { rafMomentum=null; } }; if (Math.abs(velocityY)>MIN) rafMomentum=requestAnimationFrame(step); }
  function onPDown(e:PointerEvent){ if (!sidebarEl) return; if ((e.target as HTMLElement).closest('.collapse')) return; if (sidebarEl.scrollHeight<=sidebarEl.clientHeight) return; dragActive=true; exceededThreshold=false; startY=e.clientY; startScroll=sidebarEl.scrollTop; lastY=e.clientY; lastTime=performance.now(); velocityY=0; try{ sidebarEl.setPointerCapture(e.pointerId);}catch{} stopMomentum(); e.preventDefault(); }
  function onPMove(e:PointerEvent){ if(!dragActive||!sidebarEl) return; const dy=e.clientY-startY; if(!exceededThreshold && Math.abs(dy)>DRAG_THRESHOLD) exceededThreshold=true; if(!exceededThreshold) return; const now=performance.now(); const dt=now-lastTime; if (dt>0){ velocityY=(e.clientY-lastY)/dt; lastY=e.clientY; lastTime=now; } sidebarEl.scrollTop = startScroll - dy; }
  function onPUp(e:PointerEvent){ if(!dragActive||!sidebarEl) return; dragActive=false; try{ sidebarEl.releasePointerCapture(e.pointerId);}catch{} if (exceededThreshold) { if (Math.abs(velocityY)>0.01) momentum(); const sup=(ev:Event)=>{ ev.preventDefault(); ev.stopPropagation(); }; document.addEventListener('click',sup,true); setTimeout(()=> document.removeEventListener('click',sup,true),80); } }
  function onPCancel(e:PointerEvent){ if(dragActive) onPUp(e); }
  function onKey(e:KeyboardEvent){ if(!sidebarEl) return; const step = 60; switch(e.key){ case 'ArrowDown': sidebarEl.scrollBy({top:step, behavior:'smooth'}); e.preventDefault(); break; case 'ArrowUp': sidebarEl.scrollBy({top:-step, behavior:'smooth'}); e.preventDefault(); break; case 'PageDown': sidebarEl.scrollBy({top: sidebarEl.clientHeight * 0.9, behavior:'smooth'}); e.preventDefault(); break; case 'PageUp': sidebarEl.scrollBy({top: -sidebarEl.clientHeight * 0.9, behavior:'smooth'}); e.preventDefault(); break; case 'Home': sidebarEl.scrollTo({top:0, behavior:'smooth'}); e.preventDefault(); break; case 'End': sidebarEl.scrollTo({top: sidebarEl.scrollHeight, behavior:'smooth'}); e.preventDefault(); break; } }
const clickToCollapseOnMobile = (e: Event) => {
  if (window.innerWidth > 980) return;
  const a = (e.target as HTMLElement | null)?.closest('a');
  if (!a) return;
  const href = a.getAttribute('href') || '';
  const target = a.getAttribute('target');
  if (href.startsWith('/') && !target) {
    setTimeout(() => {
      isCollapsed.value = true;
    }, 120);
  }
};

onMounted(() => {
  const jersey = document.createElement('link');
  jersey.rel = 'stylesheet';
  jersey.href = 'https://fonts.googleapis.com/css2?family=Jersey+10&display=swap';
  document.head.appendChild(jersey);

  const doto = document.createElement('link');
  doto.rel = 'stylesheet';
  doto.href = 'https://fonts.googleapis.com/css2?family=Doto:wght@300..900&display=swap';
  document.head.appendChild(doto);

  document.addEventListener('click', clickToCollapseOnMobile, true);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', clickToCollapseOnMobile, true);
});
</script>

<template>
	<aside
  :class="['site-sidebar', { collapsed: isCollapsed }]"
  aria-label="Barra lateral do site"
  role="navigation"
  :data-state="isCollapsed ? 'collapsed' : 'open'"
  :style="{ '--bg': `url(${texture})` }"
>
  <nav class="sidebar-inner" aria-label="Conteúdo da barra" tabindex="-1">
    <div class="brand" title="Home">
      <RouterLink to="/" class="logo" aria-label="Home">
        <div class="joker-card"><img :src="joker" alt="Joker" loading="lazy" /></div>
        <div class="title-wrap">
          <h1 class="site-title">Tiamat Hefest</h1>
          <p class="site-sub">{{ subtitle }}</p>
        </div>
      </RouterLink>
      <button
        class="collapse"
        :aria-expanded="!isCollapsed"
        @click="toggle"
        :aria-label="isCollapsed ? 'Expandir barra' : 'Recolher barra'"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M8 5v14l11-7L8 5z" fill="currentColor" />
        </svg>
      </button>
    </div>

    <nav class="main-nav">
      <ul class="flat">
        <li>
          <RouterLink
            to="/"
            class="nav-btn"
            title="Home"
            :class="{ selected: path === '/' }"
            style="--c1:#35d0ff;--c2:#1479ff"
          >
            <span class="icon" aria-hidden="true" v-html="icon('home')"></span>
            <span class="label">Home</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/illustration"
            class="nav-btn"
            title="Illustration"
            :class="{ selected: path.startsWith('/illustration') }"
            style="--c1:#ff2e63;--c2:#a41759"
          >
            <span class="icon" aria-hidden="true" v-html="icon('illustration')"></span>
            <span class="label">Illustration values</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/pixelart"
            class="nav-btn"
            title="Pixel Art"
            :class="{ selected: path.startsWith('/pixelart') }"
            style="--c1:#16d68f;--c2:#0b8f60"
          >
            <span class="icon" aria-hidden="true" v-html="icon('pixel')"></span>
            <span class="label">Pixel Art values</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/vtuber"
            class="nav-btn"
            title="VTuber"
            :class="{ selected: path.startsWith('/vtuber') }"
            style="--c1:#ff9f2e;--c2:#d96a00"
          >
            <span class="icon" aria-hidden="true" v-html="icon('vtuber')"></span>
            <span class="label">VTuber values</span>
          </RouterLink>
        </li>
        <li>
          <RouterLink
            to="/comissao"
            class="nav-btn"
            title="Comissão"
            :class="{ selected: path.startsWith('/comissao') }"
            style="--c1:#ff4b2e;--c2:#c72d17"
          >
            <span class="icon" aria-hidden="true" v-html="icon('mail')"></span>
            <span class="label">Comissão</span>
          </RouterLink>
        </li>
      </ul>
    </nav>
    <div class="spacer"></div>
    <div class="socials" aria-label="Redes sociais">
      <a
        v-for="s in socials"
        :key="s.key"
        rel="noopener"
        target="_blank"
        :href="s.url"
        :aria-label="s.name"
        :title="s.name"
        class="social-tile"
        :style="`--c1:${s.c1};--c2:${s.c2}`"
      >
        <img v-if="s.img" :src="s.img" :alt="s.name" class="social-img" loading="lazy" />
        <span v-else class="icon" aria-hidden="true" v-html="icon(s.key)"></span>
        <span class="sr">{{ s.name }}</span>
      </a>
    </div>
  </nav>
  </aside>

</template>

<style>
  body{--sidebar-w:240px;--sidebar-collapsed-w:72px}
  .site-sidebar {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: var(--sidebar-w);
    z-index: 60;
    display: flex;
    flex-direction: column;
    color: #efe9f0;
    background-image: linear-gradient(rgba(8,5,8,.65), rgba(8,5,8,.75)), var(--bg);
    background-size: cover;
    background-repeat: no-repeat;
    box-shadow: 2px 0 24px rgba(0,0,0,.6);
    transition: width .28s ease, backdrop-filter .28s;
    padding: .9rem .9rem;
    gap: .6rem;
  overflow-y:auto; /* nativo para wheel/keys */
  overflow-x:hidden;
    -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  touch-action: pan-y;
  }
  .site-sidebar::-webkit-scrollbar { width:0; height:0; }
  .site-sidebar.dragging { cursor: grabbing; }
  .site-sidebar.collapsed { width: var(--sidebar-collapsed-w); overflow-y:auto; }
  /* Remove zona fantasma: quando colapsada em desktop, retira-se da flow e aplica translateX negativo igual à diferença para que conteúdo ocupe 100% */
  /* Desktop mantém versão reduzida sem remover completamente */
  @media (min-width:981px){
    .site-sidebar.collapsed { position:fixed; transform:none; }
  }

  .sidebar-inner { display:flex; flex-direction:column; height:auto; min-height:100%; }
  .brand { display:flex; align-items:center; gap:.6rem; }
  .logo { display:flex; align-items:center; gap:.8rem; text-decoration:none; color:inherit; }
  .logo img { height:36px; width:auto; display:block; filter: drop-shadow(0 6px 12px rgba(0,0,0,.6)); }
  .title-wrap { display:flex; flex-direction:column; line-height:1; }
  .site-title { font-family:'Jersey 10', system-ui, sans-serif; font-size:1.95rem; margin:0; letter-spacing:.5px; font-weight:400; }
  .site-sub { font-family:'Doto', system-ui, sans-serif; font-size:.72rem; margin:.25rem 0 0; opacity:.8; max-width:180px; line-height:1.05; }
  .site-sidebar.collapsed .title-wrap { display:none; }
  .joker-card { width:46px; height:68px; flex:0 0 auto; border-radius:8px; position:relative; overflow:hidden; box-shadow:0 4px 14px -2px rgba(0,0,0,.6), 0 0 0 1px #ffffff0d; background:linear-gradient(145deg,#251b25,#141014); display:grid; place-items:center; transition: transform .35s cubic-bezier(.25,.8,.25,1); }
  .joker-card img { width:100%; height:100%; object-fit:cover; filter: drop-shadow(0 0 4px #ff2e6333); }
  .logo:hover .joker-card { transform:rotate(-4deg) scale(1.04); }
  .label { transition: opacity .22s ease, transform .22s ease; white-space:nowrap; }
  .site-sidebar.collapsed .label { opacity:0; transform:translateX(-6px); pointer-events:none; }
  /* manter scroll também quando colapsada */

  .collapse { margin-left:auto; background:none; border:none; color:inherit; cursor:pointer; padding:.25rem; border-radius:8px; }
  .collapse svg { transform: rotate(0deg); transition: transform .22s; }
  .site-sidebar.collapsed .collapse svg { transform: rotate(180deg); }

  .main-nav ul { list-style:none; padding: .8rem 0; margin:0; display:flex; flex-direction:column; gap:.35rem; }
  .main-nav ul.flat { gap:.4rem; }
  .main-nav a, .nav-btn { --btn-bg:#0f1114; --c-border:color-mix(in srgb,var(--c1,#6a6a6a) 58%, #121418); --c-glow:color-mix(in srgb,var(--c1,#6a6a6a) 35%, transparent); display:flex; gap:.6rem; align-items:center; color:#d4d2d6; text-decoration:none; padding:.52rem .6rem; border-radius:16px; position:relative; font-family:'Doto', system-ui, sans-serif; font-weight:500; transform:translateY(0) scale(1); background: var(--btn-bg); box-shadow: 0 1px 2px rgba(0,0,0,.55), 0 0 0 1px var(--c-border), inset 0 0 0 1px #ffffff08; transition: background .35s, transform .25s cubic-bezier(.34,1.56,.64,1), box-shadow .4s, color .32s; isolation:isolate; }
  .main-nav a::before, .nav-btn::before { content:""; position:absolute; inset:1px; border-radius:inherit; background:
    linear-gradient(145deg, color-mix(in srgb,var(--c1,#555) 16%, transparent), color-mix(in srgb,var(--c2,#333) 8%, transparent));
    opacity:.38; transition:opacity .32s, filter .42s; pointer-events:none; }
  .main-nav a::after, .nav-btn::after { content:""; position:absolute; inset:-2px; border-radius:inherit; background:linear-gradient(120deg,var(--c1,#666),var(--c2,#333)); opacity:0; filter:blur(8px); transform:scale(.84); transition:opacity .55s, transform .55s, filter .55s; mix-blend-mode:plus-lighter; pointer-events:none; }
  .main-nav a:hover:not(.selected) { transform:translateY(-2px) scale(1.04); box-shadow:0 4px 14px -8px var(--c-glow), 0 0 0 1px var(--c-border), inset 0 0 0 1px color-mix(in srgb,var(--c1,#666) 28%, #1a1f24); }
  .main-nav a:hover:not(.selected)::before { opacity:.68; filter:brightness(1.06) saturate(1.06); }
  .main-nav a:hover:not(.selected)::after { opacity:.48; transform:scale(.97); filter:blur(13px); }
  @media (prefers-reduced-motion: reduce){
    .main-nav a, .nav-btn { transition: background .18s, box-shadow .28s; }
    .main-nav a:hover:not(.selected) { transform:none; }
  }
  .main-nav a.selected, .main-nav a:focus-visible { color:#fff; text-shadow:0 1px 2px #000c; box-shadow:0 4px 14px -9px var(--c-glow), 0 0 0 1px var(--c-border), inset 0 0 0 1px color-mix(in srgb,var(--c1,#ff2e63) 26%, #14181c); transform:translateY(-2px) scale(1.025); }
  .main-nav a.selected::before, .main-nav a:focus-visible::before { opacity:.75; background:linear-gradient(150deg,var(--c1,#ff2e63) 12%, var(--c2,#7a1e3c) 88%); filter:brightness(1.02) saturate(1.04); }
  .main-nav a.selected::after, .main-nav a:focus-visible::after { opacity:.42; transform:scale(.955); filter:blur(14px); }
  .main-nav a.selected { font-weight:600; }
  .nav-btn { background:none; border:none; cursor:pointer; }

  .icon { width:28px; height:28px; display:grid; place-items:center; font-size:17px; }
  .site-sidebar.collapsed .icon { margin:0 auto; }
  /* ícones maiores e centralização quando encolhida */
  .site-sidebar.collapsed .main-nav a, .site-sidebar.collapsed .nav-btn { justify-content:center; padding:.75rem 0; }
  .site-sidebar.collapsed .main-nav a .label { display:none; }
  .site-sidebar.collapsed .icon { width:44px; height:44px; font-size:20px; border-radius:14px; background:#0f1114; box-shadow:inset 0 0 0 1px #ffffff10, 0 1px 2px #000; position:relative; }
  .site-sidebar.collapsed .icon::after { content:""; position:absolute; inset:0; border-radius:inherit; background:linear-gradient(145deg, color-mix(in srgb,var(--c1,#666) 35%, transparent), color-mix(in srgb,var(--c2,#444) 25%, transparent)); opacity:.55; transition:opacity .4s, filter .45s; }
  .site-sidebar.collapsed .main-nav a:hover .icon::after { opacity:.95; filter:brightness(1.2) saturate(1.2); }


  .spacer { flex:1 1 auto; }
  .socials { padding:.6rem 0; display:grid; grid-template-columns: repeat(auto-fill, minmax(44px,1fr)); gap:.55rem; }
  .social-tile { --btn-bg:#0f1114; position:relative; width:100%; aspect-ratio:1/1; display:grid; place-items:center; text-decoration:none; color:#f3f1f5; border-radius:16px; background:var(--btn-bg); box-shadow:0 1px 2px rgba(0,0,0,.65), inset 0 0 0 1px #ffffff10; overflow:hidden; transition: transform .3s cubic-bezier(.34,1.56,.64,1), box-shadow .45s, filter .4s; }
  .social-tile::before { content:""; position:absolute; inset:1px; border-radius:inherit; background:linear-gradient(150deg, color-mix(in srgb,var(--c1) 28%, transparent), color-mix(in srgb,var(--c2) 18%, transparent)); opacity:.5; transition:opacity .45s, filter .5s; }
  .social-tile::after { content:""; position:absolute; inset:-3px; border-radius:inherit; background:linear-gradient(120deg,var(--c1),var(--c2)); opacity:0; filter:blur(18px); transform:scale(.75); transition:opacity .6s, transform .6s, filter .6s; mix-blend-mode:plus-lighter; pointer-events:none; }
  .social-img { width:60%; height:60%; object-fit:contain; filter:drop-shadow(0 2px 3px rgba(0,0,0,.55)); opacity:.9; transition: transform .5s, opacity .5s; }
  .social-tile .icon { width:22px; height:22px; display:grid; place-items:center; filter:drop-shadow(0 2px 4px rgba(0,0,0,.5)); transition: transform .45s, opacity .45s; opacity:.9; }
  .social-tile:hover,
  .social-tile:focus-visible { outline:none; transform:translateY(-6px) scale(1.1); box-shadow:0 10px 30px -12px color-mix(in srgb,var(--c1) 65%, transparent), 0 0 0 1px color-mix(in srgb,var(--c1) 55%, #000); }
  .social-tile:hover::before,
  .social-tile:focus-visible::before { opacity:.95; filter:brightness(1.18) saturate(1.22); }
  .social-tile:hover::after,
  .social-tile:focus-visible::after { opacity:.9; transform:scale(1); filter:blur(26px); }
  .social-tile:hover .social-img,
  .social-tile:focus-visible .social-img,
  .social-tile:hover .icon,
  .social-tile:focus-visible .icon { transform:scale(1.18); opacity:1; }
  .social-tile:active { transform:translateY(-2px) scale(.96); transition:transform .12s; }
  .sr { position:absolute; width:1px; height:1px; margin:-1px; padding:0; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0; }

  /* tooltips when collapsed */
  .site-sidebar.collapsed a[title]{ position:relative; }
  .site-sidebar.collapsed a[title]:hover::after { content: attr(title); position:fixed; left: calc(var(--sidebar-collapsed-w) + 12px); top: auto; transform: translateY(-50%); background: rgba(0,0,0,0.8); color:#fff; padding:.5rem .7rem; border-radius:6px; white-space:nowrap; z-index:200; }

  /* responsive: transform into off-canvas drawer below 980px */
  @media (max-width:1200px){ body{ --sidebar-w:240px; } }
  @media (max-width:1100px){ body{ --sidebar-w:230px; } }
  @media (max-width:1024px){ body{ --sidebar-w:220px; } }
  @media (max-width:980px){
    body{ --sidebar-w: 100vw; }
    .site-sidebar { position:fixed; inset:0; width:100vw; max-width:100vw; /* evita exceder */
      height:100dvh; height:100svh; /* svh corrige barras dinâmicas em mobile modernos */
      max-height:100dvh; box-sizing:border-box; transform:translateY(-4%); opacity:0; pointer-events:none;
      transition:opacity .35s ease, transform .45s cubic-bezier(.34,1.56,.64,1);
      backdrop-filter:blur(20px) saturate(1.3); -webkit-backdrop-filter:blur(20px) saturate(1.3);
      background:linear-gradient(155deg,#120b13f2,#09060af2), var(--bg); background-size:cover;
      box-shadow:0 0 0 1px #ffffff12, 0 20px 44px -18px #000000d0;
      padding:calc(1rem + env(safe-area-inset-top,0px)) 1rem calc(1.8rem + env(safe-area-inset-bottom,0px));
      border-radius:0; overflow:hidden; /* impede overflow por padding */ }
    .site-sidebar[data-state='open'] { opacity:1; transform:translateY(0); pointer-events:auto; }
    .collapse { display:none; }
    .site-sidebar.collapsed .label { opacity:1; transform:none; pointer-events:auto; }
    .brand { padding-right:0; }
    .sidebar-inner { flex-direction:column; align-items:stretch; overflow-y:auto; overscroll-behavior:contain; }
  .main-nav ul { flex-direction:column; padding:.85rem 0 1rem; gap:.4rem; }
  .main-nav ul.flat { padding:.55rem .45rem .75rem; }
  /* Mantém tamanho padrão dos botões em tablets; redução só em <=600px */
  .socials { grid-template-columns:repeat(auto-fill,minmax(54px,1fr)); margin-top:1rem; }
  }
  @media (max-width:600px){
    body{ --sidebar-w: clamp(190px, 70vw, 220px); }
    .site-title { font-size:1.55rem; }
    .site-sidebar { padding:.85rem .85rem 1.2rem; }
  .collapse { width:42px; height:42px; top:.55rem; right:.55rem; }
    .joker-card { width:42px; height:60px; }
    .site-sub { display:none; }
  .main-nav ul { padding:.55rem 0 .75rem; gap:.28rem; }
  .main-nav ul.flat { padding:.55rem .45rem .75rem; }
  .main-nav a, .nav-btn { padding:.46rem .5rem; gap:.5rem; border-radius:14px; }
  .icon { width:24px; height:24px; }
  .socials { gap:.45rem; grid-template-columns:repeat(auto-fill,minmax(48px,1fr)); }
  .social-tile { border-radius:13px; }
  }
  @media (max-width:420px){
    .site-title { font-size:1.38rem; }
    .socials { gap:.45rem; }
    .social-tile { border-radius:12px; }
  }
  @media (max-width:360px){
    body{ --sidebar-w: clamp(190px, 78vw, 220px); }
    .site-title { font-size:1.25rem; }
    .joker-card { width:38px; height:56px; }
    .main-nav a, .nav-btn { padding:.48rem .5rem; }
  }
  /* Short-height landscape tablets (e.g., 1024x600) */
  @media (max-height:680px) and (min-width:700px) {
    body{ --sidebar-w:200px; }
    .site-sub { display:none; }
    .main-nav a, .nav-btn { padding:.45rem .55rem; gap:.5rem; font-size:.8rem; }
    .icon { width:22px; height:22px; }
    .socials { gap:.4rem; }
  }
</style>
