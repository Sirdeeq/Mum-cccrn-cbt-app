declare module 'lucide-react' {
  import * as React from 'react';

  export interface LucideProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    strokeWidth?: number | string;
    color?: string;
    className?: string;
  }

  export type LucideIcon = React.ForwardRefExoticComponent<
    LucideProps & React.RefAttributes<SVGSVGElement>
  >;

  export const Wifi: LucideIcon;
  export const WifiOff: LucideIcon;
  export const Type: LucideIcon;
  export const UserCheck: LucideIcon;
  export const User: LucideIcon;
  export const BookOpen: LucideIcon;
  export const Settings: LucideIcon;
  export const LogOut: LucideIcon;
  export const X: LucideIcon;
  export const ArrowLeft: LucideIcon;
  export const ArrowRight: LucideIcon;
  export const Flag: LucideIcon;
  export const Check: LucideIcon;
  export const CheckCircle: LucideIcon;
  export const CheckCircle2: LucideIcon;
  export const XCircle: LucideIcon;
  export const HelpCircle: LucideIcon;
  export const Clock: LucideIcon;
  export const AlertTriangle: LucideIcon;
  export const AlertCircle: LucideIcon;
  export const Bookmark: LucideIcon;
  export const BookmarkCheck: LucideIcon;
  export const Info: LucideIcon;
  export const Trash2: LucideIcon;
  export const Download: LucideIcon;
  export const Upload: LucideIcon;
  export const Shield: LucideIcon;
  export const ShieldCheck: LucideIcon;
  export const Shuffle: LucideIcon;
  export const Trophy: LucideIcon;
  export const Target: LucideIcon;
  export const TrendingUp: LucideIcon;
  export const PlayCircle: LucideIcon;
  export const RotateCcw: LucideIcon;
  export const Filter: LucideIcon;
  export const Database: LucideIcon;
  export const FlaskConical: LucideIcon;
  export const Activity: LucideIcon;
  export const HeartHandshake: LucideIcon;
  export const Award: LucideIcon;
  export const Briefcase: LucideIcon;
  export const Sparkles: LucideIcon;
  export const Layers: LucideIcon;
  export const Zap: LucideIcon;
  export const LayoutGrid: LucideIcon;
}
