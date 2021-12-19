import React from "react";
import { Section, Content, Item } from "components/SharedStyling";
import { useSelector, useDispatch } from "react-redux";
import styled, { css } from "styled-components";
import { useWeb3React } from "@web3-react/core";
import { toast as toaster } from "react-toastify";
import { addresses, abis } from "@project/contracts";
import { postReq } from "api";

import { ALLOWED_CORE_NETWORK } from "pages/Home";
import AddDelegateModal from "./AddDelegateModal";
import RemoveDelegateModal from "./RemoveDelegateModal";
import ActivateChannelModal from "./ActivateChannelModal";
import EPNSCoreHelper from "helpers/EPNSCoreHelper";
import { setUserChannelDetails } from "redux/slices/adminSlice";

import "react-dropdown/style.css";
import "react-toastify/dist/ReactToastify.min.css";

import Loader from "react-loader-spinner";
const ethers = require("ethers");

const MIN_STAKE_FEES = 50;

// Create Header
function ChannelSettings() {
  const dispatch = useDispatch();
  const { account, library, chainId } = useWeb3React();
  const { epnsWriteProvider, epnsCommWriteProvider } = useSelector(
    (state: any) => state.contracts
  );
  const { channelDetails } = useSelector((state: any) => state.admin);
  const {
    CHANNNEL_DEACTIVATED_STATE,
    CHANNEL_BLOCKED_STATE,
    CHANNEL_ACTIVE_STATE,
  } = useSelector((state: any) => state.channels);

  const { channelState } = channelDetails;
  const onCoreNetwork = ALLOWED_CORE_NETWORK === chainId;

  const [loading, setLoading] = React.useState(false);
  const [
    showActivateChannelPopup,
    setShowActivateChannelPopup,
  ] = React.useState(false);
  const [channelStakeFees, setChannelStakeFees] = React.useState(
    MIN_STAKE_FEES
  );
  const [poolContrib, setPoolContrib] = React.useState(0);
  const [addDelegateLoading, setAddDelegateLoading] = React.useState(false);
  const [addModalOpen, setAddModalOpen] = React.useState(false);
  const [removeDelegateLoading, setRemoveDelegateLoading] = React.useState(
    false
  );
  const [removeModalOpen, setRemoveModalOpen] = React.useState(false);

  // toaster customize
  const LoaderToast = ({ msg, color }) => (
    <Toaster>
      <Loader type="Oval" color={color} height={30} width={30} />
      <ToasterMsg>{msg}</ToasterMsg>
    </Toaster>
  );

  // Toastify
  let notificationToast = () =>
    toaster.dark(<LoaderToast msg="Preparing Notification" color="#fff" />, {
      position: "bottom-right",
      autoClose: false,
      hideProgressBar: true,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });

  const isChannelDeactivated = channelState === CHANNNEL_DEACTIVATED_STATE;
  const isChannelBlocked = channelState === CHANNEL_BLOCKED_STATE;

  React.useEffect(() => {
    // To set channel info from a channel details
    // setChannelState(channelDetails.channelState);
    setPoolContrib(
      +EPNSCoreHelper.formatBigNumberToMetric(
        channelDetails.poolContribution,
        true
      )
    );
  }, [account]);

  const toggleChannelActivationState = () => {
    if (isChannelBlocked) return;
    if (isChannelDeactivated) {
      setShowActivateChannelPopup(true);
    } else {
      deactivateChannel();
    }
  };

  /**
   * Function to activate a channel that has been deactivated
   */
  const activateChannel = async () => {
    // First Approve DAI
    setLoading(true);
    var signer = library.getSigner(account);
    let daiContract = new ethers.Contract(addresses.dai, abis.erc20, signer);
    const fees = ethers.utils.parseUnits(channelStakeFees.toString(), 18);
    var sendTransactionPromise = daiContract.approve(addresses.epnscore, fees);
    const tx = await sendTransactionPromise;

    console.log(tx);
    console.log("waiting for tx to finish");

    await library.waitForTransaction(tx.hash);
    await epnsWriteProvider
      .reactivateChannel(fees)
      .then(async (tx: any) => {
        console.log(tx);
        console.log("Transaction Sent!");

        toaster.update(notificationToast(), {
          render: "Transaction sent",
          type: toaster.TYPE.INFO,
          autoClose: 5000,
        });

        await tx.wait(1);
        toaster.update(notificationToast(), {
          render: "Channel Recreated",
          type: toaster.TYPE.INFO,
          autoClose: 5000,
        });
        dispatch(
          setUserChannelDetails({
            ...channelDetails,
            channelState: CHANNEL_ACTIVE_STATE,
          })
        );
      })
      .catch((err: any) => {
        console.log("!!!Error reactivateChannel() --> %o", err);
        toaster.update(notificationToast(), {
          render: "Transacion Failed: " + err.error?.message || err.message,
          type: toaster.TYPE.ERROR,
          autoClose: 5000,
        });
      })
      .finally(() => {
        setLoading(false);
        setShowActivateChannelPopup(false);
      });
  };

  /**
   * Function to deactivate a channel that has been deactivated
   */
  const deactivateChannel = async () => {
    // setLoading(true);
    if (!poolContrib) return;

    const amountToBeConverted = parseInt("" + poolContrib) - 10;
    console.log("Amount To be converted==>", amountToBeConverted);

    const { data: response } = await postReq("/channels/get_dai_to_push", {
      value: amountToBeConverted,
    });

    const pushValue = response.response.data.quote.PUSH.price;
    const amountsOut = pushValue * Math.pow(10, 18);

    await epnsWriteProvider
      // .deactivateChannel(amountsOut.toString().replace(/0+$/, "")) //use this to remove trailing zeros 1232323200000000 -> 12323232
      .deactivateChannel(Math.floor(pushValue)) //use this to remove trailing zeros 1232323200000000 -> 12323232
      .then(async (tx: any) => {
        console.log(tx);
        console.log("Transaction Sent!");

        toaster.update(notificationToast(), {
          render: "Transaction sending",
          type: toaster.TYPE.INFO,
          autoClose: 5000,
        });

        await tx.wait(1);
        console.log("Transaction Mined!");
        dispatch(
          setUserChannelDetails({
            ...channelDetails,
            channelState: CHANNNEL_DEACTIVATED_STATE,
          })
        );
      })
      .catch((err: any) => {
        console.log("!!!Error deactivateChannel() --> %o", err);
        console.log({
          err,
        });
        toaster.update(notificationToast(), {
          render: "Transacion Failed: " + err.error?.message || err,
          type: toaster.TYPE.ERROR,
          autoClose: 5000,
        });
      })
      .finally(() => {
        // post op
        setLoading(false);
      });
  };

  const addDelegate = async (walletAddress: string) => {
    setAddDelegateLoading(true);
    return epnsCommWriteProvider.addDelegate(walletAddress)
      .finally(() => {
        setAddDelegateLoading(false);
      });
  };

  const removeDelegate = (walletAddress: string) => {
    setRemoveDelegateLoading(true);
    return epnsCommWriteProvider.removeDelegate(walletAddress)
      .finally(() => {
        setRemoveDelegateLoading(false);
      });
  };

  if (!onCoreNetwork) {
    //temporarily deactivate the deactivate button if not on core network
    return <></>;
  }

  return (
    <>
      <Section>
        <Content padding="10px 10px">
          <Item
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
            align="flex-end"
          >
            <ChannelActionButton
              onClick={toggleChannelActivationState}
              style={{
                background: "#e20880",
              }}
            >
              <ActionTitle>
                {loading ? (
                  <Loader type="Oval" color="#FFF" height={16} width={16} />
                ) : isChannelBlocked ? (
                  "Channel Blocked"
                ) : isChannelDeactivated ? (
                  "Activate Channel"
                ) : (
                  "Deactivate Channel"
                )}
              </ActionTitle>
            </ChannelActionButton>
            <div
              style={{
                display:
                  isChannelBlocked || isChannelDeactivated ? "none" : "flex",
              }}
            >
              <ChannelActionButton onClick={() => setAddModalOpen(true)}>
                <ActionTitle>
                  {addDelegateLoading ? (
                    <Loader type="Oval" color="#FFF" height={16} width={16} />
                  ) : (
                    "Add Delegate"
                  )}
                </ActionTitle>
              </ChannelActionButton>

              <ChannelActionButton onClick={() => setRemoveModalOpen(true)}>
                <ActionTitle>
                  {removeDelegateLoading ? (
                    <Loader type="Oval" color="#FFF" height={16} width={16} />
                  ) : (
                    "Remove Delegate"
                  )}
                </ActionTitle>
              </ChannelActionButton>
            </div>
          </Item>
        </Content>
        {/* modal to display the activate channel popup */}
        {showActivateChannelPopup && (
          <ActivateChannelModal
            onClose={() => {
              if (showActivateChannelPopup) {
                setShowActivateChannelPopup(false);
              }
            }}
            activateChannel={activateChannel}
            loading={loading}
            setChannelStakeFees={setChannelStakeFees}
            channelStakeFees={channelStakeFees}
          />
        )}
        {/* modal to add a delegate */}
        {addModalOpen && (
          <AddDelegateModal
            onClose={() => setAddModalOpen(false)}
            onSuccess={() => {
              toaster.update(notificationToast(), {
                render: "Delegate Added",
                type: toaster.TYPE.INFO,
                autoClose: 5000,
              });
            }}
            addDelegate={addDelegate}
          />
        )}
        {/* modal to remove a delegate */}
        {removeModalOpen && (
          <RemoveDelegateModal
            onClose={() => {
              setRemoveModalOpen(false);
            }}
            onSuccess={() => {
              toaster.update(notificationToast(), {
                render: "Delegate Removed",
                type: toaster.TYPE.INFO,
                autoClose: 5000,
              });
            }}
            removeDelegate={removeDelegate}
          />
        )}
      </Section>
    </>
  );
}

// css styles
const Toaster = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin: 0px 10px;
`;

const ActionTitle = styled.span`
  ${(props: any) =>
    props.hideit &&
    css`
      visibility: hidden;
    `};
`;

const ToasterMsg = styled.div`
  margin: 0px 10px;
`;

const ChannelActionButton = styled.button`
  border: 0;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 15px;
  margin: 10px;
  color: #fff;
  border-radius: 5px;
  font-size: 14px;
  font-weight: 400;
  position: relative;
  background-color: #674c9f;
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
`;

// Export Default
export default ChannelSettings;
