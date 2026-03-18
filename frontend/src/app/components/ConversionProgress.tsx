import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Zap, CheckCircle, Loader2 } from 'lucide-react';

interface ConversionProgressProps {
  data: any;
}

export default function ConversionProgress({ data }: ConversionProgressProps) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const steps = [
    { label: 'Uploading', status: 'complete' },
    { label: 'Converting', status: 'active' },
    { label: 'Optimizing', status: 'pending' },
    { label: 'Complete', status: 'pending' },
  ];

  useEffect(() => {
    // Simulate conversion process
    const logMessages = [
      '> Starting conversion process...',
      `> Uploading ${data?.fileName || 'model.pt'}...`,
      '> Upload complete (2.3s)',
      '',
      '> Analyzing model structure...',
      '> Converting PyTorch → ONNX...',
      '> ONNX conversion successful',
      '',
      '> Converting ONNX → TensorFlow Lite...',
      '> Applying quantization...',
      '> Optimizing model...',
      '',
      '> Conversion complete!',
      '> Model size: 24.5 MB → 6.2 MB (74.7% reduction)',
      '> Time elapsed: 12.3s',
    ];

    let index = 0;
    const interval = setInterval(() => {
      if (index < logMessages.length) {
        setLogs((prev) => [...prev, logMessages[index]]);
        index++;

        // Update steps
        if (index === 3) setCurrentStep(1);
        if (index === 8) setCurrentStep(2);
        if (index === 11) setCurrentStep(3);
      } else {
        clearInterval(interval);
        setTimeout(() => navigate('/results'), 1000);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [navigate, data]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f0f] px-8 py-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <span className="font-semibold text-lg">EdgeDeploy</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Converting Model</h1>
          <p className="text-gray-400">Please wait while we process your model...</p>
        </div>

        {/* Progress Steps */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex-1 relative">
                <div className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${
                      index <= currentStep
                        ? 'bg-blue-500 border-blue-500'
                        : 'bg-[#0f0f0f] border-white/20'
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle className="w-6 h-6" />
                    ) : index === currentStep ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <div className="w-3 h-3 rounded-full bg-white/20"></div>
                    )}
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 transition-all ${
                        index < currentStep ? 'bg-blue-500' : 'bg-white/20'
                      }`}
                    ></div>
                  )}
                </div>
                <div className="absolute top-14 left-0 w-12 text-center">
                  <div
                    className={`text-sm font-medium whitespace-nowrap ${
                      index <= currentStep ? 'text-white' : 'text-gray-500'
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Progress Bar */}
          <div className="mt-12">
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Logs Panel */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden">
          <div className="border-b border-white/10 px-6 py-3 flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-sm text-gray-400 ml-2">Conversion Logs</span>
          </div>
          <div className="p-6 font-mono text-sm space-y-1 max-h-96 overflow-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`${
                  log.includes('✓') || log.includes('complete')
                    ? 'text-green-400'
                    : log.includes('>')
                    ? 'text-blue-400'
                    : 'text-gray-300'
                }`}
              >
                {log || '\u00A0'}
              </div>
            ))}
            {logs.length > 0 && (
              <div className="inline-block w-2 h-4 bg-blue-400 animate-pulse"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
