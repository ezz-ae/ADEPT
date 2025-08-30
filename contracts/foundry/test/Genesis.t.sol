// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/mock/MockAdeptSBT.sol";
contract GenesisTest is Test {
  MockAdeptSBT sbt;
  function setUp() public { sbt = new MockAdeptSBT(); }
  function testMintEmitsBorn() public {
    address owner = address(0xBEEF);
    bytes32 commit = keccak256("commit");
    bytes memory vrfProof = hex"01"; bytes memory vrfPk = hex"02";
    bytes32 policyHash = keccak256("policy");
    vm.expectEmit(true,true,false,true); emit Born(bytes32(0), owner, commit, uint64(block.timestamp));
    bytes32 agentId = sbt.mintAdept(owner, commit, vrfProof, vrfPk, policyHash, "meta");
    assertEq(sbt.ownerOf(agentId), owner);
  }
  event Born(bytes32 indexed agentId, address indexed owner, bytes32 genesiscodeCommitment, uint64 ts);
}
