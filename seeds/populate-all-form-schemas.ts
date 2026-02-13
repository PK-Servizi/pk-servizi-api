import 'reflect-metadata';
import { AppDataSource } from '../src/config/data-source';
import { Service } from '../src/modules/services/entities/service.entity';

// Reusable personal information section for all services
const PERSONAL_INFORMATION_SECTION = {
  id: 'personal_information',
  title: 'Informazioni Personali',
  description: 'Your personal and contact information',
  fields: [
    {
      name: 'name',
      label: 'First Name',
      type: 'text',
      required: true,
      order: 1,
      maxLength: 100,
    },
    {
      name: 'surname',
      label: 'Surname',
      type: 'text',
      required: false,
      order: 2,
      maxLength: 100,
    },
    {
      name: 'email',
      label: 'Email',
      type: 'email',
      required: true,
      order: 3,
    },
    {
      name: 'mobile_phone_number',
      label: 'Mobile Phone Number',
      type: 'group',
      required: false,
      order: 4,
      subFields: [
        {
          name: 'country_code',
          label: 'Country Code',
          type: 'select',
          options: ['+39', '+1', '+44', '+49', '+33', '+34'],
          required: false,
        },
        {
          name: 'number',
          label: 'Phone Number',
          type: 'text',
          required: false,
          placeholder: 'e.g., 3201234567',
        },
      ],
    },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: ['Male', 'Female', 'Other', 'Prefer not to say'],
      required: false,
      order: 5,
    },
    {
      name: 'nationality',
      label: 'Nationality',
      type: 'select',
      options: ['Italy', 'EU Member', 'Other'],
      required: true,
      order: 6,
    },
    {
      name: 'date_of_birth',
      label: 'Date of Birth',
      type: 'date',
      required: false,
      order: 7,
    },
    {
      name: 'place_of_birth',
      label: 'Place of Birth',
      type: 'group',
      required: false,
      order: 8,
      subFields: [
        {
          name: 'country_selection',
          label: 'Country',
          type: 'select',
          options: ['Italy', 'EU Member', 'World'],
          required: false,
        },
      ],
    },
    {
      name: 'current_residence',
      label: 'Current Residence',
      type: 'group',
      required: true,
      order: 9,
      subFields: [
        {
          name: 'country',
          label: 'Country',
          type: 'select',
          options: ['Italy', 'EU Member', 'Other'],
          required: true,
        },
        {
          name: 'province',
          label: 'Province',
          type: 'text',
          required: false,
        },
        {
          name: 'city',
          label: 'City',
          type: 'text',
          required: false,
        },
        {
          name: 'address',
          label: 'Street Address',
          type: 'text',
          required: false,
        },
        {
          name: 'house_number',
          label: 'House Number',
          type: 'text',
          required: false,
        },
        {
          name: 'postal_code',
          label: 'Postal Code',
          type: 'text',
          required: false,
          maxLength: 5,
        },
      ],
    },
  ],
};

// Default form schemas by service code
const DEFAULT_FORM_SCHEMAS: { [key: string]: any } = {
  // ISEE Services
  ISEE_ORD_2026: {
    title: 'ISEE Ordinario 2026',
    description: 'Indicatore della Situazione Economica Equivalente - Ordinary Income Indicator Form 2026',
    sections: [
      PERSONAL_INFORMATION_SECTION,
      {
        id: 'family_information',
        title: 'Informazioni Familiari',
        fields: [
          {
            name: 'family_members',
            label: 'Family Members',
            type: 'dynamic_list',
            required: true,
            order: 1,
            subFields: [
              { name: 'name', label: 'Name', type: 'text', required: true },
              { name: 'tax_code', label: 'Tax Code', type: 'text', required: true },
              { name: 'relationship', label: 'Relationship', type: 'select', options: ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'], required: true },
            ],
          },
        ],
      },
    ],
  },
  ISEE_UNIV_2026: {
    title: 'ISEE Universitario 2026',
    description: 'ISEE Form for University Students 2026',
    sections: [
      PERSONAL_INFORMATION_SECTION,
      {
        id: 'student_information',
        title: 'Informazioni Studente',
        fields: [
          {
            name: 'university_name',
            label: 'University Name',
            type: 'text',
            required: true,
            order: 1,
          },
          {
            name: 'degree_course',
            label: 'Degree Course',
            type: 'text',
            required: true,
            order: 2,
          },
        ],
      },
    ],
  },
  ISEE_SOCIO_2026: {
    title: 'ISEE Sociosanitario 2026',
    description: 'ISEE Form for Socio-Sanitary Services 2026',
    sections: [
      PERSONAL_INFORMATION_SECTION,
      {
        id: 'beneficiary_information',
        title: 'Beneficiary Information',
        fields: [
          {
            name: 'health_condition',
            label: 'Health Condition',
            type: 'text',
            required: true,
            order: 1,
          },
          {
            name: 'medical_certificate',
            label: 'Medical Certificate',
            type: 'file',
            required: true,
            order: 2,
          },
        ],
      },
    ],
  },
  ISEE_MINOR_2026: {
    title: 'ISEE Minorile 2026',
    description: 'ISEE Form for Minor Children 2026',
    sections: [
      PERSONAL_INFORMATION_SECTION,
      {
        id: 'child_information',
        title: 'Child Information',
        fields: [
          {
            name: 'child_full_name',
            label: 'Child Full Name',
            type: 'text',
            required: true,
            order: 1,
          },
          {
            name: 'child_tax_code',
            label: 'Child Tax Code',
            type: 'text',
            required: true,
            order: 2,
          },
        ],
      },
    ],
  },
  ISEE_CORRENTE: {
    title: 'ISEE Corrispettivo 2026',
    description: 'Corrective ISEE Form 2026',
    sections: [
      PERSONAL_INFORMATION_SECTION,
      {
        id: 'change_information',
        title: 'Change of Circumstances',
        fields: [
          {
            name: 'reason_for_change',
            label: 'Reason for Change',
            type: 'select',
            options: ['Employment', 'Income', 'Family Structure', 'Property', 'Other'],
            required: true,
            order: 1,
          },
        ],
      },
    ],
  },
  NASPI: {
    title: 'NASPI 2026',
    description: 'Application for New Social Safety Net (Nuova Assicurazione Sociale per l\'Disoccupazione)',
    sections: [
      PERSONAL_INFORMATION_SECTION,
      {
        id: 'employment_history',
        title: 'Employment History',
        fields: [
          {
            name: 'last_employer',
            label: 'Last Employer Name',
            type: 'text',
            required: true,
            order: 1,
          },
          {
            name: 'employment_end_date',
            label: 'Employment End Date',
            type: 'date',
            required: true,
            order: 2,
          },
        ],
      },
    ],
  },
  DISOC_AGRICOLA: {
    title: 'Disoccupazione Agricola 2026',
    description: 'Agricultural Unemployment Benefit Application 2026',
    sections: [
      PERSONAL_INFORMATION_SECTION,
      {
        id: 'agricultural_info',
        title: 'Agricultural Information',
        fields: [
          {
            name: 'years_of_experience',
            label: 'Years of Agricultural Experience',
            type: 'number',
            required: true,
            order: 1,
          },
        ],
      },
    ],
  },
};

// Generic form schema for any service without specific schema
function createGenericFormSchema(serviceName: string): any {
  return {
    title: serviceName,
    description: `Form for ${serviceName}`,
    sections: [
      PERSONAL_INFORMATION_SECTION,
      {
        id: 'service_information',
        title: 'Service Information',
        fields: [
          {
            name: 'service_request_reason',
            label: 'Reason for Request',
            type: 'textarea',
            required: false,
            order: 1,
          },
          {
            name: 'additional_documents',
            label: 'Additional Documents',
            type: 'file',
            required: false,
            order: 2,
          },
        ],
      },
    ],
  };
}

async function populateAllFormSchemas() {
  console.log('\n📋 Populating Form Schemas for ALL Services...\n');

  try {
    await AppDataSource.initialize();
    console.log('✅ Database connection established\n');

    const serviceRepo = AppDataSource.getRepository(Service);

    // Get all services
    const allServices = await serviceRepo.find();
    console.log(`📊 Found ${allServices.length} services in database\n`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const service of allServices) {
      // Check if service already has a form schema
      if (service.formSchema && Object.keys(service.formSchema).length > 0) {
        skippedCount++;
        console.log(`⏭️  ${service.code} - Already has form schema`);
        continue;
      }

      // Get form schema based on service code
      let formSchema = DEFAULT_FORM_SCHEMAS[service.code];

      // If no specific schema exists, create a generic one
      if (!formSchema) {
        formSchema = createGenericFormSchema(service.name);
      }

      // Update service with form schema
      service.formSchema = formSchema;
      await serviceRepo.save(service);

      console.log(`✅ ${service.code} - Form schema added (${formSchema.sections.length} sections)`);
      updatedCount++;
    }

    console.log('\n' + '━'.repeat(80));
    console.log('\n📈 SUMMARY:\n');
    console.log(`   ✅ Services Updated: ${updatedCount}`);
    console.log(`   ⏭️  Services Skipped: ${skippedCount}`);
    console.log(`   📊 Total Services: ${allServices.length}`);
    console.log('\n✅ All services form schemas populated successfully!\n');

    await AppDataSource.destroy();
  } catch (error) {
    console.error('\n❌ Error populating form schemas:', error);
    process.exit(1);
  }
}

populateAllFormSchemas();
