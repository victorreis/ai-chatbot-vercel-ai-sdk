import { useEffect, useState } from "react";

import type { Model } from "@/components/ModelSelector";

export function useAvailableModels() {
  const [availableModels, setAvailableModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAvailableModels() {
      try {
        const response = await fetch("/api/models");
        if (response.ok) {
          const data = await response.json();
          setAvailableModels(data.models);
        } else {
          console.error(
            "Failed to fetch models, response not ok:",
            response.status,
          );
        }
      } catch (error) {
        console.error("Failed to fetch available models:", error);
      } finally {
        setLoading(false);
      }
    }

    checkAvailableModels();
  }, []);

  return { availableModels, loading };
}
