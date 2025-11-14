export default function AdminPage() {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-4 text-lg text-gray-600">
            Coming in Phase 3...
          </p>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-gray-600 mt-2">Manage platform users</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold">Invites</h2>
              <p className="text-gray-600 mt-2">Generate invite codes</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold">Logs</h2>
              <p className="text-gray-600 mt-2">View system logs</p>
            </div>
          </div>
        </div>
      </div>
    );
  }