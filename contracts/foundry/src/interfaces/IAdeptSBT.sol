// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
interface IAdeptSBT {
  event Born(bytes32 indexed agentId, address indexed owner, bytes32 genesiscodeCommitment, uint64 ts);
  event Rehomed(bytes32 indexed agentId, address indexed fromOwner, address indexed toOwner);
  event PolicyUpdated(bytes32 indexed agentId, bytes32 policyHash);
  function mintAdept(address owner, bytes32 genesiscodeCommitment, bytes calldata vrfProof, bytes calldata vrfPk, bytes32 policyHash, string calldata metadataURI) external returns (bytes32 agentId);
  function ownerOf(bytes32 agentId) external view returns (address);
  function requestRehome(bytes32 agentId, address newOwner) external;
  function acceptRehome(bytes32 agentId) external;
}
