
import { initializeDefaultChannels } from './controllers/communityFirebaseController.js';
import { initializePostScheduler } from './services/postScheduler.js';
import { initJobFetcher } from './services/jobFetcher.js';
import JobAlert from './models/JobAlert.model.js';
import {
  scheduleWeeklyDigest,
  initializeDigestQueue,
  startDigestWorker
} from './services/weeklyDigestService.js';
import { startOutreachWorker } from './services/outreachQueue.js';
import { initializeSocket } from './config/socket.js';

export async function initializeServices(httpServer) {
  try {
    await initializeDefaultChannels();
    console.log('💬 Community channels initialized');
  } catch (channelError) {
    console.warn('⚠️ Could not initialize default channels:', channelError.message);
  }

  try {
    await initializePostScheduler();
  } catch (schedulerError) {
    console.warn('⚠️ Post scheduler initialization skipped:', schedulerError.message);
  }

  const allowDevDbMutations = process.env.ALLOW_DEV_DB_MUTATIONS === 'true';
  if (process.env.NODE_ENV === 'development' && allowDevDbMutations) {
    try {
      const testEmail = process.env.DEV_USER_EMAIL || process.env.EMAIL_USER;
      if (testEmail) {
        const result = await JobAlert.updateMany(
          { userEmail: 'dev@example.com' },
          { $set: { userEmail: testEmail } }
        );
        if (result.modifiedCount > 0) {
          console.log(`📧 Updated ${result.modifiedCount} alerts to use email: ${testEmail}`);
        }
      }
    } catch (err) {
      console.warn('⚠️ Could not update dev alert emails:', err.message);
    }
  } else if (process.env.NODE_ENV === 'development' && !allowDevDbMutations) {
    console.info('ℹ️ Skipping dev alert email update (ALLOW_DEV_DB_MUTATIONS is not true)');
  }

  initializeSocket(httpServer);

  try {
    await initJobFetcher();
  } catch (fetcherError) {
    console.warn('⚠️ Job fetcher initialization skipped:', fetcherError.message);
  }

  try {
    const digestQueueReady = await initializeDigestQueue();
    if (digestQueueReady) {
      startDigestWorker();
    }
    scheduleWeeklyDigest();
  } catch (digestError) {
    console.warn(
      '⚠️ Weekly digest scheduler initialization skipped:',
      digestError.message
    );
  }

  try {
    startOutreachWorker();
  } catch (outreachErr) {
    console.warn('⚠️ Outreach worker initialization skipped:', outreachErr.message);
  }
}
