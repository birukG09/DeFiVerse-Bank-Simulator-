// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

/**
 * @title DeFiVerse Bank Token
 * @dev Main governance and utility token for DeFiVerse platform
 */
contract DeFiVerseToken is ERC20, ERC20Burnable, Ownable, Pausable {
    uint256 public constant MAX_SUPPLY = 1000000000 * 10**18; // 1 billion tokens
    uint256 public constant INITIAL_SUPPLY = 100000000 * 10**18; // 100 million initial
    
    mapping(address => bool) public minters;
    mapping(address => uint256) public mintingAllowance;
    
    event MinterAdded(address indexed minter, uint256 allowance);
    event MinterRemoved(address indexed minter);
    event TokensMinted(address indexed to, uint256 amount, address indexed minter);
    event TokensBurned(address indexed from, uint256 amount);
    
    constructor() ERC20("DeFiVerse Bank Token", "BANK") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }
    
    modifier onlyMinter() {
        require(minters[msg.sender], "Not authorized minter");
        _;
    }
    
    function addMinter(address _minter, uint256 _allowance) external onlyOwner {
        minters[_minter] = true;
        mintingAllowance[_minter] = _allowance;
        emit MinterAdded(_minter, _allowance);
    }
    
    function removeMinter(address _minter) external onlyOwner {
        minters[_minter] = false;
        mintingAllowance[_minter] = 0;
        emit MinterRemoved(_minter);
    }
    
    function mint(address to, uint256 amount) external onlyMinter whenNotPaused {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        require(mintingAllowance[msg.sender] >= amount, "Exceeds minting allowance");
        
        mintingAllowance[msg.sender] -= amount;
        _mint(to, amount);
        emit TokensMinted(to, amount, msg.sender);
    }
    
    function burn(uint256 amount) public override {
        super.burn(amount);
        emit TokensBurned(msg.sender, amount);
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function _beforeTokenTransfer(address from, address to, uint256 amount)
        internal
        override
        whenNotPaused
    {
        super._beforeTokenTransfer(from, to, amount);
    }
}

/**
 * @title DeFiVerse Staking Pool
 * @dev Handles staking operations with dynamic APY calculation
 */
contract StakingPool is ReentrancyGuard, Ownable, Pausable {
    IERC20 public stakingToken;
    IERC20 public rewardToken;
    
    struct StakeInfo {
        uint256 amount;
        uint256 startTime;
        uint256 lastClaimTime;
        uint256 rewardsEarned;
    }
    
    mapping(address => StakeInfo) public stakes;
    mapping(address => bool) public isStaking;
    
    uint256 public totalStaked;
    uint256 public rewardRate = 100; // 1% per day (100 basis points)
    uint256 public constant SECONDS_PER_DAY = 86400;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public minStakeAmount = 100 * 10**18;
    
    event Staked(address indexed user, uint256 amount);
    event Unstaked(address indexed user, uint256 amount);
    event RewardsClaimed(address indexed user, uint256 amount);
    event RewardRateUpdated(uint256 newRate);
    
    constructor(address _stakingToken, address _rewardToken) {
        stakingToken = IERC20(_stakingToken);
        rewardToken = IERC20(_rewardToken);
    }
    
    function stake(uint256 _amount) external nonReentrant whenNotPaused {
        require(_amount >= minStakeAmount, "Amount below minimum");
        require(stakingToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");
        
        if (isStaking[msg.sender]) {
            // Claim existing rewards before adding to stake
            _claimRewards();
            stakes[msg.sender].amount += _amount;
        } else {
            stakes[msg.sender] = StakeInfo({
                amount: _amount,
                startTime: block.timestamp,
                lastClaimTime: block.timestamp,
                rewardsEarned: 0
            });
            isStaking[msg.sender] = true;
        }
        
        totalStaked += _amount;
        emit Staked(msg.sender, _amount);
    }
    
    function unstake(uint256 _amount) external nonReentrant {
        require(isStaking[msg.sender], "Not staking");
        require(stakes[msg.sender].amount >= _amount, "Insufficient staked amount");
        
        _claimRewards();
        
        stakes[msg.sender].amount -= _amount;
        totalStaked -= _amount;
        
        if (stakes[msg.sender].amount == 0) {
            isStaking[msg.sender] = false;
        }
        
        require(stakingToken.transfer(msg.sender, _amount), "Transfer failed");
        emit Unstaked(msg.sender, _amount);
    }
    
    function claimRewards() external nonReentrant {
        require(isStaking[msg.sender], "Not staking");
        _claimRewards();
    }
    
    function _claimRewards() internal {
        uint256 rewards = calculateRewards(msg.sender);
        if (rewards > 0) {
            stakes[msg.sender].rewardsEarned += rewards;
            stakes[msg.sender].lastClaimTime = block.timestamp;
            require(rewardToken.transfer(msg.sender, rewards), "Reward transfer failed");
            emit RewardsClaimed(msg.sender, rewards);
        }
    }
    
    function calculateRewards(address _user) public view returns (uint256) {
        if (!isStaking[_user]) return 0;
        
        StakeInfo memory userStake = stakes[_user];
        uint256 timeStaked = block.timestamp - userStake.lastClaimTime;
        uint256 dailyReward = (userStake.amount * rewardRate) / BASIS_POINTS;
        
        return (dailyReward * timeStaked) / SECONDS_PER_DAY;
    }
    
    function getAPY() public view returns (uint256) {
        return (rewardRate * 365) / 100; // Convert daily rate to annual percentage
    }
    
    function updateRewardRate(uint256 _newRate) external onlyOwner {
        require(_newRate <= 1000, "Rate too high"); // Max 10% daily
        rewardRate = _newRate;
        emit RewardRateUpdated(_newRate);
    }
    
    function emergencyWithdraw() external onlyOwner {
        uint256 balance = stakingToken.balanceOf(address(this));
        require(stakingToken.transfer(owner(), balance), "Transfer failed");
    }
}

/**
 * @title DeFiVerse Lending Protocol
 * @dev Handles collateralized lending with liquidation mechanisms
 */
contract LendingProtocol is ReentrancyGuard, Ownable, Pausable {
    struct Loan {
        uint256 id;
        address borrower;
        address collateralToken;
        address borrowToken;
        uint256 collateralAmount;
        uint256 borrowAmount;
        uint256 interestRate;
        uint256 startTime;
        uint256 lastUpdateTime;
        bool isActive;
        uint256 accruedInterest;
    }
    
    mapping(uint256 => Loan) public loans;
    mapping(address => uint256[]) public userLoans;
    mapping(address => bool) public supportedTokens;
    mapping(address => uint256) public collateralRatios; // Basis points (7500 = 75%)
    
    uint256 public nextLoanId = 1;
    uint256 public constant BASIS_POINTS = 10000;
    uint256 public liquidationThreshold = 8000; // 80%
    
    event LoanCreated(uint256 indexed loanId, address indexed borrower, uint256 collateralAmount, uint256 borrowAmount);
    event LoanRepaid(uint256 indexed loanId, uint256 amount);
    event LoanLiquidated(uint256 indexed loanId, address indexed liquidator);
    event CollateralAdded(uint256 indexed loanId, uint256 amount);
    
    function createLoan(
        address _collateralToken,
        address _borrowToken,
        uint256 _collateralAmount,
        uint256 _borrowAmount,
        uint256 _interestRate
    ) external nonReentrant whenNotPaused returns (uint256) {
        require(supportedTokens[_collateralToken], "Collateral token not supported");
        require(supportedTokens[_borrowToken], "Borrow token not supported");
        require(_collateralAmount > 0 && _borrowAmount > 0, "Invalid amounts");
        
        // Check collateral ratio
        uint256 maxBorrow = (_collateralAmount * collateralRatios[_collateralToken]) / BASIS_POINTS;
        require(_borrowAmount <= maxBorrow, "Insufficient collateral");
        
        // Transfer collateral
        require(IERC20(_collateralToken).transferFrom(msg.sender, address(this), _collateralAmount), "Collateral transfer failed");
        
        // Create loan
        uint256 loanId = nextLoanId++;
        loans[loanId] = Loan({
            id: loanId,
            borrower: msg.sender,
            collateralToken: _collateralToken,
            borrowToken: _borrowToken,
            collateralAmount: _collateralAmount,
            borrowAmount: _borrowAmount,
            interestRate: _interestRate,
            startTime: block.timestamp,
            lastUpdateTime: block.timestamp,
            isActive: true,
            accruedInterest: 0
        });
        
        userLoans[msg.sender].push(loanId);
        
        // Transfer borrowed tokens
        require(IERC20(_borrowToken).transfer(msg.sender, _borrowAmount), "Borrow transfer failed");
        
        emit LoanCreated(loanId, msg.sender, _collateralAmount, _borrowAmount);
        return loanId;
    }
    
    function repayLoan(uint256 _loanId, uint256 _amount) external nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.isActive, "Loan not active");
        require(loan.borrower == msg.sender, "Not loan owner");
        
        updateLoanInterest(_loanId);
        
        uint256 totalOwed = loan.borrowAmount + loan.accruedInterest;
        require(_amount <= totalOwed, "Amount exceeds debt");
        
        require(IERC20(loan.borrowToken).transferFrom(msg.sender, address(this), _amount), "Repayment failed");
        
        if (_amount >= totalOwed) {
            // Full repayment
            loan.isActive = false;
            require(IERC20(loan.collateralToken).transfer(msg.sender, loan.collateralAmount), "Collateral return failed");
        } else {
            // Partial repayment
            if (_amount > loan.accruedInterest) {
                loan.borrowAmount -= (_amount - loan.accruedInterest);
                loan.accruedInterest = 0;
            } else {
                loan.accruedInterest -= _amount;
            }
        }
        
        emit LoanRepaid(_loanId, _amount);
    }
    
    function addCollateral(uint256 _loanId, uint256 _amount) external nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.isActive, "Loan not active");
        require(loan.borrower == msg.sender, "Not loan owner");
        
        require(IERC20(loan.collateralToken).transferFrom(msg.sender, address(this), _amount), "Collateral transfer failed");
        loan.collateralAmount += _amount;
        
        emit CollateralAdded(_loanId, _amount);
    }
    
    function liquidateLoan(uint256 _loanId) external nonReentrant {
        Loan storage loan = loans[_loanId];
        require(loan.isActive, "Loan not active");
        
        updateLoanInterest(_loanId);
        
        uint256 healthFactor = calculateHealthFactor(_loanId);
        require(healthFactor < liquidationThreshold, "Loan is healthy");
        
        uint256 totalDebt = loan.borrowAmount + loan.accruedInterest;
        require(IERC20(loan.borrowToken).transferFrom(msg.sender, address(this), totalDebt), "Liquidation payment failed");
        
        // Transfer collateral to liquidator (with liquidation bonus)
        uint256 liquidationBonus = (loan.collateralAmount * 500) / BASIS_POINTS; // 5% bonus
        uint256 liquidatorReward = loan.collateralAmount + liquidationBonus;
        
        require(IERC20(loan.collateralToken).transfer(msg.sender, liquidatorReward), "Liquidation reward failed");
        
        loan.isActive = false;
        emit LoanLiquidated(_loanId, msg.sender);
    }
    
    function updateLoanInterest(uint256 _loanId) public {
        Loan storage loan = loans[_loanId];
        if (!loan.isActive) return;
        
        uint256 timeElapsed = block.timestamp - loan.lastUpdateTime;
        uint256 interest = (loan.borrowAmount * loan.interestRate * timeElapsed) / (BASIS_POINTS * 365 days);
        
        loan.accruedInterest += interest;
        loan.lastUpdateTime = block.timestamp;
    }
    
    function calculateHealthFactor(uint256 _loanId) public view returns (uint256) {
        Loan memory loan = loans[_loanId];
        if (!loan.isActive) return 0;
        
        uint256 totalDebt = loan.borrowAmount + loan.accruedInterest;
        if (totalDebt == 0) return BASIS_POINTS;
        
        uint256 collateralValue = (loan.collateralAmount * collateralRatios[loan.collateralToken]) / BASIS_POINTS;
        return (collateralValue * BASIS_POINTS) / totalDebt;
    }
    
    function addSupportedToken(address _token, uint256 _collateralRatio) external onlyOwner {
        supportedTokens[_token] = true;
        collateralRatios[_token] = _collateralRatio;
    }
    
    function getUserLoans(address _user) external view returns (uint256[] memory) {
        return userLoans[_user];
    }
}

/**
 * @title DeFiVerse DAO Governance
 * @dev Handles proposal creation and voting mechanisms
 */
contract DAOGovernance is ReentrancyGuard, Ownable {
    struct Proposal {
        uint256 id;
        address proposer;
        string title;
        string description;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        bool cancelled;
        mapping(address => bool) hasVoted;
        mapping(address => uint256) voteWeight;
    }
    
    mapping(uint256 => Proposal) public proposals;
    uint256 public nextProposalId = 1;
    
    IERC20 public governanceToken;
    uint256 public proposalThreshold = 10000 * 10**18; // 10,000 tokens to propose
    uint256 public votingPeriod = 7 days;
    uint256 public quorumThreshold = 100000 * 10**18; // 100,000 tokens for quorum
    
    event ProposalCreated(uint256 indexed proposalId, address indexed proposer, string title);
    event VoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 weight);
    event ProposalExecuted(uint256 indexed proposalId);
    event ProposalCancelled(uint256 indexed proposalId);
    
    constructor(address _governanceToken) {
        governanceToken = IERC20(_governanceToken);
    }
    
    function createProposal(string memory _title, string memory _description) external returns (uint256) {
        require(governanceToken.balanceOf(msg.sender) >= proposalThreshold, "Insufficient tokens to propose");
        
        uint256 proposalId = nextProposalId++;
        Proposal storage proposal = proposals[proposalId];
        
        proposal.id = proposalId;
        proposal.proposer = msg.sender;
        proposal.title = _title;
        proposal.description = _description;
        proposal.startTime = block.timestamp;
        proposal.endTime = block.timestamp + votingPeriod;
        
        emit ProposalCreated(proposalId, msg.sender, _title);
        return proposalId;
    }
    
    function vote(uint256 _proposalId, bool _support) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp >= proposal.startTime, "Voting not started");
        require(block.timestamp <= proposal.endTime, "Voting ended");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        require(!proposal.executed && !proposal.cancelled, "Proposal not active");
        
        uint256 weight = governanceToken.balanceOf(msg.sender);
        require(weight > 0, "No voting power");
        
        proposal.hasVoted[msg.sender] = true;
        proposal.voteWeight[msg.sender] = weight;
        
        if (_support) {
            proposal.votesFor += weight;
        } else {
            proposal.votesAgainst += weight;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support, weight);
    }
    
    function executeProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp > proposal.endTime, "Voting still active");
        require(!proposal.executed && !proposal.cancelled, "Proposal not executable");
        require(proposal.votesFor > proposal.votesAgainst, "Proposal rejected");
        require(proposal.votesFor >= quorumThreshold, "Quorum not reached");
        
        proposal.executed = true;
        emit ProposalExecuted(_proposalId);
    }
    
    function cancelProposal(uint256 _proposalId) external {
        Proposal storage proposal = proposals[_proposalId];
        require(msg.sender == proposal.proposer || msg.sender == owner(), "Not authorized");
        require(!proposal.executed && !proposal.cancelled, "Proposal not cancellable");
        
        proposal.cancelled = true;
        emit ProposalCancelled(_proposalId);
    }
    
    function getProposalInfo(uint256 _proposalId) external view returns (
        uint256 id,
        address proposer,
        string memory title,
        string memory description,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 startTime,
        uint256 endTime,
        bool executed,
        bool cancelled
    ) {
        Proposal storage proposal = proposals[_proposalId];
        return (
            proposal.id,
            proposal.proposer,
            proposal.title,
            proposal.description,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.startTime,
            proposal.endTime,
            proposal.executed,
            proposal.cancelled
        );
    }
}
