import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';
import { ServiceType } from '../src/modules/service-types/entities/service-type.entity';
import {
  PERSONAL_INFORMATION_SECTION,
  DECLARATIONS_AUTHORIZATION_SECTION,
} from './form-schemas';

const ensureFormSchema = (
  schema: any,
  serviceName: string,
  description?: string,
) => {
  const baseSchema = schema || {};
  const sections = Array.isArray(baseSchema.sections)
    ? [...baseSchema.sections]
    : [];

  if (sections[0]?.id !== 'personal_information') {
    sections.unshift(PERSONAL_INFORMATION_SECTION);
  }

  if (sections[sections.length - 1]?.id !== 'declarations_authorization') {
    sections.push(DECLARATIONS_AUTHORIZATION_SECTION);
  }

  return {
    title: baseSchema.title || serviceName,
    description: baseSchema.description || description || `Form for ${serviceName}`,
    sections,
  };
};

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
        sections: [
          {
            title: 'Nucleo Familiare',
            fields: [
              { name: 'familyMembersCount', label: 'Number of family members', type: 'number', required: true },
              { name: 'familyMembers', label: 'Family members details', type: 'array', required: true },
            ],
          },
          {
            title: 'Abitazione',
            fields: [
              { name: 'housingType', label: 'Housing type', type: 'select', options: ['Owned', 'Rented', 'Other'], required: true },
              { name: 'address', label: 'Address', type: 'text', required: true },
              { name: 'cadastralData', label: 'Cadastral data', type: 'text', required: false },
            ],
          },
          {
            title: 'Redditi (2 anni precedenti)',
            fields: [
              { name: 'income2022', label: '2022 Income', type: 'number', required: true },
              { name: 'income2023', label: '2023 Income', type: 'number', required: true },
            ],
          },
          {
            title: 'Patrimonio Mobiliare',
            fields: [
              { name: 'bankBalance', label: 'Bank balance (31/12)', type: 'number', required: true },
              { name: 'investments', label: 'Investments', type: 'number', required: false },
            ],
          },
          {
            title: 'Veicoli',
            fields: [
              { name: 'vehicles', label: 'Vehicles owned', type: 'array', required: false },
            ],
          },
        ],
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
        sections: [
          {
            title: 'Student Information',
            fields: [
              { name: 'studentName', label: 'Student full name', type: 'text', required: true },
              { name: 'studentFiscalCode', label: 'Student fiscal code', type: 'text', required: true },
              { name: 'university', label: 'University name', type: 'text', required: true },
              { name: 'enrollmentYear', label: 'Enrollment year', type: 'number', required: true },
            ],
          },
          {
            title: 'Nucleo Familiare',
            fields: [
              { name: 'familyMembersCount', label: 'Number of family members', type: 'number', required: true },
              { name: 'familyMembers', label: 'Family members details', type: 'array', required: true },
            ],
          },
          {
            title: 'Redditi',
            fields: [
              { name: 'familyIncome', label: 'Family income', type: 'number', required: true },
            ],
          },
        ],
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
        sections: [
          {
            title: 'Beneficiary Information',
            fields: [
              { name: 'beneficiaryName', label: 'Beneficiary full name', type: 'text', required: true },
              { name: 'beneficiaryFiscalCode', label: 'Fiscal code', type: 'text', required: true },
            ],
          },
          {
            title: 'Disabilità',
            fields: [
              { name: 'hasDisability', label: 'Has disability', type: 'radio', options: ['YES', 'NO'], required: true },
              { name: 'disabilityType', label: 'Disability type', type: 'text', required: false },
              { name: 'disabilityCertificate', label: 'Certificate number', type: 'text', required: false },
            ],
          },
          {
            title: 'Nucleo Familiare',
            fields: [
              { name: 'familyMembersCount', label: 'Number of family members', type: 'number', required: true },
              { name: 'familyMembers', label: 'Family members details', type: 'array', required: true },
            ],
          },
        ],
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
        sections: [
          {
            title: 'Dati Anagrafici',
            fields: [
              { name: 'fullName', label: 'Full name', type: 'text', required: true },
              { name: 'fiscalCode', label: 'Fiscal code', type: 'text', required: true },
              { name: 'birthDate', label: 'Birth date', type: 'date', required: true },
              { name: 'birthPlace', label: 'Birth place', type: 'text', required: true },
            ],
          },
          {
            title: 'Redditi (CU, INPS, altri)',
            fields: [
              { name: 'employerName', label: 'Employer name', type: 'text', required: true },
              { name: 'grossIncome', label: 'Gross income', type: 'number', required: true },
              { name: 'pensionIncome', label: 'Pension income', type: 'number', required: false },
            ],
          },
          {
            title: 'Spese Sanitarie',
            fields: [
              { name: 'medicalExpenses', label: 'Medical expenses', type: 'number', required: false },
              { name: 'medicineExpenses', label: 'Medicine expenses', type: 'number', required: false },
            ],
          },
          {
            title: 'Famiglia',
            fields: [
              { name: 'maritalStatus', label: 'Marital status', type: 'select', options: ['Single', 'Married', 'Divorced', 'Widowed'], required: true },
              { name: 'dependents', label: 'Number of dependents', type: 'number', required: false },
            ],
          },
        ],
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
        sections: [
          {
            title: 'Dati Anagrafici',
            fields: [
              { name: 'fullName', label: 'Full name', type: 'text', required: true },
              { name: 'fiscalCode', label: 'Fiscal code', type: 'text', required: true },
            ],
          },
          {
            title: 'Redditi',
            fields: [
              { name: 'employmentIncome', label: 'Employment income', type: 'number', required: true },
              { name: 'rentalIncome', label: 'Rental income', type: 'number', required: false },
            ],
          },
          {
            title: 'Immobili',
            fields: [
              { name: 'properties', label: 'Properties list', type: 'array', required: true },
            ],
          },
          {
            title: 'Mutui & Bonus Casa',
            fields: [
              { name: 'mortgageInterest', label: 'Mortgage interest paid', type: 'number', required: false },
              { name: 'homeBonus', label: 'Home renovation bonus', type: 'number', required: false },
            ],
          },
        ],
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
        sections: [
          {
            title: 'Dati Anagrafici',
            fields: [
              { name: 'fullName', label: 'Full name', type: 'text', required: true },
              { name: 'fiscalCode', label: 'Fiscal code', type: 'text', required: true },
              { name: 'vatNumber', label: 'VAT number (if applicable)', type: 'text', required: false },
            ],
          },
          {
            title: 'Redditi',
            fields: [
              { name: 'employmentIncome', label: 'Employment income', type: 'number', required: false },
              { name: 'selfEmploymentIncome', label: 'Self-employment income', type: 'number', required: false },
              { name: 'businessIncome', label: 'Business income', type: 'number', required: false },
            ],
          },
          {
            title: 'Altri Redditi',
            fields: [
              { name: 'rentalIncome', label: 'Rental income', type: 'number', required: false },
              { name: 'capitalGains', label: 'Capital gains', type: 'number', required: false },
              { name: 'otherIncome', label: 'Other income', type: 'number', required: false },
            ],
          },
          {
            title: 'Spese Istruzione',
            fields: [
              { name: 'educationExpenses', label: 'Education expenses', type: 'number', required: false },
            ],
          },
          {
            title: 'Assicurazioni & Previdenza',
            fields: [
              { name: 'lifeInsurance', label: 'Life insurance', type: 'number', required: false },
              { name: 'pensionContributions', label: 'Pension contributions', type: 'number', required: false },
            ],
          },
        ],
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
        sections: [
          {
            title: 'Dati Contribuente',
            fields: [
              { name: 'fullName', label: 'Full name', type: 'text', required: true },
              { name: 'fiscalCode', label: 'Fiscal code', type: 'text', required: true },
              { name: 'address', label: 'Residence address', type: 'text', required: true },
            ],
          },
          {
            title: 'Immobile',
            fields: [
              { name: 'propertyAddress', label: 'Property address', type: 'text', required: true },
              { name: 'cadastralCategory', label: 'Cadastral category', type: 'text', required: true },
              { name: 'cadastralIncome', label: 'Cadastral income', type: 'number', required: true },
            ],
          },
          {
            title: 'Utilizzo Immobile',
            fields: [
              { name: 'propertyUse', label: 'Property use', type: 'select', options: ['Main residence', 'Second home', 'Rented', 'Empty'], required: true },
            ],
          },
          {
            title: 'Agevolazioni',
            fields: [
              { name: 'mainResidenceDeduction', label: 'Main residence deduction', type: 'radio', options: ['YES', 'NO'], required: true },
            ],
          },
        ],
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
        sections: [
          {
            title: 'Dati Contribuente',
            fields: [
              { name: 'fullName', label: 'Full name', type: 'text', required: true },
              { name: 'fiscalCode', label: 'Fiscal code', type: 'text', required: true },
            ],
          },
          {
            title: 'Immobili',
            fields: [
              { name: 'propertiesCount', label: 'Number of properties', type: 'number', required: true },
              { name: 'properties', label: 'Properties details', type: 'array', required: true },
            ],
          },
          {
            title: 'Variazioni',
            fields: [
              { name: 'hasChanges', label: 'Property changes in the year', type: 'radio', options: ['YES', 'NO'], required: true },
              { name: 'changes', label: 'Changes details', type: 'array', required: false },
            ],
          },
        ],
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
        sections: [
          {
            title: 'Dati Contribuente',
            fields: [
              { name: 'fullName', label: 'Full name', type: 'text', required: true },
              { name: 'fiscalCode', label: 'Fiscal code', type: 'text', required: true },
            ],
          },
          {
            title: 'Immobili',
            fields: [
              { name: 'properties', label: 'Inherited properties', type: 'array', required: true },
            ],
          },
          {
            title: 'Successione',
            fields: [
              { name: 'deceasedName', label: 'Deceased name', type: 'text', required: true },
              { name: 'dateOfDeath', label: 'Date of death', type: 'date', required: true },
              { name: 'successionDate', label: 'Succession declaration date', type: 'date', required: true },
              { name: 'inheritancePercentage', label: 'Inheritance percentage', type: 'number', required: true },
            ],
          },
          {
            title: 'Pagamenti IMU',
            fields: [
              { name: 'previousPayments', label: 'Previous IMU payments', type: 'array', required: false },
            ],
          },
        ],
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
          existing.formSchema = ensureFormSchema(
            serviceData.formSchema,
            serviceData.name,
            serviceData.description,
          ) as any;
          await serviceRepo.save(existing);
        } else {
          console.log(`      ✅ Creating: ${serviceData.name}`);
          const newService = serviceRepo.create({
            ...serviceData,
            serviceTypeId: serviceType.id,
            requiredDocuments: serviceData.requiredDocuments as any,
            formSchema: ensureFormSchema(
              serviceData.formSchema,
              serviceData.name,
              serviceData.description,
            ) as any,
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
