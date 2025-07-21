import { ethers } from "hardhat";

async function main() {
  const ownerName = "João Pedro Della Rocca de Camargos"; 

  const Counter = await ethers.getContractFactory("Counter");

  const counter = await Counter.deploy(ownerName);

  await counter.waitForDeployment();

  console.log(
    `Contrato Counter implantado por ${ownerName} no endereço: ${await counter.getAddress()}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
