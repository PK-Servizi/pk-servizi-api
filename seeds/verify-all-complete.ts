import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';

async function verifyAllServices() {
  console.log('🔍 Verifying ALL 95 Services...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const serviceRepo = AppDataSource.getRepository('Service');
    const allServices = await serviceRepo.find({ order: { code: 'ASC' } });
    
    let correctCount = 0;
    let missingPersonalInfo = 0;
    let missingDeclarations = 0;
    let noSchema = 0;

    for (const service of allServices) {
      const formSchema = service.formSchema;
      
      if (!formSchema || !formSchema.sections || formSchema.sections.length === 0) {
        noSchema++;
        console.log(`❌ ${service.code}: No form schema`);
        continue;
      }

      const sections = formSchema.sections;
      const firstSection = sections[0];
      const lastSection = sections[sections.length - 1];

      const hasPersonalInfo = firstSection?.id === 'personal_information';
      const hasDeclarations = lastSection?.id === 'declarations_authorization';

      if (hasPersonalInfo && hasDeclarations) {
        correctCount++;
      } else {
        console.log(`⚠️  ${service.code}:`);
        if (!hasPersonalInfo) {
          console.log(`   Missing personal_information (first is: ${firstSection?.id})`);
          missingPersonalInfo++;
        }
        if (!hasDeclarations) {
          console.log(`   Missing declarations_authorization (last is: ${lastSection?.id})`);
          missingDeclarations++;
        }
      }
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 VERIFICATION SUMMARY:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Total Services: ${allServices.length}`);
    console.log(`✅ Correct Structure: ${correctCount}`);
    console.log(`❌ Missing Personal Info: ${missingPersonalInfo}`);
    console.log(`❌ Missing Declarations: ${missingDeclarations}`);
    console.log(`❌ No Schema: ${noSchema}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    if (correctCount === allServices.length) {
      console.log('\n🎉 SUCCESS! All services have correct structure!');
      console.log('   ✅ Personal Information (First)');
      console.log('   ✅ Declarations & Authorization (Last)');
    }

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyAllServices();
