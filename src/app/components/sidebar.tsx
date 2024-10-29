
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { FaInstagram, FaFacebook, FaYoutube } from "react-icons/fa";
import { Playlist } from "../data/playlists";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[];
}

export function Sidebar({ className, playlists }: SidebarProps) {
  return (
    <div className={cn("pb-12 h-full flex flex-col", className)}>
  
      <div className="px-3 py-4 mb-2 flex items-center justify-center">
        <img src="/ditty.png" alt="" className="h-35 w-25" />
      </div>

      <div className="space-y-4 px-3 py-2">
        <Button variant="secondary" className="w-full justify-start">
          Home
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Library
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Stats
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Dashboard
        </Button>
      </div>

      
      <div className="py-10" /> 

      <div className="px-3 py-6 space-y-0">
        <Button variant="ghost" className="w-full justify-start">
          Announcement
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Subscription
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          Credits
        </Button>
      </div>

      <div className="py-3" /> 

      <div className="px-3 py-6 text-center text-gray-600 text-sm">
        <p>
          Welcome to <strong>Ditty</strong>, your all-in-one music platform to explore, listen, and organize your favorite tunes seamlessly.
          Discover trending tracks, build playlists, and connect with a world of music at your fingertips.
        </p>
      </div>
      <div className="py-2" /> 

      <div className="mt-auto flex space-x-4 justify-center mb-4">
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram className="text-2xl hover:text-gray-400" />
        </a>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook className="text-2xl hover:text-gray-400" />
        </a>
        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
          <FaYoutube className="text-2xl hover:text-gray-400" />
        </a>
      </div>
    </div>
  );
}
