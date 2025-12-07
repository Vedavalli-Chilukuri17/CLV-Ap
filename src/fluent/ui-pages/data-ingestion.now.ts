import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import dataIngestionPage from '../../client/data-ingestion.html';

export const data_ingestion_page = UiPage({
  $id: Now.ID['data-ingestion-page'],
  endpoint: 'x_hete_clvmaximi_0_data_ingestion.do',
  html: dataIngestionPage,
  direct: true
});