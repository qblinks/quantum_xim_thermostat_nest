/*
 * Copyright (c) 2017
 * Qblinks Incorporated ('Qblinks').
 * All rights reserved.
 *
 * The information contained herein is confidential and proprietary to
 * Qblinks. Use of this information by anyone other than authorized employees
 * of Qblinks is granted only under a written non-disclosure agreement,
 * expressly prescribing the scope and manner of such use.
 */

module.exports = {
  xim_content: {
    $isOptional: true,
    $skip: true,
  },
  xim_type: {
    $in: [
      'thermostat',
    ],
  },
  xim_channel: {
    $in: [
      'nest',
    ],
  },
  xim_channel_set: {
    $isPositiveIntegerOrZero: true,
    $minValue: 0,
    $maxValue: 2,
  },
  quantum_token: {
    $minLength: 1,
    $: {
      $notEmptyString: true,
    },
  },
  device_id: {
  },
  action: {
    mode: {
      $isOptional: true,
      $in: [
        'heat',
        'cool',
        'heat-cool',
        'eco',
        'off',
      ],
    },
    homeaway: {
      $isOptional: true,
      $in: [
        'home',
        'away',
      ],
    },
    heat: {
      $isOptional: true,
      target_temperature_f: {
        $isOptional: true,
        $isInteger: true,
        $minValue: 50,
        $maxValue: 90,
      },
      target_temperature_c: {
        $isOptional: true,
        $minValue: 9,
        $maxValue: 32,
      },
    },
    cool: {
      $isOptional: true,
      target_temperature_f: {
        $isOptional: true,
        $isInteger: true,
        $minValue: 50,
        $maxValue: 90,
      },
      target_temperature_c: {
        $isOptional: true,
        $minValue: 9,
        $maxValue: 32,
      },
    },
    'heat-cool': {
      $isOptional: true,
      target_temperature_high_f: {
        $isOptional: true,
        $isInteger: true,
        $minValue: 50,
        $maxValue: 90,
      },
      target_temperature_low_f: {
        $isOptional: true,
        $isInteger: true,
        $minValue: 50,
        $maxValue: 90,
      },
      target_temperature_high_c: {
        $isOptional: true,
        $minValue: 9,
        $maxValue: 32,
      },
      target_temperature_low_c: {
        $isOptional: true,
        $minValue: 9,
        $maxValue: 32,
      },
    },
    eco: {
      $isOptional: true,
      target_temperature_high_f: {
        $isOptional: true,
        $isInteger: true,
        $minValue: 50,
        $maxValue: 90,
      },
      target_temperature_low_f: {
        $isOptional: true,
        $isInteger: true,
        $minValue: 50,
        $maxValue: 90,
      },
      target_temperature_high_c: {
        $isOptional: true,
        $minValue: 9,
        $maxValue: 32,
      },
      target_temperature_low_c: {
        $isOptional: true,
        $minValue: 9,
        $maxValue: 32,
      },
    },
    fan_timer_duration: {
      $isOptional: true,
      $isPositiveIntegerOrZero: true,
      $minValue: 0,
      $maxValue: 1440,
    },
  },
  locale: {
    $minLength: 1,
    $isOptional: true,
    $: {
      $notEmptyString: true,
    },
  },
};
