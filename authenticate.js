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

const merge = require('merge');

/**
 * [authenticate description]
 * @param  {object}   opt  options object created from xim_instance() with the additional
 *                    options to perform xim_authenticate, refer to corresponding
 *                    documents for the details
 * @param  {Function} callback callback to be used by the XIM driver
 */
function authenticate(opt, callback) {
  const callback_opt = merge({}, opt);

  if (typeof opt.xim_content.access_token === 'undefined') {
    callback_opt.result.err_no = 113;
    callback_opt.result.err_msg = 'No Access Token';
  } else {
    callback_opt.result.err_no = 0;
    callback_opt.result.err_msg = 'ok';
    callback_opt.xim_content.access_token = opt.xim_content.access_token;
  }
  callback(callback_opt);
}

/**
 * functions exporting
 */
module.exports = authenticate;
