import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { ServiceType } from '../src/modules/service-requests/entities/service-type.entity';

const SERVICE_TYPES = [
  {
    name: 'ISEE 2024',
    code: 'ISEE',
    description: 'Indicatore della Situazione Economica Equivalente for social benefits.',
    category: 'TAX',
    basePrice: 0.00, // Often free or low cost via CAF
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
        description: 'Average balance and year-end balance (Saldo e Giacenza Media) as of 31/12/2022',
        required: true,
      },
      {
        category: 'PROPERTY',
        name: 'Property Deeds/Visura',
        description: 'Visura Catastale for all owned properties',
        required: false,
      },
      {
        category: 'VEHICLES',
        name: 'Vehicle Registration',
        description: 'License plate numbers for cars/motorcycles > 500cc',
        required: false,
      }
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
              relationship: { 
                type: 'string', 
                title: 'Relationship to Declarant',
                enum: ['Declarant', 'Spouse', 'Child', 'Other'] 
              }
            }
          }
        },
        hasRentalContract: {
          type: 'boolean',
          title: 'Do you live in a rented house?',
          default: false
        },
        rentalDetails: {
          type: 'object',
          title: 'Rental Contract Details',
          properties: {
            registrationNumber: { type: 'string', title: 'Contract Registration Number' },
            annualRent: { type: 'number', title: 'Annual Rent Amount' }
          },
          // Logic to show only if hasRentalContract is true would be handled by frontend
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
      {
        category: 'EXPENSES',
        name: 'Medical Expenses',
        description: 'Receipts for medical visits and drugs (ticket)',
        required: false
      },
      {
        category: 'EXPENSES',
        name: 'Renovation/Energy Saving',
        description: 'Invoices and bank transfers for home renovations',
        required: false
      }
    ],
    formSchema: {
      title: '730 Declaration Details',
      type: 'object',
      properties: {
        employer: {
          type: 'string',
          title: 'Current Employer (Sostituto d\'Imposta)'
        },
        maritalStatus: {
          type: 'string',
          title: 'Marital Status',
          enum: ['Single', 'Married', 'Divorced', 'Widowed']
        },
        dependents: {
          type: 'array',
          title: 'Dependent Family Members',
          items: {
            type: 'object',
            properties: {
              fiscalCode: { type: 'string', title: 'Fiscal Code' },
              monthsDependent: { type: 'number', title: 'Months supported', minimum: 1, maximum: 12 },
              percentage: { type: 'number', title: 'Deduction Percentage', enum: [0, 50, 100] }
            }
          }
        }
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
      {
        category: 'DEED',
        name: 'Purchase/Sale Deed',
        description: 'Only if property changed ownership this year',
        required: false
      }
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
              category: { type: 'string', title: 'Cadastral Category (e.g., A2, A3)' },
              ownershipPercentage: { type: 'number', title: '% Ownership', default: 100 },
              monthsOwned: { type: 'number', title: 'Months Owned in Year', default: 12 },
              isMainResidence: { type: 'boolean', title: 'Is Main Residence?', default: false }
            }
          }
        }
      }
    }
  }
];

export async function seedServiceTypes() {
  try {
    console.log('🚀 Starting Service Types seeding...');
    
    // Ensure connection is initialized if called standalone
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
    }

    const repo = AppDataSource.getRepository(ServiceType);

    for (const typeData of SERVICE_TYPES) {
      const existing = await repo.findOne({ where: { code: typeData.code } });
      
      // Workaround for TypeORM/Postgres issue with JSONB arrays
      // We manually stringify the JSON objects/arrays to ensure correct Postgres format
      const requiredDocuments = JSON.stringify(typeData.requiredDocuments);
      const formSchema = JSON.stringify(typeData.formSchema);

      if (existing) {
        console.log(`Update existing service: ${typeData.name}`);
        // Merge updates
        existing.name = typeData.name;
        existing.description = typeData.description;
        existing.category = typeData.category;
        existing.requiredDocuments = requiredDocuments;
        existing.formSchema = formSchema;
        existing.basePrice = typeData.basePrice;
        await repo.save(existing);
      } else {
        console.log(`Create new service: ${typeData.name}`);
        const newType = repo.create({
          ...typeData,
          requiredDocuments, // Pass as string
          formSchema, // Pass as string
        });
        await repo.save(newType);
      }
    }

    console.log('✅ Service Types seeded successfully!');
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
