"""
MIT License

Copyright (c) 2024 quark77

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"""

# This script includes code suggestions Assisted with basic coding tools, OpenAI (https://openai.com/chatgpt).

import json
import os

class Config:
    def __init__(self, json_file="config.json"):
        if not os.path.exists(json_file):
            raise FileNotFoundError(f"Configuration file '{json_file}' not found.")
        
        with open(json_file, "r") as f:
            self.data = json.load(f)

    def get(self, section, key, default=None):
        """Retrieve a configuration value with a default fallback."""
        return self.data.get(section, {}).get(key, default)

    def getint(self, section, key, default=None):
        """Retrieve an integer configuration value."""
        return int(self.get(section, key, default))

    def getfloat(self, section, key, default=None):
        """Retrieve a float configuration value."""
        return float(self.get(section, key, default))

    def getboolean(self, section, key, default=None):
        """Retrieve a boolean configuration value."""
        value = self.get(section, key, default)
        if isinstance(value, str):
            return value.lower() in ("true", "yes", "1")
        return bool(value)