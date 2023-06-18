import React from "react";

function NotificationPopup({ requests, acceptRequest, rejectRequest }) {
  return (
    <div className="notification-popup">
      <ul>
        {requests.map((request) => (
          <li key={request.id}>
            <div>
              <span>{request.name}</span>
              <button onClick={() => acceptRequest(request)}>Accept</button>
              <button onClick={() => rejectRequest(request)}>Reject</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NotificationPopup;
