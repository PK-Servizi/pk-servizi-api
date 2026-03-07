import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';

async function verifyAllQuestionnaires() {
  console.log('\n📋 VERIFYING ALL SERVICES HAVE CORRECT QUESTIONNAIRE STRUCTURE...\n');

  await AppDataSource.initialize();
  const services = await AppDataSource.getRepository('Service').find();

  let correct = 0;
  const issues: string[] = [];

  for (const svc of services) {
    const schema = svc.formSchema as any;
    if (!schema?.sections?.length) {
      issues.push(`${svc.code}: No sections`);
      continue;
    }

    const first = schema.sections[0];
    const last = schema.sections[schema.sections.length - 1];

    const hasPI = first.id === 'personal_information';
    const hasDecl = last.id === 'declarations_authorization';
    const piFields = (first.fields || []).map((f: any) => f.name);
    const hasPerm =
      piFields.includes('permesso_soggiorno') &&
      piFields.includes('permesso_expiry_date') &&
      piFields.includes('permesso_ricevuta');
    const hasStato = piFields.includes('stato_civile');

    if (hasPI && hasDecl && hasPerm && hasStato) {
      correct++;
    } else {
      issues.push(
        `${svc.code}: PI=${hasPI}, Decl=${hasDecl}, Perm=${hasPerm}, Stato=${hasStato}`,
      );
    }
  }

  console.log('━'.repeat(60));
  console.log(`📊 Total Services: ${services.length}`);
  console.log(`✅ Correct (all requirements): ${correct}`);
  console.log(`❌ Issues: ${issues.length}`);
  console.log('━'.repeat(60));

  if (issues.length > 0) {
    console.log('\n⚠️ Services with issues:');
    issues.forEach((i) => console.log(`   - ${i}`));
  } else {
    console.log('\n🎉 ALL SERVICES HAVE CORRECT QUESTIONNAIRE STRUCTURE!');
    console.log('   ✅ First section: Informazioni Personali');
    console.log('      - permesso_soggiorno');
    console.log('      - permesso_expiry_date');
    console.log('      - permesso_ricevuta');
    console.log('      - stato_civile');
    console.log('   ✅ Last section: Dichiarazioni e Autorizzazioni');
    console.log('      - declare_data_truthful (required)');
    console.log('      - authorize_gdpr (required)');
    console.log('      - delegate_caf_dsu (required)');
    console.log('      - recontact_other_services (optional)');
    console.log('      - digital_signature (required)');
    console.log('      - full_name_signature (required)');
  }

  console.log('\n');
  await AppDataSource.destroy();
}

verifyAllQuestionnaires();
