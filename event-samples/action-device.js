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

const xim_config = require('../.xim_config.js');

const my_quantum_token = xim_config.quantum_token;
const my_device_id = xim_config.device_id;

module.exports = {
  method: 'action',
  xim_type: 'thermostat',
  xim_channel: 'nest',
  xim_channel_set: 0,
  quantum_token: my_quantum_token,
  device_id: my_device_id,
  action: {
    fan_timer_duration: 0,
    // mode: 'off',
    // cool: {
    //   target_temperature_c: 25,
    // },
  },
};
