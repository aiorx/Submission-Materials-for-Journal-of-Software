```c
        case Forward:
            switch (ThisEvent.EventType) {
                case ES_ENTRY:
                    MOTOR_TATTLE(100,100)
                    Maw_LeftMtrSpeed(100);
                    Maw_RightMtrSpeed(100);

                    break;
                case TAPE:
                    nextState = Reverse;
                    makeTransition = TRUE;
                    ThisEvent.EventType = TAPE;
                    break;
                case BUMPER:
                    //only when a front bumper is pressed
                    if(ThisEvent.EventParam & ((1<<BUMPERflBit) | (1<<BUMPERfrBit))){
                        nextState = Reverse;
                        makeTransition = TRUE;
                        ThisEvent.EventType = ES_NO_EVENT;
                        LastBump = ThisEvent.EventParam;
                    }
                    break;
                case PINGCLOSE: // May need specific param to state value is low enough to dodge
                    if (ThisEvent.EventParam) {
                        nextState = Spin;
                        makeTransition = TRUE;
                        ThisEvent.EventType = ES_NO_EVENT;
                    }
                    break;
                case ES_TIMEOUT:
                    if (ThisEvent.EventParam == WANDER_SUBSTATE_TIMER) {
                        nextState = Spin;
                        makeTransition = TRUE;
                        ThisEvent.EventType = ES_NO_EVENT;
                    }
                case ES_NO_EVENT:
                default:
                    // Unhandled events pass back up to the next level
                    break;
            }
            break;
```