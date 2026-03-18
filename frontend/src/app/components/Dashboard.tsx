import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  LayoutDashboard,
  Upload,
  History,
  Settings,
  User,
  LogOut,
  Zap,
  FileUp,
  ChevronDown,
} from 'lucide-react';

interface DashboardProps {
  onStartConversion: (data: any) => void;
}

export default function Dashboard({ onStartConversion }: DashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [inputFormat, setInputFormat] = useState('pytorch');
  const [outputFormat, setOutputFormat] = useState('tflite');
  const [quantization, setQuantization] = useState('none');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleConvert = () => {
    if (!selectedFile) return;

    const conversionData = {
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      inputFormat,
      outputFormat,
      quantization,
    };

    onStartConversion(conversionData);
    navigate('/converting');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0f0f0f] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">EdgeDeploy</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('new')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                activeTab === 'new'
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Upload className="w-5 h-5" />
              New Conversion
            </button>
            <Link
              to="/history"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <History className="w-5 h-5" />
              History
            </Link>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
              <Settings className="w-5 h-5" />
              Settings
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 px-4 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-medium">John Doe</div>
              <div className="text-xs text-gray-500">john@example.com</div>
            </div>
            <button className="text-gray-400 hover:text-white">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="border-b border-white/10 bg-[#0f0f0f]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-8 py-4 flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold">
                {activeTab === 'dashboard' ? 'Dashboard' : 'New Conversion'}
              </h1>
              <p className="text-sm text-gray-400">
                {activeTab === 'dashboard'
                  ? 'Overview of your conversions'
                  : 'Convert your AI model for edge deployment'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm">
                <span className="text-gray-400">Credits:</span>{' '}
                <span className="font-semibold text-blue-400">100</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-1">Total Conversions</div>
                  <div className="text-3xl font-bold">24</div>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-1">This Month</div>
                  <div className="text-3xl font-bold">12</div>
                </div>
                <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-6">
                  <div className="text-sm text-gray-400 mb-1">Avg. Time</div>
                  <div className="text-3xl font-bold">8.4s</div>
                </div>
              </div>

              {/* Quick Action */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-8 text-center">
                <h2 className="text-2xl font-semibold mb-2">Ready to convert a model?</h2>
                <p className="text-gray-400 mb-6">
                  Upload your PyTorch or ONNX model and get started
                </p>
                <button
                  onClick={() => setActiveTab('new')}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  New Conversion
                </button>
              </div>
            </div>
          )}

          {activeTab === 'new' && (
            <div className="max-w-4xl">
              {/* Upload Card */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-8 mb-6">
                <h2 className="text-lg font-semibold mb-4">Upload Model</h2>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
                    isDragging
                      ? 'border-blue-500 bg-blue-500/5'
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  <FileUp className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  {selectedFile ? (
                    <div>
                      <p className="text-lg mb-2">{selectedFile.name}</p>
                      <p className="text-sm text-gray-400">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg mb-2">Drag and drop your model here</p>
                      <p className="text-sm text-gray-400 mb-4">
                        or click to browse (max 500 MB)
                      </p>
                      <label className="inline-block bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors">
                        Browse Files
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          className="hidden"
                          accept=".pt,.pth,.onnx"
                        />
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* Configuration */}
              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-8 mb-6">
                <h2 className="text-lg font-semibold mb-6">Configuration</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Input Format</label>
                    <div className="relative">
                      <select
                        value={inputFormat}
                        onChange={(e) => setInputFormat(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="pytorch">PyTorch (.pt, .pth)</option>
                        <option value="onnx">ONNX (.onnx)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">Output Format</label>
                    <div className="relative">
                      <select
                        value={outputFormat}
                        onChange={(e) => setOutputFormat(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="onnx">ONNX (.onnx)</option>
                        <option value="tflite">TensorFlow Lite (.tflite)</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm mb-2 text-gray-300">
                      Quantization (Optional)
                    </label>
                    <div className="relative">
                      <select
                        value={quantization}
                        onChange={(e) => setQuantization(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                      >
                        <option value="none">None</option>
                        <option value="int8">INT8</option>
                        <option value="fp16">FP16</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Convert Button */}
              <button
                onClick={handleConvert}
                disabled={!selectedFile}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
              >
                Start Conversion
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
