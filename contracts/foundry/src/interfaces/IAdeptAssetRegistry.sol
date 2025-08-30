// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
interface IAdeptAssetRegistry {
  event AssetGranted(bytes32 indexed agentId, bytes32 indexed assetType, uint256 amount, address indexed issuer);
  event AssetConsumed(bytes32 indexed agentId, bytes32 indexed assetType, uint256 amount, address indexed consumer);
  event AssetRevoked(bytes32 indexed agentId, bytes32 indexed assetType, uint256 amount, address indexed issuer);
  function grantAssets(bytes32 agentId, bytes32 assetType, uint256 amount) external;
  function consume(bytes32 agentId, bytes32 assetType, uint256 amount) external;
  function revoke(bytes32 agentId, bytes32 assetType, uint256 amount) external;
  function balanceOf(bytes32 agentId, bytes32 assetType) external view returns (uint256);
}
