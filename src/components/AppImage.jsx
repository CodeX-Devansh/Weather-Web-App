import React from 'react';

function Image({
  src,
  alt = "Image Name",
  className = "",
  ...props
}) {

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={(e) => {
        e.target.onerror = null; // Prevent infinite loop if fallback also fails
        e.target.src = "/assets/images/no_image.png"; // Provide a default fallback image path
      }}
      {...props}
    />
  );
}

export default Image;