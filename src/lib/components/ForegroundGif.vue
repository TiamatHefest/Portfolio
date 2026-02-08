<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import neve from '$lib/components/neve.gif';

const props = withDefaults(
	defineProps<{
		src?: string;
		width?: string;
		align?: 'center' | 'left' | 'right';
		bottomOffset?: string;
		parallax?: boolean;
		float?: boolean;
		alwaysOnTop?: boolean;
		portal?: boolean;
		deferMs?: number;
		useIdle?: boolean;
	}>(),
	{
		src: neve,
		width: 'min(100vmin, 1800px)',
		align: 'right',
		bottomOffset: '4vh',
		parallax: true,
		float: true,
		alwaysOnTop: true,
		portal: true,
		deferMs: 1000,
		useIdle: true,
	}
);

const wrapperEl = ref<HTMLDivElement | null>(null);
let placeholder: Comment | null = null;

const imageLoaded = ref(false);
const mx = ref(0);
const my = ref(0);
let rafId: number | null = null;
let loadTimer: number | null = null;
let idleId: number | null = null;

function onMove(e: PointerEvent) {
	if (!props.parallax) return;
	if (rafId) return;

	rafId = requestAnimationFrame(() => {
		const { innerWidth: w, innerHeight: h } = window;
		mx.value = e.clientX / w - 0.5;
		my.value = e.clientY / h - 0.5;
		rafId = null;
	});
}

const styleVars = computed<Record<string, string>>(() => {
	const vars: Record<string, string> = {
		'--w': props.width,
		'--align': props.align,
		'--bottom': props.bottomOffset,
		'--mx': String(mx.value),
		'--my': String(my.value),
	};
	if (props.alwaysOnTop) vars['--fg-z'] = '2147483646';
	return vars;
});

onMounted(() => {
	if (props.portal && wrapperEl.value) {
		placeholder = document.createComment('fg-portal-placeholder');
		wrapperEl.value.parentNode?.insertBefore(placeholder, wrapperEl.value);
		document.body.appendChild(wrapperEl.value);
	}

	const setLoaded = () => {
		imageLoaded.value = true;
	};

	// Carrega o GIF em idle (ou após um pequeno delay) para reduzir custo no first paint.
	if (props.useIdle && typeof (window as any).requestIdleCallback === 'function') {
		idleId = (window as any).requestIdleCallback(setLoaded, { timeout: props.deferMs });
	} else {
		loadTimer = window.setTimeout(setLoaded, props.deferMs);
	}
});

onBeforeUnmount(() => {
	if (loadTimer) {
		window.clearTimeout(loadTimer);
		loadTimer = null;
	}
	if (idleId && typeof (window as any).cancelIdleCallback === 'function') {
		(window as any).cancelIdleCallback(idleId);
		idleId = null;
	}
	if (rafId) {
		cancelAnimationFrame(rafId);
		rafId = null;
	}
	if (props.portal && wrapperEl.value && placeholder) {
		placeholder.parentNode?.insertBefore(wrapperEl.value, placeholder);
		placeholder.remove();
		placeholder = null;
	}
});
</script>

<template>
	<div
		ref="wrapperEl"
		:class="['fg-wrapper', { float: props.float }]"
		@pointermove="onMove"
		:style="styleVars"
		aria-hidden="true"
	>
		<img
			v-if="imageLoaded"
			class="fg-gif"
			:src="props.src"
			alt="foreground character"
			draggable="false"
			decoding="async"
			loading="lazy"
			fetchpriority="low"
		/>
		<div v-else class="fg-placeholder"></div>
	</div>
</template>

<style>
	/* Wrapper em cima de tudo */
	.fg-wrapper {
		position: fixed;
		inset: 0;
		pointer-events: none; /* não bloqueia interações abaixo */
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: var(--bottom);
		z-index: var(--fg-z, 9999); /* acima de todos os outros backgrounds e conteúdo */
		/* Gradiente sutil para integrar ao fundo (opcional remover) */
		background: linear-gradient(to top, rgba(0,0,0,.55) 0%, rgba(0,0,0,0) 45%);
		mix-blend-mode: normal;
	}
	/* Alinhamentos opcionais */
	.fg-wrapper[style*='--align:right'] { justify-content: flex-end; padding-right: 6vw; }
	.fg-wrapper[style*='--align:left'] { justify-content: flex-start; padding-left: 6vw; }

	.fg-gif {
		width: var(--w);
		max-width: 100%;
		object-fit: contain;
		filter: saturate(1.05) contrast(1.05) brightness(.98);
		image-rendering: auto;
		transform: translate3d(calc(var(--mx)*20px), calc(var(--my)*15px), 0);
		will-change: transform, filter;
		animation: var(--floatAnim);
	}
	.float .fg-gif { --floatAnim: floatY 8s ease-in-out infinite; }
	:not(.float) .fg-gif { --floatAnim: none; }

	@media (prefers-reduced-motion: reduce) {
		.fg-gif { animation: none !important; }
	}

	@keyframes floatY {
		0%,100% { transform:translate3d(calc(var(--mx)*20px), calc(var(--my)*15px), 0) translateY(-2%); }
		50% { transform:translate3d(calc(var(--mx)*20px), calc(var(--my)*15px), 0) translateY(2%); }
	}

	.fg-placeholder {
		width: var(--w);
		max-width: 100%;
		aspect-ratio: 1;
		background: transparent;
		opacity: 0;
	}

	@media (max-width:800px){
		.fg-wrapper { padding-right:3vw; padding-left:3vw; }
		.fg-gif { width:min(70vmin,480px); }
		.fg-placeholder { width:min(70vmin,480px); }
	}
</style>
