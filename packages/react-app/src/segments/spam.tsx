import React, { useState } from "react";
import styled, { css } from 'styled-components';
import Loader from 'react-loader-spinner'
import axios from "axios";
import { toast as toaster } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ChannelsDataStore from "singletons/ChannelsDataStore";
import { useWeb3React } from '@web3-react/core'
import SpamNotificationItem from '../components/SpamNotificationItem';
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
            spamNotification.map( (eachNotification)=>{
            
              return(
                <SpamNotificationItem 
                channelBody={eachNotification.payload.notification.body}
                channelAddress={eachNotification.channel}
                ChannelIcon={eachNotification.payload.data.icon}
                ChannelTitle={eachNotification.payload.notification.title}
                />        
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
