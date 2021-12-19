import React from "react";
import { ethers } from "ethers";
import styled from "styled-components";
import Loader from "react-loader-spinner";
import { Waypoint } from "react-waypoint";
import { useWeb3React } from "@web3-react/core";
import { useSelector } from "react-redux";
import {
  api,
  utils,
  NotificationItem,
} from "@epnsproject/frontend-sdk-staging";

import { ALLOWED_CORE_NETWORK } from "pages/Home";
import { addresses, abis } from "@project/contracts";
import ChannelsDataStore from "singletons/ChannelsDataStore";

import NotificationToast from "components/NotificationToast";

const PAGE_COUNT = 6;
// Create Header
function Feedbox() {
  const { account } = useWeb3React();
  const { epnsCommReadProvider } = useSelector((state: any) => state.contracts);

  const [notifications, setNotifications] = React.useState([]);
  // since we dont have how many notifications there are in total
  // we use this field to note when there are no more notifications to load
  const [finishedFetching, setFinishedFetching] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [toast, showToast] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState(1);
  //define query

  const loadNotifications = async (currentPage: any) => {
    setLoading(true);
    try {
      const { count, results } = await api.fetchNotifications(
        account,
        PAGE_COUNT,
        currentPage
      );
      const parsedResponse = utils.parseApiResponse(results);
      setNotifications((oldNotifications) => [
        ...oldNotifications,
        ...parsedResponse,
      ]);
      if (count === 0) {
        setFinishedFetching(true);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const clearToast = () => showToast(null);

  React.useEffect(() => {
    if (epnsCommReadProvider) {
      loadNotifications(currentPage);
      newNotification(onReceive);
    }
  }, [epnsCommReadProvider, account]);

  //clear toast variable after it is shown
  React.useEffect(() => {
    if (toast) {
      clearToast();
    }
  }, [toast]);

  //function to query more notifications
  const handlePagination = async () => {
    setCurrentPage((prevPage) => {
      const newPage = prevPage + 1;
      loadNotifications(newPage);
      return newPage;
    });
  };


  //handle new notification
  const onReceive = async (notification) => {
    showToast(notification);
    setNotifications((existingNotifications) => [
      notification,
      ...existingNotifications,
    ]);
    // setNotifications(notifications => [notification].concat(notifications));
  };

  //subscribe to SendNotification
  const newNotification = (fn) => {
    const event = "SendNotification";

    //callback function for listener
    const cb = async (
      eventChannelAddress: string,
      eventUserAddress: string,
      identityHex: string
    ) => {
      alert('herer');
      return;
      const userAddress = account;
      const identity = ""; //(identityHex)
      const notificationId = identity
        .concat("+")
        .concat(eventChannelAddress)
        .concat("+")
        .concat(eventUserAddress)
        .toLocaleLowerCase();
      const ipfsId = identity.split("+")[1];

      const channelJson = await ChannelsDataStore.instance.getChannelJsonAsync(
        eventChannelAddress
      );

      // Form Gateway URL
      const url = "https://ipfs.io/ipfs/" + ipfsId;
      fetch(url)
        .then((result) => result.json())
        .then((result) => {
          const ipfsNotification = { ...result };
          const notification = {
            id: notificationId,
            userAddress: eventUserAddress,
            channelAddress: eventChannelAddress,
            indexTimeStamp: Date.now() / 1000, // todo
            notificationTitle:
              ipfsNotification.notification.title || channelJson.name,
            notificationBody: ipfsNotification.notification.body,
            // ...ipfsNotification.data,
          };
          if (ipfsNotification.data.type === "1") {
            const isSubscribed = epnsCommReadProvider
              .memberExists(userAddress, eventChannelAddress)
              .then((isSubscribed) => {
                if (isSubscribed) {
                  fn(notification);
                }
              });
          } else if (userAddress === eventUserAddress) {
            fn(notification);
          }
        })
        .catch((err) => {
          console.log(
            "!!!Error, getting new notification data from ipfs --> %o",
            err
          );
        });
    };
    epnsCommReadProvider.on(event, cb);
    // return epnsCommReadProvider.off.bind(epnsCommReadProvider, event, cb);
  };

  const showWayPoint = (index) => {
    return Number(index) === notifications.length - 1 && !finishedFetching;
  };

  // Render
  return (
    <>
      <Container>
        {notifications && (
          <Items id="scrollstyle-secondary">
            {notifications.map((oneNotification, index) => {
              const { cta, title, message, app, icon, image } = oneNotification;

              // render the notification item
              return (
                <>
                  {showWayPoint(index) && (
                    <Waypoint onEnter={() => handlePagination()} />
                  )}
                  <NotificationItem
                    notificationTitle={title}
                    notificationBody={message}
                    cta={cta}
                    app={app}
                    icon={icon}
                    image={image}
                  />
                </>
              );
            })}
          </Items>
        )}
        {loading && (
          <Loader type="Oval" color="#35c5f3" height={40} width={40} />
        )}

        {toast && (
          <NotificationToast notification={toast} clearToast={clearToast} />
        )}
      </Container>
    </>
  );
}

const Items = styled.div`
  display: block;
  align-self: stretch;
  padding: 10px 20px;
  overflow-y: scroll;
  background: #fafafa;
`;
// css styles
const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  font-weight: 200;
  align-content: center;
  align-items: center;
  justify-content: center;
  max-height: 100vh;

  // padding: 20px;
  // font-size: 16px;
  // display: flex;
  // font-weight: 200;
  // align-content: center;
  // align-items: center;
  // justify-content: center;
  // width: 100%;
  // min-height: 40vh;
`;

const ContainerInfo = styled.div`
  padding: 20px;
`;

// Export Default
export default Feedbox;
