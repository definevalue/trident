import { deployments, ethers } from "hardhat";
import { ConstantProductPool__factory, MasterDeployer } from "../../types";
import { expect } from "chai";

describe("Constant Product Pool", () => {
  before(async () => {
    await deployments.fixture(["MasterDeployer"]);
  });

  beforeEach(async () => {
    //
  });

  describe("#instantiation", () => {
    it("reverts if token0 is zero", async () => {
      const ConstantProductPool = await ethers.getContractFactory<ConstantProductPool__factory>("ConstantProductPool");
      const masterDeployer = await ethers.getContract<MasterDeployer>("MasterDeployer");
      const deployData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bool"],
        ["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000", 30, false]
      );
      await expect(ConstantProductPool.deploy(deployData, masterDeployer.address)).to.be.revertedWith("ZERO_ADDRESS");
    });

    // TODO: fix instantiation allowed if token1 is zero
    it("deploys if token1 is zero", async () => {
      const ConstantProductPool = await ethers.getContractFactory<ConstantProductPool__factory>("ConstantProductPool");
      const masterDeployer = await ethers.getContract<MasterDeployer>("MasterDeployer");
      const deployData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bool"],
        ["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000000", 30, false]
      );
      await expect(ConstantProductPool.deploy(deployData, masterDeployer.address)).to.not.be.revertedWith("ZERO_ADDRESS");
    });

    it("reverts if token0 and token1 are identical", async () => {
      const ConstantProductPool = await ethers.getContractFactory<ConstantProductPool__factory>("ConstantProductPool");
      const masterDeployer = await ethers.getContract<MasterDeployer>("MasterDeployer");
      const deployData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bool"],
        ["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000001", 30, false]
      );
      await expect(ConstantProductPool.deploy(deployData, masterDeployer.address)).to.be.revertedWith("IDENTICAL_ADDRESSES");
    });
    it("reverts if swap fee more than the max fee", async () => {
      const ConstantProductPool = await ethers.getContractFactory<ConstantProductPool__factory>("ConstantProductPool");
      const masterDeployer = await ethers.getContract<MasterDeployer>("MasterDeployer");
      const deployData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bool"],
        ["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000002", 10001, false]
      );
      await expect(ConstantProductPool.deploy(deployData, masterDeployer.address)).to.be.revertedWith("INVALID_SWAP_FEE");
    });
  });

  describe("#swap", function () {});

  describe("#flashSwap", function () {
    //
  });

  describe("#mint", function () {
    it("reverts if total supply is 0 and both token amounts are 0", async () => {
      const ConstantProductPool = await ethers.getContractFactory<ConstantProductPool__factory>("ConstantProductPool");
      const masterDeployer = await ethers.getContract<MasterDeployer>("MasterDeployer");
      const deployData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bool"],
        ["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000002", 30, false]
      );
      const constantProductPool = await ConstantProductPool.deploy(deployData, masterDeployer.address);
      await constantProductPool.deployed();
      const mintData = ethers.utils.defaultAbiCoder.encode(["address"], ["0x8f54C8c2df62c94772ac14CcFc85603742976312"]);
      await expect(constantProductPool.mint(mintData)).to.be.revertedWith("INVALID_AMOUNTS");
    });
  });

  describe("#burn", function () {
    //
  });

  describe("#burnSingle", function () {
    //
  });

  describe("#poolIdentifier", function () {
    //
  });

  describe("#getAssets", function () {
    it("returns the assets the pool was deployed with, and in the correct order", async () => {
      const ConstantProductPool = await ethers.getContractFactory<ConstantProductPool__factory>("ConstantProductPool");
      const masterDeployer = await ethers.getContract<MasterDeployer>("MasterDeployer");
      const deployData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bool"],
        ["0x0000000000000000000000000000000000000002", "0x0000000000000000000000000000000000000001", 30, false]
      );
      const constantProductPool = await ConstantProductPool.deploy(deployData, masterDeployer.address);
      await constantProductPool.deployed();

      const assets = await constantProductPool.getAssets();

      await expect(assets[0], "0x0000000000000000000000000000000000000001");
      await expect(assets[1], "0x0000000000000000000000000000000000000002");
    });
  });

  describe("#getAmountOut", function () {
    //
    it("reverts if tokenIn is equal to token1", async () => {
      const ConstantProductPool = await ethers.getContractFactory<ConstantProductPool__factory>("ConstantProductPool");
      const masterDeployer = await ethers.getContract<MasterDeployer>("MasterDeployer");
      const deployData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bool"],
        ["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000002", 30, false]
      );
      const constantProductPool = await ConstantProductPool.deploy(deployData, masterDeployer.address);
      await constantProductPool.deployed();
      await expect(
        constantProductPool.getAmountOut(
          ethers.utils.defaultAbiCoder.encode(["address", "uint256"], ["0x0000000000000000000000000000000000000003", 0])
        )
      ).to.be.revertedWith("INVALID_INPUT_TOKEN");
    });
  });

  describe("#getAmountIn", function () {
    it("reverts if tokenOut is equal to token0", async () => {
      const ConstantProductPool = await ethers.getContractFactory<ConstantProductPool__factory>("ConstantProductPool");
      const masterDeployer = await ethers.getContract<MasterDeployer>("MasterDeployer");
      const deployData = ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "uint256", "bool"],
        ["0x0000000000000000000000000000000000000001", "0x0000000000000000000000000000000000000002", 30, false]
      );
      const constantProductPool = await ConstantProductPool.deploy(deployData, masterDeployer.address);
      await constantProductPool.deployed();
      await expect(
        constantProductPool.getAmountIn(
          ethers.utils.defaultAbiCoder.encode(["address", "uint256"], ["0x0000000000000000000000000000000000000003", 0])
        )
      ).to.be.revertedWith("INVALID_OUTPUT_TOKEN");
    });
  });

  describe("#getNativeReserves", function () {
    //
  });
});
