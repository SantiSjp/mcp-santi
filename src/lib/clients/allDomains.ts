import { TldParser, NetworkWithRpc } from '@onsol/tldparser';
import { getAddress } from 'ethers';

const RPC_URL = "https://monad-testnet.g.alchemy.com/v2/zdeR6kQcOgoJXh71neIxS3HKKg9s60eL";
const CHAIN_NAME = "monad";
const CHAIN_ID = 0x279f;

// Singleton do parser
let parser: TldParser | null = null;

/**
 * Obtém uma instância única do TldParser
 */
export function getTldParser(): TldParser {
  if (!parser) {
    const network = new NetworkWithRpc(CHAIN_NAME, CHAIN_ID, RPC_URL);
    parser = new TldParser(network, CHAIN_NAME);
  }
  return parser;
}

/**
 * Busca todos os domínios de um usuário
 */
export async function getAllUserDomains(address: string) {
  const parser = getTldParser();
  const normalized = getAddress(address);
  return await parser.getAllUserDomains(normalized);
}

/**
 * Busca todos os domínios de um usuário para um TLD específico
 */
export async function getUserDomainsByTld(address: string, tld: string) {
  const parser = getTldParser();
  const normalized = getAddress(address);
  return await parser.getAllUserDomainsFromTld(normalized, tld);
}

/**
 * Busca o owner de um domínio específico (ex: "miester.mon")
 */
export async function getOwnerFromDomainTld(domainTld: string) {
  const parser = getTldParser();
  return await parser.getOwnerFromDomainTld(domainTld);
}

/**
 * Busca o NameRecord (dados detalhados) de um domínio
 */
export async function getNameRecordFromDomainTld(domainTld: string) {
  const parser = getTldParser();
  return await parser.getNameRecordFromDomainTld(domainTld);
}

/**
 * Busca o domínio principal do usuário
 */
export async function getMainDomain(address: string) {
  const parser = getTldParser();
  const normalized = getAddress(address);
  return await parser.getMainDomain(normalized);
}
