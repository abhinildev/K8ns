import Store from "../models/store.model";
import { execAsync } from "../utils/exec";
import path from "path";
import { logEvent } from "../utils/logEvent";

export async function provisionStore(storeId: string) {
  const store = await Store.findByPk(storeId);
  const chartPath = path.resolve(__dirname, "../../../charts/store");
 

  if (!store) {
    console.log(`[worker] Store ${storeId} not found`);
    return;
  }

  
  if (store.status !== "PROVISIONING") {
    console.log(
      `[worker] Store ${storeId} not in PROVISIONING state, skipping`
    );
    return;
  }

  const { id, namespace, helmRelease, engine } = store;
  const domain = `${helmRelease}.127.0.0.1.nip.io`;
  await logEvent(id, "INFO", "Provisioning started");
  try {
    console.log(`[worker] Starting provisioning for store ${id}`);


    try {
      await execAsync(`helm status ${helmRelease} -n ${namespace}`);
      console.log(
        `[worker] Helm release already exists for ${id}, marking READY`
      );
      await logEvent(id, "INFO", "Existing release detected, marking READY");

      await Store.update(
        {
          status: "READY",
          url: `http://${domain}`,
        },
        { where: { id } }
      );

      return;
    } catch {
      // Release does not exist → continue installation
    }

   
    const helmCmd = `
      helm install ${helmRelease} ${chartPath} \
        --namespace ${namespace} \
        --create-namespace \
        --set namespace=${namespace} \
        --set domain=${domain} \
        --set engine=${engine}
    `;

    await execAsync(helmCmd);

    await Store.update(
      {
        status: "READY",
        url: `http://${domain}`,
        errorMessage: null,
      },
      { where: { id } }
    );
    await logEvent(id, "SUCCESS", "Store provisioned successfully");

    console.log(`[worker] Store ${id} is READY`);
  } catch (error: any) {
    console.error(`[worker] Provisioning failed for ${id}`, error);
    await logEvent(id, "ERROR", error?.message || "Provisioning failed");

    await Store.update(
      {
        status: "FAILED",
        errorMessage: error?.message || "Provisioning failed",
      },
      { where: { id } }
    );

    // Best-effort cleanup
    try {
      await execAsync(`helm uninstall ${helmRelease} -n ${namespace}`);
    } catch {}
  }
}



export async function deleteStoreWorker(storeId: string) {
  const store = await Store.findByPk(storeId);

  if (!store) {
    console.log(`[worker] Store ${storeId} not found for deletion`);
    return;
  }

  

  const { namespace, helmRelease } = store;
  //await logEvent(storeId, "INFO", "Deletion started");

  try {
    console.log(`[worker] Deleting store ${storeId}`);

    // Mark DELETING first
    await Store.update(
      { status: "DELETING" },
      { where: { id: storeId } }
    );

    // Helm uninstall (idempotent)
    try {
      await execAsync(`helm uninstall ${helmRelease} -n ${namespace}`);
    } catch {}

    // Delete namespace (safe if already deleted)
    await execAsync(
      `kubectl delete namespace ${namespace} --ignore-not-found`
    );

    // Remove DB record
    await Store.destroy({ where: { id: storeId } });
    console.log("Reached")
    console.log(`[worker] Store ${storeId} deleted successfully`);
  } catch (error: any) {
    console.error(`[worker] Failed to delete store ${storeId}`, error);

    await Store.update(
      {
        status: "FAILED",
        errorMessage: "Deletion failed",
      },
      { where: { id: storeId } }
    );
   

  }
}
