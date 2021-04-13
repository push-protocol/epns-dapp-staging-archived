import React from "react";
import styled, { css } from 'styled-components';
import Loader from 'react-loader-spinner'
import { Waypoint } from "react-waypoint";

import { useWeb3React } from '@web3-react/core'
import { addresses, abis } from "@project/contracts";
import NFTHelper from 'helpers/NFTHelper';
import { ethers } from "ethers";

import DisplayNotice from "components/DisplayNotice";
import ViewNFTItem from "components/ViewNFTItem";
import MyNFTs from "components/MyNFTs";
import AllNFTs from "components/AllNFTs";
import TransferNFT from "components/TransferNFT";

// Create Header
function NFT({ epnsReadProvider, epnsWriteProvide }) {
  const { account, library } = useWeb3React();

  const [tokenId, setTokenId] = React.useState(null);
  const [controlAt, setControlAt] = React.useState(0);
  const [loading, setLoading] = React.useState(true);


  React.useEffect(() => {
    userClickedAt(0);
  }, [account]);

  // handle user action at control center
  const userClickedAt = (controlIndex) => {
    setControlAt(controlIndex);
  }

  return (
    <>
    <Container>
      <Controls>
        <SubscribeButton index={0} active={controlAt == 0 ? 1 : 0} onClick={() => {userClickedAt(0)}} >
        <ActionTitle >My NFTs</ActionTitle>
      </SubscribeButton>
      <SubscribeButton index={1} active={controlAt == 1 ? 1 : 0} onClick={() => {userClickedAt(1)}}>
        <ActionTitle >All NFTs</ActionTitle>
      </SubscribeButton>

      </Controls>
      {controlAt == 0 &&
          <MyNFTs 
            controlAt={controlAt} 
            setControlAt={setControlAt} 
            setTokenId={setTokenId}
          />
      }
      {controlAt == 1 &&
          <AllNFTs
            controlAt={controlAt} 
            setControlAt={setControlAt} 
            setTokenId={setTokenId}
          />
      }
      {controlAt == 2 && tokenId &&
          <TransferNFT tokenId={tokenId}/>
      }
    </Container>
    </>
  );
}

// css styles
const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  font-weight: 200;
  align-content: center;
  align-items: center;
  justify-content: center;

  max-height: 80vh;
`

const Controls = styled.div`
  flex: 0;
  display: flex;
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`
const ContainerInfo = styled.div`
  padding: 20px;
`

const Items = styled.div`
  display: block;
  align-self: stretch;
  padding: 10px 20px;
  overflow-y: scroll;
  background: #fafafa;
`

const ChannelActionButton = styled.button`
  border: 0;
  outline: 0;
  display: flex;
  align-items: left;
  // align-items: center;
  justify-content: flex-end;
  // justify-content: center;
  padding: 8px 15px;
  margin: 10px;
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 400;
  position: relative;
  &:hover {
    opacity: 0.9;
    cursor: pointer;
    pointer: hand;
  }
  &:active {
    opacity: 0.75;
    cursor: pointer;
    pointer: hand;
  }
  ${ props => props.disabled && css`
    &:hover {
      opacity: 1;
      cursor: default;
      pointer: default;
    }
    &:active {
      opacity: 1;
      cursor: default;
      pointer: default;
    }
  `}
`

const SubscribeButton = styled(ChannelActionButton)`
  background: #e20880;
`

const ActionTitle = styled.span`
  ${ props => props.hideit && css`
    visibility: hidden;
  `};
`

// Export Default
export default NFT;
