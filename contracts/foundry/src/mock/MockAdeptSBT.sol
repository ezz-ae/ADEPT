// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "../interfaces/IAdeptSBT.sol";
contract MockAdeptSBT is IAdeptSBT {
  mapping(bytes32=>address) private _ownerOf;
  mapping(bytes32=>address) public pendingRehome;
  function mintAdept(address owner, bytes32 commit, bytes calldata, bytes calldata, bytes32 policyHash, string calldata) external returns (bytes32 agentId) {
    agentId = keccak256(abi.encode(owner, commit, block.timestamp));
    require(_ownerOf[agentId]==address(0), "exists");
    _ownerOf[agentId]=owner;
    emit Born(agentId, owner, commit, uint64(block.timestamp));
    emit PolicyUpdated(agentId, policyHash);
  }
  function ownerOf(bytes32 agentId) external view returns (address){ return _ownerOf[agentId]; }
  function requestRehome(bytes32 agentId, address newOwner) external { require(msg.sender==_ownerOf[agentId], "not owner"); pendingRehome[agentId]=newOwner; }
  function acceptRehome(bytes32 agentId) external { require(msg.sender==pendingRehome[agentId], "not pending"); address from=_ownerOf[agentId]; _ownerOf[agentId]=msg.sender; pendingRehome[agentId]=address(0); emit Rehomed(agentId, from, msg.sender); }
}
