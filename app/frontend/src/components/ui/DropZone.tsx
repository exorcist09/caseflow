import React from "react";
import { cn } from "@/utils/cn";
// TODO fix this import path

interface DropZoneProps {
  onDrop: (files: FileList) => void;
  isDragging: boolean;
}

export default function DropZone({ onDrop, isDragging }: DropZoneProps) {
  return (
    <div
      tabIndex={0}
      role="button"
      onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLElement).click()}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e.dataTransfer.files);
      }}
      className={cn(
        "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-2xl cursor-pointer transition",
        isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
      )}
    >
      <div className="text-center space-y-3">
        <svg
          className="w-16 h-16 mx-auto text-blue-500"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16v-8m0 0l-3 3m3-3l3 3m-9 8h12a2 2 0 002-2V7a2 2 0 00-2 2H6a2 2 0 00-2 2v7a2 2 0 002 2z"
          />
        </svg>
        <p className="font-semibold text-gray-700">
          Drag & Drop your CSV file here
        </p>
        <p className="text-sm text-gray-500">or click to browse</p>
      </div>
    </div>
  );
}
