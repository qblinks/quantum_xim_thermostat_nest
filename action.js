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

function arrayContain(arr, obj) {
  return (arr.indexOf(obj) > -1);
}
function isEmpty(obj) {
  if (!obj) {
    return true;
  }
  if (!(typeof (obj) === 'number') && !Object.keys(obj).length) {
    return true;
  }
  return false;
}

function execAction(access_token, isStructure, id, actionBody, actionTemperature, callback) {
  const options = {
    method: 'PUT',
    followAllRedirects: true, // Redirects are turned on by default for GET requests only
    url: `https://developer-api.nest.com/devices/thermostats/${id}`,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    json: true,
    body: actionBody, // body is jsonObject
  };
  if (isStructure) {
    options.url = `https://developer-api.nest.com/structures/${id}`;
  }

  console.log(options.url);
  console.log(options.body);
  request(options, (error, response, body) => {
    console.log(body);
    if (!error && response.statusCode === 200) {
      if (!isEmpty(actionTemperature)) {
        execAction(access_token, false, id, actionTemperature, {}, callback);
        return;
      }
      callback(true);
    } else {
      callback(body);
    }
  });
}


/**
 * [action description]
 * @param  {object} opt thermostat action properties
 * @return {bool}        seccess or fail
 */
function action(opt, callback) {
  const callback_opt = JSON.parse(JSON.stringify(opt));
  delete callback_opt.device_id;
  delete callback_opt.action;

  callback_opt.result = {};
  if (typeof opt.xim_content === 'undefined') {
    callback_opt.result.err_no = 999;
    callback_opt.result.err_msg = 'xim_content not exist.';
  } else if (typeof opt.xim_content.access_token === 'undefined') {
    callback_opt.result.err_no = 999;
    callback_opt.result.err_msg = 'Access token not exist.';
  // } else if (typeof opt.xim_content.structures === 'undefined') {
  //   callback_opt.result.err_no = 999;
  //   callback_opt.result.err_msg = 'Please redo discovery.';
  } else {
    // restructure action array, properties key may be different.
    // mode -> hvac_mode
    // homeaway -> away, set in isStructure
    // swith mode before set temperature, do double request
    const actionBody = {};
    let actionTemperature = {};
    let isStructure = false;
    if (typeof opt.action.homeaway !== 'undefined') {
      // if there is homeaway in action, set to structure api
      actionBody.away = opt.action.homeaway;
      isStructure = true;
    } else if (typeof opt.action.mode !== 'undefined') {
      actionBody.hvac_mode = opt.action.mode;
    } else if (typeof opt.action.heat !== 'undefined') {
      actionBody.hvac_mode = 'heat';
      actionTemperature = opt.action.heat;
      // Object.assign(actionBody, opt.action.heat);
    } else if (typeof opt.action.cool !== 'undefined') {
      actionBody.hvac_mode = 'cool';
      actionTemperature = opt.action.cool;
      // Object.assign(actionBody, opt.action.cool);
    } else if (typeof opt.action['heat-cool'] !== 'undefined') {
      actionBody.hvac_mode = 'heat-cool';
      actionTemperature = opt.action['heat-cool'];
      // Object.assign(actionBody, opt.action['heat-cool']);
    } else if (typeof opt.action.eco !== 'undefined') {
      actionBody.hvac_mode = 'eco';
      // target_temperature_ -> eco_temperature_
      let str_action = JSON.stringify(opt.action.eco);
      str_action = str_action.replace('target', 'eco', 'gi');
      actionTemperature = JSON.parse(str_action);
    } else if (typeof opt.action.fan_timer_duration !== 'undefined') {
      if (opt.action.fan_timer_duration === 0) {
        actionBody.fan_timer_active = false;
      } else if (arrayContain([15, 30, 45, 60, 120, 240, 480, 960],
         opt.action.fan_timer_duration)) {
        actionBody.fan_timer_duration = opt.action.fan_timer_duration;
        actionBody.fan_timer_active = true;
      } else {
        callback_opt.result.err_no = 2;
        callback_opt.result.err_msg = 'Fan duration can only be set to 15, 30, 45, 60, 120, 240, 480, or 960.';
      }
    }

    if (isEmpty(actionBody)) {
      if (typeof callback_opt.result.err_no === 'undefined') {
        callback_opt.result.err_no = 2;
        callback_opt.result.err_msg = 'Error input.';
      }
    } else {
      execAction(opt.xim_content.access_token, isStructure, opt.device_id,
        actionBody, actionTemperature, (result) => {
          if (result === true) {
            callback_opt.result.err_no = 0;
            callback_opt.result.err_msg = 'ok';
          } else {
            callback_opt.result.err_no = 1;
            if (result !== 'undefined' && result.error !== 'undefined') {
              callback_opt.result.err_msg = result.error;
            } else {
              callback_opt.result.err_msg = 'Request failed.';
            }
          }
          callback(callback_opt);
        });
      return;
    }
  }
  callback(callback_opt);
}

/**
 * functions exporting
 */
module.exports = action;
