import React, { useState, CSSProperties } from 'react';

// Base64 SVG error image - broken image icon
const ERROR_IMG_SRC =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg==';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Custom error message to display */
  errorMessage?: string;
  /** Whether to show the original URL on error */
  showErrorUrl?: boolean;
  /** Custom container className */
  containerClassName?: string;
  /** Custom container styles */
  containerStyle?: CSSProperties;
  /** Loading spinner size */
  spinnerSize?: number;
  /** Whether to show loading state */
  showLoading?: boolean;
}

export function ImageWithFallback({
  src,
  alt,
  style,
  className,
  errorMessage = 'Error al cargar imagen',
  showErrorUrl = true,
  containerClassName = '',
  containerStyle,
  spinnerSize = 40,
  showLoading = true,
  ...rest
}: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setDidError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Loading state
  if (isLoading && showLoading && !didError) {
    return (
      <div
        className={`image-fallback-loading ${containerClassName}`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: style?.width || '100%',
          height: style?.height || '200px',
          background: 'linear-gradient(135deg, #F9E5E9 0%, #F5D0C5 100%)',
          borderRadius: '12px',
          border: '2px solid rgba(230, 164, 180, 0.3)',
          ...containerStyle,
        }}
      >
        <div
          className="image-fallback-spinner"
          style={{
            width: spinnerSize,
            height: spinnerSize,
            border: '3px solid rgba(230, 164, 180, 0.3)',
            borderTopColor: '#E6A4B4',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Error state
  if (didError) {
    return (
      <div
        className={`image-fallback-container ${containerClassName}`}
        style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #F9E5E9 0%, #F5D0C5 100%)',
          textAlign: 'center',
          verticalAlign: 'middle',
          borderRadius: '12px',
          border: '2px solid rgba(230, 164, 180, 0.3)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          ...containerStyle,
        }}
        data-original-url={src}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
            minHeight: style?.height || '200px',
            width: style?.width || '100%',
          }}
        >
          <img
            src={ERROR_IMG_SRC}
            alt="Error loading image"
            style={{
              width: '64px',
              height: '64px',
              opacity: 0.7,
              marginBottom: '0.75rem',
              animation: 'pulse 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#9B8B87',
              textAlign: 'center',
              display: 'block',
              marginBottom: '0.5rem',
            }}
          >
            {errorMessage}
          </span>
          {showErrorUrl && (
            <span
              title={src}
              style={{
                fontSize: '0.75rem',
                color: '#9B8B87',
                opacity: 0.6,
                maxWidth: '200px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {src}
            </span>
          )}
        </div>
        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.7; }
            50% { transform: scale(1.05); opacity: 1; }
          }
          .image-fallback-container:hover {
            border-color: #E6A4B4;
            box-shadow: 0 8px 25px rgba(230, 164, 180, 0.3);
            transform: scale(1.02);
          }
        `}</style>
      </div>
    );
  }

  // Normal state - image loaded successfully
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={{
        ...style,
        transition: 'all 0.3s ease',
      }}
      onError={handleError}
      onLoad={handleLoad}
      {...rest}
    />
  );
}

export default ImageWithFallback;
