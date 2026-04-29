"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { KeyRound, Loader2, LogOut } from "lucide-react";
import { useAccount, useConnect, useDisconnect, useChainId } from "wagmi";
import { usePrivy } from "@privy-io/react-auth";
import { usePrivyRuntime } from "@/components/Providers";
import { bnbSmartChainTestnet } from "@/lib/chains";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="line-panel corner-cut mx-auto flex max-w-[1880px] flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between my-6">
      <div className="flex min-w-0 items-center gap-4">
        <Link href="/" className="flex items-center gap-4">
          <div className="relative flex h-16 w-32 shrink-0 items-center justify-center rounded-[12px] bg-white overflow-hidden p-2">
            <img src="/logo-devweb3-jogja.png" alt="Logo" className="w-full h-full object-contain" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <h1 className="truncate text-2xl font-black sm:text-3xl">CertiChain</h1>
            <p className="text-xs font-extrabold uppercase text-[#1f2937]">
              Onchain Credentials.
            </p>
          </div>
        </Link>
      </div>

      <nav className="flex flex-wrap items-center gap-5 lg:gap-8">
        <Link 
          href="/" 
          className={`nav-button ${pathname === '/' ? 'text-[#ff6b00] font-black' : ''}`}
        >
          Issue Certificate
        </Link>
        <Link 
          href="/explore" 
          className={`nav-button ${pathname === '/explore' ? 'text-[#ff6b00] font-black' : ''}`}
        >
          Explore / Verify
        </Link>
      </nav>

      <ConnectPanel />
    </header>
  );
}

function ConnectPanel() {
  const hasPrivy = usePrivyRuntime();

  return (
    <div className="flex min-w-[290px] items-center justify-between gap-4 rounded-lg border border-[#ff6b00] bg-white px-4 py-3">
      <div className="flex items-center gap-3">
        <KeyRound className="text-[#6f3bd2]" size={24} />
        <div>
          <p className="text-lg font-black">Wallet</p>
          <p className="text-[10px] font-semibold text-muted">
            {hasPrivy ? "Simple. Secure." : "Injected"}
          </p>
        </div>
      </div>
      {hasPrivy ? <PrivyConnectAction /> : <InjectedConnectAction />}
    </div>
  );
}

function PrivyConnectAction() {
  const { ready, authenticated, login, logout } = usePrivy();
  const { address } = useAccount();

  if (!ready) {
    return (
      <button className="secondary-button min-w-28 px-4" disabled>
        <Loader2 className="animate-spin" size={18} /> Loading
      </button>
    );
  }

  if (authenticated) {
    return (
      <button className="secondary-button min-w-28 px-4" onClick={logout}>
        <LogOut size={18} /> {address ? shortAddress(address) : "Logout"}
      </button>
    );
  }

  return (
    <button className="secondary-button min-w-28 px-4" onClick={login}>
      Connect
    </button>
  );
}

function InjectedConnectAction() {
  const { address, isConnected } = useAccount();
  const connect = useConnect();
  const disconnect = useDisconnect();
  const connector = connect.connectors[0];

  if (isConnected) {
    return (
      <button className="secondary-button min-w-28 px-4" onClick={() => disconnect.mutate()}>
        <LogOut size={18} /> {address ? shortAddress(address) : "Disconnect"}
      </button>
    );
  }

  return (
    <button
      className="secondary-button min-w-28 px-4"
      onClick={() => connector && connect.mutate({ connector, chainId: bnbSmartChainTestnet.id })}
      disabled={!connector || connect.isPending}
    >
      {connect.isPending ? <Loader2 className="animate-spin" size={18} /> : null}
      Connect
    </button>
  );
}

function shortAddress(value: string) {
  return `${value.slice(0, 6)}...${value.slice(-4)}`;
}
