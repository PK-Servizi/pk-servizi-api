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
// CUSTOM DECLARATIONS VARIANTS
// =====================================================================

// Dimissioni variant — used for all Dimissioni services
const DECLARATIONS_DIMISSIONI = {
  id: 'declarations_authorization',
  title: 'Dichiarazioni e Autorizzazioni',
  description: 'Declarations & Authorization for resignation services',
  fields: [
    {
      name: 'declare_data_truthful',
      label: 'Dichiaro che i dati forniti sono veritieri',
      type: 'checkbox',
      required: true,
      order: 1,
    },
    {
      name: 'authorize_patronato',
      label: "Autorizzo il Patronato all'invio delle dimissioni volontarie",
      type: 'checkbox',
      required: true,
      order: 2,
    },
    {
      name: 'authorize_gdpr',
      label: "Accetto l'informativa privacy (GDPR)",
      type: 'checkbox',
      required: true,
      order: 3,
    },
    {
      name: 'recontact_naspi',
      label: 'Desidero assistenza per NASpI o altri servizi Patronato',
      type: 'checkbox',
      required: false,
      order: 4,
    },
    {
      name: 'digital_signature',
      label: 'Firma Digitale',
      type: 'signature',
      required: true,
      order: 5,
      description: 'Please provide your digital signature',
    },
    {
      name: 'full_name_signature',
      label: 'Nome Completo',
      type: 'text',
      required: true,
      order: 6,
      description: 'Full name for signature verification',
    },
  ],
};

// 730 variant — used for 730 and Integrazione 730
const DECLARATIONS_730 = {
  id: 'declarations_authorization',
  title: 'Dichiarazioni e Autorizzazioni',
  description: 'Declarations & Authorization for tax return filing',
  fields: [
    {
      name: 'declare_data_truthful',
      label: 'Dichiaro che i dati inseriti sono completi e veritieri',
      type: 'checkbox',
      required: true,
      order: 1,
    },
    {
      name: 'authorize_caf_730',
      label: 'Autorizzo il CAF alla trasmissione del Modello 730',
      type: 'checkbox',
      required: true,
      order: 2,
    },
    {
      name: 'authorize_gdpr',
      label: "Accetto l'informativa privacy (GDPR)",
      type: 'checkbox',
      required: true,
      order: 3,
    },
    {
      name: 'recontact_fiscal',
      label: 'Desidero assistenza per altri servizi fiscali',
      type: 'checkbox',
      required: false,
      order: 4,
    },
    {
      name: 'digital_signature',
      label: 'Firma Digitale',
      type: 'signature',
      required: true,
      order: 5,
      description: 'Please provide your digital signature',
    },
    {
      name: 'full_name_signature',
      label: 'Nome Completo',
      type: 'text',
      required: true,
      order: 6,
      description: 'Full name for signature verification',
    },
  ],
};

// SPID section — used by Rateizzazione and Test Lingua
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
// SERVICE QUESTIONNAIRES
// =====================================================================

export const SERVICE_QUESTIONNAIRES: Record<string, any[]> = {
  // =====================================================================
  // ISEE SERVICES
  // =====================================================================

  // Service 1: ISEE Ordinario 2026
  ISEE_ORD_2026: [
    HOUSEHOLD_SECTION(),
    FINANCIAL_ASSETS_SECTION,
    REAL_ESTATE_SECTION,
    PRIMARY_RESIDENCE_SECTION,
    VEHICLES_SECTION,
    SPECIAL_SITUATIONS_SECTION,
  ],

  // Service 2: ISEE Universitario 2026
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

  // Service 3: ISEE Socio Sanitario 2026
  ISEE_SOC_2026: [
    HOUSEHOLD_SECTION(),
    FINANCIAL_ASSETS_SECTION,
    REAL_ESTATE_SECTION,
    PRIMARY_RESIDENCE_SECTION,
    VEHICLES_SECTION,
    SPECIAL_SITUATIONS_SECTION,
  ],

  // Service 4: ISEE Minorenni 2026
  ISEE_MIN_2026: [
    HOUSEHOLD_SECTION(),
    FINANCIAL_ASSETS_SECTION,
    REAL_ESTATE_SECTION,
    PRIMARY_RESIDENCE_SECTION,
    VEHICLES_SECTION,
    SPECIAL_SITUATIONS_SECTION,
  ],

  // Service 5: ISEE Corrente 2026
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
  // DISOCCUPAZIONE / NASPI SERVICES
  // =====================================================================

  // Service 1: Disoccupazione NASPI — same as SmartCaf.it (personal info + declarations only)
  NASP_2026: [],

  // Service 2: Disoccupazione Agricola — same as SmartCaf.it
  DAGRN_2026: [],

  // Service 3: Anticipo NASPI — same as SmartCaf.it
  ANTNAS_2026: [],

  // Service 4: DID - Dichiarazione di Immediata Disponibilità — personal info only
  DID_2026: [],

  // Service 5: PAD NASPI/DIS-COLL
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

  // Service 6: NASpI-Com
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

  // Service 7: Ricorso NASPI
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
  // MODELLO 730 SERVICES
  // =====================================================================

  // Service 1: 730
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
      description:
        'Employment/pension income and other income for the tax year',
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
          description:
            'Allegare un file per ogni CU secondo la selezione sopra',
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
          description: 'Per ogni immobile allega documentazione',
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
      description: 'Deductible and deductible expenses',
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
          description: 'Allegare documentazione per ciascuna spesa selezionata',
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
          description: 'Allegare documentazione per ogni selezione',
          dependsOn: { field: 'lavori_edilizi', hasSelection: true },
        },
      ],
    },
    // Custom 730 declarations
    DECLARATIONS_730,
  ],

  // Service 2: Integrazione 730
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
    // Custom 730 declarations
    DECLARATIONS_730,
  ],

  // =====================================================================
  // DIMISSIONI SERVICES
  // =====================================================================

  // Service 1: Dimissioni Volontarie
  DISM_VOL_2026: [
    {
      id: 'datore_lavoro',
      title: 'Datore di Lavoro',
      description: 'Employer information',
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
      description: 'Voluntary resignation date',
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
    DECLARATIONS_DIMISSIONI,
  ],

  // Service 2: Dimissioni per Giusta Causa
  DISM_GIUSTA_2026: [
    {
      id: 'datore_lavoro',
      title: 'Datore di Lavoro',
      description: 'Employer information',
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
      description: 'Last working day and reason for just cause resignation',
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
    DECLARATIONS_DIMISSIONI,
  ],

  // Service 3: Risoluzione Consensuale
  DISM_RISOL_2026: [
    {
      id: 'datore_lavoro',
      title: 'Datore di Lavoro',
      description: 'Employer information',
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
      description: 'Consensual resolution date',
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
    DECLARATIONS_DIMISSIONI,
  ],

  // Service 4: Revoca Dimissioni Volontarie
  DISM_REVOCA_2026: [
    {
      id: 'revoca_dimissioni',
      title: 'Revoca Dimissioni',
      description: 'Revocation of resignation',
      fields: [
        {
          name: 'ricevuta_dimissioni',
          label: 'Ricevuta dimissioni già effettuate',
          type: 'file',
          required: true,
          order: 1,
          description: 'Allega ricevuta dimissioni già effettuate',
        },
      ],
    },
    DECLARATIONS_DIMISSIONI,
  ],

  // =====================================================================
  // RATEIZZAZIONE
  // =====================================================================

  RATE_GEN_2026: [SPID_SECTION],

  // =====================================================================
  // CONSULENZA
  // =====================================================================

  CONS_PROF_2026: [],

  // =====================================================================
  // ESTRATTO CONTO PREVIDENZIALE
  // =====================================================================

  ESTCONT_PREV_2026: [],

  // =====================================================================
  // COMUNICAZIONE INPS
  // =====================================================================

  COMM_INPS_2026: [],

  // =====================================================================
  // PERMESSO/CARTA DI SOGGIORNO
  // =====================================================================

  RINN_PERM_LAV_2026: [],
  RINN_PERM_AUT_2026: [],
  RINN_PERM_FAM_2026: [],
  RINN_PERM_STU_2026: [],
  RINN_PERM_ASI_2026: [],
  AGG_PERM_2026: [],
  RILASC_CART_2026: [],

  // =====================================================================
  // CITTADINANZA ITALIANA
  // =====================================================================

  CITT_RES_2026: [],
  CITT_MAT_2026: [],

  // =====================================================================
  // RICONGIUNGIMENTO FAMILIARE
  // =====================================================================

  RICONG_FAM_2026: [],

  // =====================================================================
  // TEST LINGUA
  // =====================================================================

  TEST_LINGUA_2026: [SPID_SECTION],

  // =====================================================================
  // COLF E BADANTI
  // =====================================================================

  BUSTA_COLF_2026: [],
  MAV_COLF_2026: [],
  ASSU_COLF_2026: [],
  CU_COLF_2026: [],
  LET_ASSU_COLF_2026: [],
  CESS_COLF_2026: [],
  VAR_COLF_2026: [],

  // =====================================================================
  // MATERNITA
  // =====================================================================

  ASS_MATERN_2026: [],
  BON_NATI_2026: [],
  CONG_PAR_DIP_2026: [],
  MATERN_OBBL_2026: [],
  INDENNI_MATERN_2026: [],
  MATERN_ANT_2026: [],
  CONG_PAR_SEP_2026: [],
  CONG_PAR_AUT_2026: [],

  // =====================================================================
  // INVALIDITA
  // =====================================================================

  INVAL_CIV_2026: [],
  PERM_104_2026: [],

  // =====================================================================
  // PENSIONE
  // =====================================================================

  ESTRAT_PENS_2026: [],
  ASS_SOC_2026: [],
  PENS_INDIR_2026: [],
  RICOST_REDD_2026: [],

  // =====================================================================
  // DICHIARAZIONE REDDITI
  // =====================================================================

  MOD_REDD_PF_2026: [],
  MOD_REDD_PFIVA_2026: [],
  INT_MOD_REDD_2026: [],
  F24_CEDOL_2026: [],
  DICH_IMU_2026: [],

  // =====================================================================
  // PARTITA IVA
  // =====================================================================

  APERT_PIVA_2026: [],
  VAR_PIVA_2026: [],
  CESS_DITA_2026: [],
  COMM_CAM_2026: [],
  SCIA_ATTIV_2026: [],

  // =====================================================================
  // CONTRATTI DI LOCAZIONE
  // =====================================================================

  CONTR_LOC_2026: [],

  // =====================================================================
  // SOSTEGNO ALLE FAMIGLIE
  // =====================================================================

  ASS_UNICO_2026: [],
  ASS_INCL_2026: [],
  BON_ASILO_2026: [],
  BON_NATI_SOC_2026: [],
  AGG_ASS_UNIV_2026: [],
  PAD_ASS_INCL_2026: [],
  ASS_SOC_FAM_2026: [],

  // =====================================================================
  // CERTIFICATI
  // =====================================================================

  RESIDENZA_2026: [],
  STATO_FAM_2026: [],
  STATO_CIV_2026: [],
  CASEL_GIU_2026: [],
  CERT_CARICH_2026: [],
};

export function getServiceQuestionnaires(serviceCode: string) {
  return SERVICE_QUESTIONNAIRES[serviceCode] || [];
}
