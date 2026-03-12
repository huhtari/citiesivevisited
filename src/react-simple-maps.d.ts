declare module 'react-simple-maps' {
  import { ComponentProps, ReactNode } from 'react';

  interface ComposableMapProps {
    projectionConfig?: Record<string, unknown>;
    style?: React.CSSProperties;
    children?: ReactNode;
  }

  interface GeographiesProps {
    geography: unknown;
    children: (props: { geographies: Geography[] }) => ReactNode;
  }

  interface Geography {
    rsmKey: string;
    id: string | number;
    properties: Record<string, unknown>;
  }

  interface GeographyProps extends ComponentProps<'path'> {
    geography: Geography;
    style?: {
      default?: React.CSSProperties;
      hover?: React.CSSProperties;
      pressed?: React.CSSProperties;
    };
  }

  export function ComposableMap(props: ComposableMapProps): JSX.Element;
  export function Geographies(props: GeographiesProps): JSX.Element;
  export function Geography(props: GeographyProps): JSX.Element;
}
