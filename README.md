# VÉRA — Boutique Hotel & Retreat

Site de portfólio de um hotel boutique **fictício** na Serra Catarinense. Estático, sem build e sem dependências.

```
index.html            estrutura e conteúdo
assets/css/style.css  tokens, layout, animações
assets/js/app.js      galeria, journal, mapa, motor de reservas
```

## Rodar localmente

```bash
python -m http.server 4620
```

Abra http://localhost:4620.

## Direção

- **Cores:** linho `#EDEAE2`, areia `#DDD2BF`, duna `#B9A98C`, oliva `#5A5C3C`, musgo `#34361F`, casca `#6B4E37`, tinta `#1D1C18`, noite `#121309`.
- **Tipos:** Bodoni Moda (títulos, itálico nas ênfases) + Jost (texto e rótulos).
- **Assinatura:** a página é um dia no VÉRA. Cada seção tem uma hora (`data-time`), e o relógio no dock fixo avança de 05:50 (neblina no vale) até 23:40 (céu estrelado do rodapé).

## Reservas (simuladas)

Busca com calendário próprio → resultados com total da estadia → 5 etapas (Stay, Guest Details, Extras, Payment, Confirmation) → `.ics` para o calendário. A disponibilidade é determinística por data (`isBooked` em `app.js`). Nenhum pagamento é processado e nenhum dado sai do navegador; a última reserva fica no `localStorage` para testar "Manage Booking".

Fotografias: Unsplash (hotlink). `noindex` em `robots.txt` e na meta tag.
