<script setup lang="ts">
import { computed, onMounted } from 'vue';

const status = 404;
const msg404 = 'PÁGINA NÃO ENCONTRADA';

const letters = computed(() => msg404.split('').map((c, i) => ({ c, i })));

onMounted(() => {
	document.title = `${status} — Hefest`;
});
</script>

<template>
	<main class="err-root">
		<div class="led-frame" aria-hidden="true"></div>
		<div class="center">
			<h1 class="glitch" aria-live="polite">
				<span
					v-for="letter in letters"
					:key="letter.i"
					class="char"
					:data-char="letter.c"
					:style="{ '--i': String(letter.i) }"
				>
					{{ letter.c }}
				</span>
			</h1>
			<div class="code">{{ status }}</div>
		</div>
	</main>
</template>

<style>
	html,body{height:100%;}
  .err-root{
    min-height:100vh;
    display:grid;
    place-items:center;
    background:linear-gradient(180deg,#3a3a3a,#2f2f32 60%);
    color:#e6e6e6;
    overflow:hidden;
    font-family: Inter, system-ui, Arial, sans-serif;
  }

  .led-frame{
    position:fixed;inset:0;pointer-events:none;z-index:0;
    background-image: repeating-linear-gradient(to bottom, rgba(255,255,255,0.02) 0 1px, rgba(0,0,0,0.02) 1px 3px);
    mix-blend-mode: overlay;opacity:.7;
  }

  .center{position:relative;z-index:2;text-align:center;padding:3rem}

  .glitch{display:inline-block;font-weight:700;letter-spacing:0.06em;margin:0;line-height:1;white-space:nowrap;font-size:clamp(2.2rem,8vw,6rem);position:relative}

  .char{
    display:inline-block;position:relative;transform:translateY(0);opacity:0.98;
    /* rise once with stagger, keep a slow float, and add subtle flicker */
    /* tvOn runs once (staggered) to simulate TV powering on */
    animation:
      tvOn 900ms cubic-bezier(.2,.9,.3,1) calc(var(--i) * 40ms) both,
      rise 900ms cubic-bezier(.2,.9,.3,1) calc(var(--i) * 40ms) both,
      subtleFloat 4s ease-in-out calc(var(--i)*20ms) infinite,
      flickerShort 3.6s steps(2,end) calc(var(--i)*40ms) infinite;
  }

  @keyframes rise{
    0%{transform:translateY(18px);opacity:0}
    60%{transform:translateY(-6px);opacity:1}
    100%{transform:translateY(0);opacity:1}
  }

  @keyframes subtleFloat{
    0%{transform:translateY(0)}
    50%{transform:translateY(-2px)}
    100%{transform:translateY(0)}
  }

  /* RGB split duplicates — these will be sliced & shifted intermittently for glitch */
  .char::before, .char::after{
    content:attr(data-char);
    position:absolute;left:0;top:0;right:0;bottom:0;pointer-events:none;
    opacity:.95;mix-blend-mode:screen;transform:translateZ(0);
    /* staggered animation delay per-letter using --i */
    animation: sliceAnim 2.8s linear infinite;
    animation-delay: calc(var(--i) * 80ms);
  }

  .char::before{color:#ff6b8a;opacity:.14;transform:translateX(-1.5px)}
  .char::after{color:#6be0ff;opacity:.14;transform:translateX(1.5px)}

  .char{position:relative}
  .char::before, .char::after{transition:transform .12s linear}

  /* small, fast flicker used alongside rising animation */
  @keyframes flickerShort {
    0%, 92%, 100% { opacity: 0.98; filter: none; }
    93% { opacity: 0.4; filter: blur(.6px) contrast(0.9); }
    95% { opacity: 1; filter: none; }
  }

  /* slice animation: briefly cut horizontal pieces and shift them horizontally to simulate glitch */
  @keyframes sliceAnim {
    0% { clip-path: inset(0 0 0 0); transform: translateX(0); }
    82% { clip-path: inset(0 0 0 0); transform: translateX(0); }
    84% { clip-path: inset(30% 0 50% 0); transform: translateX(-8px) scaleX(1); }
    86% { clip-path: inset(60% 0 10% 0); transform: translateX(6px) scaleX(1); }
    89% { clip-path: inset(10% 0 70% 0); transform: translateX(-4px) scaleX(1); }
    92% { clip-path: inset(0 0 0 0); transform: translateX(0); }
    100% { clip-path: inset(0 0 0 0); transform: translateX(0); }
  }

  /* TV power-on flash for each character (staggered) */
  @keyframes tvOn {
    0% { opacity: 0; filter: brightness(.2) saturate(.6) blur(1px); transform: translateY(18px) scaleY(0.98); }
    20% { opacity: 1; filter: brightness(2.6) saturate(1.2) blur(0); transform: translateY(-8px) scaleY(1.02); }
    45% { opacity: 0.6; filter: brightness(1.2) saturate(1) blur(.2px); transform: translateY(-2px) scaleY(1); }
    70% { opacity: 1; filter: brightness(1) saturate(.98) blur(0); transform: translateY(0) scaleY(1); }
    100% { opacity: 1; filter: none; transform: translateY(0) scaleY(1); }
  }

  /* global quick screen flash to mimic TV powering on */
  .led-frame {
    animation: screenFlash 900ms ease-out both;
  }

  @keyframes screenFlash {
    0% { opacity: 0; background-color: rgba(255,255,255,0); }
    10% { opacity: 1; background-color: rgba(255,255,255,0.12); }
    25% { opacity: 0.6; background-color: rgba(255,255,255,0.06); }
    40% { opacity: 0.2; background-color: rgba(255,255,255,0.02); }
    100% { opacity: .7; background-color: transparent; }
  }

  @keyframes wordGlitch{
    0%{transform:translateX(0)}
    20%{transform:translateX(-2px)}
    40%{transform:translateX(1px)}
    60%{transform:translateX(-1px)}
    100%{transform:translateX(0)}
  }
  .glitch{animation:wordGlitch 3.8s infinite ease-in-out}

  .code{margin-top:.6rem;font-size:1rem;color:#cfcfcf;opacity:.9}

  .stack{max-width:70ch;margin-top:1.25rem;color:#ddd;background:rgba(0,0,0,0.18);padding:.6rem;border-radius:6px;overflow:auto}

  @media (max-width:700px){
    .glitch{font-size:clamp(1.6rem,14vw,3rem)}
    .char{animation-duration:700ms}
  }
</style>
