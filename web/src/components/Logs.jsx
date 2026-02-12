import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Logs = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch(
        `http://localhost:6060/test/events/${id}`
      );
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error("Failed to fetch events", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    const interval = setInterval(fetchEvents, 3000);
    return () => clearInterval(interval);
  },);

  return (
    <div className="p-8 min-h-screen bg-black text-white">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">
          Store Logs
        </h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
        >
          ← Back
        </button>
      </div>

      <div className="bg-black/40 border border-gray-700 rounded-xl p-6">
        {loading ? (
          <p className="text-gray-400">Loading logs...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">
            No logs available for this store.
          </p>
        ) : (
          <div className="space-y-3">
            {events.map((event) => (
              <div
                key={event.id}
                className="border-b border-gray-700 pb-3"
              >
                <div className="flex justify-between">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      event.type === "SUCCESS"
                        ? "bg-green-500/20 text-green-400"
                        : event.type === "ERROR"
                        ? "bg-red-500/20 text-red-400"
                        : "bg-blue-500/20 text-blue-400"
                    }`}
                  >
                    {event.type}
                  </span>
                  <span className="text-xs text-gray-500">
                    {new Date(
                      event.createdAt
                    ).toLocaleString()}
                  </span>
                </div>

                <p className="text-sm mt-2 text-gray-300">
                  {event.message}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Logs;
