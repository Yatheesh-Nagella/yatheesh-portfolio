export default function FinanceLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div>
        <div className="bg-blue-600 text-white p-4">
          <h1 className="text-xl font-bold">OneLedger Finance</h1>
        </div>
        {children}
      </div>
    );
  }