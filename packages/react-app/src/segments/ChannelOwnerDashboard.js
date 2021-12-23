import React from "react";
import { Section, Content } from "components/SharedStyling";

import SendNotifications from "components/SendNotifications";
import ChannelSettings from "components/ChannelSettings";
import ChannelDetails from "components/ChannelDetails";

// CREATE CHANNEL OWNER DASHBOARD
function ChannelOwnerDashboard() {
  return (
    <>
      <Section>
        <Content padding="0px">
          {/* display the channel settings */}
          {/* <ChannelSettings />  */}
          {/* display the channel settings */}
          {/* display the details about the profile of the channel */}
          <ChannelDetails />
          {/* display the details about the profile of the channel */}
          {/* display the notifications settings */}
          <SendNotifications />
          {/* display the notifications settings */}
        </Content>
      </Section>
    </>
  );
}

// css styles

// Export Default
export default ChannelOwnerDashboard;
