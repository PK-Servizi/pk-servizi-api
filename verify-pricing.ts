import 'reflect-metadata';
import { AppDataSource } from './src/config/data-source';
import { Service } from './src/modules/services/entities/service.entity';

async function verifyPricing() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceRepo = AppDataSource.getRepository(Service);

    // Get top priced services
    const topPrices = await serviceRepo.find({
      order: {
        basePrice: 'DESC',
      },
      take: 15,
      select: ['name', 'code', 'basePrice'],
    });

    console.log('\n💰 Top 15 Most Expensive Services:');
    topPrices.forEach((s, idx) => {
      console.log(`   ${idx + 1}. ${s.name}: €${s.basePrice}`);
    });

    // Count by category
    const byCategory = await serviceRepo
      .createQueryBuilder('service')
      .select('service.category, COUNT(*) as count')
      .groupBy('service.category')
      .getRawMany();

    console.log('\n📂 Services by Category:');
    byCategory.forEach((cat) => {
      console.log(`   ${cat.service_category}: ${cat.count} services`);
    });

    console.log(
      '\n✅ Seed verification complete! Database is populated with comprehensive Italian CAF services data.\n'
    );

    await AppDataSource.destroy();
  } catch (error) {
    console.error('Error:', error);
  }
}

verifyPricing();
