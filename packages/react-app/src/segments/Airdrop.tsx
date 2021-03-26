import React from "react";
import styled, { css } from 'styled-components';
import Loader from 'react-loader-spinner'
import { ToastContainer, toast } from 'react-toastify';

import { useWeb3React } from '@web3-react/core'
import { addresses, abis } from "@project/contracts";
import { ethers } from "ethers";

import AirdropHelper from 'helpers/AirdropHelper';

import ViewInfoItem from "components/ViewInfoItem";

import * as dotenv from "dotenv";
import UsersDataStore from "singletons/UsersDataStore";
dotenv.config();

// Other Information section
function Airdrop() {
  const { account, library } = useWeb3React();

  const [controlAt, setControlAt] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [ txInProgress, setTxInProgress ] = React.useState(false);
  const [distributorContract, setDistributorContract] = React.useState(null);
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    if (!!(library && account)) {
      let signer = library.getSigner(account);
      const signerInstance = new ethers.Contract(addresses.distributor, abis.distributor, signer);
      setDistributorContract(signerInstance);
      // const NFTRewardsInstance = new ethers.Contract(addresses.NFTRewards, abis.NFTRewards, signer);
      // setNFTRewardsContract(NFTRewardsInstance);
    }
  }, [account,library]);

  React.useEffect(() => {
    if(distributorContract){
      checkClaim();
    }
  }, [account, distributorContract]);

  // to check wh
  const checkClaim = async () => {
    let user = await AirdropHelper.verifyAddress(account, distributorContract);
    setUser(user)
    if(user)
    setLoading(false)
  }

  // to claim
  const handleClaim = async (user) => {
    if(distributorContract){
      setTxInProgress(true)
      let sendWithTxPromise
      sendWithTxPromise = await distributorContract.claim(user.index, user.account, user.amount, user.proof)
      const tx = await sendWithTxPromise;
      console.log(tx);
      console.log("waiting for tx to finish");
      let txToast = toast.dark(<LoaderToast msg="Waiting for Confirmation..." color="#35c5f3"/>, {
        position: "bottom-right",
        autoClose: false,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      try {
        await library.waitForTransaction(tx.hash);

        toast.update(txToast, {
          render: "Transaction Completed!",
          type: toast.TYPE.SUCCESS,
          autoClose: 5000
        });

        setTxInProgress(false);
      }
      catch(e) {
        toast.update(txToast, {
          render: "Transaction Failed! (" + e.name + ")",
          type: toast.TYPE.ERROR,
          autoClose: 5000
        });

        setTxInProgress(false);
      }
      setLoading(false);
    }
  }

  // toast customize
  const LoaderToast = ({ msg, color }) => (
    <Toaster>
      <Loader
       type="Oval"
       color={color}
       height={30}
       width={30}
      />
      <ToasterMsg>{msg}</ToasterMsg>
    </Toaster>
  )

  return (
    <Container>
      {loading &&
        <ContainerInfo>
          <Loader
           type="Oval"
           color="#35c5f3"
           height={40}
           width={40}
          />
        </ContainerInfo>
      }

      {!loading && controlAt == 0 && 
        <>
          <InfoBox>
            <Container >
              <ChannelInfo>
                <ChannelTitle>
                  {user.verified && user.claimable &&
                    <Continue theme='#674c9f' onClick={() => {handleClaim(user)}}>Claim $PUSH Tokens</Continue>
                  }
                  {user.verified && !user.claimable &&
                    <Continue theme='#674c9f'>$PUSH Tokens Claimed</Continue>
                  }
                  {!user.verified &&
                    <Continue theme='#674c9f'>Ineligible</Continue>
                  }
                </ChannelTitle>
              </ChannelInfo>
            </Container>
          </InfoBox>
        </>
      }
    </Container>
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

const ContainerInfo = styled.div`
  padding: 20px;
`
const InfoBox = styled.div`
  padding: 10px 20px;
  display: block;
  align-self: stretch;
  background: #fafafa;
`
const Continue = styled.button`
  border: 0;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 20px;
  font-size: 14px;
  background: ${props => props.theme || '#674c9f'};
  margin: 30px 0px 0px 0px;
  border-radius: 8px;
  padding: 16px;
  font-size: 16px;
  font-weight: 400;
`

const ChannelTitleLink = styled.a`
  text-decoration: none;
  font-weight: 600;
  color: #e20880;
  font-size: 20px;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
    pointer: hand;
  }
`
const AppLink = styled.a`
  text-decoration: none;
  font-weight: 600;
  color: #e20880;
  font-size: 20px;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
    pointer: hand;
  }
`
const AppLinkText = styled.div`
  text-decoration: none;
  font-weight: 600;
  color: #e20880;
  font-size: 20px;
`
const ChannelInfo = styled.div`
  flex: 1;
  margin: 5px 10px;
  min-width: 120px;
  flex-grow: 4;
  flex-direction: column;
  display: flex;
`

const ChannelTitle = styled.div`
  margin-bottom: 5px;
`

const Toaster = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0px 10px;
`

const ToasterMsg = styled.div`
  margin: 0px 10px;
`


// Export Default
export default Airdrop;
