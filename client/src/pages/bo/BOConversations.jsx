import ConversationList from "../../components/ConversationList";
import { AppContent } from "../../context/AppContext";
import { useContext } from "react";

const BOConversations = () => {
  const { backendUrl } = useContext(AppContent);
  return (
    <ConversationList
      role="bo"
      backendUrl={backendUrl}
      endpoint="/api/messages/conversations"
      baseUrl="/bo/messages"
    />
  );
};

export default BOConversations;
