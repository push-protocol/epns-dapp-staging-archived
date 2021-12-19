import React from "react";
import { Section, Content } from "components/SharedStyling";

import SendNotifications from "components/SendNotifications";
import ChannelSettings from "components/ChannelSettings";

// CREATE CHANNEL OWNER DASHBOARD
function ChannelOwnerDashboard() {
  React.useEffect(() => {});

  // RRENDER
  return (
    <>
      <Section>
        <Content padding="0px">
          <ChannelSettings />
          <SendNotifications />
        </Content>
      </Section>
    </>
  );
}

// css styles

// Export Default
export default ChannelOwnerDashboard;
