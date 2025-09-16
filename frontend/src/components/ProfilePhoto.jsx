import React from 'react';

const ProfilePhoto = ({ 
  user, 
  size = 'md', 
  showName = false, 
  className = '',
  onClick = null 
}) => {
  // Definir tamanhos
  const sizeClasses = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-20 h-20 text-2xl'
  };

  const sizeClass = sizeClasses[size] || sizeClasses.md;
  const clickableClass = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div 
        className={`${sizeClass} bg-blue-600 rounded-full flex items-center justify-center overflow-hidden ${clickableClass}`}
        onClick={onClick}
      >
        {user?.profileImage ? (
          <img 
            src={user.profileImage} 
            alt={user.name || 'Profile'} 
            className={`${sizeClass} rounded-full object-cover`}
          />
        ) : (
          <span className="text-white font-bold">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
          </span>
        )}
      </div>
      {showName && (
        <span className="text-gray-700 font-medium">
          {user?.name || 'Usuário'}
        </span>
      )}
    </div>
  );
};

export default ProfilePhoto;
