```c
#ifndef CONF_GENERAL_H_
#define CONF_GENERAL_H_

// Firmware version
#define FW_VERSION_MAJOR			5
#define FW_VERSION_MINOR			01
// Set to 0 for building a release and iterate during beta test builds
#define FW_TEST_VERSION_NUMBER		0

#include "datatypes.h"

// Settings and parameters to override
//#define VIN_R1						33000.0
//#define VIN_R1						39200.0
//#define VIN_R2						2200.0
//#define CURRENT_AMP_GAIN			10.0
//#define CURRENT_SHUNT_RES			0.005
//#define WS2811_ENABLE				1
//#define WS2811_TEST					1
//#define CURR1_DOUBLE_SAMPLE			0
//#define CURR2_DOUBLE_SAMPLE			0
//#define AS5047_USE_HW_SPI_PINS		1

// Disable hardware limits on configuration parameters
//#define DISABLE_HW_LIMITS

/*
 * Select only one hardware version, if it is not passed
 * as an argument.
 */
#if !defined(HW_SOURCE) && !defined(HW_HEADER)
//#define HW_SOURCE "hw_40.c"
//#define HW_HEADER "hw_40.h"

//#define HW_SOURCE "hw_45.c"
//#define HW_HEADER "hw_45.h"

//#define HW_SOURCE "hw_46.c" // Also for 4.7
//#define HW_HEADER "hw_46.h" // Also for 4.7

//#define HW_SOURCE "hw_48.c"
//#define HW_HEADER "hw_48.h"

//#define HW_SOURCE "hw_49.c"
//#define HW_HEADER "hw_49.h"

//#define HW_SOURCE "hw_410.c" // Also for 4.11 and 4.12
//#define HW_HEADER "hw_410.h" // Also for 4.11 and 4.12

// Benjamins first HW60 PCB with PB5 and PB6 swapped
//#define HW60_VEDDER_FIRST_PCB

// Mark3 version of HW60 with power switch and separate NRF UART.
//#define HW60_IS_MK3
//#define HW60_IS_MK4

//#define HW_SOURCE "hw_60.c"
//#define HW_HEADER "hw_60.h"

//#define HW_SOURCE "hw_r2.c"
//#define HW_HEADER "hw_r2.h"

//#define HW_SOURCE "hw_victor_r1a.c"
//#define HW_HEADER "hw_victor_r1a.h"

//#define HW_SOURCE "hw_das_rs.c"
//#define HW_HEADER "hw_das_rs.h"

//#define HW_SOURCE "hw_axiom.c"
//#define HW_HEADER "hw_axiom.h"

//#define HW_SOURCE "hw_luna_bbshd.c"
//#define HW_HEADER "hw_luna_bbshd.h"

//#define HW_SOURCE "hw_rh.c"
//#define HW_HEADER "hw_rh.h"

//#define HW_SOURCE "hw_tp.c"
//#define HW_HEADER "hw_tp.h"

// Benjamins first HW75_300 PCB with different LED pins and motor temp error
//#define HW75_300_VEDDER_FIRST_PCB

// Second revision with separate UART for NRF51
//#define HW75_300_REV_2
//#define HW75_300_REV_3

//#define HW_SOURCE "hw_75_300.c"
//#define HW_HEADER "hw_75_300.h"

//#define HW_SOURCE "hw_mini4.c"
//#define HW_HEADER "hw_mini4.h"

//#define HW_SOURCE "hw_das_mini.c"
//#define HW_HEADER "hw_das_mini.h"

//#define HW_SOURCE "hw_uavc_qcube.c"
//#define HW_HEADER "hw_uavc_qcube.h"

//#define HW_SOURCE "hw_uavc_omega.c"
//#define HW_HEADER "hw_uavc_omega.h"

//#define HW_SOURCE "hw_binar_v1.c"
//#define HW_HEADER "hw_binar_v1.h"

//#define HW_SOURCE "hw_hd.c"
//#define HW_HEADER "hw_hd.h"

//#define HW_SOURCE "hw_a200s_v2.c"
//#define HW_HEADER "hw_a200s_v2.h"

//#define HW_SOURCE "hw_rd2.c"
//#define HW_HEADER "hw_rd2.h"

//#define HW_SOURCE "hw_100_250.c"
//#define HW_HEADER "hw_100_250.h"

//#define HW_SOURCE "hw_unity.c"
//#define HW_HEADER "hw_unity.h"

//#define HW_DUAL_CONFIG_PARALLEL
//#define HW_SOURCE "hw_stormcore_100d.c"
//#define HW_HEADER "hw_stormcore_100d.h"

//#define HW_SOURCE "hw_stormcore_60d.c"
//#define HW_HEADER "hw_stormcore_60d.h"
//
//#define HW_SOURCE "hw_st
#endif

#endif /* CONF_GENERAL_H_ */
```