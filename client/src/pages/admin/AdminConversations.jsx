import ConversationList from "../../components/ConversationList";
import { AppContent } from "../../context/AppContext";
import { useContext } from "react";

const AdminConversations = () => {
  const { backendUrl } = useContext(AppContent);
  return (
    <ConversationList
      role="admin"
      backendUrl={backendUrl}
      endpoint="/api/messages/conversations"
      baseUrl="/admin/messages"
    />
  );
};

export default AdminConversations;
