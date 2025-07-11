import ConversationList from "../../components/ConversationList";
import { AppContent } from "../../context/AppContext";
import { useContext } from "react";

const UserConversations = () => {
  const { backendUrl } = useContext(AppContent);
  return (
    <ConversationList
      role="user"
      backendUrl={backendUrl}
      endpoint="/api/messages/conversations"
      baseUrl="/user/messages"
      withNavigate={true}
    />
  );
};

export default UserConversations;
