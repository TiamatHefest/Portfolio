<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

import GalleryLine from '@/lib/components/GalleryLine.vue';
import GalleryLineSecond from '@/lib/components/GalleryLineSecond.vue';
import type { Artwork } from '@/lib/components/types';

type ImageModule = Record<string, () => Promise<string>>;

// Carregamento lazy das imagens para melhorar performance inicial
const imageModules = import.meta.glob('/src/lib/assets/test/*.{webp,jpeg,jpg,png,gif}', {
	eager: false,
	import: 'default',
	query: '?url',
}) as ImageModule;

const artworks = ref<Artwork[]>([]);
const artworksSecond = ref<Artwork[]>([]);
const loading = ref(true);

function filenameToTitle(path: string) {
	const base = path.split('/').pop() || path;
	return base
		.replace(/\.[^.]+$/, '')
		.replace(/[-_]+/g, ' ')
		.replace(/\b([a-z])/g, (m) => m.toUpperCase());
}

function filenameToSlug(path: string) {
	const base = path.split('/').pop() || path;
	return base
		.replace(/\.[^.]+$/, '')
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

async function loadArtworks() {
	const used = new Map<string, number>();
	const entries = Object.entries(imageModules);
	const loadedArtworks: Artwork[] = [];

	for (const [path, loadModule] of entries.sort((a, b) => a[0].localeCompare(b[0]))) {
		try {
			const url = await loadModule();
			const root = filenameToSlug(path) || 'item';
			const count = used.get(root) || 0;
			used.set(root, count + 1);
			const slug = count === 0 ? root : `${root}-${count + 1}`;
			const title = filenameToTitle(path);

			loadedArtworks.push({
				src: url as string,
				title,
				subtitle: 'Sub ' + title,
				description: 'Descrição da obra ' + title + ' — texto exemplo para testar layout e modal.',
				slug,
			});
		} catch (error) {
			console.warn(`Failed to load image: ${path}`, error);
		}
	}

	artworks.value = loadedArtworks;
	artworksSecond.value = [...loadedArtworks].reverse();
	loading.value = false;
}

const selectedArt = ref<Artwork | null>(null);
const hoverArt = ref<Artwork | null>(null);
const tooltipX = ref(0);
const tooltipY = ref(0);
const isTouch = ref(false);

function lockScroll() {
	document.documentElement.style.overflow = 'hidden';
}
function unlockScroll() {
	document.documentElement.style.overflow = '';
}

function openModal(art: Artwork) {
	selectedArt.value = art;
	lockScroll();
}
function closeModal() {
	selectedArt.value = null;
	unlockScroll();
}

function showHover(art: Artwork) {
	if (!isTouch.value) hoverArt.value = art;
}
function hideHover() {
	if (!isTouch.value) hoverArt.value = null;
}
function moveTooltip(e: MouseEvent) {
	if (!isTouch.value && hoverArt.value) {
		tooltipX.value = e.clientX + 18;
		tooltipY.value = e.clientY + 18;
	}
}

function onKey(e: KeyboardEvent) {
	if (e.key === 'Escape' && selectedArt.value) closeModal();
}

function setVh() {
	document.documentElement.style.setProperty('--vh', window.innerHeight * 0.01 + 'px');
}

onMounted(() => {
	document.title = 'Galeria - Linha';
	loadArtworks();

	window.addEventListener('keydown', onKey);
	isTouch.value = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
	if (isTouch.value) hoverArt.value = null;

	setVh();
	window.addEventListener('resize', setVh);
	window.addEventListener('orientationchange', setVh);
});

onBeforeUnmount(() => {
	window.removeEventListener('keydown', onKey);
	window.removeEventListener('resize', setVh);
	window.removeEventListener('orientationchange', setVh);
	unlockScroll();
});
</script>

<template>
	<section class="gallery-root" aria-label="Galeria de artes" @mousemove="moveTooltip">
		<h1 class="visually-hidden">Galeria</h1>

		<div v-if="loading" class="gallery-loading">
			<div class="loading-spinner"></div>
			<p>Carregando galeria...</p>
		</div>
		<template v-else-if="artworks.length > 0">
			<GalleryLine
				:artworks="artworks"
				:speed="2"
				@artclick="openModal"
				@arthover="showHover"
				@arthoverout="hideHover"
			/>
			<GalleryLineSecond
				:artworks="artworksSecond"
				:speed="1.5"
				@artclick="openModal"
				@arthover="showHover"
				@arthoverout="hideHover"
			/>
		</template>
		<div v-else class="gallery-empty">
			<p>Nenhuma imagem encontrada.</p>
		</div>

		<div
			v-if="hoverArt"
			class="hover-tooltip"
			:style="{ transform: `translate(${tooltipX}px,${tooltipY}px)` }"
		>
			<strong>{{ hoverArt.title }}</strong>
			<div v-if="hoverArt.subtitle" class="sub">{{ hoverArt.subtitle }}</div>
		</div>

		<div
			v-if="selectedArt"
			class="art-modal-backdrop"
			role="button"
			tabindex="0"
			aria-label="Fechar modal"
			@click="closeModal"
			@keydown="(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); closeModal(); } }"
		>
			<dialog open class="art-modal graphite" @click.stop>
				<header class="g-head">
					<div class="g-dots" aria-hidden="true">
						<span></span><span></span><span></span>
					</div>
					<button class="g-close" aria-label="Fechar" @click.stop="closeModal">×</button>
				</header>
				<div class="g-body">
					<div class="g-image">
						<img :src="selectedArt.src" :alt="selectedArt.title" />
					</div>
					<div class="g-info">
						<h2>{{ selectedArt.title }}</h2>
						<h3 v-if="selectedArt.subtitle">{{ selectedArt.subtitle }}</h3>
						<p v-if="selectedArt.description" class="g-desc">{{ selectedArt.description }}</p>
						<RouterLink
							v-if="selectedArt.slug"
							class="g-link"
							:to="'/art/' + selectedArt.slug"
							aria-label="Ir para página completa"
							@click="unlockScroll"
						>
							Ver página completa →
						</RouterLink>
					</div>
				</div>
			</dialog>
		</div>
	</section>

</template>


<style>
	html,body{margin:0;min-height:100%;background:#0c0c0f;color:#ddd;font-family:system-ui,Arial,sans-serif;}
	body{overflow-y:auto;}
	.gallery-root{min-height:100%;display:flex;flex-direction:column;align-items:stretch;justify-content:flex-start;gap:3%;padding:3% 4% 10%;box-sizing:border-box;position:relative;overflow-x:hidden;width:100%;max-width:100%;}
	/* (removidos seletores não usados .content-header e .title) */
	/* Ajustes extra para garantir que cada linha tenha espaço completo */
	.gallery-line-container{max-width:100%;}

	.hover-tooltip { position:fixed; z-index:120; pointer-events:none; background:rgba(15,15,18,.92); backdrop-filter:blur(10px) saturate(1.4); -webkit-backdrop-filter:blur(10px) saturate(1.4); color:#fff; padding:.55rem .75rem .6rem; border-radius:12px; font-size:.72rem; line-height:1.15; box-shadow:0 4px 22px -6px rgba(0,0,0,.6), 0 0 0 1px #ffffff10; transform:translate(-9999px,-9999px); max-width:240px; animation:fadeIn .25s ease both; }
	.hover-tooltip strong { font-size:.78rem; font-weight:600; letter-spacing:.4px; display:block; }
	.hover-tooltip .sub { opacity:.8; margin-top:.15rem; font-weight:400; }
	@keyframes fadeIn { from { opacity:0; transform:translateY(6px); } to { opacity:1; transform:translateY(0); } }

	.art-modal-backdrop { position:fixed; inset:0; background:linear-gradient(135deg,#060708f2,#0d0f12f2); backdrop-filter:blur(18px) saturate(1.05); -webkit-backdrop-filter:blur(18px) saturate(1.05); z-index:150; display:flex; align-items:center; justify-content:center; padding:5vmin 4vmin; animation:backdropIn .35s ease; }
	@keyframes backdropIn { from { opacity:0; } to { opacity:1; } }
	.art-modal.graphite { border:none; padding:0; background:linear-gradient(180deg,#1a1d21,#15171a); color:#f5f6f7; width:min(1120px,92vw); max-height:88vh; overflow:hidden; display:flex; flex-direction:column; border-radius:22px; box-shadow:0 18px 48px -28px #000000c8,0 0 0 1px #ffffff12,0 0 0 4px #0d0f11 inset; animation:modalIn .44s cubic-bezier(.34,1.56,.64,1); }
	@keyframes modalIn { from { opacity:0; transform:translateY(34px) scale(.9); } to { opacity:1; transform:translateY(0) scale(1); } }
	.g-head { display:flex; align-items:center; justify-content:space-between; padding:.65rem .9rem; background:linear-gradient(180deg,#1d1f23,#15171a); border-bottom:1px solid #22252a; position:relative; }
	.g-dots { display:flex; gap:.45rem; }
	.g-dots span { width:.75rem; height:.75rem; border-radius:50%; background:linear-gradient(145deg,#31353a,#1c1f22); box-shadow:0 0 0 1px #2a2e33,0 2px 4px -2px #000 inset; }
	.g-close { all:unset; cursor:pointer; width:34px; height:34px; display:grid; place-items:center; font-size:1.2rem; color:#d5d7da; border-radius:9px; background:#202327; box-shadow:0 0 0 1px #2c3035,0 2px 4px -2px #000; transition:.25s background,.25s color,.35s transform; }
	.g-close:hover { background:#2a2e33; color:#fff; }
	.g-close:active { transform:scale(.9); }
	.g-body { display:grid; grid-template-columns: minmax(320px, 52%) 1fr; flex:1; min-height:0; }
	.g-image { background:#0d0e10; border-right:1px solid #202327; display:flex; align-items:center; justify-content:center; position:relative; overflow:hidden; }
	.g-image::after { content:""; position:absolute; inset:0; background:radial-gradient(circle at 50% 45%,rgba(255,255,255,.045),transparent 72%); mix-blend-mode:overlay; pointer-events:none; }
	.g-image img { width:100%; height:100%; object-fit:contain; filter:contrast(1.05); }
	.g-info { padding:1.6rem 1.4rem 2.2rem; overflow:auto; display:flex; flex-direction:column; gap:1rem; }
	.g-info h2 { margin:0; font-size:clamp(1.5rem,2.8vw,2.4rem); font-weight:600; letter-spacing:.5px; color:#fff; }
	.g-info h3 { margin:-.25rem 0 .5rem; font-size:.75rem; font-weight:600; letter-spacing:.3em; text-transform:uppercase; color:#9aa0a6; }
	.g-desc { margin:0; font-size:.85rem; line-height:1.5; color:#b7bcc2; white-space:pre-wrap; }
	.g-link { align-self:flex-start; margin-top:auto; text-decoration:none; font-size:.7rem; letter-spacing:.22em; text-transform:uppercase; background:#1d2125; padding:.6rem .95rem .5rem; border-radius:10px; color:#dfe2e5; display:inline-flex; gap:.4rem; position:relative; overflow:hidden; box-shadow:0 0 0 1px #2a3034,0 3px 14px -8px #000; transition:.3s background,.3s color; }
	.g-link::before { content:""; position:absolute; inset:0; background:linear-gradient(120deg,#ffffff10,transparent 60%); opacity:0; transition:.4s opacity; }
	.g-link:hover, .g-link:focus-visible { background:#252b30; color:#fff; }
	.g-link:hover::before, .g-link:focus-visible::before { opacity:1; }
	/* Scrollbar estilizado para painel info */
	.g-info::-webkit-scrollbar { width:10px; }
	.g-info::-webkit-scrollbar-track { background:#181a1d; }
	.g-info::-webkit-scrollbar-thumb { background:#2c3034; border-radius:20px; border:2px solid #181a1d; }
	.art-modal.graphite::-webkit-scrollbar { width:10px; }
	.art-modal.graphite::-webkit-scrollbar-track { background:#16181b; }
	.art-modal.graphite::-webkit-scrollbar-thumb { background:#2b2e32; border-radius:20px; border:2px solid #16181b; }
	@media (max-width:1100px){ .art-modal.graphite .g-body { grid-template-columns:1fr; } .g-image { border-right:none; border-bottom:1px solid #202327; max-height:55vh; } }

	/* Corrige sobreposição do modal com a sidebar em desktop/tablet */
	@media (min-width:981px) {
		.art-modal-backdrop {
			padding-left: calc(var(--sidebar-w, 270px) + 2.5rem);
		}
	}
	@media (min-width:601px) and (max-width:980px) {
		.art-modal-backdrop {
			padding-left: calc(var(--sidebar-w, 220px) + 2.5rem);
		}
	}
	@media (max-width:600px) {
		.art-modal-backdrop {
			padding-left: 0;
		}
	}
	@media (max-width:600px){ .g-info { padding:1.2rem 1.05rem 1.8rem; } .g-close { width:30px; height:30px; } }
	@media (max-width:800px){ .gallery-root{padding:4% 5% 14%;gap:5%;} }
	@media (min-width:801px) and (max-width:1100px){ .gallery-root{padding:3% 5% 11%; gap:4%;} }
	@media (max-height:680px) and (min-width:700px) and (max-width:1100px){ .gallery-root{padding:2% 4% 8%; gap:3.5%;} }
	/* Modal ajustes mobile */
	@media (max-width:760px){
		.art-modal.graphite { width:94vw; border-radius:18px; }
		.g-body { grid-template-columns:1fr; }
		.g-image { max-height:50vh; }
		.g-info h2 { font-size:clamp(1.3rem,6vw,1.9rem); }
		.g-info h3 { font-size:.65rem; }
		.g-desc { font-size:.78rem; }
		.g-link { font-size:.6rem; padding:.55rem .85rem .5rem; }
	}
	@media (max-width:480px){
		.gallery-root { padding:6% 5% 22%; }
		.art-modal-backdrop { padding:3.5vmin 3vmin; }
		.art-modal.graphite { width:100%; height:auto; max-height:84vh; }
		.g-head { padding:.55rem .7rem; }
		.g-close { width:30px; height:30px; font-size:1.05rem; }
		.g-info { padding:1.1rem .95rem 1.5rem; gap:.85rem; }
		.g-desc { font-size:.74rem; line-height:1.45; }
		.hover-tooltip { display:none; }
	}
	@media (max-width:370px){
		.g-info h2 { font-size:1.2rem; }
		.g-link { letter-spacing:.18em; }
	}

	/* Estilos para loading e estados vazios */
	.gallery-loading, .gallery-empty {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		min-height: 60vh;
		color: #ddd;
		font-size: 1.1rem;
		gap: 1rem;
	}

	.loading-spinner {
		width: 40px;
		height: 40px;
		border: 3px solid #333;
		border-top: 3px solid #fff;
		border-radius: 50%;
		animation: spin 1s linear infinite;
	}

	@keyframes spin {
		0% { transform: rotate(0deg); }
		100% { transform: rotate(360deg); }
	}

	.gallery-empty {
		opacity: 0.7;
	}
</style>
