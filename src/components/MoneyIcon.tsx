import React from 'react';

interface MoneyIconProps {
  size?: number;
  className?: string;
}

// 实心钞票图标组件
const MoneyIcon: React.FC<MoneyIconProps> = ({ size = 24, className = '' }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      className={className}
      fill="currentColor"
    >
      {/* 钞票主体 */}
      <rect x="1" y="5" width="22" height="14" rx="2" fill="currentColor" />
      {/* 中间圆形 - 用于美元符号背景 */}
      <circle cx="12" cy="12" r="4" fill="currentColor" opacity="0.3" />
      {/* 美元符号 */}
      <text 
        x="12" 
        y="15" 
        textAnchor="middle" 
        fontSize="8" 
        fontWeight="bold" 
        fill="currentColor"
        style={{ filter: 'invert(1)', mixBlendMode: 'difference' }}
      >
        $
      </text>
      {/* 左侧装饰圆 */}
      <circle cx="5" cy="12" r="1.5" fill="currentColor" opacity="0.4" />
      {/* 右侧装饰圆 */}
      <circle cx="19" cy="12" r="1.5" fill="currentColor" opacity="0.4" />
    </svg>
  );
};

export default MoneyIcon;

