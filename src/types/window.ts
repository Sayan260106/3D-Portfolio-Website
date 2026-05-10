export interface WindowInstance {
  id: string;

  title: string;

  isOpen: boolean;

  isMinimized: boolean;

  isMaximized: boolean;

  zIndex: number;

  appId?: string;

  position?: {
    x: number;
    y: number;
  };

  size?: {
    width: number;
    height: number;
  };
}