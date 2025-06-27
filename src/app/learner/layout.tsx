import { LearnerHeader } from "@/app/_components/common";

function LearnerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full flex justify-center shadow-line-100">
        <div className="w-full max-w-[1400px]">
          <LearnerHeader />
        </div>
      </header>
      <main className="flex-1 flex justify-center">
        <div className="w-full max-w-[1400px]">{children}</div>
      </main>
    </div>
  );
}

export default LearnerLayout;
