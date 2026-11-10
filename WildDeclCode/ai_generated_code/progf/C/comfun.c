/*
 * FILE NAME : comfun.c
 * DEC       : This file contains all the most used fuction definitions.
 */
/*==============INCLUDES=============*/
#include <types.h>
#include <comfun.h>

/*==============INTERNAL=============*/
#ifdef TNG_OWN_MAKE_SUPPORTED
static CPCHAR gsCpCcFileName = "COMFUN.C";
#endif /* #ifndef TNG_OWN_MAKE_SUPPORTED */

/*===============MACROS==============*/

/*======Structures and Enums=========*/

/*=============DEFINITIONS===========*/
/*
 * API NAME: GetIntegerAsInput 
 * DES: If user gives even sting as input avoid those chars and stores only integer.
 * Confession : This code is taken Adapted from standard coding samples and not written on own.
 */
UINT32 OS_GetIntegerInput ( VOID )
{
    char input[20]; // Buffer to hold input
    int index = 0;
    char ch;

    while (1) 
    {
        ch = getch(); // Get a character
        // Enter key
        if ('\r' == ch ) 
        { 
            break;
        }
        else if (ch == 8) 
        { // Backspace key
            if (index > 0) {
                index--;
                printf("\b \b"); // Erase character on console
            }
        } 
        else if ((ch >= '0' && ch <= '9') && index < 19) 
        { // Check if character is a digit
            input[index++] = ch; // Store character
            putchar(ch); // Echo the character
        }
    }
    
    input[index] = '\0'; // Null-terminate the string
    return atoi(input); // Convert string to integer
}

/*
 * API NAME: Logging the prints
 * DES: Common interface API to log the prints to console, file and IP.
 *      Version 1 :: only routes to console.
 */
INT32 OS_MessageLogging ( const PCHAR CpcFormat, ... )
{
    CHAR    acLogBuffer [ OS_LOG_MSG_MAX + 1 ];
    CHAR    acDateBuffer [ OS_TIME_STAMP_MAX + 1 ];
    CHAR    acLogBufferWithDate [ OS_LOG_MSG_MAX + OS_TIME_STAMP_MAX + 1 ];
    INT32   i32InLength;

    /* Initializes the argument list */
    va_list args;
    va_start ( args, CpcFormat );
    
    /* copies to the buffer so that it can either be routed via desirable formats. */
    vsnprintf ( acLogBuffer, sizeof ( acLogBuffer ), CpcFormat, args );

    /* Get the current real time */
    OS_GetCurrentDateTime ( acDateBuffer );

    /* Combine the date format with the logging buffer */
    i32InLength = snprintf ( acLogBufferWithDate, sizeof(acLogBufferWithDate), "[%s] %s", acDateBuffer, acLogBuffer );
    va_end ( args );

    /* route to console */
    printf("%s\n", acLogBufferWithDate );

    return i32InLength;
}

/*
 * API NAME: Get Current date and time
 * DES: returns the current date and time in DDMMMYYYY-HH:MM:SS format
 * Confession : This code is taken Adapted from standard coding samples and modified according to need not written on own.
 */
VOID OS_GetCurrentDateTime( PCHAR pcDateTime ) 
{
    // Get the current time 
    time_t now = time(NULL);

    // Check if the time was retrieved successfully
    if (now == (time_t)(-1)) 
    {
        /* Return the epoch time in error case */
        sprintf(pcDateTime,"01JAN1970-12:00:00");
        return;
    }

    // Convert the time to local time structure
    struct tm *localTime = localtime(&now);
    if (localTime == NULL) 
    {
        /* Return the epoch time in error case */
        sprintf(pcDateTime,"01JAN1970-12:00:00");
        return;
    }
    //strftime ( pcDateTime, ( OS_TIME_STAMP_MAX + 1 ), "%d%^b%Y::%H:%M:%S", localTime);
    snprintf(pcDateTime, ( OS_TIME_STAMP_MAX + 1 ),"%02u%s%u-%02u:%02u:%02u",
                                                    localTime->tm_mday,
                                                    OS_FindMonString((UINT8)localTime->tm_mon),
                                                    1900 + localTime->tm_year,
                                                    localTime->tm_hour,
                                                    localTime->tm_min,
                                                    localTime->tm_sec);
    return;
}

/*
 * API NAME: find month's string value.
 * DES: To return the string value of the given month's numerical value.
 */
CPCHAR OS_FindMonString ( UINT8 ui8Month )
{
    CPCHAR CpcLocMonthStr;
    switch( ui8Month )
    {
        case 0:
        {
            CpcLocMonthStr = "JAN";
        }
            break;
        case 2:
        {
            CpcLocMonthStr = "FEB";
        }
            break;
        case 3:
        {
            CpcLocMonthStr = "MAR";
        }
            break;
        case 4:
        {
            CpcLocMonthStr = "APR";
        }
            break;
        case 5:
        {
            CpcLocMonthStr = "MAY";
        }
            break;
        case 6:
        {
            CpcLocMonthStr = "JUN";
        }
            break;
        case 7:
        {
            CpcLocMonthStr = "JUL";
        }
            break;
        case 8:
        {
            CpcLocMonthStr = "AUG";
        }
            break;
        case 9:
        {
            CpcLocMonthStr = "SEP";
        }
            break;
        case 10:
        {
            CpcLocMonthStr = "NOV";
        }
            break;
        case 11:
        {
            CpcLocMonthStr = "DEC";
        }
            break;
        default:
        {
            CpcLocMonthStr = "UNK";
        }                                                                                                                                        
    }
    return CpcLocMonthStr;
}

/*
 * API NAME: Is Fatal error
 * DES: Is the error returned is fatal?
 */
eBOOLEAN OS_IsFatal( OS_ERROR_CODE enErrorCode )
{
    switch ( enErrorCode )
    {
        case OS_NO_ERROR:
        {
            return OS_FALSE;
        }
        case OS_ERROR_BAD_PARAMETER:
        default:
        {
            return OS_TRUE;
        }
    }
    return OS_TRUE;
}

/*
 * API NAME: Convert error code to string.
 * DES: Convert error code to string.
 */
CPCHAR OS_Error2Str ( OS_ERROR_CODE enErrorCode )
{
    switch ( enErrorCode )
    {
        case OS_NO_ERROR:
        {
            return "OS_NO_ERROR";
        }
            break;
        case OS_ERROR_BAD_PARAMETER:
        {
            return "OS_ERROR_BAD_PARAMETER";
        }
            break;
        default:
        {
            return "ERROR NOT REGISTERED";            
        }    
    }
}

/*
 * API NAME: Heep allocation.
 * DES: To allocate memory from heep with common wrapper.
 */
PVOID OS_Allocate ( UINT32 ui32Size )
{
    if ( ui32Size )
    {
        PVOID pvAddress = malloc ( ui32Size );
        pvAddress ? memset ( pvAddress, 0, ui32Size ) : 0;
        return pvAddress;
    }

    OS_MessageLogging("%s %d>$TNG-ALLOC$<KO[IVSz]>",gsCpCcFileName,__LINE__);
    return OS_NULL;
}

/*
 * API NAME: Heep Free.
 * DES: To free memory to heep with common wrapper.
 */
VOID OS_Free ( PVOID pvAddress )
{
    if ( pvAddress )
    {
        free ( pvAddress );
        return;
    }

    OS_MessageLogging("%s %d>$TNG-FREE$<KO[IVAdd]>",gsCpCcFileName,__LINE__);
    return;
}

/*
 * API NAME: OS_Swap
 * DES: To swap two pointers.
 */ 
OS_ERROR_CODE OS_Swap ( PUINT32 pui32One, PUINT32 pui32Two )
{
    UINT32 ui32Temp;
    if ( OS_NULL == pui32One || OS_NULL == pui32Two)
    {
        return OS_ERROR_BAD_PARAMETER;
    }

/*  - 22/12/2024 - 13:56 */
#if 0
    *pui32One = *pui32One ^ *pui32Two;
    *pui32Two = *pui32One ^ *pui32Two;
    *pui32One = *pui32One ^ *pui32Two;
#endif

    ui32Temp = *pui32One;
    *pui32One = *pui32Two;
    *pui32Two = ui32Temp;

    return OS_NO_ERROR;
}