import React, { SVGProps } from 'react';

export const IconClose: React.FC<SVGProps<SVGSVGElement>> = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10" width="10" height="10" fill="none" {...props}>
    <path
      fill="currentColor"
      fillRule="evenodd"
      d="M5 5.812 9.186 10 10 9.188 5.811 5 10 .813 9.188 0 4.999 4.188.812 0 0 .813 4.187 5 0 9.187.812 10l4.187-4.188Z"
      clipRule="evenodd"
    />
  </svg>
);
