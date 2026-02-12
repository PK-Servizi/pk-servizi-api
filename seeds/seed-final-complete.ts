import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';
import { ServiceType } from '../src/modules/service-types/entities/service-type.entity';
import { Faq } from '../src/modules/faqs/entities/faq.entity';

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
          '01. Identification Document: ID card (front and back), Driver\'s License (front and back), or Passport of the declarant',
          '02. Tax Code: Tax code (Codice Fiscale) of the declarant',
          '03. Family Tax Codes: Tax codes for all members of the household',
          '04. Rent Agreement: Rental contract (Contratto d\'affitto)',
          '05. Mortgage: Residual mortgage capital as of 31/12/2024',
          '06. Bank Accounts: Accounting balance and average balance (giacenza media) as of 31/12/2024 for current accounts of all household members',
          '07. Savings/Postal Books: Accounting balance and average balance as of 31/12/2024 for deposit accounts or postal books of all household members',
          '08. Investments: Euro value as of 31/12/2024 for funds, securities, and investments',
          '09. Prepaid Cards: Accounting balance and average balance for current accounts and prepaid cards with an IBAN held by the household',
          '10. Deposit Accounts: Accounting balance and average balance for deposit accounts held by the household',
          '11. Vehicles: License plate numbers for cars owned by household members',
          '12. Disability Certification: For disabled or invalid individuals, the latest certification stating the condition (medium disability, severe disability, or non-self-sufficiency)'
        ],
        faqs: [
          {
            question: 'Entro quanto viene elaborata la mia richiesta?',
            answer:
              'Il nostro team elabora la DSU nello stesso giorno in cui viene effettuata la richiesta (dal lunedì al sabato, dalle 09:00 alle 20:00). La consegna dell\'attestazione avviene entro 4 giorni lavorativi.',
            order: 1,
            category: 'Tempi',
          },
          {
            question: 'Quando scade l\'attestazione ISEE?',
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
            question: 'Nel 2025 ho venduto la casa e ora ne ho acquistata un\'altra',
            answer:
              "Devi inserire i dati catastali della casa precedente, insieme all'importo residuo del mutuo al 31 dicembre 2025 relativo a quell'alloggio.",
            order: 6,
            category: 'Immobili',
          },
          {
            question: 'Nel periodo ho cambiato auto. Quale targa devo inserire?',
            answer: "Devi inserire la targa dell'auto attualmente in uso.",
            order: 7,
            category: 'Veicoli',
          },
          {
            question: 'Nel 2025 vivevo a un indirizzo diverso da quello attuale',
            answer:
              'Devi indicare l\'indirizzo attuale in cui risiedi al momento della compilazione.',
            order: 8,
            category: 'Residenza',
          },
        ],
      },
      {
        name: 'ISEE Universitario 2026',
        code: 'ISEE_UNI_2026',
        description:
          'L\'ISEE Universitario è un indicatore determinato da uno specifico tipo di DSU richiesto dello studente per il diritto allo studio',
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
          '13. In case of the presence of an unmarried and non-cohabiting parent: Tax Code of the Unmarried and Non-Cohabiting Parent'
        ],
        faqs: [
          {
            question: 'Chi deve dichiarare l\'ISEE universitario?',
            answer:
              'Potrebbe essere chiunque del nucleo familiare, non necessariamente il capofamiglia',
            order: 1,
            category: 'Dichiarazione',
          },
          {
            question: 'Quali sono le condizioni per essere considerato studente indipendente?',
            answer:
              'Ha risieduto fuori dal domicilio familiare per almeno due anni prima di presentare la domanda di immatricolazione per la prima volta',
            order: 2,
            category: 'Studenti',
          },
          {
            question: 'Quanto tempo ci vuole per elaborare la DSU?',
            answer: 'La DSU viene elaborata entro 6 ore dalla richiesta.',
            order: 3,
            category: 'Tempi',
          },
          {
            question: 'Per quanto tempo è valido il certificato ISEE Universitario?',
            answer:
              "Il certificato ISEE Universitario è valido per l'anno accademico in corso perché scade il 31 dicembre di quell'anno.",
            order: 4,
            category: 'Validità',
          },
          {
            question: 'Posso utilizzare il certificato ISEE Universitario per richiedere altri benefici?',
            answer:
              'Sì, il certificato può essere utilizzato per richiedere benefici o agevolazioni secondo le istruzioni della tua università.',
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
          '10. Nominal value of government bonds (e.g. BOT, CCT), bonds, certificates of deposit, savings bonds and similar'
        ],
        faqs: [
          {
            question: 'Chi può richiedere l\'ISEE Socio-Sanitario?',
            answer:
              'Beneficiario adulto con disabilità o non autosufficiente. Il dichiarante può essere un altro membro della famiglia',
            order: 1,
            category: 'Richiedenti',
          },
          {
            question: 'Cosa significa nucleo familiare ristretto?',
            answer:
              'Il beneficiario può dichiarare un nucleo familiare più piccolo, costituito dal beneficiario, dal coniuge, da figli minori e da figli adulti dependenti',
            order: 2,
            category: 'Famiglia',
          },
          {
            question: 'Quali sono i tempi di elaborazione?',
            answer:
              'La DSU viene elaborata entro 6 ore, il certificato ISEE è pronto entro 3 giorni',
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
          '11. Valid identity document of the unmarried and non-cohabiting parent'
        ],
        faqs: [
          {
            question: 'Qual è la differenza tra ISEE e ISEE per Minorenni?',
            answer:
              "L'ISEE per Minorenni è specificamente progettato per famiglie con figli minori e fornisce metodi di calcolo diversi basati sulla situazione familiare",
            order: 1,
            category: 'Differenze',
          },
          {
            question: 'Quale genitore deve richiedere l\'ISEE?',
            answer:
              "Nel caso di genitori non coniugati e non conviventi, l'ISEE per Minorenni deve essere richiesto dal genitore con cui convivono abitualmente i figli",
            order: 2,
            category: 'Procedura',
          },
          {
            question: 'Come si può abbassare l\'ISEE?',
            answer:
              'Cambiare residenza, rivedere i valori della proprietà, evitare conti congiunti, o richiedere un ISEE corrente',
            order: 3,
            category: 'Riduzione',
          },
          {
            question: 'Sono una madre con due figli da marito divorziato e non convivente. Devo includere il padre?',
            answer:
              'No, devi includere solo la madre e due figli. Il padre va incluso in Sezione D fornendo nome e codice fiscale.',
            order: 4,
            category: 'Procedura',
          },
          {
            question: 'Posso preparare ISEE Minorenni se il figlio non è riconosciuto dal padre?',
            answer:
              'Solo se il figlio è stato riconosciuto dal padre. Se non riconosciuto, devi usare ISEE standard.',
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
        basePrice: 0,
        requiredDocuments: [
          '01. Documentation certifying the change in employment/income situation due to job loss or suspension: Letter of dismissal, copy of resignation, unrenewed fixed-term contract, wage supplementation documentation, mobility allowance receipts',
          '02. Documentation certifying the change in employment/income situation due to a reduction in work activity: Recent pay stubs demonstrating the reduction in hours or salary, Tax returns or accounting documentation certifying a decrease in income greater than 25%',
          '03. Documentation certifying the change in financial position: Bank and postal account statements updated as of December 31 of the year preceding the year in which the current ISEE was submitted'
        ],
        faqs: [
          {
            question: "Cos'è l'ISEE Corrente e a cosa serve?",
            answer:
              "È un aggiornamento dell'ISEE ordinario che tiene conto della situazione finanziaria più recente. Aiuta ad accedere a bonus e benefici che richiedono un indicatore più accurato",
            order: 1,
            category: 'Definizione',
          },
          {
            question: 'Quando posso richiedere l\'ISEE Corrente?',
            answer:
              'Quando si verificano eventi specifici come riduzione del reddito familiare superiore al 25%, perdita del lavoro, o cambiamenti significativi nel nucleo familiare',
            order: 2,
            category: 'Quando',
          },
          {
            question: 'Quali documenti servono?',
            answer:
              "L'ISEE ordinario che già possiedi. Documenti che certificano il cambio: lettera di licenziamento, buste paga, estratti bancari aggiornati, certificati di cambio nel nucleo familiare",
            order: 3,
            category: 'Documenti',
          },
          {
            question: 'L\'ISEE Corrente è obbligatorio?',
            answer:
              "È opzionale ma altamente consigliato se la situazione finanziaria è peggiorata rispetto all'ISEE ordinario",
            order: 4,
            category: 'Obbligatorietà',
          },
          {
            question: 'Per quanto tempo è valido l\'ISEE Corrente?',
            answer:
              'Generalmente è valido per sei mesi dalla data di presentazione della DSU, salvo cambiamenti significativi che richiedano aggiornamenti',
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
      description: 'Servizi per la disoccupazione e prestazioni economiche per lavoratori disoccupati',
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
          '01. Documento di riconoscimento (Carta d\'identità italiana, carta d\'identità di un paese comunitario, patente, passaporto)',
          '02. Codice Fiscale o Tessera Sanitaria',
          '03. Permesso di soggiorno del richiedente (se extracomunitario)',
          '04. Ultima Busta Paga in possesso',
          '05. Lettera di licenziamento - Contratto scaduto'
        ],
        faqs: [
          {
            question: 'Entro quanto viene elaborata la mia richiesta?',
            answer: 'La tua richiesta di NASpI viene elaborata entro 6 ore dalla presentazione.',
            order: 1,
            category: 'Tempi',
          },
          {
            question: 'Dopo la cessazione del rapporto di lavoro, entro quanto tempo posso richiedere la NASPI?',
            answer: 'Puoi richiedere la NASpI entro 68 giorni dalla data di cessazione del rapporto di lavoro.',
            order: 2,
            category: 'Scadenze',
          },
          {
            question: 'Qual è l\'importo dell\'indennità NASpI?',
            answer:
              'L\'importo corrisponde al 75% della retribuzione media mensile soggetta a contribuzione degli ultimi quattro anni, fino a un massimo di €1.470,99 lordi. A partire dal primo giorno del sesto mese di fruizione, la NASpI si riduce del 3% ogni mese.',
            order: 3,
            category: 'Importo',
          },
          {
            question: 'Percepisco la disoccupazione e ho trovato un nuovo lavoro, cosa devo fare?',
            answer:
              'Devi richiedere una NASpI-Com per comunicare all\'INPS i termini del nuovo contratto, affinché l\'indennità venga sospesa.',
            order: 4,
            category: 'Variazioni',
          },
          {
            question: 'Percepisco la disoccupazione e sono incinta, cosa devo fare?',
            answer:
              'Devi richiedere una NASpI-Com per sospendere l\'indennità nel periodo previsto di maternità obbligatoria.',
            order: 5,
            category: 'Variazioni',
          },
          {
            question: 'Percepisco la pensione d\'invalidità, posso percepire anche la disoccupazione?',
            answer: 'No, le due indennità non sono cumulabili.',
            order: 6,
            category: 'Cumulabilità',
          },
          {
            question: 'L\'indennità di disoccupazione tiene conto solo dell\'ultimo lavoro?',
            answer: 'L\'INPS considera i periodi di lavoro degli ultimi 4 anni.',
            order: 7,
            category: 'Calcolo',
          },
          {
            question: 'Cos\'è la NASpI e a chi spetta?',
            answer:
              'La NASpI è un\'indennità di disoccupazione erogata dall\'INPS ai lavoratori dipendenti che hanno perso involontariamente il lavoro. È necessario aver maturato almeno 13 settimane di contributi negli ultimi 4 anni e aver lavorato almeno 30 giorni negli ultimi 12 mesi.',
            order: 8,
            category: 'Definizione',
          },
          {
            question: 'Come si calcola l\'importo della NASpI?',
            answer:
              'L\'importo della NASpI si calcola in base alla retribuzione imponibile ai fini previdenziali degli ultimi 4 anni. Esiste una formula specifica e delle fasce di retribuzione che determinano l\'importo.',
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
              'Il diritto alla NASpI si perde trovando un nuovo lavoro a tempo indeterminato, raggiungendo i requisiti per la pensione, superando i limiti di reddito da lavoro autonomo, rifiutando un\'offerta di lavoro congrua, o non partecipando alle iniziative di politica attiva del lavoro.',
            order: 11,
            category: 'Perdita Diritto',
          },
          {
            question: 'Come e quando presentare la domanda di NASpI?',
            answer:
              'La domanda di NASpI va presentata all\'INPS esclusivamente online, entro 68 giorni dalla data di cessazione del rapporto di lavoro.',
            order: 12,
            category: 'Procedura',
          },
          {
            question: 'Posso lavorare part-time mentre percepisco la NASpI?',
            answer:
              'Sì, è possibile lavorare part-time con un contratto di lavoro subordinato mentre si percepisce la NASpI. Bisogna però comunicare all\'INPS il reddito previsto dal nuovo lavoro, che comporterà una riduzione dell\'importo della NASpI.',
            order: 13,
            category: 'Occupazione',
          },
        ],
      },
      {
        name: 'Disoccupazione Agricola',
        code: 'DAGRN_2026',
        description:
          'L\'indennità di disoccupazione agricola è una prestazione economica per i lavoratori agricoli dipendenti',
        category: 'EMPLOYMENT',
        basePrice: 0,
        requiredDocuments: [
          '01. Carta d\'identità richiedente',
          '02. Codice fiscale/Tessera Sanitaria del richiedente',
          '03. Iban richiedente'
        ],
        faqs: [],
      },
      {
        name: 'Anticipo NASPI',
        code: 'ANTNAS_2026',
        description:
          'La NASpI anticipata consiste nella liquidazione anticipata in un\'unica soluzione dell\'importo complessivo della NASpI',
        category: 'EMPLOYMENT',
        basePrice: 0,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice Fiscale',
          '03. Eventuale permesso di soggiorno del richiedente (se extracomunitario)',
          '04. Certificato di attribuzione P.IVA',
          '05. Certificato che attesta l\'inizio attività (Visura camerale attiva, iscrizione gestione separata inps ecc)'
        ],
        faqs: [],
      },
      {
        name: 'DID - Dichiarazione Immediata Disponibilità',
        code: 'DID_2026',
        description:
          'La Did online - Dichiarazione di immediata disponibilità al lavoro, è la dichiarazione che determina formalmente l\'inizio dello stato di disoccupazione di una persona',
        category: 'EMPLOYMENT',
        basePrice: 24.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente'
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
          '01. Carta d\'identità',
          '02. Codice fiscale',
          '03. CV (Curriculum Vitae)'
        ],
        faqs: [
          {
            question: 'Patto di Attivazione Digitale (PAD): cos\'è?',
            answer:
              'Il Patto di Attivazione Digitale (PAD) è un accordo che i beneficiari di NASpI e DIS-COLL devono sottoscrivere sulla piattaforma SIISL. Ci si impegna a partecipare attivamente a percorsi di ricerca di lavoro, formazione e reinserimento professionale',
            order: 1,
            category: 'Definizione',
          },
          {
            question: 'Il PAD è obbligatorio?',
            answer:
              'Sì, il PAD è obbligatorio per chi percepisce NASpI e DIS-COLL. La mancata sottoscrizione può comportare sospensione o decadenza del beneficio',
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
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente',
          '03. Eventuale permesso di soggiorno del richiedente (se extracomunitario)',
          '04. Documento che attesta l\'inizio di attività lavorativa (contratto di lavoro - certificato di attività autonoma)'
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
        basePrice: 34.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Integrazione 730',
        code: '730INT_2026',
        description: 'Integrazione della dichiarazione dei redditi mediante modello 730',
        category: 'TAX',
        basePrice: 12.2,
        requiredDocuments: [],
        faqs: [],
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
          '01. Carta d\'identità',
          '02. Codice fiscale/Tessera Sanitaria',
          '03. Ultima Busta Paga/Modello Unilav/Contratto di lavoro (serve: il codice fiscale e la pec dell\'azienda)',
          '04. Ultimo giorno lavorativo, compresi i giorni di preavviso'
        ],
        faqs: [
          {
            question: 'Cosa succede se non rispetto il periodo di preavviso?',
            answer:
              'Nel caso in cui il periodo di preavviso non venga rispettato, il lavoratore sarà considerato inadempiente e l\'azienda potrà detrarre dalla sua ultima busta paga l\'importo corrispondente ai giorni di preavviso mancanti.',
            order: 1,
            category: 'Preavviso',
          },
          {
            question: 'Entro quanto viene elaborata la mia richiesta?',
            answer: 'Entro 2 ore dall\'invio.',
            order: 2,
            category: 'Tempi',
          },
          {
            question: 'Se mi dimetto avrò diritto alla NASpI?',
            answer:
              'Se decidi di dimetterti volontariamente perderai il diritto alla NASpI, a meno che le dimissioni siano giustificate.',
            order: 3,
            category: 'NASpI',
          },
          {
            question: 'Come dare le dimissioni senza perdere il diritto alla NASpI?',
            answer:
              'Comunica all\'INPS che le dimissioni sono motivate da una "giusta causa".',
            order: 4,
            category: 'NASpI',
          },
          {
            question: 'Cosa succede alle ferie non godute?',
            answer:
              'Le ferie non godute devono essere retribuite dal datore di lavoro e possono essere convertite in denaro.',
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
          '01. Carta d\'identità richiedente',
          '02. Codice Fiscale del richiedente',
          '03. Ultima Busta Paga/Modello Unilav/Contratto di lavoro (serve: il codice fiscale e la pec dell\'azienda)',
          '04. Ultimo giorno lavorativo, compresi i giorni di preavviso'
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
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale lavoratore',
          '03. Ricevuta delle dimissioni effettuate'
        ],
        faqs: [
          {
            question: 'Quando è possibile revocare le dimissioni?',
            answer:
              'La normativa consente al dipendente di revocare le dimissioni volontarie entro 7 giorni successivi alla comunicazione. Decorso il termine di 7 giorni, per lo stesso rapporto di lavoro sarà possibile inviare nuove dimissioni, non revocabili.',
            order: 1,
            category: 'Termini',
          },
          {
            question: 'Quante volte si possono revocare le dimissioni?',
            answer:
              'Il lavoratore ha sempre la possibilità di revocare le dimissioni entro 7 giorni successivi alla comunicazione. Decorso il termine di 7 giorni, per lo stesso rapporto di lavoro sarà possibile inviare nuove dimissioni, non revocabili.',
            order: 2,
            category: 'Limitazioni',
          },
          {
            question: 'Cosa succede se il lavoratore non convalida le dimissioni?',
            answer:
              'Le dimissioni rassegnate senza rispettare la procedura telematica sono inefficaci e non potranno comportare l\'interruzione del rapporto di lavoro.',
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
      description: 'Rateizzazione dei debiti presso l\'Agenzia delle Entrate',
    },
    services: [
      {
        name: 'Rateizzazione Cartelle Agenzia delle Entrate',
        code: 'RATE_GEN_2026',
        description:
          'Il servizio di rateizzazione dei debiti dell\'Agenzia delle Entrate offre ai contribuenti la possibilità di diluire il pagamento dei loro debiti fiscali in comode rate mensili',
        category: 'TAX',
        basePrice: 59.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente',
          '03. Cartelle da rateizzare'
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
      description: 'Estratto conto previdenziale dall\'INPS',
    },
    services: [
      {
        name: 'Estratto Conto Previdenziale',
        code: 'ESTCONT_PREV_2026',
        description:
          'L\'Estratto conto contributivo è un documento che elenca tutti i contributi effettuati all\'INPS in favore del lavoratore',
        category: 'PENSION',
        basePrice: 24.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente'
        ],
        faqs: [],
      },
    ],
  },

  // 8. Comunicazione INPS
  {
    serviceType: {
      name: 'Comunicazione INPS',
      description: 'Comunicazione con l\'INPS',
    },
    services: [
      {
        name: 'Comunicazione INPS',
        code: 'COMM_INPS_2026',
        description:
          'Il servizio Comunicazione INPS consente di entrare in contatto con l\'INPS per sollecitare la risoluzione di problematiche riguardanti richieste che risultano ferme o in sospeso',
        category: 'ADMINISTRATIVE',
        basePrice: 29.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente'
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
        name: 'Aggiornamento Permesso di Soggiorno',
        code: 'AGG_PERM_2026',
        description: 'Aggiornamento del permesso di soggiorno per cambio dati',
        category: 'IMMIGRATION',
        basePrice: 44.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Rilascio Carta/Permesso di Soggiorno',
        code: 'RILASC_CART_2026',
        description:
          'Rilascio della carta permesso di soggiorno per soggiornanti di lungo periodo',
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
          '01. Carta d\'identità italiana del richiedente',
          '02. Codice fiscale del richiedente',
          '03. Passaporto del richiedente',
          '04. Permesso di soggiorno del richiedente',
          '05. Certificato di lingua italiana livello B1 se non in possesso di titolo di studio italiano o di permesso di soggiorno per soggiornanti di lungo periodo',
          '06. Atto di nascita tradotto e legalizzato dall\'ambasciata italiana nel paese di origine/apostillato',
          '07. Certificato penale tradotto e legalizzato dall\'ambasciata italiana nel paese di origine/apostillato',
          '08. CU, modello redditi o modello 730 degli ultimi 3 anni',
          '09. Stato di famiglia rilasciato dal comune di residenza',
          '10. Certificato di residenza storico/Autodichiarazione di residenza storica',
          '11. Copia del versamento del contributo di € 250,00',
          '12. Marca da bollo da € 16,00'
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
          '01. Carta d\'identità fronte e retro del richiedente',
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
          '13. Codice fiscale/tessera sanitaria del coniuge'
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
          '12. Contratto di locazione o contratto di comodato gratuito o atto di proprietà dell\'alloggio',
          '13. Idoneità abitativa e certificazione igienico-sanitaria',
          '14. Nel caso il richiedente sia ospitato: dichiarazione autenticata del titolare dell\'alloggio con consenso al ricongiungimento',
          '15. Modello S2 - Dichiarazione di consenso alloggio per i familiari ricongiunti',
          '16. Modello S1 - Dichiarazione di assenso del proprietario dell\'alloggio all\'ospitalità di un minore di 14 anni'
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
        name: 'Test Lingua Italiana A2/B1',
        code: 'TEST_LINGUA_2026',
        description: 'Test di conoscenza della lingua italiana per stranieri',
        category: 'IMMIGRATION',
        basePrice: 19.99,
        requiredDocuments: [
          '01. Carta d\'identità del richiedente',
          '02. Codice Fiscale del richiedente',
          '03. Permesso di soggiorno del richiedente',
          '04. Passaporto del richiedente'
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
          '03. Dati personali di colf/badante (nome, cognome, codice fiscale, dati anagrafici)'
        ],
        faqs: [],
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
          '03. Registro presenze o giornaliero con ore lavorate nel trimestre'
        ],
        faqs: [],
      },
      {
        name: 'Assunzione Colf e Badanti',
        code: 'ASSU_COLF_2026',
        description: 'Comunicazione di assunzione all\'INPS',
        category: 'HR',
        basePrice: 49.99,
        requiredDocuments: [
          '01. Documento di riconoscimento datore di lavoro (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale datore di lavoro',
          '03. Eventuale permesso di soggiorno del datore di lavoro',
          '04. Documento di riconoscimento lavoratore (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '05. Codice fiscale lavoratore',
          '06. Eventuale permesso di soggiorno del lavoratore'
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
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente'
        ],
        faqs: [],
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
          '05. Retribuzione e modalita\' di pagamento',
          '06. Durata del contratto (determinato o indeterminato)'
        ],
        faqs: [],
      },
      {
        name: 'Cessazione Colf e Badanti',
        code: 'CESS_COLF_2026',
        description: 'Cessazione del rapporto di lavoro domestico',
        category: 'HR',
        basePrice: 36.6,
        requiredDocuments: [
          '01. Documento di riconoscimento del datore di lavoro (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale del datore di lavoro',
          '03. Eventuale permesso di soggiorno del datore di lavoro',
          '04. Codice fiscale del lavoratore',
          '05. Comunicazione di assunzione INPS'
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
          '01. Documento di riconoscimento datore di lavoro (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale datore di lavoro',
          '03. Eventuale permesso di soggiorno del datore di lavoro',
          '04. Documento di riconoscimento lavoratore (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '05. Codice fiscale lavoratore',
          '06. Eventuale permesso di soggiorno del lavoratore',
          '07. Comunicazione di assunzione INPS'
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
          '01. Carta d\'identità dichiarante',
          '02. Codice Fiscale dichiarante',
          '03. Permesso/Carta di soggiorno dichiarante',
          '04. Codice fiscale neonato',
          '05. Attestazione ISEE non superiore a euro 17.416,66'
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
          '01. Documento d\'identita\' valido del genitore richiedente',
          '02. Codice fiscale del genitore richiedente e del bambino/i',
          '03. Attestazione ISEE minorenni in corso di validita\' (non superiore a 40.000 euro)',
          '04. Permesso di soggiorno valido (per cittadini non UE)',
          '05. IBAN del genitore richiedente'
        ],
        faqs: [],
      },
      {
        name: 'Congedo Parentale Dipendenti',
        code: 'CONG_PAR_DIP_2026',
        description: 'Congedo parentale per dipendenti',
        category: 'HR',
        basePrice: 29.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente',
          '03. Codice fiscale altro genitore se presente',
          '04. Codice fiscale del minore',
          '05. Buste paga'
        ],
        faqs: [],
      },
      {
        name: 'Maternità Obbligatoria Post Parto',
        code: 'MATERN_OBBL_2026',
        description: 'Maternità obbligatoria dopo il parto',
        category: 'HR',
        basePrice: 29.99,
        requiredDocuments: ['01. Codice fiscale del neonato/dei neonati'],
        faqs: [],
      },
      {
        name: 'Indennità Maternità Obbligatoria',
        code: 'INDENNI_MATERN_2026',
        description: 'Indennità di maternità obbligatoria per dipendenti',
        category: 'HR',
        basePrice: 29.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente',
          '03. Eventuale permesso di soggiorno',
          '04. Certificato di gravidanza telematico con data presunta del parto',
          '05. Eventuale certificato medico o autodichiarazione del datore di lavoro per lavorare fino all\'inizio maternita\''
        ],
        faqs: [],
      },
      {
        name: 'Maternità Anticipata Dipendenti',
        code: 'MATERN_ANT_2026',
        description: 'Maternità anticipata per dipendenti',
        category: 'HR',
        basePrice: 29.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente',
          '03. Eventuale permesso di soggiorno',
          '04. Certificato di gravidanza telematico con data presunta del parto',
          '05. Certificato medico ASL o direzione territoriale competente con gravi complicanze',
          '06. Certificato di interdizione anticipata per condizioni di lavoro pesante o pericoloso'
        ],
        faqs: [],
      },
      {
        name: 'Congedo Parentale Gestione Separata',
        code: 'CONG_PAR_SEP_2026',
        description: 'Congedo parentale gestione separata',
        category: 'HR',
        basePrice: 29.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente',
          '03. Codice fiscale altro genitore se presente',
          '04. Codice fiscale del minore'
        ],
        faqs: [],
      },
      {
        name: 'Congedo Parentale Autonomi',
        code: 'CONG_PAR_AUT_2026',
        description: 'Congedo parentale per autonomi',
        category: 'HR',
        basePrice: 29.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente',
          '03. Codice fiscale altro genitore se presente',
          '04. Codice fiscale del minore'
        ],
        faqs: [],
      },
    ],
  },

  // 15. Invalidità
  {
    serviceType: {
      name: 'Invalidità',
      description: 'Servizi per invalidità',
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
      {
        name: 'Permessi 104/92 per Assistenza Familiari',
        code: 'PERM_104_2026',
        description: 'Permessi per assistenza familiari disabili',
        category: 'HR',
        basePrice: 29.99,
        requiredDocuments: [
          '01. Documento di riconoscimento del familiare disabile (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale del familiare disabile',
          '03. Verbale riconoscimento Handicap',
          '04. Busta paga dell\'attuale datore di lavoro'
        ],
        faqs: [],
      },
    ],
  },

  // 16. Pensione
  {
    serviceType: {
      name: 'Pensione',
      description: 'Servizi relativi a pensioni',
    },
    services: [
      {
        name: 'Estratto Conto Certificato e Calcolo Pensione',
        code: 'ESTRAT_PENS_2026',
        description: 'Estratto conto certificato e calcolo della pensione',
        category: 'PENSION',
        basePrice: 62,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente'
        ],
        faqs: [],
      },
      {
        name: 'Assegno Sociale',
        code: 'ASS_SOC_2026',
        description: 'Assegno sociale INPS',
        category: 'PENSION',
        basePrice: 0,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Pensione Indiretta',
        code: 'PENS_INDIR_2026',
        description: 'Pensione ai superstiti',
        category: 'PENSION',
        basePrice: 0,
        requiredDocuments: [
          '01. Carta d\'identità richiedente',
          '02. Codice fiscale/Tessera Sanitaria del richiedente',
          '03. Carta d\'identità della persona deceduta',
          '04. Codice fiscale/Tessera Sanitaria della persona deceduta',
          '05. Codice IBAN del titolare (dichiarante) della pensione',
          '06. Codice fiscale/Tessera Sanitaria dei familiari che hanno diritto alla pensione'
        ],
        faqs: [],
      },
      {
        name: 'Ricostituzione Reddituale',
        code: 'RICOST_REDD_2026',
        description: 'Ricostituzione reddituale INPS',
        category: 'PENSION',
        basePrice: 29.99,
        requiredDocuments: [
          '01. Documento d\'identità valido del richiedente (fronte e retro)',
          '02. Codice fiscale del richiedente',
          '03. Codice fiscale del coniuge e dei familiari a carico (se rilevante)',
          '04. Eventuale lettera ricevuta da INPS'
        ],
        faqs: [],
      },
    ],
  },

  // 17. Dichiarazione Redditi
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
        basePrice: 129.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente',
          '03. CU 2023 redditi 2022',
          '04. Codice fiscale dei familiari a carico',
          '05. Spese sanitarie',
          '06. Contratto di locazione',
          '07. Interessi passivi su mutui (contratto compravendita, contratto mutuo, oneri accessori, quietanze interessi, fatture ristrutturazione/costruzione)',
          '08. Spese funebri',
          '09. Spese frequenza di scuole dell\'infanzia, del primo ciclo di istruzione e della scuola secondaria di secondo grado',
          '10. Spese frequenza corsi istruzione universitaria presso università statali e non statali',
          '11. Spese per addetti all\'assistenza personale',
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
          '22. Spese 50% per l\'arredo immobili (comprese giovani coppie) e IVA per acquisto abitazione A o B; spese 55% - 65% per risparmio energetico'
        ],
        faqs: [],
      },
      {
        name: 'Modello Redditi P.IVA Forfettaria',
        code: 'MOD_REDD_PFIVA_2026',
        description: 'Dichiarazione redditi per regime forfettario',
        category: 'TAX',
        basePrice: 50,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente',
          '03. CU 2023 redditi 2022',
          '04. Eventuale certificato di attribuzione P.IVA',
          '05. Eventuali fatture emesse nell\'anno 2022',
          '06. Codice fiscale dei familiari a carico',
          '07. Spese sanitarie',
          '08. Contratto di locazione',
          '09. Interessi passivi su mutui (contratto compravendita, contratto mutuo, oneri accessori, quietanze interessi, fatture ristrutturazione/costruzione)',
          '10. Spese funebri',
          '11. Spese frequenza di scuole dell\'infanzia, del primo ciclo di istruzione e della scuola secondaria di secondo grado',
          '12. Spese frequenza corsi istruzione universitaria presso università statali e non statali',
          '13. Spese per addetti all\'assistenza personale',
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
          '24. Spese 50% per l\'arredo immobili (comprese giovani coppie) e IVA per acquisto abitazione A o B; spese 55% - 65% per risparmio energetico'
        ],
        faqs: [],
      },
      {
        name: 'Integrazione Modello Redditi PF',
        code: 'INT_MOD_REDD_2026',
        description: 'Integrazione alla dichiarazione dei redditi',
        category: 'TAX',
        basePrice: 29.99,
        requiredDocuments: [
          '01. Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
          '02. Codice fiscale richiedente',
          '03. CU 2023 redditi 2022',
          '04. Codice fiscale dei familiari a carico',
          '05. Spese sanitarie',
          '06. Contratto di locazione',
          '07. Interessi passivi su mutui (contratto compravendita, contratto mutuo, oneri accessori, quietanze interessi, fatture ristrutturazione/costruzione)',
          '08. Spese funebri',
          '09. Spese frequenza di scuole dell\'infanzia, del primo ciclo di istruzione e della scuola secondaria di secondo grado',
          '10. Spese frequenza corsi istruzione universitaria presso università statali e non statali',
          '11. Spese per addetti all\'assistenza personale',
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
          '22. Spese 50% per l\'arredo immobili (comprese giovani coppie) e IVA per acquisto abitazione A o B; spese 55% - 65% per risparmio energetico'
        ],
        faqs: [],
      },
      {
        name: 'Modello F24 Cedolare Secca',
        code: 'F24_CEDOL_2026',
        description: 'F24 per cedolare secca',
        category: 'TAX',
        basePrice: 29.99,
        requiredDocuments: [
          '01. Carta d\'identità',
          '02. Codice fiscale',
          '03. Contratto di locazione',
          '04. Registrazione del contratto di locazione'
        ],
        faqs: [],
      },
      {
        name: 'Dichiarazione e Calcolo IMU',
        code: 'DICH_IMU_2026',
        description: 'Dichiarazione e calcolo IMU',
        category: 'TAX',
        basePrice: 0,
        requiredDocuments: [
          '01. Carta d\'identità',
          '02. Codice Fiscale',
          '03. Visura Catastale Aggiornata',
          '04. Dati dei Pagamenti Precedenti'
        ],
        faqs: [],
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
        basePrice: 0,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Variazione Partita IVA',
        code: 'VAR_PIVA_2026',
        description: 'Variazione della Partita IVA',
        category: 'BUSINESS',
        basePrice: 99.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Cessazione Ditta Individuale',
        code: 'CESS_DITA_2026',
        description: 'Cessazione della ditta individuale',
        category: 'BUSINESS',
        basePrice: 99.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Comunicazione Camera Commercio',
        code: 'COMM_CAM_2026',
        description: 'Comunicazione alla Camera di Commercio',
        category: 'BUSINESS',
        basePrice: 149.99,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Segnalazione Certificata Inizio Attività',
        code: 'SCIA_ATTIV_2026',
        description: 'SCIA per inizio attività',
        category: 'BUSINESS',
        basePrice: 149.99,
        requiredDocuments: [],
        faqs: [],
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
        description: 'Gestione dei contratti di locazione',
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
        faqs: [],
      },
      {
        name: 'Assegno di Inclusione',
        code: 'ASS_INCL_2026',
        description: 'Assegno di inclusione',
        category: 'SOCIAL',
        basePrice: 24.4,
        requiredDocuments: [],
        faqs: [],
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
        faqs: [],
      },
      {
        name: 'PAD Assegno di Inclusione',
        code: 'PAD_ASS_INCL_2026',
        description: 'PAD per assegno di inclusione',
        category: 'SOCIAL',
        basePrice: 0,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Assegno Sociale Famiglie',
        code: 'ASS_SOC_FAM_2026',
        description: 'Assegno sociale per famiglie',
        category: 'SOCIAL',
        basePrice: 0,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Residenza',
        code: 'RESIDENZA_2026',
        description: 'Certificato di residenza',
        category: 'ADMINISTRATIVE',
        basePrice: 12.2,
        requiredDocuments: [],
        faqs: [],
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
        name: 'Stato di Famiglia',
        code: 'STATO_FAM_2026',
        description: 'Certificato di stato di famiglia',
        category: 'ADMINISTRATIVE',
        basePrice: 12.2,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Stato Civile',
        code: 'STATO_CIV_2026',
        description: 'Certificato di stato civile',
        category: 'ADMINISTRATIVE',
        basePrice: 12.2,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Casellario Giudiziale',
        code: 'CASEL_GIU_2026',
        description: 'Certificato casellario giudiziale',
        category: 'ADMINISTRATIVE',
        basePrice: 60,
        requiredDocuments: [],
        faqs: [],
      },
      {
        name: 'Certificato dei Carichi Pendenti',
        code: 'CERT_CARICH_2026',
        description: 'Certificato dei carichi pendenti',
        category: 'ADMINISTRATIVE',
        basePrice: 60,
        requiredDocuments: [],
        faqs: [],
      },
    ],
  },
];

export async function seedAllServices() {
  try {
    console.log(
      '\n✨ Inizio Seeding - Tutti i Tipi di Servizio, Servizi e FAQs...\n'
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
          service = serviceRepo.create({
            name: serviceData.name,
            code: serviceData.code,
            description: serviceData.description,
            category: serviceData.category,
            basePrice: serviceData.basePrice,
            serviceTypeId: serviceType.id,
            requiredDocuments: serviceData.requiredDocuments as any,
          });
          await serviceRepo.save(service);
          console.log(`   ✅ Servizio: ${serviceData.name}`);
          servicesCount++;
        } else {
          service.name = serviceData.name;
          service.description = serviceData.description;
          service.category = serviceData.category;
          service.basePrice = serviceData.basePrice;
          service.requiredDocuments = serviceData.requiredDocuments as any;
          service.serviceTypeId = serviceType.id;
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
      '\n✨ Seeding completato con successo! Tutti i dati sono stati caricati.\n'
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
