import { useState, useEffect, useMemo } from "react";

import type { API } from "@badaimweeb/status-backend";
import { DTSocketClient } from "@badaimweeb/js-dtsocket";
import { connect } from "@badaimweeb/js-protov2d";

import { PROBE_ENDPOINTS } from "./config";

export function useConnector() {
    const [triggerRandom, setTriggerRandom] = useState(Math.floor(Math.random() * PROBE_ENDPOINTS.length));
    const endpoint = useMemo(() => PROBE_ENDPOINTS[triggerRandom % PROBE_ENDPOINTS.length], [triggerRandom]);

    const [socket, setSocket] = useState<DTSocketClient<API> | null>(null);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        (async () => {
            try {
                const conn = await connect({
                    url: endpoint[0],
                    publicKey: {
                        type: "hash",
                        hash: endpoint[1]
                    }
                });

                const socket = new DTSocketClient<API>(conn);
                setSocket(socket);
            } catch (e) {
                setError(e);
                await new Promise((resolve) => setTimeout(resolve, 2000));
                setTriggerRandom(triggerRandom + 1);
            }
        })();
    }, [endpoint]);

    return {
        socket,
        error
    }
}