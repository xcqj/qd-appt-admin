import type { DashboardVO } from '@/api/appt/dashboard/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询数据看板（7 项今日指标 + 科室 TOP5）
 */
export const getDashboard = (): AxiosPromise<DashboardVO> => {
  return request({
    url: '/appt/admin/dashboard',
    method: 'get'
  });
};
