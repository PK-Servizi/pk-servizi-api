import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';

async function listAllServices() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceRepo = AppDataSource.getRepository(Service);
    const services = await serviceRepo.find({ order: { code: 'ASC' } });

    console.log(`\n📊 Total Services in Database: ${services.length}\n`);
    console.log('Service Codes and Section Counts:');
    console.log('=================================');

    for (const service of services) {
      const sectionCount = (service.formSchema?.sections || []).length;
      const sections = (service.formSchema?.sections || []).map(s => s.id).join(', ');
      console.log(`${service.code}: ${sectionCount} sections [${sections}]`);
    }

    console.log('\n✅ List complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

listAllServices();
