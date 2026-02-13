import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';

async function verifyAllFormSchemasComprehensive() {
  console.log('\n🔍 Comprehensive Form Schema Verification - ALL SERVICES...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const serviceRepo = AppDataSource.getRepository(Service);

    // Get all services
    const allServices = await serviceRepo.find({
      order: { code: 'ASC' },
    });

    console.log(`📊 Checking ${allServices.length} Services...\n`);
    console.log('━'.repeat(120));

    let servicesWithSchemas = 0;
    let servicesWithoutSchemas = 0;

    for (const service of allServices) {
      if (service.formSchema && Object.keys(service.formSchema).length > 0) {
        const schemaData = service.formSchema as any;
        const sectionCount = schemaData.sections?.length || 0;
        
        // Check if personal information is included
        const hasPersonalInfo = schemaData.sections?.some((s: any) => s.id === 'personal_information');
        
        console.log(`\n✅ ${service.code.padEnd(25)} | ${schemaData.title?.substring(0, 40).padEnd(40)}`);
        console.log(`   Sections: ${sectionCount} | ${hasPersonalInfo ? '✓' : 'X'} Personal Info`);
        servicesWithSchemas++;
      } else {
        console.log(`\n❌ ${service.code.padEnd(25)} | ${service.name?.substring(0, 40).padEnd(40)}`);
        console.log(`   Status: NO FORM SCHEMA`);
        servicesWithoutSchemas++;
      }
    }

    console.log('\n' + '━'.repeat(120));
    console.log('\n📈 COMPREHENSIVE SUMMARY:\n');
    console.log(`   ✅ Services WITH Form Schemas: ${servicesWithSchemas}/${allServices.length}`);
    console.log(`   ❌ Services WITHOUT Form Schemas: ${servicesWithoutSchemas}/${allServices.length}`);
    console.log(`   📊 Success Rate: ${Math.round((servicesWithSchemas / allServices.length) * 100)}%`);
    
    if (servicesWithSchemas === allServices.length) {
      console.log('\n   🎉 SUCCESS! ALL SERVICES HAVE FORM SCHEMAS!');
    }

    console.log('\n' + '━'.repeat(120));
    console.log('\n✅ Verification completed!\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('\n❌ Error during verification:', error);
    process.exit(1);
  }
}

verifyAllFormSchemasComprehensive();
