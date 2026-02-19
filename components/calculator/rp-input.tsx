import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface RpInputProps {
    label?: string;
    helperText?: string;
    value: number;
    onChange: (v: number) => void;
    placeholder?: string;
    className?: string;
}

export function RpInput({
    label,
    helperText,
    value,
    onChange,
    placeholder,
    className = "",
}: RpInputProps) {
    return (
        <div className="flex flex-col gap-1.5">
            {label && (
                <Label className="text-sm font-semibold text-slate-700">{label}</Label>
            )}
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none z-10">
                    Rp
                </span>
                <Input
                    type="number"
                    min="0"
                    value={value || ""}
                    placeholder={placeholder ?? "0"}
                    onChange={(e) => {
                        const v = parseFloat(e.target.value);
                        onChange(isNaN(v) || v < 0 ? 0 : v);
                    }}
                    onFocus={(e) => e.target.select()}
                    className={`pl-10 h-10 ${className}`}
                />
            </div>
            {helperText && (
                <p className="text-xs text-muted-foreground">{helperText}</p>
            )}
        </div>
    );
}
