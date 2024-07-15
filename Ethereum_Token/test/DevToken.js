const { expect } = require("chai");
const hre = require("hardhat");

describe("DevToken contract", function() {
    // global variables
    let Token;
    let devToken;
    let owner;
    let addr1;
    let addr2;
    let tokenCap = 100000000;
    let tokenBlockReward = 50;

    beforeEach(async function() {
        Token = await ethers.getContractFactory("DevToken", {
            contractFilePath: "contracts/devtoken.sol"
          });
        [owner, addr1, addr2] = await hre.ethers.getSigners();
        // console.log("Owner address: ", owner.address);
        devToken = await Token.deploy(tokenCap, tokenBlockReward);
    });

    describe("Deployment", function () {
        it("Should set the right owner", async function () {
            expect(await devToken.owner()).to.equal(owner.address);
        });
      
        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await devToken.balanceOf(owner.address);
            expect(await devToken.totalSupply()).to.equal(ownerBalance);
        });
      
        it("Should set the max capped supply to the argument provided during deployment", async function () {
            const cap = await devToken.cap();
            expect(Number(ethers.formatEther(cap))).to.equal(tokenCap);
        });
      
        it("Should set the blockReward to the argument provided during deployment", async function () {
            const blockReward = await devToken.blockReward();
            expect(Number(ethers.formatEther(blockReward))).to.equal(tokenBlockReward);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            await devToken.transfer(addr1.address, 50);
            const addr1Balance = await devToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(50);

            await devToken.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await devToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn't have enough tokens", async function () {
            const initialOwnerBalance = await devToken.balanceOf(owner.address);
            await expect(
                devToken.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWithCustomError(devToken, "ERC20InsufficientBalance");

            expect(await devToken.balanceOf(owner.address)).to.equal(
                initialOwnerBalance
            );
        });
        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await devToken.balanceOf(owner.address);

            await devToken.transfer(addr1.address, 100);
            await devToken.transfer(addr2.address, 50);

            const finalOwnerBalance = await devToken.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - BigInt(150));

            const addr1Balance = await devToken.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(BigInt(100));

            const addr2Balance = await devToken.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(BigInt(50));
        });
    });
});