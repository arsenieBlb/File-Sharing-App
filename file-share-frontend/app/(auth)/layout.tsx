import { AtmosphericBackground } from "@/components/shell/AtmosphericBackground";

const AuthLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <AtmosphericBackground>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        {children}
      </div>
    </AtmosphericBackground>
  );
};

export default AuthLayout;
