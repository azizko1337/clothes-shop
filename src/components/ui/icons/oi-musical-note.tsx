import React from 'react';

const MusicalNoteIcon = ({
  size = 48,
  color = '#000000',
  strokeWidth = undefined,
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}) => {
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = 24 + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        opacity,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <path fill="currentColor" d="M8 0C3 0 2 1 2 1v4.09A1.6 1.6 0 0 0 1.5 5C.67 5 0 5.67 0 6.5S.67 8 1.5 8S3 7.33 3 6.5V2.53c.73-.23 1.99-.44 4-.5v2.06A1.6 1.6 0 0 0 6.5 4C5.67 4 5 4.67 5 5.5S5.67 7 6.5 7S8 6.33 8 5.5z"/>
    </svg>
  );
};

export { MusicalNoteIcon };