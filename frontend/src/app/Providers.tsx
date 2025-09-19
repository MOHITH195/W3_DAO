// Providers.tsx
"use client";

import { http, WagmiProvider } from "wagmi";
import React, { ReactNode } from 'react';
import {
    RainbowKitProvider,
    getDefaultWallets,
    getDefaultConfig,
    darkTheme  
} from "@rainbow-me/rainbowkit";
import {
    argentWallet,
    metaMaskWallet,
    trustWallet,
    ledgerWallet
} from "@rainbow-me/rainbowkit/wallets";
import { holesky } from "viem/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type child = {
    children: ReactNode
}

const {wallets} =getDefaultWallets();
    const config = getDefaultConfig({
        appName: "ON CHAIN DAO",
        chains: [holesky],
        projectId: "62fb59a83b4fd4961828ab2809bf2b80",
        ssr: true,
        transports: {
            [holesky.id]: http('https://eth-holesky.g.alchemy.com/v2/vI-0HkFX0e8eGgMKiBJBrJumz4SFxaBh') 
        },
        wallets: [
            {
                groupName:"essential",
                wallets:[metaMaskWallet],
            },
            {
                groupName: "Other",
                wallets: [
                    metaMaskWallet,
                    trustWallet,
                    argentWallet,
                    ledgerWallet
                ]
            }
        ]
    });


export function Providers({ children }: child) {
    // These calls should now consistently return the same instances.
    const queryClient = new QueryClient();

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider theme={darkTheme()}>
                    {children}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}