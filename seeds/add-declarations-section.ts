import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';

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
      label: 'Nome Completo (firma digitale)',
      type: 'signature',
      required: true,
      order: 5,
      description: 'Please provide your digital signature',
    },

  ],
};

async function addDeclarationsToAllServices() {
  console.log('\n📋 Adding Declarations & Authorization Section to ALL Services...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const serviceRepo = AppDataSource.getRepository(Service);

    // Get all services
    const allServices = await serviceRepo.find();
    console.log(`📊 Found ${allServices.length} services\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const service of allServices) {
      // Check if service has form schema
      if (!service.formSchema || Object.keys(service.formSchema).length === 0) {
        console.log(`⏭️  ${service.code} - No form schema, skipping`);
        skippedCount++;
        continue;
      }

      const formSchema = service.formSchema as any;

      // Check if already has declarations section
      const hasDeclarations = formSchema.sections?.some(
        (s: any) => s.id === 'declarations_authorization'
      );

      if (hasDeclarations) {
        console.log(`⏭️  ${service.code} - Already has declarations section`);
        skippedCount++;
        continue;
      }

      // Add declarations section as LAST section
      if (formSchema.sections && Array.isArray(formSchema.sections)) {
        formSchema.sections.push(DECLARATIONS_AUTHORIZATION_SECTION);
        
        // Update service
        service.formSchema = formSchema;
        await serviceRepo.save(service);

        console.log(`✅ ${service.code} - Declarations section added`);
        updatedCount++;
      } else {
        console.log(`⚠️  ${service.code} - Invalid form schema structure`);
        skippedCount++;
      }
    }

    console.log('\n' + '━'.repeat(80));
    console.log('\n📈 SUMMARY:\n');
    console.log(`   ✅ Services Updated: ${updatedCount}`);
    console.log(`   ⏭️  Services Skipped: ${skippedCount}`);
    console.log(`   📊 Total Services: ${allServices.length}`);
    console.log('\n✅ Declarations & Authorization section added to all services!\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('\n❌ Error adding declarations:', error);
    process.exit(1);
  }
}

addDeclarationsToAllServices();
