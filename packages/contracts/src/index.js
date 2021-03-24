import erc20Abi from "./abis/erc20";
import ownableAbi from "./abis/ownable";
import epnscoreAbi from "./abis/epnscore";
import daiAbi from "./abis/dai";
import epnsTokenAbi from "./abis/EPNS.json";
import stakingAbi from "./abis/Staking.json";
import yieldFarmingAbi from "./abis/YieldFarm.json";

export const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  epnscore: epnscoreAbi,
  dai: daiAbi,
  epnsToken: epnsTokenAbi,
  staking: stakingAbi,
  yieldFarming: yieldFarmingAbi
};

export { default as addresses } from "./addresses";
