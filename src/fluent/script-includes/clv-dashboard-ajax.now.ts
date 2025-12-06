import '@servicenow/sdk/global';
import { ScriptInclude } from '@servicenow/sdk/core';

export const CLVDashboardAjax = ScriptInclude({
    $id: Now.ID['CLVDashboardAjax'],
    name: 'CLVDashboardAjax',
    script: Now.include('../../server/script-includes/clv-dashboard-ajax.js'),
    description: 'Ajax processor for CLV Dashboard data fetching',
    apiName: 'x_hete_clvmaximi_0.CLVDashboardAjax',
    clientCallable: true,
    active: true
});