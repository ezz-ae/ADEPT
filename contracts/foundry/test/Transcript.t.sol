// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/mock/MockTranscriptRegistry.sol";
contract TranscriptTest is Test {
  MockTranscriptRegistry reg;
  function setUp() public { reg = new MockTranscriptRegistry(); }
  function testRecordExamEmits() public {
    ITranscriptRegistry.ExamResult memory r = ITranscriptRegistry.ExamResult({
      agentId: keccak256("agent"), examId: keccak256("exam"), stage_id: keccak256("stage"),
      ts: uint64(block.timestamp), score: 100, grade: bytes32("PASS"), policyHash: keccak256("policy"),
      ncuUsed: 42, oracle: address(this), evidenceCID: "cid://example", coex_hash: keccak256("coex"),
      artifact_hash: keccak256("artifact"), nores_mode: true, stability_mod: int16(0), baseline: false,
      assetRef: bytes32(0), attemptId: bytes32("attempt"), attestationUID: bytes32("att")
    });
    vm.expectEmit(true,true,true,true); emit ExamRecorded(r.agentId, r.examId, address(this));
    reg.recordExam(r, hex"");
  }
  event ExamRecorded(bytes32 indexed agentId, bytes32 indexed examId, address indexed oracle);
}
