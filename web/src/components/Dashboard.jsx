import React, { useEffect, useState } from "react";

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);

  
  const hasProvisioning = stores.some(
    (s) => s.status === "PROVISIONING"
  );

  const formatDate = (iso) =>
    new Date(iso).toLocaleString();

  const fetchStores = async () => {
    try {
      const res = await fetch("http://localhost:6060/test/stores");
      const data = await res.json();
      setStores(data);
    } catch (error) {
      console.error("Failed to fetch stores", error);
    }
  };

  const createStore = async () => {
    try {
      setLoading(true);
      await fetch("http://localhost:6060/test/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ engine: "woocommerce" }),
      });
      fetchStores();
    } finally {
      setLoading(false);
    }
  };

  const deleteStore = async (id) => {
    await fetch(`http://localhost:6060/test/delete/${id}`, {
      method: "DELETE",
    });
    fetchStores();
  };

 
  useEffect(() => {
    let cancelled = false;

    const poll = async () => {
      if (!cancelled) {
        await fetchStores();
      }
    };

    poll(); 
    const interval = setInterval(poll, 3000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

 
  if (stores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center px-6">
        <h2 className="text-3xl font-semibold text-white">
          No stores provisioned yet
        </h2>

        <p className="mt-3 max-w-lg text-gray-400">
          Create your first ecommerce store. Each store is provisioned in an
          isolated Kubernetes namespace using Helm.
        </p>

        <button
          onClick={createStore}
          disabled={loading}
          className={`
            mt-6 px-6 py-3 rounded-lg font-semibold transition-all
            ${
              loading
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-[#00df9a] text-black hover:scale-105 hover:shadow-[0_0_20px_rgba(0,223,154,0.6)]"
            }
          `}
        >
          {loading ? "Provisioning..." : "Create Store"}
        </button>
      </div>
    );
  }

 
  return (
    <div className="p-8 space-y-6">

     
      <div className="flex justify-between items-center">
        <h1 className="text-2xl text-white font-semibold">Stores</h1>

        <button
          onClick={createStore}
          disabled={hasProvisioning}
          className={`
            px-4 py-2 rounded-lg font-semibold transition-all
            ${
              hasProvisioning
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-[#00df9a] text-black hover:scale-105 hover:shadow-[0_0_15px_rgba(0,223,154,0.6)]"
            }
          `}
        >
          + Create Store
        </button>
      </div>

  
      <div className="overflow-x-auto rounded-xl border border-gray-700 bg-black/40">
        <table className="w-full text-left">
          <thead className="bg-black/60">
            <tr className="text-gray-400 text-sm">
              <th className="px-6 py-4 font-medium">Engine</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium">Created</th>
              <th className="px-6 py-4 font-medium">URL</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {stores.map((store) => (
              <tr
                key={store.id}
                className="border-t border-gray-700 hover:bg-white/5 transition-colors"
              >
               
                <td className="px-6 py-4 text-white font-medium">
                  {store.engine.toUpperCase()}
                </td>

                
                <td className="px-6 py-4">
                  <span
                    className={`
                      inline-flex items-center gap-2
                      px-3 py-1 rounded-full text-xs font-semibold
                      ${
                        store.status === "READY"
                          ? "bg-green-500/15 text-green-400"
                          : store.status === "PROVISIONING"
                          ? "bg-yellow-500/15 text-yellow-400"
                          : store.status === "DELETING"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-gray-500/15 text-gray-400"
                      }
                    `}
                  >
                    {store.status === "PROVISIONING" && (
                      <span className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    )}
                    {store.status}
                  </span>
                </td>

         
                <td className="px-6 py-4 text-sm text-gray-400">
                  {formatDate(store.createdAt)}
                </td>

            
                <td className="px-6 py-4">
                  {store.url ? (
                    <a
                      href={store.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#00df9a] text-sm hover:underline"
                    >
                      Open Store
                    </a>
                  ) : (
                    <span className="text-gray-500 text-sm">—</span>
                  )}
                </td>

             
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => deleteStore(store.id)}
                    disabled={store.status === "DELETING"}
                    className={`
                      text-sm font-medium transition-colors
                      ${
                        store.status === "DELETING"
                          ? "text-gray-500 cursor-not-allowed"
                          : "text-red-400 hover:text-red-300"
                      }
                    `}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
