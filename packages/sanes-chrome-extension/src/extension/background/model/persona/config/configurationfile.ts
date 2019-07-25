import { ChainId } from '@iov/bcp';

import { singleton } from '../../../../../utils/singleton';

/*global chrome*/

export type CodecString = 'bns' | 'lsk' | 'eth';

export interface ChainSpec {
  readonly codecType: CodecString;
  readonly node: string;
  readonly scraper?: string;
}

export interface FaucetSpec {
  readonly uri: string;
  readonly token: string;
}

// We can extend T to also include extra information, such as a chainId field
export interface ChainConfig {
  readonly chainSpec: ChainSpec;
  readonly faucetSpec?: FaucetSpec;
}

export interface ChainNames {
  readonly [key: string]: string;
}

export interface BlockExplorers {
  readonly [key: string]: string | null;
}

export interface ConfigurationFile {
  readonly chains: ChainConfig[];
  readonly names: ChainNames;
  readonly blockExplorers: BlockExplorers;
}

const loadConfigurationFile = async (): Promise<ConfigurationFile> => {
  if (process.env.NODE_ENV === 'test') {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config = (window as any).config;
    return config;
  }

  const url = chrome.extension.getURL('assets/config/conf.json');
  const data = await fetch(url);
  const json = await data.json();

  return json;
};

export const getConfigurationFile = singleton<typeof loadConfigurationFile>(loadConfigurationFile);

/**
 * Gets a chain name from the configuration file. Falls back to the chain ID
 * if no name is found.
 */
export async function getChainName(chainId: ChainId): Promise<string> {
  const chainNames = (await getConfigurationFile()).names;

  if (!Object.keys(chainNames).includes(chainId)) {
    return chainId;
  }

  return chainNames[chainId];
}
