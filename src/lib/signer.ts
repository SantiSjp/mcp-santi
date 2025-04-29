// src/lib/signer.ts
import { ethers } from "ethers";
import { useWalletClient } from "wagmi";

export let signer: ethers.Signer | null = null;

export async function setSigner() {
  try{
    const { data: walletClient } = useWalletClient();
    console.log("walletClient", walletClient);
    const provider = new ethers.BrowserProvider(walletClient as any);
    console.log("provider", provider);
    signer = await provider.getSigner();
    console.log("signer", signer);

  }catch(err){
    console.log("ERRO",err);
  }
}
