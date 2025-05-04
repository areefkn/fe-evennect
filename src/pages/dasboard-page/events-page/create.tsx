"use client";

import CreateEventForm from "./component/form";

export default function CreateEventPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Create Event</h1>
      <CreateEventForm />
    </div>
  );
}
