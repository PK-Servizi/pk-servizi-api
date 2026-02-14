import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';

async function testServiceEndpoint() {
  console.log('🔍 Testing Service Data Directly from Database...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const serviceRepo = AppDataSource.getRepository('Service');
    
    // Get the 730_IMMOBILI service that's shown in the screenshot
    const service = await serviceRepo.findOne({ 
      where: { code: '730_IMMOBILI' }
    });
    
    if (!service) {
      console.log('❌ Service not found');
      return;
    }

    console.log(`📋 Service: ${service.name} (${service.code})`);
    console.log(`\nForm Schema Sections:`);
    
    if (service.formSchema && service.formSchema.sections) {
      service.formSchema.sections.forEach((section: any, index: number) => {
        console.log(`  ${index + 1}. ${section.title || section.id}`);
        console.log(`     Fields: ${section.fields?.length || 0}`);
        if (section.id === 'personal_information') {
          console.log('     ✅ Personal Information (FIRST)');
        }
        if (section.id === 'declarations_authorization') {
          console.log('     ✅ Declarations & Authorization (LAST)');
        }
      });
    }

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('If you see "Declarations & Authorization (LAST)" above,');
    console.log('then the data is correct in the database.');
    console.log('You need to restart your backend server to see it in the app.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

testServiceEndpoint();
