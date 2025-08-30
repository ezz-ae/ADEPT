// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
interface ITranscriptRegistry {
  struct ExamResult {
    bytes32 agentId; bytes32 examId; bytes32 stage_id; uint64 ts; uint16 score; bytes32 grade; bytes32 policyHash;
    uint32 ncuUsed; address oracle; string evidenceCID; bytes32 coex_hash; bytes32 artifact_hash;
    bool nores_mode; int16 stability_mod; bool baseline; bytes32 assetRef; bytes32 attemptId; bytes32 attestationUID;
  }
  struct Milestone { bytes32 agentId; bytes32 milestoneId; uint64 ts; bytes32 tag; string evidenceCID; }
  event ExamRecorded(bytes32 indexed agentId, bytes32 indexed examId, address indexed oracle);
  event MilestoneRecorded(bytes32 indexed agentId, bytes32 indexed milestoneId, address indexed oracle);
  function recordExam(ExamResult calldata r, bytes calldata oracleSig) external;
  function recordMilestone(Milestone calldata m, bytes calldata oracleSig) external;
}
