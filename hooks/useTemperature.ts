"use client";

import { useState, useEffect } from "react";

export function useTemperature() {
  const [temperature, setTemperature] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTemperature = async () => {
      try {
        const response = await fetch("/api/temperature/latest");
        const data = await response.json();
        setTemperature(data.value);
      } catch (error) {
        console.error("Failed to fetch temperature:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTemperature();

    const intervalId = setInterval(fetchTemperature, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return { temperature, isLoading };
}
