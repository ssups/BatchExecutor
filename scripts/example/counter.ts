import hre, { ethers } from "hardhat";
import { Counter__factory } from "../../typechain-types";

async function main() {
  // deploy
  const BatchExecutorF = await hre.ethers.getContractFactory("BatchExecutor");
  const BatchExecutorC = await BatchExecutorF.deploy();
  await BatchExecutorC.deployed();
  const counterF = await hre.ethers.getContractFactory("Counter");
  const counterC = await counterF.deploy();
  await counterC.deployed();

  const signer = (await hre.ethers.getSigners())[0];
  const iCounter = new hre.ethers.utils.Interface(Counter__factory.abi);

  // addCount1
  console.log("@@@@@@@@@@@@@@ addCount1 @@@@@@@@@@@@@@");
  {
    const batchSize = 10;
    const dataArr = new Array(batchSize)
      .fill(0)
      .map(() => iCounter.encodeFunctionData("addCount1", []));
    const valueArr = new Array(batchSize).fill(0);
    const beforeCount = await counterC.count();
    console.log("before: ", beforeCount.toString());
    // send tx
    const tx = await BatchExecutorC.connect(signer).batchExecutor1(
      counterC.address,
      dataArr,
      valueArr,
      { gasLimit: 10000000 }
    );
    await tx.wait();

    const afterCount = await counterC.count();
    console.log("after: ", afterCount.toString());
  }

  // addCount2
  console.log("");
  console.log("@@@@@@@@@@@@@@ addCount2 @@@@@@@@@@@@@@");
  {
    const argsArr = [[1], [2], [3], [4], [5], [6], [7], [8], [9], [10]];
    const dataArr = argsArr.map((args) => iCounter.encodeFunctionData("addCount2", [...args]));
    const valueArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

    // send tx
    const beforeCount = await counterC.count();
    console.log("before: ", beforeCount.toString());
    const tx = await BatchExecutorC.connect(signer).batchExecutor1(
      counterC.address,
      dataArr,
      valueArr
    );
    await tx.wait();

    const afterCount = await counterC.count();
    console.log("after: ", afterCount.toString());
  }

  // addCount3
  console.log("");
  console.log("@@@@@@@@@@@@@@ addCount3 @@@@@@@@@@@@@@");
  {
    const batchSize = 3;
    const argsArr = [];
    const userArr = [];
    for (let i = 0; i < batchSize; i++) {
      const user = hre.ethers.Wallet.createRandom().address;
      const userCount = (i + 1) * 100;
      argsArr.push([user, userCount]);
      userArr.push(user);
    }
    const dataArr = argsArr.map((args) => iCounter.encodeFunctionData("addCount3", [...args]));
    const valueArr = new Array(batchSize).fill(0);

    // send tx
    type User_Count = { [user: string]: string };
    const user_count: User_Count = {};
    let promises = userArr.map(async (user) => {
      user_count[user] = (await counterC.userCount(user)).toString();
    });
    await Promise.all(promises);
    console.log("before: ", user_count);

    const tx = await BatchExecutorC.connect(signer).batchExecutor1(
      counterC.address,
      dataArr,
      valueArr
    );
    await tx.wait();

    promises = userArr.map(async (user) => {
      user_count[user] = (await counterC.userCount(user)).toString();
    });
    await Promise.all(promises);
    console.log("after: ", user_count);
  }
}

main().catch((error) => {
  console.log(error);
  process.exitCode = 1;
});
