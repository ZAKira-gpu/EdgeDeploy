import { Link } from 'react-router';
import { Zap, Download, CheckCircle, ArrowRight, TrendingDown, Clock } from 'lucide-react';

interface ResultsPageProps {
  data: any;
}

export default function ResultsPage({ data }: ResultsPageProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#0f0f0f] px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">EdgeDeploy</span>
          </div>
          <Link
            to="/dashboard"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Back to Dashboard
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-8 py-12">
        {/* Success Banner */}
        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-xl p-6 mb-8 flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold mb-1">Conversion Successful!</h2>
            <p className="text-gray-400">
              Your model has been converted and is ready to download
            </p>
          </div>
          <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
            <Download className="w-5 h-5" />
            Download Model
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Conversion Summary</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Input Format</span>
                <span className="font-medium">{data?.inputFormat || 'PyTorch'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Output Format</span>
                <span className="font-medium">{data?.outputFormat || 'TensorFlow Lite'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-gray-400">Quantization</span>
                <span className="font-medium">{data?.quantization || 'INT8'}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-400">File Name</span>
                <span className="font-medium text-sm">{data?.fileName || 'model.pt'}</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Performance Metrics</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Size Reduction
                  </span>
                  <span className="font-semibold text-green-400">74.7%</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">24.5 MB</span>
                  <ArrowRight className="w-4 h-4 text-gray-600" />
                  <span className="text-white font-medium">6.2 MB</span>
                </div>
              </div>
              <div className="pt-3 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Processing Time
                  </span>
                  <span className="font-semibold">12.3s</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Model Info */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4">Optimizations Applied</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-blue-400 mb-1">INT8 Quantization</div>
              <div className="text-sm text-gray-400">
                Reduced precision for faster inference
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-purple-400 mb-1">Operator Fusion</div>
              <div className="text-sm text-gray-400">
                Combined operations for efficiency
              </div>
            </div>
            <div className="bg-white/5 rounded-lg p-4">
              <div className="text-green-400 mb-1">Weight Pruning</div>
              <div className="text-sm text-gray-400">
                Removed unnecessary parameters
              </div>
            </div>
          </div>
        </div>

        {/* Download Options */}
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-6">
          <h3 className="text-lg font-semibold mb-4">Download Options</h3>
          <div className="space-y-3">
            {data?.task_id && (
                <>
                <a 
                    href={`/download/${data.task_id}/tflite`}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-between no-underline"
                >
                    <span className="flex items-center gap-3">
                        <Download className="w-5 h-5" />
                        <div className="text-left">
                        <div className="font-medium">Download TFLite Model</div>
                        <div className="text-sm opacity-80">Optimized for mobile & edge</div>
                        </div>
                    </span>
                </a>
                <a 
                    href={`/download/${data.task_id}/onnx`}
                    className="w-full bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/20 transition-colors flex items-center justify-between no-underline"
                >
                    <span className="flex items-center gap-3">
                        <Download className="w-5 h-5" />
                        <div className="text-left">
                        <div className="font-medium">Download ONNX Model</div>
                        <div className="text-sm text-gray-400">Standard cross-platform format</div>
                        </div>
                    </span>
                </a>
                </>
            )}
          </div>
        </div>


        {/* Actions */}
        <div className="flex items-center gap-4 mt-8">
          <Link
            to="/dashboard"
            className="flex-1 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-center"
          >
            Convert Another Model
          </Link>
          <Link
            to="/history"
            className="flex-1 bg-white/5 border border-white/10 text-white px-6 py-3 rounded-lg hover:bg-white/10 transition-colors text-center"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
}
