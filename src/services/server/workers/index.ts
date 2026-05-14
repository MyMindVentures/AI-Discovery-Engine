import { createSearchWorker } from './searchWorker';
import { createEnrichmentWorker } from './enrichmentWorker';
import { createExportWorker } from './exportWorker';
import { createMonitoringWorker } from './monitoringWorker';

export function initWorkers() {
  console.log('Initializing background workers...');
  
  createSearchWorker();
  createEnrichmentWorker();
  createExportWorker();
  createMonitoringWorker();

  console.log('Workers initialized.');
}
