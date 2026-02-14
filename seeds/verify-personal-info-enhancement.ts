import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';

async function verifyPersonalInfoEnhancement() {
  console.log('\n🔍 Verifying Personal Information Enhancement...\n');

  try {
    await AppDataSource.initialize();
    const serviceRepository = AppDataSource.getRepository('Service');

    // Get all services
    const allServices = await serviceRepository.find();
    console.log(`📊 Total Services Found: ${allServices.length}\n`);

    let servicesWithNewFields = 0;
    let servicesWithoutNewFields = 0;
    const missingFieldServices: string[] = [];
    const sampleServices: any[] = [];

    // Check each service for the new fields
    for (const service of allServices) {
      const formSchema = service.formSchema as any;
      
      if (!formSchema || !formSchema.sections) {
        console.log(`⚠️  Service "${service.name}" has no form schema`);
        continue;
      }

      // Find personal information section
      const personalInfoSection = formSchema.sections.find(
        (s: any) => s.id === 'personal_information'
      );

      if (!personalInfoSection) {
        console.log(`⚠️  Service "${service.name}" has no personal information section`);
        servicesWithoutNewFields++;
        continue;
      }

      // Check for the new fields
      const fields = personalInfoSection.fields || [];
      const hasPermssoSoggiorno = fields.some((f: any) => f.name === 'permesso_soggiorno');
      const hasPermssoExpiry = fields.some((f: any) => f.name === 'permesso_expiry_date');
      const hasPermssoRicevuta = fields.some((f: any) => f.name === 'permesso_ricevuta');
      const hasStatoCivile = fields.some((f: any) => f.name === 'stato_civile');

      if (hasPermssoSoggiorno && hasPermssoExpiry && hasPermssoRicevuta && hasStatoCivile) {
        servicesWithNewFields++;
      } else {
        servicesWithoutNewFields++;
        missingFieldServices.push(service.name);
      }

      // Store sample service details (first 5)
      if (sampleServices.length < 5) {
        sampleServices.push({
          name: service.name,
          code: service.code,
          totalFields: fields.length,
          hasAllNewFields: hasPermssoSoggiorno && hasPermssoExpiry && hasPermssoRicevuta && hasStatoCivile,
          fieldNames: fields.map((f: any) => f.name),
        });
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 PERSONAL INFORMATION ENHANCEMENT VERIFICATION:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Services with new fields: ${servicesWithNewFields}`);
    console.log(`❌ Services without new fields: ${servicesWithoutNewFields}`);

    if (missingFieldServices.length > 0 && missingFieldServices.length <= 15) {
      console.log(`\n⚠️  Services missing new fields (${missingFieldServices.length}):`);
      missingFieldServices.forEach((name) => console.log(`   - ${name}`));
    }

    console.log('\n📋 Sample Services Details:');
    sampleServices.forEach((service) => {
      console.log(`\n📌 ${service.name} (${service.code})`);
      console.log(`   Total Fields: ${service.totalFields}`);
      console.log(`   Has All New Fields: ${service.hasAllNewFields ? '✅' : '❌'}`);
      console.log(`   Fields: ${service.fieldNames.join(', ')}`);
    });

    // Final summary
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    if (servicesWithNewFields === allServices.length) {
      console.log('🎉 SUCCESS! All services have personal information enhancements!');
      console.log('   ✅ Permesso di soggiorno');
      console.log('   ✅ Permesso expiry date');
      console.log('   ✅ Permesso ricevuta');
      console.log('   ✅ Stato civile (marital status)');
    } else {
      console.log(`⚠️  Only ${servicesWithNewFields} out of ${allServices.length} services have enhancements`);
    }
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error during verification:', error);
    await AppDataSource.destroy();
    process.exit(1);
  }
}

verifyPersonalInfoEnhancement();
