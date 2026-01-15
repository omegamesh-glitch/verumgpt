// Extend Window interface for Web Speech API
interface Window {
  webkitSpeechRecognition: any
}

// Type declarations for lucide-react
declare module 'lucide-react' {
  import { FC, SVGProps } from 'react'
  const IconComponent: FC<SVGProps<SVGSVGElement>>
  export const Sparkles: typeof IconComponent
  export const FileText: typeof IconComponent
  export const Volume2: typeof IconComponent
  export const VolumeX: typeof IconComponent
  export const Loader2: typeof IconComponent
  export const Mic: typeof IconComponent
  export const MicOff: typeof IconComponent
  export const Send: typeof IconComponent
  export const Shield: typeof IconComponent
  export const Hash: typeof IconComponent
  export const Copyright: typeof IconComponent
  export const Download: typeof IconComponent
  export const X: typeof IconComponent
  export const Search: typeof IconComponent
  export const Image: typeof IconComponent
  export const Settings: typeof IconComponent
  export const Sun: typeof IconComponent
  export const Moon: typeof IconComponent
  export const Monitor: typeof IconComponent
  export const Palette: typeof IconComponent
  export const Key: typeof IconComponent
  export const Layout: typeof IconComponent
  export const Baby: typeof IconComponent
  export const Volume2: typeof IconComponent
  export const Database: typeof IconComponent
  export const FileText: typeof IconComponent
  export const Shield: typeof IconComponent
  export const HelpCircle: typeof IconComponent
  export const Mail: typeof IconComponent
  export const ChevronRight: typeof IconComponent
  export const Globe: typeof IconComponent
  export const Brain: typeof IconComponent
  export const Zap: typeof IconComponent
  // Add any other icons as needed
}
