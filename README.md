# AppointmentScheduler

Aplicație web pentru programări online la un cabinet de cardiologie. Pacienții văd intervalele libere ale medicului și rezervă singuri, iar recepția administrează programul și rezervările.

> Proiect universitar, Universitatea Politehnica Timișoara — tema „AppointmentScheduler” (nivel Începător).
> Toate datele din aplicație sunt fictive (Cabinetul de cardiologie Tilia, Târgu Jiu).

**Site publicat:** https://popa-crinuta.github.io/appointment-scheduler/  
**Repository:** https://github.com/popa-crinuta/appointment-scheduler

## Stadiul proiectului

- [x] **Etapa 1** — analiză, wireframe-uri, pagina principală (`index.html` + `css/style.css`) și paginile secundare statice
- [ ] **Etapa 2** — baza de date (MySQL) și operațiile CRUD
- [ ] **Etapa 3** — autentificare, roluri, căutare și filtrare, panou cu statistici
- [ ] **Etapa 4** — funcționalități avansate (export CSV/PDF, notificări), documentația finală

## Paginile aplicației

| Pagina | Fișier | Cine o folosește |
| --- | --- | --- |
| Acasă | `index.html` | toți vizitatorii |
| Servicii și prețuri | `servicii.html` | toți vizitatorii |
| Programare nouă | `programare.html` | pacientul |
| Programările mele | `programarile-mele.html` | pacientul |
| Autentificare | `autentificare.html` | vizitatorul (conectare / cont nou) |
| Administrare | `admin.html` | administratorul (recepția) |

Meniul din antet și subsolul au linkuri către toate paginile.

## Tehnologii

- **HTML5** — structura paginilor, cu elemente semantice (`header`, `nav`, `main`, `section`, `aside`, `footer`)
- **CSS3** — stilurile proprii, în `css/style.css` (variabile CSS, Flexbox, Grid, media queries), fără stiluri inline
- **Bootstrap 5.3.8** — framework CSS pentru grila responsive și componente (meniu, carduri, formulare, tab-uri, ferestre modale), inclus prin CDN
- **Bootstrap Icons 1.13.1** — pictograme
- **Google Fonts** — Poppins (titluri) și Inter (text)
- **JavaScript** (fără biblioteci) — validarea formularelor și interactivitate, în `js/main.js`
- **Git și GitHub** — versionare; **GitHub Pages** — publicare
- **Excalidraw** — wireframe-uri (`docs/wireframes/`)
- *Etapele următoare:* bază de date MySQL

## Structura proiectului

```
appointment-scheduler/
├── index.html               Acasă
├── servicii.html            Servicii și prețuri
├── programare.html          Programare nouă
├── programarile-mele.html   Programările mele (contul pacientului)
├── autentificare.html       Autentificare și cont nou
├── admin.html               Panoul de administrare
├── css/
│   └── style.css            stilurile proprii (paletă, fonturi, responsive)
├── js/
│   └── main.js              validări și interactivitate
├── img/
│   └── favicon.svg          pictograma site-ului
├── docs/
│   └── wireframes/          wireframe-urile (.excalidraw editabile + .png)
└── README.md
```

## Cum rulezi proiectul

Proiectul este format din pagini statice, deci nu are nevoie de instalări. Bootstrap, pictogramele și fonturile se încarcă de pe internet, așa că ai nevoie de conexiune.

### Varianta 1 — Visual Studio Code + Live Server (recomandat)

1. Descarcă proiectul: git clone https://github.com/popa-crinuta/appointment-scheduler.git
   (sau, pe GitHub: **Code → Download ZIP**, apoi dezarhivează).
2. Deschide folderul în Visual Studio Code (**File → Open Folder**).
3. Instalează extensia **Live Server** (autor: Ritwick Dey).
4. Click dreapta pe `index.html` → **Open with Live Server**. Pagina se deschide la `http://127.0.0.1:5500` și se reîncarcă la fiecare salvare.

### Varianta 2 — direct în browser

Deschide `index.html` cu dublu-click (Chrome, Edge sau Firefox).

### Varianta 3 — online

Deschide adresa GitHub Pages de mai sus.

## Design

| Rol | Culoare |
| --- | --- |
| Primară (butoane, linkuri) | `#0F766E` |
| Accent (evidențieri) | `#F59E0B` |
| Text și subsol | `#1E293B` |
| Fundalul secțiunilor | `#F0FDFA` |
| Text secundar | `#64748B` |

Fonturi: **Poppins** (titluri) și **Inter** (text). Wireframe-urile sunt în `docs/wireframes/` și se deschid pe [excalidraw.com](https://excalidraw.com) (**Open** → fișierul `.excalidraw`).

## Utilizarea AI

La realizarea proiectului am folosit asistentul Claude (Anthropic) pentru planificare, cod și documentație. Am verificat, testat și adaptat fiecare rezultat; detaliile sunt în jurnalul AI din documentația proiectului.

## Autor

Popa Crinuța-Giorgiana — Universitatea Politehnica Timișoara, 2026
