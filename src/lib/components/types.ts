export interface Artwork {
	src: string;
	title: string;
	subtitle?: string;
	description?: string;
	author?: string;
	slug?: string; // rota opcional para página de detalhe (/art/[slug])
}
