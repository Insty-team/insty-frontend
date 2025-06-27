import LoginHeader from "./_components/LoginHeader";

function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <LoginHeader />
      <main>{children}</main>
    </>
  );
}

export default LoginLayout;
