import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';

async function checkService730() {
  console.log('🔍 Checking Model 730 with Property Service...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const serviceRepo = AppDataSource.getRepository('Service');
    
    // Find the service (could be 730_IMMOBILI or 730_STANDARD)
    const service = await serviceRepo.findOne({ 
      where: [
        { name: 'Model 730 with Property' },
        { code: '730_IMMOBILI' }
      ]
    });
    
    if (!service) {
      console.log('❌ Service not found');
      await AppDataSource.destroy();
      return;
    }

    console.log(`📋 Service: ${service.name} (${service.code})`);
    console.log(`\n📄 Form Schema:`);
    
    if (!service.formSchema || !service.formSchema.sections) {
      console.log('❌ No form schema found');
      await AppDataSource.destroy();
      return;
    }

    const sections = service.formSchema.sections;
    console.log(`\nTotal Sections: ${sections.length}\n`);
    
    sections.forEach((section, index) => {
      console.log(`${index + 1}. ${section.title || section.id}`);
      console.log(`   ID: ${section.id}`);
      console.log(`   Fields: ${section.fields?.length || 0}`);
      
      if (section.fields && section.fields.length > 0) {
        section.fields.forEach(field => {
          console.log(`      - ${field.name} (${field.type})${field.required ? ' *required' : ''}`);
        });
      }
      console.log('');
    });

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🔍 First Section:', sections[0]?.id);
    console.log('🔍 Last Section:', sections[sections.length - 1]?.id);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // Also print the raw JSON
    console.log('\n📦 RAW JSON (sections only):');
    console.log(JSON.stringify(service.formSchema.sections, null, 2));

    await AppDataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

checkService730();
