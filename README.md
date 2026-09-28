# Juan Manuel Torres ‚Äî Gastronomic Portfolio

An editorial portfolio built with React, TypeScript and Vite. The experience uses a restrained black, warm-white and fire-red palette, with locally supplied kitchen photography and lightweight canvas ASCII treatments.

## Run locally

```sh
npm install
npm test
npm run lint
npm run build
npm run dev -- --host 127.0.0.1
```

## Content and photograph replacements

- Replace or add work photographs in `public/work/` and update `src/data/content.ts` plus the three work-art compositions in `src/App.tsx`/`src/styles/global.css`. Current project images are explicitly labeled placeholders, not documented project claims.
- Replace `chef.png` and `equipo.png` only with approved originals. They are served directly from the repository root and are intentionally not modified.
- Add verified email, LinkedIn, and WhatsApp destinations in `src/data/content.ts`. Until then, the contact area displays inactive ‚ÄúDETAIL TO BE ADDED‚Äù text rather than fabricated links.
- Edit the skills and practice timeline in `src/data/content.ts`; no employers, roles, or dated career milestones are asserted.

The ASCII photograph effect samples luminance into a bounded canvas when an image enters the viewport. It falls back to the original photograph when canvas sampling is unavailable and supports pointer, focus, and click/touch interaction. Motion respects `prefers-reduced-motion`.

## Im·genes externas de referencia

La secciÛn Real Work usa dos im·genes p˙blicas de CRU Pizza de Calle, descargadas con autorizaciÛn del usuario para esta versiÛn. Se muestran con crop y tratamiento editorial; no reemplazan las fotografÌas originales del portfolio.

- `public/work/cru-pizza-circuito.png` ó fuente: [Circuito GastronÛmico](https://circuitogastronomico.com/exito-total-cru-pizza-de-calle-es-lo-nuevo-de-los-creadores-de-oti-focacceria/)
- `public/work/cru-pizza-public.jpg` ó fuente: [Restaurant Guru](https://es.restaurantguru.com/Cru-pizza-de-la-calle-Cordoba)

Si luego conseguÌs fotografÌas propias o autorizaciÛn directa de CRU, reemplaz· esos archivos manteniendo los mismos nombres.

- public/work/fernet-hielo.png ó fotografÌa p˙blica de referencia: https://www.pampadrugstore.net/img/cms/fernet.png (se puede reemplazar por una foto propia).
