import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { FORM_SCHEMAS, PERSONAL_INFORMATION_SECTION } from './form-schemas';

const DECLARATIONS_AUTHORIZATION_SECTION = {
  id: 'declarations_authorization',
  title: 'Dichiarazioni e Autorizzazioni',
  description: 'Declarations & Authorization - Required consents and digital signature',
  fields: [
    {
      name: 'declare_data_truthful',
      label: 'Dichiaro che i dati forniti sono veritieri',
      type: 'checkbox',
      required: true,
      order: 1,
    },
    {
      name: 'authorize_gdpr',
      label: 'Autorizzo il trattamento dei dati personali (GDPR)',
      type: 'checkbox',
      required: true,
      order: 2,
    },
    {
      name: 'delegate_caf_dsu',
      label: 'Delega CAF per invio DSU',
      type: 'checkbox',
      required: true,
      order: 3,
    },
    {
      name: 'recontact_other_services',
      label: 'Desidero essere ricontattato per altri servizi CAF / Patronato',
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

async function fixOldServices() {
  console.log('🔧 Fixing Old Services with Proper Form Structure...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const serviceRepo = AppDataSource.getRepository('Service');
    
    // Services that need fixing
    const oldServiceCodes = [
      '730_IMMOBILI',
      '730_STANDARD',
      'IMU_MULTIPLE',
      'IMU_SINGLE',
      'IMU_SUCCESSIONE',
      'ISEE_SOCIOSANITARIO',
      'ISEE_STANDARD',
      'ISEE_UNIVERSITA',
      'PF_UNICO'
    ];

    let fixedCount = 0;

    for (const code of oldServiceCodes) {
      const service = await serviceRepo.findOne({ where: { code } });
      
      if (!service) {
        console.log(`⏭️  Service ${code} not found, skipping...`);
        continue;
      }

      // Create proper form schema structure
      const formSchema = service.formSchema || {};
      
      if (!formSchema.sections || formSchema.sections.length === 0) {
        // No sections, create complete structure
        service.formSchema = {
          title: service.name,
          description: service.description || `Form for ${service.name}`,
          sections: [
            PERSONAL_INFORMATION_SECTION,
            {
              id: 'service_specific',
              title: 'Service Information',
              description: 'Service specific information',
              fields: [
                {
                  name: 'notes',
                  label: 'Additional Notes',
                  type: 'textarea',
                  required: false,
                  order: 1,
                },
              ],
            },
            DECLARATIONS_AUTHORIZATION_SECTION,
          ],
        };
      } else {
        // Has sections, but missing personal info or declarations
        const sections = formSchema.sections;
        const firstSection = sections[0];
        const lastSection = sections[sections.length - 1];

        // Add personal info if missing
        if (firstSection?.id !== 'personal_information') {
          sections.unshift(PERSONAL_INFORMATION_SECTION);
        }

        // Add declarations if missing
        if (lastSection?.id !== 'declarations_authorization') {
          sections.push(DECLARATIONS_AUTHORIZATION_SECTION);
        }

        service.formSchema = formSchema;
      }

      await serviceRepo.save(service);
      console.log(`✅ ${code} - Fixed`);
      fixedCount++;
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`📊 SUMMARY: Fixed ${fixedCount} services`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

fixOldServices();
