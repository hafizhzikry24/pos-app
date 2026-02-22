export function Navbar() {
  return (
    <header className="bg-slate-300 shadow-sm border-b border-gray-200 h-16 flex items-center px-6">
      
      {/* Title - only show on lg */}
      <h1 className="text-xl hidden lg:block font-semibold text-gray-800">
        Overview
      </h1>

      {/* Right content */}
      <div className="ml-auto flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
            A
          </div>
          <span className="text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>

    </header>
  );
}
