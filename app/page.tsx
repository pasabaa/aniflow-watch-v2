import { getHomeData } from '@/lib/upstream/loaders';
import { Carousel } from '@/components/media/carousel';
import { MediaRow } from '@/components/media/media-row';
import { Container } from '@/components/ui/container';
import { ContinueRow } from '@/components/list/continue-row';

export const revalidate = 600;

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Carousel */}
      <Carousel items={data.hero} />

      <Container className="space-y-10">
        {/* Continuar viendo (estado zustand localStorage) */}
        <ContinueRow />

        {/* Filas de carruseles */}
        {data.rows.map((row) => (
          <MediaRow
            key={row.title}
            title={row.title}
            items={row.items}
            href={`/catalogo?sort=popular`}
          />
        ))}
      </Container>
    </div>
  );
}
