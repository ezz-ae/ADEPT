// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
interface IOracleRegistry {
  event OracleSet(address indexed oracle, bool allowed);
  function setOracle(address oracle, bool allowed) external;
  function isOracle(address oracle) external view returns (bool);
}
