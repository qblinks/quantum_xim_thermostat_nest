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
      Authorization: `Bearer ${access_token}`,
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
 * for xim interface
 * @param  {object}   opt input xim_content
 * @param  {Function} callback return thermostat list
 */
function discovery(opt, callback) {
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
    get_devices(opt.xim_content.access_token, (result) => {
      if (result === false) {
        callback_opt.result.err_no = 1;
        callback_opt.result.err_msg = 'Request failed.';
      } else {
        callback_opt.result.err_no = 0;
        callback_opt.result.err_msg = 'ok';
        callback_opt.list = [];
        // callback_opt.groups = [];
        // callback_opt.xim_content.structures = [];
        // callback_opt.xim_content.device_structure_map = {};

        const thermostats = result.devices.thermostats;
        const structures = result.structures;

        // parse devices.thermostats
        Object.keys(thermostats).forEach((device_id) => {
          const thermostat = {};
          thermostat.is_group = false;
          thermostat.device_id = device_id;
          thermostat.device_name = thermostats[device_id].name;
          thermostat.heat_support = thermostats[device_id].can_heat;
          thermostat.cool_support = thermostats[device_id].can_cool;
          thermostat.fan_control_support = thermostats[device_id].has_fan;
          // software >= 5.6 support eco
          thermostat.eco_support = thermostats[device_id].software_version.substring(0, 3) >= 5.6;
          thermostat.status = {};
          thermostat.status.ambient_temperature_f = thermostats[device_id].ambient_temperature_f;
          thermostat.status.targeted_temperature_f = thermostats[device_id].target_temperature_f;
          thermostat.status.ambient_temperature_c = thermostats[device_id].ambient_temperature_c;
          thermostat.status.targeted_temperature_c = thermostats[device_id].target_temperature_c;
          thermostat.status.ambient_humidity = thermostats[device_id].humidity;
          thermostat.status.fan = thermostats[device_id].has_fan;
          thermostat.status.fan_timer = thermostats[device_id].fan_timer_active;
          thermostat.status.fan_timer_timeout = thermostats[device_id].fan_timer_timeout;
          thermostat.status.mode = thermostats[device_id].hvac_mode;
          thermostat.status.homeaway = structures[thermostats[device_id].structure_id].away;
          // action support
          thermostat.action_support = {};
          const mode = ['off'];
          if(thermostat.eco_support){
            mode.push('eco');
            thermostat.action_support.eco = {
              target_temperature_high_f: true,
              target_temperature_low_f: true,
              target_temperature_high_c: true,
              target_temperature_low_c: true,
            };
          }
          if (thermostat.heat_support === true) {
            mode.push('heat');
            thermostat.action_support.heat = {
              target_temperature_f: true,
              target_temperature_c: true,
            };
            if (thermostat.cool_support === true) {
              mode.push('cool');
              thermostat.action_support.cool = {
                target_temperature_f: true,
                target_temperature_c: true,
              };
              mode.push('heat-cool');
              thermostat.action_support['heat-cool'] = {
                target_temperature_high_f: true,
                target_temperature_low_f: true,
                target_temperature_high_c: true,
                target_temperature_low_c: true,
              };
            }
          } else if (thermostat.cool_support === true) {
            mode.push('cool');
            thermostat.action_support.cool = {
              target_temperature_f: true,
              target_temperature_c: true,
            };
          }
          thermostat.action_support.mode = mode;

          // save device_id and structure_id map in xim_content
          // callback_opt.xim_content.device_structure_map[device_id] =
          // thermostats[device_id].structure_id;
          callback_opt.list.push(thermostat);
        });
        // parse structures to list with is_group true
        Object.keys(structures).forEach((structure_id) => {
          const structure = {};
          structure.is_group = true;
          structure.device_id = structure_id;
          structure.device_name = structures[structure_id].name;
          structure.action_support = {};
          structure.action_support.homeaway = ['home', 'away'];
          // structure.group_id = structure_id;
          // structure.group_name = structures[structure_id].name;

          callback_opt.list.push(structure);
          // save structure ids for differentiate structure and device
          // callback_opt.xim_content.structures.push(structure_id);
        });
      }
      callback(callback_opt);
    });
    return;
  }
  callback(callback_opt);
}

/**
 * functions exporting
 */
module.exports = discovery;
