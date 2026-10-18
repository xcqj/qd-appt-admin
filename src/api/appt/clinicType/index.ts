import type { ClinicTypeForm, ClinicTypeQuery, ClinicTypeVO } from '@/api/appt/clinicType/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询门诊类型列表
 * @param query
 * @returns {*}
 */
export const listClinicType = (query?: ClinicTypeQuery): AxiosPromise<PageResult<ClinicTypeVO>> => {
  return request({
    url: '/appt/clinicType/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询门诊类型详细
 * @param id
 */
export const getClinicType = (id: string | number): AxiosPromise<ClinicTypeVO> => {
  return request({
    url: '/appt/clinicType/' + id,
    method: 'get'
  });
};

/**
 * 新增门诊类型
 * @param data
 */
export const addClinicType = (data: ClinicTypeForm) => {
  return request({
    url: '/appt/clinicType',
    method: 'post',
    data: data
  });
};

/**
 * 修改门诊类型
 * @param data
 */
export const updateClinicType = (data: ClinicTypeForm) => {
  return request({
    url: '/appt/clinicType',
    method: 'put',
    data: data
  });
};



/**
 * 删除门诊类型
 * @param id
 */
export const delClinicType = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/clinicType/' + id,
    method: 'delete'
  });
};
