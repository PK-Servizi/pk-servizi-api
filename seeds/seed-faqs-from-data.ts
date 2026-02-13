import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';
import { Faq } from '../src/modules/faqs/entities/faq.entity';

/**
 * FAQs data extracted from DATA.md
 * Complete FAQ list with all services from the client data
 */
const FAQS_DATA = {
  // ISEE Services
  'ISEE Ordinario 2026': [
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
        'L\'attestazione ISEE ha validità fino al 31 dicembre di ogni anno. Ad esempio, l\'attestazione ISEE effettuata nell\'anno 2025 scadrà il 31 dicembre 2025.',
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
      question:
        'Ho la residenza in un luogo ma attualmente vivo altrove, devo indicare l\'indirizzo di residenza e indicare le altre persone che hanno stessa residenza?',
      answer:
        'Devi fare riferimento al luogo in cui hai la residenza ufficiale e indicare le persone con le quali risulti vivere.',
      order: 5,
      category: 'Residenza',
    },
    {
      question:
        'Nel 2025 ho venduto la casa in cui abitavo e ora ne ho acquistata un\'altra. Nel modulo ISEE devo inserire la rendita catastale della nuova casa o della vecchia?',
      answer:
        'Devi inserire i dati catastali della casa precedente, insieme all\'importo residuo del mutuo al 31 dicembre 2025 relativo a quell\'alloggio.',
      order: 6,
      category: 'Immobili',
    },
    {
      question: 'Nel periodo tra il 2025 e oggi ho cambiato auto. Quale targa devo inserire?',
      answer: 'Devi inserire la targa dell\'auto attualmente in uso.',
      order: 7,
      category: 'Veicoli',
    },
    {
      question: 'Nel 2025 vivevo a un indirizzo diverso da quello attuale. Quale indirizzo devo indicare?',
      answer: 'Devi indicare l\'indirizzo attuale in cui risiedi al momento della compilazione.',
      order: 8,
      category: 'Residenza',
    },
  ],

  // ISEE Universitario 2026
  'ISEE Universitario 2026': [
    {
      question: 'Who must declare the university ISEE?',
      answer:
        'It could be anyone in the household, not necessarily the head of the family nor necessarily the person requesting the service who will then actually present the ISEE.',
      order: 1,
      category: 'Dichiarante',
    },
    {
      question: 'What are the conditions to be considered an independent student?',
      answer:
        'A student is in fact considered "independent" when: he or she has resided outside the family home for at least two years prior to submitting the application for enrollment for the first time in each course of study, in accommodation not owned by a member of the family.',
      order: 2,
      category: 'Studente Indipendente',
    },
    {
      question: 'How long does it take to process the DSU?',
      answer: 'The DSU is processed within 6 hours of the request.',
      order: 3,
      category: 'Tempi',
    },
    {
      question: 'How long is the ISEE University certificate valid for?',
      answer:
        'The ISEE University certification is valid for the current academic year because it expires on December 31st of that year.',
      order: 4,
      category: 'Validità',
    },
    {
      question: 'Can I use the University ISEE certificate to request other benefits or concessions?',
      answer:
        'Yes, the certificate can be used to request benefits or concessions, according to the instructions of your university.',
      order: 5,
      category: 'Utilizzo',
    },
  ],

  // ISEE Socio Sanitario 2026
  'ISEE Socio Sanitario 2026': [
    {
      question: 'Who can apply for the ISEE Socio-Sanitario?',
      answer:
        'The ISEE Social Health form can only be submitted if the beneficiary of the benefits is an adult with a disability or who is not self-sufficient. The declarant can also be another member of the family unit, provided they are of age, but must also include the disabled person in the household.',
      order: 1,
      category: 'Requisiti',
    },
    {
      question: 'What does "close family unit" mean?',
      answer:
        'The beneficiary has the option of declaring a smaller family unit than the ordinary one, consisting exclusively of the beneficiary of the benefits, the spouse, minor children, and adult children dependent on them for IRPEF purposes (unless they are married or have children).',
      order: 2,
      category: 'Nucleo Familiare',
    },
    {
      question: 'How long does it take for my request to be processed?',
      answer:
        'The Single Substitute Declaration (DSU) is processed within 6 hours of the request, and the ISEE certification is ready within 3 days.',
      order: 3,
      category: 'Tempi',
    },
  ],

  // ISEE Minorenni 2026
  'ISEE Minorenni 2026': [
    {
      question: 'What is the difference between ISEE and ISEE for Minors?',
      answer:
        'The ISEE for Minors is specifically designed for families with minor children and provides different calculation methods based on the family situation. It coincides with the ordinary ISEE when the parents are married, whether they live together or not.',
      order: 1,
      category: 'Differenze',
    },
    {
      question: 'Which parent should request the ISEE?',
      answer:
        'In the case of non-cohabiting and non-married parents, the ISEE for Minors must be requested by the parent with whom the children habitually live. This way, the non-cohabiting parent becomes part of the child\'s family unit as an additional or additional member.',
      order: 2,
      category: 'Richiedente',
    },
    {
      question: 'How can you lower your ISEE?',
      answer:
        'To reduce your ISEE, you can: change your residence, review your property values, avoid joint accounts, or request a current ISEE.',
      order: 3,
      category: 'Riduzione',
    },
    {
      question:
        'I\'m a mother with two children from a divorced, non-cohabiting husband. Do I need to include the father to apply for the children\'s school meal subsidy?',
      answer:
        'No, since the parents are divorced and do not live together, it is necessary to complete the ISEE for Minors, including only the mother and two children in Section A (family unit). The father must be included in Section D (unmarried and non-cohabiting parent), providing his name and tax code.',
      order: 4,
      category: 'Procedura',
    },
    {
      question: 'Can I prepare an ISEE for Minors if the child has not been recognized by the father?',
      answer:
        'Only if the child has been recognized by the father is the child included in the ISEE calculation. If the child has not been recognized, the ISEE for Minors cannot be prepared and the standard ISEE must be submitted.',
      order: 5,
      category: 'Figli',
    },
  ],

  // ISEE Corrente
  'ISEE Corrente': [
    {
      question: 'What is the Current ISEE and what is it used for?',
      answer:
        'The Current ISEE is an update to your ordinary ISEE that takes into account your most recent financial situation. It reflects significant changes in your income, assets, or household size that have occurred in recent months. It helps you access bonuses, benefits, and social benefits that require an updated indicator that is more accurate than your current financial situation, ensuring you access to benefits you may not have been entitled to with your "old" ISEE.',
      order: 1,
      category: 'Definizione',
    },
    {
      question: 'When can I request the Current ISEE?',
      answer:
        'You can request the ISEE Corrente when specific events occur that change your situation. The most common cases include a reduction in family income of more than 25%, job loss or suspension of work (with social safety nets), or significant changes in the family unit such as births, marriages, or separations. Our team can help you determine if you qualify.',
      order: 2,
      category: 'Quando',
    },
    {
      question: 'What documents are needed to request the Current ISEE?',
      answer:
        'To request the Current ISEE, you\'ll need the Ordinary ISEE you already have. You\'ll also need to provide documents certifying the change in your situation, such as: documentation relating to job loss or reduction (e.g., layoff letters, pay stubs showing the reduction, social safety net documentation), updated bank statements for assets, or registry certificates for changes in the household. We\'ll guide you through the specific collection process.',
      order: 3,
      category: 'Documenti',
    },
    {
      question: 'Is the current ISEE mandatory or optional?',
      answer:
        'The Current ISEE is optional, but highly recommended if your financial situation has worsened compared to that indicated by the standard ISEE. Failure to request it could result in you losing access to benefits or receiving lower amounts than you would be entitled to, based on your no longer current financial situation.',
      order: 4,
      category: 'Obbligatorietà',
    },
    {
      question: 'How long is the current ISEE valid for?',
      answer:
        'The Current ISEE is valid for a different period of time than the Ordinary ISEE. Generally, it is valid for six months from the date of submission of the Single Substitute Declaration (DSU), unless significant changes occur that require further updating. This ensures that the indicator always reflects your most recent situation for accessing benefits.',
      order: 5,
      category: 'Validità',
    },
  ],

  // NASPI Services
  'Disoccupazione NASPI': [
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
        'L\'importo corrisponde al 75% della retribuzione media mensile soggetta a contribuzione degli ultimi quattro anni, fino a un massimo di €1.470,99 lordi. A partire dal primo giorno del sesto mese di fruizione, la NASpI si riduce del 3% ogni mese. La riduzione scatta dall\'ottavo mese se il beneficiario ha compiuto 55 anni alla data di presentazione della domanda.',
      order: 3,
      category: 'Importi',
    },
    {
      question: 'Percepisco la disoccupazione e ho trovato un nuovo lavoro, cosa devo fare?',
      answer:
        'Devi richiedere una NASpI-Com per comunicare all\'INPS i termini del nuovo contratto, affinché l\'indennità venga sospesa.',
      order: 4,
      category: 'Variazioni',
    },
    {
      question: 'Percepisco la disoccupazione e sono incinta di 7 mesi, cosa devo fare?',
      answer:
        'Devi richiedere una NASpI-Com per sospendere l\'indennità nel periodo previsto di maternità obbligatoria (8° e 9° mese di gravidanza + 1°, 2° e 3° mese dalla nascita del neonato).',
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
      question: 'L\'indennità di disoccupazione tiene conto solo dell\'ultimo lavoro o include anche i periodi precedenti?',
      answer: 'L\'INPS considera i periodi di lavoro degli ultimi 4 anni.',
      order: 7,
      category: 'Calcolo',
    },
    {
      question: 'Cos\'è la NASpI e a chi spetta?',
      answer:
        'La NASpI (Nuova Assicurazione Sociale per l\'Impiego) è un\'indennità di disoccupazione erogata dall\'INPS ai lavoratori dipendenti che hanno perso involontariamente il lavoro. Per averne diritto, è necessario aver maturato almeno 13 settimane di contributi nei 4 anni precedenti la disoccupazione e aver lavorato almeno 30 giorni negli ultimi 12 mesi.',
      order: 8,
      category: 'Requisiti',
    },
    {
      question: 'Come si calcola l\'importo della NASpI?',
      answer:
        'L\'importo della NASpI si calcola in base alla retribuzione imponibile ai fini previdenziali degli ultimi 4 anni. Esiste una formula specifica e delle fasce di retribuzione che determinano l\'importo. Puoi trovare maggiori dettagli e un simulatore sul sito dell\'INPS.',
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
        'Il diritto alla NASpI si perde in diversi casi, tra cui: trovare un nuovo lavoro a tempo indeterminato, raggiungere i requisiti per la pensione, superare i limiti di reddito da lavoro autonomo, rifiutare un\'offerta di lavoro congrua, non partecipare alle iniziative di politica attiva del lavoro.',
      order: 11,
      category: 'Decadenza',
    },
    {
      question: 'Come e quando presentare la domanda di NASpI?',
      answer: 'La domanda di NASpI va presentata all\'INPS esclusivamente online, entro 68 giorni dalla data di cessazione del rapporto di lavoro.',
      order: 12,
      category: 'Procedura',
    },
    {
      question: 'Posso lavorare part-time mentre percepisco la NASpI?',
      answer:
        'Sì, è possibile lavorare part-time con un contratto di lavoro subordinato mentre si percepisce la NASpI. Bisogna però comunicare all\'INPS il reddito previsto dal nuovo lavoro, che comporterà una riduzione dell\'importo della NASpI.',
      order: 13,
      category: 'Lavoro',
    },
    {
      question: 'Ho diritto alla NASpI se mi dimetto?',
      answer:
        'In generale, no. La NASpI spetta solo in caso di disoccupazione involontaria. Esistono però delle eccezioni, come le dimissioni per giusta causa o durante il periodo tutelato di maternità.',
      order: 14,
      category: 'Requisiti',
    },
    {
      question: 'Cosa succede se mi trasferisco all\'estero durante la NASpI?',
      answer:
        'La NASpI può essere erogata anche all\'estero, ma solo per un periodo massimo di 3 mesi, e a condizione di partecipare a programmi di ricerca di lavoro nel Paese di residenza.',
      order: 15,
      category: 'Estero',
    },
  ],

  // Disoccupazione Agricola
  'Disoccupazione Agricola': [
    {
      question: 'Che cos\'è l\'indennità di disoccupazione agricola?',
      answer:
        'L\'indennità di disoccupazione agricola è una prestazione economica a cui hanno diritto i lavoratori agricoli dipendenti e le figure equiparate.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Anticipo NASPI
  'Anticipo NASPI': [
    {
      question: 'Che cos\'è l\'Anticipo NASPI?',
      answer:
        'La NASpI anticipata consiste nella liquidazione anticipata in un\'unica soluzione dell\'importo complessivo della NASpI. Sull\'importo erogato è operata la trattenuta IRPEF secondo la normativa vigente.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // DID - Dichiarazione di Immediata Disponibilità
  'DID - Dichiarazione di Immediata Disponibilità': [
    {
      question: 'Che cos\'è la DID?',
      answer:
        'La Did online - Dichiarazione di immediata disponibilità al lavoro, è la dichiarazione che determina formalmente l\'inizio dello stato di disoccupazione di una persona.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Naspi-Com
  'Naspi-Com': [
    {
      question: 'Che cos\'è NASpI Com?',
      answer:
        'Il servizio NASpI Com ti consente, di inviare online tutte le comunicazioni relative alla variazione della tua situazione (cambio di indirizzo, variazione modalità di pagamento e variazione della situazione lavorativa e reddituale).',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Dimissioni Services
  'Dimissioni Volontarie': [
    {
      question: 'Cosa succede se non rispetto il periodo di preavviso stabilito?',
      answer:
        'Nel caso in cui il periodo di preavviso non venga rispettato, o in presenza di una "giusta causa" pretestuosa, il lavoratore sarà considerato inadempiente e l\'azienda potrà detrarre dalla sua ultima busta paga l\'importo corrispondente ai giorni di preavviso mancanti.',
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
      question: 'Se decido di dare le dimissioni avrò diritto alla NASpI?',
      answer:
        'Se decidi di dimetterti volontariamente perderai il diritto alla NASpI, a meno che le dimissioni siano giustificate.',
      order: 3,
      category: 'NASpI',
    },
    {
      question: 'Come posso dare le dimissioni senza perdere il diritto alla NASpI?',
      answer:
        'Per evitare di perdere il diritto alla NASpI al momento delle dimissioni è importante comunicare all\'INPS che le dimissioni sono motivate da una "giusta causa".',
      order: 4,
      category: 'NASpI',
    },
    {
      question: 'Cosa succede alle ferie non godute in caso di dimissioni?',
      answer:
        'In caso di dimissioni volontarie, licenziamento o dimissioni per pensionamento, le ferie non godute devono essere retribuite dal datore di lavoro e possono essere convertite in denaro.',
      order: 5,
      category: 'Ferie',
    },
  ],

  // Dimissioni per giusta causa
  'Dimissioni per giusta causa': [
    {
      question: 'Cosa sono le dimissioni per giusta causa?',
      answer:
        'Le dimissioni volontarie per giusta causa sono una procedura attraverso la quale un dipendente decide di rinunciare al proprio posto di lavoro attuale. Solitamente, il dipendente deve comunicare le proprie dimissioni rispettando un preavviso previsto dalla legge o dal contratto di lavoro, al fine di permettere all\'azienda di organizzarsi per la sostituzione del dipendente o per altre esigenze aziendali.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Revoca Dimissioni Volontarie
  'Revoca Dimissioni Volontarie': [
    {
      question: 'Quando è possibile revocare le dimissioni?',
      answer:
        'La normativa consente comunque al dipendente di revocare ovvero ritirare le dimissioni volontarie entro 7 giorni successivi alla comunicazione. Decorso il termine di 7 giorni utile per la revoca, per lo stesso rapporto di lavoro sarà possibile inviare nuove dimissioni, non revocabili.',
      order: 1,
      category: 'Revoca',
    },
    {
      question: 'Quante volte si possono revocare le dimissioni?',
      answer:
        'Il lavoratore ha sempre la possibilità di revocare le dimissioni o la risoluzione consensuale entro 7 giorni successivi alla comunicazione. Decorso il termine di 7 giorni utile per la revoca, per lo stesso rapporto di lavoro sarà possibile inviare nuove dimissioni, non revocabili.',
      order: 2,
      category: 'Revoca',
    },
    {
      question: 'Cosa succede se il lavoratore non convalida le dimissioni?',
      answer:
        'Le dimissioni rassegnate senza rispettare la procedura telematica sono inefficaci e non potranno comportare l\'interruzione del rapporto di lavoro.',
      order: 3,
      category: 'Validità',
    },
  ],

  // PAD NASPI/DIS-COLL
  'PAD NASPI/DIS-COLL': [
    {
      question: 'Patto di Attivazione Digitale (PAD): cos\'è e come influisce su NASpI e DIS-COLL?',
      answer:
        'Il Patto di Attivazione Digitale (PAD) è un accordo che i beneficiari di NASpI e DIS-COLL devono sottoscrivere sulla piattaforma SIISL a partire da novembre 2024. Attraverso il PAD, ci si impegna a partecipare attivamente a percorsi di ricerca di lavoro, formazione e reinserimento professionale. In pratica, è un modo per confermare la propria disponibilità al lavoro e accedere ai servizi di supporto offerti.',
      order: 1,
      category: 'Definizione',
    },
    {
      question: 'PAD obbligatorio per NASpI e DIS-COLL? Scadenze e conseguenze della mancata sottoscrizione',
      answer:
        'Sì, il PAD è obbligatorio per chi percepisce NASpI e DIS-COLL. Non ci sono scadenze rigide per la sottoscrizione, ma è fondamentale farlo il prima possibile per evitare potenziali ritardi nell\'erogazione delle indennità. La mancata sottoscrizione può comportare la sospensione o la decadenza del beneficio',
      order: 2,
      category: 'Obbligatorietà',
    },
  ],

  // Colf e Badanti - Busta paga
  'Busta Paga Colf e Badanti': [
    {
      question: 'Quali informazioni sono necessarie per elaborare correttamente le buste paga delle colf e badanti?',
      answer:
        'Per elaborare buste paga precise, è fondamentale avere informazioni come le ore lavorate, il salario orario, eventuali straordinari e detrazioni fiscali.',
      order: 1,
      category: 'Informazioni',
    },
    {
      question: 'Quali sono i vantaggi di affidarsi a un servizio professionale per la gestione delle buste paga delle colf e badanti?',
      answer:
        'SmartCaf garantisce precisione nei calcoli, rispetto delle normative e risparmio di tempo prezioso per il datore di lavoro.',
      order: 2,
      category: 'Vantaggi',
    },
    {
      question: 'Come viene gestita la comunicazione con l\'INPS per le buste paga delle colf e badanti?',
      answer:
        'SmartCaf gestisce tutte le comunicazioni ufficiali con l\'INPS, garantendo la conformità alle disposizioni normative e la trasmissione tempestiva dei dati necessari.',
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

  // MAV trimestrale/Bollettino Colf e Badanti
  'MAV Trimestrale Colf e Badanti': [
    {
      question: 'Quali sono i vantaggi di utilizzare il servizio di bollettino MAV trimestrale per colf e badanti?',
      answer:
        'Il nostro servizio semplifica la gestione delle contribuzioni previdenziali, garantendo tempestività e conformità normativa. Risparmia tempo e riduci il rischio di errori nella gestione amministrativa.',
      order: 1,
      category: 'Vantaggi',
    },
    {
      question: 'Quali informazioni sono necessarie per richiedere il servizio di bollettino MAV trimestrale?',
      answer:
        'Abbiamo bisogno dei dati personali del datore di lavoro e del lavoratore, registro presenze, dettagli retributivi e contributi previdenziali per elaborare il bollettino MAV trimestrale in modo accurato.',
      order: 2,
      category: 'Informazioni',
    },
    {
      question: 'Come funziona il processo di elaborazione del bollettino MAV trimestrale con il vostro servizio?',
      answer:
        'Una volta forniti i documenti necessari, il nostro team si occupa di elaborare il bollettino MAV trimestrale in conformità con le normative vigenti, garantendo tempestività e precisione.',
      order: 3,
      category: 'Processo',
    },
    {
      question: 'Qual è la frequenza di emissione dei bollettini MAV trimestrali?',
      answer: 'I bollettini MAV trimestrali vengono emessi ogni trimestre solare, rispettando le scadenze stabilite dall\'INPS.',
      order: 4,
      category: 'Frequenza',
    },
    {
      question: 'Cosa succede se ci sono modifiche nei dati durante il trimestre?',
      answer:
        'In caso di modifiche nei dati, è importante informare tempestivamente il nostro servizio per garantire l\'aggiornamento corretto del bollettino MAV trimestrale e evitare eventuali problemi con le autorità competenti',
      order: 5,
      category: 'Modifiche',
    },
  ],

  // CU Colf e Badanti
  'CU Colf e Badanti': [
    {
      question: 'A cosa serve il CU per colf e badanti?',
      answer:
        '- Dichiarazione dei redditi: È indispensabile per calcolare le tasse da pagare. - Calcolo dell\'ISEE: Serve per accedere a sconti e agevolazioni. - Altre pratiche: Può essere richiesto per altre pratiche burocratiche, come il rinnovo del permesso di soggiorno.',
      order: 1,
      category: 'Utilizzo',
    },
    {
      question: 'Chi deve rilasciare il CU?',
      answer: 'Il datore di lavoro (famiglia che ha assunto la colf o la badante) è tenuto a rilasciare il CU entro determinati termini.',
      order: 2,
      category: 'Responsabilità',
    },
    {
      question: 'Cosa contiene il CU?',
      answer:
        'Il CU riporta informazioni importanti come: - Dati anagrafici del datore di lavoro e del lavoratore - Periodo di riferimento - Importo dei compensi corrisposti - Contributo previdenziale versato',
      order: 3,
      category: 'Contenuto',
    },
    {
      question: 'Perché è importante?',
      answer:
        'Il CU è un documento essenziale per tutelare i diritti del lavoratore domestico e per garantire la corretta gestione amministrativa del rapporto di lavoro.',
      order: 4,
      category: 'Importanza',
    },
  ],

  // Lettere di assunzione Colf e Badanti
  'Lettera di Assunzione Colf e Badanti': [
    {
      question: 'Quali informazioni devono essere incluse nella lettera d\'assunzione per una colf o una badante?',
      answer:
        'La lettera d\'assunzione per una colf o una badante deve includere informazioni come i dettagli personali del datore di lavoro e del lavoratore, le mansioni e i compiti da svolgere, l\'orario di lavoro, la retribuzione e la durata del contratto.',
      order: 1,
      category: 'Contenuto',
    },
    {
      question: 'Come posso garantire la conformità legale della lettera d\'assunzione per una colf o una badante?',
      answer:
        'SmartCaf redige la lettera d\'assunzione in conformità alle normative vigenti, includendo tutti i dettagli pertinenti come l\'orario di lavoro, la retribuzione e le clausole contrattuali rilevanti.',
      order: 2,
      category: 'Conformità',
    },
    {
      question: 'Quali sono le clausole importanti da includere nella lettera d\'assunzione per una colf o una badante?',
      answer:
        'Alcune clausole importanti da includere potrebbero riguardare la riservatezza delle informazioni, il trattamento dei dati personali, le ferie e il preavviso di licenziamento.',
      order: 3,
      category: 'Clausole',
    },
    {
      question: 'Qual è l\'importanza di una lettera d\'assunzione ben redatta per una colf o una badante?',
      answer:
        'Una lettera d\'assunzione ben redatta è importante per stabilire chiaramente i termini e le condizioni del rapporto di lavoro, garantendo trasparenza e rispettando le normative vigenti, riducendo così il rischio di controversie future.',
      order: 4,
      category: 'Importanza',
    },
  ],

  // Assunzione Colf e Badanti
  'Assunzione Colf e Badanti': [
    {
      question: 'Quando deve essere presentata la comunicazione di assunzione?',
      answer:
        'La comunicazione di assunzione si presenta all\'INPS entro le ore 24 del giorno precedente (anche se festivo) a quello di instaurazione del rapporto di lavoro. La comunicazione ha efficacia anche nei confronti dei servizi competenti, del Ministero del Lavoro e delle Politiche Sociali, del Ministero della Salute, dell\'INAIL e della prefettura/ufficio territoriale del Governo.',
      order: 1,
      category: 'Procedura',
    },
  ],

  // Cessazione Colf e Badanti
  'Cessazione Colf e Badanti': [
    {
      question: 'Quando deve essere presentata la comunicazione di cessazione?',
      answer:
        'Chi assume un lavoratore domestico può interrompere il contratto di lavoro tramite la procedura di cessazione. La comunicazione di cessazione deve essere presentata all\'INPS entro cinque giorni dall\'evento. La comunicazione ha efficacia anche nei confronti dei servizi competenti, del Ministero del Lavoro e delle Politiche Sociali, dell\'INAIL nonché della prefettura ufficio territoriale del Governo.',
      order: 1,
      category: 'Procedura',
    },
  ],

  // Variazione Colf e Badanti
  'Variazione Colf e Badanti': [
    {
      question: 'Cosa è la variazione del rapporto di lavoro domestico?',
      answer:
        'La Variazione del rapporto di lavoro domestico tra un collaboratore familiare e un datore di lavoro.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Maternità - Assegno di Maternità
  'Assegno di Maternità': [
    {
      question: 'Che cos\'è l\'Assegno di Maternità?',
      answer:
        'È un contributo economico, erogato dall\'INPS, spettante alle madri che hanno partorito, adottato o ricevuto in affidamento preadottivo un bambino.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Maternità - Bonus Nuovi Nati
  'Bonus Nuovi Nati': [
    {
      question: 'Che cos\'è il Bonus Nuovi Nati (o Bonus Bebè)?',
      answer:
        'Il Bonus Nuovi Nati, spesso denominato anche Bonus Bebè, è un contributo economico fornito dallo Stato (o a livello regionale) per sostenere le famiglie in occasione della nascita, dell\'adozione o dell\'affidamento preadottivo di un bambino. Rappresenta un aiuto finanziario per far fronte alle prime spese legate all\'arrivo di un nuovo membro in famiglia.',
      order: 1,
      category: 'Definizione',
    },
    {
      question: 'Chi può richiedere il Bonus Bebè e quali sono i requisiti principali per il 2025?',
      answer:
        'Per poter richiedere il Bonus Bebè nel 2025, generalmente è necessario possedere la cittadinanza italiana, di un Paese UE o un regolare permesso di soggiorno, avere la residenza in Italia e un ISEE del nucleo familiare entro una determinata soglia (solitamente non superiore a 40.000 euro). Il figlio deve essere nato, adottato o in affido preadottivo a partire dal 1° gennaio 2025',
      order: 2,
      category: 'Requisiti',
    },
    {
      question: 'Entro quanto tempo va presentata la domanda per il Bonus Bebè?',
      answer:
        'La domanda per il Bonus Bebè deve essere presentata entro un termine stabilito dalla legge, che solitamente è di 60 giorni dalla data di nascita, adozione o ingresso in famiglia del minore in affido preadottivo. È cruciale rispettare questa scadenza per non perdere il diritto al contributo.',
      order: 3,
      category: 'Scadenze',
    },
  ],

  // Congedo Parentale Dipendenti
  'Congedo Parentale Dipendenti': [
    {
      question: 'Che cos\'è il congedo parentale?',
      answer:
        'Il congedo parentale è un periodo di astensione facoltativo dal lavoro concesso ai genitori naturali, adottivi o affidatari per prendersi cura del bambino nei suoi primi anni di vita e fino a 12 anni d\'età per soddisfare i suoi bisogni affettivi e relazionali. In caso di parto, adozione o affidamento plurimi, il diritto al congedo parentale spetta alle stesse condizioni per ogni bambino.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Maternità Obbligatoria Post Parto
  'Maternità Obbligatoria Post Parto': [
    {
      question: 'Che cos\'è la maternità obbligatoria post parto?',
      answer:
        'La maternità obbligatoria post parto è Il congedo di maternità obbligatoria da conseguire post parto.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Indennità di Maternità Obbligatoria Dipendenti
  'Indennità di Maternità Obbligatoria Dipendenti': [
    {
      question: 'Che cos\'è il congedo di maternità?',
      answer:
        'Il congedo di maternità è il periodo di astensione obbligatoria dal lavoro riconosciuto alle lavoratrici dipendenti durante la gravidanza e il puerperio e consiste in un periodo di astensione obbligatoria dal lavoro per la madre che copre un arco di tempo pari a 5 mesi a cavallo del parto, ovvero due mesi precedenti la data presunta del parto e tre dopo, oppure 1 mese e 4 o infine, novità dal 2019, 5 mesi subito dopo il parto.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Maternità Anticipata Dipendenti
  'Maternità Anticipata Dipendenti': [
    {
      question: 'Che cos\'è la maternità anticipata?',
      answer:
        'Il congedo di maternità è il periodo di astensione obbligatoria dal lavoro durante la gravidanza e il puerperio e consiste in un periodo di astensione obbligatoria dal lavoro per la madre che copre un arco di tempo pari a 5 mesi a cavallo del parto, ovvero due mesi precedenti la data presunta del parto e tre dopo. Si può anche scegliere 1 mese prima e 4 mesi dopo il parto o infine, 5 mesi subito dopo il parto (MATERNITA\' FLESSIBILE), tale scelta è della lavoratrice, purché vi sia un attestato del medico del Servizio sanitario nazionale o il medico del lavoro che certifichino l\'assenza di rischio alla salute della lavoratrice e alla corretta prosecuzione della gravidanza.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Congedo Parentale Gestione Separata
  'Congedo Parentale Gestione Separata': [
    {
      question: 'Che cos\'è il congedo parentale per gestione separata?',
      answer:
        'Il congedo parentale è un periodo di astensione facoltativo dal lavoro concesso ai genitori naturali, adottivi o affidatari per prendersi cura del bambino nei suoi primi anni di vita e fino a 12 anni d\'età per soddisfare i suoi bisogni affettivi e relazionali. In caso di parto, adozione o affidamento plurimi, il diritto al congedo parentale spetta alle stesse condizioni per ogni bambino.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Congedo Parentale Autonomi
  'Congedo Parentale Autonomi': [
    {
      question: 'Che cos\'è il congedo parentale per autonomi?',
      answer:
        'Il servizio permette di presentare la domanda di indennità per congedo parentale per lavoratrici autonome che abbiano effettuato il versamento dei contributi relativi al mese precedente il periodo di astensione lavorativa effettiva. Il congedo parentale è un periodo di astensione facoltativo dal lavoro concesso ai genitori naturali, adottivi o affidatari per prendersi cura del bambino nei suoi primi anni di vita e fino a 12 anni d\'età per soddisfare i suoi bisogni affettivi e relazionali. In caso di parto, adozione o affidamento plurimi, il diritto al congedo parentale spetta alle stesse condizioni per ogni bambino.',
      order: 1,
      category: 'Definizione',
    },
  ],

  // Permessi 104/92 per assistenza ai familiari disabili
  'Permessi 104/92 per assistenza ai familiari disabili': [
    {
      question: 'Quali sono i benefici dei permessi previsti dalla Legge 104/92?',
      answer:
        'I benefici includono la possibilità di fruire di giorni o ore di permesso retribuito per i lavoratori con disabilità grave o per coloro che assistono familiari con disabilità grave.',
      order: 1,
      category: 'Benefici',
    },
    {
      question: 'Chi ha diritto ai permessi della Legge 104/92?',
      answer:
        'Hanno diritto ai permessi coloro che sono riconosciuti come portatori di disabilità grave secondo quanto stabilito dalla Legge 104/92, così come i lavoratori che assistono familiari con disabilità grave.',
      order: 2,
      category: 'Requisiti',
    },
    {
      question: 'Qual è la durata massima dei permessi retribuiti previsti dalla Legge 104/92?',
      answer:
        'La durata massima è di tre giorni al mese per i lavoratori con disabilità grave, e lo stesso vale per i lavoratori che assistono familiari con disabilità grave.',
      order: 3,
      category: 'Durata',
    },
    {
      question: 'È possibile utilizzare i permessi della Legge 104/92 in modo frazionato?',
      answer:
        'Sì, i permessi possono essere utilizzati anche in modo frazionato, sia a livello giornaliero che orario, a seconda delle esigenze del lavoratore e della situazione familiare.',
      order: 4,
      category: 'Utilizzo',
    },
    {
      question: 'I permessi della Legge 104/92 comportano una diminuzione del salario?',
      answer:
        'No, i permessi sono retribuiti e non comportano una diminuzione del salario per il lavoratore che ne usufruisce.',
      order: 5,
      category: 'Retribuzione',
    },
  ],

  // F24 Cedolare Secca
  'Modello F24 Cedolare Secca': [
  ],

  // IMU Calculation
  'Dichiarazione e Calcolo IMU': [
    {
      question: 'Che cos\'è il Calcolo IMU e perché è importante farlo correttamente?',
      answer:
        'Il calcolo IMU è l\'operazione che determina l\'ammontare esatto dell\'Imposta Municipale Propria (IMU) che devi pagare sui tuoi immobili ogni anno. È cruciale farlo correttamente perché errori o imprecisioni possono portare a sanzioni IMU da parte del Comune o a versare più del dovuto. Il nostro servizio garantisce un calcolo IMU preciso basato sulle ultime aliquote e normative, evitando ogni rischio.',
      order: 1,
      category: 'Definizione',
    },
    {
      question: 'Chi deve richiedere il servizio di Calcolo IMU?',
      answer:
        'Il servizio di calcolo IMU è rivolto a tutti i proprietari di immobili (abitazioni, terreni, negozi, ecc.) e ai titolari di altri diritti reali (come usufrutto, uso, abitazione). È particolarmente utile per chi ha seconde case, immobili in comodato d\'uso gratuito, o per chi ha effettuato acquisti o vendite immobiliari nell\'anno, per assicurarsi di pagare solo l\'importo proporzionale dovuto.',
      order: 2,
      category: 'Beneficiari',
    },
    {
      question: 'Questo servizio include il Calcolo IMU per l\'Abitazione Principale?',
      answer:
        'Sì, il nostro servizio di calcolo IMU copre anche l\'abitazione principale, ma solo nei casi in cui questa non rientri nelle categorie esenti (ovvero le categorie catastali di lusso A/1, A/8, A/9). Per queste abitazioni, calcoliamo l\'imposta dovuta e verifichiamo l\'applicazione delle detrazioni IMU specifiche e delle eventuali pertinenze esenti (una per categoria C/2, C/6, C/7).',
      order: 3,
      category: 'Abitazione Principale',
    },
    {
      question: 'Con il vostro servizio ricevo anche l\'F24 per il pagamento dell\'IMU?',
      answer:
        'Assolutamente sì. Una volta completato il calcolo IMU, ti forniamo i modelli F24 precompilati con tutti i dati necessari per il versamento, inclusi i codici tributo e gli importi precisi per l\'acconto (scadenza giugno) e il saldo (scadenza dicembre). Il nostro obiettivo è semplificarti al massimo l\'adempimento, dalla determinazione dell\'importo al pagamento.',
      order: 4,
      category: 'F24',
    },
  ],

  // Apertura Partita IVA
  'Apertura Partita IVA': [
    {
      question: 'Quanto costa aprire la Partita IVA con il regime forfettario su smartcaf.it?',
      answer:
        'L\'apertura della Partita IVA per i liberi professionisti non prevede costi vivi di bollo o diritti verso l\'Agenzia delle Entrate, ma la scelta del regime fiscale è un passo delicato che richiede competenza. Affidandoti a smartcaf.it, avrai la certezza di una pratica gestita da esperti che analizzeranno la tua idoneità al regime forfettario, permettendoti di accedere alla flat tax agevolata al 5% o 15%. Il nostro servizio offre un pacchetto chiavi in mano che include la consulenza iniziale e l\'invio telematico, garantendoti il massimo risparmio fiscale e una gestione contabile trasparente.',
      order: 1,
      category: 'Costi',
    },
    {
      question: 'Quali documenti servono per l\'apertura della Partita IVA online con smartcaf.it?',
      answer:
        'Per avviare la pratica tramite la piattaforma smartcaf.it sono necessari pochi e semplici documenti: una copia fronte-retro del tuo documento d\'identità, il codice fiscale e un indirizzo email di riferimento. Una volta caricati i dati, i nostri consulenti ti guideranno nella descrizione della tua attività per individuare il Codice ATECO più preciso. Grazie alla nostra procedura digitalizzata, eliminiamo le code agli sportelli e la necessità di moduli cartacei, rendendo l\'intero processo rapido, sicuro e completamente online.',
      order: 2,
      category: 'Documenti',
    },
    {
      question: 'In quanto tempo smartcaf.it attiva la mia nuova Partita IVA?',
      answer:
        'La velocità è uno dei punti di forza di smartcaf.it: una volta ricevuta tutta la documentazione necessaria, i nostri consulenti elaborano e inviano la dichiarazione di inizio attività all\'Agenzia delle Entrate in tempi record. Solitamente, il numero di Partita IVA viene rilasciato e comunicato al cliente entro 24 ore lavorative. Questo ti permette di essere operativo immediatamente e di iniziare a emettere fatture elettroniche verso i tuoi clienti senza inutili attese burocratiche.',
      order: 3,
      category: 'Tempi',
    },
    {
      question: 'Come mi aiuta smartcaf.it a scegliere il Codice ATECO corretto?',
      answer:
        'La selezione del Codice ATECO è fondamentale perché definisce la base imponibile su cui pagherai le tasse, specialmente nel regime forfettario. Gli esperti di smartcaf.it effettuano un\'analisi dettagliata del tuo profilo professionale per assegnarti il codice ISTAT che meglio rispecchia il tuo business. Questo supporto personalizzato è essenziale per evitare sanzioni future e per assicurarti di beneficiare del coefficiente di redditività più vantaggioso previsto dalla normativa vigente.',
      order: 4,
      category: 'ATECO',
    },
    {
      question: 'smartcaf.it gestisce anche l\'iscrizione alla Gestione Separata INPS?',
      answer:
        'Certamente. Durante la fase di apertura della Partita IVA, il team di smartcaf.it verifica il tuo inquadramento previdenziale e, se sei un libero professionista senza una cassa autonoma, procede contestualmente all\'iscrizione alla Gestione Separata INPS. Ci assicuriamo che la tua posizione sia aperta correttamente fin dal primo giorno, spiegandoti con chiarezza come funzionano i versamenti dei contributi pensionistici, così da permetterti di lavorare con la massima serenità e in piena regola con gli enti previdenziali.',
      order: 5,
      category: 'INPS',
    },
  ],

  // Variazione Partita IVA
  'Variazione Partita IVA': [
    {
      question: 'Come posso richiedere la variazione Partita IVA su smartcaf.it?',
      answer:
        'Richiedere la variazione della Partita IVA su smartcaf.it è semplicissimo: basta compilare il nostro form online con i nuovi dati (come il cambio sede o il nuovo codice ATECO) e caricare i documenti richiesti. Un nostro consulente esperto prenderà in carico la pratica, verificherà la correttezza dei dati e invierà la comunicazione telematica all\'Agenzia delle Entrate, sollevandoti da ogni onere burocratico.',
      order: 1,
      category: 'Procedura',
    },
    {
      question: 'Perché scegliere smartcaf.it per modificare il codice ATECO?',
      answer:
        'Scegliere smartcaf.it significa affidarsi a specialisti che conoscono a fondo la classificazione delle attività economiche. Oltre all\'invio della pratica, i nostri esperti ti supportano nella scelta del codice ATECO corretto, fondamentale per l\'inquadramento fiscale e previdenziale, evitando errori che potrebbero causare sanzioni o problemi con l\'INPS e la Camera di Commercio.',
      order: 2,
      category: 'Vantaggi',
    },
    {
      question: 'Quali documenti servono per la variazione dati su smartcaf.it?',
      answer:
        'Per procedere con la variazione tramite il portale smartcaf.it, avrai bisogno del tuo documento d\'identità in corso di validità, del codice fiscale e dei dettagli relativi alla modifica da effettuare (ad esempio l\'indirizzo della nuova sede o la descrizione della nuova attività). Una volta inviati i documenti, gestiremo noi l\'invio del modello AA9/12 o AA7/10 entro 24h',
      order: 3,
      category: 'Documenti',
    },
    {
      question: 'Quanto costa il servizio di variazione Partita IVA di smartcaf.it?',
      answer:
        'Il servizio di smartcaf.it offre tariffe trasparenti e competitive, che includono la consulenza professionale e l\'invio telematico della pratica. Rispetto ai costi di un ufficio fisico, il nostro servizio online ti permette di risparmiare tempo e denaro, garantendoti la stessa sicurezza di un CAF tradizionale con il vantaggio della comodità digitale.',
      order: 4,
      category: 'Costi',
    },
    {
      question: 'Riceverò una ricevuta ufficiale dopo la variazione con smartcaf.it?',
      answer:
        'Certamente. Al termine della procedura, smartcaf.it ti invierà nell\'area riservata (o via email) la ricevuta di avvenuta presentazione rilasciata dall\'Agenzia delle Entrate. Questo documento ufficiale attesta che l\'aggiornamento dei dati della tua Partita IVA è stato registrato correttamente nei database del Ministero dell\'Economia e delle Finanze.',
      order: 5,
      category: 'Ricevute',
    },
  ],

  // Cessazione Ditta Individuale
  'Cessazione Ditta Individuale': [
    {
      question: 'Quanto tempo ho per chiudere la Partita IVA di una ditta individuale?',
      answer:
        'La legge prevede che la comunicazione di cessazione attività debba essere presentata entro 30 giorni dalla data di effettiva chiusura. Affidarsi a SmartCAF permette di rispettare queste tempistiche ed evitare le sanzioni amministrative previste per l\'invio tardivo della pratica all\'Agenzia delle Entrate e al Registro delle Imprese.',
      order: 1,
      category: 'Scadenze',
    },
    {
      question: 'Cosa succede ai contributi INPS dopo la chiusura della ditta?',
      answer:
        'Una volta completata la pratica di cessazione con SmartCAF, la comunicazione viene inoltrata all\'INPS per la chiusura della posizione contributiva. Questo passaggio è fondamentale perché interrompe immediatamente l\'obbligo di versamento dei contributi fissi (artigiani o commercianti), evitando che l\'ente continui a richiedere pagamenti non dovuti per il periodo successivo alla chiusura.',
      order: 2,
      category: 'INPS',
    },
    {
      question: 'È obbligatorio cancellarsi dalla Camera di Commercio?',
      answer:
        'Sì, per le ditte individuali iscritte al Registro Imprese la cancellazione è un atto dovuto. SmartCAF gestisce questa pratica contestualmente alla chiusura della Partita IVA per garantire che il diritto camerale annuale non venga più addebitato e che l\'impresa risulti ufficialmente cessata in tutti i pubblici registri.',
      order: 3,
      category: 'Camera di Commercio',
    },
    {
      question: 'Posso chiudere una ditta individuale online senza andare allo sportello?',
      answer:
        'Certamente. Il servizio di SmartCAF è progettato per gestire l\'intero iter telematicamente. Caricando i documenti richiesti sulla nostra piattaforma, i nostri consulenti interfacceranno per tuo conto l\'Agenzia delle Entrate, la Camera di Commercio e gli enti previdenziali, rilasciandoti le ricevute ufficiali direttamente nella tua area riservata.',
      order: 4,
      category: 'Online',
    },
    {
      question: 'Quali costi fissi si smettono di pagare chiudendo la ditta con SmartCAF?',
      answer:
        'Attraverso la cessazione completa, smetterai di versare il diritto camerale annuo alla Camera di Commercio, i contributi previdenziali minimi obbligatori all\'INPS e l\'eventuale premio assicurativo INAIL. La nostra gestione integrata assicura che ogni ente sia informato correttamente, blindando la tua posizione da futuri accertamenti.',
      order: 5,
      category: 'Costi',
    },
  ],

  // Comunicazione Camera di Commercio
  'Comunicazione Camera Commercio': [
    {
      question: 'Qual è la differenza tra variazione Partita IVA e pratica Camera di Commercio?',
      answer:
        'Sebbene spesso avvengano insieme, sono due adempimenti distinti. La variazione P.IVA comunica i cambiamenti all\'Agenzia delle Entrate per fini fiscali, mentre la pratica Camera di Commercio (ComUnica) aggiorna il Registro Imprese. Per ditte individuali, artigiani e commercianti, la comunicazione al Registro Imprese è obbligatoria per rendere pubblici i cambiamenti della propria attività e garantirne la validità legale.',
      order: 1,
      category: 'Differenze',
    },
    {
      question: 'Chi è obbligato a presentare la pratica al Registro Imprese?',
      answer:
        'L\'obbligo riguarda tutti i soggetti iscritti alla Camera di Commercio, come Ditte Individuali, Società (Snc, Srl, Sas), Artigiani e Commercianti. I liberi professionisti iscritti esclusivamente alla Gestione Separata INPS non sono invece tenuti a questo adempimento, a meno che non costituiscano una società o una ditta individuale commerciale.',
      order: 2,
      category: 'Obbligatorietà',
    },
    {
      question: 'Quali modifiche aziendali devono essere comunicate obbligatoriamente?',
      answer:
        'Secondo la legge, è necessario comunicare tramite ComUnica qualsiasi variazione rilevante, tra cui: il trasferimento della sede legale, l\'apertura o chiusura di unità locali (negozi, magazzini, uffici), la modifica dell\'oggetto sociale (ciò che l\'impresa fa concretamente) e la nomina di nuovi amministratori o responsabili tecnici.',
      order: 3,
      category: 'Variazioni',
    },
    {
      question: 'Cosa succede se non si comunica una variazione alla Camera di Commercio?',
      answer:
        'Il mancato aggiornamento del Registro Imprese comporta sanzioni amministrative pecuniarie che variano in base al ritardo. Inoltre, non comunicare i cambiamenti può bloccare l\'ottenimento di certificazioni, visure aggiornate necessarie per partecipare a bandi, richiedere prestiti bancari o stipulare nuovi contratti con fornitori.',
      order: 4,
      category: 'Sanzioni',
    },
    {
      question: 'Quanto costa presentare una pratica in Camera di Commercio con SmartCaf?',
      answer:
        'Il costo del servizio professionale di SmartCaf si aggiunge ai costi fissi ministeriali (Diritti di Segreteria e Imposta di Bollo), che variano in base alla tipologia di pratica e di impresa. Se sei un abbonato SmartCaf Premium, sulla nostra tariffa professionale ricevi immediatamente uno sconto del 20%, assicurandoti il supporto di un esperto al miglior prezzo possibile.',
      order: 5,
      category: 'Costi',
    },
  ],

  // Assegno Unico
  'Assegno Unico': [
    {
      question: 'Cosa determina l\'importo dell\'Assegno Unico e Universale?',
      answer:
        'L\'importo dell\'Assegno Unico e Universale è determinato dalla condizione economica del nucleo familiare, calcolata in base all\'Indicatore della Situazione Economica Equivalente (ISEE) valido al momento della richiesta.',
      order: 1,
      category: 'Importi',
    },
    {
      question: 'Posso richiedere l\'Assegno Unico e Universale per un figlio con disabilità di qualsiasi età?',
      answer:
        'Sì, l\'Assegno Unico e Universale può essere richiesto per ogni figlio con disabilità a carico, indipendentemente dalla loro età.',
      order: 2,
      category: 'Requisiti',
    },
    {
      question: 'L\'Assegno Unico e Universale è soggetto a tassazione?',
      answer:
        'No, l\'Assegno Unico e Universale è esente da tassazione e non è considerato come reddito imponibile.',
      order: 3,
      category: 'Tassazione',
    },
  ],

  // Assegno di Inclusione
  'Assegno di inclusione': [
    {
      question: 'Quanti anni di residenza devo avere per chiedere l\'ADI?',
      answer:
        'Bisogna essere residente in Italia per almeno cinque anni, di cui gli ultimi due anni in modo continuativo. La residenza in Italia è richiesta anche per i componenti del nucleo familiare che rientrano nei parametri della scala di equivalenza.',
      order: 1,
      category: 'Residenza',
    },
    {
      question: 'Se ho dato le dimissioni volontarie posso chiedere l\'ADI?',
      answer:
        'Non ha diritto all\'Assegno di inclusione il nucleo familiare di cui un componente, risulta disoccupato a seguito di dimissioni volontarie nei 12 mesi successivi alla data delle dimissioni, fatte salve le dimissioni per giusta causa, nonché le risoluzioni consensuali del contratto di lavoro.',
      order: 2,
      category: 'Dimissioni',
    },
    {
      question: 'Per quanto tempo posso percepire l\'assegno di inclusione?',
      answer:
        'Il beneficio è erogato mensilmente per un periodo continuativo non superiore a 18 mesi e può essere rinnovato, previa sospensione di un mese, per ulteriori 12 mesi. Allo scadere dei periodi di rinnovo è sempre prevista la sospensione di un mese',
      order: 3,
      category: 'Durata',
    },
    {
      question: 'Quanto deve essere il valore Isee?',
      answer:
        'ISEE in corso di validità di valore non superiore a euro 9.360; nel caso di nuclei familiari con minorenni, l\'ISEE è calcolato ai sensi dell\'art. 7 del DPCM n. 159 del 2013.',
      order: 4,
      category: 'ISEE',
    },
    {
      question: 'Come viene erogato l\'ADI?',
      answer:
        'Il contributo economico è erogato attraverso uno strumento di pagamento elettronico ricaricabile, denominato "Carta di inclusione", potranno essere eseguiti prelievi di contante entro un limite mensile di 100 euro per un singolo individuo, moltiplicato per la scala di equivalenza e potrà essere eseguito un bonifico mensile in favore del locatore indicato nel contratto di locazione.',
      order: 5,
      category: 'Erogazione',
    },
    {
      question: 'Cosa devo fare se Inizio un\'attività lavorativa mentre percepisco l\'ADI?',
      answer:
        'Entro 30 giorni dall\'avvio dell\'attività lavorativa, il lavoratore dovrà darne comunicazione all\'INPS, l\'erogazione del beneficio è sospesa fintanto che tale obbligo non è ottemperato e, comunque, non oltre tre mesi dall\'avvio dell\'attività, decorsi i quali il diritto alla prestazione decade.',
      order: 6,
      category: 'Variazioni',
    },
    {
      question: 'Se inizio un\'attività lavorativa perdo l\'ADI?',
      answer:
        'In caso di avvio di un\'attività di lavoro dipendente da parte di uno o più componenti il nucleo familiare, il reddito da lavoro percepito non concorre alla determinazione del beneficio economico, entro il limite massimo di 3.000 euro lordi annui, mentre il reddito da lavoro eccedente tale soglia concorre alla determinazione del beneficio economico a decorrere dal mese successivo a quello della variazione.',
      order: 7,
      category: 'Lavoro',
    },
    {
      question: 'Entro quanto tempo vanno comunicate le variazione riguardante le condizioni e i requisiti di accesso?',
      answer:
        'È fatto obbligo al beneficiario dell\'Assegno di comunicare ogni variazione riguardante le condizioni e i requisiti di accesso alla misura e per il suo mantenimento, a pena di decadenza dal beneficio, entro quindici giorni dall\'evento modificativo. In caso di variazione del nucleo familiare in corso di fruizione del beneficio, l\'interessato presenta entro un mese dalla variazione, a pena di decadenza dal beneficio, una dichiarazione sostitutiva unica (DSU) aggiornata.',
      order: 8,
      category: 'Comunicazioni',
    },
    {
      question: 'Se il beneficio decade, posso rifare la richiesta?',
      answer:
        'Se il nucleo familiare è decaduto per mancata partecipazione alle politiche attive da parte di un componente può fare nuova domanda solo dopo 6 mesi dalla revoca o decadenza.',
      order: 9,
      category: 'Decadenza',
    },
    {
      question: 'Posso fare richiesta di ADI anche se sono percettore di RDC?',
      answer:
        'I percettori del Reddito di cittadinanza e della Pensione di cittadinanza che rientrano nella prima categoria di nuclei con soggetti disabili, anziani o minori , continueranno a ricevere le somme spettanti non oltre il 31 dicembre 2023 mentre dal 1 gennaio 2024 rientreranno nel campo di applicazione dell\'Assegno di inclusione .',
      order: 10,
      category: 'RDC',
    },
  ],

  // Pension Services - Estratto Conto Certificato
  'Estratto Conto Certificato e Calcolo Pensione': [
    {
      question: 'In quanto tempo viene elaborata la mia richiesta?',
      answer:
        'Il team trasmette la richiesta dell\'estratto contro certificato entro 6h dalla richiesta, l\'INPS emette il documento entro 30 giorni e lo riceviamo noi tramite PEC. Una volta ricevuto procediamo con il calcolo del periodo mancante alla pensione e glielo comunichiamo.',
      order: 1,
      category: 'Tempi',
    },
  ],

  // Pension Services - Ricostituzione Reddituale
  'Ricostituzione Reddituale': [
    {
      question: 'Cos\'è la ricostituzione reddituale INPS e a cosa serve?',
      answer:
        'La ricostituzione reddituale INPS è il servizio che permette ai pensionati di comunicare all\'INPS i redditi percepiti dopo la pensione (lavoro, affitti, ecc.) per verificare il cumulo pensione-reddito e assicurare un adeguamento pensione corretto.',
      order: 1,
      category: 'Definizione',
    },
    {
      question: 'Chi deve richiedere la ricostituzione reddituale INPS',
      answer:
        'Devono richiedere la ricostituzione reddituale INPS i pensionati INPS (sia pubblici che privati) che, dopo essere andati in pensione, hanno iniziato a percepire redditi aggiuntivi di qualsiasi natura.',
      order: 2,
      category: 'Beneficiari',
    },
    {
      question: 'Come si fa la domanda di ricostituzione reddituale all\'INPS?',
      answer:
        'La domanda di ricostituzione reddituale INPS può essere presentata online tramite il sito INPS con SPID/CIE/CNS, tramite Patronato o tramite il Contact Center INPS.',
      order: 3,
      category: 'Procedura',
    },
    {
      question: 'Perché è importante comunicare i redditi all\'INPS dopo la pensione?',
      answer:
        'Comunicare i redditi post-pensione all\'INPS tramite la ricostituzione reddituale è importante per rispettare gli obblighi di legge sul cumulo pensione-reddito, evitare indebiti pensionistici e garantire la corretta erogazione della pensione.',
      order: 4,
      category: 'Importanza',
    },
    {
      question: 'Quali sono le conseguenze della ricostituzione reddituale INPS?',
      answer:
        'La ricostituzione reddituale INPS può portare alla conferma dell\'importo pensionistico, a un suo adeguamento (generalmente una riduzione se si superano i limiti di cumulo), o alla necessità di adempiere a specifici obblighi di comunicazione verso l\'INPS.',
      order: 5,
      category: 'Conseguenze',
    },
  ],
};

/**
 * Seed FAQs from DATA.md
 */
export async function seedFaqsFromData() {
  try {
    console.log('\n✨ Inizio Seeding FAQs da DATA.md...\n');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceRepo = AppDataSource.getRepository(Service);
    const faqRepo = AppDataSource.getRepository(Faq);

    let faqsCreated = 0;
    let servicesUpdated = 0;

    for (const [serviceName, faqsList] of Object.entries(FAQS_DATA)) {
      // Find the service by name (case-insensitive)
      const service = await serviceRepo.findOne({
        where: {
          name: serviceName,
        },
      });

      if (!service) {
        console.log(`⚠️  Servizio non trovato: ${serviceName}`);
        continue;
      }

      console.log(`\n📋 Elaborazione: ${serviceName} (ID: ${service.id})`);

      for (const faqData of faqsList) {
        // Check if FAQ already exists
        const existingFaq = await faqRepo.findOne({
          where: {
            serviceId: service.id,
            question: faqData.question,
          },
        });

        if (!existingFaq) {
          const faq = faqRepo.create({
            serviceId: service.id,
            question: faqData.question,
            answer: faqData.answer,
            order: faqData.order,
            category: faqData.category || 'General',
            isActive: true,
          });

          await faqRepo.save(faq);
          faqsCreated++;
          console.log(`   ✅ FAQ creato: "${faqData.question.substring(0, 50)}..."`);
        } else {
          // Update if needed
          if (
            existingFaq.answer !== faqData.answer ||
            existingFaq.order !== faqData.order || 
            existingFaq.category !== faqData.category
          ) {
            existingFaq.answer = faqData.answer;
            existingFaq.order = faqData.order;
            existingFaq.category = faqData.category || 'General';
            await faqRepo.save(existingFaq);
            console.log(`   🔄 FAQ aggiornato: "${faqData.question.substring(0, 50)}..."`);
          } else {
            console.log(`   ⏭️  FAQ già esistente (non modificato)`);
          }
        }
      }

      servicesUpdated++;
    }

    console.log('\n✨ Seeding FAQs completato con successo!\n');
    console.log('📊 Riepilogo Finale:');
    console.log(`   Servizi elaborati: ${servicesUpdated}`);
    console.log(`   FAQs creati: ${faqsCreated}`);
    console.log('\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Errore durante il seeding:', error);
    throw error;
  }
}

// Run if this is the main module
if (require.main === module) {
  seedFaqsFromData();
}
