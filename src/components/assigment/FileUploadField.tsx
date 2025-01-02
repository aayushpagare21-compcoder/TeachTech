import { Upload, Info, FileText } from "lucide-react";
import { Label } from "teachtech/components/ui/label";
export const FileUploadField = ({
  id,
  label,
  description,
  exampleFormat,
  selectedFile,
  onFileChange,
}: {
  id: string;
  label: string;
  description: string;
  exampleFormat: React.ReactNode;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center gap-2">
      <Label htmlFor={id} className="text-lg font-semibold">
        {label}
      </Label>
      <Info className="h-4 w-4 text-gray-500" />
    </div>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
      <h3 className="text-sm font-semibold text-blue-900 mb-2">
        {description}
      </h3>
      <div className="bg-white p-4 rounded-md text-sm overflow-auto">
        {exampleFormat}
      </div>
    </div>
    <div className="flex items-center justify-center">
      <label
        htmlFor={id}
        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <Upload className="w-8 h-8 mb-2 text-gray-500" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Click to upload</span> (or drag and
            drop)
          </p>
          <p className="text-xs text-gray-500">Single PDF file (max 5 MB)</p>
        </div>
        <input
          id={id}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={onFileChange}
        />
      </label>
    </div>
    {selectedFile && (
      <p className="text-sm text-green-600 flex items-center gap-2">
        <FileText className="h-4 w-4" />
        Selected file: {selectedFile.name}
      </p>
    )}
  </div>
);
