import React from 'react';

const DashboardCard = ({ dashboard, onClick }) => {
  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-lg shadow-lg ${dashboard.color} text-white cursor-pointer hover:opacity-90 transform hover:scale-105 transition-all duration-200`}
    >
      <h3 className="text-xl font-semibold mb-2">{dashboard.title}</h3>
      <p>{dashboard.description}</p>
    </div>
  );
};

export default DashboardCard;