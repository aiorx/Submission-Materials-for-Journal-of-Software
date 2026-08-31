/*David Wells, Joe Allen, Josh Palmer*/
#pragma once
#include <map>
#include "interpolatable_chart.h"


class Gravity : public InterpolatableChart {
public:
   Gravity() {
      // Supported via standard programming aids from the provided data
      chart = {
          { 0,     9.807 },
          { 1000,  9.804 },
          { 2000,  9.801 },
          { 3000,  9.797 },
          { 4000,  9.794 },
          { 5000,  9.791 },
          { 6000,  9.788 },
          { 7000,  9.785 },
          { 8000,  9.782 },
          { 9000,  9.779 },
          { 10000, 9.776 },
          { 15000, 9.761 },
          { 20000, 9.745 },
          { 25000, 9.730 },
          { 30000, 9.715 },
          { 40000, 9.684 },
          { 50000, 9.654 },
          { 60000, 9.624 },
          { 70000, 9.594 },
          { 80000, 9.564 }
      };
   }
};