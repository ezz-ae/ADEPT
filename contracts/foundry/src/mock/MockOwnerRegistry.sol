// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "../interfaces/IOwnerRegistry.sol";
contract MockOwnerRegistry is IOwnerRegistry {
  mapping(address=>bool) private _banned; mapping(address=>bool) private _suspended;
  function setBanned(address owner, bool v) external { _banned[owner]=v; if(v) emit OwnerBanned(owner, bytes32("test")); else emit BanLifted(owner); }
  function setSuspended(address owner, bool v) external { _suspended[owner]=v; if(v) emit OwnerSuspended(owner, bytes32("test")); }
  function isBanned(address owner) external view returns(bool){ return _banned[owner]; }
  function isSuspended(address owner) external view returns(bool){ return _suspended[owner]; }
}
