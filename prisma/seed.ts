import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Demo Organization
  const org = await prisma.organization.upsert({
    where: { id: 'org_1' },
    update: {},
    create: {
      id: 'org_1',
      name: 'Discovery Demo Corp',
      plan: 'pro',
    },
  });

  // 2. Create Demo User
  const user = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      id: 'u1',
      email: 'alex@example.com',
      name: 'Alex River',
      role: 'platform_admin',
      memberships: {
        create: {
          organizationId: org.id,
          role: 'owner',
        },
      },
    },
  });

  // 3. Create Tags
  const tagNames = ['AI', 'Edge Computing', 'Deep Learning', 'SaaS', 'Sustainability', 'Supply Chain', 'Research', 'Data Engineering', 'Robotics', 'Logistics', 'Hardware', 'FinTech', 'Security', 'Federated Learning', 'BioTech', 'Climate', 'Synthetic Biology'];
  for (const name of tagNames) {
    await prisma.tag.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  // 4. Create Technologies
  const techNames = ['PyTorch', 'Rust', 'WebAssembly', 'NVIDIA TensorRT', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Python', 'Kubernetes', 'DVC', 'Label Studio', 'C++', 'ROS 2', 'Golang', 'Azure', 'TensorFlow', 'Apache Kafka', 'MongoDB', 'React Native', 'Django', 'GraphQL'];
  for (const name of techNames) {
    await prisma.technology.upsert({
      where: { name },
      update: {},
      create: { name, category: 'Tech Stack' },
    });
  }

  // 5. Create Companies
  const companies = [
    {
      id: '1',
      name: 'NeuralWave AI',
      domain: 'neuralwave.ai',
      industry: 'Software Development',
      location: 'Berlin, Germany',
      country: 'Germany',
      city: 'Berlin',
      size: '11-50 employees',
      description: 'Specializing in next-gen neural network optimization for edge devices.',
      status: 'active',
      score: 92,
      confidenceScore: 98,
      tags: ['AI', 'Edge Computing', 'Deep Learning'],
      techs: ['PyTorch', 'Rust', 'WebAssembly', 'NVIDIA TensorRT'],
    },
    {
      id: '2',
      name: 'GreenScale Systems',
      domain: 'greenscale.io',
      industry: 'CleanTech',
      location: 'London, UK',
      country: 'UK',
      city: 'London',
      size: '51-200 employees',
      description: 'Automated sustainability auditing and reporting for enterprise supply chains.',
      status: 'active',
      score: 88,
      confidenceScore: 94,
      tags: ['SaaS', 'Sustainability', 'Supply Chain'],
      techs: ['React', 'Node.js', 'PostgreSQL', 'AWS'],
    },
  ];

  for (const c of companies) {
    const created = await prisma.company.upsert({
      where: { organizationId_domain: { organizationId: org.id, domain: c.domain! } },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        domain: c.domain,
        industry: c.industry,
        location: c.location,
        country: c.country,
        city: c.city,
        size: c.size,
        description: c.description,
        status: c.status,
        score: c.score,
        confidenceScore: c.confidenceScore,
        organizationId: org.id,
      },
    });

    // Link Tags
    for (const tagName of c.tags) {
      const tag = await prisma.tag.findUnique({ where: { name: tagName } });
      if (tag) {
        await prisma.companyTag.upsert({
          where: { companyId_tagId: { companyId: created.id, tagId: tag.id } },
          update: {},
          create: { companyId: created.id, tagId: tag.id },
        });
      }
    }

    // Link techs
    for (const techName of c.techs) {
      const tech = await prisma.technology.findUnique({ where: { name: techName } });
      if (tech) {
        await prisma.companyTechnology.upsert({
          where: { companyId_technologyId: { companyId: created.id, technologyId: tech.id } },
          update: {},
          create: { companyId: created.id, technologyId: tech.id },
        });
      }
    }
  }

  // 6. Create AI Function Configs
  const aiFunctions = [
    { key: 'queryPlanner', name: 'Query Planner', description: 'Plans search strategies' },
    { key: 'companyEnrichment', name: 'Company Enrichment', description: 'Extracts company details' },
    { key: 'feedbackTransformation', name: 'Feedback Transformation', description: 'Cleans up user feedback' },
  ];

  for (const f of aiFunctions) {
    await prisma.aiFunctionConfig.upsert({
      where: { key: f.key },
      update: {},
      create: {
        key: f.key,
        name: f.name,
        description: f.description,
        systemPrompt: `You are a ${f.name} assistant.`,
        userPromptTemplate: 'Analyze: {{input}}',
      },
    });
  }

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
