// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
interface IOwnerRegistry {
  event OwnerBanned(address indexed owner, bytes32 reasonCode);
  event OwnerSuspended(address indexed owner, bytes32 reasonCode);
  event BanLifted(address indexed owner);
  function isBanned(address owner) external view returns (bool);
  function isSuspended(address owner) external view returns (bool);
}
