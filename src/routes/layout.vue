<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import texture from '@/lib/components/leafsFalling.gif';
import neve from '@/lib/components/neve.gif';
import ammanImage from '@/lib/assets/textures/Amman-in-negative.png';
import wallCastel from '@/lib/assets/textures/wall_castelStone.avif';

import ForegroundGif from '@/lib/components/ForegroundGif.vue';
import ImageLayers from '@/lib/components/ImageLayers.vue';
import Sidebar from '@/lib/components/Sidebar.vue';
import TextureBackground from '@/lib/components/TextureBackground.vue';
import TextureBackgroundNoise from '@/lib/components/TextureBackgroundNoise.vue';

const route = useRoute();
const collapsed = ref(false);

const lowPower = ref(false);

// Usar Amman-in-negative na home, wall_castelStone nas outras páginas
const cityImage = computed(() => {
	return route.path === '/' || route.path === '/Portfolio/' ? ammanImage : wallCastel;
});

// Usar neve.gif na home, leafsFalling.gif nas outras páginas
const foregroundGifImage = computed(() => {
	return route.path === '/' || route.path === '/Portfolio/' ? neve : texture;
});

const effectsEnabled = computed(() => !lowPower.value);
const parallaxEnabled = computed(() => !lowPower.value);
const fgDeferMs = computed(() => (lowPower.value ? 3500 : 1000));
const bgFlowSpeed = computed(() => (lowPower.value ? 55 : 20));
const noiseSpeed = computed(() => (lowPower.value ? 2.4 : 1.2));
const noiseOpacity = computed(() => (lowPower.value ? 0.02 : 0.03));
const layersStrength = computed(() => (lowPower.value ? 0.65 : 1));

function updateSidebarClass() {
	const html = document.documentElement;
	if (!collapsed.value && window.innerWidth > 980) {
		html.classList.add('with-sidebar');
	} else {
		html.classList.remove('with-sidebar');
	}

	if (!collapsed.value) html.classList.add('menu-open');
	else html.classList.remove('menu-open');
}

function toggleCollapsed() {
	collapsed.value = !collapsed.value;
}

onMounted(() => {
	// Reduz efeitos em dispositivos fracos (menos RAM/CPU/GPU)
	// Heurística: prefers-reduced-motion, Data Saver, rede lenta, pouca RAM.
	try {
		const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		const connection = (navigator as any).connection;
		const saveData = Boolean(connection?.saveData);
		const effectiveType = String(connection?.effectiveType || '');
		const slowNetwork = effectiveType === '2g' || effectiveType === 'slow-2g';
		const deviceMemory = Number((navigator as any).deviceMemory || 0);
		const lowRam = deviceMemory > 0 && deviceMemory <= 4;
		lowPower.value = prefersReducedMotion || saveData || slowNetwork || lowRam;
	} catch {
		lowPower.value = false;
	}

	updateSidebarClass();
	window.addEventListener('resize', updateSidebarClass);
});

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateSidebarClass);
});

watch(collapsed, () => updateSidebarClass(), { flush: 'post' });
</script>

<template>
	<div class="app-root" :class="{ 'sidebar-collapsed': collapsed }">
		<Sidebar v-model:collapsed="collapsed" />

		<button
			class="mobile-menu-btn"
			:aria-label="collapsed ? 'Abrir menu' : 'Fechar menu'"
			:data-state="collapsed ? 'closed' : 'open'"
			@click="toggleCollapsed"
		>
			<span></span><span></span><span></span>
		</button>

		<section class="main-canvas">
			<ImageLayers
				:baseZ="0"
				:animate="effectsEnabled"
				:pointerParallax="parallaxEnabled"
				:globalStrength="layersStrength"
				:cityImage="cityImage"
				:foregroundGifImage="foregroundGifImage"
			/>

			<div class="page-wrapper">
				<slot />
			</div>

			<TextureBackground
				:src="texture"
				:opacity="0.225"
				size="1000px"
				blend="overlay"
				layer="front"
				:flowSpeed="bgFlowSpeed"
			/>

			<div class="front-noise-wrapper">
				<TextureBackgroundNoise :opacity="noiseOpacity" :speed="noiseSpeed" :scale="170" />
			</div>

			<!-- ForegroundGif (neve pequeno) removido - usando apenas layer no ImageLayers -->
			<!--
			<ForegroundGif
				align="right"
				width="min(38vmin,480px)"
				bottomOffset="6vh"
				:alwaysOnTop="true"
				:portal="true"
				:parallax="parallaxEnabled"
				:float="effectsEnabled"
				:deferMs="fgDeferMs"
				:useIdle="true"
			/>
			-->
		</section>
	</div>
</template>

<style>
	.app-root { display:flex; }
	html,body{overflow-x:hidden; width:100%;}
	html.menu-open,body.menu-open{overflow:hidden;}
	.main-canvas { flex:1 1 auto; margin-left:0; min-height:100vh; position:relative; background: linear-gradient(180deg,#3a3a3a,#2f2f32); transition:transform .4s cubic-bezier(.34,1.56,.64,1); width:100%; max-width:100%; overflow-x:hidden; }
	.loading-header { width: var(--sidebar-w, 270px); height: 100vh; background: #1a1a1a; position: fixed; left: 0; top: 0; z-index: 100; }
	/* Scrollbar global simples, sempre visível em desktop/tablet */
	html {
		scrollbar-width: thin;
		scrollbar-color: #444 #18181b;
	}
	body::-webkit-scrollbar {
		width: 10px;
		background: #18181b;
	}
	body::-webkit-scrollbar-thumb {
		background: #444;
		border-radius: 8px;
		border: 2px solid #18181b;
		min-height: 40px;
	}
	body::-webkit-scrollbar-thumb:hover {
		background: #666;
	}
	body::-webkit-scrollbar-corner {
		background: #18181b;
	}
	/* (Opcional) Se quiser reintroduzir espaço para sidebar fixa em desktop, adicionar classe .with-sidebar no root e usar regra global abaixo */
	html.with-sidebar .main-canvas{ margin-left: var(--sidebar-w); }
	html.with-sidebar .site-sidebar.collapsed ~ .main-canvas{ margin-left: var(--sidebar-collapsed-w); }
	/* Quando colapsada, permitir sensação mais central removendo pequeno offset em telas largas */
	@media (min-width:1200px){/* regras mantidas caso reative with-sidebar */}
	.page-wrapper { position:relative; z-index:2; max-width:1350px; margin:0 auto; }
	/* Removido comportamento condicional que alterava largura ao colapsar/expandir sidebar para evitar efeito de zoom nas galerias */
	.front-noise-wrapper { position:fixed; inset:0; z-index:40; pointer-events:none; }
	/* remove sidebar offset earlier (<=980px) to evitar zona morta */
	@media (max-width:980px){ .main-canvas { margin-left:0; } }
	/* mobile full-screen overlay sidebar; page stays put */
	@media (max-width:980px){
		.app-root { position:relative; }
		.main-canvas { margin-left:0; }
		.mobile-menu-btn { position:fixed; top:calc(.85rem + env(safe-area-inset-top,0px)); right:.85rem; left:auto; z-index:200; width:50px; height:50px; background:#1a1d21; border:1px solid #2a2f33; border-radius:16px; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 18px -6px #000,0 0 0 1px #ffffff10; cursor:pointer; padding:0; gap:5px; flex-direction:column; backdrop-filter:blur(8px) saturate(1.2); -webkit-backdrop-filter:blur(8px) saturate(1.2); }
		.mobile-menu-btn span { width:24px; height:2px; background:#e3e5e7; border-radius:2px; display:block; transition:.45s transform,.45s opacity,.45s background; }
		.mobile-menu-btn[data-state='open'] span:nth-child(1){ transform:translateY(8px) rotate(45deg); }
		.mobile-menu-btn[data-state='open'] span:nth-child(2){ opacity:0; }
		.mobile-menu-btn[data-state='open'] span:nth-child(3){ transform:translateY(-8px) rotate(-45deg); }
		.mobile-menu-btn:active { transform:scale(.9); }
	}
	/* Botão fixo também visível em desktop apenas quando colapsada? mantém oculto >980 */
	.mobile-menu-btn { position:fixed; top:1rem; right:1rem; z-index:120; width:46px; height:46px; background:#1a1d21; border:1px solid #2a2f33; border-radius:14px; display:none; align-items:center; justify-content:center; box-shadow:0 4px 18px -6px #000,0 0 0 1px #ffffff10; cursor:pointer; padding:0; gap:5px; flex-direction:column; }
	.mobile-menu-btn span { width:22px; height:2px; background:#e3e5e7; border-radius:2px; display:block; }
	.mobile-menu-btn:active { transform:scale(.9); }
	@media (max-width:980px){ .mobile-menu-btn { display:flex; } }
	@media (max-width:600px){
		.mobile-menu-btn { width:42px; height:42px; border-radius:12px; top:.65rem; right:.65rem; }
		.mobile-menu-btn span { width:20px; }
	}
</style>
