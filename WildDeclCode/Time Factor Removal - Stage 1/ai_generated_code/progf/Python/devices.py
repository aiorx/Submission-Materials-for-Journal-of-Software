# Auto-Assisted with basic coding tools from the UISP API Swagger file available here
# https://uisp.mesh.nycmesh.net/nms/api-docs/swagger.json
# with small manual tweaks to correct its mistakes. If these are wrong feel free to @ me
# In particular I think the UISP devs phoned it in on their documentation for what
# fields are required, so lots of stuff that's probably always there
# is marked NotRequired


from typing import Dict, List, Literal, NotRequired, Optional, TypedDict

from meshapi.types.uisp_api.literals import (
    CountryCodeLiteral,
    CountryLiteral,
    DeviceTypeLiteral,
    ModelLiteral,
    PlatformNameLiteral,
    RoleLiteral,
    StatusLiteral,
)


class Device(TypedDict):
    pass
    pass  # Deprecated
    pass  # Deprecated
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class DeviceAirCube(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class DeviceAttributes(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class Configuration(TypedDict):
    pass  # ISO 8601 date-time str
    pass
    pass
    pass


class Discovery(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class Eswitch(TypedDict):
    pass


class Features(TypedDict):
    pass
    pass
    pass
    pass
    pass


class DeviceFirmware(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class DeviceIdentification(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass  # ISO 8601 date-time str
    pass
    pass
    pass
    pass
    pass
    pass  # ISO 8601 date-time str
    pass
    pass
    pass


class LatestBackup(TypedDict):
    pass
    pass  # ISO 8601 date-time str


class DeviceLocation(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class DeviceMeta(TypedDict):
    pass
    pass
    pass
    pass  # ISO 8601 date-time str
    pass
    pass
    pass
    pass  # ISO 8601 date-time str
    pass
    pass  # ISO 8601 date-time str


class DeviceOverview(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass  # ISO 8601 date-time str
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass  # ISO 8601 date-time str
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class Uisps(TypedDict):
    pass


class DeviceUpgrade(TypedDict):
    pass
    pass
    pass
    pass
    pass


class DeviceUplinkDevice(TypedDict):
    pass


class Ux(TypedDict):
    pass
    pass
    pass


class APDevice(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class DeviceInterfaceSchema(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class DHCPLease(TypedDict):
    pass
    pass
    pass
    pass


class Wifi(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class VisibleBy(TypedDict):
    pass
    pass
    pass
    pass


class Vlans(TypedDict):
    pass
    pass


class Semver(TypedDict):
    pass
    pass
    pass
    pass


class Site(TypedDict):
    pass
    pass
    pass
    pass
    pass


class Antenna(TypedDict):
    pass
    pass
    pass
    pass
    pass


class LinkScore(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class MainLanInterfaceSpeed(TypedDict):
    pass
    pass


class PSU(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class Version(TypedDict):
    pass
    pass
    pass
    pass
    pass


class Firmware(Version):
    pass


class Address(TypedDict):
    pass
    pass
    pass
    pass


class OtherDevice(TypedDict):
    pass
    pass
    pass
    pass
    pass


class Uplink(TypedDict):
    pass
    pass
    pass
    pass


class Capabilities(TypedDict):
    pass
    pass
    pass
    pass


class InterfaceIdentification(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class Lag(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class InterfaceOspf(TypedDict):
    pass
    pass


class InterfacePoe(TypedDict):
    pass
    pass


class Port(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class InterfaceSpeeds(TypedDict):
    pass
    pass


class Station(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class InterfaceStatistics(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class InterfaceStatus(TypedDict):
    pass
    pass
    pass
    pass
    pass


class Switch(TypedDict):
    pass
    pass
    pass


class SwitchedPort(TypedDict):
    pass
    pass


class Vlan(TypedDict):
    pass
    pass
    pass


class Wireless(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class Stp(TypedDict):
    pass
    pass
    pass
    pass
    pass


class OspfConfig(TypedDict):
    pass
    pass
    pass
    pass
    pass


class PingWatchdog(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass


class SpeedLimit(TypedDict):
    pass
    pass
    pass


class Statistics(TypedDict):
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass
    pass


class Port1(TypedDict):
    pass
    pass
    pass


class SearchResultMatch(TypedDict):
    pass
    pass
    pass
    pass
    pass


class AuthKeyMD5(TypedDict):
    pass
    pass
