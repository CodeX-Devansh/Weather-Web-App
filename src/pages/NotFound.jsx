import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold">404 - Not Found</h1>
      <p className="mt-4 text-muted-foreground">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;