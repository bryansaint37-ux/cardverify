import {
  ArrowRight,
  Bolt,
  Check,
  CircuitBoard,
  CreditCard,
  Eye,
  Info,
  Layers,
  type LucideIcon,
  Menu,
  Search,
  Shield,
  SquareCode,
  Trash2,
  TriangleAlert,
  X,
} from "lucide-react";
import type { SVGProps } from "react";
import { cn } from "@/lib/utils";

export type IconName =
  | "shield"
  | "cpu"
  | "eye"
  | "layers"
  | "bolt"
  | "code"
  | "check"
  | "cross"
  | "warning"
  | "info"
  | "arrow-right"
  | "menu"
  | "close"
  | "card"
  | "trash"
  | "search";

/** Icônes Lucide — un seul jeu d'icônes cohérent pour tout le site. */
const icons: Record<IconName, LucideIcon> = {
  shield: Shield,
  cpu: CircuitBoard,
  eye: Eye,
  layers: Layers,
  bolt: Bolt,
  code: SquareCode,
  check: Check,
  cross: X,
  warning: TriangleAlert,
  info: Info,
  "arrow-right": ArrowRight,
  menu: Menu,
  close: X,
  card: CreditCard,
  trash: Trash2,
  search: Search,
};

type IconProps = SVGProps<SVGSVGElement> & {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 20, className, ...props }: IconProps) {
  const LucideComponent = icons[name];

  return (
    <LucideComponent
      size={size}
      strokeWidth={1.75}
      aria-hidden="true"
      focusable="false"
      className={cn("shrink-0", className)}
      {...props}
    />
  );
}
