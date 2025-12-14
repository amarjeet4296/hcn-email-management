import { useState } from 'react';
import { Play, Loader2 } from 'lucide-react';
import { useProcessEmails } from '@/hooks/useBookings';
import toast from 'react-hot-toast';

export default function ProcessButton() {
  const [isProcessing, setIsProcessing] = useState(false);
  const processEmailsMutation = useProcessEmails();

  const handleProcess = async () => {
    if (isProcessing) return;

    const confirmed = window.confirm(
      'This will start the full email process:\n\n' +
      '1. Send HCN request emails\n' +
      '2. Check inbox for responses\n' +
      '3. Send reminders if needed\n\n' +
      'This may take several minutes. Continue?'
    );

    if (!confirmed) return;

    setIsProcessing(true);
    const loadingToast = toast.loading('Processing emails... This may take a few minutes');

    try {
      await processEmailsMutation.mutateAsync({ action: 'full_process' });
      toast.success('Email process completed successfully!', {
        id: loadingToast,
        duration: 5000,
      });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to process emails',
        { id: loadingToast }
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <button
      onClick={handleProcess}
      disabled={isProcessing}
      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      {isProcessing ? (
        <>
          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          Processing...
        </>
      ) : (
        <>
          <Play className="w-5 h-5 mr-2" />
          Start Full Process
        </>
      )}
    </button>
  );
}
