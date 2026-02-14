// Comprehensive questionnaire definitions from DATA.md
// Each service has specific questionnaires mapped to service codes
// Structure: personal_info (automatic) → service_questionnaires → declarations (automatic)

export const SERVICE_QUESTIONNAIRES = {
  // ===== BONUS SERVICES =====
  BON_NATI_2026: [
    {
      id: 'bonus_nati_info',
      title: 'Informazioni Bonus Nuovi Nati',
      description: 'Information for newborn bonus application',
      fields: [
        {
          name: 'child_name',
          label: 'Nome del bambino/a',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'birth_date',
          label: 'Data di nascita',
          type: 'date',
          required: true,
          order: 2,
        },
        {
          name: 'isee_value',
          label: 'Valore ISEE minorenni',
          type: 'number',
          required: true,
          order: 3,
          description: 'Max 40.000 euro',
        },
        {
          name: 'iban',
          label: 'IBAN per accredito',
          type: 'text',
          required: true,
          order: 4,
        },
      ],
    },
  ],

  BON_NATI_SOC_2026: [
    {
      id: 'bonus_nati_soc_info',
      title: 'Informazioni Bonus Nuovi Nati Social',
      fields: [
        {
          name: 'child_name',
          label: 'Nome del bambino/a',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'birth_date',
          label: 'Data di nascita',
          type: 'date',
          required: true,
          order: 2,
        },
        {
          name: 'iban',
          label: 'IBAN per accredito',
          type: 'text',
          required: true,
          order: 3,
        },
      ],
    },
  ],

  BON_ASILO_2026: [
    {
      id: 'bonus_asilo_info',
      title: 'Informazioni Bonus Asilo Nido',
      fields: [
        {
          name: 'child_name',
          label: 'Nome del bambino/a',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'asilo_name',
          label: 'Nome dell\'asilo nido',
          type: 'text',
          required: true,
          order: 2,
        },
        {
          name: 'isee_soci',
          label: 'Valore ISEE',
          type: 'number',
          required: true,
          order: 3,
        },
      ],
    },
  ],

  // ===== ASSEGNO UNICO =====
  AGG_ASS_UNIV_2026: [
    {
      id: 'update_info',
      title: 'Dati da aggiornare',
      description: 'Specify what information needs to be updated',
      fields: [
        {
          name: 'change_type',
          label: 'Tipo di modifica',
          type: 'checkbox',
          required: true,
          order: 1,
          options: ['Cambio IBAN', 'Cambio dati figlio', 'Cambio indirizzo', 'Altro'],
        },
        {
          name: 'documents',
          label: 'Documenti relativi alle modifiche',
          type: 'file',
          required: true,
          order: 2,
          description: 'Upload documents supporting the changes',
        },
      ],
    },
  ],

  ASS_UNICO_2026: [
    {
      id: 'assegno_unico_info',
      title: 'Informazioni Assegno Unico',
      fields: [
        {
          name: 'figli_a_carico',
          label: 'Numero figli a carico',
          type: 'number',
          required: true,
          order: 1,
        },
        {
          name: 'eta_figli',
          label: 'Età figli',
          type: 'text',
          required: true,
          order: 2,
        },
      ],
    },
  ],

  // ===== PAD SERVICES =====
  PAD_2026: [
    {
      id: 'pad_naspi_info',
      title: 'Patto di Attivazione Digitale NASPI/DIS-COLL',
      fields: [
        {
          name: 'cv_upload',
          label: 'Allega CV aggiornato',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'job_preferences',
          label: 'Preferenze di ricerca lavoro',
          type: 'textarea',
          required: true,
          order: 2,
        },
      ],
    },
  ],

  PAD_ASS_INCL_2026: [
    {
      id: 'pad_adi_info',
      title: 'Patto di Attivazione Digitale ADI',
      fields: [
        {
          name: 'employment_status',
          label: 'Stato lavorativo',
          type: 'select',
          options: ['Disoccupato', 'Inabile', 'Disponibile', 'Altro'],
          required: true,
          order: 1,
        },
        {
          name: 'job_search_plan',
          label: 'Piano di ricerca lavoro',
          type: 'textarea',
          required: true,
          order: 2,
          maxLength: 500,
        },
      ],
    },
  ],

  // ===== ASSEGNO SOCIALE =====
  ASS_SOC_2026: [
    {
      id: 'residenza_italy',
      title: 'Residenza in Italia',
      fields: [
        {
          name: 'years_residence',
          label: 'Anni di residenza in Italia',
          type: 'number',
          required: true,
          order: 1,
        },
        {
          name: 'continuous_residence',
          label: 'Residenza continua negli ultimi 10 anni',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
      ],
    },
  ],

  ASS_SOC_FAM_2026: [
    {
      id: 'family_composition',
      title: 'Composizione Familiare',
      fields: [
        {
          name: 'family_members_count',
          label: 'Numero componenti famiglia',
          type: 'number',
          required: true,
          order: 1,
        },
        {
          name: 'family_situation',
          label: 'Descrizione situazione familiare',
          type: 'textarea',
          required: true,
          order: 2,
          maxLength: 500,
        },
      ],
    },
  ],

  // ===== ISEE SERVICES =====
  ISEE_ORD_2026: [
    {
      id: 'household_info',
      title: 'Nucleo Familiare',
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
          label: 'Componenti del nucleo',
          type: 'dynamic_list',
          required: false,
          order: 2,
          dependsOn: { field: 'solo', value: 'No' },
          subFields: [
            { name: 'nome_cognome', label: 'Nome e Cognome', type: 'text', required: true },
            { name: 'codice_fiscale', label: 'Codice Fiscale', type: 'text', required: true },
            { name: 'data_nascita', label: 'Data di nascita', type: 'date', required: true },
            {
              name: 'rapporto_parentela',
              label: 'Rapporto di parentela',
              type: 'select',
              options: ['Coniuge', 'Figlio/a', 'Genitore', 'Altro'],
              required: true,
            },
          ],
        },
        {
          name: 'disabilita',
          label: 'Presenza di persone con disabilità?',
          type: 'select',
          options: ['Nessuna', 'Media', 'Grave', 'Non autosufficiente'],
          required: true,
          order: 3,
        },
        {
          name: 'certificato_disabilita',
          label: 'Certificato medico d\'INPS',
          type: 'file',
          required: false,
          order: 4,
          dependsOn: { field: 'disabilita', value: 'Nessuna', isNot: true },
        },
      ],
    },
    {
      id: 'patrimonio_mobiliare',
      title: 'Patrimonio Mobiliare',
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
          label: 'Estratti conto (giacenza media 2024)',
          type: 'file',
          required: true,
          order: 2,
          dependsOn: { field: 'ha_conti_correnti', value: 'Sì' },
        },
      ],
    },
    {
      id: 'patrimonio_immobiliare',
      title: 'Patrimonio Immobiliare',
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
              name: 'percentuale_proprieta',
              label: 'Percentuale di proprietà',
              type: 'number',
              required: true,
            },
            {
              name: 'ha_mutuo',
              label: 'Mutuo residuo al 31/12/2024?',
              type: 'radio',
              options: ['Sì', 'No'],
              required: true,
            },
            {
              name: 'mutuo_file',
              label: 'Documentazione mutuo',
              type: 'file',
              required: false,
            },
          ],
        },
      ],
    },
    {
      id: 'residenza_principale',
      title: 'Residenza Principale',
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
          label: 'Contratto d\'affitto registrato',
          type: 'file',
          required: true,
          order: 2,
          dependsOn: { field: 'tipo_residenza', value: 'Affitto' },
        },
      ],
    },
    {
      id: 'veicoli',
      title: 'Veicoli',
      fields: [
        {
          name: 'ha_auto',
          label: 'Possiedi auto?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'targa_auto',
          label: 'Targa auto',
          type: 'text',
          required: false,
          order: 2,
          dependsOn: { field: 'ha_auto', value: 'Sì' },
        },
        {
          name: 'ha_moto',
          label: 'Possiedi moto?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 3,
        },
        {
          name: 'targa_moto',
          label: 'Targa moto',
          type: 'text',
          required: false,
          order: 4,
          dependsOn: { field: 'ha_moto', value: 'Sì' },
        },
        {
          name: 'ha_barche',
          label: 'Possiedi barche?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 5,
        },
        {
          name: 'targa_barche',
          label: 'Targa / Numero barca',
          type: 'text',
          required: false,
          order: 6,
          dependsOn: { field: 'ha_barche', value: 'Sì' },
        },
      ],
    },
    {
      id: 'situazioni_particolari',
      title: 'Situazioni Particolari',
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
          label: 'Coniuge residente all\'estero',
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
    },
  ],

  ISEE_UNI_2026: [
    {
      id: 'household_info',
      title: 'Nucleo Familiare',
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
          label: 'Componenti del nucleo',
          type: 'dynamic_list',
          required: false,
          dependsOn: { field: 'solo', value: 'No' },
          order: 2,
          subFields: [
            { name: 'nome_cognome', label: 'Nome e Cognome', type: 'text', required: true },
            { name: 'codice_fiscale', label: 'Codice Fiscale', type: 'text', required: true },
            { name: 'data_nascita', label: 'Data di nascita', type: 'date', required: true },
            {
              name: 'rapporto_parentela',
              label: 'Rapporto di parentela',
              type: 'select',
              options: ['Coniuge', 'Figlio/a', 'Genitore', 'Altro'],
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'student_info',
      title: 'Informazioni Università',
      fields: [
        {
          name: 'codice_fiscale_studente',
          label: 'Codice Fiscale dello studente',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'nome_universita',
          label: 'Nome dell\'Università',
          type: 'text',
          required: true,
          order: 2,
        },
        {
          name: 'genitore_non_convivente_cf',
          label: 'Codice Fiscale genitore non coniugato e non convivente (se applicabile)',
          type: 'text',
          required: false,
          order: 3,
        },
      ],
    },
    {
      id: 'patrimonio_mobiliare',
      title: 'Patrimonio Mobiliare',
      fields: [
        {
          name: 'ha_conti',
          label: 'Hai conti correnti?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'giacenza_file',
          label: 'Giacenza media 2024',
          type: 'file',
          required: false,
          order: 2,
          dependsOn: { field: 'ha_conti', value: 'Sì' },
        },
      ],
    },
    {
      id: 'patrimonio_immobiliare',
      title: 'Patrimonio Immobiliare',
      fields: [
        {
          name: 'ha_immobili',
          label: 'Possiedi immobili?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'immobili_file',
          label: 'Documentazione immobili',
          type: 'file',
          required: false,
          order: 2,
          dependsOn: { field: 'ha_immobili', value: 'Sì' },
        },
      ],
    },
  ],

  ISEE_SOC_2026: [
    {
      id: 'household_info',
      title: 'Nucleo Familiare',
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
          label: 'Componenti del nucleo',
          type: 'dynamic_list',
          required: false,
          dependsOn: { field: 'solo', value: 'No' },
          order: 2,
          subFields: [
            { name: 'nome_cognome', label: 'Nome e Cognome', type: 'text', required: true },
            { name: 'codice_fiscale', label: 'Codice Fiscale', type: 'text', required: true },
            { name: 'data_nascita', label: 'Data di nascita', type: 'date', required: true },
            {
              name: 'rapporto_parentela',
              label: 'Rapporto di parentela',
              type: 'select',
              options: ['Coniuge', 'Figlio/a', 'Genitore', 'Altro'],
              required: true,
            },
          ],
        },
      ],
    },
    {
      id: 'patrimonio_mobiliare',
      title: 'Patrimonio Mobiliare',
      fields: [
        {
          name: 'ha_conti',
          label: 'Hai conti correnti?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'giacenza_file',
          label: 'Giacenza media 2024',
          type: 'file',
          required: false,
          order: 2,
          dependsOn: { field: 'ha_conti', value: 'Sì' },
        },
      ],
    },
    {
      id: 'patrimonio_immobiliare',
      title: 'Patrimonio Immobiliare',
      fields: [
        {
          name: 'ha_immobili',
          label: 'Possiedi immobili?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'immobili_file',
          label: 'Documentazione immobili',
          type: 'file',
          required: false,
          order: 2,
          dependsOn: { field: 'ha_immobili', value: 'Sì' },
        },
      ],
    },
  ],

  ISEE_MIN_2026: [
    {
      id: 'child_info',
      title: 'Informazioni Minore',
      fields: [
        {
          name: 'child_name',
          label: 'Nome del minore',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'child_birth_date',
          label: 'Data di nascita',
          type: 'date',
          required: true,
          order: 2,
        },
      ],
    },
    {
      id: 'parents_info',
      title: 'Informazioni Genitori',
      fields: [
        {
          name: 'parent_not_cohabiting',
          label: 'Genitori non coniugati e non conviventi',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
      ],
    },
  ],

  ISEE_COR_2026: [
    {
      id: 'change_of_circumstances',
      title: 'Variazione della Situazione',
      fields: [
        {
          name: 'perdita_lavoro',
          label: 'Perdita o sospensione del lavoro?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: false,
          order: 1,
        },
        {
          name: 'riduzione_reddito',
          label: 'Riduzione dell\'attività lavorativa o del reddito?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: false,
          order: 2,
        },
        {
          name: 'diminuzione_patrimonio',
          label: 'Diminuzione di oltre il 20% del patrimonio?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: false,
          order: 3,
        },
        {
          name: 'documenti_variazione',
          label: 'Documenti che certificano la variazione',
          type: 'file',
          required: true,
          order: 4,
        },
      ],
    },
  ],

  // ===== UNEMPLOYMENT SERVICES =====
  NASP_2026: [
    {
      id: 'employment_info',
      title: 'Informazioni Occupazione',
      fields: [
        {
          name: 'unilav_file',
          label: 'UNILAV / Busta Paga / Contratto',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'data_ultimo_giorno',
          label: 'Data ultimo giorno di lavoro',
          type: 'date',
          required: true,
          order: 2,
        },
      ],
    },
  ],

  DAGRN_2026: [
    {
      id: 'agricultural_employment',
      title: 'Occupazione Agricola',
      fields: [
        {
          name: 'tipo_coltivazione',
          label: 'Tipo di coltivazione',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'giorni_lavoro',
          label: 'Giorni di lavoro nel periodo',
          type: 'number',
          required: true,
          order: 2,
        },
      ],
    },
  ],

  ANTNAS_2026: [
    {
      id: 'anticipation_info',
      title: 'Richiesta Anticipo NASPI',
      fields: [
        {
          name: 'naspi_application_date',
          label: 'Data della domanda NASPI',
          type: 'date',
          required: true,
          order: 1,
        },
        {
          name: 'naspi_reference',
          label: 'Numero di riferimento NASPI',
          type: 'text',
          required: true,
          order: 2,
        },
      ],
    },
  ],

  DID_2026: [
    {
      id: 'job_search_plan',
      title: 'Piano di Ricerca Lavoro',
      fields: [
        {
          name: 'job_search_strategy',
          label: 'Descrivi la tua strategia di ricerca lavoro',
          type: 'textarea',
          required: true,
          order: 1,
          maxLength: 500,
        },
        {
          name: 'disponibilita_immediata',
          label: 'Disponibilità immediata al lavoro',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
      ],
    },
  ],

  NASPICOM_2026: [
    {
      id: 'variation_info',
      title: 'Comunicazione Variazione',
      fields: [
        {
          name: 'tipo_variazione',
          label: 'Tipo di variazione',
          type: 'select',
          options: [
            'Nuovo lavoro',
            'Cambio situazione reddito',
            'Cambio indirizzo',
            'Altro',
          ],
          required: true,
          order: 1,
        },
        {
          name: 'documentazione_variazione',
          label: 'Documentazione che certifica la variazione',
          type: 'file',
          required: true,
          order: 2,
        },
      ],
    },
  ],

  // ===== TAX SERVICES =====
  '730_2026': [
    {
      id: 'tipo_dichiarazione',
      title: 'Tipo di Dichiarazione',
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
          label: 'Hai già presentato il 730 l\'anno scorso?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 2,
        },
        {
          name: '730_anno_scorso',
          label: 'Copia 730 anno scorso',
          type: 'file',
          required: false,
          order: 3,
          dependsOn: { field: 'presentato_anno_scorso', value: 'Sì' },
        },
      ],
    },
    {
      id: 'sostituto_imposta',
      title: 'Sostituto d\'Imposta',
      fields: [
        {
          name: 'ha_sostituto',
          label: 'Hai un sostituto d\'imposta?',
          type: 'radio',
          options: ['Sì', 'No'],
          required: true,
          order: 1,
        },
        {
          name: 'denominazione_datore',
          label: 'Denominazione datore di lavoro / ente pensionistico',
          type: 'text',
          required: false,
          order: 2,
          dependsOn: { field: 'ha_sostituto', value: 'Sì' },
        },
        {
          name: 'codice_fiscale_sostituto',
          label: 'Codice fiscale sostituto',
          type: 'text',
          required: false,
          order: 3,
          dependsOn: { field: 'ha_sostituto', value: 'Sì' },
        },
      ],
    },
    {
      id: 'redditi_lavoro',
      title: 'Redditi di Lavoro / Pensione',
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
          label: 'Allega tutte le CU',
          type: 'file',
          required: true,
          order: 2,
          description: 'Upload all CU files according to number selected',
        },
      ],
    },
  ],

  '730INT_2026': [
    {
      id: 'integrazione_info',
      title: 'Documenti per Integrazione 730',
      fields: [
        {
          name: 'documenti_integrazione',
          label: 'Documenti relativi alle integrazioni/correzioni',
          type: 'file',
          required: true,
          order: 1,
        },
      ],
    },
  ],

  // ===== RESIGNATION SERVICES =====
  DISM_VOL_2026: [
    {
      id: 'employer_info',
      title: 'Datore di Lavoro',
      fields: [
        {
          name: 'unilav_documento',
          label: 'UNILAV / Busta Paga / Contratto di lavoro',
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
      id: 'resignation_info',
      title: 'Data Dimissioni',
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

  DISM_GIUSTA_2026: [
    {
      id: 'justification_info',
      title: 'Motivo Dimissioni per Giusta Causa',
      fields: [
        {
          name: 'motivo_dimissioni',
          label: 'Motivo della dimissione',
          type: 'textarea',
          required: true,
          order: 1,
          maxLength: 500,
          description: 'Descrivi il motivo della giusta causa',
        },
        {
          name: 'documenti_giustificativi',
          label: 'Documenti giustificativi',
          type: 'file',
          required: true,
          order: 2,
        },
      ],
    },
  ],

  DISM_REVOCA_2026: [
    {
      id: 'revocation_info',
      title: 'Revoca Dimissioni',
      fields: [
        {
          name: 'ricevuta_dimissioni',
          label: 'Ricevuta dimissioni già effettuate',
          type: 'file',
          required: true,
          order: 1,
        },
        {
          name: 'data_revoca',
          label: 'Data della revoca (entro 7 giorni)',
          type: 'date',
          required: true,
          order: 2,
        },
      ],
    },
  ],

  // ===== OTHER SERVICES =====
  RATE_GEN_2026: [
    {
      id: 'spid_login',
      title: 'Accesso SPID',
      fields: [
        {
          name: 'username_spid',
          label: 'Nome Utente SPID',
          type: 'text',
          required: true,
          order: 1,
        },
        {
          name: 'cartelle_to_installment',
          label: 'Cartelle da rateizzare',
          type: 'file',
          required: true,
          order: 2,
          description: 'Allega le cartelle che desideri rateizzare',
        },
      ],
    },
  ],

  TEST_LINGUA_2026: [
    {
      id: 'lingua_test_info',
      title: 'Informazioni Test Lingua',
      fields: [
        {
          name: 'livello_desiderato',
          label: 'Livello di certificazione desiderato',
          type: 'select',
          options: ['A1', 'A2', 'B1', 'B2'],
          required: true,
          order: 1,
        },
        {
          name: 'data_test',
          label: 'Data desiderata per il test',
          type: 'date',
          required: true,
          order: 2,
        },
      ],
    },
  ],
};

export function getServiceQuestionnaires(serviceCode: string) {
  return SERVICE_QUESTIONNAIRES[serviceCode] || [];
}
