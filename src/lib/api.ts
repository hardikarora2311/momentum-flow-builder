import { Configuration } from "@/types";
import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

export interface GraphNode {
  function: string;
  params: Array<{ identifier: string; type: string | null }>;
  response_object: string;
  children: GraphNode[];
}

export const getGraph = async (flow: string): Promise<GraphNode[]> => {
  const response = await api.get("/graph");
  return response.data;
};

export const getDependencies = async (flow: string): Promise<string[]> => {
  const response = await api.get(`/dependencies?flow=${flow}`);
  return response.data;
};

export const getConfiguration = async (
  flow: string
): Promise<Configuration> => {
  const response = await api.get(`/config?flow=${flow}`);
  return response.data;
};

export const saveConfiguration = async (
  config: Configuration
): Promise<{ success: boolean }> => {
  const response = await api.post("/config", config);
  return response.data;
};
