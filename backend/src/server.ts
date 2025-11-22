import app from './app';
import { PORT } from './config';
import prisma from './prisma/client';
import { logger } from './utils/logger';

async function main() {
  try {
    await prisma.$connect();
    app.listen(PORT, () => {
      logger.info(`CaseFlow Backend started on port ${PORT}`);
    });
  } catch (err) {
    logger.error(err);
    process.exit(1);
  }
}

main();
