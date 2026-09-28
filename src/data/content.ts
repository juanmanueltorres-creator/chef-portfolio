import chefPhoto from '../../chef.png';
import teamPhoto from '../../equipo.png';

export { chefPhoto, teamPhoto };

export const disciplines = [
  { title: 'OPERACIONES', details: ['PRODUCCIÓN', 'RITMO', 'CONSISTENCIA'], visual: 'operations' },
  { title: 'PIZZA', details: ['MASA', 'HORNO', 'SERVICIO'], visual: 'pizza' },
  { title: 'BURGERS', details: ['ARMADO', 'TIEMPO', 'SALIDA'], visual: 'burgers' },
  { title: 'SERVICIO', details: ['PRESIÓN', 'COORDINACIÓN', 'EJECUCIÓN'], visual: 'service' },
  { title: 'EQUIPO', details: ['COMUNICACIÓN', 'CONFIANZA'], visual: 'team' },
];

export const shiftPhotos = [
  { src: chefPhoto, alt: 'Equipo de cocina detrás del mostrador, en el contexto completo de la fotografía original', position: 'center 43%', variant: 'wide', caption: 'DETRÁS DE CADA PLATO' },
  { src: chefPhoto, alt: 'Encuadre editorial de la cocina y la mesada', position: '72% 48%', variant: 'detail', caption: 'LA MESADA' },
  { src: teamPhoto, alt: 'El equipo de cocina reunido en la fotografía original', position: 'center 48%', variant: 'team', caption: 'LAS PERSONAS' },
  { src: chefPhoto, alt: 'Encuadre alternativo de la cocina y el turno', position: '22% 62%', variant: 'strip', caption: 'ENTRE LOS PEDIDOS' },
  { src: '/work/cru-pizza-circuito.png', alt: 'Pizza pública de CRU sobre azulejos', position: 'center 52%', variant: 'food', caption: 'SALE CALIENTE' },
  { src: '/work/cru-pizza-public.jpg', alt: 'Fachada y comida de CRU en un collage público', position: 'center 20%', variant: 'front', caption: 'AFUERA / ADENTRO' },
];

export const experience = [
  { period: '06/23 — 05/26', label: 'LOCAL CRU · JEFE DE COCINA / ENCARGADO', note: 'Equipo, costos, stock, proveedores, calidad y eficiencia operativa.' },
  { period: '10/22 — 08/24', label: 'LOCAL RISATA · MAESTRO PIZZERO', note: 'Producción, atención, capacitación, stock y proveedores.' },
  { period: '08/21 — 08/22', label: 'LOCAL DON AFIF', note: 'Mostrador, teléfono, empanadas, cocina, carga y mantenimiento.' },
  { period: '11/19 — 07/21', label: 'LOCAL FUGA RESTO BAR', note: 'Pizza, panadería, cocina, plancha, compras y producción.' },
];

export const skills = ['Operaciones de cocina', 'Producción', 'Mise en place', 'Pizza', 'Burgers', 'Servicio', 'Stock', 'Compras', 'Costos', 'Coordinación de equipos', 'Sistemas gastronómicos'];

export type WorkItem = { number: string; title: string; meta: string; variant: 'pizza' | 'burgers' | 'service'; image?: { src: string; alt: string } };
export const work: WorkItem[] = [
  { number: '001', title: 'PIZZA', meta: 'CRU / HORNO / SERVICIO', variant: 'pizza', image: { src: '/work/cru-pizza-circuito.png', alt: 'Pizza de CRU Pizza de Calle sobre azulejos' } },
  { number: '002', title: 'BURGERS', meta: 'ARMADO / TIEMPO / SALIDA', variant: 'burgers' },
  { number: '003', title: 'SERVICIO', meta: 'CRU / RITMO / EJECUCIÓN', variant: 'service', image: { src: '/work/cru-pizza-public.jpg', alt: 'Collage público de CRU Pizza de Calle, fachada y comida' } },
];

export const contacts = [
  { label: 'EMAIL', value: 'juan.manuel.torres@mi.unc.edu.ar', href: 'mailto:juan.manuel.torres@mi.unc.edu.ar' },
  { label: 'TELÉFONO', value: '351 860 9599', href: 'tel:+543518609599' },
  { label: 'LINKEDIN', value: '', href: '' },
];
