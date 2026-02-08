<script setup lang="ts">
import { computed, ref } from 'vue';

import image1 from '$lib/assets/textures/testCharacter---.png';
import image2 from '$lib/assets/textures/Amman-in-negative.png';
import noise1 from '$lib/assets/textures/noise1.jpg';
import glitch1 from '$lib/assets/textures/glitch1.jpg';
import skaura from '$lib/assets/textures/skaura.gif';

type LayerSpec = {
	img: string;
	z: number;
	scale: number;
	strength: number;
	opacity: number;
};

type Layers = {
	texture: LayerSpec;
	city: LayerSpec;
	midFx: LayerSpec;
	front: LayerSpec;
	foregroundGif: LayerSpec;
};

const props = withDefaults(
	defineProps<{
		layers?: Layers;
		baseZ?: number;
		pointerParallax?: boolean;
		animate?: boolean;
		globalStrength?: number;
		perspectiveComp?: number;
	}>(),
	{
		layers: () => ({
			texture: { img: noise1, z: -900, scale: 1.9, strength: 15, opacity: 0.3 },
			city: { img: image2, z: -650, scale: 2.2, strength: 25, opacity: 0.65 },
			midFx: { img: glitch1, z: -420, scale: 1.4, strength: 40, opacity: 0.4 },
			front: { img: image1, z: -180, scale: 1.15, strength: 55, opacity: 0.85 },
			foregroundGif: { img: skaura, z: -60, scale: 1.05, strength: 65, opacity: 0.95 },
		}),
		baseZ: -50,
		pointerParallax: true,
		animate: true,
		globalStrength: 1,
		perspectiveComp: 1,
	}
);

const mx = ref(0);
const my = ref(0);

function handlePointer(e: PointerEvent) {
	if (!props.pointerParallax) return;
	const { innerWidth: w, innerHeight: h } = window;
	mx.value = e.clientX / w - 0.5;
	my.value = e.clientY / h - 0.5;
}

const stageStyle = computed(() => ({
	'--mx': String(mx.value),
	'--my': String(my.value),
	'--baseZ': String(props.baseZ),
	'--gStrength': String(props.globalStrength),
	'--perspComp': String(props.perspectiveComp),
}));

function layerStyle(layer: LayerSpec) {
	return {
		'--img': `url(${layer.img})`,
		'--z': `${layer.z}px`,
		'--scale': String(layer.scale),
		'--strength': String(layer.strength),
		'--op': String(layer.opacity),
	} as Record<string, string>;
}
</script>

<template>
	<section
		:class="['depth-stage', { 'no-anim': !props.animate }]"
		@pointermove="handlePointer"
		:style="stageStyle"
		aria-hidden="true"
	>
		<div class="layer layer-texture" data-name="texture" :style="layerStyle(props.layers.texture)"></div>
		<div class="layer layer-city" data-name="city" :style="layerStyle(props.layers.city)"></div>
		<div class="layer layer-midFx" data-name="midFx" :style="layerStyle(props.layers.midFx)"></div>
		<div class="layer layer-front" data-name="front" :style="layerStyle(props.layers.front)"></div>
		<div class="content-slot" aria-hidden="false"><slot /></div>
	</section>
</template>

<style>
	/* RESET BÁSICO */
	* { box-sizing:border-box; margin:0; }

	.depth-stage {
		position: fixed;
		inset:0;
		pointer-events:none; /* layers não bloqueiam UI */
		perspective: 1600px; /* Aumente para profundidade mais sutil, diminua para mais dramática */
		transform-style: preserve-3d;
		z-index: var(--baseZ);
		background: radial-gradient(circle at 50% 60%, #0e0e11 0%, #050507 70%, #020203 100%); /* leve vinheta */
		overflow:hidden;
	}
	.depth-stage.no-anim .layer { animation: none !important; }
	.content-slot { position:relative; pointer-events:auto; z-index: 10; }

	/* LAYER BASE */
	.layer {
		position:absolute;
		inset:0;
		background-image:var(--img);
		background-position:center;
		background-size:cover;
		background-repeat:no-repeat;
		will-change:transform, filter, opacity;
		opacity:var(--op,0.7);
		mix-blend-mode:normal;
		/* TRANSFORMAÇÃO 3D */
		/* translateZ usa --z; aplicamos parallax XY multiplicando força global */
		transform: translate3d(
			calc(var(--mx) * var(--strength,0) * 1px * var(--gStrength,1)),
			calc(var(--my) * var(--strength,0) * 1px * var(--gStrength,1)),
			var(--z,0px)
		) scale(calc(var(--scale,1) * var(--perspComp,1)));
		animation: layerDrift 28s ease-in-out infinite;
		filter: saturate(.9);
	}

	/* ESPECÍFICAS */
	.layer-texture { filter: contrast(1.25) brightness(0.55); mix-blend-mode:multiply; animation: scan 1.4s linear infinite, layerDrift 40s ease-in-out infinite; }
	.layer-city { filter: brightness(.55) contrast(.9) blur(1.5px); /* ATMOSFERA / PROFUNDIDADE */ }
	.layer-midFx { mix-blend-mode:screen; filter: blur(2px) brightness(.65) contrast(1.1); animation: glitchShift 6s steps(2,end) infinite, layerDrift 24s ease-in-out infinite; }
	.layer-front { filter: contrast(1.05) brightness(.92) drop-shadow(0 0 6px rgba(255,255,255,0.08)); }
	.layer-foregroundGif { mix-blend-mode:screen; filter: brightness(1.05) contrast(1.05) drop-shadow(0 0 4px rgba(255,90,170,0.35)); animation: float 7s ease-in-out infinite, layerDrift 32s ease-in-out infinite, chroma 5s linear infinite; }

	/* Comentário: Ajuste a intensidade de vibração 'glitchShift' ou remova se não quiser efeito */

	/* VARIÁVEIS GLOBAIS aplicadas via style inline JS */
	:root, .depth-stage { --gStrength: 1; --perspComp: 1; }
	.depth-stage { --gStrength: calc(var(--gStrength) * 1); --perspComp: calc(var(--perspComp) * 1); }

	/* ANIMAÇÕES */
	@keyframes layerDrift { 0%{ transform:translate3d(0,0,var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))); } 50%{ transform:translate3d(0,-0.8%,var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))); } 100%{ transform:translate3d(0,0,var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))); } }
	@keyframes scan { 0%{ background-position:0 0; } 100%{ background-position:0 880px; } }
	@keyframes float { 0%,100%{ transform:translate3d(calc(var(--mx)*var(--strength)*1px), calc(var(--my)*var(--strength)*1px), var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))) translateY(-2%); } 50%{ transform:translate3d(calc(var(--mx)*var(--strength)*1px), calc(var(--my)*var(--strength)*1px), var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))) translateY(2%); } }
	@keyframes glitchShift { 0%,100%{ filter: blur(2px) brightness(.65) contrast(1.1); } 48%{ filter: blur(2px) brightness(.65) contrast(1.1); } 49%{ filter: blur(2px) brightness(.8) contrast(1.25) hue-rotate(10deg); transform:translate3d(2px, -1px, var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))); } 50%{ filter: blur(2px) brightness(.55) contrast(1.2) hue-rotate(-12deg); transform:translate3d(-3px,1px,var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))); } 51%{ filter: blur(2px) brightness(.65) contrast(1.1); } }
	@keyframes chroma { 0%,100%{ filter: brightness(1.05) contrast(1.05) drop-shadow(0 0 4px rgba(255,90,170,0.35)); } 50%{ filter: brightness(1.08) contrast(1.08) drop-shadow(0 0 8px rgba(255,40,120,0.4)); } }

	/* RESPONSIVO */
	@media (max-width: 900px) {
		/* reduzir exagero de scale para caber melhor em telas pequenas */
		.layer-city { scale: 1.5; filter: brightness(.55) contrast(.85) blur(1.1px); }
		.layer-midFx { scale: 1.25; }
		.layer-front { scale: 1.05; }
		.layer-foregroundGif { scale: 1.04; }
	}
	@media (max-width:600px){
		.depth-stage { perspective: 1200px; }
		.layer-city { scale:1.35; }
		.layer-midFx { scale:1.18; }
		.layer-front { scale:1.02; }
	}
	@media (max-width:430px){
		.layer-city { scale:1.28; }
		.layer-midFx { scale:1.12; }
		.layer-front { scale:1; }
	}

	@media (prefers-reduced-motion: reduce) {
		.depth-stage .layer { animation: none !important; }
		.layer-midFx { animation: none !important; }
	}
</style>
