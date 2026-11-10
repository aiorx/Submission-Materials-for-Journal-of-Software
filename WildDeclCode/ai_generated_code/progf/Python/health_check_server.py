#!/usr/bin/env python3
"""
Simple Health Check MCP Server
A basic FastMCP server that provides health check functionality over HTTP transport.
Aided with basic GitHub coding tools
"""

from fastmcp import FastMCP
import datetime
import platform
import sys
from typing import Dict, Any

# Create the FastMCP server instance
mcp = FastMCP(
    name="HealthCheckServer",
    instructions="""
    This server provides health check and system information tools.
    Use the health_check() tool to verify server status and get basic system information.
    Use the detailed_status() tool for comprehensive system details.
    """,
)

@mcp.tool
def health_check() -> Dict[str, Any]:
    """
    Simple health check that returns server status and basic information.
    
    Returns:
        Dict containing server status, timestamp, and basic system info
    """
    # Aided with basic GitHub coding tools
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat(),
        "server_name": "HealthCheckServer",
        "uptime_seconds": "N/A",  # Could be enhanced to track actual uptime
        "message": "Server is running and responsive"
    }

@mcp.tool
def detailed_status() -> Dict[str, Any]:
    """
    Detailed system status including platform information.
    
    Returns:
        Dict containing comprehensive system and server information
    """
    # Aided with basic GitHub coding tools
    return {
        "status": "healthy",
        "timestamp": datetime.datetime.now().isoformat(),
        "server_info": {
            "name": "HealthCheckServer",
            "type": "FastMCP HTTP Server",
            "transport": "HTTP"
        },
        "system_info": {
            "platform": platform.platform(),
            "python_version": sys.version,
            "architecture": platform.architecture()[0],
            "processor": platform.processor(),
            "hostname": platform.node()
        },
        "runtime_info": {
            "python_executable": sys.executable,
            "python_path": sys.path[:3],  # First 3 entries to avoid too much data
        }
    }

@mcp.tool
def ping() -> str:
    """
    Simple ping tool that returns a pong response.
    
    Returns:
        Simple pong message with timestamp
    """
    # Aided with basic GitHub coding tools
    return f"pong - {datetime.datetime.now().isoformat()}"

@mcp.resource("health://status")
def get_health_resource() -> Dict[str, Any]:
    """
    Provides health status as a resource that can be read by clients.
    """
    # Aided with basic GitHub coding tools
    return {
        "resource_type": "health_status",
        "status": "healthy",
        "last_checked": datetime.datetime.now().isoformat(),
        "available_tools": ["health_check", "detailed_status", "ping"]
    }

if __name__ == "__main__":
    # Run the server with HTTP transport
    # Aided with basic GitHub coding tools
    print("Starting Health Check MCP Server...")
    print("Server will be available at: http://127.0.0.1:8080")
    print("MCP endpoint: http://127.0.0.1:8080/mcp")
    print("Available tools: health_check, detailed_status, ping")
    print("Available resources: health://status")
    print("Press Ctrl+C to stop the server")
    print("")
    print("For MCP clients, use the URL: http://127.0.0.1:8080/mcp")
    
    mcp.run(
        transport="http",
        host="127.0.0.1",
        port=8080
    )
