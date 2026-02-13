import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';

/**
 * Service descriptions extracted from client-provided DATA.md
 * This script updates all services with their descriptions
 */
const SERVICES_DESCRIPTIONS = {
  'ISEE Ordinario 2026':
    "L'ISEE Ordinario 2026 è un indicatore utilizzato per valutare la situazione economica di una famiglia. È fondamentale per determinare l'accesso a diverse prestazioni e agevolazioni sociali, come l'Assegno Unico e Universale, agevolazioni per l'istruzione, contributi per la casa, e altre forme di sostegno economico",

  'ISEE Universitario 2026':
    'The ISEE University also known as ISEEU is an indicator determined by a specific type of DSU required of the student by Universities and institutions for the right to study in order to access benefits such as scholarships, accommodation and canteen services, as well as',

  'ISEE Socio Sanitario 2026':
    'The ISEE Socio Sanitario is the indicator of the economic situation necessary to obtain home care services or to access residential or semi-residential facilities, where it is considered to define the rates and contributions to be paid by the user',

  'ISEE Minorenni 2026':
    'The ISEE Minorenni (Indicator of Economic Situation for Minors) is a tool designed for children of unmarried and uncohabiting parents and is used to apply for social benefits or bonuses intended for children in this particular situation. It serves to determine the economic situation of the...',

  'ISEE Corrente':
    'The Current ISEE is a fundamental tool for accessing bonuses, benefits, social benefits, and subsidies that require an updated ISEE that is more truthful than the income from two years prior (on which the ordinary ISEE is based).',

  'Disoccupazione NASPI':
    'La NASpI (Nuova Assicurazione Sociale per l\'Impiego) è un sostegno economico fondamentale per i lavoratori che hanno perso involontariamente il proprio impiego. Nel 2024, questa indennità rappresenta un pilastro del sistema di welfare italiano, offrendo un supporto concreto durante la ricerca di una nuova occupazione. La NASpI è un\'indennità mensile di disoccupazione, erogata dall\'INPS, destinata ai lavoratori dipendenti che hanno perso il lavoro per cause non dipendenti dalla loro volontà (licenziamento, fine contratto, ecc.).',

  'Disoccupazione Agricola':
    "L'indennità di disoccupazione agricola è una prestazione economica a cui hanno diritto i lavoratori agricoli dipendenti e le figure equiparate",

  'Anticipo NASPI':
    "La NASpI anticipata consiste nella liquidazione anticipata in un'unica soluzione dell'importo complessivo della NASpI. Sull'importo erogato è operata la trattenuta IRPEF secondo la normativa vigente.",

  'DID - Dichiarazione di Immediata Disponibilità':
    'La Did online - Dichiarazione di immediata disponibilità al lavoro, è la dichiarazione che determina formalmente l\'inizio dello stato di disoccupazione di una persona.',

  'PAD NASPI/DIS-COLL':
    'Il Patto di Attivazione Digitale (PAD) rappresenta un passaggio cruciale per tutti i beneficiari di NASpI (Nuova Assicurazione Sociale per l\'Impiego) e DIS-COLL (Indennità di disoccupazione per i collaboratori coordinati e continuativi). Introdotto a partire dal 24 novembre 2024. L\'obiettivo primario del PAD è quello di agevolare e velocizzare il reinserimento nel mondo del lavoro, fornendo ai beneficiari strumenti e opportunità concrete. Attraverso la piattaforma SIISL, gli utenti possono accedere a offerte di lavoro mirate, percorsi di formazione professionale e servizi di orientamento personalizzati.',

  'Naspi-Com':
    'Il servizio NASpI Com ti consente, di inviare online tutte le comunicazioni relative alla variazione della tua situazione (cambio di indirizzo, variazione modalità di pagamento e variazione della situazione lavorativa e reddituale)',

  '730':
    'Dichiarazione dei redditi modello 730 per le persone fisiche',

  'Integrazione 730':
    'Integrazione della dichiarazione dei redditi modello 730',

  'Dimissioni Volontarie':
    'Le "dimissioni volontarie" sono una procedura attraverso la quale un dipendente decide di rinunciare al proprio posto di lavoro attuale. Solitamente, il dipendente deve comunicare le proprie dimissioni rispettando un preavviso previsto dalla legge o dal contratto di lavoro, al fine di permettere all\'azienda di organizzarsi per la sostituzione del dipendente o per altre esigenze aziendali',

  'Dimissioni per giusta causa':
    'Le "dimissioni volontarie per giusta causa" sono una procedura attraverso la quale un dipendente decide di rinunciare al proprio posto di lavoro attuale. Solitamente, il dipendente deve comunicare le proprie dimissioni rispettando un preavviso previsto dalla legge o dal contratto di lavoro, al fine di permettere all\'azienda di organizzarsi per la sostituzione del dipendente o per altre esigenze aziendali',

  'Revoca Dimissioni Volontarie':
    'Il lavoratore ha sempre la possibilità di revocare le dimissioni o la risoluzione consensuale entro 7 giorni successivi alla comunicazione. Decorso il termine di 7 giorni utile per la revoca, per lo stesso rapporto di lavoro sarà possibile inviare nuove dimissioni, non revocabili.',

  'Rateizzazione Cartelle Agenzia delle Entrate':
    "Il servizio di rateizzazione dei debiti dell'Agenzia delle Entrate offre ai contribuenti la possibilità di diluire il pagamento dei loro debiti fiscali in comode rate mensili.",

  'Consulenza':
    'Servizio di consulenza, utile a risolvere questioni in campo fiscale, previdenziale, pensionistico, colf e badanti e immigrazione.',

  'Estratto Conto Previdenziale':
    'L\'Estratto conto contributivo è un documento che elenca tutti i contributi effettuati all\'INPS in favore del lavoratore.',

  'Comunicazione INPS':
    'Il servizio "Comunicazione INPS" consente di entrare in contatto con l\'INPS per sollecitare la risoluzione di problematiche riguardanti richieste che risultano ferme o in sospeso. Attraverso questa modalità di comunicazione, è possibile segnalare eventuali ritardi o anomalie nei procedimenti riguardanti prestazioni sociali, contributi o altre pratiche gestite dall\'INPS',

  'Cittadinanza Italiana per Residenza':
    'La cittadinanza può essere richiesta dagli stranieri che risiedono in Italia da almeno dieci anni per gli extracomunitari, 5 anni per i cittadini comunitari, 4 anni per i cittadini apolidi e sono in possesso di determinati requisiti. In particolare il richiedente deve dimostrare di avere redditi sufficienti al sostentamento, di non avere precedenti penali, di non essere in possesso di motivi ostativi per la sicurezza della Repubblica',

  'Cittadinanza Italiana per Matrimonio':
    'Il coniuge, straniero o apolide, di cittadino italiano può acquistare la cittadinanza italiana quando, dopo il matrimonio, risieda legalmente da almeno due anni nel territorio della Repubblica, oppure dopo tre anni dalla data del matrimonio se residente all\'estero, qualora, al momento dell\'adozione del decreto non sia intervenuto lo scioglimento, l\'annullamento o la cessazione degli effetti civili del matrimonio e non sussista la separazione personale dei coniugi',

  'Ricongiungimento Familiare':
    'Il ricongiungimento familiare permette ai familiari di cittadini extracomunitari di ottenere un visto e un permesso di soggiorno per vivere in Italia. Il cittadino straniero può richiedere il ricongiungimento familiare per la sua famiglia solo se ha un permesso di soggiorno valido per minimo un anno',

  'Test di conoscenza della lingua Italiana A2/B1':
    'Il cittadino straniero che vive legalmente in Italia da più di 5 anni e intende chiedere il permesso CE per soggiornanti di lungo periodo (articolo 9 testo unico immigrazione) deve sostenere e superare il test di conoscenza della lingua italiana',

  'Busta Paga Colf e Badanti':
    'Ottimizza la gestione amministrativa delle tue collaboratrici domestiche con il nostro servizio dedicato. Grazie alla nostra esperienza e competenza, garantiamo l\'elaborazione precisa e puntuale delle buste paga mensili per le tue colf. Affidati a noi per assicurarti che ogni aspetto legato alla retribuzione delle tue collaboratrici sia gestito in modo professionale e conforme alle normative vigenti.',

  'MAV trimestrale/Bollettino Colf e Badanti':
    'Il nostro servizio di bollettino MAV trimestrale per colf e badanti ti offre un modo conveniente e affidabile per gestire le contribuzioni previdenziali. Con noi, puoi generare e inviare facilmente i bollettini MAV trimestrali, assicurandoti di rispettare le scadenze e gli obblighi fiscali. Lascia a noi la complessa gestione delle pratiche burocratiche, mentre tu ti concentri sulle tue attività quotidiane. Ottimizza la tua gestione amministrativa e assicurati la conformità normativa con il nostro servizio di bollettino MAV trimestrale per colf e badanti',

  'Assunzione Colf e Badanti':
    'La comunicazione di assunzione si presenta all\'INPS entro le ore 24 del giorno precedente (anche se festivo) a quello di instaurazione del rapporto di lavoro. La comunicazione ha efficacia anche nei confronti dei servizi competenti, del Ministero del Lavoro e delle Politiche Sociali, del Ministero della Salute, dell\'INAIL e della prefettura/ufficio territoriale del Governo.',

  'CU Colf e Badanti':
    'Il CU (Certificazione Unica) è un documento fondamentale per i lavoratori domestici come colf e badanti. Serve per attestare i redditi percepiti durante l\'anno e viene utilizzato per la dichiarazione dei redditi.',

  'Lettera di Assunzione Colf e Badanti':
    'Il nostro servizio di lettera di assunzione è la soluzione ideale per te. Con la nostra assistenza, potrai redigere una lettera di assunzione professionale e conforme alle normative vigenti in modo rapido e semplice. La lettera include tutti i dettagli necessari, come mansioni, orario di lavoro, retribuzione e altri accordi contrattuali',

  'Cessazione Colf e Badanti':
    'Chi assume un lavoratore domestico può interrompere il contratto di lavoro tramite la procedura di cessazione. La comunicazione di cessazione deve essere presentata all\'INPS entro cinque giorni dall\'evento. La comunicazione ha efficacia anche nei confronti dei servizi competenti, del Ministero del Lavoro e delle Politiche Sociali, dell\'INAIL nonché della prefettura ufficio territoriale del Governo.',

  'Variazione Colf e Badanti':
    'Variazione del rapporto di lavoro domestico tra un collaboratore familiare e un datore di lavoro.',

  'Assegno di Maternità':
    'E\' un contributo economico, erogato dall\'INPS, spettante alle madri che hanno partorito, adottato o ricevuto in affidamento preadottivo un bambino.',

  'Bonus Nuovi Nati':
    'Il Bonus Nuovi Nati, spesso chiamato anche Bonus Bebè, è un contributo economico erogato dallo Stato (o a livello regionale, a seconda delle normative vigenti) per sostenere le famiglie in occasione della nascita o dell\'adozione di un bambino. In sostanza, si tratta di un aiuto finanziario destinato a contribuire alle spese iniziali legate all\'arrivo di un nuovo membro nel nucleo familiare. L\'importo, i requisiti per accedervi (come ad esempio il reddito ISEE), e le modalità di erogazione (ad esempio, un pagamento unico o rateizzato) possono variare a seconda delle leggi e dei bandi in vigore al momento della nascita o dell\'adozione.',

  'Congedo Parentale Dipendenti':
    'Il congedo parentale è un periodo di astensione facoltativo dal lavoro concesso ai genitori naturali, adottivi o affidatari per prendersi cura del bambino nei suoi primi anni di vita e fino a 12 anni d\'età per soddisfare i suoi bisogni affettivi e relazionali. In caso di parto, adozione o affidamento plurimi, il diritto al congedo parentale spetta alle stesse condizioni per ogni bambino',

  'Maternità Obbligatoria Post Parto':
    'La maternità obbligatoria post parto è Il congedo di maternità obbligatoria da conseguire post parto.',

  'Indennità di Maternità Obbligatoria Dipendenti':
    'Il congedo di maternità è il periodo di astensione obbligatoria dal lavoro riconosciuto alle lavoratrici dipendenti durante la gravidanza e il puerperio e consiste in un periodo di astensione obbligatoria dal lavoro per la madre che copre un arco di tempo pari a 5 mesi a cavallo del parto, ovvero due mesi precedenti la data presunta del parto e tre dopo, oppure 1 mese e 4 o infine, novità dal 2019, 5 mesi subito dopo il parto',

  'Maternità Anticipata Dipendenti':
    'Il congedo di maternità è il periodo di astensione obbligatoria dal lavoro durante la gravidanza e il puerperio e consiste in un periodo di astensione obbligatoria dal lavoro per la madre che copre un arco di tempo pari a 5 mesi a cavallo del parto, ovvero due mesi precedenti la data presunta del parto e tre dopo. Si può anche scegliere 1 mese prima e 4 mesi dopo il parto o infine, 5 mesi subito dopo il parto (MATERNITA\' FLESSIBILE), tale scelta è della lavoratrice, purché vi sia un attestato del medico del Servizio sanitario nazionale o il medico del lavoro che certifichino l\'assenza di rischio alla salute della lavoratrice e alla corretta prosecuzione della gravidanza.',

  'Congedo Parentale Gestione Separata':
    'Il congedo parentale è un periodo di astensione facoltativo dal lavoro concesso ai genitori naturali, adottivi o affidatari per prendersi cura del bambino nei suoi primi anni di vita e fino a 12 anni d\'età per soddisfare i suoi bisogni affettivi e relazionali. In caso di parto, adozione o affidamento plurimi, il diritto al congedo parentale spetta alle stesse condizioni per ogni bambino',

  'Congedo Parentale Autonomi':
    'Il servizio permette di presentare la domanda di indennità per congedo parentale per lavoratrici autonome che abbiano effettuato il versamento dei contributi relativi al mese precedente il periodo di astensione lavorativa effettiva. Il congedo parentale è un periodo di astensione facoltativo dal lavoro concesso ai genitori naturali, adottivi o affidatari per prendersi cura del bambino nei suoi primi anni di vita e fino a 12 anni d\'età per soddisfare i suoi bisogni affettivi e relazionali. In caso di parto, adozione o affidamento plurimi, il diritto al congedo parentale spetta alle stesse condizioni per ogni bambino.',

  'Invalidità Civile':
    'L\'invalidità civile è una misura di assistenza sociale che garantisce assistenza sociale e mantenimento agni inabili al lavoro.',

  'Permessi 104/92 per assistenza ai familiari disabili':
    'La Legge n. 104/92 concede ai lavoratori con disabilità grave il diritto di usufruire di tre giorni di permesso retribuito al mese, oppure di due ore di permesso al giorno. Allo stesso modo, i lavoratori che assistono un familiare con disabilità grave hanno la possibilità di assentarsi dal lavoro per tre giorni al mese con permessi retribuiti, che possono essere utilizzati anche a livello orario',

  'Estratto Conto Certificato e Calcolo Pensione':
    'Richiesta dell\'estratto conto certificativo utile al calcolo della pensione e il calcolo effettivo del periodo che manca per andare in pensione.',

  'Assegno Sociale':
    'L\'assegno sociale è una prestazione economica a sostegno dei cittadini italiani e stranieri residenti in Italia che si trovano in condizioni economiche disagiate. A differenza della pensione di vecchiaia, l\'assegno sociale non richiede il versamento di contributi previdenziali.',

  'Pensione Indiretta':
    'La pensione ai superstiti è un trattamento pensionistico riconosciuto in caso di decesso del dell\'assicurato in favore dei familiari superstiti. Ed è riconosciuta nel caso in cui l\'assicurato abbia perfezionato 15 anni di anzianità assicurativa e contributiva ovvero 5 anni di anzianità assicurativa e contributiva di cui almeno 3 anni nel quinquennio precedente la data del decesso',

  'Ricostituzione Reddituale':
    'Il servizio di ricostituzione reddituale INPS è una procedura amministrativa che consente ai pensionati di comunicare all\'Istituto Nazionale della Previdenza Sociale (INPS) la sussistenza di redditi diversi dalla pensione percepiti successivamente alla data di decorrenza del trattamento pensionistico. Attraverso questo servizio, il pensionato informa l\'INPS in merito a nuove entrate economiche, quali ad esempio redditi da lavoro (autonomo o dipendente, anche occasionale), redditi da locazione, o altri tipi di proventi che si sono manifestati dopo l\'inizio della fruizione della pensione',

  'Modello Redditi Persone Fisiche Senza P.IVA':
    'E\' la dichiarazione dei redditi per le persone fisiche che hanno alcuni redditi che non permettono l\'elaborazione del modello 730 e le persone fisiche che non hanno fatto in tempo ad elaborare il modello 730 prima della scadenza',

  'Modello Redditi P.IVA Forfettaria':
    'E\' la dichiarazione dei redditi per le persone fisiche possessori di Partita IVA in regime forfettario',

  'Integrazione Modello Redditi PF':
    'Integrazione della dichiarazione dei redditi (730 e/o Modello Redditi).',

  'Apertura Partita IVA':
    'Servizio di apertura e attivazione partita IVA con pratiche complete presso Camera di Commercio e Agenzia delle Entrate',

  'Variazione Partita IVA':
    'Servizio di variazione e aggiornamento dati partita IVA',

  'Cessazione Ditta Individuale':
    'Servizio di cessazione partita IVA e ditta individuale',

  'Comunicazione Camera Commercio':
    'Servizio di comunicazione presso la Camera di Commercio',

  'Assegno Unico':
    'L\'Assegno Unico è un contributo economico mensile erogato dall\'INPS a favore di nuclei familiari che hanno figli a carico',

  'Assegno di Inclusione':
    'Prestazione economica destinata ai nuclei familiari in condizioni di povertà',

  'Modello F24 Cedolare Secca':
    'Servizio di compilazione e gestione del modello F24 per il versamento della cedolare secca su immobili locati',

  'Dichiarazione e Calcolo IMU':
    'Servizio di compilazione dichiarazione IMU e calcolo delle imposte comunali su immobili',
};

async function seedServiceDescriptions() {
  try {
    await AppDataSource.initialize();
    const serviceRepository = AppDataSource.getRepository(Service);

    console.log('✨ Inizio Seeding Descrizioni Servizi...\n');

    let servicesUpdated = 0;
    let servicesNotFound = [];

    for (const [serviceName, description] of Object.entries(SERVICES_DESCRIPTIONS)) {
      try {
        const service = await serviceRepository.findOne({
          where: { name: serviceName },
        });

        if (!service) {
          servicesNotFound.push(serviceName);
          console.log(`⚠️  Servizio non trovato: ${serviceName}`);
          continue;
        }

        if (service.description !== description) {
          service.description = description;
          await serviceRepository.save(service);
          servicesUpdated++;
          console.log(`✅ Descrizione aggiornata: ${serviceName}`);
        } else {
          console.log(`⏭️  Descrizione già presente (non modificato): ${serviceName}`);
        }
      } catch (error) {
        console.error(`❌ Errore elaborando ${serviceName}:`, error.message);
      }
    }

    console.log('\n✨ Seeding Descrizioni Servizi completato con successo!');
    console.log('📊 Riepilogo Finale:');
    console.log(`   Servizi elaborati: ${Object.keys(SERVICES_DESCRIPTIONS).length}`);
    console.log(`   Descrizioni aggiornate: ${servicesUpdated}`);
    if (servicesNotFound.length > 0) {
      console.log(`   Servizi non trovati: ${servicesNotFound.length}`);
      servicesNotFound.forEach((name) => console.log(`      - ${name}`));
    }

    await AppDataSource.destroy();
    process.exit(0);
  } catch (error) {
    console.error('❌ Errore durante il seeding delle descrizioni:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

seedServiceDescriptions();
