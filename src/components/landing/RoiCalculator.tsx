'use client';

import { useState, useEffect } from 'react';

export default function RoiCalculator() {
  const [projects, setProjects] = useState(10);
  const [savings, setSavings] = useState(0);

  useEffect(() => {
    // 8hrs saved @ $75/hr
    const calculated = projects * 8 * 75;
    setSavings(calculated);
  }, [projects]);

  return (
    <div className="bg-navy text-white p-8 rounded-2xl mt-12">
      <h3 className="text-2xl font-bold mb-6">ROI Calculator</h3>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Projects per Month
        </label>
        <input 
          type="number" 
          value={projects}
          onChange={(e) => setProjects(Number(e.target.value))}
          className="w-full md:w-1/2 p-3 rounded-lg text-navy font-bold focus:ring-2 focus:ring-amber outline-none"
        />
      </div>
      <div className="border-t border-gray-700 pt-6">
        <p className="text-gray-300">Estimated Annual Savings:</p>
        <p className="text-4xl font-extrabold text-amber mt-2">
          ${savings.toLocaleString()} <span className="text-sm text-gray-400 font-normal">/ month</span>
        </p>
      </div>
    </div>
  );
}