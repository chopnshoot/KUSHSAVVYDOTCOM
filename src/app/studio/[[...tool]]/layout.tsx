export const metadata = {
  title: "KushSavvy Studio",
  description: "Content management for KushSavvy",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      id="sanity"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#101112",
      }}
    >
      {children}
    </div>
  );
}
