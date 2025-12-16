declare module 'lucide-react' {
  import * as React from 'react';
  const DollarSign: React.ComponentType<any>;
  const TrendingUp: React.ComponentType<any>;
  const TrendingDown: React.ComponentType<any>;
  const Target: React.ComponentType<any>;
  const Plus: React.ComponentType<any>;
  const ArrowRight: React.ComponentType<any>;
  const Settings: React.ComponentType<any>;
  const X: React.ComponentType<any>;
  const __namedExports: { [key: string]: React.ComponentType<any> };
  export {
    DollarSign,
    TrendingUp,
    TrendingDown,
    Target,
    Plus,
    ArrowRight,
    Settings,
    X,
  };
  export default __namedExports;
}

declare module 'lucide-react/dist/esm/icons/*' {
  import * as React from 'react';
  const Icon: React.ComponentType<any>;
  export default Icon;
}

declare module 'next/link' {
  import * as React from 'react';
  type LinkProps = React.ComponentProps<'a'> & { href: string; legacyBehavior?: boolean };
  const Link: React.FC<LinkProps>;
  export default Link;
}
