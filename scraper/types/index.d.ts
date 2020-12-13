export interface arguments {
  api_version: string;
  url: string;
  verbose: number;
}

export interface factorioClass {
  name: string;
  description: string;
  url: string;
  extends?: string;
  members: string[];
}
