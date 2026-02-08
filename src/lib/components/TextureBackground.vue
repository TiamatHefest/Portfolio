<script setup lang="ts">
import { computed } from 'vue';
import leafsFalling from '$lib/components/leafsFalling.gif';

type Layer = 'back' | 'front';

const props = withDefaults(
	defineProps<{
		src?: string;
		opacity?: number;
		size?: string;
		blend?: string;
		layer?: Layer;
		flowSpeed?: number;
	}>(),
	{
		src: leafsFalling,
		opacity: 0.5,
		size: '1920px',
		blend: 'multiply',
		layer: 'back',
		flowSpeed: 20,
	}
);

const overlayStyle = computed(() => ({
	'--tx-img': `url(${props.src})`,
	'--tx-opacity': String(props.opacity),
	'--tx-size': props.size,
	'--tx-blend': props.blend,
	'--flow-speed': `${props.flowSpeed}s`,
}));
</script>

<template>
	<section>
		<div class="container">
			<div
				:class="['texture-overlay', { front: props.layer === 'front' }]"
				aria-hidden="true"
				:style="overlayStyle"
			></div>
			<div v-if="props.layer !== 'front'" class="texture-base" aria-hidden="true"></div>
		</div>
	</section>
</template>

<style>
	*,
	*::before,
	*::after {
		box-sizing: border-box;
		margin: 0;
	}

	.container {
		position: relative;
		overflow: hidden;
	}

	/* Removed unused .title and .content selectors */

	.texture-base {
		position: fixed;
		inset: 0;
		/* neutral gray base (was colored). slightly lighter than black to reveal layers */
		background: linear-gradient(180deg,#2f2f32 0%, #3a3a3a 100%);
		z-index: -10;
		opacity: 0.85;
		pointer-events: none;
	}

	.texture-overlay {
		position: fixed;
		inset: -150%;
		pointer-events: none;
		background-image: var(--tx-img);
		background-repeat: repeat;
		background-size: var(--tx-size) var(--tx-size);
		opacity: var(--tx-opacity, 0.6);
		mix-blend-mode: var(--tx-blend, multiply);
		will-change: transform, opacity;
		/* slightly more contrast/brightness to make details pop against gray base */
		filter: contrast(1.12) brightness(1.02) saturate(.9);
		animation: verticalFlow var(--flow-speed,6s) linear infinite, noiseJitter 8s ease-in-out infinite, flicker 3.8s steps(2,end) infinite, drift 14s ease-in-out infinite;
		background-position: 0 0;
		background-color: transparent;
		z-index: -7;
	}
	.texture-overlay.front { z-index: 50; opacity: calc(var(--tx-opacity,0.6) * 0.4); filter: contrast(1.05) brightness(1.03); }

	/* Scanlines */
	.texture-overlay::after {
		content: "";
		position: absolute;
		inset: 0;
		opacity:.55;
		background:repeating-linear-gradient(to bottom,rgba(0,0,0,0) 0 2px,rgba(0,0,0,.55) 2px 3px);
		mix-blend-mode: multiply;
		pointer-events: none;
		animation: scanShift 12s linear infinite;
	}

	/* Color speckles overlay */
	/* subtle, desaturated speckling to replace colored blotches */
	.texture-overlay::before {
		content: "";
		position: absolute;
		inset: 0;
		background: radial-gradient(circle at 20% 30%, rgba(255,255,255,.03), transparent 60%), radial-gradient(circle at 80% 60%, rgba(255,255,255,.02), transparent 55%), radial-gradient(circle at 60% 20%, rgba(255,255,255,.015), transparent 50%);
		opacity: .28;
		mix-blend-mode: screen;
		pointer-events: none;
		animation: colorFlicker 10s linear infinite;
	}

	@keyframes noiseMove {
		0% {
			transform: translate(0, 0);
		}

		20% {
			transform: translate(-2%, 1%);
		}

		40% {
			transform: translate(1.5%, -1.5%);
		}

		60% {
			transform: translate(-1%, 2%);
		}

		80% {
			transform: translate(1%, -1%);
		}

		100% {
			transform: translate(0, 0);
		}
	}

	@keyframes flicker {
		0%,
		96%,
		100% { opacity: var(--tx-opacity); }

		97% { opacity: calc(var(--tx-opacity) * 0.9); }

		98% { opacity: calc(var(--tx-opacity) * 1.15); }

		99% { opacity: calc(var(--tx-opacity) * 0.85); }
	}

	@keyframes drift {
		0% {
			filter: contrast(1.05) brightness(.95);
		}

		50% {
			filter: contrast(1.12) brightness(1) saturate(.95);
		}

		100% {
			filter: contrast(1.05) brightness(.95);
		}
	}

	@keyframes colorFlicker {
		0%,
		100% {
			opacity: .45;
		}

		50% {
			opacity: .6;
		}

		70% {
			opacity: .35;
		}
	}

	@keyframes scanShift {
		0% {
			transform: translateY(0);
		}

		100% {
			transform: translateY(-3px);
		}
	}
	@keyframes verticalFlow {
		0% { background-position: 0 0; }
		100% { background-position: 0 900px; }
	}
	@keyframes noiseJitter {
		0% { transform: translate3d(0,0,0); }
		12% { transform: translate3d(-1%,0.4%,0); }
		25% { transform: translate3d(0.6%,-0.6%,0); }
		37% { transform: translate3d(-0.4%,0.8%,0); }
		50% { transform: translate3d(0.5%,-0.4%,0); }
		62% { transform: translate3d(-0.3%,0.6%,0); }
		75% { transform: translate3d(0.4%,-0.5%,0); }
		87% { transform: translate3d(-0.2%,0.3%,0); }
		100% { transform: translate3d(0,0,0); }
	}

	@media (prefers-reduced-motion: reduce) {
		.texture-overlay { animation: none !important; }
		.texture-overlay::before { animation: none !important; }
		.texture-overlay::after { animation: none !important; }
	}
</style>
