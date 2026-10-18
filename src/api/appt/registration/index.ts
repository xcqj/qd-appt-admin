import type { RegistrationForm, RegistrationQuery, RegistrationVO } from '@/api/appt/registration/types';
import type { PageResult } from '@/api/types';
import type { AxiosPromise } from '@/utils/api-types';
import request from '@/utils/request';

/**
 * 查询挂号单列表
 * @param query
 * @returns {*}
 */
export const listRegistration = (query?: RegistrationQuery): AxiosPromise<PageResult<RegistrationVO>> => {
  return request({
    url: '/appt/admin/registration/list',
    method: 'get',
    params: query
  });
};

/**
 * 查询挂号单详细
 * @param id
 */
export const getRegistration = (id: string | number): AxiosPromise<RegistrationVO> => {
  return request({
    url: '/appt/admin/registration/' + id,
    method: 'get'
  });
};

/**
 * 新增挂号单
 * @param data
 */
export const addRegistration = (data: RegistrationForm) => {
  return request({
    url: '/appt/admin/registration',
    method: 'post',
    data: data
  });
};

/**
 * 修改挂号单
 * @param data
 */
export const updateRegistration = (data: RegistrationForm) => {
  return request({
    url: '/appt/admin/registration',
    method: 'put',
    data: data
  });
};



/**
 * 删除挂号单
 * @param id
 */
export const delRegistration = (id: string | number | Array<string | number>) => {
  return request({
    url: '/appt/admin/registration/' + id,
    method: 'delete'
  });
};
