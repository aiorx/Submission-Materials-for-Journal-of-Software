#take command line arguments and call the appropriate function

import sys
import os
import re

from function import get_temp

def main():
    if len(sys.argv) == 1:
        print("Usage: python main.py <function> <arguments>")
        print("Functions: get_temp")
        print("Arguments: city name")
        sys.exit(1)
    city = sys.argv[1]
    print(get_temp(city) , " degrees Celsius")

if __name__ == '__main__':
    main()

# the main function was Composed with GitHub coding tools, we only needed to remove the extra args that it was thinking were needed