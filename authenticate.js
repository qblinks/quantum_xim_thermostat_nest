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

/**
 * [authenticate description]
 * @param  {object}   opt  options object created from xim_instance() with the additional
 *                    options to perform xim_authenticate, refer to corresponding
 *                    documents for the details
 * @param  {Function} callback callback to be used by the XIM driver
 */
function authenticate(opt, callback) {
  const options = {
    method: 'GET',
    url: `${process.env.auth_url}/token/nest/${opt.xim_channel_set}`,
    headers: {
      Authorization: `Bearer ${opt.quantum_token}`,
    },
  };
  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    else {
      const callback_opt = opt;
      callback_opt.result = {};
      callback_opt.xim_content = {};

      const resultJson = JSON.parse(body);
      if (resultJson.result === true) {
        callback_opt.result.err_no = 0;
        callback_opt.result.err_msg = 'ok';
        // console.log(resultJson.access_token);
        callback_opt.xim_content.access_token = resultJson.access_token;
      } else {
        callback_opt.result.err_no = 999;
        callback_opt.result.err_msg = 'No available token.';
      }
      callback(callback_opt);
    }
  });
}

/**
 * functions exporting
 */
module.exports = authenticate;
