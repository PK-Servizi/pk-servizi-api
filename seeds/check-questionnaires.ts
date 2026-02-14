import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';

async function checkQuestionnaires() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceRepo = AppDataSource.getRepository(Service);

    // Check ISEE_ORD_2026
    let service = await serviceRepo.findOne({
      where: { code: 'ISEE_ORD_2026' },
    });

    if (service && service.formSchema) {
      console.log('\n✅ ISEE_ORD_2026 Form Schema Structure:');
      console.log('=====================================');
      const sections = service.formSchema.sections || [];
      sections.forEach((s, idx) => {
        console.log(
          `  ${idx + 1}. [${s.id}] ${s.title} (${(s.fields || []).length} fields)`,
        );
      });
      console.log(`\nTotal Sections: ${sections.length}`);
    }

    // Check 730_2026
    service = await serviceRepo.findOne({
      where: { code: '730_2026' },
    });

    if (service && service.formSchema) {
      console.log('\n✅ 730_2026 Form Schema Structure:');
      console.log('=====================================');
      const sections = service.formSchema.sections || [];
      sections.forEach((s, idx) => {
        console.log(
          `  ${idx + 1}. [${s.id}] ${s.title} (${(s.fields || []).length} fields)`,
        );
      });
      console.log(`\nTotal Sections: ${sections.length}`);
    }

    // Check NASP_2026
    service = await serviceRepo.findOne({
      where: { code: 'NASP_2026' },
    });

    if (service && service.formSchema) {
      console.log('\n✅ NASP_2026 Form Schema Structure:');
      console.log('=====================================');
      const sections = service.formSchema.sections || [];
      sections.forEach((s, idx) => {
        console.log(
          `  ${idx + 1}. [${s.id}] ${s.title} (${(s.fields || []).length} fields)`,
        );
      });
      console.log(`\nTotal Sections: ${sections.length}`);
    }

    // Check DISM_VOL_2026
    service = await serviceRepo.findOne({
      where: { code: 'DISM_VOL_2026' },
    });

    if (service && service.formSchema) {
      console.log('\n✅ DISM_VOL_2026 Form Schema Structure:');
      console.log('=====================================');
      const sections = service.formSchema.sections || [];
      sections.forEach((s, idx) => {
        console.log(
          `  ${idx + 1}. [${s.id}] ${s.title} (${(s.fields || []).length} fields)`,
        );
      });
      console.log(`\nTotal Sections: ${sections.length}`);
    }

    console.log('\n✅ Questionnaire check completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking questionnaires:', error);
    process.exit(1);
  }
}

checkQuestionnaires();
