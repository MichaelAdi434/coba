import { useCallback, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, X, FileImage } from 'lucide-react';
import { useBooking } from '@/contexts/BookingContext';

export const UploadPaymentProof = () => {
  const { paymentProof, setPaymentProof } = useBooking();
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload only JPG, PNG, or PDF files');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setPaymentProof(file);

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const removeFile = () => {
    setPaymentProof(null);
    setPreview(null);
  };

  return (
    <div className="space-y-4">
      {!paymentProof ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 transition-all duration-200 ${
            dragActive
              ? 'border-indigo-500 bg-indigo-500/10'
              : 'border-neutral-700 hover:border-neutral-600 bg-neutral-800/30'
          }`}
        >
          <input
            type="file"
            id="file-upload"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleChange}
            className="hidden"
          />

          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-500/20 to-rose-500/20 flex items-center justify-center mb-4"
            >
              <Upload className="w-8 h-8 text-indigo-400" />
            </motion.div>

            <p className="text-lg font-medium text-neutral-200 mb-2">
              Drop your payment proof here
            </p>
            <p className="text-sm text-neutral-400 mb-4">or click to browse</p>
            <p className="text-xs text-neutral-500">
              Supported formats: JPG, PNG, PDF (Max 5MB)
            </p>
          </label>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative border-2 border-green-500/50 rounded-2xl p-6 bg-green-500/10"
        >
          <button
            onClick={removeFile}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/30 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-red-400" />
          </button>

          <div className="flex items-start gap-4">
            {preview ? (
              <img
                src={preview}
                alt="Payment proof preview"
                className="w-24 h-24 rounded-xl object-cover border-2 border-neutral-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-xl bg-neutral-800 flex items-center justify-center border-2 border-neutral-700">
                <FileImage className="w-12 h-12 text-neutral-500" />
              </div>
            )}

            <div className="flex-1">
              <p className="font-medium text-neutral-200 mb-1">{paymentProof.name}</p>
              <p className="text-sm text-neutral-400">
                {(paymentProof.size / 1024 / 1024).toFixed(2)} MB
              </p>
              <div className="mt-3 flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs text-green-400">File uploaded successfully</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
        <p className="text-sm text-blue-300 font-medium mb-2">Payment Instructions:</p>
        <ol className="text-xs text-blue-200/80 space-y-1 list-decimal list-inside">
          <li>Transfer to: Bank BCA 1234567890 (Sendratari Production)</li>
          <li>Upload your payment proof (screenshot/receipt)</li>
          <li>Your booking will be confirmed within 24 hours</li>
        </ol>
      </div>
    </div>
  );
};
