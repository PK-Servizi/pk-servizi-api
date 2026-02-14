import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';

async function verifyDeclarations() {
  console.log('🔍 Verifying Declarations Section in Services...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const serviceRepo = AppDataSource.getRepository('Service');
    
    // Check a few sample services
    const sampleCodes = ['ISEE_ORD_2026', 'NASP_2026', 'DID_2026', 'ISEE_STANDARD', 'NASPI'];
    
    for (const code of sampleCodes) {
      const service = await serviceRepo.findOne({ where: { code } });
      
      if (!service) {
        console.log(`❌ Service ${code} not found`);
        continue;
      }

      const formSchema = service.formSchema;
      if (!formSchema || !formSchema.sections) {
        console.log(`❌ ${code}: No form schema`);
        continue;
      }

      const sections = formSchema.sections;
      const firstSection = sections[0];
      const lastSection = sections[sections.length - 1];

      const hasPersonalInfo = firstSection?.id === 'personal_information';
      const hasDeclarations = lastSection?.id === 'declarations_authorization';

      console.log(`📋 ${code}:`);
      console.log(`   Sections: ${sections.length}`);
      console.log(`   First: ${firstSection?.id} ${hasPersonalInfo ? '✅' : '❌'}`);
      console.log(`   Last: ${lastSection?.id} ${hasDeclarations ? '✅' : '❌'}`);
      
      if (hasDeclarations) {
        const declarationFields = lastSection.fields?.length || 0;
        console.log(`   Declaration fields: ${declarationFields}`);
      }
      console.log('');
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ Verification complete!');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

verifyDeclarations();
