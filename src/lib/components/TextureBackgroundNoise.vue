<script setup lang="ts">
import { computed } from 'vue';
import noise from '$lib/assets/textures/noise.png';

const props = withDefaults(
    defineProps<{
        src?: string;
        opacity?: number;
        speed?: number;
        scale?: number;
        blend?: string | null;
        front?: boolean;
        z?: number;
        mode?: 'shift' | 'jitter';
        frames?: number;
    }>(),
    {
        src: noise,
        opacity: 0.25,
        speed: 0.2,
        scale: 200,
        blend: null,
        front: false,
        z: -5,
        mode: 'jitter',
        frames: 18,
    }
);

const overlayStyle = computed<Record<string, string>>(() => {
    const style: Record<string, string> = {
        '--no-img': `url(${props.src})`,
        '--no-opacity': String(props.opacity),
        '--no-speed': `${props.speed}s`,
        '--no-scale': `${props.scale}%`,
        '--no-z': String(props.z),
    };

    if (props.blend) style['mix-blend-mode'] = props.blend;
    return style;
});
</script>

<template>
    <div
        :class="['fuzzy-overlay', { front: props.front }, `mode-${props.mode}`]"
        aria-hidden="true"
        :style="overlayStyle"
    ></div>
</template>

<style>
    .fuzzy-overlay {
        position:fixed;
        inset:0;
        pointer-events:none;
        z-index: var(--no-z, -5);
        overflow:hidden;
    }
    .fuzzy-overlay.front { z-index: 60; }
        .fuzzy-overlay::before {
        content:""; position:absolute;
        top: calc(-1 * var(--no-scale)); left: calc(-1 * var(--no-scale)); right: calc(-1 * var(--no-scale)); bottom: calc(-1 * var(--no-scale));
        background-image: var(--no-img);
        background-repeat: repeat;
        background-size: 512px 512px;
        opacity: var(--no-opacity);
            /* animação padrão será definida pela classe mode- */
        image-rendering: pixelated;
        will-change: transform;
    }
        /* Modo shift antigo (diagonal) */
        .fuzzy-overlay.mode-shift::before { animation: shift var(--no-speed) linear infinite both; }
        @keyframes shift { 0% { transform: translate(10%,10%); } 100% { transform: translate(-10%,-10%); } }

        /* Modo jitter: frames discretos pseudo-aleatórios, sem deriva direcional */
        .fuzzy-overlay.mode-jitter::before { animation: jitter var(--no-speed) steps(1,end) infinite; }
        /* Geramos ~18 frames distribuídos; offsets pequenos e centrados */
        @keyframes jitter {
            0% { transform: translate(0%,0%); }
            5% { transform: translate(2%,-1%); }
            10% { transform: translate(-1%,1%); }
            15% { transform: translate(1%,-2%); }
            20% { transform: translate(-2%,0%); }
            25% { transform: translate(0.5%,1.5%); }
            30% { transform: translate(-1.5%,-1%); }
            35% { transform: translate(1.2%,0.8%); }
            40% { transform: translate(-0.8%, -1.3%); }
            45% { transform: translate(1.6%, -0.4%); }
            50% { transform: translate(-1.2%, 0.6%); }
            55% { transform: translate(0.9%, -0.9%); }
            60% { transform: translate(-0.4%, 1.1%); }
            65% { transform: translate(0.7%, -1.4%); }
            70% { transform: translate(-1.6%, 0.3%); }
            75% { transform: translate(0.3%, 1.2%); }
            80% { transform: translate(-0.9%, -0.7%); }
            85% { transform: translate(1.4%, 0.4%); }
            90% { transform: translate(-0.6%, 0.9%); }
            95% { transform: translate(0.5%, -0.5%); }
            100% { transform: translate(0%,0%); }
        }
    @media (max-width: 800px){
        .fuzzy-overlay::before { background-size: 380px 380px; }
    }

    @media (prefers-reduced-motion: reduce) {
        .fuzzy-overlay::before { animation: none !important; }
    }
</style>
