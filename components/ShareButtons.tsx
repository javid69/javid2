"use client";

import { useCallback } from "react";
import {
  Copy,
  Facebook,
  Link as LinkIcon,
  Mail,
  MessageCircle,
  Share2,
  Twitter,
} from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url: string;
  title: string;
  text?: string;
  className?: string;
}

const shareOptions = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    icon: MessageCircle,
    getHref: (url: string, title: string, text?: string) => {
      const message = encodeURIComponent(`${title}\n${text ?? ""}\n${url}`);
      return `https://wa.me/?text=${message}`;
    },
  },
  {
    key: "facebook",
    label: "Facebook",
    icon: Facebook,
    getHref: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: Twitter,
    getHref: (url: string, title: string, text?: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text ?? title)}`,
  },
  {
    key: "email",
    label: "Email",
    icon: Mail,
    getHref: (url: string, title: string, text?: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text ?? ""}\n${url}`)}`,
  },
];

export function ShareButtons({ url, title, text, className }: ShareButtonsProps) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy link", error);
      toast.error("Failed to copy link. Please try again.");
    }
  }, [url]);

  const handleNativeShare = useCallback(async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url,
        });
      } catch (error) {
        console.error("Share cancelled", error);
      }
    } else {
      handleCopy();
    }
  }, [handleCopy, text, title, url]);

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-2 text-sm text-primary",
        className,
      )}
    >
      <button
        type="button"
        onClick={handleNativeShare}
        className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 font-medium text-primary transition-colors hover:bg-primary/20"
        aria-label="Share property"
      >
        <Share2 className="h-4 w-4" /> Share
      </button>

      {shareOptions.map((option) => {
        const Icon = option.icon;
        const href = option.getHref(url, title, text);
        return (
          <a
            key={option.key}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-primary/30 px-3 py-1.5 text-primary transition-colors hover:border-primary hover:bg-primary/10"
            title={`Share via ${option.label}`}
            aria-label={`Share on ${option.label}`}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{option.label}</span>
          </a>
        );
      })}

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 rounded-full border border-primary/30 px-3 py-1.5 text-primary transition-colors hover:border-primary hover:bg-primary/10"
        aria-label="Copy link"
      >
        <Copy className="h-4 w-4" />
        <span className="hidden sm:inline">Copy link</span>
      </button>

      <span className="flex items-center gap-2 text-muted-foreground">
        <LinkIcon className="h-4 w-4" />
        <span className="truncate max-w-[140px] text-xs sm:max-w-none">
          {url}
        </span>
      </span>
    </div>
  );
}
