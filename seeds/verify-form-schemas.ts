import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';

async function verifyFormSchemas() {
  console.log('\n🔍 Verifying Form Schemas in Database...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const serviceRepo = AppDataSource.getRepository(Service);

    // Expected service codes
    const expectedServices = [
      'ISEE_ORD_2026',
      'ISEE_UNI_2026',
      'ISEE_SOC_2026',
      'ISEE_MIN_2026',
      'ISEE_COR_2026',
      'NASP_2026',
      'DAGRN_2026',
      'ANTNAS_2026',
      'DID_2026',
    ];

    console.log('📊 Checking Services with Form Schemas...\n');
    console.log('━'.repeat(100));

    let servicesWithSchemas = 0;
    let servicesWithoutSchemas = 0;

    for (const serviceCode of expectedServices) {
      const service = await serviceRepo.findOne({
        where: { code: serviceCode },
      });

      if (service) {
        if (service.formSchema && Object.keys(service.formSchema).length > 0) {
          const schemaData = service.formSchema as any;
          const sectionCount = schemaData.sections?.length || 0;
          
          console.log(`\n✅ ${serviceCode}`);
          console.log(`   Title: ${schemaData.title}`);
          console.log(`   Sections: ${sectionCount}`);
          console.log(`   Description: ${schemaData.description?.substring(0, 50)}...`);
          
          // Show section names
          if (schemaData.sections && Array.isArray(schemaData.sections)) {
            console.log(`   Section Names:`);
            schemaData.sections.forEach((section: any, idx: number) => {
              console.log(`      ${idx + 1}. ${section.title}`);
            });
          }
          
          servicesWithSchemas++;
        } else {
          console.log(`\n⚠️  ${serviceCode}`);
          console.log(`   Status: Service found but NO form schema`);
          servicesWithoutSchemas++;
        }
      } else {
        console.log(`\n❌ ${serviceCode}`);
        console.log(`   Status: Service NOT found in database`);
        servicesWithoutSchemas++;
      }
    }

    console.log('\n' + '━'.repeat(100));
    console.log('\n📈 SUMMARY REPORT:\n');
    console.log(`   Total Expected Services: ${expectedServices.length}`);
    console.log(`   ✅ Services with Form Schemas: ${servicesWithSchemas}`);
    console.log(`   ⚠️  Services without Form Schemas: ${servicesWithoutSchemas}`);
    console.log(
      `\n   ${servicesWithSchemas === expectedServices.length ? '✅ ALL SERVICES HAVE FORM SCHEMAS!' : '⚠️  Some services are missing form schemas'}`,
    );

    // Additional: Get total services count
    const totalServices = await serviceRepo.count();
    console.log(`\n   Total Services in Database: ${totalServices}`);

    console.log('\n' + '━'.repeat(100));
    console.log('\n✅ Verification completed!\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('\n❌ Error during verification:', error);
    process.exit(1);
  }
}

verifyFormSchemas();
