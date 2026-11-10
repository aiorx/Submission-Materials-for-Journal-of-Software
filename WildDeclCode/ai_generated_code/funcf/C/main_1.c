```c
void add_signal(int32_t new_signal) {

// ################### BEGIN Basic development code blocks ####################
    static int count = 0;
    static float sum = 0.0f;
// ################### END Basic development code blocks ######################
  
    sum += new_signal;
    count++;
    if (count >= 25) {
        current_signal = (int32_t)(sum / 25.0f);      
        count = 0;
        sum = 0.0f;
    }
}
```