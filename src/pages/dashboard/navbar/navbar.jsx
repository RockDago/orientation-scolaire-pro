// src/pages/dashboard/navbar/navbar.jsx
const Navbar = () => {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="font-semibold text-gray-800">Admin Dashboard</div>
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          A
        </div>
      </div>
    </header>
  );
};

export default Navbar;
