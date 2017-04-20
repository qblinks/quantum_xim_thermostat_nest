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
 * [action description]
 * @param  {object} option Light action properties
 * @return {bool}        seccess or fail
 */
function action(options, callback) {
  // this is an empty function to be implemented or a place holder
  const callback_options = merge(options, {
    result: {
      err_no: 0,
      err_msg: '',
    },
  });

  delete callback_options.action;

  callback(callback_options);
}

/**
 * functions exporting
 */
module.exports = action;
