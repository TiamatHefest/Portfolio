<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Directive } from 'vue';
import type { Artwork } from './types';

const browser = typeof window !== 'undefined';

// Emits
const emit = defineEmits<{
	(e: 'artclick', art: Artwork): void;
	(e: 'arthover', art: Artwork): void;
	(e: 'arthoverout', art: Artwork): void;
}>();

const props = withDefaults(
	defineProps<{
		artworks: Artwork[];
		autoScroll?: boolean;
		speed?: number;
		hoverPause?: boolean;
		autoAdvance?: boolean;
		startOffset?: number;
	}>(),
	{
		autoScroll: true,
		speed: 0.45,
		hoverPause: true,
		autoAdvance: true,
		startOffset: 0,
	}
);

// Intersection Observer para lazy loading das imagens
let intersectionObserver: IntersectionObserver | null = null;
const loadedImages = new Set<string>();

const containerEl = ref<HTMLElement | null>(null);
const trackEl = ref<HTMLElement | null>(null);
const translateX = ref(0);

let positions: number[] = [];
let itemStride = 0;
let itemWidth = 0;
let currentIndex = 0;
let baseLen = 0;
let canDrag = true;
let isMobile = false;
let isPhone = false;
const useLoop = ref(true);
let singlePerLine = false;
let dragging = false;
let pendingDrag = false;
let wasDragging = false;
let dragStartX = 0;
let dragStartTranslate = 0;
let lastMoveX = 0;
let lastMoveTime = 0;
let dragVelocity = 0;
const DRAG_THRESHOLD = 6;
let animating = false;

let autoTimer: number | null = null;
const advanceInterval = 4000;

const loopedArtworks = computed(() =>
	useLoop.value ? [...props.artworks, ...props.artworks, ...props.artworks] : props.artworks
);

function handleResize() {
	if (!browser) return;
	isMobile = window.innerWidth < 820;
	isPhone = window.innerWidth < 560;
	singlePerLine = isPhone;
	if (isPhone) {
		useLoop.value = true;
	} else if (isMobile) {
		useLoop.value = false;
	} else {
		useLoop.value = true;
	}
}

	function setup() {
		if (!browser || !trackEl.value) return;
		baseLen = props.artworks.length;
		const all = trackEl.value.querySelectorAll<HTMLElement>('.frame');
		if (all.length < 2) return;
		// Medidas
		const r1 = all[0].getBoundingClientRect();
		const r2 = all[1].getBoundingClientRect();
		itemWidth = r1.width;
		itemStride = r2.left - r1.left; // inclui gap
		if (itemStride <= 0) itemStride = itemWidth + 32; // fallback
		positions = Array.from({ length: all.length }, (_, i) => i * itemStride);
		// largura total baseada apenas na lista base
		const totalWidth = baseLen ? (baseLen - 1) * itemStride + itemWidth : 0;
		if (useLoop.value) {
			currentIndex = baseLen; // meio (lista triplicada)
			snapImmediate();
		} else {
			currentIndex = 0;
			// Centraliza se conteúdo menor que a largura visível
			const cw = containerEl.value?.clientWidth || 0;
			if (totalWidth < cw) {
				canDrag = false;
				translateX.value = (cw - totalWidth) / 2; // centraliza
			} else {
				canDrag = true;
				translateX.value = 0;
			}
		}
		startAuto();
	}

	function computeTarget(idx: number, cw: number) {
		return -(positions[idx] + itemWidth/2 - cw/2) + startOffset;
	}

	function snapImmediate() {
		if (!containerEl.value) return;
		const cw = containerEl.value.clientWidth;
		if (singlePerLine) {
			// Alinha borda esquerda do item atual à borda esquerda do container (sem centralizar) para remover zona morta
			translateX.value = -positions[currentIndex];
		} else {
			translateX.value = computeTarget(currentIndex, cw);
		}
	}

	function animateTo(target: number) {
		const fastEase = singlePerLine ? 0.18 : 0.12; // mais sutil que 0.24 anterior
		animating = true;
		function step(){
			translateX.value += (target - translateX.value) * fastEase;
			const threshold = singlePerLine ? 0.35 : 0.5;
			if (Math.abs(target - translateX.value) < threshold){
				translateX.value = target; animating = false; normalizeIndex(); return;
			}
			requestAnimationFrame(step);
		}
		requestAnimationFrame(step);
	}

	function normalizeIndex() {
		if (!useLoop.value) return; // sem normalização quando não há loop
		if (!positions.length) return;
		const shiftDistance = itemStride * baseLen;
		if (currentIndex < baseLen) {
			currentIndex += baseLen;
			translateX.value -= shiftDistance;
		} else if (currentIndex >= baseLen * 2) {
			currentIndex -= baseLen;
			translateX.value += shiftDistance;
		}
	}

	function snapToClosest() {
		if (!containerEl.value) return;
		const cw = containerEl.value.clientWidth;
		// Modo carrossel 1 por linha (alinhado à esquerda)
		if (singlePerLine) {
			let idxApprox = Math.round(-translateX.value / itemStride);
			idxApprox = Math.max(0, Math.min(positions.length - 1, idxApprox));
			currentIndex = idxApprox;
			const target = -positions[currentIndex];
			animateTo(target);
			return;
		}
		if (!useLoop.value) {
			const targetCenter = -translateX.value + cw/2;
			let idxApprox = Math.round(targetCenter / itemStride);
			idxApprox = Math.max(0, Math.min(positions.length - 1, idxApprox));
			currentIndex = idxApprox;
			const target = -(positions[currentIndex] + itemWidth/2 - cw/2);
			animateTo(target);
		} else {
			const adjusted = translateX.value - props.startOffset;
			const targetCenter = -adjusted + cw/2;
			let idxApprox = Math.round(targetCenter / itemStride);
			idxApprox = Math.max(0, Math.min(positions.length - 1, idxApprox));
			currentIndex = idxApprox;
			const target = computeTarget(currentIndex, cw);
			animateTo(target);
		}
	}

	function pointerDown(e: PointerEvent) {
		if (!trackEl.value) return;
		if (!canDrag) return; // nada a arrastar
		// Se clicou diretamente no botão abrir não iniciar drag
		if ((e.target as HTMLElement).closest('.open-btn')) { pendingDrag = false; return; }
		pendingDrag = true;
		wasDragging = false;
		dragging = false;
		animating = false;
		trackEl.value.setPointerCapture(e.pointerId);
		dragStartX = e.clientX;
		dragStartTranslate = translateX.value;
		lastMoveX = e.clientX;
		lastMoveTime = performance.now();
		dragVelocity = 0;
		if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
	}
	function pointerMove(e: PointerEvent) {
		if (!pendingDrag) return;
		const dx = e.clientX - dragStartX;
		if (!dragging && Math.abs(dx) > DRAG_THRESHOLD) {
			dragging = true;
			wasDragging = true;
		}
		if (dragging) {
			let next = dragStartTranslate + dx;
			if (isMobile) {
				const cw = containerEl.value?.clientWidth || 0;
				// largura total (para lista mobile simples ou tripla se ainda em desktop)
				const totalWidth = positions.length ? (positions[positions.length-1] + itemWidth) : 0;
				if (!useLoop.value) {
					// clamp sem mostrar área vazia nas extremidades
					const minTranslate = -(totalWidth - cw); // fim direita
					const maxTranslate = 0; // início esquerda
					if (next < minTranslate) next = minTranslate;
					if (next > maxTranslate) next = maxTranslate;
				} else {
					if (singlePerLine) {
						// permitir deslocamento livre suavizado: sem fortes limites enquanto arrasta
						const maxTranslate = itemStride * 1.1;
						const minTranslate = -(totalWidth - itemWidth - itemStride*1.1);
						if (next > maxTranslate) next = maxTranslate;
						if (next < minTranslate) next = minTranslate;
					} else {
						const minTranslate = -(totalWidth - itemWidth - cw*0.12);
						const maxTranslate = cw*0.12;
						if (next < minTranslate) next = minTranslate;
						if (next > maxTranslate) next = maxTranslate;
					}
				}
			}
			translateX.value = next;
			// atualizar velocidade
			const now = performance.now();
			const dt = now - lastMoveTime;
			if (dt > 0) {
				dragVelocity = (e.clientX - lastMoveX) / dt; // px por ms
				lastMoveX = e.clientX;
				lastMoveTime = now;
			}
		}
	}
	function pointerUp(e: PointerEvent) {
		if (!pendingDrag) return;
		const clickedOpen = !!(e.target as HTMLElement).closest('.open-btn');
		if (!clickedOpen && dragging) {
			if (singlePerLine) {
				const totalDx = translateX.value - dragStartTranslate; // negativo = arrastou para esquerda (próximo)
				const progress = Math.abs(totalDx) / (itemStride || 1);
				const flick = Math.abs(dragVelocity) > 0.3; // limiar levemente menor para aceitar flick mais suave
				if (progress > 0.18 || flick) {
					if (totalDx < 0) currentIndex += 1; else currentIndex -= 1;
					// normalizar janela loop antes de animar
					if (useLoop.value) {
						if (currentIndex >= baseLen * 2) currentIndex -= baseLen;
						if (currentIndex < baseLen) currentIndex += baseLen;
					}
				}
				// animar até índice decidido
				const pos = positions[currentIndex] ?? 0;
				animateTo(-pos);
			} else if (!isMobile) {
				snapToClosest();
			}
		}
		pendingDrag = false;
		dragging = false;
		startAuto();
	}

	function pointerCancel(e: PointerEvent) {
		if (!pendingDrag) return;
		pendingDrag = false;
		dragging = false;
		startAuto();
	}

	function startAuto() {
		if (!props.autoAdvance) return;
		if (!useLoop.value) return; // só auto se loop ativo (desktop ou phone carrossel)
		if (autoTimer) clearInterval(autoTimer);
		autoTimer = window.setInterval(() => {
			if (dragging || animating) return;
			currentIndex += 1;
			const cw = containerEl.value?.clientWidth || 0;
			if (singlePerLine) {
				// garantir índice dentro da janela central (baseLen..2*baseLen-1)
				if (currentIndex >= baseLen * 2) currentIndex -= baseLen;
				if (currentIndex < baseLen) currentIndex += baseLen;
				let pos = positions[currentIndex];
				if (pos === undefined) {
					// fallback: recalcular setup se algo ficou inconsistente
					setup();
					pos = positions[currentIndex] || 0;
				}
				const target = -pos;
				animateTo(target);
			} else {
				if (currentIndex >= baseLen * 2) currentIndex -= baseLen;
				if (currentIndex < baseLen) currentIndex += baseLen;
				const target = computeTarget(currentIndex, cw);
				animateTo(target);
			}
		}, advanceInterval);
	}

	function pauseAll() { if (props.hoverPause) { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } } }
	function resumeAll() { if (props.hoverPause) startAuto(); }

	function handleEnter(art: Artwork) { emit('arthover', art); }
	function handleLeave(art: Artwork) { emit('arthoverout', art); }
	function handleClick(art: Artwork) { emit('artclick', art); }
	function handleKey(e: KeyboardEvent, art: Artwork) {
		if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleClick(art); }
		if (e.key === 'Escape') { emit('arthoverout', art); }
	}

	// Action para configurar lazy loading de imagem específica
	function setupImageLazyLoading(img: HTMLImageElement) {
		if (intersectionObserver) {
			intersectionObserver.observe(img);
		} else {
			// Fallback para casos onde o observer não está disponível
			const src = img.dataset.src;
			if (src) img.src = src;
		}
		
		return {
			destroy() {
				if (intersectionObserver) {
					intersectionObserver.unobserve(img);
				}
			}
		};
	}

	function setupIntersectionObserver() {
		if (!browser || intersectionObserver) return;
		
		intersectionObserver = new IntersectionObserver(
			(entries) => {
				entries.forEach(entry => {
					if (entry.isIntersecting) {
						const img = entry.target as HTMLImageElement;
						const src = img.dataset.src;
						if (src && !loadedImages.has(src)) {
							img.src = src;
							loadedImages.add(src);
							intersectionObserver?.unobserve(img);
						}
					}
				});
			},
			{ 
				root: null, 
				rootMargin: '50px',
				threshold: 0.1
			}
		);
	}

const vLazy: Directive<HTMLImageElement> = {
	mounted(el) {
		if (intersectionObserver) {
			intersectionObserver.observe(el);
		} else {
			const src = el.dataset.src;
			if (src) el.src = src;
		}
	},
	unmounted(el) {
		intersectionObserver?.unobserve(el);
	},
};

onMounted(async () => {
	if (!browser) return;
	handleResize();
	window.addEventListener('resize', handleResize);
	setupIntersectionObserver();
	await nextTick();
	setup();
});

watch(
	() => props.artworks,
	async () => {
		if (!browser) return;
		await nextTick();
		setup();
	},
	{ deep: true }
);

onBeforeUnmount(() => {
	if (!browser) return;
	window.removeEventListener('resize', handleResize);
	if (autoTimer) clearInterval(autoTimer);
	if (intersectionObserver) {
		intersectionObserver.disconnect();
		intersectionObserver = null;
	}
});
</script>

<template>
	<div
	class="gallery-line-container"
	role="group"
	aria-label="Galeria rolável"
	ref="containerEl"
	@mouseenter="pauseAll"
	@mouseleave="resumeAll"
>
	<div
		class="gallery-line-track"
		ref="trackEl"
		@pointerdown="pointerDown"
		@pointermove="pointerMove"
		@pointerup="pointerUp"
		@pointerleave="pointerUp"
		@pointercancel="pointerCancel"
		:style="{ transform: `translate3d(${translateX}px,0,0)` }"
		aria-label="Linha de quadros"
		role="list"
	>
		<figure
			v-for="(art, i) in loopedArtworks"
			:key="i"
			class="frame"
			role="listitem"
			@pointerenter="() => handleEnter(art)"
			@pointerleave="() => handleLeave(art)"
		>
			<div class="moldura drag-surface">
				<img
					:data-src="art.src"
					:alt="art.title"
					loading="lazy"
					draggable="false"
					v-lazy
					class="lazy-image"
				/>
			</div>
			<button
				class="open-btn"
				:aria-label="`Abrir detalhes de ${art.title}`"
				@click="() => handleClick(art)"
				@keydown="(e) => handleKey(e as KeyboardEvent, art)"
			>
				Detalhes
			</button>
			<figcaption>{{ art.title }}</figcaption>
		</figure>
	</div>
</div>

</template>

<style>
	/* Edge-to-edge root; configurable max-width to match main canvas; relative for fade overlays */
	.gallery-line-container { width:100%; max-width:var(--gallery-max-width, 100%); margin:0 auto; position:relative; overflow:hidden; padding:2.5% 0; box-sizing:border-box; cursor: grab; touch-action: pan-y; isolation:isolate; }
	/* Infinite illusion: blurred transparent fade edges */
	.gallery-line-container::before,
	.gallery-line-container::after {
		content: "";
		position: absolute;
		top: 0; bottom: 0;
		width: clamp(160px, 28vw, 420px);
		height: 180%;
		top: -40%;
		pointer-events: none;
		z-index: 12;
		border-radius: 50%;
		filter: blur(44px);
		opacity: 0.97;
		/* Círculo maior, fade avança mais sobre os quadros */
	}
	.gallery-line-container::before {
		left: 0;
		background: radial-gradient(circle at 0% 50%, rgba(8,10,12,0.97) 0%, rgba(8,10,12,0.65) 55%, rgba(8,10,12,0.0) 100%);
	}
	.gallery-line-container::after {
		right: 0;
		background: radial-gradient(circle at 100% 50%, rgba(8,10,12,0.97) 0%, rgba(8,10,12,0.65) 55%, rgba(8,10,12,0.0) 100%);
	}
	@supports (-webkit-mask-image: linear-gradient(#000,#000)) or (mask-image: linear-gradient(#000,#000)) {
		.gallery-line-container { -webkit-mask-image:linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%); mask-image:linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%); }
	}
	.gallery-line-container:active { cursor: grabbing; }
	.gallery-line-track { display:flex; gap:3%; user-select:none; will-change:transform; touch-action: none; }
	.gallery-line-track::-webkit-scrollbar { display:none; }
	.frame { flex:0 0 min(24%,360px); aspect-ratio:3/4.2; position:relative; margin:0; }
	.open-btn { position:absolute; inset:auto 8px 8px auto; z-index:3; background:#121417d9; backdrop-filter:blur(4px) saturate(1.2); -webkit-backdrop-filter:blur(4px) saturate(1.2); color:#ffffffd8; font-size:.65rem; letter-spacing:.12em; text-transform:uppercase; border:1px solid #2a2f35; border-radius:8px; padding:.5rem .7rem .45rem; cursor:pointer; display:inline-flex; align-items:center; gap:.35rem; font-weight:600; box-shadow:0 4px 16px -6px #000000aa,0 0 0 1px #ffffff10; transition:.25s background,.25s color,.3s transform; }
	.open-btn:hover, .open-btn:focus-visible { background:#1d2126; color:#fff; outline:none; }
	.open-btn:active { transform:scale(.9); }
	.drag-surface { cursor:grab; }
	.drag-surface:active { cursor:grabbing; }
	.moldura { width:100%; height:100%; background:#2a2a2a; padding:clamp(8px,.8vw,14px); box-sizing:border-box; border:4px solid #1a1a1a; box-shadow:0 6px 15px -3px rgba(0,0,0,.5),0 15px 35px -8px rgba(0,0,0,.4),inset 0 0 0 2px #333,inset 0 0 0 3px #000; border-radius:3px; position:relative; background-clip:padding-box; display:block; text-decoration:none; color:inherit; }
	.moldura::before { content:""; position:absolute; inset:-4px; background:linear-gradient(45deg,#444,#222,#111,#222); border-radius:3px; z-index:-1; }
	.moldura::after { content:""; position:absolute; inset:0; pointer-events:none; background:linear-gradient(135deg,rgba(255,255,255,.15) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,.1) 100%); mix-blend-mode:overlay; border-radius:2px; }
	.moldura { position:relative; }
	.moldura img { width:100%; height:100%; object-fit:cover; display:block; border-radius:2px; filter:saturate(1.05) contrast(1.02); pointer-events:none; }
	.lazy-image { background: #333; transition: opacity 0.3s ease; }
	.lazy-image:not([src]) { opacity: 0.5; }
	.moldura::after { content:""; position:absolute; inset:0; background:
		radial-gradient(circle at 50% 38%, rgba(140,180,255,.45), rgba(70,30,110,.22) 48%, rgba(0,0,0,.6) 80%),
		linear-gradient(180deg,rgba(255,255,255,.12),rgba(0,0,0,0) 60%);
		mix-blend-mode:screen; opacity:.42; transition:opacity .5s, filter .6s; pointer-events:none; border-radius:2px; }
	.frame:hover .moldura::after, .frame:focus-within .moldura::after { opacity:.9; filter:blur(.5px) brightness(1.1); }
	figcaption { position:absolute; left:50%; bottom:-2.1rem; transform:translateX(-50%); background:rgba(0,0,0,.65); color:#fff; padding:.35rem .7rem; font-size:.75rem; line-height:1; border-radius:999px; white-space:nowrap; opacity:0; transition:opacity .3s; pointer-events:none; }
	.frame:hover figcaption { opacity:1; }
	@media (max-width:767px){
		.gallery-line-container { padding:3% 0 4%; }
		.gallery-line-track { gap:4%; }
		.frame { flex:0 0 68%; max-width:270px; }
		.open-btn { font-size:.55rem; padding:.45rem .6rem .4rem; }
		figcaption { bottom:.4rem; opacity:1; background:rgba(0,0,0,.38); font-size:.68rem; }
	}
	/* Tablet (entre 560px e 819px) – limitar a no máximo 3 quadros visíveis */
	@media (min-width:560px) and (max-width:819.98px){
		.gallery-line-track { --tgap:3%; gap: var(--tgap); }
		.frame { flex:0 0 calc((100% - (var(--tgap) * 2)) / 3); max-width:calc((100% - (var(--tgap) * 2)) / 3); }
	}
	@media (max-width:560px){
		/* modo carrossel: 1 item por viewport (largura total) */
		.gallery-line-track { gap:0; }
		.frame { flex:0 0 100%; max-width:100%; aspect-ratio:auto; height:auto; }
		.moldura { aspect-ratio: 3/4; }
		.open-btn { inset:auto 10px 10px auto; font-size:.6rem; }
		.gallery-line-container { padding:2% 0 4%; }
	}
	@media (max-width:420px){
		.frame { flex:0 0 78vw; }
		figcaption { display:none; }
	}
	@media (max-width:767px){
		.gallery-line-container { overscroll-behavior-x:contain; }
	}
</style>
