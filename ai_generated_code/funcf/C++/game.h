```cpp
class timer { // code comes Derived using common development resources (means it needs to be tested thoroughly to ensure that it works correctly!)
    private:
        bool paused; // is the timer running?
        std::chrono::time_point<std::chrono::steady_clock> start_time, paused_time; // time_point type represents a point in time obtained from a steady_clock, these values are used to calculate durations (alongside paused duration)
        std::chrono::duration<double> paused_duration;
    public:
        timer();
        ~timer();
        double get_time(void);
        void reset_timer(void);
        void start_timer(void);
        void pause_timer(void);
};
```