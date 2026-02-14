import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';

async function checkComprehensiveQuestionnaires() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceRepo = AppDataSource.getRepository(Service);
    const serviceCodesToCheck = [
      'ISEE_ORD_2026',
      '730_2026',
      'DISM_VOL_2026',
      'NASP_2026',
      'DAGRN_2026',
      'BON_NATI_2026',
      'PAD_ASS_INCL_2026',
      'ASS_SOC_2026',
    ];

    console.log('\n✅ COMPREHENSIVE QUESTIONNAIRE VERIFICATION');
    console.log('==========================================\n');

    for (const code of serviceCodesToCheck) {
      const service = await serviceRepo.findOne({
        where: { code },
      });

      if (service && service.formSchema) {
        const sections = service.formSchema.sections || [];
        console.log(`\n📋 ${code}:`);
        console.log(`   Total Sections: ${sections.length}`);

        sections.forEach((s, idx) => {
          const fieldCount = (s.fields || []).length;
          console.log(`   ${idx + 1}. [${s.id}] ${s.title} (${fieldCount} fields)`);
        });
      }
    }

    console.log('\n✅ Comprehensive questionnaire check completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

checkComprehensiveQuestionnaires();
