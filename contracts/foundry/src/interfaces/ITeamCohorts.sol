// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
interface ITeamCohorts {
  function teamBucket(bytes32 agentId, bytes32 orgSalt, bytes32 domain, bytes32 epoch) external view returns (bytes32);
}
