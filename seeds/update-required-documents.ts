import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';

const DOCUMENTS_MAP = {
  'ISEE_ORD_2026': [
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
  'ISEE_UNIV_2026': [
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
  'ISEE_SOCIO_2026': [
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
  ],
  'ISEE_MINOR_2026': [
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
  ],
  'ISEE_CORRENTE': [
    'Documentazione certificante la variazione della situazione lavorativa/reddituale',
    'Lettera di licenziamento, copia dimissioni, contratto a tempo determinato non rinnovato',
    'Documentazione relativa a Cassa Integrazione Guadagni (CIG)',
    'Buste paga recenti che dimostrano la riduzione',
    'Dichiarazioni dei redditi o documentazione contabile',
    'Estratti conto bancari e postali aggiornati al 31 dicembre'
  ],
  'NASPI': [
    'Documento di riconoscimento (Carta D\'identità Italiana - Carta D\'identità di un paese Comunitario - Patente - Passaporto)',
    'Codice Fiscale o Tessera Sanitaria',
    'Permesso di soggiorno del richiedente (se extracomunitario)',
    'Ultima Busta Paga in possesso',
    'Lettera di licenziamento - Contratto scaduto'
  ],
  'DISOC_AGRICOLA': [
    'Carta d\'identità richiedente',
    'Codice fiscale/Tessera Sanitaria del richiedente',
    'Iban richiedente'
  ],
  'ASSEGNO_UNICO': [
    'Carta d\'identità richiedente',
    'Codice Fiscale richiedente',
    'Codice fiscale Figli',
    'Codice fiscale altro genitore',
    'Eventuale certificato di invalidità',
    'Attestazione ISEE in corso di validità',
    'Coordinate bancarie IBAN'
  ],
  'ADI': [
    'Carta d\'identità richiedente',
    'Codice Fiscale richiedente',
    'Attestazione ISEE con valore inferiore o uguale a 9.360€'
  ],
  'BONUS_ASILO_NIDO': [
    'Documento di riconoscimento (Carta d\'identità fronte e retro - Patente fronte e retro - Passaporto)',
    'Codice fiscale richiedente',
    'Eventuale permesso di soggiorno',
    'Codice fiscale figlio per il quale chiedi il bonus',
    'Ricevute di pagamento delle rette dell\'asilo',
    'Certificato d\'iscrizione all\'asilo'
  ],
  'BONUS_NUOVI_NATI': [
    'Documento d\'identità valido del genitore richiedente',
    'Codice fiscale del genitore richiedente e del bambino',
    'Attestazione ISEE minorenni in corso di validità (valore non superiore a 40.000 euro)',
    'Permesso di soggiorno valido (per cittadini extra UE)',
    'IBAN del genitore richiedente'
  ]
};

export async function updateRequiredDocuments() {
  try {
    console.log('🚀 Updating Required Documents...');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceRepo = AppDataSource.getRepository(Service);

    for (const [code, documents] of Object.entries(DOCUMENTS_MAP)) {
      const service = await serviceRepo.findOne({ where: { code } });
      
      if (service) {
        service.requiredDocuments = documents as any;
        await serviceRepo.save(service);
        console.log(`✅ Updated ${code}: ${documents.length} documents`);
      } else {
        console.log(`⚠️  Service not found: ${code}`);
      }
    }

    console.log('\n✅ All required documents updated!');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  }
}

// Only run directly if this file is executed directly
if (require.main === module) {
  updateRequiredDocuments()
    .then(() => {
      AppDataSource.destroy();
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
