"use client";

import React from "react";

interface Attendee {
  first_name: string;
  last_name: string;
}

interface Props {
  eventName: string;
  attendees: Attendee[];
  onClose: () => void;
}

export default function AttendeeModal({
  eventName,
  attendees,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm px-4">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Attendees of {eventName}
          </h3>
          <button
            className="text-gray-400 hover:text-gray-700 text-2xl"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {attendees.length === 0 ? (
          <p className="text-gray-500">No attendees yet.</p>
        ) : (
          <ul className="space-y-2">
            {attendees.map((user, index) => (
              <li
                key={index}
                className="px-3 py-2 bg-gray-50 rounded-md shadow-sm text-gray-700"
              >
                {user.first_name} {user.last_name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
