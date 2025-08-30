// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "../interfaces/ITranscriptRegistry.sol";
contract MockTranscriptRegistry is ITranscriptRegistry {
  mapping(bytes32=>ExamResult) public lastExam;
  mapping(bytes32=>Milestone) public lastMilestone;
  function recordExam(ExamResult calldata r, bytes calldata) external { lastExam[r.agentId]=r; emit ExamRecorded(r.agentId,r.examId,msg.sender); }
  function recordMilestone(Milestone calldata m, bytes calldata) external { lastMilestone[m.agentId]=m; emit MilestoneRecorded(m.agentId,m.milestoneId,msg.sender); }
}
