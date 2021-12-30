import React, { useState } from "react";
import styled, { css } from 'styled-components';
import Loader from 'react-loader-spinner'
import axios from "axios";
import { postReq } from "api";
import { useWeb3React } from '@web3-react/core'
import { useDispatch, useSelector } from "react-redux";
import { toast as toaster } from "react-toastify";
import ChannelsDataStore from "singletons/ChannelsDataStore";
import * as dotenv from "dotenv";
dotenv.config();

const SpamNotificationItem=({channelBody,ChannelTitle,ChannelIcon,channelAddress})=>{
  const { account ,library,chainId} = useWeb3React();
  const [loading, setLoading] = React.useState(false);
  const [txInProgress, setTxInProgress] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState();
  const [memberCount, setMemberCount] = React.useState(0);
 
  const {
    epnsReadProvider,
    epnsWriteProvider,
    epnsCommReadProvider,
    pushAdminAddress,
    ZERO_ADDRESS,
  } = useSelector((state) => state.contracts);
  React.useEffect(() => {
    if (!channelAddress) return;
    if (true) {
      // procced as usual
      fetchChannelJson().catch((err) => alert(err.message));
      
    } else {
      // if this key (verifiedBy) is not present it means we are searching and should fetch the channel object from chain again
      epnsReadProvider.channels(channelAddress).then((response) => {
        fetchChannelJson();
      });
    }
  }, [account, chainId]);
  const fetchChannelJson = async () => {
    try {
      
      const channelSubscribers = await ChannelsDataStore.instance.getChannelSubscribers(
        channelAddress
      );
      const subscribed = channelSubscribers.find((sub) => {
        return sub.toLowerCase() === account.toLowerCase();
      });

     
      setSubscribed(subscribed);
     
     
      setLoading(false);
    } catch (err) {
    }
  };
  // React.useEffect(() => {
  //   const fetchChannelJson = async () => {
  //     try {
  //       let channelJson = {};
        
  //       const channelSubscribers = []
  //       // await ChannelsDataStore.instance.getChannelSubscribers(
  //       //   channelAddress
  //       // );
  //       const subscribed = channelSubscribers.find((sub) => {
  //         return sub.toLowerCase() === account.toLowerCase();
  //       });
  
  //       setSubscribed(subscribed);
        
  //       setLoading(false);
  //     } catch (err) {
  //       alert(err);
  //     }
  //   };
    
      
  //       fetchChannelJson().catch((err) => alert(err.message));
     
  // }, [account]);
  
  const EPNS_DOMAIN = {
    name: "EPNS COMM V1",
    chainId: chainId,
    verifyingContract: epnsCommReadProvider.address,
  };

  const subscribe = async () => {
    subscribeAction(channelAddress);
  };

  const subscribeAction = async (channelAddress) => {
    setTxInProgress(true);
    let txToast;
    try {
      const type = {
        Subscribe: [
          { name: "channel", type: "address" },
          { name: "subscriber", type: "address" },
          { name: "action", type: "string" },
        ],
      };
      const message = {
        channel: channelAddress,
        subscriber: account,
        action: "Subscribe",
      };

      const signature = await library
        .getSigner(account)
        ._signTypedData(EPNS_DOMAIN, type, message);
      txToast = toaster.dark(
        <LoaderToast msg="Waiting for Confirmation..." color="#35c5f3" />,
        {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      postReq("/channels/subscribe_offchain", {
        signature,
        message,
        op: "write",
        chainId,
        contractAddress: epnsCommReadProvider.address,
      }).then((res) => {
        setSubscribed(true);
        setMemberCount(memberCount + 1);
        toaster.update(txToast, {
          render: "Sucesfully opted into channel !",
          type: toaster.TYPE.SUCCESS,
          autoClose: 5000,
        });
        console.log(res);
        setTxInProgress(false);
      });
    } catch (err) {
      toaster.update(txToast, {
        render: "There was an error opting into channel (" + err.message + ")",
        type: toaster.TYPE.ERROR,
        autoClose: 5000,
      });
      console.log(err);
    } finally {
      setTxInProgress(false);
    }
  };
  const unsubscribeAction = async (channelAddress) => {
    let txToast;
    try {
      const type = {
        Unsubscribe: [
          { name: "channel", type: "address" },
          { name: "unsubscriber", type: "address" },
          { name: "action", type: "string" },
        ],
      };
      const message = {
        channel: channelAddress,
        unsubscriber: account,
        action: "Unsubscribe",
      };
      const signature = await library
        .getSigner(account)
        ._signTypedData(EPNS_DOMAIN, type, message);

      txToast = toaster.dark(
        <LoaderToast msg="Waiting for Confirmation..." color="#35c5f3" />,
        {
          position: "bottom-right",
          autoClose: false,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );

      postReq("/channels/unsubscribe_offchain", {
        signature,
        message,
        op: "write",
        chainId,
        contractAddress: epnsCommReadProvider.address,
      })
        .then((res) => {
          setSubscribed(false);
          setMemberCount(memberCount + 1);
          toaster.update(txToast, {
            render: "Sucesfully opted out of channel !",
            type: toaster.TYPE.SUCCESS,
            autoClose: 5000,
          });
          console.log(res);
        })
        .catch((err) => {
          toaster.update(txToast, {
            render:
              "There was an error opting into channel (" + err.message + ")",
            type: toaster.TYPE.ERROR,
            autoClose: 5000,
          });
          console.log(err);
        })
        .finally(() => {
          setTxInProgress(false);
        });
    } finally {
      setTxInProgress(false);
    }
  };
  // toast customize
  const LoaderToast = ({ msg, color }) => (
    <Toaster>
      <Loader type="Oval" color={color} height={30} width={30} />
      <ToasterMsg>{msg}</ToasterMsg>
    </Toaster>
  );
    return(
        <SpamCard>
                 <div className="cardHeader">
                   <img src={ChannelIcon} alt="" className="icon" />
                   {ChannelTitle}
                 </div>
                 <div className="cardBody">
                   {channelBody}
                 </div>
                 {!loading && !subscribed && (
                 <button style={{background:"#e22780"}} className="Button" onClick={e=>subscribe()} disabled={txInProgress}>
                {txInProgress && (
                  <ActionLoader>
                    <Loader type="Oval" color="#FFF" height={16} width={16} />
                  </ActionLoader>
                )}
                <ActionTitle hideit={txInProgress}>Opt-In</ActionTitle>
              </button >)}
              {!loading && subscribed && (
              <>
               
                  <button className="Button"
                    onClick={e=>unsubscribeAction(channelAddress)}
                    
                    disabled={txInProgress}
                  >
                    {txInProgress && (
                      <ActionLoader>
                        <Loader
                          type="Oval"
                          color="#FFF"
                          height={16}
                          width={16}
                        />
                      </ActionLoader>
                    )}
                    <ActionTitle hideit={txInProgress}>Opt-Out</ActionTitle>
                  </button>
                
              </>
             )} 
               </SpamCard>
    )
}



const SpamCard=styled.div`
  display:flex;
  justify-content:space-around;
  align-items:center;
  background:#f2f2f2;
  min-height:150px;
  border-radius:14px;
  margin:1rem 0;
  position:relative;

  .Button{
    position:absolute;
    background:#674c9f;
    top:10px;
    right:10px;
    padding:5px 10px;
    border-radius:10px;

  }
  .icon{
    height:50px;
    width:50px;
  }

  .cardHeader{
    display:flex;
    flex-direction:column;
    flex:1;
    justify-content:space-between;
    height:100px;
    align-Items:center;
  }
  .cardBody{
    flex:3;
  }
`;

const ActionTitle = styled.span`
  ${(props) =>
    props.hideit &&
    css`
      visibility: hidden;
    `};
`;

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
const SpamBoxContainer = styled.div`
  padding: 10px 20px;
  display: block;
  align-self: stretch;
  background: #fafafa;
  overflow:scroll;
  
`

const Toaster = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0px 10px;
`;

const ActionLoader = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;


const ToasterMsg = styled.div`
  margin: 0px 10px;
`;
export default SpamNotificationItem;