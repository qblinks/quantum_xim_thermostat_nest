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

function get_devices(access_token, callback) {
  const options = {
    method: 'GET',
    url: 'https://developer-api.nest.com',
    headers: {
      'content-type': 'application/json',
      authorization: `Bearer ${access_token}`,
    },
  };
  request(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      const jsonResponse = JSON.parse(body);
      callback(jsonResponse);
    } else {
      callback(false);
    }
  });
}
 /**
  * Get the stat
  *
  * @param {object} options object created from xim_instance() with the additional
  *                 options added by xim_authenticate, refer to corresponding
  *                 documents for the details
  * @param {function} callback to be used by the XIM driver
  */
function stat(opt, callback) {
  const callback_opt = opt;

  callback_opt.result = {};
  if (typeof opt.xim_content === 'undefined') {
    callback_opt.result.err_no = 108;
    callback_opt.result.err_msg = 'No XIM Content';
  } else if (typeof opt.xim_content.access_token === 'undefined') {
    callback_opt.result.err_no = 113;
    callback_opt.result.err_msg = 'No Access Token';
  } else {
    get_devices(opt.xim_content.access_token, (result) => {
      if (result === false) {
        callback_opt.result.err_no = 115;
        callback_opt.result.err_msg = 'Request Failed';
      } else {
        const thermostats = result.devices.thermostats;
        const structures = result.structures;

        if (typeof thermostats[opt.device_id] === 'undefined') {
          callback_opt.result.err_no = 114;
          callback_opt.result.err_msg = 'Device Not Exists';
        } else {
          callback_opt.result.err_no = 0;
          callback_opt.result.err_msg = 'ok';

          callback_opt.list = [];
          const thermostat = {};
          thermostat.is_group = false;
          thermostat.device_id = opt.device_id;
          thermostat.device_name = thermostats[opt.device_id].name;
          thermostat.heat_support = thermostats[opt.device_id].can_heat;
          thermostat.cool_support = thermostats[opt.device_id].can_cool;
          thermostat.fan_control_support = thermostats[opt.device_id].has_fan;
          // thermostat.eco_support = thermostats[device_id].
          thermostat.status = {};
          thermostat.status.ambient_temperature_f =
           thermostats[opt.device_id].ambient_temperature_f;
          thermostat.status.targeted_temperature_f =
           thermostats[opt.device_id].target_temperature_f;
          thermostat.status.ambient_temperature_c =
           thermostats[opt.device_id].ambient_temperature_c;
          thermostat.status.targeted_temperature_c =
           thermostats[opt.device_id].target_temperature_c;
          thermostat.status.ambient_humidity = thermostats[opt.device_id].humidity;
          thermostat.status.fan = thermostats[opt.device_id].has_fan;
          thermostat.status.fan_timer = thermostats[opt.device_id].fan_timer_active;
          thermostat.status.fan_timer_timeout = thermostats[opt.device_id].fan_timer_timeout;
          thermostat.status.mode = thermostats[opt.device_id].hvac_mode;
          thermostat.status.homeaway = structures[thermostats[opt.device_id].structure_id].away;

          callback_opt.list.push(thermostat);
        }
      }
      delete callback_opt.device_id;
      callback(callback_opt);
    });
    return;
  }
  delete callback_opt.device_id;
  callback(callback_opt);
}


/**
 * functions exporting
 */
module.exports = stat;
