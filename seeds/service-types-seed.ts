import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';
import { ServiceType } from '../src/modules/service-types/entities/service-type.entity';

// First, define service type categories
const SERVICE_TYPE_CATEGORIES = [
  {
    name: 'ISEE',
    description: 'ISEE (Indicatore Situazione Economica Equivalente) - CAF service for social benefits',
  },
  {
    name: '730/PF',
    description: 'Tax declarations - Model 730 and Persona Fisica (PF)',
  },
  {
    name: 'IMU',
    description: 'IMU (Imposta Municipale Unica) - Municipal property tax services',
  },
];

// Then, define services under each type
const SERVICES_BY_TYPE = {
  'ISEE': [
    {
      name: 'ISEE Standard',
      code: 'ISEE_STANDARD',
      description: 'Standard ISEE for general social benefits and subsidies',
      category: 'TAX',
      basePrice: 45.0,
      requiredDocuments: [
        { category: 'IDENTITY', name: 'Valid ID', required: true },
        { category: 'TAX_CODE', name: 'Fiscal Code', required: true },
        { category: 'INCOME', name: 'Income Certifications (CU/730)', required: true },
        { category: 'ASSETS', name: 'Bank Balance (31/12)', required: true },
      ],
      formSchema: {
        title: 'ISEE Standard Data',
        type: 'object',
        properties: {
          nucleoFamiliare: { type: 'array', title: 'Family Unit' },
          abitazione: { type: 'object', title: 'Housing' },
          redditi: { type: 'object', title: 'Income (last 2 years)' },
          patrimonioMobiliare: { type: 'object', title: 'Movable Assets' },
        },
      },
    },
    {
      name: 'ISEE Università',
      code: 'ISEE_UNIVERSITA',
      description: 'ISEE for university tuition and student benefits',
      category: 'TAX',
      basePrice: 50.0,
      requiredDocuments: [
        { category: 'IDENTITY', name: 'Student ID', required: true },
        { category: 'EDUCATION', name: 'University Enrollment', required: true },
        { category: 'INCOME', name: 'Family Income Documents', required: true },
      ],
      formSchema: {
        title: 'ISEE Università Data',
        type: 'object',
        properties: {
          studente: { type: 'object', title: 'Student Info' },
          universita: { type: 'string', title: 'University' },
          nucleoFamiliare: { type: 'array', title: 'Family Unit' },
        },
      },
    },
    {
      name: 'ISEE Sociosanitario',
      code: 'ISEE_SOCIOSANITARIO',
      description: 'ISEE for healthcare and social-health services',
      category: 'TAX',
      basePrice: 55.0,
      requiredDocuments: [
        { category: 'IDENTITY', name: 'Valid ID', required: true },
        { category: 'HEALTH', name: 'Disability Certificate', required: false },
        { category: 'INCOME', name: 'Income Documents', required: true },
      ],
      formSchema: {
        title: 'ISEE Sociosanitario Data',
        type: 'object',
        properties: {
          beneficiario: { type: 'object', title: 'Beneficiary' },
          disabilita: { type: 'object', title: 'Disability Info' },
          nucleoFamiliare: { type: 'array', title: 'Family Unit' },
        },
      },
    },
  ],
  '730/PF': [
    {
      name: 'Model 730 Standard',
      code: '730_STANDARD',
      description: 'Standard tax declaration for employees and retirees',
      category: 'TAX',
      basePrice: 60.0,
      requiredDocuments: [
        { category: 'IDENTITY', name: 'Valid ID', required: true },
        { category: 'INCOME', name: 'Certificazione Unica (CU)', required: true },
        { category: 'EXPENSES', name: 'Medical Expenses', required: false },
      ],
      formSchema: {
        title: '730 Standard Data',
        type: 'object',
        properties: {
          datiAnagrafici: { type: 'object', title: 'Personal Data' },
          redditi: { type: 'object', title: 'Income (CU, INPS)' },
          speseSanitarie: { type: 'array', title: 'Medical Expenses' },
          famiglia: { type: 'object', title: 'Family' },
        },
      },
    },
    {
      name: 'Model 730 with Property',
      code: '730_IMMOBILI',
      description: 'Tax declaration including property income and deductions',
      category: 'TAX',
      basePrice: 80.0,
      requiredDocuments: [
        { category: 'IDENTITY', name: 'Valid ID', required: true },
        { category: 'INCOME', name: 'CU + Property Income', required: true },
        { category: 'PROPERTY', name: 'Property Documents', required: true },
      ],
      formSchema: {
        title: '730 with Property Data',
        type: 'object',
        properties: {
          redditi: { type: 'object', title: 'Income' },
          immobili: { type: 'array', title: 'Properties' },
          mutui: { type: 'array', title: 'Mortgages' },
          bonusCasa: { type: 'object', title: 'Home Bonus' },
        },
      },
    },
    {
      name: 'Persona Fisica (PF)',
      code: 'PF_UNICO',
      description: 'Complete tax declaration for self-employed and complex situations',
      category: 'TAX',
      basePrice: 120.0,
      requiredDocuments: [
        { category: 'IDENTITY', name: 'Valid ID', required: true },
        { category: 'INCOME', name: 'All Income Documents', required: true },
        { category: 'BUSINESS', name: 'Business Records', required: false },
      ],
      formSchema: {
        title: 'PF Unico Data',
        type: 'object',
        properties: {
          redditi: { type: 'object', title: 'All Income' },
          altriRedditi: { type: 'array', title: 'Other Income' },
          speseIstruzione: { type: 'array', title: 'Education Expenses' },
          assicurazioni: { type: 'object', title: 'Insurance & Pension' },
        },
      },
    },
  ],
  'IMU': [
    {
      name: 'IMU Calculation Single Property',
      code: 'IMU_SINGLE',
      description: 'IMU calculation for single property',
      category: 'TAX',
      basePrice: 25.0,
      requiredDocuments: [
        { category: 'PROPERTY', name: 'Visura Catastale', required: true },
        { category: 'IDENTITY', name: 'Valid ID', required: true },
      ],
      formSchema: {
        title: 'IMU Single Property',
        type: 'object',
        properties: {
          contribuente: { type: 'object', title: 'Taxpayer Data' },
          immobile: { type: 'object', title: 'Property' },
          utilizzo: { type: 'string', title: 'Property Use' },
          agevolazioni: { type: 'array', title: 'Tax Benefits' },
        },
      },
    },
    {
      name: 'IMU Multiple Properties',
      code: 'IMU_MULTIPLE',
      description: 'IMU calculation for multiple properties',
      category: 'TAX',
      basePrice: 40.0,
      requiredDocuments: [
        { category: 'PROPERTY', name: 'All Visure Catastali', required: true },
        { category: 'IDENTITY', name: 'Valid ID', required: true },
      ],
      formSchema: {
        title: 'IMU Multiple Properties',
        type: 'object',
        properties: {
          contribuente: { type: 'object', title: 'Taxpayer Data' },
          immobili: { type: 'array', title: 'Properties List' },
          variazioni: { type: 'array', title: 'Property Changes' },
        },
      },
    },
    {
      name: 'IMU with Succession',
      code: 'IMU_SUCCESSIONE',
      description: 'IMU calculation including inheritance/succession',
      category: 'TAX',
      basePrice: 60.0,
      requiredDocuments: [
        { category: 'PROPERTY', name: 'Visura Catastale', required: true },
        { category: 'LEGAL', name: 'Succession Documents', required: true },
        { category: 'IDENTITY', name: 'Valid ID', required: true },
      ],
      formSchema: {
        title: 'IMU with Succession',
        type: 'object',
        properties: {
          contribuente: { type: 'object', title: 'Taxpayer Data' },
          immobili: { type: 'array', title: 'Properties' },
          successione: { type: 'object', title: 'Succession Details' },
          pagamentiIMU: { type: 'array', title: 'IMU Payments' },
        },
      },
    },
  ],
};

export async function seedServiceTypes() {
  try {
    console.log('🚀 Starting Service Types and Services seeding...');

    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const serviceTypeRepo = AppDataSource.getRepository(ServiceType);
    const serviceRepo = AppDataSource.getRepository(Service);

    // Step 1: Create Service Type Categories
    console.log('\n📁 Creating Service Type Categories...');
    for (const typeData of SERVICE_TYPE_CATEGORIES) {
      let serviceType = await serviceTypeRepo.findOne({
        where: { name: typeData.name },
      });

      if (!serviceType) {
        serviceType = serviceTypeRepo.create(typeData);
        await serviceTypeRepo.save(serviceType);
        console.log(`   ✅ Created service type: ${typeData.name}`);
      } else {
        console.log(`   ⏭️  Service type already exists: ${typeData.name}`);
      }
    }

    // Step 2: Create Services under each type
    console.log('\n📋 Creating Services under each type...');
    for (const [typeName, services] of Object.entries(SERVICES_BY_TYPE)) {
      const serviceType = await serviceTypeRepo.findOne({
        where: { name: typeName },
      });

      if (!serviceType) {
        console.log(`   ⚠️  Service type not found: ${typeName}`);
        continue;
      }

      console.log(`\n   📂 Processing "${typeName}":`);

      for (const serviceData of services) {
        const existing = await serviceRepo.findOne({
          where: { code: serviceData.code },
        });

        if (existing) {
          console.log(`      ⏭️  Service exists: ${serviceData.name}`);
          // Update with service type ID
          existing.serviceTypeId = serviceType.id;
          existing.name = serviceData.name;
          existing.description = serviceData.description;
          existing.category = serviceData.category;
          existing.basePrice = serviceData.basePrice;
          existing.requiredDocuments = serviceData.requiredDocuments as any;
          existing.formSchema = serviceData.formSchema as any;
          await serviceRepo.save(existing);
        } else {
          console.log(`      ✅ Creating: ${serviceData.name}`);
          const newService = serviceRepo.create({
            ...serviceData,
            serviceTypeId: serviceType.id,
            requiredDocuments: serviceData.requiredDocuments as any,
            formSchema: serviceData.formSchema as any,
          });
          await serviceRepo.save(newService);
        }
      }
    }

    console.log('\n✅ Service Types and Services seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding Service Types:', error);
    throw error;
  }
}

// Allow standalone execution
if (require.main === module) {
  seedServiceTypes()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
