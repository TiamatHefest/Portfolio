<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import type { Artwork } from './types';

const browser = typeof window !== 'undefined';

const emit = defineEmits<{
	(e: 'artclick', art: Artwork): void;
	(e: 'arthover', art: Artwork): void;
	(e: 'arthoverout', art: Artwork): void;
}>();

const props = withDefaults(
	defineProps<{
		artworks: Artwork[];
		hoverPause?: boolean;
		autoAdvance?: boolean;
		// compat: these exist in Svelte version; not used after refactor
		autoScroll?: boolean;
		speed?: number;
	}>(),
	{
		hoverPause: true,
		autoAdvance: true,
		autoScroll: true,
		speed: 0.45,
	}
);

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
let singlePerLine = false;
const useLoop = ref(true);

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

const baseOrientations = ref<boolean[]>([]);
function landscapeFor(i: number) {
	return baseOrientations.value[i % (baseLen || 1)] || false;
}

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

let resizeRaf = 0;
function onResize() {
	handleResize();
	if (resizeRaf) cancelAnimationFrame(resizeRaf);
	resizeRaf = requestAnimationFrame(() => setup());
}

function ensureOrientations() {
	baseLen = props.artworks.length;
	if (!baseLen) {
		baseOrientations.value = [];
		return;
	}
	if (baseOrientations.value.length === baseLen) return;
	baseOrientations.value = new Array(baseLen).fill(false);
	props.artworks.forEach((a, idx) => {
		const img = new Image();
		img.src = a.src;
		const finalize = () => {
			const next = baseOrientations.value.slice();
			next[idx] = img.naturalWidth > img.naturalHeight;
			baseOrientations.value = next;
		};
		if (img.complete) finalize();
		else img.onload = finalize;
	});
}

function setup() {
	if (!browser || !trackEl.value) return;
	ensureOrientations();

	const all = trackEl.value.querySelectorAll<HTMLElement>('.frame');
	if (all.length < 1) return;
	if (all.length === 1) {
		itemWidth = all[0].getBoundingClientRect().width;
		itemStride = itemWidth + 32;
		positions = [0];
	} else {
		const r1 = all[0].getBoundingClientRect();
		const r2 = all[1].getBoundingClientRect();
		itemWidth = r1.width;
		itemStride = r2.left - r1.left;
		if (itemStride <= 0) itemStride = itemWidth + 32;
		positions = Array.from({ length: all.length }, (_, i) => i * itemStride);
	}

	const totalWidth = baseLen ? (baseLen - 1) * itemStride + itemWidth : 0;
	if (useLoop.value) {
		currentIndex = baseLen;
		snapImmediate();
	} else {
		currentIndex = 0;
		const cw = containerEl.value?.clientWidth || 0;
		if (totalWidth < cw) {
			canDrag = false;
			translateX.value = (cw - totalWidth) / 2;
		} else {
			canDrag = true;
			translateX.value = 0;
		}
	}
	startAuto();
}

function snapImmediate() {
	if (!containerEl.value) return;
	const cw = containerEl.value.clientWidth;
	if (singlePerLine) {
		translateX.value = -positions[currentIndex];
	} else {
		translateX.value = -(positions[currentIndex] + itemWidth / 2 - cw / 2);
	}
}

function animateTo(target: number) {
	const fastEase = singlePerLine ? 0.18 : 0.12;
	animating = true;
	function step() {
		translateX.value += (target - translateX.value) * fastEase;
		const threshold = singlePerLine ? 0.35 : 0.5;
		if (Math.abs(target - translateX.value) < threshold) {
			translateX.value = target;
			animating = false;
			normalizeIndex();
			return;
		}
		requestAnimationFrame(step);
	}
	requestAnimationFrame(step);
}

function normalizeIndex() {
	if (!useLoop.value) return;
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
	if (singlePerLine) {
		let idxApprox = Math.round(-translateX.value / itemStride);
		idxApprox = Math.max(0, Math.min(positions.length - 1, idxApprox));
		currentIndex = idxApprox;
		const target = -positions[currentIndex];
		animateTo(target);
		return;
	}
	const targetCenter = -translateX.value + cw / 2;
	let idxApprox = Math.round(targetCenter / itemStride);
	idxApprox = Math.max(0, Math.min(positions.length - 1, idxApprox));
	currentIndex = idxApprox;
	const target = -(positions[currentIndex] + itemWidth / 2 - cw / 2);
	animateTo(target);
}

function pointerDown(e: PointerEvent) {
	if (!trackEl.value) return;
	if (!canDrag) return;
	if ((e.target as HTMLElement).closest('.open-btn')) {
		pendingDrag = false;
		return;
	}
	pendingDrag = true;
	wasDragging = false;
	dragging = false;
	animating = false;
	try {
		trackEl.value.setPointerCapture(e.pointerId);
	} catch {}
	dragStartX = e.clientX;
	dragStartTranslate = translateX.value;
	lastMoveX = e.clientX;
	lastMoveTime = performance.now();
	dragVelocity = 0;
	if (autoTimer) {
		clearInterval(autoTimer);
		autoTimer = null;
	}
}

function pointerMove(e: PointerEvent) {
	if (!pendingDrag) return;
	const dx = e.clientX - dragStartX;
	if (!dragging && Math.abs(dx) > DRAG_THRESHOLD) {
		dragging = true;
		wasDragging = true;
	}
	if (!dragging) return;

	let next = dragStartTranslate + dx;
	if (isMobile) {
		const cw = containerEl.value?.clientWidth || 0;
		const totalWidth = positions.length ? positions[positions.length - 1] + itemWidth : 0;
		if (!useLoop.value) {
			const minTranslate = -(totalWidth - cw);
			const maxTranslate = 0;
			if (next < minTranslate) next = minTranslate;
			if (next > maxTranslate) next = maxTranslate;
		} else {
			if (singlePerLine) {
				const maxTranslate = itemStride * 1.1;
				const minTranslate = -(totalWidth - itemWidth - itemStride * 1.1);
				if (next > maxTranslate) next = maxTranslate;
				if (next < minTranslate) next = minTranslate;
			} else {
				const minTranslate = -(totalWidth - itemWidth - cw * 0.12);
				const maxTranslate = cw * 0.12;
				if (next < minTranslate) next = minTranslate;
				if (next > maxTranslate) next = maxTranslate;
			}
		}
	}

	translateX.value = next;

	const now = performance.now();
	const dt = now - lastMoveTime;
	if (dt > 0) {
		dragVelocity = (e.clientX - lastMoveX) / dt;
		lastMoveX = e.clientX;
		lastMoveTime = now;
	}
}

function pointerUp(e: PointerEvent) {
	if (!pendingDrag) return;
	const clickedOpen = !!(e.target as HTMLElement).closest('.open-btn');
	try {
		trackEl.value?.releasePointerCapture(e.pointerId);
	} catch {}

	if (!clickedOpen && dragging) {
		if (singlePerLine) {
			const totalDx = translateX.value - dragStartTranslate;
			const progress = Math.abs(totalDx) / (itemStride || 1);
			const flick = Math.abs(dragVelocity) > 0.3;
			if (progress > 0.18 || flick) {
				if (totalDx < 0) currentIndex += 1;
				else currentIndex -= 1;
				if (useLoop.value) {
					if (currentIndex >= baseLen * 2) currentIndex -= baseLen;
					if (currentIndex < baseLen) currentIndex += baseLen;
				}
			}
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

function pointerCancel() {
	if (!pendingDrag) return;
	pendingDrag = false;
	dragging = false;
	startAuto();
}

function startAuto() {
	if (!props.autoAdvance) return;
	if (!useLoop.value) return;
	if (!browser) return;
	if (autoTimer) clearInterval(autoTimer);
	autoTimer = window.setInterval(() => {
		if (dragging || animating) return;
		currentIndex += 1;
		const cw = containerEl.value?.clientWidth || 0;
		if (singlePerLine) {
			if (currentIndex >= baseLen * 2) currentIndex -= baseLen;
			if (currentIndex < baseLen) currentIndex += baseLen;
			let pos = positions[currentIndex];
			if (pos === undefined) {
				setup();
				pos = positions[currentIndex] || 0;
			}
			animateTo(-pos);
		} else {
			if (currentIndex >= baseLen * 2) currentIndex -= baseLen;
			if (currentIndex < baseLen) currentIndex += baseLen;
			const target = -(positions[currentIndex] + itemWidth / 2 - cw / 2);
			animateTo(target);
		}
	}, advanceInterval);
}

function pauseAll() {
	if (!props.hoverPause) return;
	if (autoTimer) {
		clearInterval(autoTimer);
		autoTimer = null;
	}
}

function resumeAll() {
	if (!props.hoverPause) return;
	startAuto();
}

function handleEnter(art: Artwork) {
	emit('arthover', art);
}
function handleLeave(art: Artwork) {
	emit('arthoverout', art);
}
function handleClick(art: Artwork) {
	if (wasDragging) {
		wasDragging = false;
		return;
	}
	emit('artclick', art);
}
function handleKey(e: KeyboardEvent, art: Artwork) {
	if (e.key === 'Enter' || e.key === ' ') {
		e.preventDefault();
		handleClick(art);
	}
	if (e.key === 'Escape') emit('arthoverout', art);
}

onMounted(async () => {
	if (!browser) return;
	handleResize();
	window.addEventListener('resize', onResize);
	await nextTick();
	setup();
});

watch(
	() => [props.artworks, useLoop.value],
	async () => {
		baseOrientations.value = [];
		await nextTick();
		setup();
	},
	{ deep: true }
);

onBeforeUnmount(() => {
	if (!browser) return;
	window.removeEventListener('resize', onResize);
	if (resizeRaf) cancelAnimationFrame(resizeRaf);
	if (autoTimer) clearInterval(autoTimer);
});
</script>

<template>
	<section class="gallery-line-container" role="list" aria-label="Linha de galeria" ref="containerEl" @mouseenter="pauseAll" @mouseleave="resumeAll">
		<div
			class="gallery-line-track"
			ref="trackEl"
			@pointerdown="pointerDown"
			@pointermove="pointerMove"
			@pointerup="pointerUp"
			@pointerleave="pointerUp"
			@pointercancel="pointerCancel"
			:style="{ transform: `translate3d(${translateX}px,0,0)` }"
			aria-label="Linha de quadros" role="list"
		>
			<figure
				v-for="(art, i) in loopedArtworks"
				:key="i"
				:class="['frame', { landscape: landscapeFor(i) }]"
				role="listitem"
				:aria-label="art.title"
				@pointerenter="() => handleEnter(art)"
				@pointerleave="() => handleLeave(art)"
			>
				<div class="phone-shell drag-surface">
					<div class="notch" aria-hidden="true"></div>
					<div class="screen-wrap">
						<img :src="art.src" :alt="art.title" loading="lazy" draggable="false" />
					</div>
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
	</section>
</template>

<style>
	/* Edge-to-edge root; allow matching main canvas via max-width var; add relative for fade overlays */
	.gallery-line-container { width:100%; max-width:var(--gallery-max-width, 100%); margin:0 auto; position:relative; overflow:hidden; padding:2.5% 0; box-sizing:border-box; cursor: grab; touch-action: pan-y; isolation:isolate; }
	/* Infinite illusion: blurred transparent fade at left/right */
	.gallery-line-container::before,
	.gallery-line-container::after {
		content: "";
		position: absolute;
		top: -40%;
		bottom: 0;
		width: clamp(160px, 28vw, 420px);
		height: 180%;
		pointer-events: none;
		z-index: 12;
		border-radius: 50%;
		filter: blur(44px);
		opacity: 0.97;
		mix-blend-mode: normal;
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
	/* Mask to soften edges further (fallback if backdrop-filter unsupported it still uses gradients) */
	@supports (-webkit-mask-image: linear-gradient(#000,#000)) or (mask-image: linear-gradient(#000,#000)) {
		.gallery-line-container { -webkit-mask-image:linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%); mask-image:linear-gradient(to right, transparent 0%, #000 6%, #000 94%, transparent 100%); }
	}
	.gallery-line-container:active { cursor: grabbing; }
	.gallery-line-track { display:flex; gap:3%; user-select:none; will-change:transform; touch-action: none; }
	.gallery-line-track::-webkit-scrollbar { display:none; }
	.frame { flex:0 0 min(24%,340px); aspect-ratio:9/19.5; position:relative; margin:0; display:flex; align-items:center; justify-content:center; }
	.frame.landscape { aspect-ratio:19.5/9; }
	.open-btn { position:absolute; inset:auto 8px 8px auto; z-index:6; background:#121417d9; backdrop-filter:blur(4px) saturate(1.2); -webkit-backdrop-filter:blur(4px) saturate(1.2); color:#ffffffd8; font-size:.6rem; letter-spacing:.12em; text-transform:uppercase; border:1px solid #2a2f35; border-radius:8px; padding:.45rem .65rem .4rem; cursor:pointer; display:inline-flex; align-items:center; gap:.35rem; font-weight:600; box-shadow:0 4px 16px -6px #000000aa,0 0 0 1px #ffffff10; transition:.25s background,.25s color,.3s transform; }
	.open-btn:hover, .open-btn:focus-visible { background:#1d2126; color:#fff; outline:none; }
	.open-btn:active { transform:scale(.9); }
	.drag-surface { cursor:grab; }
	.drag-surface:active { cursor:grabbing; }

	/* Phone shell */
	.phone-shell { position:relative; width:100%; height:100%; border-radius:34px; background:#050607; box-shadow:0 4px 10px -2px rgba(0,0,0,.55),0 14px 35px -10px rgba(0,0,0,.55),0 0 0 1px #ffffff0a,0 0 0 2px #000; padding:10px; box-sizing:border-box; display:flex; }
	.frame.landscape .phone-shell { padding:8px 10px; }
	.phone-shell::before { content:""; position:absolute; inset:0; border-radius:34px; background:linear-gradient(160deg,#22242a,#0f1013 65%,#1c2228); mix-blend-mode:normal; pointer-events:none; }
	.phone-shell::after { content:""; position:absolute; inset:2px; border-radius:30px; background:radial-gradient(circle at 30% 20%,#ffffff10,transparent 60%); pointer-events:none; }

	/* Notch portrait */
	.frame:not(.landscape) .phone-shell > .notch { position:absolute; top:4px; left:50%; width:88px; height:18px; background:#050607; border-radius:0 0 14px 14px; transform:translateX(-50%); box-shadow:0 2px 4px -2px #000000aa, 0 0 0 1px #0d0f12; }
	/* Side notch (simulate camera) for landscape (optional) */
	.frame.landscape::after { content:""; position:absolute; top:50%; left:6px; width:18px; height:88px; background:#050607; border-radius:14px 0 0 14px; transform:translateY(-50%); box-shadow:0 0 0 1px #0d0f12; }

	.screen-wrap { position:relative; z-index:2; flex:1; border-radius:26px; overflow:hidden; background:#000; display:flex; }
	.screen-wrap img { width:100%; height:100%; object-fit:cover; display:block; filter:saturate(1.08) contrast(1.05); }
	/* Screen glow overlay */
	.screen-wrap::after { content:""; position:absolute; inset:0; background:
		radial-gradient(circle at 50% 35%, rgba(120,160,255,.55), rgba(80,40,120,.25) 40%, rgba(0,0,0,.55) 75%),
		linear-gradient(180deg,rgba(255,255,255,.15),rgba(0,0,0,0) 55%);
		mix-blend-mode:screen; opacity:.55; pointer-events:none; transition:opacity .5s, filter .6s; }
	.frame:hover .screen-wrap::after, .frame:focus-within .screen-wrap::after { opacity:.95; filter:blur(1px) brightness(1.08); }
	.frame.landscape .screen-wrap { border-radius:26px; }

	/* Accent border glow (hover/focus) */
	.frame { position:relative; }
	.frame::before { content:""; position:absolute; inset:0; border-radius:34px; padding:2px; background:linear-gradient(140deg,#3d9aff,#7d41ff 45%,#ff2e63); -webkit-mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask:linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite:xor; mask-composite:exclude; opacity:.18; transition:opacity .4s, filter .55s, transform .6s; filter:blur(6px) brightness(.85); }
	.frame:hover::before, .frame:focus-within::before { opacity:.9; filter:blur(12px) brightness(1.15) saturate(1.2); transform:scale(1.02); }
	/* Add inner subtle glow */
	.frame::after { content:""; position:absolute; inset:4px; border-radius:30px; background:radial-gradient(circle at 30% 20%,rgba(255,255,255,.08),rgba(255,255,255,0) 70%); opacity:.35; mix-blend-mode:overlay; pointer-events:none; transition:opacity .4s; }
	.frame:hover::after, .frame:focus-within::after { opacity:.55; }

	figcaption { left:50%; }

	figcaption { position:absolute; left:50%; bottom:-2.1rem; transform:translateX(-50%); background:rgba(0,0,0,.65); color:#fff; padding:.35rem .7rem; font-size:.75rem; line-height:1; border-radius:999px; white-space:nowrap; opacity:0; transition:opacity .3s; pointer-events:none; }
	.frame:hover figcaption { opacity:1; }
	@media (max-width:767px){
		.gallery-line-container { padding:3% 0 4%; }
		.gallery-line-track { gap:4%; }
		.frame { flex:0 0 68%; max-width:300px; }
		.open-btn { font-size:.5rem; padding:.4rem .55rem .35rem; }
		figcaption { bottom:.4rem; opacity:1; background:rgba(0,0,0,.38); font-size:.66rem; }
	}
	/* Tablet médio (560px–819px): limitar a no máximo 3 telefones visíveis */
	@media (min-width:560px) and (max-width:819.98px){
		.gallery-line-track { --tgap:3%; gap: var(--tgap); }
		.frame { flex:0 0 calc((100% - (var(--tgap) * 2)) / 3); max-width:calc((100% - (var(--tgap) * 2)) / 3); }
	}
	@media (max-width:560px){
		.gallery-line-track { gap:0; }
		.frame { flex:0 0 100%; max-width:100%; }
		.open-btn { inset:auto 10px 10px auto; font-size:.5rem; padding:.42rem .55rem .36rem; }
		.gallery-line-container { padding:2% 0 4%; }
		.phone-shell { border-radius:34px; }
	}
	@media (max-width:420px){
		.frame { flex:0 0 80vw; }
		figcaption { display:none; }
		.open-btn { font-size:.46rem; letter-spacing:.1em; }
	}
</style>
