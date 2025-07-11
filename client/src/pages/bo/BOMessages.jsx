// pages/bo/BOMessages.jsx
import React from "react";
import Messaging from "../../components/Messaging";
import { useParams } from "react-router-dom";

const BOMessages = () => {
    const { userId } = useParams();
  
  return <Messaging targetUserId={userId}/>;
};

export default BOMessages;
