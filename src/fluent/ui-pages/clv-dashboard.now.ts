import '@servicenow/sdk/global';
import { UiPage } from '@servicenow/sdk/core';
import dashboardPage from '../../client/index.html';

export const clv_dashboard = UiPage({
  $id: Now.ID['clv-dashboard'],
  endpoint: 'x_hete_clvmaximi_0_clv_dashboard.do',
  html: dashboardPage,
  direct: true
});