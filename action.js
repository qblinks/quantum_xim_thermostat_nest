/*
 * Copyright (c) 2017
 * Qblinks Incorporated ("Qblinks").
 * All rights reserved.
 *
 * The information contained herein is confidential and proprietary to
 * Qblinks. Use of this information by anyone other than authorized employees
 * of Qblinks is granted only under a written non-disclosure agreement,
 * expressly prescribing the scope and manner of such use.
 */

'use strict';

const request = require('request');

function actionDevice(access_token, device_id, device_action, callback) {
  const option_device = {
    method: 'PUT',
    url: `https://developer-api.nest.com/devices/thermostats/${device_id}`,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${access_token}`,
    },
    // json: true,
    body: device_action,
  };

  request(option_device, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const jsonResponse = JSON.parse(body);
      callback(jsonResponse);
    } else {
      callback(false);
    }
  });
}

function actionStructure(access_token, structure_id, structure_action) {
  const option_structure = {
    method: 'PUT',
    url: `https://developer-api.nest.com/structures/${structure_id}`,
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${access_token}`,
    },
    // json: true,
    body: structure_action,
  };

  request(option_structure, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      console.log(body);
      // const jsonResponse = JSON.parse(body);
      // callback(jsonResponse);
    }
    // else {
    //   callback(false);
    // }
  });
}

/**
 * [action description]
 * @param  {object} opt thermostat action properties
 * @return {bool}        seccess or fail
 */
function action(opt, callback) {
  const callback_opt = opt;
  // console.log(JSON.stringify(opt));
  callback_opt.result = {};
  if (typeof opt.xim_content === 'undefined') {
    callback_opt.result.err_no = 999;
    callback_opt.result.err_msg = 'xim_content not exist.';
  } else if (typeof opt.xim_content.access_token === 'undefined') {
    callback_opt.result.err_no = 999;
    callback_opt.result.err_msg = 'Access token not exist.';
  } else {
    // seperate structure action
    if (opt.action.homeaway !== 'undefined') {
      console.log(`homeaway : ${opt.action.homeaway}`);
      // structure_id
      actionStructure(opt.xim_content.access_token,
         opt.xim_content.device_structure_map[opt.device_id], opt.action.homeaway);
      // delete opt.action.homeaway;
    }
    if (opt.action[0] === 'undefined') {
      actionDevice(opt.xim_content.access_token, opt.device_id, opt.action, (result) => {
        if (result === false) {
          callback_opt.result.err_no = 1;
          callback_opt.result.err_msg = 'Request failed.';
        } else {
          callback_opt.result.err_no = 0;
          callback_opt.result.err_msg = 'ok';
        }
        callback(callback_opt);
      });
    }
  }
  callback(callback_opt);
}

/**
 * functions exporting
 */
module.exports = action;
