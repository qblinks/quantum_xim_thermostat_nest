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

function execAction(access_token, isStructure, id, actionBody, callback) {
  const options = {
    method: 'PUT',
    followAllRedirects: true, // Redirects are turned on by default for GET requests only
    url: `https://developer-api.nest.com/devices/thermostats/${id}`,
    headers: {
      'content-type': 'application/json',
      Authorization: `Bearer ${access_token}`,
    },
    json: true,
    // body: actionBody, // body is jsonObject
  };
  if (isStructure) {
    options.url = `https://developer-api.nest.com/structures/${id}`;
    options.body = { away: actionBody.homeaway };
  } else {
    const deviceActionBody = actionBody;
    delete deviceActionBody.homeaway;
    options.body = deviceActionBody;
  }
  console.log(options.url);
  console.log(options.body);
  request(options, (error, response, body) => {
    console.log(body);
    if (!error && response.statusCode === 200) {
      callback(true);
    } else {
      callback(body);
    }
  });
}

function arrayContain(arr, obj) {
  return (arr.indexOf(obj) > -1);
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
  if (typeof callback_opt.xim_content === 'undefined') {
    callback_opt.result.err_no = 999;
    callback_opt.result.err_msg = 'xim_content not exist.';
  } else if (typeof callback_opt.xim_content.access_token === 'undefined') {
    callback_opt.result.err_no = 999;
    callback_opt.result.err_msg = 'Access token not exist.';
  } else if (typeof callback_opt.xim_content.structures === 'undefined') {
    callback_opt.result.err_no = 999;
    callback_opt.result.err_msg = 'Please redo discovery.';
  } else {
    // restructure action array, properties key may be different.
    // mode -> hvac_mode
    // homeaway -> away, set in isStructure
    if (typeof callback_opt.action.mode !== 'undefined') {
      callback_opt.action.hvac_mode = callback_opt.action.mode;
      delete callback_opt.action.mode;
    }
    execAction(callback_opt.xim_content.access_token,
      arrayContain(callback_opt.xim_content.structures, callback_opt.device_id),
      callback_opt.device_id, callback_opt.action, (result) => {
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
        delete callback_opt.device_id;
        delete callback_opt.action;
        callback(callback_opt);
      });
    return;
  }
  delete callback_opt.device_id;
  delete callback_opt.action;
  callback(callback_opt);
}

/**
 * functions exporting
 */
module.exports = action;
