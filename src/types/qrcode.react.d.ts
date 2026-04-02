declare module 'qrcode.react' {
  import React from 'react';

  interface QRCodeProps {
    value: string;
    size?: number;
    level?: 'L' | 'M' | 'Q' | 'H';
    includeMargin?: boolean;
    quietZone?: number;
    renderAs?: 'svg' | 'canvas';
    fgColor?: string;
    bgColor?: string;
    className?: string;
  }

  const QRCode: React.ForwardRefExoticComponent<QRCodeProps & React.RefAttributes<any>>;
  export default QRCode;
}
