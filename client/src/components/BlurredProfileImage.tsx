import { User } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useLanguage } from "@/hooks/useLanguage";

interface BlurredProfileImageProps {
  professional: User;
  blurred: boolean;
  className?: string;
}

export function BlurredProfileImage({ professional, blurred, className = "" }: BlurredProfileImageProps) {
  const { t } = useLanguage();
  
  const initials = professional.fullName
    ? professional.fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : professional.username.substring(0, 2).toUpperCase();

  return (
    <div className="relative">
      <Avatar className={`rounded-full overflow-hidden ${className}`}>
        <AvatarImage 
          src={professional.profileImageUrl || ""} 
          alt={professional.fullName || professional.username}
          className={blurred ? "blur-md" : ""} 
        />
        <AvatarFallback className="text-lg">{initials}</AvatarFallback>
      </Avatar>
      
      {blurred && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-amber-100 text-amber-800 px-2 py-1 text-xs rounded-md opacity-90">
            {t('subscription_expired')}
          </div>
        </div>
      )}
    </div>
  );
}