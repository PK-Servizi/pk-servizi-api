import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';
import { ServiceType } from '../src/modules/service-types/entities/service-type.entity';
import { Faq } from '../src/modules/faqs/entities/faq.entity';
import {
  PERSONAL_INFORMATION_SECTION,
  DECLARATIONS_AUTHORIZATION_SECTION,
} from './form-schemas';

const buildGenericFormSchema = (serviceName: string, description?: string) => ({
  title: serviceName,
  description: description || `Form for ${serviceName}`,
  sections: [
    PERSONAL_INFORMATION_SECTION,
    {
      id: 'service_information',
      title: 'Informazioni Servizio',
      description: 'Service specific information',
      fields: [
        {
          name: 'notes',
          label: 'Note',
          type: 'textarea',
          required: false,
          order: 1,
        },
      ],
    },
    DECLARATIONS_AUTHORIZATION_SECTION,
  ],
});

const SERVICES_DATA = {
  'ISEE': [
    {
      name: 'ISEE Ordinario 2026',
      code: 'ISEE_ORDINARIO_2026',
      description: "L'ISEE Ordinario 2026 è un indicatore utilizzato per valutare la situazione economica di una famiglia. È fondamentale per determinare l'accesso a diverse prestazioni e agevolazioni sociali, come l'Assegno Unico e Universale, agevolazioni per l'istruzione, contributi per la casa, e altre forme di sostegno economico",
      category: 'TAX',
      basePrice: 0.00,
      requiredDocuments: [
        'Documento di riconoscimento (Carta d\'identità fronte e retro, Patente fronte e retro, Passaporto)',
        'Codice Fiscale',
        'Codici Fiscali familiari',
        'Contratto d\'affitto',
        'Mutuo: capitale residuo al 31/12/2024',
        'Conti correnti: saldo contabile e giacenza media al 31/12/2024',
        'Libretti risparmio/postali: saldo contabile e giacenza media al 31/12/2024',
        'Investimenti: valore in euro al 31/12/2024',
        'Carte prepagate: saldo contabile e giacenza media',
        'Conti deposito: saldo contabile e giacenza media',
        'Veicoli: targhe auto',
        'Certificazione disabilità (se applicabile)'
      ],
      faqs: [
        { question: 'Entro quanto viene elaborata la mia richiesta?', answer: 'Il nostro team elabora la DSU nello stesso giorno in cui viene effettuata la richiesta (dal lunedì al sabato, dalle 09:00 alle 20:00). La consegna dell\'attestazione avviene entro 4 giorni lavorativi.', order: 1 },
        { question: 'Quando scade l\'attestazione ISEE?', answer: 'L\'attestazione ISEE ha validità fino al 31 dicembre di ogni anno. Ad esempio, l\'attestazione ISEE effettuata nell\'anno 2025 scadrà il 31 dicembre 2025.', order: 2 },
        { question: 'È necessario il CUD?', answer: 'No, non è necessario. I dati reddituali vengono automaticamente acquisiti da controlli incrociati tra INPS e Agenzia delle Entrate.', order: 3 },
        { question: 'È necessaria la visura catastale?', answer: 'No! I dati catastali relativi al vostro patrimonio immobiliare possiamo acquisirlo tramite i nostri sistemi.', order: 4 }
      ]
    },
    {
      name: 'ISEE Universitario 2026',
      code: 'ISEE_UNIV_2026',
      description: 'The ISEE University also known as ISEEU is an indicator determined by a specific type of DSU required of the student by Universities and institutions for the right to study in order to access benefits such as scholarships, accommodation and canteen services',
      category: 'TAX',
      basePrice: 0.00,
      requiredDocuments: [
        'Documento di riconoscimento valido del dichiarante',
        'Tessera sanitaria per tutti i membri della famiglia',
        'Certificazione disabilità (se applicabile)',
        'Documento di circolazione/immatricolazione veicoli',
        'Contratto di locazione registrato (se in affitto)',
        'Documentazione assegni coniugali e mantenimento figli',
        'Estratto conto mutuo',
        'Saldo contabile e giacenza media conti correnti e carte prepagate con IBAN',
        'Saldo contabile e giacenza media conti deposito',
        'Valore nominale titoli di stato, obbligazioni, certificati di deposito',
        'Codice Fiscale Studente Universitario',
        'Nome dell\'Università',
        'Codice Fiscale del Genitore non coniugato e non convivente (se applicabile)'
      ],
      faqs: [
        { question: 'Chi deve dichiarare l\'ISEE universitario?', answer: 'Potrebbe essere chiunque nel nucleo familiare, non necessariamente il capofamiglia né necessariamente la persona richiedente il servizio che poi presenterà effettivamente l\'ISEE.', order: 1 },
        { question: 'Quali sono le condizioni per essere considerato studente indipendente?', answer: 'Uno studente è considerato di fatto "indipendente" quando: ha risieduto fuori dall\'abitazione familiare per almeno due anni prima della presentazione della domanda di iscrizione per la prima volta in ciascun corso di studi, in alloggio non di proprietà di un membro della famiglia.', order: 2 }
      ]
    },
    {
      name: 'ISEE Socio Sanitario 2026',
      code: 'ISEE_SOCIO_2026',
      description: 'The ISEE Socio Sanitario is the indicator of the economic situation necessary to obtain home care services or to access residential or semi-residential facilities',
      category: 'TAX',
      basePrice: 0.00,
      requiredDocuments: [
        'Documento di riconoscimento valido del dichiarante',
        'Tessera sanitaria per tutti i membri della famiglia',
        'Certificazione disabilità (se applicabile)',
        'Documento di circolazione/immatricolazione veicoli',
        'Contratto di locazione registrato (se in affitto)',
        'Documentazione assegni coniugali e mantenimento figli',
        'Estratto conto mutuo',
        'Saldo contabile e giacenza media conti correnti e carte prepagate con IBAN',
        'Saldo contabile e giacenza media conti deposito',
        'Valore nominale titoli di stato'
      ]
    },
    {
      name: 'ISEE Minorenni 2026',
      code: 'ISEE_MINOR_2026',
      description: 'The ISEE Minorenni (Indicator of Economic Situation for Minors) is a tool designed for children of unmarried and uncohabiting parents',
      category: 'TAX',
      basePrice: 0.00,
      requiredDocuments: [
        'Documento di riconoscimento valido del dichiarante',
        'Tessera sanitaria per tutti i membri della famiglia',
        'Certificazione disabilità (se applicabile)',
        'Documento di circolazione/immatricolazione veicoli',
        'Contratto di locazione registrato (se in affitto)',
        'Documentazione assegni coniugali e mantenimento figli',
        'Estratto conto mutuo',
        'Saldo contabile e giacenza media conti correnti e carte prepagate con IBAN',
        'Saldo contabile e giacenza media conti deposito',
        'Valore nominale titoli di stato',
        'Documento di riconoscimento valido del genitore non coniugato e non convivente'
      ]
    },
    {
      name: 'ISEE Corrente',
      code: 'ISEE_CORRENTE',
      description: 'The Current ISEE is a fundamental tool for accessing bonuses, benefits, social benefits, and subsidies that require an updated ISEE',
      category: 'TAX',
      basePrice: 0.00,
      requiredDocuments: [
        'Documentazione certificante la variazione della situazione lavorativa/reddituale',
        'Lettera di licenziamento, copia dimissioni, contratto a tempo determinato non rinnovato',
        'Documentazione relativa a Cassa Integrazione Guadagni (CIG)',
        'Buste paga recenti che dimostrano la riduzione',
        'Dichiarazioni dei redditi o documentazione contabile',
        'Estratti conto bancari e postali aggiornati al 31 dicembre'
      ]
    }
  ],
  'Disoccupazione': [
    {
      name: 'Disoccupazione NASPI',
      code: 'NASPI',
      description: 'La NASpI (Nuova Assicurazione Sociale per l\'Impiego) è un sostegno economico fondamentale per i lavoratori che hanno perso involontariamente il proprio impiego',
      category: 'EMPLOYMENT',
      basePrice: 0.00,
      requiredDocuments: [
        'Documento di riconoscimento (Carta D\'identità Italiana - Carta D\'identità di un paese Comunitario - Patente - Passaporto)',
        'Codice Fiscale o Tessera Sanitaria',
        'Permesso di soggiorno del richiedente (se extracomunitario)',
        'Ultima Busta Paga in possesso',
        'Lettera di licenziamento - Contratto scaduto'
      ]
    },
    {
      name: 'Disoccupazione Agricola',
      code: 'DISOC_AGRICOLA',
      description: 'L\'indennità di disoccupazione agricola è una prestazione economica a cui hanno diritto i lavoratori agricoli dipendenti',
      category: 'EMPLOYMENT',
      basePrice: 0.00,
      requiredDocuments: [
        'Carta d\'identità richiedente',
        'Codice fiscale/Tessera Sanitaria del richiedente',
        'Iban richiedente'
      ]
    }
  ],
  'Sostegno alle Famiglie': [
    {
      name: 'Assegno Unico',
      code: 'ASSEGNO_UNICO',
      description: 'L\'Assegno Unico e Universale è un sostegno economico alle famiglie attribuito per ogni figlio a carico fino al compimento dei 21 anni',
      category: 'FAMILY',
      basePrice: 0.00,
      requiredDocuments: [
        'Carta d\'identità richiedente',
        'Codice Fiscale richiedente',
        'Codice fiscale Figli',
        'Codice fiscale altro genitore',
        'Eventuale certificato di invalidità',
        'Attestazione ISEE in corso di validità',
        'Coordinate bancarie IBAN'
      ]
    },
    {
      name: 'Assegno di inclusione',
      code: 'ADI',
      description: 'L\'Assegno di inclusione è una misura di sostegno economico e di inclusione sociale e professionale',
      category: 'FAMILY',
      basePrice: 0.00,
      requiredDocuments: [
        'Carta d\'identità richiedente',
        'Codice Fiscale richiedente',
        'Attestazione ISEE con valore inferiore o uguale a 9.360€'
      ]
    },
    {
      name: 'Bonus Asilo Nido',
      code: 'BONUS_ASILO_NIDO',
      description: 'Il Bonus Asilo Nido è una misura di sostegno economico rivolta alle famiglie con figli fino ai 3 anni di età',
      category: 'FAMILY',
      basePrice: 0.00,
      requiredDocuments: [
        'Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
        'Codice fiscale richiedente',
        'Eventuale permesso di soggiorno',
        'Codice fiscale figlio per il quale chiedi il bonus',
        'Ricevute di pagamento delle rette dell\'asilo',
        'Certificato d\'iscrizione all\'asilo'
      ]
    },
    {
      name: 'Bonus Nuovi Nati',
      code: 'BONUS_NUOVI_NATI',
      description: 'Il Bonus Nuovi Nati è un contributo economico erogato dallo Stato per sostenere le famiglie in occasione della nascita o dell\'adozione di un bambino',
      category: 'FAMILY',
      basePrice: 0.00,
      requiredDocuments: [
        'Documento d\'identità valido del genitore richiedente',
        'Codice fiscale del genitore richiedente e del bambino',
        'Attestazione ISEE minorenni in corso di validità (valore non superiore a 40.000 euro)',
        'Permesso di soggiorno valido (per cittadini extra UE)',
        'IBAN del genitore richiedente'
      ]
    }
  ]
};

export async function seedServicesWithDocuments() {
  try {
    console.log('🚀 Starting Services with Documents Seeding...');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceTypeRepo = AppDataSource.getRepository(ServiceType);
    const serviceRepo = AppDataSource.getRepository(Service);
    const faqRepo = AppDataSource.getRepository(Faq);

    for (const [typeName, services] of Object.entries(SERVICES_DATA)) {
      console.log(`\n📁 Processing Service Type: ${typeName}`);
      
      let serviceType = await serviceTypeRepo.findOne({
        where: { name: typeName },
      });

      if (!serviceType) {
        serviceType = serviceTypeRepo.create({
          name: typeName,
          description: `Servizi ${typeName}`,
        });
        await serviceTypeRepo.save(serviceType);
        console.log(`   ✅ Created service type: ${typeName}`);
      }

      for (const serviceData of services) {
        console.log(`   📋 Processing Service: ${serviceData.name}`);
        
        let service = await serviceRepo.findOne({
          where: { code: serviceData.code },
        });

        if (!service) {
          const formSchema = buildGenericFormSchema(
            serviceData.name,
            serviceData.description,
          );

          service = serviceRepo.create({
            name: serviceData.name,
            code: serviceData.code,
            description: serviceData.description,
            category: serviceData.category,
            basePrice: serviceData.basePrice,
            requiredDocuments: serviceData.requiredDocuments as any,
            serviceTypeId: serviceType.id,
            formSchema: formSchema as any,
          });
          await serviceRepo.save(service);
          console.log(`      ✅ Created service: ${serviceData.name}`);
        } else {
          if (!service.formSchema || !service.formSchema.sections?.length) {
            service.formSchema = buildGenericFormSchema(
              serviceData.name,
              serviceData.description,
            ) as any;
          }
          service.requiredDocuments = serviceData.requiredDocuments as any;
          await serviceRepo.save(service);
          console.log(`      ✅ Updated documents for: ${serviceData.name}`);
        }

        if ('faqs' in serviceData && serviceData.faqs) {
          for (const faqData of serviceData.faqs) {
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
              });
              await faqRepo.save(faq);
              console.log(`         ✅ Created FAQ`);
            }
          }
        }
      }
    }

    console.log('\n✅ Services with Documents Seeding completed!');
  } catch (error) {
    console.error('❌ Error seeding:', error);
    throw error;
  }
}

if (require.main === module) {
  seedServicesWithDocuments()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
