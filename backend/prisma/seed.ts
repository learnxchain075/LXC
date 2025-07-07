import { PrismaClient, TaskStatus, TaskPriority, IssueType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  for (let p = 1; p <= 5; p++) {
    const project = await prisma.project.create({
      data: {
        name: `Sample Project ${p}`,
        createdBy: 'seed-user',
      },
    });

    await prisma.sprint.createMany({
      data: [
        {
          name: 'Sprint 1',
          startDate: new Date(),
          endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          projectId: project.id,
        },
        {
          name: 'Sprint 2',
          startDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          projectId: project.id,
        },
      ],
    });

    for (let t = 1; t <= 4; t++) {
      await prisma.task.create({
        data: {
          title: `Task ${t} for project ${p}`,
          description: 'Seed task',
          projectId: project.id,
          createdById: 'seed-user',
          status: TaskStatus.OPEN,
          priority: TaskPriority.MEDIUM,
          issueType: IssueType.TASK,
        },
      });
    }
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
