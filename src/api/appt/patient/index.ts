import type { PatientForm, PatientQuery, PatientVO } from '@/api/appt/patient/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询就诊人列表
 * @param query
 * @returns {*}
 */
export const listPatient = (query?: PatientQuery): AxiosPromise<PageResult<PatientVO>> => {
  return request({
    url: '/appt/admin/patient/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询就诊人详细
 * @param id
 */
export const getPatient = (id: string | number): AxiosPromise<PatientVO> => {
  return request({
    url: '/appt/admin/patient/' + id,
    method: 'get'
  });
};

/**
 * 新增就诊人
 * @param data
 */
export const addPatient = (data: PatientForm) => {
  return request({
    url: '/appt/admin/patient',
    method: 'post',
    data: data
  });
};

/**
 * 修改就诊人
 * @param data
 */
export const updatePatient = (data: PatientForm) => {
  return request({
    url: '/appt/admin/patient',
    method: 'put',
    data: data
  });
};



/**
 * 删除就诊人
 * @param id
 */
export const delPatient = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/patient/' + id,
    method: 'delete'
  });
};
