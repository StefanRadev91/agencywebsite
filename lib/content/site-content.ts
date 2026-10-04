import { pricingSchema } from '@/lib/schemas/pricing';
import { serviceSchema } from '@/lib/schemas/service';
import { teamSchema } from '@/lib/schemas/team';
import { loadJsonDir, loadJsonFile } from './load';
import { isTodo } from './todo';

let services: ReturnType<typeof readServices> | null = null;
const readServices = () => loadJsonDir('services', serviceSchema).sort((a, b) => a.order - b.order);

export function getServices() {
  return (services ??= readServices());
}

export const getService = (slug: string) => getServices().find((s) => s.slug === slug);

export const getPricing = () => loadJsonFile('pricing.json', pricingSchema);
export const getTeam = () => loadJsonFile('team.json', teamSchema);

/** Formatted "from" price, or null when the price is still a [TODO] / "after consultation". */
export function realPrice(value: number | '[TODO]') {
  return isTodo(value) ? null : value;
}
