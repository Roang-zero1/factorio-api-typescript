import { AxiosInstance } from "axios";

export interface arguments {
  api_version: string;
  url: string;
  verbose: number;
  api: AxiosInstance;
  outDir: string;
}

export interface factorioClass {
  name: string;
  description: string;
  url: string;
  extends?: string;
  members: string[];
}
