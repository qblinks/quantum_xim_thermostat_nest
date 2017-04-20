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

 /**
  * Deactivate this channel
  *
  * @param {object} options object created from xim_instance() with the additional
  *                 options to perform xim_authenticate, refer to corresponding
  *                 documents for the details
  * @param {function} callback to be used by the XIM driver
  */
function unlink(opt, callback) {
  // this is an empty function to be implemented or a place holder
  // const callback_option = JSON.parse(JSON.stringify(options));

  callback(opt);
}

/**
 * functions exporting
 */
module.exports = unlink;
