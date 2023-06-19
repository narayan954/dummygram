import React from "react";
import "./NotificationPopup.css";

function NotificationPopup({ requests, acceptRequest, rejectRequest }) {
  return (
    <div className="notification-popup">
      {requests.length === 0 ? (
        <h2>No notifications left to show</h2>
      ) : (
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
      )}
    </div>
  );
}

export default NotificationPopup;
