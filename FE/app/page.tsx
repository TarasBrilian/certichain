import { IssueDiploma } from "@/components/IssueDiploma";
import { Award, Box, ShieldCheck, Users } from "lucide-react";

export default function Home() {
  return (
    <>
      <IssueDiploma />

      <section className="feature-strip mx-auto mt-6 grid max-w-[1780px] gap-0 overflow-hidden rounded-lg md:grid-cols-4 px-6">
        <Feature icon={<Box size={34} />} title="Powered by Blockchain" text="Immutable - Transparent - Verifiable" />
        <Feature icon={<ShieldCheck size={34} />} title="Secure and Private" text="Data encrypted and user-controlled" />
        <Feature icon={<Award size={34} />} title="Global Verification" text="Anyone can verify anytime" />
        <Feature icon={<Users size={34} />} title="Built for the Future" text="Interoperable - Decentralized - Reliable" />
      </section>
    </>
  );
}

function Feature({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex min-h-24 items-center gap-4 border-b border-[#ffd1ad] px-7 py-5 md:border-b-0 md:border-r last:md:border-r-0 bg-white">
      <span className="text-[#ff6b00]">{icon}</span>
      <div>
        <p className="font-black">{title}</p>
        <p className="text-sm font-medium text-[#4b5563]">{text}</p>
      </div>
    </div>
  );
}
