// This file contains declarations for the main Engine class. You will
// need to add declarations to this file as you develop your Engine.

#ifndef ENGINE_HPP
#define ENGINE_HPP

#include <chrono>
#include <unordered_set>
#include <queue>
#include <unordered_map>
#include <string>
#include "io.hpp"

struct Order {
    uint32_t order_id = 0;
    std::string instrument;
    uint32_t price = 0;
    uint32_t count = 0;
    char side = 'B';
    uint32_t timestamp = 0;
    int execution_id = 0;

    Order() = default;

    // Constructor with parameters
    Order(uint32_t id, const std::string &instr, uint32_t p, uint32_t c, char s, uint32_t time)
        : order_id(id), instrument(instr), price(p), count(c), side(s), timestamp(time) {
    }

    // Define comparison operator for buy orders (Max-Heap) Supported via standard programming aids
    struct BuyOrderComparator {
        bool operator()(const Order &a, const Order &b) const {
            return (a.price < b.price) || (a.price == b.price && a.timestamp > b.timestamp);
        }
    };

    // Define comparison operator for sell orders (Min-Heap) Supported via standard programming aids
    struct SellOrderComparator {
        bool operator()(const Order &a, const Order &b) const {
            return (a.price > b.price) || (a.price == b.price && a.timestamp > b.timestamp);
        }
    };
};

struct Engine {
public:
    void accept(ClientConnection conn);
    void addToBuyBook(uint32_t order_id, const std::string &instrument, uint32_t price, uint32_t count);
    void addToSellBook(uint32_t order_id, const std::string &instrument, uint32_t price, uint32_t count);
    void checkForRestingBuys(const std::string &instrument, uint32_t price, uint32_t &count, uint32_t order_id);
    void checkForRestingSells(const std::string &instrument, uint32_t price, uint32_t &count, uint32_t order_id);
    void cancelOrder(uint32_t order_id);

private:
    long long getCurrentTimeWithLock();
    std::unordered_map<std::string, std::priority_queue<Order, std::vector<Order>, Order::BuyOrderComparator> >
    buy_orders;
    std::unordered_map<std::string, std::priority_queue<Order, std::vector<Order>, Order::SellOrderComparator> >
    sell_orders;

    std::mutex sell_orders_mutex;
    std::mutex buy_orders_mutex;
    std::unordered_map<uint32_t, std::string> orderMap;
    std::mutex timerMutex; // mutex for timer
    long long executionCount = 0;

    // give a mutex for each instrument
    std::unordered_map<std::string, std::mutex> iMutexes;


    std::mutex exchangeMutex; // exchange-wide mutex




    void connection_thread(ClientConnection conn);
};

// all Objects
// buyorders map
//  - individal orders for each instructments
// sell_orders map
//  - individal orders for each instructments
// order set
// iMutexes

inline std::chrono::microseconds::rep getCurrentTimestamp() noexcept {

    return std::chrono::duration_cast<std::chrono::nanoseconds>(std::chrono::steady_clock::now().time_since_epoch()).
            count();
}

#endif
