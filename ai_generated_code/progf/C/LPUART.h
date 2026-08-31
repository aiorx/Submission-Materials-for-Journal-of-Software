#include "S32K144.h"


//Universal LPUART initialization
//Aided using common development resources
void LPUART_init(LPUART_Type *lpuart, uint32_t, uint32_t);

//LPUART0 specific functions adapted from S32K1xx Cookbook
void LPUART0_init(void);
void LPUART0_send_string(const char *);

//LPUART1 specific functions from S32K1xx Cookbook
void LPUART1_init(void);
void LPUART1_transmit_char(char);
void LPUART1_transmit_string(char[]);
char LPUART1_receive_char(void);
void LPUART1_receive_and_echo_char(void);


//Universal LPUART system print
//ChatGPT generated
void LPUART_send_string(LPUART_Type *, const char *);
