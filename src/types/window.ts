export interface WindowInstance {
  isMaximized: any;
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
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