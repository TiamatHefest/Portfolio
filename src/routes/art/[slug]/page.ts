// Simple static catalogue generated at build time; map slugs to data & image.
// This avoids a backend.

export interface ArtData {
  slug: string;          // slug derivado do nome do arquivo
  title: string;         // Título formatado para exibição
  subtitle?: string;     // Sub (opcional)
  description?: string;  // Descrição (opcional)
  image: string;         // URL resolvida da imagem
  index: number;         // Posição ordenada
  filename: string;      // Nome base do arquivo (com extensão)
}

// Importa TODAS as imagens da pasta test (sem limite artificial agora)
const imageModules = import.meta.glob('/src/lib/assets/test/*.{webp,jpeg,jpg,png,gif}', {
  eager: true,
  import: 'default',
  query: '?url',
});
const sorted = Object.entries(imageModules).sort((a,b)=> a[0].localeCompare(b[0]));

function fileBase(path: string){
  return (path.split('/') .pop() || path);
}

function makeSlug(filename: string){
  return filename
    .replace(/\.[^.]+$/, '')        // remove extensão
    .toLowerCase()
    .replace(/[^a-z0-9]+/g,'-')     // converte separadores/ruído em hífens
    .replace(/^-+|-+$/g,'');        // trim hífens nas bordas
}

function fileTitle(filename: string){
  return filename
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g,' ')
    .replace(/\b([a-z])/g, m => m.toUpperCase());
}

// Garante unicidade caso dois arquivos resultem no mesmo slug
const used = new Map<string, number>();

export const _catalogue: ArtData[] = sorted.map(([path, url], i) => {
  const filename = fileBase(path);
  let slugRoot = makeSlug(filename);
  if (!slugRoot) slugRoot = 'item';
  const count = used.get(slugRoot) || 0;
  used.set(slugRoot, count + 1);
  const slug = count === 0 ? slugRoot : `${slugRoot}-${count+1}`; // se duplicado, acrescenta índice

  const title = fileTitle(filename);

  return {
    slug,
    title,
    subtitle: 'Projeto ' + title,
    description: 'Página de identificação – imagem original: ' + filename,
    image: url as string,
    index: i,
    filename
  };
});

export const _entriesBySlug = Object.fromEntries(_catalogue.map(c => [c.slug, c]));

export const catalogue = _catalogue;
export const entriesBySlug: Record<string, ArtData> = _entriesBySlug;
