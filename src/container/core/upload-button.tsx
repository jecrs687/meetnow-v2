"use client";

import { useRef, useState } from "react";
import { Button } from "@core/button";
import { Loader2, Upload } from "lucide-react";

interface UploadButtonProps {
    onUpload?: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxFiles?: number;
    disabled?: boolean;
    className?: string;
    variant?: "default" | "outline" | "secondary";
    text?: string;
}

export function UploadButton({
    onUpload,
    accept = "image/*",
    multiple = false,
    maxFiles = 1,
    disabled = false,
    className = "",
    variant = "secondary",
    text = "Upload"
}: UploadButtonProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleClick = () => {
        if (inputRef.current) {
            inputRef.current.click();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) return;

        if (multiple && maxFiles > 0 && files.length > maxFiles) {
            alert(`You can only upload a maximum of ${maxFiles} files.`);
            return;
        }

        try {
            setIsUploading(true);

            // In a real app, you would upload the files to a server here
            // For this demo, we'll just simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Convert FileList to array for easier handling
            const fileArray = Array.from(files);

            if (onUpload) {
                onUpload(fileArray);
            }
        } catch (error) {
            console.error("Error uploading files:", error);
        } finally {
            setIsUploading(false);

            // Reset the input value to allow the same file to be selected again
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <>
            <input
                type="file"
                ref={inputRef}
                className="hidden"
                accept={accept}
                multiple={multiple}
                onChange={handleFileChange}
                disabled={disabled || isUploading}
            />
            <Button
                type="button"
                variant={variant}
                className={className}
                onClick={handleClick}
                disabled={disabled || isUploading}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    <>
                        <Upload className="mr-2 h-4 w-4" />
                        {text}
                    </>
                )}
            </Button>
        </>
    );
}
