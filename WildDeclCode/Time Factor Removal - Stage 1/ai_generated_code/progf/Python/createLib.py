"""
DBC to Arduino CAN Library Generator

This program parses DBC (Database CAN) files and generates Arduino-compatible 
libraries with functions to create CAN messages in binary form.

Usage: python createLib.py <dbc_file> [output_dir]

Author: Generated Assisted using common GitHub development aids
Date: June 2025
"""

import re
import os
import sys
import argparse
from typing import Dict, List, Tuple, Optional
from dataclasses import dataclass


@dataclass
class Signal:
    """Represents a CAN signal from DBC file"""
    name: str
    start_bit: int
    length: int
    byte_order: str  # '0' = big endian (Motorola), '1' = little endian (Intel)
    signed: bool
    factor: float
    offset: float
    min_val: float
    max_val: float
    unit: str
    receivers: List[str]


@dataclass
class Message:
    """Represents a CAN message from DBC file"""
    id: int
    name: str
    length: int
    sender: str
    signals: List[Signal]


class DBCParser:
    """Parser for DBC files"""
    
    def __init__(self):
        self.messages: Dict[int, Message] = {}
        self.nodes: List[str] = []
    
    def parse_file(self, filepath: str) -> None:
        """Parse a DBC file"""
        try:
            # Try different encodings
            encodings = ['utf-8', 'latin-1', 'cp1252', 'iso-8859-1']
            content = None
            
            for encoding in encodings:
                try:
                    with open(filepath, 'r', encoding=encoding) as f:
                        content = f.read()
                    break
                except UnicodeDecodeError:
                    continue
            
            if content is None:
                raise ValueError("Could not decode file with any supported encoding")
            
            self._parse_nodes(content)
            self._parse_messages(content)
            
        except Exception as e:
            print("Error parsing DBC file: {}".format(e))
            raise
    
    def _parse_nodes(self, content: str) -> None:
        """Parse BU_ section to get node names"""
        bu_match = re.search(r'BU_:\s*(.+)', content)
        if bu_match:
            nodes_str = bu_match.group(1).strip()
            self.nodes = [node.strip() for node in nodes_str.split() if node.strip()]
    
    def _parse_messages(self, content: str) -> None:
        """Parse BO_ sections to get messages and signals"""
        # Find all message definitions
        message_pattern = r'BO_\s+(\d+)\s+(\w+):\s+(\d+)\s+(\w+)\s*\n((?:\s+SG_.*\n?)*)'
        
        for match in re.finditer(message_pattern, content, re.MULTILINE):
            msg_id = int(match.group(1))
            msg_name = match.group(2)
            msg_length = int(match.group(3))
            sender = match.group(4)
            signals_block = match.group(5)
            
            signals = self._parse_signals(signals_block)
            
            message = Message(
                id=msg_id,
                name=msg_name,
                length=msg_length,
                sender=sender,
                signals=signals
            )
            
            self.messages[msg_id] = message
    
    def _parse_signals(self, signals_block: str) -> List[Signal]:
        """Parse signal definitions within a message"""
        signals = []
        
        # Signal pattern: SG_ name : start_bit|length@byte_order+/- (factor,offset) [min|max] "unit" receivers
        signal_pattern = r'SG_\s+(\w+)\s*:\s*(\d+)\|(\d+)@([01])([+-])\s*\(([^,]+),([^)]+)\)\s*\[([^|]*)\|([^\]]*)\]\s*"([^"]*)"?\s*(.+)?'
        
        for line in signals_block.split('\n'):
            line = line.strip()
            if not line.startswith('SG_'):
                continue
                
            match = re.match(signal_pattern, line)
            if match:
                name = match.group(1)
                start_bit = int(match.group(2))
                length = int(match.group(3))
                byte_order = match.group(4)
                signed = match.group(5) == '-'
                factor = float(match.group(6))
                offset = float(match.group(7))
                min_val = float(match.group(8)) if match.group(8) else 0.0
                max_val = float(match.group(9)) if match.group(9) else 0.0
                unit = match.group(10)
                receivers_str = match.group(11) if match.group(11) else ""
                receivers = [r.strip() for r in receivers_str.split(',') if r.strip()]
                
                signal = Signal(
                    name=name,
                    start_bit=start_bit,
                    length=length,
                    byte_order=byte_order,
                    signed=signed,
                    factor=factor,
                    offset=offset,
                    min_val=min_val,
                    max_val=max_val,
                    unit=unit,
                    receivers=receivers
                )
                
                signals.append(signal)
        
        return signals


class ArduinoLibraryGenerator:
    """Generates Arduino-compatible CAN library from parsed DBC data"""
    
    def __init__(self, dbc_parser: DBCParser):
        self.parser = dbc_parser
        self.library_name = "CANMessages"
    
    def generate_library(self, output_dir: str) -> None:
        """Generate complete Arduino library"""
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate header file
        header_content = self._generate_header()
        with open(os.path.join(output_dir, "{}.h".format(self.library_name)), 'w') as f:
            f.write(header_content)
        
        # Generate implementation file
        cpp_content = self._generate_cpp()
        with open(os.path.join(output_dir, "{}.cpp".format(self.library_name)), 'w') as f:
            f.write(cpp_content)
        
        # Generate library properties
        self._generate_library_properties(output_dir)
        
        # Generate examples
        self._generate_examples(output_dir)
        
        print("Arduino library generated in: {}".format(output_dir))
    
    def _generate_header(self) -> str:
        """Generate the header file (.h)"""
        header = "#ifndef {}_H
#define {}_H

#include <Arduino.h>

// CAN Message IDs
".format(self.library_name.upper(), self.library_name.upper())
        
        # Add message ID definitions
        for msg_id, message in sorted(self.parser.messages.items()):
            header += "#define CAN_{}_ID 0x{:X}
".format(message.name.upper(), msg_id)"
        
        header += "\n// CAN Message Structures\n"
        
        # Add message structures
        for message in sorted(self.parser.messages.values(), key=lambda x: x.id):
            if message.signals:  # Only generate for messages with signals
                header += "
typedef struct {{
"
                for signal in message.signals:
                    data_type = self._get_arduino_data_type(signal)
                    header += "  {} {};
".format(data_type, signal.name)
                header += "}} {}_t;
".format(message.name)
        
        header += "\n// Function declarations\n"
        
        # Add function declarations
        for message in sorted(self.parser.messages.values(), key=lambda x: x.id):
            if message.signals:  # Only generate for messages with signals
                header += "void pack_{}(const {}_t* data, uint8_t* frame);
".format(message.name, message.name)
                header += "void unpack_{}(const uint8_t* frame, {}_t* data);
".format(message.name, message.name)
        
        header += "
#endif // {}_H
".format(self.library_name.upper())
        
        return header
    
    def _generate_cpp(self) -> str:
        """Generate the implementation file (.cpp)"""
        cpp = '#include "{}.h"

// Helper function to set bits in a byte array
static void setBits(uint8_t* data, uint16_t startBit, uint16_t length, uint64_t value, bool bigEndian) {{
  if (bigEndian) {{
    // Motorola format (big endian)
    for (int i = 0; i < length; i++) {{
      uint16_t bitPos = startBit - i;
      uint8_t bytePos = bitPos / 8;
      uint8_t bitInByte = bitPos % 8;
      
      if ((value >> (length - 1 - i)) & 1) {{
        data[bytePos] |= (1 << bitInByte);
      }} else {{
        data[bytePos] &= ~(1 << bitInByte);
      }}
    }}
  }} else {{
    // Intel format (little endian)
    for (int i = 0; i < length; i++) {{
      uint16_t bitPos = startBit + i;
      uint8_t bytePos = bitPos / 8;
      uint8_t bitInByte = bitPos % 8;
      
      if ((value >> i) & 1) {{
        data[bytePos] |= (1 << bitInByte);
      }} else {{
        data[bytePos] &= ~(1 << bitInByte);
      }}
    }}
  }}
}}

// Helper function to get bits from a byte array
static uint64_t getBits(const uint8_t* data, uint16_t startBit, uint16_t length, bool bigEndian) {{
  uint64_t result = 0;
  
  if (bigEndian) {{
    // Motorola format (big endian)
    for (int i = 0; i < length; i++) {{
      uint16_t bitPos = startBit - i;
      uint8_t bytePos = bitPos / 8;
      uint8_t bitInByte = bitPos % 8;
      
      if (data[bytePos] & (1 << bitInByte)) {{
        result |= (1ULL << (length - 1 - i));
      }}
    }}
  }} else {{
    // Intel format (little endian)
    for (int i = 0; i < length; i++) {{
      uint16_t bitPos = startBit + i;
      uint8_t bytePos = bitPos / 8;
      uint8_t bitInByte = bitPos % 8;
      
      if (data[bytePos] & (1 << bitInByte)) {{
        result |= (1ULL << i);
      }}
    }}
  }}
  
  return result;
}}

// Apply scaling and offset to raw value
static double applyScaling(uint64_t rawValue, double factor, double offset, bool isSigned, uint16_t length) {{
  if (isSigned && (rawValue & (1ULL << (length - 1)))) {{
    // Sign extend for negative values
    rawValue |= (0xFFFFFFFFFFFFFFFFULL << length);
  }}
  
  return (double)((int64_t)rawValue) * factor + offset;
}}

// Convert scaled value back to raw
static uint64_t removeScaling(double scaledValue, double factor, double offset, bool isSigned, uint16_t length) {{
  int64_t rawValue = (int64_t)((scaledValue - offset) / factor);
  
  if (!isSigned) {{
    return (uint64_t)rawValue & ((1ULL << length) - 1);
  }} else {{
    return (uint64_t)rawValue & ((1ULL << length) - 1);
  }}
}}

'.format(self.library_name)
        
        # Generate pack/unpack functions for each message
        for message in sorted(self.parser.messages.values(), key=lambda x: x.id):
            if not message.signals:  # Skip messages without signals
                continue
                
            cpp += self._generate_pack_function(message)
            cpp += self._generate_unpack_function(message)
        
        return cpp
    
    def _generate_pack_function(self, message: Message) -> str:
        """Generate pack function for a message"""
        func = "
// Pack {} message
".format(message.name)
        func += "void pack_{}(const {}_t* data, uint8_t* frame) {{
".format(message.name, message.name)
        func += "  // Initialize frame to zero
"
        func += "  for (int i = 0; i < {}; i++) {{
".format(message.length)
        func += "    frame[i] = 0;
"
        func += "  }}

"
        
        for signal in message.signals:
            func += "  // Pack {}
".format(signal.name)
            
            # Convert physical value to raw value
            if signal.factor != 1.0 or signal.offset != 0.0:
                func += "  uint64_t raw_{} = removeScaling(data->{}, {}, {}, {}, {});
".format(signal.name, signal.name, signal.factor, signal.offset, 'true' if signal.signed else 'false', signal.length)
            else:
                func += "  uint64_t raw_{} = (uint64_t)data->{};
".format(signal.name, signal.name)
            
            # Set bits in frame
            big_endian = "true" if signal.byte_order == '0' else "false"
            func += "  setBits(frame, {}, {}, raw_{}, {});

".format(signal.start_bit, signal.length, signal.name, big_endian)
        
        func += "}\n"
        return func
    
    def _generate_unpack_function(self, message: Message) -> str:
        """Generate unpack function for a message"""
        func = "
// Unpack {} message
".format(message.name)
        func += "void unpack_{}(const uint8_t* frame, {}_t* data) {{
".format(message.name, message.name)
        
        for signal in message.signals:
            func += "  // Unpack {}
".format(signal.name)
            
            # Get raw bits from frame
            big_endian = "true" if signal.byte_order == '0' else "false"
            func += "  uint64_t raw_{} = getBits(frame, {}, {}, {});
".format(signal.name, signal.start_bit, signal.length, big_endian)
            
            # Apply scaling and offset
            if signal.factor != 1.0 or signal.offset != 0.0:
                func += "  data->{} = ({})applyScaling(raw_{}, {}, {}, {}, {});

".format(signal.name, self._get_arduino_data_type(signal), signal.name, signal.factor, signal.offset, 'true' if signal.signed else 'false', signal.length)
            else:
                if signal.signed:
                    func += "  data->{} = ({})((int64_t)raw_{});

".format(signal.name, self._get_arduino_data_type(signal), signal.name)
                else:
                    func += "  data->{} = ({})raw_{};

".format(signal.name, self._get_arduino_data_type(signal), signal.name)
        
        func += "}\n"
        return func
    
    def _get_arduino_data_type(self, signal: Signal) -> str:
        """Determine appropriate Arduino data type for signal"""
        # For floating point values (when factor is not 1.0)
        if signal.factor != 1.0:
            return "float"
        
        # For integer values
        if signal.signed:
            if signal.length <= 8:
                return "int8_t"
            elif signal.length <= 16:
                return "int16_t"
            elif signal.length <= 32:
                return "int32_t"
            else:
                return "int64_t"
        else:
            if signal.length == 1:
                return "bool"
            elif signal.length <= 8:
                return "uint8_t"
            elif signal.length <= 16:
                return "uint16_t"
            elif signal.length <= 32:
                return "uint32_t"
            else:
                return "uint64_t"
    
    def _generate_library_properties(self, output_dir: str) -> None:
        """Generate library.properties file"""
        properties = "name={}
version=1.0.0
author=DBC Parser Generator
maintainer=Generated Library
sentence=Arduino library for CAN message handling generated from DBC file
paragraph=This library provides functions to pack and unpack CAN messages according to DBC specifications
category=Communication
url=
architectures=*
includes={}.h
".format(self.library_name, self.library_name)
        
        with open(os.path.join(output_dir, "library.properties"), 'w') as f:
            f.write(properties)
    
    def _generate_examples(self, output_dir: str) -> None:
        """Generate example sketches"""
        examples_dir = os.path.join(output_dir, "examples")
        os.makedirs(examples_dir, exist_ok=True)
        
        # Find a good example message (one with multiple signals)
        example_message = None
        for message in self.parser.messages.values():
            if len(message.signals) > 1:
                example_message = message
                break
        
        if not example_message:
            # Fallback to any message with signals
            for message in self.parser.messages.values():
                if message.signals:
                    example_message = message
                    break
        
        if example_message:
            example_dir = os.path.join(examples_dir, "Pack{}".format(example_message.name))
            os.makedirs(example_dir, exist_ok=True)
            
            example_content = "/*
  Pack{} Example
  
  This example shows how to pack a {} CAN message
  and print the resulting byte array.
*/

#include <{}.h>

void setup() {{
  Serial.begin(115200);
  
  // Create message data structure
  {}_t msgData;
  
  // Fill in some example values
".format(example_message.name, example_message.name, self.library_name, example_message.name)
            
            # Add example values for each signal
            for signal in example_message.signals:
                if signal.factor != 1.0:
                    example_val = signal.min_val + (signal.max_val - signal.min_val) * 0.5
                else:
                    if signal.length == 1:
                        example_val = "true"
                    else:
                        max_val = (1 << signal.length) - 1 if not signal.signed else (1 << (signal.length - 1)) - 1
                        example_val = max_val // 2
                
                example_content += "  msgData.{} = {};
".format(signal.name, example_val)
            
            example_content += '
  // Pack the message into a byte array
  uint8_t canFrame[{}];
  pack_{}(&msgData, canFrame);
  
  // Print the resulting frame
  Serial.print("CAN Frame (ID 0x");
  Serial.print(CAN_{}_ID, HEX);
  Serial.print("): ");
  
  for (int i = 0; i < {}; i++) {{
    if (canFrame[i] < 0x10) Serial.print("0");
    Serial.print(canFrame[i], HEX);
    Serial.print(" ");
  }}
  Serial.println();
  
  // Test unpacking
  {}_t unpackedData;
  unpack_{}(canFrame, &unpackedData);
  
  // Print unpacked values
  Serial.println("Unpacked values:");
'.format(example_message.length, example_message.name, example_message.name.upper(), example_message.length, example_message.name, example_message.name)
            
            for signal in example_message.signals:
                example_content += '  Serial.print("{}: ");
'.format(signal.name)
                example_content += "  Serial.println(unpackedData.{});
".format(signal.name)
            
            example_content += '''}

void loop() {
  // Nothing to do here
}
'''
            
            with open(os.path.join(example_dir, "Pack{}.ino".format(example_message.name)), 'w') as f:
                f.write(example_content)


def main():
    """Main function"""
    parser = argparse.ArgumentParser(description='Generate Arduino CAN library from DBC file')
    parser.add_argument('dbc_file', help='Path to DBC file')
    parser.add_argument('-o', '--output', default='CANLibrary', help='Output directory (default: CANLibrary)')
    parser.add_argument('-n', '--name', default='CANMessages', help='Library name (default: CANMessages)')
    
    args = parser.parse_args()
    
    if not os.path.exists(args.dbc_file):
        print("Error: DBC file '{}' not found".format(args.dbc_file))
        return 1
    
    try:
        # Parse DBC file
        dbc_parser = DBCParser()
        dbc_parser.parse_file(args.dbc_file)
        
        print("Parsed {} messages from {}".format(len(dbc_parser.messages), args.dbc_file))
        
        # Generate Arduino library
        generator = ArduinoLibraryGenerator(dbc_parser)
        generator.library_name = args.name
        generator.generate_library(args.output)
        
        return 0
        
    except Exception as e:
        print("Error: {}".format(e))
        return 1


if __name__ == "__main__":
    sys.exit(main())