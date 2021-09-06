pragma solidity ^0.8.4;

import "./IndexPool.sol";

interface ERC20 {
    function transfer(address, uint256) external;
}

/// @notice A pool that simply is an incentivized version of the index pool.
contract IncentivizedPool is IndexPool {
    mapping(address => uint256) public rewardDebt;

    uint256 public rewardPerShare;
    uint256 public rewardPerBlock;

    uint256 public lastRewardBlock;
    uint256 public bonusEndBlock;

    uint256 public allocPoint;
    uint256 public totalAllocPoint;

    uint256 public accPerShare;

    uint256 public constant BONUS_MULTIPLIER = 10;

    ERC20 public rewardToken;

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override {
        if (block.number <= lastRewardBlock) {
            return;
        }

        if (totalSupply == 0) {
            lastRewardBlock = block.number;
        }

        uint256 multiplier = getMultiplier(lastRewardBlock, block.number);
        uint256 reward = (multiplier * rewardPerBlock * allocPoint) / totalAllocPoint;

        accPerShare = accPerShare + ((reward * 1e12) / totalSupply);

        lastRewardBlock = block.number;

        if (balanceOf[from] > 0) {
            rewardToken.transfer(from, ((balanceOf[from] * accPerShare) / 1e12) - rewardDebt[from]);
        }

        rewardDebt[from] = ((balanceOf[from] * accPerShare) / 1e12);
    }

    function getMultiplier(uint256 _from, uint256 _to) public view returns (uint256) {
        if (_to <= bonusEndBlock) {
            return (_to - _from) * BONUS_MULTIPLIER;
        } else if (_from >= bonusEndBlock) {
            return _to - _from;
        } else {
            return (bonusEndBlock - _from) * BONUS_MULTIPLIER + (_to - (bonusEndBlock));
        }
    }
}
