import React from 'react';
import ProjectRoutes from './Routes';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ProjectRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;