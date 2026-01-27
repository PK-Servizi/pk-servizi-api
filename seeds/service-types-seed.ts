import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';
import { ServiceType } from '../src/modules/service-types/entities/service-type.entity';

// First, define service type categories
const SERVICE_TYPE_CATEGORIES = [
  {
    name: 'Tax Services',
    description: 'Tax declarations and fiscal services',
  },
  {
    name: 'Business Services',
    description: 'Business registration and administrative services',
  },
  {
    name: 'Personal Services',
    description: 'Personal documents and certificates',
  },
  {
    name: 'Pension Services',
    description: 'Pension and social security services',
  },
];

// Then, define services under each type
const SERVICES_BY_TYPE = {
  'Tax Services': [
    {
      name: 'ISEE 2024',
      code: 'ISEE',
      description: 'Indicatore della Situazione Economica Equivalente for social benefits.',
      category: 'TAX',
      basePrice: 45.00,
      requiredDocuments: [
        {
          category: 'IDENTITY',
          name: 'Valid ID Document',
          description: 'Identity card or Passport of the declarant',
          required: true,
        },
        {
          category: 'TAX_CODE',
          name: 'Fiscal Code',
          description: 'Fiscal code card (Tessera Sanitaria)',
          required: true,
        },
        {
          category: 'INCOME',
          name: 'Income Certifications',
          description: 'CU, 730, or Unico from previous year',
          required: true,
        },
        {
          category: 'ASSETS',
          name: 'Bank/Post Office Balance',
          description: 'Average balance and year-end balance as of 31/12/2022',
          required: true,
        },
      ],
      formSchema: {
        title: 'ISEE Declaration Data',
        type: 'object',
        properties: {
          familyMembers: {
            type: 'array',
            title: 'Family Unit Members',
            items: {
              type: 'object',
              properties: {
                fullName: { type: 'string', title: 'Full Name' },
                fiscalCode: { type: 'string', title: 'Fiscal Code' },
                birthDate: { type: 'string', format: 'date', title: 'Date of Birth' },
              }
            }
          }
        }
      }
    },
    {
      name: 'Model 730/2024',
      code: '730',
      description: 'Tax declaration for employees and retirees.',
      category: 'TAX',
      basePrice: 50.00,
      requiredDocuments: [
        {
          category: 'IDENTITY',
          name: 'Valid ID Document',
          required: true
        },
        {
          category: 'INCOME',
          name: 'Certificazione Unica (CU)',
          description: 'CU provided by employer or INPS',
          required: true
        },
      ],
      formSchema: {
        title: '730 Declaration Details',
        type: 'object',
        properties: {
          employer: {
            type: 'string',
            title: 'Current Employer'
          },
          maritalStatus: {
            type: 'string',
            title: 'Marital Status',
            enum: ['Single', 'Married', 'Divorced', 'Widowed']
          },
        }
      }
    },
    {
      name: 'IMU Calculation',
      code: 'IMU',
      description: 'Calculation of municipal property tax.',
      category: 'TAX',
      basePrice: 20.00,
      requiredDocuments: [
        {
          category: 'PROPERTY',
          name: 'Visura Catastale',
          description: 'Updated Visura Catastale',
          required: true
        },
      ],
      formSchema: {
        title: 'Property Data',
        type: 'object',
        properties: {
          properties: {
            type: 'array',
            title: 'List of Properties',
            items: {
              type: 'object',
              properties: {
                address: { type: 'string', title: 'Address' },
                city: { type: 'string', title: 'City/Municipality' },
              }
            }
          }
        }
      }
    },
  ],
  'Business Services': [
    {
      name: 'Partita IVA Opening',
      code: 'PIVA_OPEN',
      description: 'VAT number registration for new business',
      category: 'BUSINESS',
      basePrice: 100.00,
      requiredDocuments: [
        {
          category: 'IDENTITY',
          name: 'Valid ID Document',
          required: true
        },
        {
          category: 'TAX_CODE',
          name: 'Fiscal Code',
          required: true
        },
      ],
      formSchema: {
        title: 'Business Information',
        type: 'object',
        properties: {
          businessType: {
            type: 'string',
            title: 'Business Type',
            enum: ['Individual', 'Partnership', 'Company']
          },
          activityCode: {
            type: 'string',
            title: 'ATECO Activity Code'
          },
        }
      }
    },
  ],
  'Personal Services': [
    {
      name: 'Residency Change',
      code: 'RESIDENCY',
      description: 'Change of residential address',
      category: 'PERSONAL',
      basePrice: 30.00,
      requiredDocuments: [
        {
          category: 'IDENTITY',
          name: 'Valid ID Document',
          required: true
        },
      ],
      formSchema: {
        title: 'New Address',
        type: 'object',
        properties: {
          newAddress: { type: 'string', title: 'New Address' },
          city: { type: 'string', title: 'City' },
        }
      }
    },
  ],
  'Pension Services': [
    {
      name: 'Pension Application',
      code: 'PENSION',
      description: 'Application for retirement pension',
      category: 'PENSION',
      basePrice: 150.00,
      requiredDocuments: [
        {
          category: 'IDENTITY',
          name: 'Valid ID Document',
          required: true
        },
        {
          category: 'EMPLOYMENT',
          name: 'Employment History',
          description: 'Complete work history documentation',
          required: true
        },
      ],
      formSchema: {
        title: 'Pension Details',
        type: 'object',
        properties: {
          retirementDate: {
            type: 'string',
            format: 'date',
            title: 'Expected Retirement Date'
          },
        }
      }
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
      let serviceType = await serviceTypeRepo.findOne({ where: { name: typeData.name } });
      
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
      const serviceType = await serviceTypeRepo.findOne({ where: { name: typeName } });
      
      if (!serviceType) {
        console.log(`   ⚠️  Service type not found: ${typeName}`);
        continue;
      }

      console.log(`\n   📂 Processing "${typeName}":`);
      
      for (const serviceData of services) {
        const existing = await serviceRepo.findOne({ where: { code: serviceData.code } });

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
