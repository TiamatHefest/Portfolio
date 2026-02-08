<script setup lang="ts">
import { onMounted, ref } from 'vue';

const props = withDefaults(
	defineProps<{
		// Assets críticos que devem ser precarregados
		criticalAssets?: string[];
		preloadImages?: string[];
		preloadFonts?: string[];
	}>(),
	{
		criticalAssets: () => [],
		preloadImages: () => [],
		preloadFonts: () => [],
	}
);

const preloadComplete = ref(false);

async function preloadAssets() {
	if (typeof window === 'undefined') return;

	const promises: Promise<unknown>[] = [];

	// Preload de imagens críticas
	props.preloadImages.forEach((src) => {
		promises.push(
			new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = () => resolve(true);
				img.onerror = reject;
				img.src = src;
			})
		);
	});

	// Preload de fontes
	props.preloadFonts.forEach((fontUrl) => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.as = 'font';
		link.type = 'font/woff2';
		link.crossOrigin = 'anonymous';
		link.href = fontUrl;
		document.head.appendChild(link);
	});

	// Preload de outros assets críticos
	props.criticalAssets.forEach((assetUrl) => {
		const link = document.createElement('link');
		link.rel = 'preload';
		link.href = assetUrl;
		if (assetUrl.includes('.css')) link.as = 'style';
		else if (assetUrl.includes('.js')) link.as = 'script';
		document.head.appendChild(link);
	});

	try {
		await Promise.allSettled(promises);
		preloadComplete.value = true;
	} catch (error) {
		console.warn('Some assets failed to preload:', error);
		preloadComplete.value = true;
	}
}

onMounted(() => {
	preloadAssets();
});
</script>

<!-- Este componente não renderiza nada visível -->
<slot v-if="preloadComplete" />
<div v-else class="preload-placeholder">
	<!-- Opcional: loading spinner ou skeleton -->
</div>

<style>
	.preload-placeholder {
		display: none; /* Invisível por padrão */
	}
</style>