import erc20Abi from "./abis/erc20";
import ownableAbi from "./abis/ownable";
import epnscoreAbi from "./abis/epnscore";
import daiAbi from "./abis/dai";
import rockstarAbi from "./abis/Rockstar.json";
import ec721Abi from "./abis/ERC721.json";
import NFTRewards from "./abis/NFTRewards.json";

export const abis = {
  erc20: erc20Abi,
  ownable: ownableAbi,
  epnscore: epnscoreAbi,
  dai: daiAbi,
  rockstar: rockstarAbi,
  erc721: ec721Abi,
  NFTRewards: NFTRewards,
  
};

export { default as addresses } from "./addresses";
