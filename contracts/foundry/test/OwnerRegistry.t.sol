// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import "forge-std/Test.sol";
import "../src/mock/MockOwnerRegistry.sol";
contract OwnerRegistryTest is Test {
  MockOwnerRegistry reg;
  function setUp() public { reg = new MockOwnerRegistry(); }
  function testBanAndSuspend() public {
    address alice = address(0xA11CE);
    assertFalse(reg.isBanned(alice));
    reg.setBanned(alice, true); assertTrue(reg.isBanned(alice));
    reg.setSuspended(alice, true); assertTrue(reg.isSuspended(alice));
    reg.setBanned(alice, false); assertFalse(reg.isBanned(alice));
  }
}
