import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-primary-600 text-white py-4 w-full">
      <div className="container mx-auto text-center">
        <p>&copy; {new Date().getFullYear()} Task Manager. All rights reserved.</p>
        <p>Powered By <b>CollEdge Connect.</b></p>
      </div>
    </footer>
  );
};
