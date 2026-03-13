import React from "react";

export function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md py-4 px-8 flex items-center justify-between fixed top-0 left-0 z-50">
      <div className="font-serif text-2xl text-[#65350E]">Brewly</div>
      <ul className="flex gap-8 text-[#6A4334] font-medium">
        <li><a href="#features" className="hover:text-[#B48665]">Features</a></li>
        <li><a href="#usecases" className="hover:text-[#B48665]">Use Cases</a></li>
        <li><a href="#contact" className="hover:text-[#B48665]">Contact</a></li>
      </ul>
    </nav>
  );
}
