import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';
import { ServiceType } from '../src/modules/service-types/entities/service-type.entity';
import { Faq } from '../src/modules/faqs/entities/faq.entity';
import {
  PERSONAL_INFORMATION_SECTION,
  DECLARATIONS_AUTHORIZATION_SECTION,
} from './form-schemas';
import { getServiceQuestionnaires } from './questionnaires-from-data';

const buildGenericFormSchema = (
  serviceName: string,
  description?: string,
  serviceCode?: string,
) => {
  const sections: any[] = [PERSONAL_INFORMATION_SECTION];

  // Add service-specific questionnaires if defined
  const questionnaires = serviceCode
    ? getServiceQuestionnaires(serviceCode)
    : [];
  if (questionnaires.length > 0) {
    sections.push(...questionnaires);
  }

  // Only append default declarations if the questionnaires don't include a custom one
  const hasCustomDeclarations = questionnaires.some(
    (q: any) => q.id === 'declarations_authorization',
  );
  if (!hasCustomDeclarations) {
    sections.push(DECLARATIONS_AUTHORIZATION_SECTION);
  }

  return {
    title: serviceName,
    description: description || `Form for ${serviceName}`,
    sections,
  };
};

const SERVICES_DATA = [
  // 1. ISEE
  {
    serviceType: {
      name: 'ISEE',
      description:
        'ISEE (Indicatore Situazione Economica Equivalente) - Servizio CAF per prestazioni sociali e agevolazioni',
    },
    services: [
      {
        name: 'ISEE Ordinario 2026',
        code: 'ISEE_ORD_2026',
        description:
          "L'ISEE Ordinario 2026 è un indicatore utilizzato per valutare la situazione economica di una famiglia. È fondamentale per determinare l'accesso a diverse prestazioni e agevolazioni sociali, come l'Assegno Unico e Universale, agevolazioni per l'istruzione, contributi per la casa, e altre forme di sostegno economico",
        category: 'TAX',
        basePrice: 0,
        requiredDocuments: [
          "01. Identification Document: ID card (front and back), Driver's License (front and back), or Passport of the declarant",
          '02. Tax Code: Tax code (Codice Fiscale) of the declarant',
          '03. Family Tax Codes: Tax codes for all members of the household',
          "04. Rent Agreement: Rental contract (Contratto d'affitto)",
          '05. Mortgage: Residual mortgage capital as of 31/12/2024',
          '06. Bank Accounts: Accounting balance and average balance (giacenza media) as of 31/12/2024 for current accounts of all household members',
          '07. Savings/Postal Books: Accounting balance and average balance as of 31/12/2024 for deposit accounts or postal books of all household members',
          '08. Investments: Euro value as of 31/12/2024 for funds, securities, and investments',
          '09. Prepaid Cards: Accounting balance and average balance for current accounts and prepaid cards with an IBAN held by the household',
          '10. Deposit Accounts: Accounting balance and average balance for deposit accounts held by the household',
          '11. Vehicles: License plate numbers for cars owned by household members',
          '12. Disability Certification: For disabled or invalid individuals, the latest certification stating the condition (medium disability, severe disability, or non-self-sufficiency)',
        ],
        faqs: [
          {
            question: 'Entro quanto viene elaborata la mia richiesta?',
            answer:
              "Il nostro team elabora la DSU nello stesso giorno in cui viene effettuata la richiesta (dal lunedì al sabato, dalle 09:00 alle 20:00). La consegna dell'attestazione avviene entro 4 giorni lavorativi.",
            order: 1,
            category: 'Tempi',
          },
          {
            question: "Quando scade l'attestazione ISEE?",
            answer:
              "L'attestazione ISEE ha validità fino al 31 dicembre di ogni anno. Ad esempio, l'attestazione ISEE effettuata nell'anno 2025 scadrà il 31 dicembre 2025.",
            order: 2,
            category: 'Validità',
          },
          {
            question: 'È necessario il CUD?',
            answer:
              'No, non è necessario. I dati reddituali vengono automaticamente acquisiti da controlli incrociati tra INPS e Agenzia delle Entrate.',
            order: 3,
            category: 'Documenti',
          },
          {
            question: 'È necessaria la visura catastale?',
            answer:
              'No! I dati catastali relativi al vostro patrimonio immobiliare possiamo acquisirlo tramite i nostri sistemi.',
            order: 4,
            category: 'Documenti',
          },
          {
            question: 'Ho la residenza in un luogo ma attualmente vivo altrove',
            answer:
              'Devi fare riferimento al luogo in cui hai la residenza ufficiale e indicare le persone con le quali risulti vivere.',
            order: 5,
            category: 'Residenza',
          },
          {
            question:
              "Nel 2025 ho venduto la casa e ora ne ho acquistata un'altra",
            answer:
              "Devi inserire i dati catastali della casa precedente, insieme all'importo residuo del mutuo al 31 dicembre 2025 relativo a quell'alloggio.",
            order: 6,
            category: 'Immobili',
          },
          {
            question:
              'Nel periodo ho cambiato auto. Quale targa devo inserire?',
            answer: "Devi inserire la targa dell'auto attualmente in uso.",
            order: 7,
            category: 'Veicoli',
          },
          {
            question:
              'Nel 2025 vivevo a un indirizzo diverso da quello attuale',
            answer:
              "Devi indicare l'indirizzo attuale in cui risiedi al momento della compilazione.",
            order: 8,
            category: 'Residenza',
          },
        ],
      },
      {
        name: 'ISEE Universitario 2026',
        code: 'ISEE_UNI_2026',
        description:
          "L'ISEE Universitario è un indicatore determinato da uno specifico tipo di DSU richiesto dello studente per il diritto allo studio",
        category: 'TAX',
        basePrice: 0,
        requiredDocuments: [
          '01. Valid identity document of the declarant',
          '02. Health card for all family members',
          '03. For disabled and invalids, the latest certification attesting to the condition of medium disability, severe disability and non-self-sufficiency',
          '04. Vehicle registration document/registration or license plate of motor vehicles, motorcycles with an engine capacity of 500 cc and above registered to members of the nucleus',
          '05. In case of rental, last registered contract',
          '06. Documentation proving that spousal allowances and child support payments for children living with another parent',
          '07. Statement issued by the bank certifying the remaining capital of the mortgage',
          '08. Account balance and average balance of current accounts and prepaid cards with IBAN, opened by the entire household',
          '09. Account balance and average balance of open deposit accounts for the entire household',
          '10. Nominal value of government bonds (e.g. BOT, CCT), bonds, certificates of deposit, savings bonds and similar',
          '11. University Student Tax Code',
          '12. Name of the University',
          '13. In case of the presence of an unmarried and non-cohabiting parent: Tax Code of the Unmarried and Non-Cohabiting Parent',
        ],
        faqs: [
          {
            question: "Chi deve essere il dichiarante dell'ISEE universitario?",
            answer:
              "Potrebbe essere chiunque del nucleo, non necessariamente il capo famiglia né per forza il richiedente del servizio che poi di fatto presenterà l'Isee elaborato.",
            order: 1,
            category: 'Dichiarazione',
          },
          {
            question:
              'Quali sono le condizioni per essere considerato studente autonomo?',
            answer:
              'Uno studente è considerato "autonomo" nel momento in cui: è residente fuori dall\'unità abitativa della famiglia di origine da almeno due anni rispetto alla data di presentazione della domanda di iscrizione per la prima volta a ciascun corso di studi, in alloggio non di proprietà di un suo membro.',
            order: 2,
            category: 'Studenti',
          },
          {
            question: 'Entro quanto tempo viene elaborata la DSU?',
            answer: 'La DSU viene elaborata entro 6 ore dalla richiesta.',
            order: 3,
            category: 'Tempi',
          },
          {
            question:
              "Qual è la validità dell'attestazione ISEE Universitario?",
            answer:
              "L'attestazione ISEE Universitario ha validità per l'anno accademico in corso perché scade il 31 dicembre dello stesso anno.",
            order: 4,
            category: 'Validità',
          },
          {
            question:
              "Posso utilizzare l'attestazione ISEE Universitario per richiedere altre agevolazioni o benefici?",
            answer:
              "Sì, l'attestazione può essere utilizzata per richiedere agevolazioni o benefici, secondo le indicazioni della propria università.",
            order: 5,
            category: 'Utilizzo',
          },
        ],
      },
      {
        name: 'ISEE Socio-Sanitario 2026',
        code: 'ISEE_SOC_2026',
        description:
          "ISEE Socio-Sanitario è l'indicatore della situazione economica necessario per ottenere servizi di assistenza domiciliare",
        category: 'TAX',
        basePrice: 0,
        requiredDocuments: [
          '01. Valid identity document of the declarant',
          '02. Health card for all family members',
          '03. For disabled and invalids, the latest certification attesting to the condition of medium disability, severe disability and non-self-sufficiency',
          '04. Vehicle registration document/registration or license plate of motor vehicles, motorcycles with an engine capacity of 500 cc and above registered to members of the nucleus',
          '05. In case of rental, last registered contract',
          '06. Documentation proving that spousal allowances and child support payments for children living with another parent',
          '07. Statement issued by the bank certifying the remaining capital of the mortgage',
          '08. Account balance and average balance of current accounts and prepaid cards with IBAN, opened by the entire household',
          '09. Account balance and average balance of open deposit accounts for the entire household',
          '10. Nominal value of government bonds (e.g. BOT, CCT), bonds, certificates of deposit, savings bonds and similar',
        ],
        faqs: [
          {
            question: "Chi può richiedere l'ISEE Socio-Sanitario?",
            answer:
              'Il modello ISEE Socio Sanitario può essere presentato solo se il beneficiario delle prestazioni è un maggiorenne disabile o non autosufficiente. Il dichiarante può essere anche un altro membro del nucleo familiare, purché maggiorenne, ma deve includere anche la persona disabile nel nucleo.',
            order: 1,
            category: 'Richiedenti',
          },
          {
            question: 'Cosa significa "nucleo familiare ristretto"?',
            answer:
              'Il beneficiario ha la possibilità di dichiarare un nucleo familiare ristretto rispetto a quello ordinario, composto esclusivamente dal beneficiario delle prestazioni, dal coniuge, dai figli minorenni e dai figli maggiorenni a carico ai fini IRPEF (a meno che non siano coniugati o abbiano figli).',
            order: 2,
            category: 'Famiglia',
          },
          {
            question: 'Entro quanto viene elaborata la mia richiesta?',
            answer:
              "La Dichiarazione Sostitutiva Unica (DSU) viene elaborata entro 6 ore dalla richiesta, e l'attestazione ISEE è pronta entro 3 giorni.",
            order: 3,
            category: 'Tempi',
          },
        ],
      },
      {
        name: 'ISEE Minorenni 2026',
        code: 'ISEE_MIN_2026',
        description:
          'ISEE Minorenni è un strumento progettato per figli di genitori non coniugati e non conviventi',
        category: 'TAX',
        basePrice: 0,
        requiredDocuments: [
          '01. Valid identity document of the declarant',
          '02. Health card for all family members',
          '03. For disabled and invalids, the latest certification attesting to the condition of medium disability, severe disability and non-self-sufficiency',
          '04. Vehicle registration document/registration or license plate of motor vehicles, motorcycles with an engine capacity of 500 cc and above registered to members of the nucleus',
          '05. In case of rental, last registered contract',
          '06. Documentation proving that spousal allowances and child support payments for children living with another parent',
          '07. Statement issued by the bank certifying the remaining capital of the mortgage',
          '08. Account balance and average balance of current accounts and prepaid cards with IBAN, opened by the entire household',
          '09. Account balance and average balance of open deposit accounts for the entire household',
          '10. Nominal value of government bonds (e.g. BOT, CCT), bonds, certificates of deposit, savings bonds and similar',
          '11. Valid identity document of the unmarried and non-cohabiting parent',
        ],
        faqs: [
          {
            question: "Che differenza c'è tra ISEE e ISEE Minorenni?",
            answer:
              "L'ISEE Minorenni è appositamente destinato ai nuclei familiari con figli minori e prevede diverse modalità di calcolo in base alla situazione familiare. Coincide con l'ISEE ordinario quando i genitori sono sposati, che convivano o meno.",
            order: 1,
            category: 'Differenze',
          },
          {
            question: "Quale genitore deve richiedere l'ISEE?",
            answer:
              "In caso di genitori non conviventi e non sposati, l'ISEE Minorenni deve essere richiesto dal genitore con cui i figli convivono abitualmente. In questo modo, il genitore non convivente rientra nel nucleo familiare del figlio come componente aggiuntiva o attratta.",
            order: 2,
            category: 'Procedura',
          },
          {
            question: "Come si fa ad abbassare l'ISEE?",
            answer:
              "Per ridurre l'ISEE è possibile: effettuare un cambio di residenza, rivedere i valori delle proprietà immobiliari, evitare i conti cointestati, richiedere l'ISEE corrente.",
            order: 3,
            category: 'Riduzione',
          },
          {
            question:
              "Sono una madre con due bambini avuti dal marito divorziato e non convivente. Devo includere il padre per richiedere l'agevolazione per la mensa scolastica?",
            answer:
              "No, essendo i genitori divorziati e non conviventi, è necessario compilare l'ISEE Minorenni includendo solo la madre e i due figli nel quadro A (nucleo familiare). Il padre dovrà essere inserito nel quadro D (genitore non coniugato e non convivente) fornendo il suo nome e codice fiscale.",
            order: 4,
            category: 'Procedura',
          },
          {
            question:
              'Posso predisporre un ISEE Minorenni se il figlio non è stato riconosciuto dal padre?',
            answer:
              "Solo se il figlio è stato riconosciuto dal padre, questo viene incluso nel calcolo ISEE. Se non è stato riconosciuto, non è possibile predisporre l'ISEE Minorenni e va presentato quello ordinario.",
            order: 5,
            category: 'Documenti',
          },
        ],
      },
      {
        name: 'ISEE Corrente 2026',
        code: 'ISEE_COR_2026',
        description:
          "ISEE Corrente è un aggiornamento dell'ISEE ordinario per accedere a bonus, benefici e sussidi che richiedono un indicatore aggiornato",
        category: 'TAX',
        basePrice: 24.99,
        requiredDocuments: [
          '01. Documentation certifying the change in employment/income situation due to job loss or suspension: Letter of dismissal, copy of resignation, unrenewed fixed-term contract, wage supplementation documentation, mobility allowance receipts',
          '02. Documentation certifying the change in employment/income situation due to a reduction in work activity: Recent pay stubs demonstrating the reduction in hours or salary, Tax returns or accounting documentation certifying a decrease in income greater than 25%',
          '03. Documentation certifying the change in financial position: Bank and postal account statements updated as of December 31 of the year preceding the year in which the current ISEE was submitted',
        ],
        faqs: [
          {
            question: "Cos'è l'ISEE Corrente e a cosa serve?",
            answer:
              "L'ISEE Corrente è un aggiornamento del tuo ISEE ordinario che tiene conto della tua situazione economica più recente. Serve per riflettere variazioni significative di reddito, patrimonio o nucleo familiare avvenute negli ultimi mesi. Ti è utile per accedere a bonus, agevolazioni e prestazioni sociali che richiedono un indicatore aggiornato e più fedele alla tua attuale capacità economica.",
            order: 1,
            category: 'Definizione',
          },
          {
            question: "Quando posso richiedere l'ISEE Corrente?",
            answer:
              "Puoi richiedere l'ISEE Corrente quando si verificano eventi specifici che modificano la tua situazione. I casi più comuni includono una riduzione del reddito di oltre il 25% del nucleo familiare, la perdita del lavoro o la sospensione dell'attività lavorativa, o variazioni significative nel nucleo familiare come nascite, matrimoni o separazioni.",
            order: 2,
            category: 'Quando',
          },
          {
            question:
              "Quali documenti sono necessari per richiedere l'ISEE Corrente?",
            answer:
              "Per richiedere l'ISEE Corrente avrai bisogno dell'ISEE ordinario già in tuo possesso. Inoltre, dovrai fornire documenti che attestino la variazione della tua situazione, come la documentazione relativa alla perdita o riduzione del lavoro, estratti conto bancari aggiornati per il patrimonio, o certificati anagrafici per variazioni del nucleo familiare.",
            order: 3,
            category: 'Documenti',
          },
          {
            question: "L'ISEE Corrente è obbligatorio o facoltativo?",
            answer:
              "L'ISEE Corrente è facoltativo, ma fortemente consigliato se la tua situazione economica è peggiorata rispetto a quella rilevata dall'ISEE ordinario. Non richiederlo potrebbe farti perdere l'opportunità di accedere a prestazioni o ricevere importi inferiori a quelli che ti spetterebbero.",
            order: 4,
            category: 'Obbligatorietà',
          },
          {
            question: "Quanto dura la validità dell'ISEE Corrente?",
            answer:
              "L'ISEE Corrente ha generalmente una validità di sei mesi dalla data di presentazione della Dichiarazione Sostitutiva Unica (DSU), a meno che non intervengano nuove variazioni significative che richiedano un ulteriore aggiornamento.",
            order: 5,
            category: 'Validità',
          },
        ],
      },
    ],
  },

  // 2. Disoccupazione
  {
    serviceType: {
      name: 'Disoccupazione',
      description:
        'Servizi per la disoccupazione e prestazioni economiche per lavoratori disoccupati',
    },
    services: [
      {
        name: 'Disoccupazione NASPI',
        code: 'NASP_2026',
        description:
          'La NASpI è un sostegno economico fondamentale per i lavoratori che hanno perso involontariamente il proprio impiego',
        category: 'EMPLOYMENT',
        basePrice: 0,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità italiana, carta d'identità di un paese comunitario, patente, passaporto)",
          '02. Codice Fiscale o Tessera Sanitaria',
          '03. Permesso di soggiorno del richiedente (se extracomunitario)',
          '04. Ultima Busta Paga in possesso',
          '05. Lettera di licenziamento - Contratto scaduto',
        ],
        faqs: [
          {
            question: 'Entro quanto viene elaborata la mia richiesta?',
            answer:
              'La tua richiesta di NASpI viene elaborata entro 6 ore dalla presentazione.',
            order: 1,
            category: 'Tempi',
          },
          {
            question:
              'Dopo la cessazione del rapporto di lavoro, entro quanto tempo posso richiedere la NASPI?',
            answer:
              'Puoi richiedere la NASpI entro 68 giorni dalla data di cessazione del rapporto di lavoro.',
            order: 2,
            category: 'Scadenze',
          },
          {
            question: "Qual è l'importo dell'indennità NASpI?",
            answer:
              "L'importo corrisponde al 75% della retribuzione media mensile soggetta a contribuzione degli ultimi quattro anni, fino a un massimo di €1.470,99 lordi. A partire dal primo giorno del sesto mese di fruizione, la NASpI si riduce del 3% ogni mese.",
            order: 3,
            category: 'Importo',
          },
          {
            question:
              'Percepisco la disoccupazione e ho trovato un nuovo lavoro, cosa devo fare?',
            answer:
              "Devi richiedere una NASpI-Com per comunicare all'INPS i termini del nuovo contratto, affinché l'indennità venga sospesa.",
            order: 4,
            category: 'Variazioni',
          },
          {
            question:
              'Percepisco la disoccupazione e sono incinta, cosa devo fare?',
            answer:
              "Devi richiedere una NASpI-Com per sospendere l'indennità nel periodo previsto di maternità obbligatoria.",
            order: 5,
            category: 'Variazioni',
          },
          {
            question:
              "Percepisco la pensione d'invalidità, posso percepire anche la disoccupazione?",
            answer: 'No, le due indennità non sono cumulabili.',
            order: 6,
            category: 'Cumulabilità',
          },
          {
            question:
              "L'indennità di disoccupazione tiene conto solo dell'ultimo lavoro?",
            answer: "L'INPS considera i periodi di lavoro degli ultimi 4 anni.",
            order: 7,
            category: 'Calcolo',
          },
          {
            question: "Cos'è la NASpI e a chi spetta?",
            answer:
              "La NASpI è un'indennità di disoccupazione erogata dall'INPS ai lavoratori dipendenti che hanno perso involontariamente il lavoro. È necessario aver maturato almeno 13 settimane di contributi negli ultimi 4 anni e aver lavorato almeno 30 giorni negli ultimi 12 mesi.",
            order: 8,
            category: 'Definizione',
          },
          {
            question: "Come si calcola l'importo della NASpI?",
            answer:
              "L'importo della NASpI si calcola in base alla retribuzione imponibile ai fini previdenziali degli ultimi 4 anni. Esiste una formula specifica e delle fasce di retribuzione che determinano l'importo.",
            order: 9,
            category: 'Calcolo',
          },
          {
            question: 'Quanto dura la NASpI?',
            answer:
              'La durata della NASpI è pari alla metà delle settimane di contribuzione accumulate negli ultimi 4 anni, con un massimo di 24 mesi.',
            order: 10,
            category: 'Durata',
          },
          {
            question: 'Quando si perde il diritto alla NASpI?',
            answer:
              "Il diritto alla NASpI si perde trovando un nuovo lavoro a tempo indeterminato, raggiungendo i requisiti per la pensione, superando i limiti di reddito da lavoro autonomo, rifiutando un'offerta di lavoro congrua, o non partecipando alle iniziative di politica attiva del lavoro.",
            order: 11,
            category: 'Perdita Diritto',
          },
          {
            question: 'Come e quando presentare la domanda di NASpI?',
            answer:
              "La domanda di NASpI va presentata all'INPS esclusivamente online, entro 68 giorni dalla data di cessazione del rapporto di lavoro.",
            order: 12,
            category: 'Procedura',
          },
          {
            question: 'Posso lavorare part-time mentre percepisco la NASpI?',
            answer:
              "Sì, è possibile lavorare part-time con un contratto di lavoro subordinato mentre si percepisce la NASpI. Bisogna però comunicare all'INPS il reddito previsto dal nuovo lavoro, che comporterà una riduzione dell'importo della NASpI.",
            order: 13,
            category: 'Occupazione',
          },
          {
            question: 'Ho diritto alla NASpI se mi dimetto?',
            answer:
              'In generale, no. Le dimissioni volontarie non danno diritto alla NASpI. Tuttavia, ci sono eccezioni: dimissioni per giusta causa o durante il periodo tutelato di maternità.',
            order: 14,
            category: 'Dimissioni',
          },
          {
            question:
              "Cosa succede se mi trasferisco all'estero durante la NASpI?",
            answer:
              "La NASpI può essere erogata anche all'estero, ma solo in determinati casi e per un periodo massimo di 3 mesi. È necessario informare l'INPS del trasferimento.",
            order: 15,
            category: 'Estero',
          },
        ],
      },
      {
        name: 'Disoccupazione Agricola',
        code: 'DAGRN_2026',
        description:
          "L'indennità di disoccupazione agricola è una prestazione economica per i lavoratori agricoli dipendenti",
        category: 'EMPLOYMENT',
        basePrice: 0,
        requiredDocuments: [
          "01. Carta d'identità richiedente",
          '02. Codice fiscale/Tessera Sanitaria del richiedente',
          '03. Iban richiedente',
        ],
        faqs: [],
      },
      {
        name: 'Anticipo NASPI',
        code: 'ANTNAS_2026',
        description:
          "La NASpI anticipata consiste nella liquidazione anticipata in un'unica soluzione dell'importo complessivo della NASpI",
        category: 'EMPLOYMENT',
        basePrice: 0,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice Fiscale',
          '03. Eventuale permesso di soggiorno del richiedente (se extracomunitario)',
          '04. Certificato di attribuzione P.IVA',
          "05. Certificato che attesta l'inizio attività (Visura camerale attiva, iscrizione gestione separata inps ecc)",
        ],
        faqs: [],
      },
      {
        name: 'DID - Dichiarazione Immediata Disponibilità',
        code: 'DID_2026',
        description:
          "La Did online - Dichiarazione di immediata disponibilità al lavoro, è la dichiarazione che determina formalmente l'inizio dello stato di disoccupazione di una persona",
        category: 'EMPLOYMENT',
        basePrice: 24.99,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
        ],
        faqs: [],
      },
      {
        name: 'PAD NASPI/DIS-COLL',
        code: 'PAD_2026',
        description:
          'Il Patto di Attivazione Digitale (PAD) rappresenta un passaggio cruciale per tutti i beneficiari di NASpI e DIS-COLL',
        category: 'EMPLOYMENT',
        basePrice: 24.99,
        requiredDocuments: [
          "01. Carta d'identità",
          '02. Codice fiscale',
          '03. CV (Curriculum Vitae)',
        ],
        faqs: [
          {
            question:
              "Patto di Attivazione Digitale (PAD): cos'è e come influisce su NASpI e DIS-COLL?",
            answer:
              'Il Patto di Attivazione Digitale (PAD) è un accordo che i beneficiari di NASpI e DIS-COLL devono sottoscrivere sulla piattaforma SIISL a partire da novembre 2024. Attraverso il PAD, ci si impegna a partecipare attivamente a percorsi di ricerca di lavoro, formazione e reinserimento professionale. In pratica, è un modo per confermare la propria disponibilità al lavoro e accedere ai servizi di supporto offerti.',
            order: 1,
            category: 'Definizione',
          },
          {
            question:
              'PAD obbligatorio per NASpI e DIS-COLL? Scadenze e conseguenze della mancata sottoscrizione',
            answer:
              "Sì, il PAD è obbligatorio per chi percepisce NASpI e DIS-COLL. Non ci sono scadenze rigide per la sottoscrizione, ma è fondamentale farlo il prima possibile per evitare potenziali ritardi nell'erogazione delle indennità. La mancata sottoscrizione può comportare la sospensione o la decadenza del beneficio.",
            order: 2,
            category: 'Obbligatorietà',
          },
        ],
      },
      {
        name: 'NASpI-Com',
        code: 'NASPICOM_2026',
        description:
          'Il servizio NASpI Com ti consente di inviare online tutte le comunicazioni relative alla variazione della tua situazione',
        category: 'EMPLOYMENT',
        basePrice: 24.99,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
          '03. Eventuale permesso di soggiorno del richiedente (se extracomunitario)',
          "04. Documento che attesta l'inizio di attività lavorativa (contratto di lavoro - certificato di attività autonoma)",
        ],
        faqs: [],
      },
      {
        name: 'Ricorso NASPI',
        code: 'RICORSO_NASP_2026',
        description:
          'Il servizio di Ricorso NASPI consente di presentare un ricorso contro il rigetto della domanda di disoccupazione NASPI',
        category: 'EMPLOYMENT',
        basePrice: 59.99,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
          '03. Lettera di Rigetto',
          '04. Ultima Lettera di Licenziamento',
        ],
        faqs: [],
      },
    ],
  },

  // 3. 730
  {
    serviceType: {
      name: '730',
      description: 'Dichiarazione dei redditi mediante modello 730',
    },
    services: [
      {
        name: 'Modello 730',
        code: '730_2026',
        description: 'Dichiarazione dei redditi mediante modello 730',
        category: 'TAX',
        basePrice: 36.6,
        requiredDocuments: [],
        faqs: [
          {
            question:
              'Quali sono le scadenze importanti per il Modello 730/2026?',
            answer:
              'La scadenza per la presentazione in forma ordinaria è fissata entro la fine di settembre 2026. Tuttavia, per ottenere il rimborso nella busta paga o nella pensione il prima possibile, è consigliabile presentare la dichiarazione il più presto possibile.',
            order: 1,
            category: 'Scadenze',
          },
          {
            question: 'Cosa è il Modello 730/2026 e a cosa serve?',
            answer:
              'Il Modello 730/2026 è un modulo semplificato per la dichiarazione dei redditi 2026, relativo ai redditi percepiti nel 2025. Serve principalmente per dichiarare i propri redditi, calcolare le imposte dovute e richiedere eventuali rimborsi o detrazioni fiscali.',
            order: 2,
            category: 'Definizione',
          },
          {
            question: 'Chi può fare il Modello 730/2026?',
            answer:
              'Il Modello 730/2026 può essere presentato da lavoratori dipendenti, pensionati e assimilati. Non può essere utilizzato da chi possiede redditi di impresa o da chi deve presentare il Modello Redditi Persone Fisiche.',
            order: 3,
            category: 'Richiedenti',
          },
          {
            question: 'Quali documenti servono per il Modello 730/2026?',
            answer:
              'I documenti necessari includono: la Certificazione Unica (CU), ricevute e fatture per spese detraibili, documenti relativi ai redditi percepiti, dati anagrafici del contribuente e dei familiari a carico, e ogni altra documentazione fiscale rilevante.',
            order: 4,
            category: 'Documenti',
          },
          {
            question:
              'Quali sono i vantaggi di fare il Modello 730/2026 con il vostro servizio?',
            answer:
              'Il nostro servizio garantisce una compilazione accurata e professionale della dichiarazione dei redditi, riducendo il rischio di errori e massimizzando le detrazioni e i rimborsi a cui avete diritto.',
            order: 5,
            category: 'Vantaggi',
          },
          {
            question: 'Cosa succede se commetto errori nel Modello 730/2026?',
            answer:
              'In caso di errori nel Modello 730/2026, è possibile presentare un Modello 730 integrativo entro il 25 ottobre dello stesso anno per correggere le informazioni errate.',
            order: 6,
            category: 'Errori',
          },
          {
            question: 'Posso scaricare il Modello 730/2026 online?',
            answer:
              "Sì, il Modello 730/2026 è disponibile online sul sito dell'Agenzia delle Entrate. Tuttavia, per una compilazione corretta è consigliabile affidarsi a un professionista.",
            order: 7,
            category: 'Procedura',
          },
          {
            question:
              'Qual è la differenza tra Modello 730 e Modello Redditi Persone Fisiche (ex Unico)?',
            answer:
              'Il Modello 730 è semplificato e destinato a lavoratori dipendenti e pensionati, con rimborsi direttamente in busta paga. Il Modello Redditi è più complesso e rivolto a chi ha redditi di impresa, lavoro autonomo o altre tipologie non dichiarabili nel 730.',
            order: 8,
            category: 'Differenze',
          },
          {
            question:
              'Cosa si intende per familiari a carico nel Modello 730/2026?',
            answer:
              'I familiari a carico sono i membri del nucleo familiare che non superano un determinato limite di reddito annuo (generalmente €2.840,51 lordi, elevato a €4.000 per figli fino a 24 anni) e per i quali il contribuente può usufruire di detrazioni fiscali.',
            order: 9,
            category: 'Famiglia',
          },
        ],
      },
      {
        name: 'Integrazione 730',
        code: '730INT_2026',
        description:
          'Integrazione della dichiarazione dei redditi mediante modello 730',
        category: 'TAX',
        basePrice: 12.2,
        requiredDocuments: [],
        faqs: [
          {
            question:
              'A cosa serve il Modello 730 Integrativo e quando posso usarlo?',
            answer:
              'Il Modello 730 Integrativo ti permette di correggere o integrare la tua dichiarazione dei redditi 730 già inviata. È fondamentale se ti accorgi di aver dimenticato spese detraibili o deducibili, hai ricevuto una nuova Certificazione Unica, o se hai commesso un errore che incide sul rimborso o sul debito. Puoi presentarlo generalmente entro il 25 ottobre dello stesso anno fiscale.',
            order: 1,
            category: 'Definizione',
          },
          {
            question: 'Quali vantaggi ottengo presentando il 730 Integrativo?',
            answer:
              "Presentare il 730 Integrativo ti permette di massimizzare il rimborso IRPEF aggiungendo detrazioni e deduzioni dimenticate, o di correggere errori che potrebbero averti fatto pagare più del dovuto. In questo modo, eviti future sanzioni o accertamenti da parte dell'Agenzia delle Entrate.",
            order: 2,
            category: 'Vantaggi',
          },
          {
            question:
              'Quali documenti sono necessari per compilare il 730 Integrativo?',
            answer:
              'Per compilare il Modello 730 Integrativo avremo bisogno della copia del tuo Modello 730 originario già presentato e di tutti i nuovi documenti o informazioni che vuoi includere (es. nuove fatture di spese sanitarie, Certificazioni Uniche aggiuntive, bonifici per ristrutturazioni).',
            order: 3,
            category: 'Documenti',
          },
          {
            question:
              'Il servizio è adatto se ho commesso un errore che aumenta il debito?',
            answer:
              "Assolutamente sì. Il nostro servizio per il Modello 730 Integrativo è pensato anche per chi ha commesso un errore che comporta un aumento del debito d'imposta o una diminuzione del credito. Correggere tempestivamente questi errori ti consente di sanare la tua posizione fiscale.",
            order: 4,
            category: 'Correzioni',
          },
          {
            question:
              "Quanto tempo ci vuole per l'elaborazione e l'invio del Modello 730 Integrativo?",
            answer:
              "L'elaborazione e l'invio del tuo Modello 730 Integrativo dipendono dalla complessità delle modifiche da apportare e dalla rapidità con cui ci fornisci la documentazione necessaria. Una volta ricevuti tutti i dati, il nostro team si impegna a procedere con la massima celerità.",
            order: 5,
            category: 'Tempi',
          },
        ],
      },
    ],
  },

  // 4. Dimissioni
  {
    serviceType: {
      name: 'Dimissioni',
      description: 'Servizi di gestione delle dimissioni dal lavoro',
    },
    services: [
      {
        name: 'Dimissioni Volontarie',
        code: 'DISM_VOL_2026',
        description:
          'Le dimissioni volontarie sono una procedura attraverso la quale un dipendente decide di rinunciare al proprio posto di lavoro attuale',
        category: 'HR',
        basePrice: 24.99,
        requiredDocuments: [
          "01. Carta d'identità",
          '02. Codice fiscale/Tessera Sanitaria',
          "03. Ultima Busta Paga/Modello Unilav/Contratto di lavoro (serve: il codice fiscale e la pec dell'azienda)",
          '04. Ultimo giorno lavorativo, compresi i giorni di preavviso',
        ],
        faqs: [
          {
            question:
              'Cosa succede se non rispetto il periodo di preavviso stabilito?',
            answer:
              'Nel caso in cui il periodo di preavviso non venga rispettato, o in presenza di una "giusta causa" pretestuosa, il lavoratore sarà considerato inadempiente e l\'azienda potrà detrarre dalla sua ultima busta paga l\'importo corrispondente ai giorni di preavviso mancanti.',
            order: 1,
            category: 'Preavviso',
          },
          {
            question: 'Entro quanto viene elaborata la mia richiesta?',
            answer: "Entro 2 ore dall'invio.",
            order: 2,
            category: 'Tempi',
          },
          {
            question:
              'Se decido di dare le dimissioni avrò diritto alla NASpI?',
            answer:
              'Se decidi di dimetterti volontariamente perderai il diritto alla NASpI, a meno che le dimissioni siano giustificate.',
            order: 3,
            category: 'NASpI',
          },
          {
            question:
              'Come posso dare le dimissioni senza perdere il diritto alla NASpI?',
            answer:
              'Per evitare di perdere il diritto alla NASpI al momento delle dimissioni è importante comunicare all\'INPS che le dimissioni sono motivate da una "giusta causa".',
            order: 4,
            category: 'NASpI',
          },
          {
            question:
              'Cosa succede alle ferie non godute in caso di dimissioni?',
            answer:
              'In caso di dimissioni volontarie, licenziamento o dimissioni per pensionamento, le ferie non godute devono essere retribuite dal datore di lavoro e possono essere convertite in denaro.',
            order: 5,
            category: 'Ferie',
          },
        ],
      },
      {
        name: 'Dimissioni per Giusta Causa',
        code: 'DISM_GIUSTA_2026',
        description:
          'Le dimissioni volontarie per giusta causa sono una procedura attraverso la quale un dipendente decide di rinunciare al proprio posto di lavoro',
        category: 'HR',
        basePrice: 24.99,
        requiredDocuments: [
          "01. Carta d'identità richiedente",
          '02. Codice Fiscale del richiedente',
          "03. Ultima Busta Paga/Modello Unilav/Contratto di lavoro (serve: il codice fiscale e la pec dell'azienda)",
          '04. Ultimo giorno lavorativo, compresi i giorni di preavviso',
        ],
        faqs: [],
      },
      {
        name: 'Risoluzione Consensuale',
        code: 'DISM_RISOL_2026',
        description:
          'La risoluzione consensuale del rapporto di lavoro è una procedura attraverso la quale datore di lavoro e dipendente decidono di comune accordo di terminare il rapporto lavorativo',
        category: 'HR',
        basePrice: 24.99,
        requiredDocuments: [
          "01. Carta d'identità richiedente",
          '02. Codice Fiscale del richiedente',
          "03. Ultima Busta Paga/Modello Unilav/Contratto di lavoro (serve: il codice fiscale e la pec dell'azienda)",
          '04. Ultimo giorno lavorativo',
        ],
        faqs: [],
      },
      {
        name: 'Revoca Dimissioni Volontarie',
        code: 'DISM_REVOCA_2026',
        description:
          'Il lavoratore ha sempre la possibilità di revocare le dimissioni entro 7 giorni successivi alla comunicazione',
        category: 'HR',
        basePrice: 19.99,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale lavoratore',
          '03. Ricevuta delle dimissioni effettuate',
        ],
        faqs: [
          {
            question: 'Quando è possibile revocare le dimissioni?',
            answer:
              'La normativa consente comunque al dipendente di revocare ovvero ritirare le dimissioni volontarie entro 7 giorni successivi alla comunicazione. Decorso il termine di 7 giorni utile per la revoca, per lo stesso rapporto di lavoro sarà possibile inviare nuove dimissioni, non revocabili.',
            order: 1,
            category: 'Termini',
          },
          {
            question: 'Quante volte si possono revocare le dimissioni?',
            answer:
              'Il lavoratore ha sempre la possibilità di revocare le dimissioni o la risoluzione consensuale entro 7 giorni successivi alla comunicazione. Decorso il termine di 7 giorni utile per la revoca, per lo stesso rapporto di lavoro sarà possibile inviare nuove dimissioni, non revocabili.',
            order: 2,
            category: 'Limitazioni',
          },
          {
            question:
              'Cosa succede se il lavoratore non convalida le dimissioni?',
            answer:
              "Le dimissioni rassegnate senza rispettare la procedura telematica sono inefficaci e non potranno comportare l'interruzione del rapporto di lavoro.",
            order: 3,
            category: 'Validità',
          },
        ],
      },
    ],
  },

  // 5. Rateizzazione
  {
    serviceType: {
      name: 'Rateizzazione Cartelle Agenzia Entrate',
      description: "Rateizzazione dei debiti presso l'Agenzia delle Entrate",
    },
    services: [
      {
        name: 'Rateizzazione Cartelle Agenzia delle Entrate',
        code: 'RATE_GEN_2026',
        description:
          "Il servizio di rateizzazione dei debiti dell'Agenzia delle Entrate offre ai contribuenti la possibilità di diluire il pagamento dei loro debiti fiscali in comode rate mensili",
        category: 'TAX',
        basePrice: 59.99,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
          '03. Cartelle da rateizzare',
        ],
        faqs: [],
      },
    ],
  },

  // 6. Consulenza
  {
    serviceType: {
      name: 'Consulenza',
      description: 'Servizio di consulenza professionale',
    },
    services: [
      {
        name: 'Consulenza',
        code: 'CONS_PROF_2026',
        description:
          'Servizio di consulenza, utile a risolvere questioni in campo fiscale, previdenziale, pensionistico, colf e badanti e immigrazione',
        category: 'CONSULTING',
        basePrice: 49.99,
        requiredDocuments: [],
        faqs: [],
      },
    ],
  },

  // 7. Estratto Conto Previdenziale
  {
    serviceType: {
      name: 'Estratto Conto Previdenziale',
      description: "Estratto conto previdenziale dall'INPS",
    },
    services: [
      {
        name: 'Estratto Conto Previdenziale',
        code: 'ESTCONT_PREV_2026',
        description:
          "L'Estratto conto contributivo è un documento che elenca tutti i contributi effettuati all'INPS in favore del lavoratore",
        category: 'PENSION',
        basePrice: 24.99,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
        ],
        faqs: [],
      },
    ],
  },

  // 8. Comunicazione INPS
  {
    serviceType: {
      name: 'Comunicazione INPS',
      description: "Comunicazione con l'INPS",
    },
    services: [
      {
        name: 'Comunicazione INPS',
        code: 'COMM_INPS_2026',
        description:
          "Il servizio Comunicazione INPS consente di entrare in contatto con l'INPS per sollecitare la risoluzione di problematiche riguardanti richieste che risultano ferme o in sospeso",
        category: 'ADMINISTRATIVE',
        basePrice: 29.99,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
        ],
        faqs: [],
      },
    ],
  },

  // 9. Permesso/Carta di Soggiorno
  {
    serviceType: {
      name: 'Permesso/Carta di Soggiorno',
      description: 'Servizi per permessi e carte di soggiorno',
    },
    services: [
      {
        name: 'Rinnovo Permesso Soggiorno per Lavoro Subordinato',
        code: 'RINN_PERM_LAV_2026',
        description: 'Rinnovo del permesso di soggiorno per lavoro subordinato',
        category: 'IMMIGRATION',
        basePrice: 44.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Rinnovo Permesso Soggiorno per Lavoro Autonomo',
        code: 'RINN_PERM_AUT_2026',
        description: 'Rinnovo del permesso di soggiorno per lavoro autonomo',
        category: 'IMMIGRATION',
        basePrice: 44.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Rinnovo Permesso Soggiorno per Motivi Familiari',
        code: 'RINN_PERM_FAM_2026',
        description: 'Rinnovo del permesso di soggiorno per motivi familiari',
        category: 'IMMIGRATION',
        basePrice: 44.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Rinnovo Permesso Soggiorno per Studenti',
        code: 'RINN_PERM_STU_2026',
        description: 'Rinnovo del permesso di soggiorno per studenti',
        category: 'IMMIGRATION',
        basePrice: 44.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Rinnovo Permesso Soggiorno per Asilo/Protezione',
        code: 'RINN_PERM_ASI_2026',
        description: 'Rinnovo del permesso di soggiorno per asilo/protezione',
        category: 'IMMIGRATION',
        basePrice: 44.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Aggiornamento Carta di Soggiorno',
        code: 'AGG_PERM_2026',
        description: 'Aggiornamento della carta di soggiorno per cambio dati',
        category: 'IMMIGRATION',
        basePrice: 44.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Rilascio Carta di Soggiorno per soggiornanti di lungo periodo',
        code: 'RILASC_CART_2026',
        description:
          'Rilascio della carta di soggiorno per soggiornanti di lungo periodo',
        category: 'IMMIGRATION',
        basePrice: 44.99,
        requiredDocuments: [],
        faqs: [],
      },
    ],
  },

  // 10. Cittadinanza Italiana
  {
    serviceType: {
      name: 'Cittadinanza Italiana',
      description: 'Servizi per la cittadinanza italiana',
    },
    services: [
      {
        name: 'Cittadinanza Italiana per Residenza',
        code: 'CITT_RES_2026',
        description:
          'La cittadinanza può essere richiesta dagli stranieri che risiedono in Italia da almeno dieci anni',
        category: 'IMMIGRATION',
        basePrice: 119.99,
        requiredDocuments: [
          "01. Carta d'identità italiana del richiedente",
          '02. Codice fiscale del richiedente',
          '03. Passaporto del richiedente',
          '04. Permesso di soggiorno del richiedente',
          '05. Certificato di lingua italiana livello B1 se non in possesso di titolo di studio italiano o di permesso di soggiorno per soggiornanti di lungo periodo',
          "06. Atto di nascita tradotto e legalizzato dall'ambasciata italiana nel paese di origine/apostillato",
          "07. Certificato penale tradotto e legalizzato dall'ambasciata italiana nel paese di origine/apostillato",
          '08. CU, modello redditi o modello 730 degli ultimi 3 anni',
          '09. Stato di famiglia rilasciato dal comune di residenza',
          '10. Certificato di residenza storico/Autodichiarazione di residenza storica',
          '11. Copia del versamento del contributo di € 250,00',
          '12. Marca da bollo da € 16,00',
        ],
        faqs: [],
      },
      {
        name: 'Cittadinanza Italiana per Matrimonio',
        code: 'CITT_MAT_2026',
        description: 'Cittadinanza per coniuge straniero o apolide',
        category: 'IMMIGRATION',
        basePrice: 119.99,
        requiredDocuments: [
          "01. Carta d'identità fronte e retro del richiedente",
          '02. Codice fiscale/tessera sanitaria fronte e retro del richiedente',
          '03. Passaporto richiedente',
          '04. Atto di nascita tradotto e legalizzato/apostillato',
          '05. Certificato penale tradotto e legalizzato/apostillato',
          '06. Permesso di soggiorno in possesso',
          '07. Atto integrale di matrimonio',
          '08. Stato di famiglia',
          '09. Copia del versamento del contributo di € 250,00',
          '10. Certificato di lingua italiana livello B1',
          '11. Marca da bollo da € 16,00',
          '12. Documento di riconoscimento del coniuge',
          '13. Codice fiscale/tessera sanitaria del coniuge',
        ],
        faqs: [],
      },
    ],
  },

  // 11. Ricongiungimento Familiare
  {
    serviceType: {
      name: 'Ricongiungimento Familiare',
      description: 'Ricongiungimento familiare in Italia',
    },
    services: [
      {
        name: 'Ricongiungimento Familiare',
        code: 'RICONG_FAM_2026',
        description:
          'Permette ai familiari di cittadini extracomunitari di ottenere visto e permesso',
        category: 'IMMIGRATION',
        basePrice: 99.99,
        requiredDocuments: [
          '01. Passaporto del richiedente',
          '02. Permesso di soggiorno del richiedente (durata complessiva di almeno un anno, o ricevuta di rinnovo/rilascio)',
          '03. Stato di famiglia',
          '04. Passaporto del/i familiare',
          '05. Ultima dichiarazione dei redditi (ove posseduta) oppure Ultima CU (ex CUD)',
          '06. Modello Unilav se lavoratore dipendente',
          '07. Ultime 3 buste paga se lavoratore dipendente',
          '08. Modello S3 firmato dal datore di lavoro se lavoratore dipendente',
          '09. Bollettino di versamento dei contributi INPS relativi al trimestre precedente (ultimi 3 mesi) se lavoratore domestico',
          '10. Certificato di Iscrizione alla Camera di Commercio se lavoratore autonomo',
          '11. Certificato di attribuzione P.IVA se lavoratore autonomo',
          "12. Contratto di locazione o contratto di comodato gratuito o atto di proprietà dell'alloggio",
          '13. Idoneità abitativa e certificazione igienico-sanitaria',
          "14. Nel caso il richiedente sia ospitato: dichiarazione autenticata del titolare dell'alloggio con consenso al ricongiungimento",
          '15. Modello S2 - Dichiarazione di consenso alloggio per i familiari ricongiunti',
          "16. Modello S1 - Dichiarazione di assenso del proprietario dell'alloggio all'ospitalità di un minore di 14 anni",
        ],
        faqs: [],
      },
    ],
  },

  // 12. Test Lingua
  {
    serviceType: {
      name: 'Test Conoscenza Lingua Italiana',
      description: 'Test di conoscenza della lingua italiana',
    },
    services: [
      {
        name: 'Test di conoscenza della lingua Italiana A2',
        code: 'TEST_LINGUA_2026',
        description:
          'Test di conoscenza della lingua italiana livello A2 per stranieri',
        category: 'IMMIGRATION',
        basePrice: 19.99,
        requiredDocuments: [
          "01. Carta d'identità del richiedente",
          '02. Codice Fiscale del richiedente',
          '03. Permesso di soggiorno del richiedente',
          '04. Passaporto del richiedente',
        ],
        faqs: [],
      },
    ],
  },

  // 13. Colf e Badanti
  {
    serviceType: {
      name: 'Colf e Badanti',
      description: 'Servizi per colf e badanti',
    },
    services: [
      {
        name: 'Busta Paga Colf e Badanti',
        code: 'BUSTA_COLF_2026',
        description: 'Elaborazione delle buste paga per colf e badanti',
        category: 'HR',
        basePrice: 18.3,
        requiredDocuments: [
          '01. Contratto di lavoro (mansioni, orario, retribuzione)',
          '02. Registro presenze con ore lavorate, straordinari e assenze',
          '03. Dati personali di colf/badante (nome, cognome, codice fiscale, dati anagrafici)',
        ],
        faqs: [
          {
            question:
              'Quali informazioni sono necessarie per elaborare correttamente le buste paga delle colf e badanti?',
            answer:
              'Per elaborare buste paga precise, è fondamentale avere informazioni come le ore lavorate, il salario orario, eventuali straordinari e detrazioni fiscali.',
            order: 1,
            category: 'Documenti',
          },
          {
            question:
              'Quali sono i vantaggi di affidarsi a un servizio professionale per la gestione delle buste paga delle colf e badanti?',
            answer:
              'SmartCaf garantisce precisione nei calcoli, rispetto delle normative e risparmio di tempo prezioso per il datore di lavoro.',
            order: 2,
            category: 'Vantaggi',
          },
          {
            question:
              "Come viene gestita la comunicazione con l'INPS per le buste paga delle colf e badanti?",
            answer:
              "SmartCaf gestisce tutte le comunicazioni ufficiali con l'INPS, garantendo la conformità alle disposizioni normative e la trasmissione tempestiva dei dati necessari.",
            order: 3,
            category: 'INPS',
          },
          {
            question:
              'Come posso assicurarmi che i bollettini MAV per le contribuzioni previdenziali delle colf e badanti siano gestiti correttamente?',
            answer:
              'Affidandoti a SmartCaf, avrai la garanzia che i bollettini MAV per le contribuzioni previdenziali siano generati in modo accurato e inviati tempestivamente, assicurando il rispetto delle scadenze e delle obbligazioni fiscali.',
            order: 4,
            category: 'MAV',
          },
        ],
      },
      {
        name: 'MAV Trimestrale Colf e Badanti',
        code: 'MAV_COLF_2026',
        description: 'Bollettino MAV trimestrale per contributi previdenziali',
        category: 'HR',
        basePrice: 12.2,
        requiredDocuments: [
          '01. Dati personali datore di lavoro (nome, cognome, codice fiscale o P.IVA, indirizzo)',
          '02. Dati personali lavoratore (nome, cognome, codice fiscale, data di nascita, residenza)',
          '03. Registro presenze o giornaliero con ore lavorate nel trimestre',
        ],
        faqs: [
          {
            question:
              'Quali sono i vantaggi di utilizzare il servizio di bollettino MAV trimestrale per colf e badanti?',
            answer:
              'Il nostro servizio semplifica la gestione delle contribuzioni previdenziali, garantendo tempestività e conformità normativa. Risparmia tempo e riduci il rischio di errori nella gestione amministrativa.',
            order: 1,
            category: 'Vantaggi',
          },
          {
            question:
              'Quali informazioni sono necessarie per richiedere il servizio di bollettino MAV trimestrale?',
            answer:
              'Abbiamo bisogno dei dati personali del datore di lavoro e del lavoratore, registro presenze, dettagli retributivi e contributi previdenziali per elaborare il bollettino MAV trimestrale in modo accurato.',
            order: 2,
            category: 'Documenti',
          },
          {
            question:
              'Come funziona il processo di elaborazione del bollettino MAV trimestrale con il vostro servizio?',
            answer:
              'Una volta forniti i documenti necessari, il nostro team si occupa di elaborare il bollettino MAV trimestrale in conformità con le normative vigenti, garantendo tempestività e precisione.',
            order: 3,
            category: 'Procedura',
          },
          {
            question:
              'Qual è la frequenza di emissione dei bollettini MAV trimestrali?',
            answer:
              "I bollettini MAV trimestrali vengono emessi ogni trimestre solare, rispettando le scadenze stabilite dall'INPS.",
            order: 4,
            category: 'Scadenze',
          },
          {
            question:
              'Cosa succede se ci sono modifiche nei dati durante il trimestre?',
            answer:
              "In caso di modifiche nei dati, è importante informare tempestivamente il nostro servizio per garantire l'aggiornamento corretto del bollettino MAV trimestrale e evitare eventuali problemi con le autorità competenti.",
            order: 5,
            category: 'Variazioni',
          },
        ],
      },
      {
        name: 'Assunzione Colf e Badanti',
        code: 'ASSU_COLF_2026',
        description: "Comunicazione di assunzione all'INPS",
        category: 'HR',
        basePrice: 49.99,
        requiredDocuments: [
          "01. Documento di riconoscimento datore di lavoro (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale datore di lavoro',
          '03. Eventuale permesso di soggiorno del datore di lavoro',
          "04. Documento di riconoscimento lavoratore (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '05. Codice fiscale lavoratore',
          '06. Eventuale permesso di soggiorno del lavoratore',
        ],
        faqs: [],
      },
      {
        name: 'CU Colf e Badanti',
        code: 'CU_COLF_2026',
        description: 'Certificazione Unica per colf e badanti',
        category: 'HR',
        basePrice: 36.6,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
        ],
        faqs: [
          {
            question: 'A cosa serve il CU per colf e badanti?',
            answer:
              "Il CU (Certificazione Unica) è indispensabile per la dichiarazione dei redditi, per il calcolo dell'ISEE per accedere a sconti e agevolazioni, e può essere richiesto per altre pratiche burocratiche come il rinnovo del permesso di soggiorno.",
            order: 1,
            category: 'Definizione',
          },
          {
            question: 'Chi deve rilasciare il CU?',
            answer:
              'Il datore di lavoro (famiglia che ha assunto la colf o la badante) è tenuto a rilasciare il CU entro determinati termini stabiliti dalla legge.',
            order: 2,
            category: 'Obblighi',
          },
          {
            question: 'Cosa contiene il CU?',
            answer:
              'Il CU riporta informazioni importanti come: dati anagrafici del datore di lavoro e del lavoratore, periodo di riferimento, importo dei compensi corrisposti e contributo previdenziale versato.',
            order: 3,
            category: 'Contenuto',
          },
          {
            question: 'Perché è importante il CU?',
            answer:
              'Il CU è un documento essenziale per tutelare i diritti del lavoratore domestico e per garantire la corretta gestione amministrativa del rapporto di lavoro.',
            order: 4,
            category: 'Importanza',
          },
        ],
      },
      {
        name: 'Lettera di Assunzione Colf e Badanti',
        code: 'LET_ASSU_COLF_2026',
        description: 'Redazione lettera di assunzione',
        category: 'HR',
        basePrice: 49.99,
        requiredDocuments: [
          '01. Dati personali del datore di lavoro (nome, cognome, codice fiscale o P.IVA, indirizzo)',
          '02. Dati personali del lavoratore (nome, cognome, codice fiscale, data di nascita, residenza, qualifiche)',
          '03. Mansioni e compiti da svolgere',
          '04. Orario di lavoro, giorni di riposo ed eventuali turni',
          "05. Retribuzione e modalita' di pagamento",
          '06. Durata del contratto (determinato o indeterminato)',
        ],
        faqs: [
          {
            question:
              "Quali informazioni devono essere incluse nella lettera d'assunzione per una colf o una badante?",
            answer:
              "La lettera d'assunzione deve includere i dettagli personali del datore di lavoro e del lavoratore, le mansioni e i compiti da svolgere, l'orario di lavoro, la retribuzione e la durata del contratto.",
            order: 1,
            category: 'Contenuto',
          },
          {
            question:
              "Come posso garantire la conformità legale della lettera d'assunzione?",
            answer:
              "SmartCaf redige la lettera d'assunzione in conformità alle normative vigenti, includendo tutti i dettagli pertinenti come l'orario di lavoro, la retribuzione e le clausole contrattuali rilevanti.",
            order: 2,
            category: 'Conformità',
          },
          {
            question:
              "Quali sono le clausole importanti da includere nella lettera d'assunzione?",
            answer:
              'Alcune clausole importanti da includere riguardano la riservatezza delle informazioni, il trattamento dei dati personali, le ferie e il preavviso di licenziamento.',
            order: 3,
            category: 'Clausole',
          },
          {
            question:
              "Qual è l'importanza di una lettera d'assunzione ben redatta?",
            answer:
              "Una lettera d'assunzione ben redatta è importante per stabilire chiaramente i termini e le condizioni del rapporto di lavoro, garantendo trasparenza e rispettando le normative vigenti, riducendo il rischio di controversie future.",
            order: 4,
            category: 'Importanza',
          },
        ],
      },
      {
        name: 'Cessazione Colf e Badanti',
        code: 'CESS_COLF_2026',
        description: 'Cessazione del rapporto di lavoro domestico',
        category: 'HR',
        basePrice: 36.6,
        requiredDocuments: [
          "01. Documento di riconoscimento del datore di lavoro (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale del datore di lavoro',
          '03. Eventuale permesso di soggiorno del datore di lavoro',
          '04. Codice fiscale del lavoratore',
          '05. Comunicazione di assunzione INPS',
        ],
        faqs: [],
      },
      {
        name: 'Variazione Colf e Badanti',
        code: 'VAR_COLF_2026',
        description: 'Variazione del rapporto di lavoro domestico',
        category: 'HR',
        basePrice: 36.6,
        requiredDocuments: [
          "01. Documento di riconoscimento datore di lavoro (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale datore di lavoro',
          '03. Eventuale permesso di soggiorno del datore di lavoro',
          "04. Documento di riconoscimento lavoratore (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '05. Codice fiscale lavoratore',
          '06. Eventuale permesso di soggiorno del lavoratore',
          '07. Comunicazione di assunzione INPS',
        ],
        faqs: [],
      },
    ],
  },

  // 14. Maternità
  {
    serviceType: {
      name: 'Maternità',
      description: 'Servizi e prestazioni per la maternità',
    },
    services: [
      {
        name: 'Assegno di Maternità',
        code: 'ASS_MATERN_2026',
        description: 'Assegno di maternità INPS',
        category: 'SOCIAL',
        basePrice: 29.99,
        requiredDocuments: [
          "01. Carta d'identità dichiarante",
          '02. Codice Fiscale dichiarante',
          '03. Permesso/Carta di soggiorno dichiarante',
          '04. Codice fiscale neonato',
          '05. Attestazione ISEE non superiore a euro 17.416,66',
        ],
        faqs: [],
      },
      {
        name: 'Bonus Nuovi Nati',
        code: 'BON_NATI_2026',
        description: 'Bonus per nuovi nati',
        category: 'SOCIAL',
        basePrice: 29.99,
        requiredDocuments: [
          "01. Documento d'identita' valido del genitore richiedente",
          '02. Codice fiscale del genitore richiedente e del bambino/i',
          "03. Attestazione ISEE minorenni in corso di validita' (non superiore a 40.000 euro)",
          '04. Permesso di soggiorno valido (per cittadini non UE)',
          '05. IBAN del genitore richiedente',
        ],
        faqs: [
          {
            question: "Che cos'è il Bonus Nuovi Nati (o Bonus Bebè)?",
            answer:
              "Il Bonus Nuovi Nati, spesso denominato anche Bonus Bebè, è un contributo economico fornito dallo Stato per sostenere le famiglie in occasione della nascita, dell'adozione o dell'affidamento preadottivo di un bambino. Rappresenta un aiuto finanziario per far fronte alle prime spese legate all'arrivo di un nuovo membro in famiglia.",
            order: 1,
            category: 'Definizione',
          },
          {
            question:
              'Chi può richiedere il Bonus Bebè e quali sono i requisiti principali per il 2025?',
            answer:
              'Per poter richiedere il Bonus Bebè nel 2025, generalmente è necessario possedere la cittadinanza italiana, di un Paese UE o un regolare permesso di soggiorno, avere la residenza in Italia e un ISEE del nucleo familiare entro una determinata soglia (solitamente non superiore a 40.000 euro). Il figlio deve essere nato, adottato o in affido preadottivo a partire dal 1° gennaio 2025.',
            order: 2,
            category: 'Requisiti',
          },
          {
            question:
              'Entro quanto tempo va presentata la domanda per il Bonus Bebè?',
            answer:
              'La domanda per il Bonus Bebè deve essere presentata entro un termine stabilito dalla legge, che solitamente è di 60 giorni dalla data di nascita, adozione o ingresso in famiglia del minore in affido preadottivo. È cruciale rispettare questa scadenza per non perdere il diritto al contributo.',
            order: 3,
            category: 'Scadenze',
          },
        ],
      },
      {
        name: 'Congedo Parentale Dipendenti',
        code: 'CONG_PAR_DIP_2026',
        description: 'Congedo parentale per dipendenti',
        category: 'HR',
        basePrice: 29.99,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
          '03. Codice fiscale altro genitore se presente',
          '04. Codice fiscale del minore',
          '05. Buste paga',
        ],
        faqs: [],
      },
    ],
  },

  // 15. Invalidità Civile
  {
    serviceType: {
      name: 'Invalidità Civile',
      description: 'Servizi per invalidità civile',
    },
    services: [
      {
        name: 'Invalidità Civile',
        code: 'INVAL_CIV_2026',
        description: 'Servizio di invalidità civile',
        category: 'SOCIAL',
        basePrice: 29.99,
        requiredDocuments: [],
        faqs: [],
      },
    ],
  },

  // 16. Dichiarazione Redditi
  {
    serviceType: {
      name: 'Dichiarazione Redditi',
      description: 'Servizi di dichiarazione dei redditi',
    },
    services: [
      {
        name: 'Modello Redditi Persone Fisiche Senza P.IVA',
        code: 'MOD_REDD_PF_2026',
        description: 'Dichiarazione redditi per persone fisiche senza P.IVA',
        category: 'TAX',
        basePrice: 70,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
          '03. CU 2023 redditi 2022',
          '04. Codice fiscale dei familiari a carico',
          '05. Spese sanitarie',
          '06. Contratto di locazione',
          '07. Interessi passivi su mutui (contratto compravendita, contratto mutuo, oneri accessori, quietanze interessi, fatture ristrutturazione/costruzione)',
          '08. Spese funebri',
          "09. Spese frequenza di scuole dell'infanzia, del primo ciclo di istruzione e della scuola secondaria di secondo grado",
          '10. Spese frequenza corsi istruzione universitaria presso università statali e non statali',
          "11. Spese per addetti all'assistenza personale",
          '12. Spese per attività sportive dei ragazzi',
          '13. Spese veterinarie',
          '14. Spese asili nido',
          '15. Versamenti onlus',
          '16. Contributi previdenziali assistenziali',
          '17. Assegni periodici corrisposti al coniuge (sentenza e quietanze, cod. fisc. ex-coniuge)',
          '18. Contributi servizi domestici',
          '19. Spese mediche e di assistenza di persone con disabilità',
          '20. Spese 36% - 50% - 65% per interventi di recupero del patrimonio edilizio',
          '21. Spese 50% per la pace contributiva e le colonne per la ricarica',
          "22. Spese 50% per l'arredo immobili (comprese giovani coppie) e IVA per acquisto abitazione A o B; spese 55% - 65% per risparmio energetico",
        ],
        faqs: [],
      },
      {
        name: 'Modello Redditi P.IVA Forfettaria',
        code: 'MOD_REDD_PFIVA_2026',
        description: 'Dichiarazione redditi per regime forfettario',
        category: 'TAX',
        basePrice: 129.99,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
          '03. CU 2023 redditi 2022',
          '04. Eventuale certificato di attribuzione P.IVA',
          "05. Eventuali fatture emesse nell'anno 2022",
          '06. Codice fiscale dei familiari a carico',
          '07. Spese sanitarie',
          '08. Contratto di locazione',
          '09. Interessi passivi su mutui (contratto compravendita, contratto mutuo, oneri accessori, quietanze interessi, fatture ristrutturazione/costruzione)',
          '10. Spese funebri',
          "11. Spese frequenza di scuole dell'infanzia, del primo ciclo di istruzione e della scuola secondaria di secondo grado",
          '12. Spese frequenza corsi istruzione universitaria presso università statali e non statali',
          "13. Spese per addetti all'assistenza personale",
          '14. Spese per attività sportive dei ragazzi',
          '15. Spese veterinarie',
          '16. Spese asili nido',
          '17. Versamenti onlus',
          '18. Contributi previdenziali assistenziali',
          '19. Assegni periodici corrisposti al coniuge (sentenza e quietanze, cod. fisc. ex-coniuge)',
          '20. Contributi servizi domestici',
          '21. Spese mediche e di assistenza di persone con disabilità',
          '22. Spese 36% - 50% - 65% per interventi di recupero del patrimonio edilizio',
          '23. Spese 50% per la pace contributiva e le colonne per la ricarica',
          "24. Spese 50% per l'arredo immobili (comprese giovani coppie) e IVA per acquisto abitazione A o B; spese 55% - 65% per risparmio energetico",
        ],
        faqs: [],
      },
      {
        name: 'Integrazione Modello Redditi PF',
        code: 'INT_MOD_REDD_2026',
        description: 'Integrazione alla dichiarazione dei redditi',
        category: 'TAX',
        basePrice: 50,
        requiredDocuments: [
          "01. Documento di riconoscimento (Carta d'identità fronte e retro - Patente fronte e retro - Passaporto)",
          '02. Codice fiscale richiedente',
          '03. CU 2023 redditi 2022',
          '04. Codice fiscale dei familiari a carico',
          '05. Spese sanitarie',
          '06. Contratto di locazione',
          '07. Interessi passivi su mutui (contratto compravendita, contratto mutuo, oneri accessori, quietanze interessi, fatture ristrutturazione/costruzione)',
          '08. Spese funebri',
          "09. Spese frequenza di scuole dell'infanzia, del primo ciclo di istruzione e della scuola secondaria di secondo grado",
          '10. Spese frequenza corsi istruzione universitaria presso università statali e non statali',
          "11. Spese per addetti all'assistenza personale",
          '12. Spese per attività sportive dei ragazzi',
          '13. Spese veterinarie',
          '14. Spese asili nido',
          '15. Versamenti onlus',
          '16. Contributi previdenziali assistenziali',
          '17. Assegni periodici corrisposti al coniuge (sentenza e quietanze, cod. fisc. ex-coniuge)',
          '18. Contributi servizi domestici',
          '19. Spese mediche e di assistenza di persone con disabilità',
          '20. Spese 36% - 50% - 65% per interventi di recupero del patrimonio edilizio',
          '21. Spese 50% per la pace contributiva e le colonne per la ricarica',
          "22. Spese 50% per l'arredo immobili (comprese giovani coppie) e IVA per acquisto abitazione A o B; spese 55% - 65% per risparmio energetico",
        ],
        faqs: [],
      },
      {
        name: 'Modello F24',
        code: 'F24_CEDOL_2026',
        description: 'Modello F24 per pagamento imposte',
        category: 'TAX',
        basePrice: 29.99,
        requiredDocuments: [
          "01. Carta d'identità",
          '02. Codice fiscale',
          '03. Contratto di locazione',
          '04. Registrazione del contratto di locazione',
        ],
        faqs: [
          {
            question:
              "Cos'è la cedolare secca e quando devo pagarla con il Modello F24?",
            answer:
              "La cedolare secca è un regime fiscale agevolato per chi affitta immobili a uso abitativo. Ti permette di pagare un'imposta fissa sul canone di locazione al posto di IRPEF, imposta di registro e di bollo. Il pagamento avviene tramite il Modello F24, seguendo le scadenze IRPEF: generalmente acconti a giugno e novembre, e saldo a giugno dell'anno successivo.",
            order: 1,
            category: 'Definizione',
          },
          {
            question:
              'Di quali documenti ho bisogno per richiedere il servizio?',
            answer:
              "Per elaborare il tuo F24 per la cedolare secca avremo bisogno del tuo Codice Fiscale, una copia del contratto di locazione registrato con il relativo codice identificativo, l'importo del canone annuo e, se disponibile, la dichiarazione dei redditi dell'anno precedente.",
            order: 2,
            category: 'Documenti',
          },
          {
            question:
              'Il vostro servizio è valido per tutti i tipi di contratto con cedolare secca?',
            answer:
              'Sì, il nostro servizio è adatto per tutti i contratti di locazione ad uso abitativo per i quali è stata optata la cedolare secca, inclusi i contratti a canone libero (4+4), a canone concordato (3+2) e le locazioni brevi.',
            order: 3,
            category: 'Contratti',
          },
          {
            question:
              'Come riceverò il Modello F24 compilato e come effettuerò il pagamento?',
            answer:
              'Una volta che avremo elaborato la tua richiesta, ti forniremo il Modello F24 già compilato e pronto per il pagamento. Riceverai istruzioni chiare e dettagliate su come procedere al versamento in autonomia, solitamente tramite i servizi di home banking della tua banca.',
            order: 4,
            category: 'Pagamento',
          },
        ],
      },
      {
        name: 'Dichiarazione e Calcolo IMU',
        code: 'DICH_IMU_2026',
        description: 'Dichiarazione e calcolo IMU',
        category: 'TAX',
        basePrice: 29.99,
        requiredDocuments: [
          "01. Carta d'identità",
          '02. Codice Fiscale',
          '03. Visura Catastale Aggiornata',
          '04. Dati dei Pagamenti Precedenti',
        ],
        faqs: [
          {
            question:
              "Che cos'è il Calcolo IMU e perché è importante farlo correttamente?",
            answer:
              "Il calcolo IMU è l'operazione che determina l'ammontare esatto dell'Imposta Municipale Propria (IMU) che devi pagare sui tuoi immobili ogni anno. È cruciale farlo correttamente perché errori possono portare a sanzioni da parte del Comune o a versare più del dovuto.",
            order: 1,
            category: 'Definizione',
          },
          {
            question: 'Chi deve richiedere il servizio di Calcolo IMU?',
            answer:
              "Il servizio è rivolto a tutti i proprietari di immobili (abitazioni, terreni, negozi) e ai titolari di altri diritti reali (come usufrutto, uso, abitazione). È particolarmente utile per chi ha seconde case, immobili in comodato d'uso gratuito, o per chi ha effettuato acquisti o vendite immobiliari nell'anno.",
            order: 2,
            category: 'Richiedenti',
          },
          {
            question:
              "Questo servizio include il Calcolo IMU per l'Abitazione Principale?",
            answer:
              "Sì, il nostro servizio copre anche l'abitazione principale, ma solo nei casi in cui questa non rientri nelle categorie esenti (categorie catastali di lusso A/1, A/8, A/9). Per queste abitazioni, calcoliamo l'imposta dovuta e verifichiamo le detrazioni IMU specifiche.",
            order: 3,
            category: 'Abitazione',
          },
          {
            question:
              "Con il vostro servizio ricevo anche l'F24 per il pagamento dell'IMU?",
            answer:
              "Assolutamente sì. Una volta completato il calcolo IMU, ti forniamo i modelli F24 precompilati con tutti i dati necessari per il versamento, inclusi i codici tributo e gli importi precisi per l'acconto (scadenza giugno) e il saldo (scadenza dicembre).",
            order: 4,
            category: 'Pagamento',
          },
        ],
      },
    ],
  },

  // 18. Partita IVA
  {
    serviceType: {
      name: 'Partita IVA',
      description: 'Servizi relativi a Partita IVA',
    },
    services: [
      {
        name: 'Apertura Partita IVA',
        code: 'APERT_PIVA_2026',
        description: 'Apertura della Partita IVA',
        category: 'BUSINESS',
        basePrice: 149.99,
        requiredDocuments: [],
        faqs: [
          {
            question:
              'Quanto costa aprire la Partita IVA con il regime forfettario?',
            answer:
              "L'apertura della Partita IVA per i liberi professionisti non prevede costi vivi di bollo o diritti verso l'Agenzia delle Entrate. Il nostro servizio offre un pacchetto chiavi in mano che include la consulenza iniziale e l'invio telematico, garantendoti il massimo risparmio fiscale con la flat tax agevolata al 5% o 15%.",
            order: 1,
            category: 'Costi',
          },
          {
            question:
              "Quali documenti servono per l'apertura della Partita IVA online?",
            answer:
              "Sono necessari pochi e semplici documenti: una copia fronte-retro del tuo documento d'identità, il codice fiscale e un indirizzo email di riferimento. I nostri consulenti ti guideranno nella descrizione della tua attività per individuare il Codice ATECO più preciso.",
            order: 2,
            category: 'Documenti',
          },
          {
            question: 'In quanto tempo viene attivata la nuova Partita IVA?',
            answer:
              "Una volta ricevuta tutta la documentazione necessaria, i nostri consulenti elaborano e inviano la dichiarazione di inizio attività all'Agenzia delle Entrate in tempi record. Solitamente, il numero di Partita IVA viene rilasciato e comunicato al cliente entro 24 ore lavorative.",
            order: 3,
            category: 'Tempi',
          },
          {
            question: 'Come mi aiutate a scegliere il Codice ATECO corretto?',
            answer:
              "La selezione del Codice ATECO è fondamentale perché definisce la base imponibile su cui pagherai le tasse, specialmente nel regime forfettario. I nostri esperti effettuano un'analisi dettagliata del tuo profilo professionale per assegnarti il codice che meglio rispecchia il tuo business.",
            order: 4,
            category: 'ATECO',
          },
          {
            question: "Gestite anche l'iscrizione alla Gestione Separata INPS?",
            answer:
              "Certamente. Durante la fase di apertura della Partita IVA, il team verifica il tuo inquadramento previdenziale e, se sei un libero professionista senza una cassa autonoma, procede contestualmente all'iscrizione alla Gestione Separata INPS.",
            order: 5,
            category: 'INPS',
          },
        ],
      },
      {
        name: 'Variazione Partita IVA',
        code: 'VAR_PIVA_2026',
        description: 'Variazione della Partita IVA',
        category: 'BUSINESS',
        basePrice: 99.99,
        requiredDocuments: [],
        faqs: [
          {
            question: 'Come posso richiedere la variazione Partita IVA?',
            answer:
              "Basta compilare il nostro form online con i nuovi dati (come il cambio sede o il nuovo codice ATECO) e caricare i documenti richiesti. Un nostro consulente prenderà in carico la pratica, verificherà la correttezza dei dati e invierà la comunicazione telematica all'Agenzia delle Entrate.",
            order: 1,
            category: 'Procedura',
          },
          {
            question:
              'Perché scegliere il nostro servizio per modificare il codice ATECO?',
            answer:
              "I nostri esperti ti supportano nella scelta del codice ATECO corretto, fondamentale per l'inquadramento fiscale e previdenziale, evitando errori che potrebbero causare sanzioni o problemi con l'INPS e la Camera di Commercio.",
            order: 2,
            category: 'Vantaggi',
          },
          {
            question: 'Quali documenti servono per la variazione dati?',
            answer:
              "Avrai bisogno del tuo documento d'identità in corso di validità, del codice fiscale e dei dettagli relativi alla modifica da effettuare (ad esempio l'indirizzo della nuova sede o la descrizione della nuova attività). Gestiremo noi l'invio del modello AA9/12 o AA7/10 entro 24h.",
            order: 3,
            category: 'Documenti',
          },
          {
            question: 'Quanto costa il servizio di variazione Partita IVA?',
            answer:
              "Il nostro servizio offre tariffe trasparenti e competitive, che includono la consulenza professionale e l'invio telematico della pratica. Rispetto ai costi di un ufficio fisico, il nostro servizio online ti permette di risparmiare tempo e denaro.",
            order: 4,
            category: 'Costi',
          },
          {
            question: 'Riceverò una ricevuta ufficiale dopo la variazione?',
            answer:
              "Al termine della procedura, ti invieremo la ricevuta di avvenuta presentazione rilasciata dall'Agenzia delle Entrate. Questo documento ufficiale attesta che l'aggiornamento dei dati della tua Partita IVA è stato registrato correttamente.",
            order: 5,
            category: 'Ricevuta',
          },
        ],
      },
      {
        name: 'Cessazione Ditta Individuale',
        code: 'CESS_DITA_2026',
        description: 'Cessazione della ditta individuale',
        category: 'BUSINESS',
        basePrice: 99.99,
        requiredDocuments: [],
        faqs: [
          {
            question:
              'Quanto tempo ho per chiudere la Partita IVA di una ditta individuale?',
            answer:
              'La legge prevede che la comunicazione di cessazione attività debba essere presentata entro 30 giorni dalla data di effettiva chiusura. Affidarsi a SmartCAF permette di rispettare queste tempistiche ed evitare le sanzioni amministrative.',
            order: 1,
            category: 'Tempi',
          },
          {
            question:
              'Cosa succede ai contributi INPS dopo la chiusura della ditta?',
            answer:
              "Una volta completata la pratica di cessazione, la comunicazione viene inoltrata all'INPS per la chiusura della posizione contributiva. Questo interrompe immediatamente l'obbligo di versamento dei contributi fissi (artigiani o commercianti).",
            order: 2,
            category: 'INPS',
          },
          {
            question: 'È obbligatorio cancellarsi dalla Camera di Commercio?',
            answer:
              'Sì, per le ditte individuali iscritte al Registro Imprese la cancellazione è un atto dovuto. SmartCAF gestisce questa pratica contestualmente alla chiusura della Partita IVA per garantire che il diritto camerale annuale non venga più addebitato.',
            order: 3,
            category: 'Camera Commercio',
          },
          {
            question:
              'Posso chiudere una ditta individuale online senza andare allo sportello?',
            answer:
              "Certamente. Il servizio è progettato per gestire l'intero iter telematicamente. Caricando i documenti richiesti sulla nostra piattaforma, i nostri consulenti interfacceranno per tuo conto l'Agenzia delle Entrate, la Camera di Commercio e gli enti previdenziali.",
            order: 4,
            category: 'Procedura',
          },
          {
            question:
              'Quali costi fissi si smettono di pagare chiudendo la ditta?',
            answer:
              "Attraverso la cessazione completa, smetterai di versare il diritto camerale annuo alla Camera di Commercio, i contributi previdenziali minimi obbligatori all'INPS e l'eventuale premio assicurativo INAIL.",
            order: 5,
            category: 'Costi',
          },
        ],
      },
      {
        name: 'Comunicazione Camera Commercio',
        code: 'COMM_CAM_2026',
        description: 'Comunicazione alla Camera di Commercio',
        category: 'BUSINESS',
        basePrice: 149.99,
        requiredDocuments: [],
        faqs: [
          {
            question:
              'Qual è la differenza tra variazione Partita IVA e pratica Camera di Commercio?',
            answer:
              "Sono due adempimenti distinti. La variazione P.IVA comunica i cambiamenti all'Agenzia delle Entrate per fini fiscali, mentre la pratica Camera di Commercio (ComUnica) aggiorna il Registro Imprese. Per ditte individuali, artigiani e commercianti, la comunicazione al Registro Imprese è obbligatoria.",
            order: 1,
            category: 'Differenze',
          },
          {
            question:
              'Chi è obbligato a presentare la pratica al Registro Imprese?',
            answer:
              "L'obbligo riguarda tutti i soggetti iscritti alla Camera di Commercio, come Ditte Individuali, Società (Snc, Srl, Sas), Artigiani e Commercianti. I liberi professionisti iscritti esclusivamente alla Gestione Separata INPS non sono tenuti a questo adempimento.",
            order: 2,
            category: 'Obblighi',
          },
          {
            question:
              'Quali modifiche aziendali devono essere comunicate obbligatoriamente?',
            answer:
              "È necessario comunicare tramite ComUnica qualsiasi variazione rilevante, tra cui: il trasferimento della sede legale, l'apertura o chiusura di unità locali, la modifica dell'oggetto sociale e la nomina di nuovi amministratori o responsabili tecnici.",
            order: 3,
            category: 'Variazioni',
          },
          {
            question:
              'Cosa succede se non si comunica una variazione alla Camera di Commercio?',
            answer:
              "Il mancato aggiornamento del Registro Imprese comporta sanzioni amministrative pecuniarie. Inoltre, non comunicare i cambiamenti può bloccare l'ottenimento di certificazioni e visure aggiornate necessarie per bandi, prestiti bancari o contratti.",
            order: 4,
            category: 'Sanzioni',
          },
          {
            question:
              'Quanto costa presentare una pratica in Camera di Commercio?',
            answer:
              'Il costo del servizio si aggiunge ai costi fissi ministeriali (Diritti di Segreteria e Imposta di Bollo), che variano in base alla tipologia di pratica e di impresa.',
            order: 5,
            category: 'Costi',
          },
        ],
      },
    ],
  },

  // 19. Contratti Locazione
  {
    serviceType: {
      name: 'Contratti di Locazione',
      description: 'Servizi per contratti di locazione',
    },
    services: [
      {
        name: 'Contratti di Locazione',
        code: 'CONTR_LOC_2026',
        description:
          'Gestione dei contratti di locazione (€85,40 + Spese di registrazione)',
        category: 'REAL_ESTATE',
        basePrice: 85.4,
        requiredDocuments: [],
        faqs: [],
      },
    ],
  },

  // 20. Sostegno Famiglie
  {
    serviceType: {
      name: 'Sostegno alle Famiglie',
      description: 'Servizi di sostegno alle famiglie',
    },
    services: [
      {
        name: 'Assegno Unico',
        code: 'ASS_UNICO_2026',
        description: 'Assegno Unico Universale',
        category: 'SOCIAL',
        basePrice: 24.4,
        requiredDocuments: [],
        faqs: [
          {
            question:
              "Cosa determina l'importo dell'Assegno Unico e Universale?",
            answer:
              "L'importo dell'Assegno Unico e Universale è determinato dalla condizione economica del nucleo familiare, calcolata in base all'Indicatore della Situazione Economica Equivalente (ISEE) valido al momento della richiesta.",
            order: 1,
            category: 'Importo',
          },
          {
            question:
              "Posso richiedere l'Assegno Unico e Universale per un figlio con disabilità di qualsiasi età?",
            answer:
              "Sì, l'Assegno Unico e Universale può essere richiesto per ogni figlio con disabilità a carico, indipendentemente dalla loro età.",
            order: 2,
            category: 'Disabilità',
          },
          {
            question: "L'Assegno Unico e Universale è soggetto a tassazione?",
            answer:
              "No, l'Assegno Unico e Universale è esente da tassazione e non è considerato come reddito imponibile.",
            order: 3,
            category: 'Fiscalità',
          },
        ],
      },
      {
        name: 'Assegno di Inclusione',
        code: 'ASS_INCL_2026',
        description: 'Assegno di inclusione',
        category: 'SOCIAL',
        basePrice: 24.4,
        requiredDocuments: [],
        faqs: [
          {
            question: "Quanti anni di residenza devo avere per chiedere l'ADI?",
            answer:
              'Bisogna essere residente in Italia per almeno cinque anni, di cui gli ultimi due anni in modo continuativo. La residenza in Italia è richiesta anche per i componenti del nucleo familiare che rientrano nei parametri della scala di equivalenza.',
            order: 1,
            category: 'Requisiti',
          },
          {
            question:
              "Se ho dato le dimissioni volontarie posso chiedere l'ADI?",
            answer:
              "Non ha diritto all'Assegno di inclusione il nucleo familiare di cui un componente risulta disoccupato a seguito di dimissioni volontarie nei 12 mesi successivi alla data delle dimissioni, fatte salve le dimissioni per giusta causa.",
            order: 2,
            category: 'Requisiti',
          },
          {
            question:
              "Per quanto tempo posso percepire l'assegno di inclusione?",
            answer:
              'Il beneficio è erogato mensilmente per un periodo continuativo non superiore a 18 mesi e può essere rinnovato, previa sospensione di un mese, per ulteriori 12 mesi.',
            order: 3,
            category: 'Durata',
          },
          {
            question: 'Quanto deve essere il valore ISEE?',
            answer:
              "ISEE in corso di validità di valore non superiore a euro 9.360; nel caso di nuclei familiari con minorenni, l'ISEE è calcolato ai sensi dell'art. 7 del DPCM n. 159 del 2013.",
            order: 4,
            category: 'ISEE',
          },
          {
            question: "Come viene erogato l'ADI?",
            answer:
              'Il contributo economico è erogato attraverso uno strumento di pagamento elettronico ricaricabile, denominato "Carta di inclusione", con prelievi di contante entro un limite mensile di 100 euro per un singolo individuo, moltiplicato per la scala di equivalenza.',
            order: 5,
            category: 'Erogazione',
          },
          {
            question:
              "Cosa devo fare se inizio un'attività lavorativa mentre percepisco l'ADI?",
            answer:
              "Entro 30 giorni dall'avvio dell'attività lavorativa, il lavoratore dovrà darne comunicazione all'INPS. L'erogazione del beneficio è sospesa fintanto che tale obbligo non è ottemperato e comunque non oltre tre mesi dall'avvio dell'attività.",
            order: 6,
            category: 'Lavoro',
          },
          {
            question: "Se inizio un'attività lavorativa perdo l'ADI?",
            answer:
              'In caso di avvio di lavoro dipendente, il reddito da lavoro percepito non concorre alla determinazione del beneficio economico entro il limite massimo di 3.000 euro lordi annui. Il reddito eccedente tale soglia concorre alla determinazione del beneficio dal mese successivo.',
            order: 7,
            category: 'Lavoro',
          },
          {
            question:
              'Entro quanto tempo vanno comunicate le variazioni riguardante le condizioni e i requisiti di accesso?',
            answer:
              "È fatto obbligo al beneficiario di comunicare ogni variazione entro quindici giorni dall'evento modificativo, a pena di decadenza. In caso di variazione del nucleo familiare, l'interessato presenta entro un mese una DSU aggiornata.",
            order: 8,
            category: 'Comunicazioni',
          },
          {
            question: 'Se il beneficio decade, posso rifare la richiesta?',
            answer:
              'Se il nucleo familiare è decaduto per mancata partecipazione alle politiche attive da parte di un componente, può fare nuova domanda solo dopo 6 mesi dalla revoca o decadenza.',
            order: 9,
            category: 'Decadenza',
          },
          {
            question:
              'Posso fare richiesta di ADI anche se sono percettore di RDC?',
            answer:
              "I percettori del Reddito di cittadinanza che rientrano nella categoria di nuclei con soggetti disabili, anziani o minori, dal 1 gennaio 2024 rientrano nel campo di applicazione dell'Assegno di inclusione.",
            order: 10,
            category: 'RDC',
          },
        ],
      },
      {
        name: 'Bonus Asilo Nido',
        code: 'BON_ASILO_2026',
        description: 'Bonus asilo nido',
        category: 'SOCIAL',
        basePrice: 24.4,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Bonus Nuovi Nati',
        code: 'BON_NATI_SOC_2026',
        description: 'Bonus per nuovi nati',
        category: 'SOCIAL',
        basePrice: 24.4,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Aggiornamento Assegno Unico',
        code: 'AGG_ASS_UNIV_2026',
        description: 'Aggiornamento ISEE assegno unico',
        category: 'SOCIAL',
        basePrice: 24.4,
        requiredDocuments: [],
        faqs: [
          {
            question:
              "Quali documenti sono necessari per effettuare l'aggiornamento dell'Assegno Unico?",
            answer:
              "I documenti richiesti possono variare in base al tipo di modifica da apportare. In genere, potrebbero essere richiesti documenti comprovanti le nuove informazioni, come la documentazione relativa al cambio dell'IBAN o al raggiungimento della maggiore età di un figlio.",
            order: 1,
            category: 'Documenti',
          },
          {
            question:
              "L'aggiornamento dei dati influisce sull'importo dell'Assegno Unico?",
            answer:
              "L'aggiornamento dei dati può influire sull'importo dell'Assegno Unico, soprattutto se riguarda cambiamenti significativi nella situazione familiare o nella composizione del nucleo familiare. In alcuni casi, potrebbe essere necessario rivalutare l'ISEE.",
            order: 2,
            category: 'Importo',
          },
          {
            question:
              "Cosa succede se non aggiorno i dati dell'Assegno Unico in caso di cambiamenti?",
            answer:
              "È importante aggiornare tempestivamente i dati in caso di cambiamenti nella situazione familiare. Ritardare o omettere l'aggiornamento potrebbe comportare un'errata erogazione dell'assegno o la perdita di eventuali benefici.",
            order: 3,
            category: 'Obblighi',
          },
        ],
      },
      {
        name: 'PAD Assegno di Inclusione',
        code: 'PAD_ASS_INCL_2026',
        description: 'PAD per assegno di inclusione',
        category: 'SOCIAL',
        basePrice: 24.4,
        requiredDocuments: [],
        faqs: [
          {
            question: "Cos'è il PAD ADI?",
            answer:
              "Il PAD ADI, acronimo di Patto di Attivazione Digitale per l'Assegno di Inclusione, è un accordo che i beneficiari dell'ADI stipulano con i servizi per l'impiego. Obbligatorio per i maggiorenni in grado di lavorare, viene sottoscritto online tramite la piattaforma SIISL. L'obiettivo è definire un percorso personalizzato di inserimento lavorativo e inclusione sociale.",
            order: 1,
            category: 'Definizione',
          },
          {
            question: 'Come faccio ad attivare il PAD ADI online?',
            answer:
              "L'attivazione del PAD ADI avviene online tramite il SIISL. Se hai bisogno di supporto nella compilazione, puoi rivolgerti al team di SmartCAF, che ti guiderà nella procedura e ti fornirà assistenza personalizzata. Dopo aver inviato il PAD, sarai contattato dai servizi per l'impiego per un colloquio di orientamento.",
            order: 2,
            category: 'Procedura',
          },
          {
            question: 'PAD ADI: quali sono i vantaggi?',
            answer:
              "Aderire al PAD ADI offre diversi vantaggi: servizi personalizzati di supporto alla ricerca di lavoro, creazione del curriculum vitae, partecipazione a corsi di formazione professionale, tirocini, orientamento al lavoro e possibilità di accedere a incentivi per l'assunzione.",
            order: 3,
            category: 'Vantaggi',
          },
          {
            question: 'Cosa succede se non rispetto il PAD ADI?',
            answer:
              "Il mancato rispetto degli impegni previsti dal PAD ADI può portare a conseguenze come la riduzione o la decadenza dell'Assegno di Inclusione. È fondamentale partecipare attivamente al percorso di inserimento lavorativo e sociale.",
            order: 4,
            category: 'Obblighi',
          },
        ],
      },
    ],
  },

  // 21. Certificati
  {
    serviceType: {
      name: 'Certificati',
      description: 'Servizi di certificati',
    },
    services: [
      {
        name: 'Certificati Anagrafici (Per Ciascun)',
        code: 'CERT_ANAG_2026',
        description:
          'Certificati anagrafici: Residenza, Stato di Famiglia, Stato Civile. Prezzo per ciascun certificato richiesto.',
        category: 'ADMINISTRATIVE',
        basePrice: 12.2,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Certificati Penali (Per Ciascun)',
        code: 'CERT_PEN_2026',
        description:
          'Certificati penali: Casellario Giudiziale (Penale), Casellario dei Carichi Pendenti. Prezzo per ciascun certificato richiesto.',
        category: 'ADMINISTRATIVE',
        basePrice: 70,
        requiredDocuments: [],
        faqs: [],
      },
    ],
  },
];

export async function seedAllServices() {
  try {
    console.log(
      '\n✨ Inizio Seeding - Tutti i Tipi di Servizio, Servizi e FAQs...\n',
    );

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceTypeRepo = AppDataSource.getRepository(ServiceType);
    const serviceRepo = AppDataSource.getRepository(Service);
    const faqRepo = AppDataSource.getRepository(Faq);

    let serviceTypesCount = 0;
    let servicesCount = 0;
    let faqsCount = 0;

    for (const data of SERVICES_DATA) {
      let serviceType = await serviceTypeRepo.findOne({
        where: { name: data.serviceType.name },
      });

      if (!serviceType) {
        serviceType = serviceTypeRepo.create(data.serviceType);
        await serviceTypeRepo.save(serviceType);
        console.log(`✅ Tipo di Servizio: ${data.serviceType.name}`);
        serviceTypesCount++;
      }

      for (const serviceData of data.services) {
        let service = await serviceRepo.findOne({
          where: { code: serviceData.code },
        });

        if (!service) {
          const formSchema = buildGenericFormSchema(
            serviceData.name,
            serviceData.description,
            serviceData.code,
          );

          service = serviceRepo.create({
            name: serviceData.name,
            code: serviceData.code,
            description: serviceData.description,
            category: serviceData.category,
            basePrice: serviceData.basePrice,
            serviceTypeId: serviceType.id,
            requiredDocuments: serviceData.requiredDocuments as any,
            formSchema: formSchema as any,
          });
          await serviceRepo.save(service);
          console.log(`   ✅ Servizio: ${serviceData.name}`);
          servicesCount++;
        } else {
          const formSchema = buildGenericFormSchema(
            serviceData.name,
            serviceData.description,
            serviceData.code,
          );

          service.name = serviceData.name;
          service.description = serviceData.description;
          service.category = serviceData.category;
          service.basePrice = serviceData.basePrice;
          service.requiredDocuments = serviceData.requiredDocuments as any;
          service.serviceTypeId = serviceType.id;
          service.formSchema = formSchema as any;
          await serviceRepo.save(service);
        }

        if (serviceData.faqs && serviceData.faqs.length > 0) {
          for (const faqData of serviceData.faqs) {
            const existingFaq = await faqRepo.findOne({
              where: {
                serviceId: service.id,
                question: faqData.question,
              },
            });

            if (!existingFaq) {
              const faq = faqRepo.create({
                question: faqData.question,
                answer: faqData.answer,
                order: faqData.order,
                category: faqData.category,
                isActive: true,
                serviceId: service.id,
              });
              await faqRepo.save(faq);
              faqsCount++;
            }
          }
        }
      }
    }

    console.log(
      '\n✨ Seeding completato con successo! Tutti i dati sono stati caricati.\n',
    );
    console.log('📊 Riepilogo Finale:');
    console.log(`   🔹 Tipi di Servizio creati: ${serviceTypesCount}`);
    console.log(`   🔹 Servizi creati: ${servicesCount}`);
    console.log(`   🔹 FAQs create: ${faqsCount}`);
    console.log(`   🌍 Lingua: Italiano 🇮🇹`);
  } catch (error) {
    console.error('❌ Errore durante il seeding:', error);
    throw error;
  }
}

if (require.main === module) {
  seedAllServices()
    .then(() => {
      console.log('\n🎉 Seeding completato con successo!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding fallito:', error);
      process.exit(1);
    });
}
