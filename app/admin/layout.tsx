export default function AdminLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div>
        <div className="bg-gray-800 text-white p-4">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
        {children}
      </div>
    );
  }