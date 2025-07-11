import React from "react";
import { useParams } from "react-router-dom";
import Messaging from "../../components/Messaging";

const AdminMessages = () => {
  const { userId } = useParams();

  return <Messaging targetUserId={userId} />;
};

export default AdminMessages;
