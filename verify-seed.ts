import 'reflect-metadata';
import { AppDataSource } from './src/config/data-source';
import { ServiceType } from './src/modules/service-types/entities/service-type.entity';
import { Service } from './src/modules/services/entities/service.entity';
import { Faq } from './src/modules/faqs/entities/faq.entity';

async function verifyData() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceTypeRepo = AppDataSource.getRepository(ServiceType);
    const serviceRepo = AppDataSource.getRepository(Service);
    const faqRepo = AppDataSource.getRepository(Faq);

    const serviceTypesCount = await serviceTypeRepo.count();
    const servicesCount = await serviceRepo.count();
    const faqsCount = await faqRepo.count();

    console.log('\n📊 Database Verification:');
    console.log(`   🔹 Total Service Types: ${serviceTypesCount}`);
    console.log(`   🔹 Total Services: ${servicesCount}`);
    console.log(`   🔹 Total FAQs: ${faqsCount}`);

    // Get price summary
    const topPrices = await serviceRepo
      .createQueryBuilder('service')
      .orderBy('service.base_price', 'DESC')
      .limit(10)
      .select(['service.name', 'service.code', 'service.base_price'])
      .getRawMany();

    console.log('\n💰 Top 10 Most Expensive Services:');
    topPrices.forEach((s, idx) => {
      console.log(`   ${idx + 1}. ${s.service_name} (${s.service_code}): €${s.service_base_price}`);
    });

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyData();
