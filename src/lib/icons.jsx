import {
  Check,
  CircleCheck,
  CreditCard,
  Pencil,
  Trash2,
  X,
  Plus,
  Minus,
  FolderPlus,
  FileSpreadsheet,
  Sun,
  Moon,
  Search,
  Tags,
  Tag,
  LayoutGrid,
  ListFilter,
  Save,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ShoppingCart,
  Loader2,
  RefreshCw,
  Inbox,
  TriangleAlert,
  Users,
  Zap,
  Shield,
  Settings,
  Lock,
  MapPin,
  Phone,
  Mail,
  Clock,
  BarChart3,
} from "lucide-react";

/**
 * Mapa de nombres de PrimeIcons → componente de lucide-react.
 * Permite migrar los `icon="pi pi-xxx"` heredados (p. ej. en ActionButton)
 * sin tocar cada call-site.
 */
export const PI_TO_LUCIDE = {
  "pi-check": Check,
  "pi-check-circle": CircleCheck,
  "pi-credit-card": CreditCard,
  "pi-pencil": Pencil,
  "pi-trash": Trash2,
  "pi-times": X,
  "pi-plus": Plus,
  "pi-minus": Minus,
  "pi-folder-plus": FolderPlus,
  "pi-file-excel": FileSpreadsheet,
  "pi-sun": Sun,
  "pi-moon": Moon,
  "pi-search": Search,
  "pi-tags": Tags,
  "pi-tag": Tag,
  "pi-th-large": LayoutGrid,
  "pi-chart-bar": BarChart3,
  "pi-filter-list": ListFilter,
  "pi-save": Save,
  "pi-angle-left": ChevronLeft,
  "pi-angle-right": ChevronRight,
  "pi-angle-double-left": ChevronsLeft,
  "pi-angle-double-right": ChevronsRight,
  "pi-chevron-left": ChevronLeft,
  "pi-chevron-right": ChevronRight,
  "pi-shopping-cart": ShoppingCart,
  "pi-spinner": Loader2,
  "pi-refresh": RefreshCw,
  "pi-inbox": Inbox,
  "pi-exclamation-triangle": TriangleAlert,
  "pi-users": Users,
  "pi-bolt": Zap,
  "pi-shield": Shield,
  "pi-cog": Settings,
  "pi-lock": Lock,
  "pi-map-marker": MapPin,
  "pi-phone": Phone,
  "pi-envelope": Mail,
  "pi-clock": Clock,
};

/**
 * Resuelve un string tipo "pi pi-refresh" (o "pi-refresh") al componente
 * de lucide correspondiente. Devuelve null si no hay mapeo.
 */
export function resolveIcon(icon) {
  if (!icon || typeof icon !== "string") return null;
  const key = icon
    .split(/\s+/)
    .find((cls) => cls.startsWith("pi-") && cls !== "pi-spin");
  return PI_TO_LUCIDE[key] || null;
}
