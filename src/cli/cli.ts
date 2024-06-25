#!/usr/bin/env node
import { Command } from 'commander';
import { startServer } from '../server/server';

export function runCLI() {
  const program = new Command();

  program
    .version('1.0.0')
    .option('-p, --prisma', 'Run with Prisma ORM')
    .parse(process.argv);

  const options = program.opts();

  type ORMType = 'prisma' | 'drizzle' | 'other';

  let ormType: ORMType = 'other';
  if (options.prisma) ormType = 'prisma';
  else if (options.drizzle) ormType = 'drizzle';
  else if (options.orm) ormType = options.orm as ORMType;

  startServer(ormType);
}

runCLI();
