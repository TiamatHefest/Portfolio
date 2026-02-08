<script setup lang="ts">
import { computed, ref } from 'vue';

// import image1 from '$lib/assets/textures/testCharacter---.png'; // REMOVIDO
import image2 from '$lib/assets/textures/Amman-in-negative.png';
import wallCastel from '$lib/assets/textures/wall_castelStone.avif';
// import noise1 from '$lib/assets/textures/noise1.jpg'; // COMENTADO - substituído por leafsFalling
import leafsFalling from '$lib/components/leafsFalling.gif';
// import glitch1 from '$lib/assets/textures/glitch1.jpg'; // DESATIVADO
import neve from '$lib/components/neve.gif';

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
		cityImage?: string;
		foregroundGifImage?: string;
	}>(),
	{
		layers: () => ({
			// texture: { img: noise1, z: -900, scale: 1.9, strength: 15, opacity: 0.3 }, // COMENTADO - noise substituído
			texture: { img: leafsFalling, z: -900, scale: 1.0, strength: 15, opacity: 0.3 }, // leafsFalling.gif com repetição horizontal
			city: { img: image2, z: -650, scale: 1.5, strength: 25, opacity: 0.65 },
			// midFx: { img: glitch1, z: -420, scale: 1.4, strength: 40, opacity: 0.4 }, // DESATIVADO
			// front: { img: image1, z: -180, scale: 1.15, strength: 55, opacity: 0.85 }, // REMOVIDO
			foregroundGif: { img: leafsFalling, z: -60, scale: 2.2, strength: 65, opacity: 0.95 },
		}),
		baseZ: -50,
		pointerParallax: true,
		animate: true,
		globalStrength: 1,
		perspectiveComp: 1,
		cityImage: image2,
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

const cityLayer = computed(() => ({
	...props.layers.city,
	img: props.cityImage
}));

const foregroundGifLayer = computed(() => ({
	...props.layers.foregroundGif,
	img: props.foregroundGifImage || props.layers.foregroundGif.img
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
		<div class="layer layer-city" data-name="city" :style="layerStyle(cityLayer)"></div>
		<!-- <div class="layer layer-midFx" data-name="midFx" :style="layerStyle(props.layers.midFx)"></div> -->
		<!-- <div class="layer layer-front" data-name="front" :style="layerStyle(props.layers.front)"></div> -->
		<div class="layer layer-foregroundGif" data-name="foregroundGif" :style="layerStyle(foregroundGifLayer)"></div>
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

	/* ESPECÍFICAS - Animações simplificadas para melhor performance */
	/* layer-texture: leafsFalling.gif repetindo horizontalmente ocupando tela inteira */
	.layer-texture { 
		filter: contrast(1.2) brightness(0.6); 
		mix-blend-mode:multiply; 
		animation: layerDrift 50s ease-in-out infinite;
		background-size: auto 100%; /* Altura 100%, largura automática */
		background-repeat: repeat-x; /* Repetição horizontal */
		background-position: center center;
	}
	.layer-city { filter: brightness(.6) contrast(.9) blur(1px); animation: layerDrift 40s ease-in-out infinite; }
	/* .layer-midFx - DESATIVADO */
	/* .layer-front - REMOVIDO */
	.layer-foregroundGif { mix-blend-mode:screen; filter: brightness(1.05) contrast(1.05) drop-shadow(0 0 4px rgba(255,90,170,0.35)); animation: float 9s ease-in-out infinite; }

	/* Comentário: Removidas animações pesadas scan, glitchShift e chroma para melhor performance */

	/* VARIÁVEIS GLOBAIS aplicadas via style inline JS */
	:root, .depth-stage { --gStrength: 1; --perspComp: 1; }
	.depth-stage { --gStrength: calc(var(--gStrength) * 1); --perspComp: calc(var(--perspComp) * 1); }

	/* ANIMAÇÕES - Simplificadas para reduzir travadas */
	@keyframes layerDrift { 0%{ transform:translate3d(0,0,var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))); } 50%{ transform:translate3d(0,-0.4%,var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))); } 100%{ transform:translate3d(0,0,var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))); } }
	@keyframes float { 0%,100%{ transform:translate3d(calc(var(--mx)*var(--strength)*1px), calc(var(--my)*var(--strength)*1px), var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))) translateY(-1.5%); } 50%{ transform:translate3d(calc(var(--mx)*var(--strength)*1px), calc(var(--my)*var(--strength)*1px), var(--z)) scale(calc(var(--scale,1)*var(--perspComp,1))) translateY(1.5%); } }
	/* Animações scan, glitchShift e chroma removidas para melhor performance */

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
