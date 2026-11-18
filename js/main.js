/* ==========================================================================
   AppointmentScheduler — js/main.js
   Scriptul comun tuturor paginilor. Este JavaScript simplu, fără biblioteci
   (Bootstrap se ocupă separat de meniu, acordeon, tab-uri și ferestre modale).

   Cuprins
   1. Funcții ajutătoare pentru date calendaristice
   2. Texte completate automat (anul curent, data de azi)
   3. Validarea formularelor
   4. Pagina Programare: preselectare din adresă și rezumatul programării
   5. Mesaje de confirmare și fereastra de anulare
   6. Pagina Servicii: valoarea afișată a filtrului de preț
   7. Bara laterală pe telefon: se închide după alegerea unei secțiuni
   ========================================================================== */

// Programările se pot face cu cel mult 60 de zile înainte
const ZILE_MAXIM_IN_AVANS = 60;

// Pornim totul după ce browserul a citit întreaga pagină HTML
document.addEventListener('DOMContentLoaded', () => {
  completeazaTexteAutomate();
  pregatesteValidareaFormularelor();
  pregatestePaginaProgramare();
  pregatesteMesajeleSiAnularea();
  pregatesteFiltrulDePret();
  pregatesteBaraLaterala();
});


/* 1. Funcții ajutătoare pentru date calendaristice ------------------------ */

// Obiect Date → textul „AAAA-LL-ZZ” (formatul folosit de <input type="date">)
function formatISO(data) {
  const luna = String(data.getMonth() + 1).padStart(2, '0');
  const zi = String(data.getDate()).padStart(2, '0');
  return `${data.getFullYear()}-${luna}-${zi}`;
}

// Textul „AAAA-LL-ZZ” → obiect Date, la ora 00:00 (ora locală)
function citesteData(text) {
  const [an, luna, zi] = text.split('-').map(Number);
  return new Date(an, luna - 1, zi);
}

// Ziua de azi, la ora 00:00
function azi() {
  const data = new Date();
  data.setHours(0, 0, 0, 0);
  return data;
}

// Ultima zi în care se mai poate face o programare (azi + 60 de zile)
function ultimaZiPermisa() {
  const data = azi();
  data.setDate(data.getDate() + ZILE_MAXIM_IN_AVANS);
  return data;
}


/* 2. Texte completate automat --------------------------------------------- */
function completeazaTexteAutomate() {
  // Anul curent, în subsol
  document.querySelectorAll('[data-an-curent]').forEach((element) => {
    element.textContent = new Date().getFullYear();
  });

  // Data de azi, scrisă în limba română (ex.: „miercuri, 18 noiembrie 2026”)
  document.querySelectorAll('[data-azi]').forEach((element) => {
    element.textContent = new Date().toLocaleDateString('ro-RO', {
      weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
    });
  });
}


/* 3. Validarea formularelor ----------------------------------------------- */
/* Se verifică formularele care au clasa „needs-validation”.
   - Regulile simple stau direct în HTML: required, type="email", minlength, pattern.
   - Regulile proprii (data, parola, ora) sunt în funcția aplicaReguliProprii.
   - Mesajele apar cu stilurile Bootstrap, după ce formularul primește clasa „was-validated”. */
function pregatesteValidareaFormularelor() {
  document.querySelectorAll('form.needs-validation').forEach((formular) => {
    limiteazaCampurileDeData(formular);

    // Reverificăm la fiecare modificare, ca mesajul să dispară imediat ce greșeala e corectată
    formular.addEventListener('input', () => aplicaReguliProprii(formular));
    formular.addEventListener('change', () => aplicaReguliProprii(formular));

    formular.addEventListener('submit', (eveniment) => {
      aplicaReguliProprii(formular);
      formular.classList.add('was-validated');

      // Dacă un câmp este greșit, oprim trimiterea și mutăm cursorul pe primul câmp greșit
      if (!formular.checkValidity()) {
        eveniment.preventDefault();
        const primulCampGresit = formular.querySelector(':invalid');
        if (primulCampGresit) primulCampGresit.focus();
        return;
      }

      // În Etapa 1 nu există server: formularele de cont și de programare
      // doar deschid pagina următoare (atributul data-redirect), fără să trimită date.
      if (formular.dataset.redirect) {
        eveniment.preventDefault();
        window.location.href = formular.dataset.redirect;
      }
    });
  });
}

// Calendarul câmpurilor de dată permite doar zilele dintre azi și azi + 60 de zile
function limiteazaCampurileDeData(formular) {
  formular.querySelectorAll('[data-validare-data]').forEach((camp) => {
    camp.min = formatISO(azi());
    camp.max = formatISO(ultimaZiPermisa());
  });
}

function aplicaReguliProprii(formular) {
  // Regula 1: data programării (nu în trecut, nu în weekend, cel mult 60 de zile înainte)
  formular.querySelectorAll('[data-validare-data]').forEach((camp) => {
    const mesaj = verificaDataProgramarii(camp.value);
    camp.setCustomValidity(mesaj);          // textul gol înseamnă „câmp corect”
    const elementMesaj = camp.parentElement.querySelector('[data-mesaj-data]');
    if (elementMesaj && mesaj) elementMesaj.textContent = mesaj;
  });

  // Regula 2: confirmarea parolei trebuie să fie identică cu parola
  formular.querySelectorAll('[data-confirma]').forEach((camp) => {
    const parola = document.getElementById(camp.dataset.confirma);
    const diferite = parola && camp.value !== parola.value;
    camp.setCustomValidity(diferite ? 'Parolele nu coincid.' : '');
  });

  // Regula 3: ora de sfârșit trebuie să fie după ora de început
  formular.querySelectorAll('[data-dupa]').forEach((camp) => {
    const inceput = document.getElementById(camp.dataset.dupa);
    const gresit = inceput && inceput.value && camp.value && camp.value <= inceput.value;
    camp.setCustomValidity(gresit ? 'Ora de sfârșit trebuie să fie după ora de început.' : '');
  });
}

// Întoarce mesajul de eroare pentru o dată sau textul gol dacă data este bună
function verificaDataProgramarii(text) {
  if (!text) return 'Alege data programării.';
  const data = citesteData(text);

  if (data < azi()) return 'Data nu poate fi în trecut.';
  if (data > ultimaZiPermisa()) return `Programările se fac cu cel mult ${ZILE_MAXIM_IN_AVANS} de zile înainte.`;
  const ziuaSaptamanii = data.getDay();          // 0 = duminică, 6 = sâmbătă
  if (ziuaSaptamanii === 0 || ziuaSaptamanii === 6) return 'În weekend cabinetul este închis. Alege o zi de luni până vineri.';
  return '';
}


/* 4. Pagina Programare ---------------------------------------------------- */
function pregatestePaginaProgramare() {
  const formular = document.getElementById('form-programare');
  if (!formular) return;                    // nu suntem pe pagina Programare

  const serviciu = document.getElementById('serviciu');
  const data = document.getElementById('data-programare');

  // 4.1 Preluăm serviciul și data din adresa paginii,
  //     de exemplu: programare.html?serviciu=consultatie-ekg&data=2026-11-20
  const parametri = new URLSearchParams(window.location.search);
  const serviciuAles = parametri.get('serviciu');
  if (serviciuAles && serviciu.querySelector(`option[value="${CSS.escape(serviciuAles)}"]`)) {
    serviciu.value = serviciuAles;
  }
  if (parametri.get('data')) data.value = parametri.get('data');

  // 4.2 Rezumatul din dreapta se completează pe măsură ce alegi
  function actualizeazaRezumatul() {
    const optiune = serviciu.selectedOptions[0];
    const areServiciu = optiune && optiune.value;
    const oraAleasa = formular.querySelector('input[name="ora"]:checked');
    const dataBuna = data.value && !verificaDataProgramarii(data.value);

    scrie('rezumat-serviciu', areServiciu ? optiune.dataset.nume : '—');
    scrie('rezumat-data', dataBuna
      ? citesteData(data.value).toLocaleDateString('ro-RO', { weekday: 'long', day: 'numeric', month: 'long' })
      : '—');
    scrie('rezumat-ora', oraAleasa ? oraAleasa.value : '—');
    scrie('rezumat-durata', areServiciu ? `${optiune.dataset.durata} de minute` : '—');
    scrie('rezumat-pret', areServiciu ? `${optiune.dataset.pret} lei` : '—');
  }

  function scrie(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
  }

  // 4.3 Indicatorul de pași (sus) arată secțiunea în care completezi acum
  const pasi = document.querySelectorAll('.stepper li');
  formular.querySelectorAll('.form-section').forEach((sectiune, index) => {
    sectiune.addEventListener('focusin', () => {
      pasi.forEach((pas, i) => pas.classList.toggle('current', i === index));
    });
  });

  formular.addEventListener('change', actualizeazaRezumatul);
  actualizeazaRezumatul();
}


/* 5. Mesaje de confirmare și fereastra de anulare ------------------------- */
function pregatesteMesajeleSiAnularea() {
  // 5.1 Un mesaj cu data-mesaj="programare=noua" apare doar dacă adresa paginii
  //     conține ?programare=noua (la fel pentru cont=nou, profil=salvat, interval=adaugat)
  const parametri = new URLSearchParams(window.location.search);
  document.querySelectorAll('[data-mesaj]').forEach((mesaj) => {
    const [nume, valoare] = mesaj.dataset.mesaj.split('=');
    if (parametri.get(nume) === valoare) mesaj.classList.remove('d-none');
  });

  // 5.2 Fereastra de anulare arată programarea pe al cărei buton „Anulează” s-a dat click
  const modal = document.getElementById('modal-anulare');
  if (modal) {
    modal.addEventListener('show.bs.modal', (eveniment) => {
      const buton = eveniment.relatedTarget;
      document.getElementById('text-anulare').textContent = buton.dataset.programare;
    });
  }
}


/* 6. Pagina Servicii: filtrul de preț ------------------------------------- */
function pregatesteFiltrulDePret() {
  document.querySelectorAll('input[type="range"][data-afisare]').forEach((cursor) => {
    const afisare = document.getElementById(cursor.dataset.afisare);
    const actualizeaza = () => { afisare.textContent = cursor.value; };
    cursor.addEventListener('input', actualizeaza);
    // La „Resetează”, valoarea se schimbă după eveniment, deci actualizăm imediat după
    if (cursor.form) cursor.form.addEventListener('reset', () => setTimeout(actualizeaza));
    actualizeaza();
  });
}


/* 7. Bara laterală pe telefon --------------------------------------------- */
// Pe ecrane mici, bara laterală este un panou glisant (offcanvas). Când alegi o secțiune
// din el (un link care începe cu #), panoul se închide ca să vezi secțiunea.
function pregatesteBaraLaterala() {
  document.querySelectorAll('.offcanvas-lg a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      const panou = bootstrap.Offcanvas.getInstance(link.closest('.offcanvas-lg'));
      if (panou) panou.hide();
    });
  });
}
