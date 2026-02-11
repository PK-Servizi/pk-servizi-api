import 'reflect-metadata';
import { AppDataSource } from './src/config/data-source';
import { Service } from './src/modules/services/entities/service.entity';

const SERVICES_TO_CHECK = [
  'ISEE_ORD_2026',
  'ISEE_UNI_2026',
  'ISEE_SOC_2026',
  'ISEE_MIN_2026',
  'ISEE_COR_2026',
  'NASP_2026',
  'DAGRN_2026',
  'ANTNAS_2026',
  'DID_2026',
  'PAD_2026',
  'NASPICOM_2026',
  'DISM_VOL_2026',
  'DISM_GIUSTA_2026',
  'DISM_REVOCA_2026',
  'RATE_GEN_2026',
  'CITT_RES_2026',
  'CITT_MAT_2026',
  'ESTCONT_PREV_2026',
  'COMM_INPS_2026',
];

async function verifyRequiredDocuments() {
  try {
    console.log('\n📋 Verifying Required Documents in Database...\n');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceRepo = AppDataSource.getRepository(Service);

    let totalChecked = 0;
    let totalWithDocuments = 0;

    for (const code of SERVICES_TO_CHECK) {
      const service = await serviceRepo.findOne({
        where: { code },
      });

      if (service) {
        totalChecked++;
        const docs = Array.isArray(service.requiredDocuments)
          ? service.requiredDocuments
          : [];
        const hasDocuments = docs.length > 0;

        if (hasDocuments) {
          totalWithDocuments++;
          console.log(
            `✅ ${service.name.padEnd(50)} - ${docs.length} documents`
          );
          docs.slice(0, 2).forEach((doc) => {
            console.log(`   └─ ${doc}`);
          });
          if (docs.length > 2) {
            console.log(`   └─ ... and ${docs.length - 2} more`);
          }
        } else {
          console.log(
            `⚠️  ${service.name.padEnd(50)} - NO DOCUMENTS`
          );
        }
      } else {
        console.log(`❌ Service ${code} not found in database`);
      }
    }

    console.log('\n📊 Summary:');
    console.log(`   ✅ Services with required documents: ${totalWithDocuments}/${totalChecked}`);
    console.log(`   ✨ Completion: ${((totalWithDocuments / totalChecked) * 100).toFixed(1)}%\n`);

    if (totalWithDocuments === totalChecked) {
      console.log('🎉 All services have required documents!\n');
    }
  } catch (error) {
    console.error('❌ Error during verification:', error);
    throw error;
  }
}

if (require.main === module) {
  verifyRequiredDocuments()
    .then(() => {
      console.log('✨ Verification completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Verification failed:', error);
      process.exit(1);
    });
}
