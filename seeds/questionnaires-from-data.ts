// Comprehensive questionnaire definitions matching client spec and SmartCaf.it
// Each service has specific questionnaires mapped to service codes
// Structure: personal_info (automatic) → service_questionnaires → declarations (automatic)
// Note: If a questionnaire array includes a section with id='declarations_authorization',
//       the default declarations section will NOT be appended (custom variant used instead).

// =====================================================================
// SHARED QUESTIONNAIRE BUILDING BLOCKS
// =====================================================================

const HOUSEHOLD_SECTION = (includeDocuments = true) => ({
  id: 'household_info',
  title: 'Nucleo Familiare',
  description: 'Household composition and family members',
  fields: [
    {
      name: 'solo',
      label: 'Sei solo?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 1,
    },
    {
      name: 'family_members',
      label: 'Componenti del nucleo familiare',
      type: 'dynamic_list',
      required: false,
      order: 2,
      dependsOn: { field: 'solo', value: 'No' },
      description: 'Ripetere per ogni componente del nucleo',
      subFields: [
        {
          name: 'nome_cognome',
          label: 'Nome e Cognome',
          type: 'text',
          required: true,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice Fiscale',
          type: 'text',
          required: true,
          maxLength: 16,
        },
        {
          name: 'data_nascita',
          label: 'Data di nascita',
          type: 'date',
          required: true,
        },
        {
          name: 'rapporto_parentela',
          label: 'Rapporto di parentela col dichiarante',
          type: 'select',
          options: ['Coniuge', 'Figlio/a', 'Genitore', 'Altro'],
          required: true,
        },
        ...(includeDocuments
          ? [
              {
                name: 'isee_anno_scorso',
                label: "ISEE L'anno scorso",
                type: 'file',
                required: false,
                description: 'Non obbligatorio',
              },
              {
                name: 'codice_fiscale_tessera',
                label: 'Codice Fiscale / Tessera Sanitaria',
                type: 'file',
                required: true,
                description: 'Obbligatorio',
              },
            ]
          : []),
        {
          name: 'disabilita',
          label: 'Presenza di persone con disabilità?',
          type: 'select',
          options: ['Nessuna', 'Media', 'Grave', 'Non autosufficiente'],
          required: true,
        },
        {
          name: 'certificato_disabilita',
          label: "Certificato medico d'INPS",
          type: 'file',
          required: true,
          description: 'Obbligatorio se disabilità non è Nessuna',
          dependsOn: { field: 'disabilita', value: 'Nessuna', isNot: true },
        },
        {
          name: 'attivita_lavorativa',
          label: 'Attività lavorativa',
          type: 'select',
          options: [
            'Lavoro dipendente',
            'Autonomo',
            'Pensione',
            'Disoccupato',
            'Studente',
            'Casalinga',
            'Altro',
          ],
          required: true,
        },
      ],
    },
    {
      name: 'redditi_esteri',
      label: 'Redditi esteri?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 3,
    },
    {
      name: 'redditi_esteri_file',
      label: 'Documentazione redditi esteri',
      type: 'file',
      required: true,
      order: 4,
      dependsOn: { field: 'redditi_esteri', value: 'Sì' },
    },
    {
      name: 'assegni_mantenimento',
      label: 'Assegni di mantenimento percepiti?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 5,
    },
    {
      name: 'assegni_mantenimento_file',
      label: 'Documentazione assegni di mantenimento',
      type: 'file',
      required: true,
      order: 6,
      dependsOn: { field: 'assegni_mantenimento', value: 'Sì' },
    },
    {
      name: 'redditi_affitti',
      label: 'Redditi da affitti?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 7,
    },
    {
      name: 'redditi_affitti_file',
      label: 'Documentazione redditi da affitti',
      type: 'file',
      required: true,
      order: 8,
      dependsOn: { field: 'redditi_affitti', value: 'Sì' },
    },
    {
      name: 'altri_redditi',
      label: 'Altri redditi imponibili?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 9,
    },
    {
      name: 'altri_redditi_file',
      label: 'Documentazione altri redditi imponibili',
      type: 'file',
      required: true,
      order: 10,
      dependsOn: { field: 'altri_redditi', value: 'Sì' },
    },
  ],
});

const FINANCIAL_ASSETS_SECTION = {
  id: 'patrimonio_mobiliare',
  title: 'Patrimonio Mobiliare – al 31/12/2024',
  description: 'Financial assets for every household member',
  fields: [
    {
      name: 'ha_conti_correnti',
      label: 'Hai conti correnti o conti di risparmio?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 1,
    },
    {
      name: 'giacenza_media_file',
      label: 'Giacenza media 2024',
      type: 'file',
      required: true,
      order: 2,
      multiple: true,
      description: 'Puoi allegare più di un file o foto',
      dependsOn: { field: 'ha_conti_correnti', value: 'Sì' },
    },
    {
      name: 'ha_altri_investimenti',
      label: 'Hai altri investimenti o titoli?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 3,
    },
    {
      name: 'altri_investimenti_file',
      label: 'Documentazione altri investimenti',
      type: 'file',
      required: true,
      order: 4,
      multiple: true,
      description: 'Puoi allegare più di un file o foto',
      dependsOn: { field: 'ha_altri_investimenti', value: 'Sì' },
    },
  ],
};

const REAL_ESTATE_SECTION = {
  id: 'patrimonio_immobiliare',
  title: 'Patrimonio Immobiliare',
  description: 'Real estate assets',
  fields: [
    {
      name: 'possiede_immobili',
      label: 'Possiedi immobili?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 1,
    },
    {
      name: 'immobili',
      label: 'Beni immobili',
      type: 'dynamic_list',
      required: true,
      order: 2,
      description: 'Per ogni proprietà',
      dependsOn: { field: 'possiede_immobili', value: 'Sì' },
      subFields: [
        {
          name: 'tipo_immobile',
          label: 'Tipo immobile',
          type: 'select',
          options: ['Abitazione principale', 'Seconda casa', 'Terreno'],
          required: true,
        },
        {
          name: 'tipo_immobile_file',
          label: 'Documentazione immobile',
          type: 'file',
          required: false,
          multiple: true,
        },
        {
          name: 'percentuale_proprieta',
          label: 'Percentuale di proprietà',
          type: 'number',
          required: true,
        },
        {
          name: 'percentuale_proprieta_file',
          label: 'Documentazione percentuale proprietà',
          type: 'file',
          required: false,
        },
        {
          name: 'ha_mutuo',
          label: 'Mutuo residuo al 31/12/2024 (se presente)?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
        },
        {
          name: 'mutuo_file',
          label: 'Documentazione mutuo residuo',
          type: 'file',
          required: false,
          dependsOn: { field: 'ha_mutuo', value: 'Sì' },
        },
      ],
    },
  ],
};

const PRIMARY_RESIDENCE_SECTION = {
  id: 'residenza_principale',
  title: 'Residenza Principale',
  description: 'Primary residence details — only if applicable',
  fields: [
    {
      name: 'tipo_residenza',
      label: 'Casa di proprietà o affitto?',
      type: 'select',
      options: ['Proprietà', 'Affitto', 'Altro'],
      required: true,
      order: 1,
    },
    {
      name: 'contratto_affitto',
      label: 'Estremi contratto con Registrazione Agenzia delle Entrate',
      type: 'file',
      required: true,
      order: 2,
      description: 'Obbligatorio se in affitto',
      dependsOn: { field: 'tipo_residenza', value: 'Affitto' },
    },
  ],
};

const VEHICLES_SECTION = {
  id: 'veicoli',
  title: 'Veicoli',
  description: 'Vehicles for all family members',
  fields: [
    {
      name: 'ha_auto',
      label: 'Auto?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 1,
    },
    {
      name: 'targa_auto',
      label: 'Targa auto',
      type: 'text',
      required: true,
      order: 2,
      dependsOn: { field: 'ha_auto', value: 'Sì' },
    },
    {
      name: 'ha_moto',
      label: 'Moto?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 3,
    },
    {
      name: 'targa_moto',
      label: 'Targa moto',
      type: 'text',
      required: true,
      order: 4,
      dependsOn: { field: 'ha_moto', value: 'Sì' },
    },
    {
      name: 'ha_barche',
      label: 'Barche?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 5,
    },
    {
      name: 'targa_barche',
      label: 'Targa / Numero barca',
      type: 'text',
      required: true,
      order: 6,
      dependsOn: { field: 'ha_barche', value: 'Sì' },
    },
  ],
};

const SPECIAL_SITUATIONS_SECTION = {
  id: 'situazioni_particolari',
  title: 'Situazioni Particolari',
  description: 'Special family situations',
  fields: [
    {
      name: 'genitori_non_conviventi',
      label: 'Genitori non conviventi',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 1,
    },
    {
      name: 'coniuge_estero',
      label: "Coniuge residente all'estero",
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 2,
    },
    {
      name: 'separazione_legale',
      label: 'Separazione legale',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 3,
    },
    {
      name: 'figli_affidamento',
      label: 'Figli con affidamento',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 4,
    },
  ],
};

// =====================================================================
// DECLARATION VARIANTS
// =====================================================================

// Helper to build declaration sections with different checkbox text
const makeDeclarations = (
  mandatoryLabels: string[],
  optionalLabels: string[] = [],
  desc = 'Declarations & Authorization',
) => {
  const fields: any[] = [];
  let order = 1;
  for (const label of mandatoryLabels) {
    fields.push({
      name: `decl_mandatory_${order}`,
      label,
      type: 'checkbox',
      required: true,
      order,
    });
    order++;
  }
  for (const label of optionalLabels) {
    fields.push({
      name: `decl_optional_${order}`,
      label,
      type: 'checkbox',
      required: false,
      order,
    });
    order++;
  }
  fields.push({
    name: 'digital_signature',
    label: 'Firma Digitale',
    type: 'signature',
    required: true,
    order,
    description: 'Please provide your digital signature',
  });
  order++;
  fields.push({
    name: 'full_name_signature',
    label: 'Nome e Cognome',
    type: 'text',
    required: true,
    order,
    description: 'Full name for signature verification',
  });
  return {
    id: 'declarations_authorization',
    title: 'Dichiarazioni e Autorizzazioni',
    description: desc,
    fields,
  };
};

// Dimissioni & Patronato variant
const DECLARATIONS_PATRONATO = makeDeclarations(
  [
    'Dichiaro che i dati forniti sono veritieri',
    "Autorizzo il Patronato all'invio delle dimissioni volontarie",
    "Accetto l'informativa privacy (GDPR)",
  ],
  ['Desidero assistenza per NASpI o altri servizi Patronato'],
);

// 730 variant
const DECLARATIONS_730 = makeDeclarations(
  [
    'Dichiaro che i dati inseriti sono completi e veritieri',
    'Autorizzo il CAF alla trasmissione del Modello 730',
    "Accetto l'informativa privacy (GDPR)",
  ],
  ['Desidero assistenza per altri servizi fiscali'],
);

// Dichiarazione Redditi / F24 / IMU variant
const DECLARATIONS_REDDITI = makeDeclarations([
  'Dichiaro che i dati inseriti sono veritieri e completi',
  "Autorizzo il Patronato alla trasmissione telematica all'Agenzia delle Entrate",
  'Accetto informativa privacy GDPR',
  'Accetto responsabilità sulla correttezza dei dati',
]);

// Partita IVA variant (Apertura, Variazione)
const DECLARATIONS_PARTITA_IVA = makeDeclarations([
  'Dichiaro che i dati inseriti sono veritieri',
  "Autorizzo il Patronato / CAF alla trasmissione telematica all'Agenzia delle Entrate",
  'Accetto informativa privacy GDPR',
  "Accetto le responsabilità relative all'apertura della Partita IVA",
]);

// Variazione Partita IVA
const DECLARATIONS_VAR_PIVA = makeDeclarations([
  'Dichiaro che i dati inseriti sono veritieri',
  "Autorizzo il Patronato / CAF alla trasmissione telematica all'Agenzia delle Entrate",
  'Accetto informativa privacy GDPR',
  'Autorizzo le modifiche relative alla mia Partita IVA',
]);

// Cessazione Ditta Individuale
const DECLARATIONS_CESSAZIONE_DITA = makeDeclarations([
  'Dichiaro che i dati inseriti sono veritieri',
  "Autorizzo il Patronato / CAF alla trasmissione telematica all'Agenzia delle Entrate e INPS",
  'Accetto informativa privacy GDPR',
  'Accetto le responsabilità legate alla cessazione della ditta individuale',
]);

// Camera Commercio
const DECLARATIONS_CAM_COMMERCIO = makeDeclarations([
  'Dichiaro che i dati inseriti sono completi e veritieri',
  'Autorizzo il Patronato / CAF alla trasmissione telematica alla Camera di Commercio',
  'Accetto informativa privacy GDPR',
  'Accetto le responsabilità legali relative alla comunicazione',
]);

// Invalidità Civile
const DECLARATIONS_INVALIDITA = makeDeclarations([
  'Dichiaro che i dati sono veritieri',
  "Autorizzo il Patronato alla trasmissione telematica all'INPS",
  'Accetto informativa privacy GDPR',
  'Autorizzo trattamento dati sanitari',
]);

// Contratti di Locazione
const DECLARATIONS_LOCAZIONE = makeDeclarations([
  'Dichiaro che i dati inseriti sono veritieri',
  "Autorizzo il Patronato alla trasmissione telematica all'Agenzia delle Entrate",
  'Accetto informativa privacy GDPR',
  "Autorizzo l'elaborazione della richiesta di registrazione / proroga / detrazione",
]);

// Sostegno: Assegno Unico e Universale
const DECLARATIONS_SOSTEGNO_AUU = makeDeclarations([
  'Dichiaro che i dati inseriti sono veritieri',
  "Autorizzo il Patronato alla trasmissione telematica all'INPS",
  'Accetto informativa privacy GDPR',
  'Dichiaro che i figli indicati sono fiscalmente a carico',
  'Accetto responsabilità sulla correttezza dei dati',
]);

// Sostegno: Assegno di Inclusione / PAD ADI
const DECLARATIONS_SOSTEGNO_ADI = makeDeclarations([
  'Dichiaro che i dati inseriti sono veritieri',
  "Autorizzo il Patronato alla trasmissione telematica all'INPS",
  'Accetto informativa privacy GDPR',
  'Dichiaro che i componenti indicati appartengono al mio nucleo familiare',
  'Accetto responsabilità sulla correttezza dei dati',
]);

// Sostegno: Bonus Asilo Nido
const DECLARATIONS_SOSTEGNO_NIDO = makeDeclarations([
  'Dichiaro che i dati inseriti sono veritieri',
  "Autorizzo il Patronato alla trasmissione telematica all'INPS",
  'Accetto informativa privacy GDPR',
  'Dichiaro che i figli indicati sono iscritti a nido pubblico o privato',
  'Accetto responsabilità sulla correttezza dei dati',
]);

// Sostegno: Aggiornamento AUU
const DECLARATIONS_SOSTEGNO_AGG = makeDeclarations([
  'Dichiaro che i dati aggiornati sono veritieri',
  "Autorizzo il Patronato alla trasmissione telematica all'INPS",
  'Accetto informativa privacy GDPR',
  'Dichiaro che i figli indicati sono fiscalmente a carico',
  'Accetto responsabilità sulla correttezza dei dati',
]);

// Certificati (Anagrafici e Penali)
const DECLARATIONS_CERTIFICATI = makeDeclarations([
  'Dichiaro che i dati inseriti sono veritieri',
  'Autorizzo il Patronato alla trasmissione della richiesta al Comune',
  'Accetto informativa privacy GDPR',
  'Accetto responsabilità sulla correttezza dei dati inseriti',
]);

// =====================================================================
// SPID SECTION
// =====================================================================

const SPID_SECTION = {
  id: 'spid_login',
  title: 'SPID',
  description: 'Credenziali SPID per invio telematico',
  fields: [
    {
      name: 'username_spid',
      label: 'Nome Utente',
      type: 'text',
      required: true,
      order: 1,
    },
    {
      name: 'password_spid',
      label: 'Password',
      type: 'password',
      required: true,
      order: 2,
    },
    {
      name: 'spid_notice',
      label: 'Avviso importante',
      type: 'info',
      required: false,
      order: 3,
      description:
        "Quando procederemo con l'invio telematico della sua pratica tramite SPID, riceverà una chiamata dal nostro call center e una notifica push istantanea sul suo smartphone (tramite l'app del suo fornitore, es. PosteID, InfoCert, Lepida, Aruba, Sielte, ecc.)",
    },
  ],
};

// =====================================================================
// SHARED REUSABLE SECTIONS
// =====================================================================

// Address section for Permesso di Soggiorno services
const ADDRESS_RESIDENZA_OSPITALITA = {
  id: 'indirizzo_residenza_ospitalita',
  title: 'Indirizzo di Residenza/Ospitalità',
  description: 'Residence and kit delivery address',
  fields: [
    {
      name: 'indirizzo_uguale',
      label:
        'Indirizzo di residenza/ospitalità uguale alle informazioni personali (dichiarante)',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 1,
    },
    {
      name: 'nuovo_indirizzo',
      label: 'Nuovo indirizzo di residenza',
      type: 'text',
      required: true,
      order: 2,
      dependsOn: { field: 'indirizzo_uguale', value: 'No' },
    },
    {
      name: 'nuovo_citta',
      label: 'Città',
      type: 'text',
      required: true,
      order: 3,
      dependsOn: { field: 'indirizzo_uguale', value: 'No' },
    },
    {
      name: 'nuovo_cap',
      label: 'CAP',
      type: 'text',
      required: true,
      order: 4,
      dependsOn: { field: 'indirizzo_uguale', value: 'No' },
    },
    {
      name: 'nuovo_provincia',
      label: 'Provincia',
      type: 'text',
      required: true,
      order: 5,
      dependsOn: { field: 'indirizzo_uguale', value: 'No' },
    },
    {
      name: 'kit_indirizzo_uguale',
      label:
        'Indirizzo per il ritiro del kit/pacco per posta uguale alle informazioni personali (dichiarante)',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 6,
    },
    {
      name: 'kit_indirizzo',
      label: 'Indirizzo per ritiro kit',
      type: 'text',
      required: true,
      order: 7,
      dependsOn: { field: 'kit_indirizzo_uguale', value: 'No' },
    },
    {
      name: 'kit_citta',
      label: 'Città kit',
      type: 'text',
      required: true,
      order: 8,
      dependsOn: { field: 'kit_indirizzo_uguale', value: 'No' },
    },
    {
      name: 'kit_cap',
      label: 'CAP kit',
      type: 'text',
      required: true,
      order: 9,
      dependsOn: { field: 'kit_indirizzo_uguale', value: 'No' },
    },
    {
      name: 'kit_provincia',
      label: 'Provincia kit',
      type: 'text',
      required: true,
      order: 10,
      dependsOn: { field: 'kit_indirizzo_uguale', value: 'No' },
    },
  ],
};

// Personal Info for Colf/Badante (second person) – same structure as personal info
const PERSONAL_INFO_COLF_BADANTE = {
  id: 'personal_info_colf_badante',
  title: 'Informazioni personali (Colf/Badante)',
  description:
    'Personal information of the domestic worker — same as standard personal info fields',
  fields: [
    { name: 'cb_nome', label: 'Nome', type: 'text', required: true, order: 1 },
    {
      name: 'cb_cognome',
      label: 'Cognome',
      type: 'text',
      required: true,
      order: 2,
    },
    {
      name: 'cb_codice_fiscale',
      label: 'Codice Fiscale',
      type: 'text',
      required: true,
      order: 3,
      maxLength: 16,
    },
    {
      name: 'cb_data_nascita',
      label: 'Data di nascita',
      type: 'date',
      required: true,
      order: 4,
    },
    {
      name: 'cb_luogo_nascita',
      label: 'Luogo di nascita',
      type: 'text',
      required: true,
      order: 5,
    },
    {
      name: 'cb_cittadinanza',
      label: 'Cittadinanza',
      type: 'text',
      required: true,
      order: 6,
    },
    {
      name: 'cb_indirizzo',
      label: 'Indirizzo di residenza',
      type: 'text',
      required: true,
      order: 7,
    },
    {
      name: 'cb_citta',
      label: 'Città',
      type: 'text',
      required: true,
      order: 8,
    },
    { name: 'cb_cap', label: 'CAP', type: 'text', required: true, order: 9 },
    {
      name: 'cb_provincia',
      label: 'Provincia',
      type: 'text',
      required: true,
      order: 10,
    },
    {
      name: 'cb_telefono',
      label: 'Telefono',
      type: 'tel',
      required: true,
      order: 11,
    },
    {
      name: 'cb_email',
      label: 'Email',
      type: 'email',
      required: false,
      order: 12,
    },
    {
      name: 'cb_permesso_soggiorno',
      label: 'Permesso di soggiorno (se extracomunitario)',
      type: 'file',
      required: false,
      order: 13,
    },
    {
      name: 'cb_data_scadenza_permesso',
      label: 'Data scadenza permesso di soggiorno',
      type: 'date',
      required: false,
      order: 14,
      dependsOn: { field: 'cb_permesso_soggiorno', hasFile: true },
    },
    {
      name: 'cb_stato_civile',
      label: 'Stato civile',
      type: 'select',
      options: [
        'Celibe / Nubile',
        'Coniugato/a',
        'Separato/a',
        'Divorziato/a',
        'Vedovo/a',
      ],
      required: true,
      order: 15,
    },
  ],
};

// UNILAV/Contratto di lavoro section for Colf services
const UNILAV_CONTRATTO_SECTION = {
  id: 'unilav_contratto',
  title: 'UNILAV/Contratto di lavoro',
  description: 'Employment contract documentation',
  fields: [
    {
      name: 'unilav_file',
      label: 'UNILAV/Contratto di lavoro',
      type: 'file',
      required: true,
      order: 1,
      description: 'Allega UNILAV/Contratto di lavoro',
    },
  ],
};

// Personal Info for second person (Affittuario, Altro Genitore, etc.)
const PERSONAL_INFO_SECOND_PERSON = (id: string, title: string) => ({
  id,
  title,
  description: `${title} — same as standard personal info fields`,
  fields: [
    {
      name: `${id}_nome`,
      label: 'Nome',
      type: 'text',
      required: true,
      order: 1,
    },
    {
      name: `${id}_cognome`,
      label: 'Cognome',
      type: 'text',
      required: true,
      order: 2,
    },
    {
      name: `${id}_codice_fiscale`,
      label: 'Codice Fiscale',
      type: 'text',
      required: true,
      order: 3,
      maxLength: 16,
    },
    {
      name: `${id}_data_nascita`,
      label: 'Data di nascita',
      type: 'date',
      required: true,
      order: 4,
    },
    {
      name: `${id}_luogo_nascita`,
      label: 'Luogo di nascita',
      type: 'text',
      required: true,
      order: 5,
    },
    {
      name: `${id}_cittadinanza`,
      label: 'Cittadinanza',
      type: 'text',
      required: true,
      order: 6,
    },
    {
      name: `${id}_indirizzo`,
      label: 'Indirizzo di residenza',
      type: 'text',
      required: true,
      order: 7,
    },
    {
      name: `${id}_citta`,
      label: 'Città',
      type: 'text',
      required: true,
      order: 8,
    },
    { name: `${id}_cap`, label: 'CAP', type: 'text', required: true, order: 9 },
    {
      name: `${id}_provincia`,
      label: 'Provincia',
      type: 'text',
      required: true,
      order: 10,
    },
    {
      name: `${id}_telefono`,
      label: 'Telefono',
      type: 'tel',
      required: true,
      order: 11,
    },
    {
      name: `${id}_email`,
      label: 'Email',
      type: 'email',
      required: false,
      order: 12,
    },
    {
      name: `${id}_permesso_soggiorno`,
      label: 'Permesso di soggiorno (se extracomunitario)',
      type: 'file',
      required: false,
      order: 13,
    },
    {
      name: `${id}_stato_civile`,
      label: 'Stato civile',
      type: 'select',
      options: [
        'Celibe / Nubile',
        'Coniugato/a',
        'Separato/a',
        'Divorziato/a',
        'Vedovo/a',
      ],
      required: true,
      order: 14,
    },
  ],
});

// Stato Civile + Nucleo Familiare for Sostegno services
const STATO_CIVILE_NUCLEO = (
  withPartner = true,
  labelFigli = 'Numero figli a carico (0-21 anni)',
  labelNucleo?: string,
) => ({
  id: 'stato_civile_nucleo',
  title: 'Stato Civile e Nucleo Familiare',
  description: 'Marital status and family composition',
  fields: [
    {
      name: 'stato_civile',
      label: 'Stato civile',
      type: 'select',
      options: [
        'Celibe/Nubile',
        'Coniugato/a',
        'Separato/a',
        'Divorziato/a',
        'Vedovo/a',
      ],
      required: true,
      order: 1,
    },
    ...(withPartner
      ? [
          {
            name: 'convivente_partner',
            label: 'Sei convivente con il partner?',
            type: 'radio',
            options: ['Sì', 'No'],
            required: true,
            order: 2,
          },
          {
            name: 'cf_partner',
            label: 'Codice Fiscale partner',
            type: 'file',
            required: true,
            order: 3,
            dependsOn: { field: 'convivente_partner', value: 'Sì' },
          },
        ]
      : []),
    {
      name: 'numero_figli',
      label: labelNucleo || labelFigli,
      type: 'select',
      options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
      required: true,
      order: withPartner ? 4 : 2,
    },
  ],
});

// Figli e Carichi Familiari (repeatable) for Sostegno services
const FIGLI_CARICHI_SECTION = (
  includeNido = false,
  includeGenitoreNonConvivente = true,
) => ({
  id: 'figli_carichi',
  title: 'Figli e Altri Carichi Familiari',
  description: 'Children and dependents — repeatable for each',
  fields: [
    {
      name: 'figli',
      label: 'Dati figli a carico',
      type: 'dynamic_list',
      required: true,
      order: 1,
      description: 'Ripetere per ogni figlio/carico familiare',
      subFields: [
        {
          name: 'nome_cognome',
          label: 'Nome e Cognome',
          type: 'text',
          required: true,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice Fiscale',
          type: 'text',
          required: true,
          maxLength: 16,
        },
        {
          name: 'data_nascita',
          label: 'Data di nascita',
          type: 'date',
          required: true,
        },
        {
          name: 'residenza_uguale',
          label: 'Residenza',
          type: 'radio',
          options: ['Same as dichiarante', 'No'],
          required: true,
        },
        {
          name: 'indirizzo_figlio',
          label: 'Indirizzo figlio',
          type: 'text',
          required: false,
          dependsOn: { field: 'residenza_uguale', value: 'No' },
        },
        {
          name: 'situazione_particolare',
          label: 'Situazione particolare',
          type: 'select',
          options: ['Nessuna', 'Disabile', 'Studente fuori sede', 'Altro'],
          required: false,
        },
        {
          name: 'certificazione_disabilita',
          label: 'Certificazione disabilità figlio',
          type: 'file',
          required: false,
          dependsOn: { field: 'situazione_particolare', value: 'Disabile' },
        },
        {
          name: 'certificazione_studi',
          label: 'Certificazioni studi fuori sede',
          type: 'file',
          required: false,
          dependsOn: {
            field: 'situazione_particolare',
            value: 'Studente fuori sede',
          },
        },
        ...(includeNido
          ? [
              {
                name: 'nome_asilo_nido',
                label: 'Nome asilo nido / centro educativo',
                type: 'text',
                required: true,
              },
              {
                name: 'indirizzo_asilo_nido',
                label: 'Indirizzo asilo nido',
                type: 'text',
                required: true,
              },
              {
                name: 'certificato_iscrizione_nido',
                label: 'Certificato di iscrizione e frequenza al nido',
                type: 'file',
                required: true,
              },
              {
                name: 'tipologia_struttura',
                label: 'Tipologia struttura',
                type: 'select',
                options: ['Pubblica', 'Privata'],
                required: true,
              },
              {
                name: 'altri_figli_bonus',
                label: 'Eventuali altri figli già iscritti a bonus simili?',
                type: 'radio',
                options: ['Sì', 'No'],
                required: true,
              },
              {
                name: 'altri_figli_bonus_dettaglio',
                label: 'Dettaglio',
                type: 'text',
                required: false,
                dependsOn: { field: 'altri_figli_bonus', value: 'Sì' },
              },
            ]
          : []),
        ...(includeGenitoreNonConvivente
          ? [
              {
                name: 'genitore_non_convivente',
                label: 'Genitore non convivente con figli?',
                type: 'radio',
                options: ['Sì', 'No'],
                required: true,
              },
              {
                name: 'percentuale_carico',
                label: 'Percentuale a carico',
                type: 'select',
                options: ['50%', '100%'],
                required: false,
                dependsOn: { field: 'genitore_non_convivente', value: 'Sì' },
              },
              {
                name: 'affido_condiviso',
                label: 'Eventuale affido condiviso / genitorialità multipla',
                type: 'file',
                required: false,
              },
            ]
          : []),
      ],
    },
  ],
});

// ISEE section for Sostegno services
const ISEE_SECTION = {
  id: 'isee_reddito',
  title: 'Reddito e Patrimonio (ISEE)',
  description: 'ISEE information',
  fields: [
    {
      name: 'isee_presente',
      label: 'ISEE aggiornato presente?',
      type: 'radio',
      options: ['Sì', 'No'],
      required: true,
      order: 1,
    },
    {
      name: 'isee_file',
      label: 'ISEE',
      type: 'file',
      required: true,
      order: 2,
      dependsOn: { field: 'isee_presente', value: 'Sì' },
    },
  ],
};

// IBAN / Modalità di pagamento
const IBAN_SECTION = {
  id: 'modalita_pagamento',
  title: 'Modalità di pagamento',
  description: 'Payment method',
  fields: [
    {
      name: 'iban',
      label: 'IBAN (intestato alla richiedente)',
      type: 'text',
      required: true,
      order: 1,
    },
    {
      name: 'iban_file',
      label: 'Allega documento IBAN',
      type: 'file',
      required: true,
      order: 2,
    },
  ],
};

// =====================================================================
// SERVICE QUESTIONNAIRES
// =====================================================================

export const SERVICE_QUESTIONNAIRES: Record<string, any[]> = {
  // =====================================================================
  // ISEE SERVICES
  // =====================================================================

  ISEE_ORD_2026: [
    HOUSEHOLD_SECTION(),
    FINANCIAL_ASSETS_SECTION,
    REAL_ESTATE_SECTION,
    PRIMARY_RESIDENCE_SECTION,
    VEHICLES_SECTION,
    SPECIAL_SITUATIONS_SECTION,
  ],

  ISEE_UNI_2026: [
    HOUSEHOLD_SECTION(),
    FINANCIAL_ASSETS_SECTION,
    REAL_ESTATE_SECTION,
    PRIMARY_RESIDENCE_SECTION,
    VEHICLES_SECTION,
    {
      id: 'universita_info',
      title: 'Università',
      description: 'University student information',
      fields: [
        {
          name: 'codice_fiscale_studente',
          label: 'Codice Fiscale dello studente Universitario',
          type: 'text',
          required: true,
          order: 1,
          maxLength: 16,
        },
        {
          name: 'nome_universita',
          label: "Nome dell'Università",
          type: 'text',
          required: true,
          order: 2,
        },
        {
          name: 'genitore_non_convivente_cf',
          label:
            'In caso di presenza di genitore non coniugato e non convivente: Codice Fiscale Genitore non Coniugato e non Convivente',
          type: 'text',
          required: false,
          order: 3,
          maxLength: 16,
        },
      ],
    },
    SPECIAL_SITUATIONS_SECTION,
  ],

  ISEE_SOC_2026: [
    HOUSEHOLD_SECTION(),
    FINANCIAL_ASSETS_SECTION,
    REAL_ESTATE_SECTION,
    PRIMARY_RESIDENCE_SECTION,
    VEHICLES_SECTION,
    SPECIAL_SITUATIONS_SECTION,
  ],

  ISEE_MIN_2026: [
    HOUSEHOLD_SECTION(),
    FINANCIAL_ASSETS_SECTION,
    REAL_ESTATE_SECTION,
    PRIMARY_RESIDENCE_SECTION,
    VEHICLES_SECTION,
    SPECIAL_SITUATIONS_SECTION,
  ],

  ISEE_COR_2026: [
    {
      id: 'variazione_situazione',
      title: 'Variazione della Situazione Lavorativa/Reddituale/Patrimoniale',
      description: 'Changes in employment, income, or financial situation',
      fields: [
        {
          name: 'perdita_lavoro',
          label: 'Perdita o sospensione del lavoro?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'perdita_lavoro_file',
          label: 'Documentazione perdita/sospensione lavoro',
          type: 'file',
          required: true,
          order: 2,
          dependsOn: { field: 'perdita_lavoro', value: 'Sì' },
        },
        {
          name: 'riduzione_reddito',
          label: "Riduzione dell'attività lavorativa o del reddito?",
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
        {
          name: 'riduzione_reddito_file',
          label: 'Documentazione riduzione reddito',
          type: 'file',
          required: true,
          order: 4,
          dependsOn: { field: 'riduzione_reddito', value: 'Sì' },
        },
        {
          name: 'diminuzione_patrimonio',
          label:
            'Diminuzione di oltre il 20% del patrimonio mobiliare o immobiliare?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 5,
        },
        {
          name: 'diminuzione_patrimonio_file',
          label: 'Documentazione diminuzione patrimonio',
          type: 'file',
          required: true,
          order: 6,
          dependsOn: { field: 'diminuzione_patrimonio', value: 'Sì' },
        },
      ],
    },
    HOUSEHOLD_SECTION(),
    FINANCIAL_ASSETS_SECTION,
    REAL_ESTATE_SECTION,
    PRIMARY_RESIDENCE_SECTION,
    VEHICLES_SECTION,
    SPECIAL_SITUATIONS_SECTION,
  ],

  // =====================================================================
  // DISOCCUPAZIONE / NASPI
  // =====================================================================

  NASP_2026: [],
  DAGRN_2026: [],
  ANTNAS_2026: [],
  DID_2026: [],

  PAD_2026: [
    {
      id: 'curriculum_vitae',
      title: 'Curriculum',
      description: 'Upload your updated CV',
      fields: [
        {
          name: 'cv_upload',
          label: 'Allega CV aggiornato',
          type: 'file',
          required: true,
          order: 1,
        },
      ],
    },
  ],

  NASPICOM_2026: [
    {
      id: 'variazione_info',
      title: 'Variazione',
      description: 'Employment variation documentation',
      fields: [
        {
          name: 'documentazione_variazione',
          label: 'UNILAV/Contratto di lavoro/Certificato di attività autonoma',
          type: 'file',
          required: true,
          order: 1,
          description: 'Allega file',
        },
      ],
    },
  ],

  RICORSO_NASP_2026: [
    {
      id: 'prove_ricorso',
      title: 'Le prove per Ricorso',
      description: 'Documents needed for NASPI appeal',
      fields: [
        {
          name: 'lettera_rigetto',
          label: 'Lettera di Rigetto',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'lettera_licenziamento',
          label: 'Ultima Lettera di Licenziamento',
          type: 'file',
          required: true,
          order: 2,
        },
      ],
    },
  ],

  // =====================================================================
  // MODELLO 730
  // =====================================================================

  '730_2026': [
    {
      id: 'tipo_dichiarazione',
      title: 'Tipo di Dichiarazione',
      description: 'Type of tax declaration',
      fields: [
        {
          name: 'prima_dichiarazione',
          label: 'È la tua prima dichiarazione dei redditi?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'presentato_anno_scorso',
          label: "Hai già presentato il 730 l'anno scorso?",
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
        {
          name: '730_anno_scorso',
          label: "730 l'anno scorso",
          type: 'file',
          required: true,
          order: 3,
          dependsOn: { field: 'presentato_anno_scorso', value: 'Sì' },
        },
      ],
    },
    {
      id: 'sostituto_imposta',
      title: "Sostituto d'Imposta",
      description: 'Tax withholding agent information',
      fields: [
        {
          name: 'ha_sostituto',
          label: "Hai un sostituto d'imposta?",
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'denominazione_datore',
          label: 'Denominazione datore di lavoro / ente pensionistico',
          type: 'text',
          required: true,
          order: 2,
          dependsOn: { field: 'ha_sostituto', value: 'Sì' },
        },
        {
          name: 'codice_fiscale_sostituto',
          label: 'Codice fiscale sostituto',
          type: 'text',
          required: true,
          order: 3,
          maxLength: 16,
          dependsOn: { field: 'ha_sostituto', value: 'Sì' },
        },
        {
          name: 'rimborso_agenzia_entrate',
          label: 'Rimborso tramite Agenzia delle Entrate',
          type: 'info',
          required: false,
          order: 4,
          dependsOn: { field: 'ha_sostituto', value: 'No' },
          description:
            "Il rimborso verrà effettuato direttamente dall'Agenzia delle Entrate",
        },
      ],
    },
    {
      id: 'familiari_carico',
      title: 'Familiari a Carico',
      description: 'Dependents - repeatable section for each family member',
      fields: [
        {
          name: 'familiari',
          label: 'Familiari a carico',
          type: 'dynamic_list',
          required: false,
          order: 1,
          description: 'Per ogni familiare a carico',
          subFields: [
            {
              name: 'nome_cognome',
              label: 'Nome e Cognome',
              type: 'text',
              required: true,
            },
            {
              name: 'codice_fiscale',
              label: 'Codice Fiscale',
              type: 'text',
              required: true,
              maxLength: 16,
            },
            {
              name: 'rapporto_parentela',
              label: 'Rapporto di parentela',
              type: 'select',
              options: ['Coniuge', 'Figlio/a', 'Genitore', 'Altro'],
              required: true,
            },
            {
              name: 'mesi_a_carico',
              label: 'Mesi a carico (1–12)',
              type: 'select',
              options: [
                '1',
                '2',
                '3',
                '4',
                '5',
                '6',
                '7',
                '8',
                '9',
                '10',
                '11',
                '12',
              ],
              required: true,
            },
            {
              name: 'percentuale_carico',
              label: 'Percentuale a carico',
              type: 'select',
              options: ['50%', '100%'],
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'redditi_lavoro',
      title: "Redditi di lavoro / pensione (Anno d'Imposta di riferimento)",
      description: 'Employment/pension income and other income',
      fields: [
        {
          name: 'numero_cu',
          label: 'Numero di CU ricevute',
          type: 'select',
          options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
          required: true,
          order: 1,
        },
        {
          name: 'cu_files',
          label: 'Allega le CU',
          type: 'file',
          required: true,
          order: 2,
          multiple: true,
        },
        {
          name: 'ha_altri_redditi',
          label: 'Altri redditi?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
        {
          name: 'tipo_altri_redditi',
          label: 'Tipo di altri redditi',
          type: 'checkbox',
          required: true,
          order: 4,
          dependsOn: { field: 'ha_altri_redditi', value: 'Sì' },
          options: [
            'Redditi da fabbricati',
            'Redditi da terreni',
            'Affitti',
            'Redditi esteri',
            'Assegni di mantenimento percepiti',
            'Altri redditi imponibili',
          ],
        },
        {
          name: 'altri_redditi_file',
          label: 'Documentazione altri redditi',
          type: 'file',
          required: true,
          order: 5,
          multiple: true,
          dependsOn: { field: 'ha_altri_redditi', value: 'Sì' },
        },
      ],
    },
    {
      id: 'abitazione_immobili',
      title: 'Abitazione Principale e Immobili',
      description: 'Primary residence and additional properties',
      fields: [
        {
          name: 'abitazione_principale',
          label: 'Abitazione principale',
          type: 'select',
          options: ['Proprietà', 'Affitto'],
          required: true,
          order: 1,
        },
        {
          name: 'contratto_affitto',
          label: 'Estremi contratto con Registrazione Agenzia delle Entrate',
          type: 'file',
          required: true,
          order: 2,
          dependsOn: { field: 'abitazione_principale', value: 'Affitto' },
        },
        {
          name: 'possiedi_altri_immobili',
          label: 'Possiedi altri immobili?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
        {
          name: 'altri_immobili',
          label: 'Altri immobili',
          type: 'dynamic_list',
          required: true,
          order: 4,
          dependsOn: { field: 'possiedi_altri_immobili', value: 'Sì' },
          subFields: [
            { name: 'comune', label: 'Comune', type: 'text', required: true },
            {
              name: 'percentuale_possesso',
              label: 'Percentuale di possesso',
              type: 'number',
              required: true,
            },
            {
              name: 'rendita_catastale',
              label: 'Rendita catastale',
              type: 'number',
              required: true,
            },
            {
              name: 'utilizzo',
              label: 'Utilizzo',
              type: 'select',
              options: ['Affitto', 'A disposizione'],
              required: true,
            },
            {
              name: 'immobile_file',
              label: 'Documentazione immobile',
              type: 'file',
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'spese_detraibili',
      title: 'Spese Detraibili e Deducibili',
      description: 'Deductible expenses',
      fields: [
        {
          name: 'spese_sanitarie',
          label: 'Hai sostenuto spese sanitarie?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'spese_sanitarie_file',
          label: 'Documentazione spese sanitarie',
          type: 'file',
          required: true,
          order: 2,
          multiple: true,
          dependsOn: { field: 'spese_sanitarie', value: 'Sì' },
        },
        {
          name: 'altre_spese',
          label: 'Altre spese',
          type: 'checkbox',
          required: false,
          order: 3,
          options: [
            'Spese veterinarie',
            'Spese universitarie',
            'Spese scolastiche',
            'Attività sportive figli',
            'Spese funebri',
            'Spese assicurative',
            'Contributi previdenziali',
            'Donazioni ONLUS / ETS',
            'Spese assistenza disabili',
          ],
        },
        {
          name: 'altre_spese_file',
          label: 'Documentazione per ogni tipologia di spesa selezionata',
          type: 'file',
          required: true,
          order: 4,
          multiple: true,
          dependsOn: { field: 'altre_spese', hasSelection: true },
        },
      ],
    },
    {
      id: 'mutui_bonus',
      title: 'Mutui, Ristrutturazioni e Bonus',
      description: 'Mortgages, renovations, and tax bonuses',
      fields: [
        {
          name: 'mutuo_prima_casa',
          label: 'Mutuo prima casa?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'interessi_passivi_file',
          label: 'Interessi passivi pagati',
          type: 'file',
          required: true,
          order: 2,
          dependsOn: { field: 'mutuo_prima_casa', value: 'Sì' },
        },
        {
          name: 'anno_stipula_mutuo',
          label: 'Anno stipula mutuo',
          type: 'text',
          required: true,
          order: 3,
          dependsOn: { field: 'mutuo_prima_casa', value: 'Sì' },
        },
        {
          name: 'lavori_edilizi',
          label: 'Lavori edilizi / bonus fiscali?',
          type: 'checkbox',
          required: false,
          order: 4,
          options: [
            'Ristrutturazione',
            'Ecobonus',
            'Bonus mobili',
            'Superbonus',
          ],
        },
        {
          name: 'lavori_edilizi_file',
          label: 'Documentazione lavori edilizi / bonus',
          type: 'file',
          required: true,
          order: 5,
          multiple: true,
          dependsOn: { field: 'lavori_edilizi', hasSelection: true },
        },
      ],
    },
    DECLARATIONS_730,
  ],

  '730INT_2026': [
    {
      id: 'integrazione_documenti',
      title: 'Documenti relativi',
      description: 'Documents for 730 integration/corrections',
      fields: [
        {
          name: 'documenti_integrazione',
          label: 'Documenti relativi alle nuove informazioni/correzioni',
          type: 'file',
          required: true,
          order: 1,
          multiple: true,
          description:
            'Allega documenti relativi alle nuove informazioni/correzioni',
        },
      ],
    },
    DECLARATIONS_730,
  ],

  // =====================================================================
  // DIMISSIONI
  // =====================================================================

  DISM_VOL_2026: [
    {
      id: 'datore_lavoro',
      title: 'Datore di Lavoro',
      fields: [
        {
          name: 'unilav_documento',
          label: 'UNILAV/Busta Paga/Contratto di lavoro',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'pec_email',
          label: 'PEC o email aziendale (se disponibile)',
          type: 'email',
          required: false,
          order: 2,
        },
      ],
    },
    {
      id: 'dimissioni_volontarie',
      title: 'Dimissioni Volontarie',
      fields: [
        {
          name: 'data_ultimo_giorno',
          label: 'Data ultimo giorno di lavoro',
          type: 'date',
          required: true,
          order: 1,
        },
      ],
    },
    DECLARATIONS_PATRONATO,
  ],

  DISM_GIUSTA_2026: [
    {
      id: 'datore_lavoro',
      title: 'Datore di Lavoro',
      fields: [
        {
          name: 'unilav_documento',
          label: 'UNILAV/Busta Paga/Contratto di lavoro',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'pec_email',
          label: 'PEC o email aziendale (se disponibile)',
          type: 'email',
          required: false,
          order: 2,
        },
      ],
    },
    {
      id: 'dimissioni_giusta_causa',
      title: 'Dimissioni per Giusta Causa',
      fields: [
        {
          name: 'data_ultimo_giorno',
          label: 'Data ultimo giorno di lavoro',
          type: 'date',
          required: true,
          order: 1,
        },
        {
          name: 'motivo',
          label: 'Motivo',
          type: 'textarea',
          required: true,
          order: 2,
          maxLength: 500,
          description:
            'Descrivi il motivo delle dimissioni per giusta causa (max 500 caratteri)',
        },
      ],
    },
    DECLARATIONS_PATRONATO,
  ],

  DISM_RISOL_2026: [
    {
      id: 'datore_lavoro',
      title: 'Datore di Lavoro',
      fields: [
        {
          name: 'unilav_documento',
          label: 'UNILAV/Busta Paga/Contratto di lavoro',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'pec_email',
          label: 'PEC o email aziendale (se disponibile)',
          type: 'email',
          required: false,
          order: 2,
        },
      ],
    },
    {
      id: 'risoluzione_consensuale',
      title: 'Dimissioni - Risoluzione Consensuale',
      fields: [
        {
          name: 'data_ultimo_giorno',
          label: 'Data ultimo giorno di lavoro',
          type: 'date',
          required: true,
          order: 1,
        },
      ],
    },
    DECLARATIONS_PATRONATO,
  ],

  DISM_REVOCA_2026: [
    {
      id: 'revoca_dimissioni',
      title: 'Revoca Dimissioni',
      fields: [
        {
          name: 'ricevuta_dimissioni',
          label: 'Ricevuta dimissioni già effettuate',
          type: 'file',
          required: true,
          order: 1,
        },
      ],
    },
    DECLARATIONS_PATRONATO,
  ],

  // =====================================================================
  // RATEIZZAZIONE
  // =====================================================================

  RATE_GEN_2026: [SPID_SECTION],

  // =====================================================================
  // TEST LINGUA
  // =====================================================================

  TEST_LINGUA_2026: [SPID_SECTION],

  // =====================================================================
  // CONSULENZA
  // =====================================================================

  CONS_PROF_2026: [
    {
      id: 'motivo_consulenza',
      title: 'Motivo',
      description: 'Reason for consultation',
      fields: [
        {
          name: 'motivo',
          label: 'Descrivi il motivo della consulenza',
          type: 'textarea',
          required: true,
          order: 1,
          maxLength: 500,
          description: 'Max 500 parole',
        },
      ],
    },
  ],

  // =====================================================================
  // ESTRATTO CONTO PREVIDENZIALE
  // =====================================================================

  ESTCONT_PREV_2026: [DECLARATIONS_PATRONATO],

  // =====================================================================
  // COMUNICAZIONE INPS
  // =====================================================================

  COMM_INPS_2026: [
    {
      id: 'comunicazione_inps',
      title: 'Comunicazione',
      fields: [
        {
          name: 'motivo',
          label: 'Motivo',
          type: 'textarea',
          required: true,
          order: 1,
          maxLength: 500,
        },
        {
          name: 'allegato',
          label: 'Allega file',
          type: 'file',
          required: false,
          order: 2,
          multiple: true,
        },
      ],
    },
    DECLARATIONS_PATRONATO,
  ],

  // =====================================================================
  // PERMESSO/CARTA DI SOGGIORNO
  // =====================================================================

  RINN_PERM_LAV_2026: [
    {
      id: 'documenti_richiesti',
      title: 'Documenti richiesti',
      fields: [
        {
          name: 'carta_identita',
          label: "Carta d'identità del richiedente",
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice Fiscale del richiedente',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'permesso_soggiorno',
          label: 'Permesso di soggiorno del richiedente',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'passaporto',
          label: 'Passaporto del richiedente',
          type: 'file',
          required: true,
          order: 4,
        },
        {
          name: 'unilav_contratto',
          label: 'UNILAV/Contratto di lavoro',
          type: 'file',
          required: true,
          order: 5,
        },
        {
          name: 'ultima_cud',
          label: 'Ultima CUD',
          type: 'file',
          required: true,
          order: 6,
        },
        {
          name: 'ultima_busta_paga',
          label: 'Ultima Busta Paga in possesso',
          type: 'file',
          required: true,
          order: 7,
        },
        {
          name: 'doc_coniuge',
          label:
            "Se ha sposato/sposata: Documenti d'identità del marito/moglie",
          type: 'file',
          required: false,
          order: 8,
        },
        {
          name: 'tessera_figli',
          label:
            'Se ha figli minori di 14 anni a carico: Tessera Sanitaria Figlio/i',
          type: 'file',
          required: false,
          order: 9,
        },
      ],
    },
    ADDRESS_RESIDENZA_OSPITALITA,
    DECLARATIONS_PATRONATO,
  ],

  RINN_PERM_AUT_2026: [
    {
      id: 'documenti_richiesti',
      title: 'Documenti richiesti',
      fields: [
        {
          name: 'carta_identita',
          label: "Carta d'identità del richiedente",
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice Fiscale del richiedente',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'permesso_soggiorno',
          label: 'Permesso di soggiorno del richiedente',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'passaporto',
          label: 'Passaporto del richiedente',
          type: 'file',
          required: true,
          order: 4,
        },
        {
          name: 'piva_visura',
          label: 'Certificati di attribuzione della P.Iva/Visura Camerale',
          type: 'file',
          required: true,
          order: 5,
        },
        {
          name: 'ultimo_modello_redditi',
          label: 'Ultimo Modello Redditi in possesso',
          type: 'file',
          required: true,
          order: 6,
        },
        {
          name: 'doc_coniuge',
          label:
            "Se ha sposato/sposata: Documenti d'identità del marito/moglie",
          type: 'file',
          required: false,
          order: 7,
        },
        {
          name: 'tessera_figli',
          label:
            'Se ha figli minori di 14 anni a carico: Tessera Sanitaria Figlio/i',
          type: 'file',
          required: false,
          order: 8,
        },
      ],
    },
    ADDRESS_RESIDENZA_OSPITALITA,
    DECLARATIONS_PATRONATO,
  ],

  RINN_PERM_FAM_2026: [
    {
      id: 'documenti_richiesti',
      title: 'Documenti richiesti',
      fields: [
        {
          name: 'carta_identita',
          label: "Carta d'identità del richiedente",
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice Fiscale del richiedente',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'permesso_soggiorno',
          label: 'Permesso di soggiorno del richiedente',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'passaporto',
          label: 'Passaporto del richiedente',
          type: 'file',
          required: true,
          order: 4,
        },
        {
          name: 'visto',
          label: 'Visto',
          type: 'file',
          required: true,
          order: 5,
        },
        {
          name: 'doc_carico',
          label: "Documento d'identità su cui è Carico",
          type: 'file',
          required: true,
          order: 6,
        },
        {
          name: 'cf_carico',
          label: 'Codice fiscale su cui è Carico',
          type: 'file',
          required: true,
          order: 7,
        },
        {
          name: 'permesso_carico',
          label: 'Permesso di soggiorno su cui è Carico',
          type: 'file',
          required: true,
          order: 8,
        },
        {
          name: 'permesso_figli',
          label:
            'Se ha figli minori di 14 anni a carico: Permesso di soggiorno figlio/i',
          type: 'file',
          required: false,
          order: 9,
        },
      ],
    },
    ADDRESS_RESIDENZA_OSPITALITA,
    DECLARATIONS_PATRONATO,
  ],

  RINN_PERM_STU_2026: [
    {
      id: 'documenti_richiesti',
      title: 'Documenti richiesti',
      fields: [
        {
          name: 'carta_identita',
          label: "Carta d'identità del richiedente",
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice Fiscale del richiedente',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'permesso_soggiorno',
          label: 'Permesso di soggiorno del richiedente',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'passaporto',
          label: 'Passaporto del richiedente',
          type: 'file',
          required: true,
          order: 4,
        },
        {
          name: 'visto',
          label: 'Visto',
          type: 'file',
          required: true,
          order: 5,
        },
        {
          name: 'iscrizione_universita',
          label: "Iscrizione all'università",
          type: 'file',
          required: true,
          order: 6,
        },
      ],
    },
    ADDRESS_RESIDENZA_OSPITALITA,
    DECLARATIONS_PATRONATO,
  ],

  RINN_PERM_ASI_2026: [
    {
      id: 'documenti_richiesti',
      title: 'Documenti richiesti',
      fields: [
        {
          name: 'carta_identita',
          label: "Carta d'identità del richiedente",
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice Fiscale del richiedente',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'permesso_soggiorno',
          label: 'Permesso di soggiorno del richiedente (NON CARTACEO)',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'passaporto',
          label: 'Passaporto del richiedente',
          type: 'file',
          required: true,
          order: 4,
        },
      ],
    },
    ADDRESS_RESIDENZA_OSPITALITA,
    DECLARATIONS_PATRONATO,
  ],

  RILASC_CART_2026: [
    {
      id: 'documenti_richiesti',
      title: 'Documenti richiesti',
      fields: [
        {
          name: 'carta_identita',
          label: "Carta d'identità del richiedente",
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice Fiscale del richiedente',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'permesso_soggiorno',
          label: 'Permesso di soggiorno del richiedente',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'passaporto',
          label: 'Passaporto del richiedente',
          type: 'file',
          required: true,
          order: 4,
        },
        {
          name: 'tessera_coniuge',
          label:
            'Se ha moglie/marito: Tessera Sanitaria del Coniuge (marito/moglie)',
          type: 'file',
          required: false,
          order: 5,
        },
        {
          name: 'tessera_figli',
          label:
            'Se ha figli minori di 14 anni a carico: Tessera Sanitaria Figlio/i',
          type: 'file',
          required: false,
          order: 6,
        },
        {
          name: 'doc_dipendente',
          label:
            'Se lavoratore dipendente: Ultima CUD - Ultima Busta Paga – UNILAV',
          type: 'file',
          required: false,
          order: 7,
        },
        {
          name: 'doc_autonomo',
          label:
            'Se Lavoratore autonomo: Ultimo Modello Redditi - Certificato di attribuzione P.IVA',
          type: 'file',
          required: false,
          order: 8,
        },
        {
          name: 'doc_domestico',
          label:
            'Se lavoratore domestico: Ultima dichiarazione reddito - Ultimi bollettini INPS',
          type: 'file',
          required: false,
          order: 9,
        },
      ],
    },
    ADDRESS_RESIDENZA_OSPITALITA,
    DECLARATIONS_PATRONATO,
  ],

  AGG_PERM_2026: [
    {
      id: 'documenti_richiesti',
      title: 'Documenti richiesti',
      fields: [
        {
          name: 'carta_identita',
          label: "Carta d'identità del richiedente",
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice Fiscale del richiedente',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'permesso_soggiorno',
          label: 'Permesso di soggiorno del richiedente',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'passaporto',
          label: 'Passaporto del richiedente',
          type: 'file',
          required: true,
          order: 4,
        },
      ],
    },
    ADDRESS_RESIDENZA_OSPITALITA,
    DECLARATIONS_PATRONATO,
  ],

  // =====================================================================
  // CITTADINANZA ITALIANA
  // =====================================================================

  CITT_RES_2026: [
    SPID_SECTION,
    {
      id: 'documenti_richiesti',
      title: 'Documenti richiesti',
      fields: [
        {
          name: 'carta_identita',
          label: "Carta d'identità",
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice fiscale/Tessera sanitaria',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'passaporto',
          label: 'Passaporto',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'permesso_soggiorno',
          label: 'Permesso di soggiorno',
          type: 'file',
          required: true,
          order: 4,
        },
        {
          name: 'certificato_lingua',
          label: 'Certificato di lingua italiana livello B1',
          type: 'file',
          required: true,
          order: 5,
        },
        {
          name: 'atto_nascita',
          label: 'Atto di nascita tradotto e legalizzato/apostillato',
          type: 'file',
          required: true,
          order: 6,
        },
        {
          name: 'certificato_penale',
          label: 'Certificato penale tradotto e legalizzato/apostillato',
          type: 'file',
          required: true,
          order: 7,
        },
        {
          name: 'cu_730_3anni',
          label: 'CU/PF o 730 degli ultimi 3 anni',
          type: 'file',
          required: true,
          order: 8,
          multiple: true,
        },
        {
          name: 'stato_famiglia',
          label: 'Stato di famiglia',
          type: 'file',
          required: true,
          order: 9,
        },
        {
          name: 'certificato_residenza',
          label:
            'Certificato storico di residenza/Autodichiarazione di residenza',
          type: 'file',
          required: true,
          order: 10,
        },
        {
          name: 'versamento_250',
          label: 'Copia del versamento del contributo di € 250,00',
          type: 'file',
          required: true,
          order: 11,
        },
        {
          name: 'marca_bollo',
          label: 'Marca da bollo da 16,00€',
          type: 'file',
          required: true,
          order: 12,
        },
      ],
    },
  ],

  CITT_MAT_2026: [
    SPID_SECTION,
    {
      id: 'documenti_richiesti',
      title: 'Documenti richiesti',
      fields: [
        {
          name: 'carta_identita',
          label: "Carta d'identità",
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'codice_fiscale',
          label: 'Codice fiscale/Tessera sanitaria',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'passaporto',
          label: 'Passaporto',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'atto_nascita',
          label: 'Atto di nascita tradotto e legalizzato/apostillato',
          type: 'file',
          required: true,
          order: 4,
        },
        {
          name: 'certificato_penale',
          label: 'Certificato penale tradotto e legalizzato/apostillato',
          type: 'file',
          required: true,
          order: 5,
        },
        {
          name: 'permesso_soggiorno',
          label: 'Permesso di soggiorno',
          type: 'file',
          required: true,
          order: 6,
        },
        {
          name: 'atto_matrimonio',
          label: 'Atto integrale di matrimonio',
          type: 'file',
          required: true,
          order: 7,
        },
        {
          name: 'stato_famiglia',
          label: 'Stato di famiglia',
          type: 'file',
          required: true,
          order: 8,
        },
        {
          name: 'versamento_250',
          label: 'Copia del versamento del contributo di € 250,00',
          type: 'file',
          required: true,
          order: 9,
        },
        {
          name: 'certificato_lingua',
          label: 'Certificato di lingua italiana livello B1',
          type: 'file',
          required: true,
          order: 10,
        },
        {
          name: 'marca_bollo',
          label: 'Marca da bollo da 16,00€',
          type: 'file',
          required: true,
          order: 11,
        },
        {
          name: 'doc_coniuge',
          label: 'Documento di riconoscimento del coniuge',
          type: 'file',
          required: true,
          order: 12,
        },
        {
          name: 'cf_coniuge',
          label: 'Codice fiscale/Tessera sanitaria del coniuge',
          type: 'file',
          required: true,
          order: 13,
        },
      ],
    },
  ],

  // =====================================================================
  // RICONGIUNGIMENTO FAMILIARE
  // =====================================================================

  RICONG_FAM_2026: [
    SPID_SECTION,
    {
      id: 'documenti_richiesti',
      title: 'Documenti richiesti',
      fields: [
        {
          name: 'passaporto',
          label: 'Passaporto del richiedente',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'permesso_soggiorno',
          label: 'Permesso di soggiorno',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'stato_famiglia',
          label: 'Stato di famiglia',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'passaporto_familiare',
          label: 'Passaporto del/i familiare',
          type: 'file',
          required: true,
          order: 4,
        },
        {
          name: 'ultimo_730_cu',
          label: 'Ultimo 730 / CU o PF',
          type: 'file',
          required: true,
          order: 5,
        },
        {
          name: 'unilav',
          label: 'Modello Unilav se lavoratore dipendente',
          type: 'file',
          required: false,
          order: 6,
        },
        {
          name: 'buste_paga',
          label: 'Ultime 3 buste paga se lavoratore dipendente',
          type: 'file',
          required: false,
          order: 7,
          multiple: true,
        },
        {
          name: 'modello_s3',
          label: 'Modello S3 firmato',
          type: 'file',
          required: false,
          order: 8,
        },
        {
          name: 'bollettino_domestico',
          label: 'Bollettino di versamento dei contributi se domestico',
          type: 'file',
          required: false,
          order: 9,
        },
        {
          name: 'iscrizione_camera',
          label:
            'Certificato di Iscrizione alla Camera di Commercio se lavoratore autonomo',
          type: 'file',
          required: false,
          order: 10,
        },
        {
          name: 'certificato_piva',
          label: 'Certificato di attribuzione P.IVA se lavoratore autonomo',
          type: 'file',
          required: false,
          order: 11,
        },
        {
          name: 'contratto_alloggio',
          label:
            "Contratto di locazione o contratto di comodato gratuito o atto di proprietà dell'alloggio",
          type: 'file',
          required: true,
          order: 12,
        },
        {
          name: 'idoneita_abitativa',
          label: 'Idoneità abitativa',
          type: 'file',
          required: true,
          order: 13,
        },
        {
          name: 'modello_s2',
          label: 'Modello S2 firmato',
          type: 'file',
          required: true,
          order: 14,
        },
        {
          name: 'modello_s1',
          label: 'Modello S1 se presente un minore di 14 anni',
          type: 'file',
          required: false,
          order: 15,
        },
      ],
    },
  ],

  // =====================================================================
  // COLF E BADANTI
  // =====================================================================

  BUSTA_COLF_2026: [PERSONAL_INFO_COLF_BADANTE, UNILAV_CONTRATTO_SECTION],

  MAV_COLF_2026: [PERSONAL_INFO_COLF_BADANTE, UNILAV_CONTRATTO_SECTION],

  ASSU_COLF_2026: [PERSONAL_INFO_COLF_BADANTE],

  CU_COLF_2026: [PERSONAL_INFO_COLF_BADANTE, UNILAV_CONTRATTO_SECTION],

  LET_ASSU_COLF_2026: [
    PERSONAL_INFO_COLF_BADANTE,
    {
      id: 'mansioni_compiti',
      title: 'Mansioni e compiti',
      fields: [
        {
          name: 'mansioni',
          label:
            'Descrivi in dettaglio le mansioni che il lavoratore dovrà svolgere (es. pulizie domestiche, assistenza anziani/disabili, cucina, spesa, ecc.)',
          type: 'textarea',
          required: true,
          order: 1,
          maxLength: 500,
        },
      ],
    },
    {
      id: 'tipologia_assunzione',
      title: 'Tipologia di Assunzione',
      fields: [
        {
          name: 'tipo_lavoratore',
          label: 'Tipo di lavoratore',
          type: 'select',
          options: ['Colf', 'Badante convivente', 'Badante non convivente'],
          required: true,
          order: 1,
        },
        {
          name: 'data_inizio',
          label: 'Data di inizio rapporto di lavoro',
          type: 'date',
          required: true,
          order: 2,
        },
        {
          name: 'tipologia_contratto',
          label: 'Tipologia contratto',
          type: 'select',
          options: ['Tempo indeterminato', 'Tempo determinato'],
          required: true,
          order: 3,
        },
        {
          name: 'data_fine_contratto',
          label: 'Data fine contratto',
          type: 'date',
          required: false,
          order: 4,
          dependsOn: {
            field: 'tipologia_contratto',
            value: 'Tempo determinato',
          },
        },
        {
          name: 'periodo_prova',
          label: 'Periodo di prova (giorni)',
          type: 'number',
          required: true,
          order: 5,
        },
      ],
    },
    {
      id: 'orario_lavoro',
      title: 'Orario di Lavoro',
      fields: [
        {
          name: 'ore_settimanali',
          label: 'Numero ore settimanali',
          type: 'select',
          options: Array.from({ length: 40 }, (_, i) => String(i + 1)),
          required: true,
          order: 1,
        },
        {
          name: 'distribuzione_oraria',
          label: 'Distribuzione oraria',
          type: 'select',
          options: ['Lunedì–Venerdì', 'Anche weekend', 'Personalizzato'],
          required: true,
          order: 2,
        },
        {
          name: 'orario_giornaliero',
          label: 'Orario giornaliero (es. 9:00–13:00 / 15:00–18:00)',
          type: 'text',
          required: true,
          order: 3,
        },
        {
          name: 'convivente',
          label: 'Lavoratore convivente?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 4,
        },
        {
          name: 'camera_dedicata',
          label: 'Camera dedicata disponibile?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: false,
          order: 5,
          dependsOn: { field: 'convivente', value: 'Sì' },
        },
      ],
    },
    {
      id: 'inquadramento_retribuzione',
      title: 'Inquadramento e Retribuzione',
      fields: [
        {
          name: 'livello',
          label: 'Livello di inquadramento (CCNL lavoro domestico)',
          type: 'select',
          options: [
            'Livello A',
            'Livello AS',
            'Livello B',
            'Livello BS',
            'Livello C',
            'Livello CS',
            'Livello D',
            'Livello DS',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'tipo_retribuzione',
          label: 'Retribuzione',
          type: 'select',
          options: ['Mensile', 'Oraria'],
          required: true,
          order: 2,
        },
        {
          name: 'importo_pattuito',
          label: 'Importo pattuito (€)',
          type: 'number',
          required: true,
          order: 3,
        },
        {
          name: 'tredicesima_inclusa',
          label: 'Tredicesima inclusa?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 4,
        },
        {
          name: 'vitto_alloggio',
          label: 'Vitto e alloggio (per conviventi)',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 5,
        },
      ],
    },
    {
      id: 'persona_assistita',
      title: 'Persona Assistita (Solo per Badante)',
      fields: [
        {
          name: 'autosufficienza',
          label: 'La persona assistita è',
          type: 'select',
          options: [
            'Autosufficiente',
            'Non autosufficiente',
            'Disabile certificato',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'legge_104',
          label: 'Presenza di certificazione Legge 104?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
        {
          name: 'convive_datore',
          label: 'Convive con il datore di lavoro?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
      ],
    },
    {
      id: 'contributi_inps',
      title: 'Contributi e INPS',
      fields: [
        {
          name: 'prima_assunzione',
          label: 'È la prima assunzione domestica del datore?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'codice_datore_inps',
          label: 'Codice datore INPS già esistente?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
        {
          name: 'codice_datore_inps_val',
          label: 'Inserire codice INPS',
          type: 'text',
          required: false,
          order: 3,
          dependsOn: { field: 'codice_datore_inps', value: 'Sì' },
        },
        {
          name: 'pagamento_contributi',
          label: 'Pagamento contributi',
          type: 'select',
          options: ['A carico datore', 'Ripartizione standard'],
          required: true,
          order: 4,
        },
      ],
    },
  ],

  CESS_COLF_2026: [
    PERSONAL_INFO_COLF_BADANTE,
    UNILAV_CONTRATTO_SECTION,
    {
      id: 'data_cessazione',
      title: 'Data Cessazione',
      fields: [
        {
          name: 'data_ultimo_giorno',
          label: 'Data ultimo giorno di lavoro',
          type: 'date',
          required: true,
          order: 1,
        },
      ],
    },
  ],

  VAR_COLF_2026: [
    PERSONAL_INFO_COLF_BADANTE,
    UNILAV_CONTRATTO_SECTION,
    {
      id: 'comunicazione_variazione',
      title: 'Comunicazione',
      fields: [
        {
          name: 'motivo',
          label: 'Motivo',
          type: 'textarea',
          required: true,
          order: 1,
          maxLength: 500,
        },
        {
          name: 'allegato',
          label: 'Allega file',
          type: 'file',
          required: false,
          order: 2,
          multiple: true,
        },
      ],
    },
  ],

  // =====================================================================
  // MATERNITÀ
  // =====================================================================

  ASS_MATERN_2026: [
    SPID_SECTION,
    {
      id: 'dati_figlio',
      title: 'Dati del Figlio / Figlia',
      fields: [
        {
          name: 'cf_figlio',
          label: 'Codice Fiscale/Tessera Sanitaria',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'certificato_nascita',
          label: 'Certificato di nascita',
          type: 'file',
          required: true,
          order: 2,
        },
      ],
    },
    {
      id: 'situazione_economica',
      title: 'Situazione Economica',
      fields: [
        { name: 'isee', label: 'ISEE', type: 'file', required: true, order: 1 },
      ],
    },
    IBAN_SECTION,
  ],

  BON_NATI_2026: [
    {
      id: 'dati_figlio',
      title: 'Dati del Figlio / Figlia',
      fields: [
        {
          name: 'cf_figlio',
          label: 'Codice Fiscale/Tessera Sanitaria',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'certificato_nascita',
          label: 'Certificato di nascita',
          type: 'file',
          required: true,
          order: 2,
        },
      ],
    },
    {
      id: 'nucleo_familiare',
      title: 'Nucleo Familiare',
      fields: [
        {
          name: 'numero_componenti',
          label: 'Numero componenti nucleo familiare',
          type: 'select',
          options: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'altri_figli_minori',
          label: 'Presenza di altri figli minori?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
        {
          name: 'disabilita_nucleo',
          label: 'Presenza di disabilità nel nucleo?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
      ],
    },
    {
      id: 'situazione_economica',
      title: 'Situazione Economica',
      fields: [
        { name: 'isee', label: 'ISEE', type: 'file', required: true, order: 1 },
      ],
    },
    IBAN_SECTION,
  ],

  CONG_PAR_DIP_2026: [
    {
      id: 'dati_figlio',
      title: 'Dati del Figlio / Figlia',
      fields: [
        {
          name: 'cf_figlio',
          label: 'Codice Fiscale/Tessera Sanitaria',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'certificato_nascita',
          label: 'Certificato di nascita',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'meno_12_anni',
          label: 'Il bambino ha meno di 12 anni?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
        {
          name: 'disabilita_104',
          label: 'Presenza di disabilità grave (L.104)?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 4,
        },
        {
          name: 'disabilita_104_file',
          label: 'Documentazione L.104',
          type: 'file',
          required: false,
          order: 5,
          dependsOn: { field: 'disabilita_104', value: 'Sì' },
        },
      ],
    },
    {
      id: 'altro_genitore',
      title: 'Altro Genitore',
      fields: [
        {
          name: 'ag_nome',
          label: 'Nome',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'ag_cognome',
          label: 'Cognome',
          type: 'text',
          required: true,
          order: 2,
        },
        {
          name: 'ag_codice_fiscale',
          label: 'Codice Fiscale',
          type: 'text',
          required: true,
          order: 3,
          maxLength: 16,
        },
        {
          name: 'ag_stato',
          label: "L'altro genitore è",
          type: 'select',
          options: [
            'Lavoratore dipendente',
            'Autonomo',
            'Disoccupato',
            'Non convivente',
            'Deceduto',
          ],
          required: true,
          order: 4,
        },
        {
          name: 'ag_congedo',
          label: "L'altro genitore sta usufruendo di congedo parentale?",
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 5,
        },
        {
          name: 'ag_congedo_inizio',
          label: 'Data inizio congedo altro genitore',
          type: 'date',
          required: false,
          order: 6,
          dependsOn: { field: 'ag_congedo', value: 'Sì' },
        },
        {
          name: 'ag_mesi_fruiti',
          label: "Numero mesi già fruiti dall'altro genitore",
          type: 'select',
          options: ['1', '2', '3', '4', '5', '6'],
          required: false,
          order: 7,
        },
      ],
    },
    {
      id: 'dati_lavorativi',
      title: 'Dati Lavorativi del Richiedente',
      fields: [
        {
          name: 'unilav',
          label: 'UNILAV',
          type: 'file',
          required: true,
          order: 1,
        },
      ],
    },
    {
      id: 'periodo_congedo',
      title: 'Periodo di Congedo Richiesto',
      fields: [
        {
          name: 'modalita',
          label: 'Modalità richiesta',
          type: 'select',
          options: ['Continuativa', 'Frazionata a giorni', 'Frazionata a ore'],
          required: true,
          order: 1,
        },
        {
          name: 'data_inizio',
          label: 'Data inizio congedo',
          type: 'date',
          required: true,
          order: 2,
        },
        {
          name: 'data_fine',
          label: 'Data fine congedo',
          type: 'date',
          required: true,
          order: 3,
        },
        {
          name: 'frazionato_file',
          label: 'Documentazione frazionamento',
          type: 'file',
          required: false,
          order: 4,
          dependsOn: { field: 'modalita', value: 'Frazionata a giorni' },
        },
        {
          name: 'mesi_fruiti',
          label: 'Numero totale mesi già fruiti dal richiedente',
          type: 'select',
          options: ['1', '2', '3', '4', '5', '6'],
          required: false,
          order: 5,
        },
      ],
    },
    {
      id: 'situazioni_particolari',
      title: 'Situazioni Particolari',
      fields: [
        {
          name: 'genitore_unico',
          label: 'Sei genitore unico?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'separato_divorziato',
          label: 'Sei genitore separato/divorziato?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
        {
          name: 'adottato_affidamento',
          label: 'Il bambino è adottato o in affidamento?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
        {
          name: 'data_ingresso_famiglia',
          label: 'Data ingresso in famiglia',
          type: 'date',
          required: false,
          order: 4,
          dependsOn: { field: 'adottato_affidamento', value: 'Sì' },
        },
      ],
    },
    IBAN_SECTION,
    {
      id: 'documenti_extra',
      title: 'Documenti da Caricare',
      description: 'Se richiesto',
      fields: [
        {
          name: 'sentenza_separazione',
          label: 'Sentenza separazione/affidamento',
          type: 'file',
          required: false,
          order: 1,
        },
        {
          name: 'ultima_busta_paga',
          label: 'Ultima busta paga',
          type: 'file',
          required: false,
          order: 2,
        },
        {
          name: 'contratto_lavoro',
          label: 'Contratto di lavoro',
          type: 'file',
          required: false,
          order: 3,
        },
      ],
    },
  ],

  // =====================================================================
  // INVALIDITÀ CIVILE
  // =====================================================================

  INVAL_CIV_2026: [
    {
      id: 'tipologia_domanda',
      title: 'Tipologia di Domanda',
      fields: [
        {
          name: 'certificato_medico',
          label: 'Certificato Medico',
          type: 'file',
          required: true,
          order: 1,
        },
      ],
    },
    {
      id: 'situazione_sanitaria',
      title: 'Situazione Sanitaria',
      fields: [
        {
          name: 'ricoverato',
          label: 'Sei attualmente ricoverato?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'nome_ospedale',
          label: "Nome dell'ospedale",
          type: 'text',
          required: false,
          order: 2,
          dependsOn: { field: 'ricoverato', value: 'Sì' },
        },
        {
          name: 'deambulare',
          label: 'Sei in grado di deambulare senza assistenza?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
      ],
    },
    {
      id: 'situazione_lavorativa',
      title: 'Situazione Lavorativa',
      fields: [
        {
          name: 'stato_occupazionale',
          label: 'Stato occupazionale',
          type: 'select',
          options: [
            'Occupato',
            'Disoccupato',
            'Inabile al lavoro',
            'Pensionato',
          ],
          required: true,
          order: 1,
        },
      ],
    },
    {
      id: 'prestazioni_economiche',
      title: 'Richiesta Prestazioni Economiche',
      fields: [
        {
          name: 'prestazione_economica',
          label: 'Vuoi richiedere anche prestazione economica?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'iban',
          label: 'IBAN (intestato alla richiedente)',
          type: 'text',
          required: false,
          order: 2,
          dependsOn: { field: 'prestazione_economica', value: 'Sì' },
        },
        {
          name: 'iban_file',
          label: 'Allega documento IBAN',
          type: 'file',
          required: false,
          order: 3,
          dependsOn: { field: 'prestazione_economica', value: 'Sì' },
        },
      ],
    },
    {
      id: 'minore_info',
      title: 'Minore',
      description: 'Se il richiedente è minorenne',
      fields: [
        {
          name: 'min_nome',
          label: 'Nome (Minorenne)',
          type: 'text',
          required: false,
          order: 1,
        },
        {
          name: 'min_cognome',
          label: 'Cognome (Minorenne)',
          type: 'text',
          required: false,
          order: 2,
        },
        {
          name: 'min_codice_fiscale',
          label: 'Codice Fiscale (Minorenne)',
          type: 'text',
          required: false,
          order: 3,
          maxLength: 16,
        },
        {
          name: 'min_data_nascita',
          label: 'Data di nascita (Minorenne)',
          type: 'date',
          required: false,
          order: 4,
        },
        {
          name: 'cf_genitori',
          label: 'Codice fiscale genitori',
          type: 'file',
          required: false,
          order: 5,
          multiple: true,
        },
        {
          name: 'stato_lavorativo_genitori',
          label: 'Stato lavorativo genitori',
          type: 'textarea',
          required: false,
          order: 6,
          maxLength: 500,
        },
      ],
    },
    DECLARATIONS_INVALIDITA,
  ],

  // =====================================================================
  // DICHIARAZIONE REDDITI
  // =====================================================================

  MOD_REDD_PF_2026: [
    {
      id: 'situazione_familiare',
      title: 'Situazione Familiare',
      fields: [
        {
          name: 'stato_civile',
          label: 'Stato civile',
          type: 'select',
          options: [
            'Celibe/Nubile',
            'Coniugato/a',
            'Separato/a',
            'Divorziato/a',
            'Vedovo/a',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'numero_familiari',
          label: 'Numero componenti nucleo familiare a carico',
          type: 'number',
          required: true,
          order: 2,
        },
        {
          name: 'cf_familiari_file',
          label: 'Codice Fiscale/Tessera Sanitaria per ogni familiare a carico',
          type: 'file',
          required: false,
          order: 3,
          multiple: true,
        },
      ],
    },
    {
      id: 'tipologia_redditi',
      title: 'Tipologia Redditi da Dichiarare',
      fields: [
        {
          name: 'cu_disponibile',
          label: 'Certificazione Unica (CU) disponibile?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'cu_file',
          label: 'Allega CU',
          type: 'file',
          required: false,
          order: 2,
          dependsOn: { field: 'cu_disponibile', value: 'Sì' },
        },
        {
          name: 'alt_lavoro_file',
          label: 'Documentazione lavoro dipendente/pensione alternativa',
          type: 'file',
          required: false,
          order: 3,
          dependsOn: { field: 'cu_disponibile', value: 'No' },
        },
        {
          name: 'ha_terreni_fabbricati',
          label: 'Redditi di terreni / fabbricati',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 4,
        },
        {
          name: 'terreni_fabbricati_file',
          label: 'Documentazione terreni/fabbricati',
          type: 'file',
          required: false,
          order: 5,
          dependsOn: { field: 'ha_terreni_fabbricati', value: 'Sì' },
        },
        {
          name: 'ha_capitale',
          label: 'Redditi di capitale / dividendi',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 6,
        },
        {
          name: 'capitale_file',
          label: 'Documentazione capitale/dividendi',
          type: 'file',
          required: false,
          order: 7,
          dependsOn: { field: 'ha_capitale', value: 'Sì' },
        },
        {
          name: 'ha_altri_redditi',
          label: 'Altri redditi (premi, indennità, affitti, ecc.)',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 8,
        },
        {
          name: 'altri_redditi_file',
          label: 'Documentazione altri redditi',
          type: 'file',
          required: false,
          order: 9,
          dependsOn: { field: 'ha_altri_redditi', value: 'Sì' },
        },
      ],
    },
    {
      id: 'detrazioni_deduzioni',
      title: 'Detrazioni e Deduzioni',
      fields: [
        {
          name: 'detrazioni',
          label: 'Seleziona e allega documentazione',
          type: 'checkbox',
          required: false,
          order: 1,
          options: [
            'Spese sanitarie',
            'Interessi mutui prima casa',
            'Spese istruzione / università',
            'Spese ristrutturazione / bonus edilizi',
            'Altre detrazioni (specificare)',
          ],
        },
        {
          name: 'detrazioni_files',
          label: 'Documentazione detrazioni',
          type: 'file',
          required: false,
          order: 2,
          multiple: true,
        },
      ],
    },
    DECLARATIONS_REDDITI,
  ],

  MOD_REDD_PFIVA_2026: [
    {
      id: 'situazione_familiare',
      title: 'Situazione Familiare',
      fields: [
        {
          name: 'stato_civile',
          label: 'Stato civile',
          type: 'select',
          options: [
            'Celibe/Nubile',
            'Coniugato/a',
            'Separato/a',
            'Divorziato/a',
            'Vedovo/a',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'numero_familiari',
          label: 'Numero componenti nucleo familiare a carico',
          type: 'number',
          required: true,
          order: 2,
        },
        {
          name: 'cf_familiari_file',
          label: 'Codice Fiscale/Tessera Sanitaria per ogni familiare a carico',
          type: 'file',
          required: false,
          order: 3,
          multiple: true,
        },
      ],
    },
    {
      id: 'dati_attivita',
      title: 'Dati Attività Professionale / Partita IVA',
      fields: [
        {
          name: 'codice_ateco',
          label: 'Codice ATECO principale',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'attivita_prevalente',
          label: 'Attività prevalente (descrizione)',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'data_apertura',
          label: 'Inizio attività / data apertura Partita IVA',
          type: 'file',
          required: true,
          order: 3,
        },
        {
          name: 'regime_fiscale',
          label: 'Regime fiscale Forfettario',
          type: 'file',
          required: true,
          order: 4,
        },
      ],
    },
    {
      id: 'reddito_forfettario',
      title: 'Reddito Forfettario e Altre Entrate',
      fields: [
        {
          name: 'ricavi_compensi',
          label: 'Ricavi / compensi annuali',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'altri_redditi',
          label: 'Eventuali altri redditi',
          type: 'checkbox',
          required: false,
          order: 2,
          options: [
            'Lavoro dipendente / pensione',
            'Redditi di capitale',
            'Redditi di fabbricati o terreni',
            'Altri',
          ],
        },
        {
          name: 'altri_redditi_files',
          label: 'Documentazione altri redditi',
          type: 'file',
          required: false,
          order: 3,
          multiple: true,
        },
        {
          name: 'aliquota_forfettaria',
          label: 'Aliquota forfettaria applicata',
          type: 'file',
          required: true,
          order: 4,
        },
      ],
    },
    {
      id: 'contributi_previdenziali',
      title: 'Contributi Previdenziali',
      fields: [
        {
          name: 'gestione_previdenziale',
          label: 'Gestione previdenziale di riferimento',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'contributi_versati',
          label: "Contributi versati nell'anno",
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'acconto_saldo',
          label: 'Eventuale acconto / saldo contributi',
          type: 'file',
          required: false,
          order: 3,
        },
      ],
    },
    {
      id: 'detrazioni_crediti',
      title: 'Detrazioni e Crediti',
      fields: [
        {
          name: 'detrazioni',
          label: 'Seleziona e allega',
          type: 'checkbox',
          required: false,
          order: 1,
          options: [
            'Spese sanitarie',
            'Interessi mutui prima casa',
            'Spese istruzione / università',
            'Spese ristrutturazione / bonus edilizi',
            "Crediti d'imposta per forfettari (se presenti)",
            'Altre detrazioni / deduzioni',
          ],
        },
        {
          name: 'detrazioni_files',
          label: 'Documentazione',
          type: 'file',
          required: false,
          order: 2,
          multiple: true,
        },
      ],
    },
    DECLARATIONS_REDDITI,
  ],

  INT_MOD_REDD_2026: [
    {
      id: 'dati_integrazione',
      title: 'Dati Dichiarazione da Integrare',
      fields: [
        {
          name: 'anno_riferimento',
          label: 'Anno di riferimento della dichiarazione',
          type: 'date',
          required: true,
          order: 1,
          description: 'Seleziona anno',
        },
        {
          name: 'tipo_dichiarazione',
          label: 'Tipo di dichiarazione',
          type: 'select',
          options: [
            'PF senza Partita IVA',
            'PF con Partita IVA Forfettaria',
            'PF con Partita IVA ordinaria',
          ],
          required: true,
          order: 2,
        },
        {
          name: 'motivazione',
          label: 'Motivazione integrazione',
          type: 'select',
          options: [
            'Aggiunta redditi mancanti',
            'Correzione dati già inseriti',
            'Aggiunta detrazioni / crediti',
            'Altro (specificare)',
          ],
          required: true,
          order: 3,
        },
        {
          name: 'motivazione_file',
          label: 'Documentazione motivazione',
          type: 'file',
          required: true,
          order: 4,
        },
      ],
    },
    {
      id: 'redditi_integrare',
      title: 'Tipologia Redditi da Integrare o Correggere',
      fields: [
        {
          name: 'tipo_reddito',
          label: 'Seleziona',
          type: 'select',
          options: [
            'Lavoro dipendente / pensione',
            'Redditi di terreni / fabbricati',
            'Redditi di capitale / dividendi',
            'Altri redditi (premi, indennità, affitti, ecc.)',
          ],
          required: true,
          order: 1,
        },
      ],
    },
    {
      id: 'detrazioni_correggere',
      title: 'Detrazioni e Crediti da Aggiungere / Correggere',
      fields: [
        {
          name: 'detrazioni',
          label: 'Seleziona e allega',
          type: 'checkbox',
          required: false,
          order: 1,
          options: [
            'Spese sanitarie',
            'Interessi mutui prima casa',
            'Spese istruzione / università',
            'Spese ristrutturazione / bonus edilizi',
            'Altri crediti o detrazioni',
          ],
        },
        {
          name: 'detrazioni_files',
          label: 'Documentazione',
          type: 'file',
          required: false,
          order: 2,
          multiple: true,
        },
      ],
    },
    {
      id: 'documenti_caricare',
      title: 'Documenti da Caricare',
      fields: [
        {
          name: 'documenti',
          label: 'Seleziona e allega',
          type: 'checkbox',
          required: false,
          order: 1,
          options: [
            'CU integrativa',
            'Fatture / ricevute aggiuntive',
            'Atti notarili o contratti di locazione',
          ],
        },
        {
          name: 'documenti_files',
          label: 'Documentazione',
          type: 'file',
          required: false,
          order: 2,
          multiple: true,
        },
      ],
    },
    DECLARATIONS_REDDITI,
  ],

  F24_CEDOL_2026: [
    {
      id: 'tipologia_f24',
      title: 'Tipologia',
      fields: [
        {
          name: 'lettera_ente',
          label:
            "Lettera ricevuta dall'Ente (INPS, AGE, Altri enti previdenziali, ecc)",
          type: 'file',
          required: true,
          order: 1,
        },
      ],
    },
    DECLARATIONS_REDDITI,
  ],

  DICH_IMU_2026: [
    {
      id: 'dati_immobile',
      title: 'Dati Immobile',
      fields: [
        {
          name: 'immobili',
          label: 'Immobili',
          type: 'dynamic_list',
          required: true,
          order: 1,
          description: 'Per ciascun immobile',
          subFields: [
            {
              name: 'indirizzo',
              label: 'Indirizzo completo (via, civico, CAP, comune)',
              type: 'text',
              required: true,
            },
            { name: 'citta', label: 'Città', type: 'text', required: true },
            { name: 'cap', label: 'CAP', type: 'text', required: true },
            {
              name: 'provincia',
              label: 'Provincia',
              type: 'text',
              required: true,
            },
            {
              name: 'rogito',
              label: 'Rogito/Compra Vendita',
              type: 'file',
              required: true,
              multiple: true,
            },
          ],
        },
      ],
    },
    {
      id: 'situazioni_particolari_imu',
      title: 'Situazioni Particolari',
      fields: [
        {
          name: 'cedolare_secca',
          label: 'Immobile locato con cedolare secca?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'canone_annuo',
          label: 'Canone annuo',
          type: 'text',
          required: false,
          order: 2,
          dependsOn: { field: 'cedolare_secca', value: 'Sì' },
        },
        {
          name: 'esente_imu',
          label: 'Immobile esente IMU?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
        {
          name: 'motivazione_esente',
          label: 'Motivazione esenzione',
          type: 'textarea',
          required: false,
          order: 4,
          maxLength: 500,
          dependsOn: { field: 'esente_imu', value: 'Sì' },
        },
        {
          name: 'riduzioni_imu',
          label: 'Immobili con riduzioni / detrazioni IMU?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 5,
        },
        {
          name: 'dettaglio_riduzioni',
          label: 'Dettagliare riduzioni',
          type: 'textarea',
          required: false,
          order: 6,
          maxLength: 500,
          dependsOn: { field: 'riduzioni_imu', value: 'Sì' },
        },
      ],
    },
    {
      id: 'calcolo_imu',
      title: 'Calcolo IMU',
      fields: [
        {
          name: 'periodo',
          label: 'Periodo di riferimento',
          type: 'select',
          options: ['6 mesi', '12 mesi'],
          required: true,
          order: 1,
        },
        {
          name: 'acconti_versati',
          label: 'Eventuali acconti già versati',
          type: 'file',
          required: false,
          order: 2,
        },
        {
          name: 'aliquota_imu',
          label: 'Aliquota IMU applicabile',
          type: 'file',
          required: false,
          order: 3,
        },
        {
          name: 'detrazioni_applicabili',
          label: 'Eventuali detrazioni / riduzioni applicabili',
          type: 'file',
          required: false,
          order: 4,
        },
      ],
    },
    {
      id: 'pagamento_imu',
      title: 'Modalità di pagamento',
      fields: [
        { name: 'iban', label: 'IBAN', type: 'text', required: true, order: 1 },
      ],
    },
    {
      id: 'documenti_imu',
      title: 'Documenti da Caricare',
      fields: [
        {
          name: 'visura_catastale',
          label: 'Visura catastale aggiornata',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'contratto_locazione',
          label: 'Eventuale contratto di locazione (per immobili locati)',
          type: 'file',
          required: false,
          order: 2,
        },
      ],
    },
    DECLARATIONS_REDDITI,
  ],

  // =====================================================================
  // PARTITA IVA
  // =====================================================================

  APERT_PIVA_2026: [
    {
      id: 'tipologia_attivita',
      title: 'Tipologia di Attività',
      fields: [
        {
          name: 'tipo_attivita',
          label: 'Tipo di attività',
          type: 'select',
          options: [
            'Libero professionista',
            'Lavoratore autonomo',
            'Impresa individuale',
            'Esercizio attività commerciale',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'codice_ateco',
          label: 'Settore economico / codice ATECO',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'attivita_secondaria',
          label: 'Attività prevalente / secondaria (se presente)',
          type: 'file',
          required: false,
          order: 3,
        },
      ],
    },
    {
      id: 'requisiti_fiscali',
      title: 'Requisiti Fiscali e Previdenziali',
      fields: [
        {
          name: 'gestione_inps',
          label: 'Sei già iscritto a qualche gestione INPS?',
          type: 'select',
          options: [
            'Gestione Separata',
            'Artigiani',
            'Commercianti',
            'Nessuna',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'iscrizione_inps',
          label:
            'Vuoi iscrizione obbligatoria alla gestione INPS per la tua attività?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
        {
          name: 'altre_piva',
          label: 'Possiedi altre Partite IVA?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
        {
          name: 'altre_piva_file',
          label: 'Documentazione altre P.IVA',
          type: 'file',
          required: false,
          order: 4,
          dependsOn: { field: 'altre_piva', value: 'Sì' },
        },
        {
          name: 'iscritto_vies',
          label: 'Sei già iscritto al VIES (per operazioni UE)?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 5,
        },
      ],
    },
    {
      id: 'forma_giuridica',
      title: 'Forma Giuridica',
      fields: [
        {
          name: 'forma',
          label: 'Forma giuridica',
          type: 'select',
          options: ['Individuale', 'Forfettario', 'Altra forma (specificare)'],
          required: true,
          order: 1,
        },
        {
          name: 'altra_forma_dettaglio',
          label: 'Specificare altra forma',
          type: 'textarea',
          required: false,
          order: 2,
          maxLength: 500,
          dependsOn: { field: 'forma', value: 'Altra forma (specificare)' },
        },
      ],
    },
    {
      id: 'sede_attivita',
      title: 'Dati Sede Attività',
      fields: [
        {
          name: 'indirizzo_sede',
          label: 'Indirizzo sede legale / operativa',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'comune_sede',
          label: 'Comune',
          type: 'text',
          required: true,
          order: 2,
        },
        {
          name: 'cap_sede',
          label: 'CAP',
          type: 'text',
          required: true,
          order: 3,
        },
        {
          name: 'provincia_sede',
          label: 'Provincia',
          type: 'text',
          required: true,
          order: 4,
        },
        {
          name: 'telefono_sede',
          label: 'Telefono sede (opzionale)',
          type: 'tel',
          required: false,
          order: 5,
        },
      ],
    },
    {
      id: 'regime_fiscale',
      title: 'Regime Fiscale',
      fields: [
        {
          name: 'regime',
          label: 'Regime fiscale desiderato',
          type: 'select',
          options: [
            'Regime forfettario (reddito ≤ 85.000 €)',
            'Regime ordinario',
            'Altro / specificare',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'data_inizio_attivita',
          label: 'Data inizio attività',
          type: 'date',
          required: true,
          order: 2,
        },
      ],
    },
    DECLARATIONS_PARTITA_IVA,
  ],

  VAR_PIVA_2026: [
    {
      id: 'tipologia_variazione',
      title: 'Tipologia di Variazione',
      fields: [
        {
          name: 'tipo_variazione',
          label: 'Seleziona il tipo di variazione richiesta',
          type: 'select',
          options: [
            'Cambio attività / codice ATECO',
            'Cambio sede legale / operativa',
            'Cambio regime fiscale (forfettario / ordinario / altro)',
            'Cessazione attività',
            'Altre variazioni (specificare)',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'data_cessazione',
          label: 'Data cessazione',
          type: 'date',
          required: false,
          order: 2,
          dependsOn: { field: 'tipo_variazione', value: 'Cessazione attività' },
        },
        {
          name: 'altre_variazioni',
          label: 'Specificare altre variazioni',
          type: 'textarea',
          required: false,
          order: 3,
          maxLength: 500,
          dependsOn: {
            field: 'tipo_variazione',
            value: 'Altre variazioni (specificare)',
          },
        },
      ],
    },
    {
      id: 'dati_piva',
      title: 'Dati Partita IVA Esistente',
      fields: [
        {
          name: 'visura_camerale',
          label: 'Visura Camerale Aggiornata',
          type: 'file',
          required: true,
          order: 1,
        },
      ],
    },
    {
      id: 'nuovi_dati',
      title: 'Dati Nuovi da Modificare',
      fields: [
        {
          name: 'dati_da_modificare',
          label: 'Seleziona dati da modificare',
          type: 'checkbox',
          options: [
            'Nuovo codice ATECO / attività',
            'Nuova sede legale / operativa',
            'Data effetto variazione',
            'Nuovo recapito email / telefono sede',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'data_effetto',
          label: 'Data effetto variazione',
          type: 'date',
          required: false,
          order: 2,
        },
        {
          name: 'nuovo_recapito',
          label: 'Nuovo recapito',
          type: 'textarea',
          required: false,
          order: 3,
          maxLength: 500,
        },
      ],
    },
    {
      id: 'documenti_var_piva',
      title: 'Documenti da Caricare',
      fields: [
        {
          name: 'certificato_residenza',
          label: 'Certificato residenza (se richiesto)',
          type: 'file',
          required: false,
          order: 1,
        },
        {
          name: 'contratto_sede',
          label: 'Contratto / documentazione sede legale nuova (se cambia)',
          type: 'file',
          required: false,
          order: 2,
        },
        {
          name: 'autorizzazioni',
          label: 'Eventuali autorizzazioni / licenze attività',
          type: 'file',
          required: false,
          order: 3,
        },
        {
          name: 'dichiarazione_precedente',
          label: 'Dichiarazione redditi precedente (CU, 730 o Redditi)',
          type: 'file',
          required: false,
          order: 4,
        },
      ],
    },
    DECLARATIONS_VAR_PIVA,
  ],

  CESS_DITA_2026: [
    {
      id: 'tipologia_cessazione',
      title: 'Tipologia di Cessazione',
      fields: [
        {
          name: 'chiusura_definitiva',
          label: 'Chiusura definitiva attività',
          type: 'date',
          required: false,
          order: 1,
        },
        {
          name: 'passaggio_forma',
          label: 'Passaggio ad altra forma giuridica',
          type: 'textarea',
          required: false,
          order: 2,
          maxLength: 500,
          description: 'Indicare nuova forma',
        },
        {
          name: 'trasferimento',
          label: 'Trasferimento ditta / cessione attività',
          type: 'textarea',
          required: false,
          order: 3,
          maxLength: 500,
          description: 'Richiedere dati nuovo titolare',
        },
      ],
    },
    {
      id: 'dati_ditta',
      title: 'Dati Ditta Individuale',
      fields: [
        {
          name: 'visura_camerale',
          label: 'Visura Camerale Aggiornata',
          type: 'file',
          required: true,
          order: 1,
        },
      ],
    },
    {
      id: 'motivazione_cessazione',
      title: 'Motivazione Cessazione',
      fields: [
        {
          name: 'motivo',
          label: 'Motivo cessazione',
          type: 'select',
          options: [
            'Fine attività',
            'Trasferimento attività',
            'Passaggio a società / altra forma giuridica',
            'Altro (specificare)',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'altro_motivo',
          label: 'Specificare',
          type: 'textarea',
          required: false,
          order: 2,
          maxLength: 500,
          dependsOn: { field: 'motivo', value: 'Altro (specificare)' },
        },
        {
          name: 'data_effetto',
          label: 'Data effetto cessazione',
          type: 'date',
          required: true,
          order: 3,
        },
        {
          name: 'cessazione_inps',
          label: 'Vuoi cessazione contestuale iscrizione INPS?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 4,
        },
      ],
    },
    {
      id: 'situazione_contabile',
      title: 'Situazione Contabile e Fiscale',
      fields: [
        {
          name: 'ultimo_bilancio',
          label: 'Ultimo bilancio / dichiarazione redditi presentata?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'bilancio_file',
          label: 'Documentazione bilancio',
          type: 'file',
          required: false,
          order: 2,
          dependsOn: { field: 'ultimo_bilancio', value: 'Sì' },
        },
        {
          name: 'motivazione_no_bilancio',
          label: 'Spiegare motivazione',
          type: 'textarea',
          required: false,
          order: 3,
          maxLength: 500,
          dependsOn: { field: 'ultimo_bilancio', value: 'No' },
        },
        {
          name: 'debiti_pendenti',
          label: 'Ci sono debiti fiscali o contributivi pendenti?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 4,
        },
        {
          name: 'dettaglio_debiti',
          label: 'Indicare importo e tipologia',
          type: 'textarea',
          required: false,
          order: 5,
          maxLength: 500,
          dependsOn: { field: 'debiti_pendenti', value: 'Sì' },
        },
        {
          name: 'ha_dipendenti',
          label: 'Hai dipendenti?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 6,
        },
        {
          name: 'dettaglio_dipendenti',
          label: 'Indicare numero e gestione contributiva',
          type: 'textarea',
          required: false,
          order: 7,
          maxLength: 500,
          dependsOn: { field: 'ha_dipendenti', value: 'Sì' },
        },
      ],
    },
    {
      id: 'documenti_cessazione',
      title: 'Documenti da Caricare',
      fields: [
        {
          name: 'ultima_dichiarazione',
          label: 'Ultima dichiarazione redditi / CU / 730',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'comunicazioni_inps',
          label: 'Comunicazioni INPS (se presenti)',
          type: 'file',
          required: false,
          order: 2,
        },
        {
          name: 'dati_nuovo_titolare',
          label: 'Dati nuovo titolare (se trasferimento/cessione)',
          type: 'file',
          required: false,
          order: 3,
        },
        {
          name: 'contratto_cessione',
          label: 'Contratto di cessione / subentro',
          type: 'file',
          required: false,
          order: 4,
        },
      ],
    },
    DECLARATIONS_CESSAZIONE_DITA,
  ],

  COMM_CAM_2026: [
    {
      id: 'tipologia_comunicazione',
      title: 'Tipologia di Comunicazione',
      fields: [
        {
          name: 'tipo',
          label: 'Seleziona tipologia',
          type: 'select',
          options: [
            'Iscrizione nuova impresa',
            'Variazione dati impresa',
            'Cessazione impresa',
            'Modifica sede / unità locale',
            'Altre comunicazioni',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'variazione_dettaglio',
          label: 'Dettaglio variazione',
          type: 'textarea',
          required: false,
          order: 2,
          maxLength: 500,
          dependsOn: { field: 'tipo', value: 'Variazione dati impresa' },
        },
        {
          name: 'data_cessazione',
          label: 'Data cessazione',
          type: 'date',
          required: false,
          order: 3,
          dependsOn: { field: 'tipo', value: 'Cessazione impresa' },
        },
        {
          name: 'altre_comunicazioni',
          label: 'Dettaglio',
          type: 'textarea',
          required: false,
          order: 4,
          maxLength: 500,
          dependsOn: { field: 'tipo', value: 'Altre comunicazioni' },
        },
      ],
    },
    {
      id: 'dati_impresa',
      title: 'Dati Impresa / Società',
      fields: [
        {
          name: 'visura_camerale',
          label: 'Visura Camerale Aggiornata',
          type: 'file',
          required: true,
          order: 1,
        },
      ],
    },
    {
      id: 'sede_unita',
      title: 'Dati Sede / Unità Locale',
      fields: [
        {
          name: 'unita_locali',
          label: 'Eventuali unità locali da registrare / modificare / cessare',
          type: 'textarea',
          required: false,
          order: 1,
          maxLength: 500,
        },
        {
          name: 'data_effetto',
          label: 'Data effetto variazione',
          type: 'date',
          required: false,
          order: 2,
        },
      ],
    },
    {
      id: 'obiettivi',
      title: 'Obiettivi Comunicazione',
      fields: [
        {
          name: 'obiettivo',
          label: 'Vuoi',
          type: 'select',
          options: [
            'Registrazione attività',
            'Aggiornamento dati anagrafici',
            'Aggiornamento attività / ATECO',
            'Modifica sede / unità locale',
            'Cessazione impresa',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'data_chiusura',
          label: 'Se cessazione: data chiusura attività',
          type: 'date',
          required: false,
          order: 2,
          dependsOn: { field: 'obiettivo', value: 'Cessazione impresa' },
        },
        {
          name: 'data_inizio',
          label: 'Se nuova iscrizione: data inizio attività',
          type: 'date',
          required: false,
          order: 3,
          dependsOn: { field: 'obiettivo', value: 'Registrazione attività' },
        },
      ],
    },
    {
      id: 'documenti_cam',
      title: 'Documenti da Caricare',
      fields: [
        {
          name: 'doc_identita',
          label: 'Documento identità titolare / legale rappresentante',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'cf_piva',
          label: 'Codice fiscale / Partita IVA',
          type: 'file',
          required: true,
          order: 2,
        },
        {
          name: 'modello_cciaa',
          label: 'Modello Comunicazione CCIAA (se già compilato)',
          type: 'file',
          required: false,
          order: 3,
        },
        {
          name: 'atto_costitutivo',
          label: 'Contratto / atto costitutivo (se società)',
          type: 'file',
          required: false,
          order: 4,
        },
        {
          name: 'bilanci',
          label:
            'Ultimi bilanci / dichiarazioni redditi (se variazione o cessazione)',
          type: 'file',
          required: false,
          order: 5,
        },
        {
          name: 'autorizzazioni',
          label: 'Autorizzazioni / licenze',
          type: 'file',
          required: false,
          order: 6,
        },
        {
          name: 'certificazioni',
          label: 'Certificazioni di unità locale',
          type: 'file',
          required: false,
          order: 7,
        },
      ],
    },
    DECLARATIONS_CAM_COMMERCIO,
  ],

  // =====================================================================
  // CONTRATTI DI LOCAZIONE
  // =====================================================================

  CONTR_LOC_2026: [
    PERSONAL_INFO_SECOND_PERSON(
      'affittuario',
      'Informazioni personali (Affittuario)',
    ),
    {
      id: 'tipologia_richiesta',
      title: 'Tipologia di Richiesta',
      fields: [
        {
          name: 'tipo_richiesta',
          label: 'Tipo richiesta',
          type: 'select',
          options: [
            'Registrazione nuovo contratto',
            'Proroga / Rinnovo contratto',
            'Risoluzione / Cessazione contratto',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'contratto_esistente',
          label: 'Contratto esistente (per proroga/risoluzione)',
          type: 'file',
          required: false,
          order: 2,
          dependsOn: {
            field: 'tipo_richiesta',
            value: 'Registrazione nuovo contratto',
            isNot: true,
          },
        },
      ],
    },
    {
      id: 'dati_immobile_loc',
      title: 'Dati Immobile',
      fields: [
        {
          name: 'indirizzo_immobile',
          label: 'Indirizzo completo (via, civico, CAP, comune, provincia)',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'tipo_immobile',
          label: 'Tipo immobile',
          type: 'select',
          options: [
            'Abitazione principale',
            'Seconda casa',
            'Locale commerciale',
            'Altro',
          ],
          required: true,
          order: 2,
        },
        {
          name: 'rogito',
          label: 'Rogito',
          type: 'file',
          required: true,
          order: 3,
        },
      ],
    },
    {
      id: 'durata_contratto',
      title: 'Durata Contratto',
      fields: [
        {
          name: 'data_inizio',
          label: 'Data inizio contratto',
          type: 'date',
          required: true,
          order: 1,
        },
        {
          name: 'data_fine',
          label: 'Data fine contratto',
          type: 'date',
          required: true,
          order: 2,
        },
        {
          name: 'tipologia_contratto',
          label: 'Tipologia contratto',
          type: 'select',
          options: [
            '4+4 anni',
            '3+2 anni (canone concordato)',
            'Transitorio (max 18 mesi)',
            'Student housing',
            'Altro',
          ],
          required: true,
          order: 3,
        },
        {
          name: 'canone',
          label: 'Canone annuo / mensile concordato',
          type: 'text',
          required: true,
          order: 4,
        },
        {
          name: 'modalita_pagamento',
          label: 'Modalità pagamento',
          type: 'select',
          options: ['Bonifico', 'Contanti', 'Assegno'],
          required: true,
          order: 5,
        },
        {
          name: 'iban_loc',
          label: 'IBAN',
          type: 'text',
          required: false,
          order: 6,
          dependsOn: { field: 'modalita_pagamento', value: 'Bonifico' },
        },
      ],
    },
    {
      id: 'deposito_cauzionale',
      title: 'Deposito Cauzionale',
      fields: [
        {
          name: 'importo_cauzione',
          label: 'Importo cauzione',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'numero_mensilita',
          label: 'Numero mensilità',
          type: 'text',
          required: true,
          order: 2,
        },
        {
          name: 'condizioni_restituzione',
          label: 'Condizioni restituzione',
          type: 'text',
          required: true,
          order: 3,
        },
      ],
    },
    {
      id: 'detrazioni_fiscali_loc',
      title: 'Detrazioni Fiscali',
      fields: [
        {
          name: 'detrazione_affitto',
          label: 'Vuoi richiedere detrazione affitto?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'tipo_detrazione',
          label: 'Tipo di detrazione',
          type: 'select',
          options: [
            'Residenza principale',
            'Studente fuori sede',
            'Contratto commerciale / locazione non abitativa',
          ],
          required: false,
          order: 2,
          dependsOn: { field: 'detrazione_affitto', value: 'Sì' },
        },
      ],
    },
    DECLARATIONS_LOCAZIONE,
  ],

  // =====================================================================
  // SOSTEGNO ALLE FAMIGLIE
  // =====================================================================

  ASS_UNICO_2026: [
    STATO_CIVILE_NUCLEO(),
    FIGLI_CARICHI_SECTION(),
    ISEE_SECTION,
    IBAN_SECTION,
    DECLARATIONS_SOSTEGNO_AUU,
  ],

  ASS_INCL_2026: [
    STATO_CIVILE_NUCLEO(
      true,
      'Numero componenti nucleo familiare',
      'Numero componenti nucleo familiare',
    ),
    FIGLI_CARICHI_SECTION(false, false),
    ISEE_SECTION,
    {
      id: 'coordinamento_sussidi',
      title: 'Coordinamento con altri Sussidi',
      fields: [
        {
          name: 'ricevi_rdc',
          label: 'Ricevi già Reddito di Cittadinanza o altri bonus INPS?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'rdc_dettaglio',
          label: 'Dettaglio',
          type: 'textarea',
          required: false,
          order: 2,
          maxLength: 500,
          dependsOn: { field: 'ricevi_rdc', value: 'Sì' },
        },
        {
          name: 'rdc_file',
          label: 'Documentazione',
          type: 'file',
          required: false,
          order: 3,
          dependsOn: { field: 'ricevi_rdc', value: 'Sì' },
        },
        {
          name: 'cumulabilita',
          label: 'Vuoi cumulabilità con altre misure di sostegno?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 4,
        },
      ],
    },
    IBAN_SECTION,
    DECLARATIONS_SOSTEGNO_ADI,
  ],

  BON_ASILO_2026: [
    STATO_CIVILE_NUCLEO(true, 'Numero figli a carico'),
    FIGLI_CARICHI_SECTION(true, false),
    ISEE_SECTION,
    IBAN_SECTION,
    DECLARATIONS_SOSTEGNO_NIDO,
  ],

  BON_NATI_SOC_2026: [
    {
      id: 'dati_figlio',
      title: 'Dati del Figlio / Figlia',
      fields: [
        {
          name: 'cf_figlio',
          label: 'Codice Fiscale/Tessera Sanitaria',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'certificato_nascita',
          label: 'Certificato di nascita',
          type: 'file',
          required: true,
          order: 2,
        },
      ],
    },
    {
      id: 'nucleo_familiare',
      title: 'Nucleo Familiare',
      fields: [
        {
          name: 'numero_componenti',
          label: 'Numero componenti nucleo familiare',
          type: 'select',
          options: [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '7',
            '8',
            '9',
            '10',
            '11',
            '12',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'altri_figli_minori',
          label: 'Presenza di altri figli minori?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
        {
          name: 'disabilita_nucleo',
          label: 'Presenza di disabilità nel nucleo?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
      ],
    },
    ISEE_SECTION,
    IBAN_SECTION,
    {
      id: 'requisiti_specifici',
      title: 'Requisiti Specifici (Condizionali)',
      fields: [
        {
          name: 'primo_figlio',
          label: 'Il bambino è il primo figlio?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'residenza_minima',
          label: 'Residenza minima richiesta rispettata?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
        {
          name: 'reddito_sotto_soglia',
          label: 'Reddito familiare sotto la soglia prevista?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
      ],
    },
  ],

  AGG_ASS_UNIV_2026: [
    {
      id: 'aggiornamento_figli',
      title: 'Aggiornamento Figli a Carico',
      description: 'Repeatable for each child',
      fields: [
        {
          name: 'figli',
          label: 'Dati figli a carico',
          type: 'dynamic_list',
          required: true,
          order: 1,
          subFields: [
            {
              name: 'nome_cognome',
              label: 'Nome e Cognome',
              type: 'text',
              required: true,
            },
            {
              name: 'codice_fiscale',
              label: 'Codice Fiscale',
              type: 'text',
              required: true,
              maxLength: 16,
            },
            {
              name: 'data_nascita',
              label: 'Data di nascita',
              type: 'date',
              required: true,
            },
            {
              name: 'residenza_uguale',
              label: 'Residenza',
              type: 'radio',
              options: ['Same as dichiarante', 'No'],
              required: true,
            },
            {
              name: 'indirizzo_figlio',
              label: 'Indirizzo figlio',
              type: 'text',
              required: false,
              dependsOn: { field: 'residenza_uguale', value: 'No' },
            },
            {
              name: 'situazione',
              label: 'Situazione particolare',
              type: 'select',
              options: ['Nessuna', 'Disabile', 'Studente fuori sede'],
              required: false,
            },
            {
              name: 'cert_disabilita',
              label: 'Certificazione disabilità figlio',
              type: 'file',
              required: false,
              dependsOn: { field: 'situazione', value: 'Disabile' },
            },
            {
              name: 'cert_studi',
              label: 'Certificazioni studi fuori sede',
              type: 'file',
              required: false,
              dependsOn: { field: 'situazione', value: 'Studente fuori sede' },
            },
          ],
        },
      ],
    },
    ISEE_SECTION,
    IBAN_SECTION,
    {
      id: 'documenti_agg',
      title: 'Documenti da Caricare',
      fields: [
        {
          name: 'ricevuta_domanda',
          label: 'Ricevuta/Numero domanda già presentata',
          type: 'file',
          required: true,
          order: 1,
        },
      ],
    },
    DECLARATIONS_SOSTEGNO_AGG,
  ],

  PAD_ASS_INCL_2026: [
    STATO_CIVILE_NUCLEO(
      true,
      'Numero componenti nucleo familiare',
      'Numero componenti nucleo familiare',
    ),
    {
      id: 'componenti_nucleo_pad',
      title: 'Componenti del Nucleo e Situazioni Particolari',
      description: 'Repeatable for each household member',
      fields: [
        {
          name: 'componenti',
          label: 'Componenti nucleo',
          type: 'dynamic_list',
          required: true,
          order: 1,
          subFields: [
            {
              name: 'nome_cognome',
              label: 'Nome e Cognome',
              type: 'text',
              required: true,
            },
            {
              name: 'codice_fiscale',
              label: 'Codice Fiscale',
              type: 'text',
              required: true,
              maxLength: 16,
            },
            {
              name: 'data_nascita',
              label: 'Data di nascita',
              type: 'date',
              required: true,
            },
            {
              name: 'residenza_uguale',
              label: 'Residenza',
              type: 'radio',
              options: ['Same as dichiarante', 'No'],
              required: true,
            },
            {
              name: 'indirizzo',
              label: 'Indirizzo',
              type: 'text',
              required: false,
              dependsOn: { field: 'residenza_uguale', value: 'No' },
            },
            {
              name: 'disabile',
              label: 'Disabile',
              type: 'radio',
              options: ['Sì', 'No'],
              required: true,
            },
            {
              name: 'cert_disabilita',
              label: 'Certificazione disabilità',
              type: 'file',
              required: false,
              dependsOn: { field: 'disabile', value: 'Sì' },
            },
            {
              name: 'pad_per',
              label: 'PAD per',
              type: 'select',
              options: ['Minorenne', 'Anziano non autosufficiente', 'Nessuno'],
              required: true,
            },
            {
              name: 'altre_fragilita',
              label: 'Persone con altre fragilità sociali?',
              type: 'radio',
              options: ['Sì', 'No'],
              required: true,
            },
            {
              name: 'fragilita_dettaglio',
              label: 'Dettaglio fragilità',
              type: 'text',
              required: false,
              dependsOn: { field: 'altre_fragilita', value: 'Sì' },
            },
          ],
        },
      ],
    },
    ISEE_SECTION,
    {
      id: 'percorso_pad',
      title: 'Percorso PAD / Inclusione Attiva',
      fields: [
        {
          name: 'iscritto_percorsi',
          label: 'Sei già iscritto a percorsi di inclusione attiva?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'ente_progetto',
          label: 'Indicare ente / Progetto',
          type: 'textarea',
          required: false,
          order: 2,
          maxLength: 500,
          dependsOn: { field: 'iscritto_percorsi', value: 'Sì' },
        },
        {
          name: 'adesione_pad',
          label: 'Vuoi adesione a nuovo percorso PAD?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
        {
          name: 'area_pad',
          label: 'Specificare area (lavoro, formazione, sociale)',
          type: 'text',
          required: false,
          order: 4,
          dependsOn: { field: 'adesione_pad', value: 'Sì' },
        },
      ],
    },
    IBAN_SECTION,
    DECLARATIONS_SOSTEGNO_ADI,
  ],

  // =====================================================================
  // CERTIFICATI
  // =====================================================================

  CERT_ANAG_2026: [
    {
      id: 'tipo_certificato',
      title: 'Tipo di Certificato Anagrafico',
      description:
        'Seleziona uno o più certificati - il prezzo aumenta per ogni selezione',
      fields: [
        {
          name: 'certificati',
          label: 'Seleziona certificati richiesti',
          type: 'checkbox',
          required: true,
          order: 1,
          options: ['Residenza', 'Stato di Famiglia', 'Stato Civile'],
        },
      ],
    },
    SPID_SECTION,
    DECLARATIONS_CERTIFICATI,
  ],

  CERT_PEN_2026: [
    {
      id: 'tipo_certificato_penale',
      title: 'Tipo di Certificato Penale',
      description:
        'Seleziona uno o più certificati - il prezzo aumenta per ogni selezione',
      fields: [
        {
          name: 'certificati',
          label: 'Seleziona certificati richiesti',
          type: 'checkbox',
          required: true,
          order: 1,
          options: [
            'Casellario Giudiziale (Penale)',
            'Casellario dei Carichi Pendenti',
          ],
        },
      ],
    },
    DECLARATIONS_CERTIFICATI,
  ],
};

export function getServiceQuestionnaires(serviceCode: string) {
  return SERVICE_QUESTIONNAIRES[serviceCode] || [];
}
