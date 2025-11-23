import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SpinnerProps extends React.SVGProps<SVGSVGElement> {
    size?: number;
}

export const Spinner = ({ className, size = 24, ...props }: SpinnerProps) => {
    return (
        <Loader2 
            className={cn("animate-spin", className)} 
            size={size}
            {...props} 
        />
    );
};
