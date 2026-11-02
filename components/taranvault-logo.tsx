import Image from "next/image";

export default function TaranVaultLogo() {
  return (
    <div className="flex flex-col items-center gap-2">
      <Image
        src="/taranvault-logo.svg"
        alt="TaranVault"
        width={310}
        height={75}
        priority
      />
      <span className="text-xs tracking-wide text-slate-500">
        Secure • Share • Collaborate
      </span>
    </div>
  );
}
