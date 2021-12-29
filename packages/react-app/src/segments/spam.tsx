import React, { useState } from "react";
import styled, { css } from 'styled-components';
import Loader from 'react-loader-spinner'
import axios from "axios";
import { toast as toaster } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useWeb3React } from '@web3-react/core'
import {
  NotificationItem,
} from "@epnsproject/frontend-sdk-staging";
import { postReq } from "api";

import * as dotenv from "dotenv";
dotenv.config();

// Other Information section
function SpamBox() {
  const { account ,library,chainId} = useWeb3React();
  const { epnsWriteProvider,epnsCommReadProvider, epnsCommWriteProvider } = useSelector(
    (state: any) => state.contracts
  );
  const [controlAt, setControlAt] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [spamNotification,setSpamNotification]=React.useState([]);
  const [txInProgress, setTxInProgress] = React.useState(false);
  const [subscribed, setSubscribed] = React.useState(false);
  const [memberCount, setMemberCount] = React.useState(0);

  
  React.useEffect(()=>{
    axios.post("https://backend-kovan.epns.io/apis/feeds/get_spam_feeds",{
      "user":account,
    "page":1,
    "pageSize":10,
    "op":"read"
    }).then(data=>{
      setSpamNotification(data.data.results);
    })
  },[account]);
  const EPNS_DOMAIN = {
    name: "EPNS COMM V1",
    chainId: chainId,
    verifyingContract: epnsCommReadProvider.address,
  };

  const subscribe = async (channelAddress) => {
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
        <SpamBoxContainer>
          {
            spamNotification.map(noti=>{
              return(
               <SpamCard>
                 <div className="cardHeader">
                   <img src={noti.payload.data.icon} alt="" className="icon" />
                   {noti.payload.notification.title}
                 </div>
                 <div className="cardBody">
                   {noti.payload.notification.body}
                 </div>
                 {!loading && !subscribed && (
                 <button style={{background:"#e22780"}} className="Button" onClick={e=>subscribe(noti.channel)} disabled={txInProgress}>
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
                    onClick={e=>unsubscribeAction(noti.channel)}
                    
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
            })
          }
        </SpamBoxContainer>
      </>
      }
    </Container>
  );
}

// css styles

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
// Export Default
export default SpamBox;
