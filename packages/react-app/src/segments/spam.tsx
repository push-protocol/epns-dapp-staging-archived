import React, { useState } from "react";
import styled, { css } from 'styled-components';
import Loader from 'react-loader-spinner'
import axios from "axios";
import { useWeb3React } from '@web3-react/core'
import {
  NotificationItem,
} from "@epnsproject/frontend-sdk-staging";

import * as dotenv from "dotenv";
dotenv.config();

// Other Information section
function Info() {
  const { account } = useWeb3React();

  const [controlAt, setControlAt] = React.useState(0);
  const [loading, setLoading] = React.useState(false);
  const [spamNotification,setSpamNotification]=React.useState([]);

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
            spamNotification.map(noti=>{
              return(
                // <div style={{background:"gray"}}>
                //   <p>Sub: {noti.payload.notification.title}</p>
                //   <p>Body:{noti.payload.notification.body}</p>
                //   </div>
                  <NotificationItem
                  notificationTitle={noti.payload.notification.title}
                  notificationBody={noti.payload.notification.body}
                  cta={noti.payload.data.acta}
                  app={noti.payload.data.app}
                  icon={noti.payload.data.icon}
                  image={noti.payload.data.aimg}
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


// Export Default
export default Info;
