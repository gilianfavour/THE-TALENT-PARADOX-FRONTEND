import PortalNav from "./PortalNav";

export default async function PortalLayout({ children, params }: { children: React.ReactNode; params: Promise<{ token: string }> }) {
  const { token } = await params;
  return (
    <div className="space-y-8">
      <PortalNav token={token} />
      {children}
    </div>
  );
}
