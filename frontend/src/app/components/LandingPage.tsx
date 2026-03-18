import { Link } from 'react-router';
import { ArrowRight, Zap, Shield, Gauge, Github, Twitter, Linkedin } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">EdgeDeploy</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-gray-400 hover:text-white transition-colors">
              How it Works
            </a>
            <Link
              to="/auth"
              className="text-sm bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
            Now in Public Beta
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent leading-tight">
            Convert AI Models for<br />Edge Deployment in Seconds
          </h1>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Upload your PyTorch or ONNX model and get edge-ready formats instantly. Fast, reliable, and developer-friendly.
          </p>
          <div className="flex items-center gap-4 justify-center">
            <Link
              to="/auth"
              className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2 shadow-lg shadow-blue-500/25"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="border border-white/20 text-white px-8 py-4 rounded-lg hover:bg-white/5 transition-colors">
              View Demo
            </button>
          </div>

          {/* Visual Element */}
          <div className="mt-16 relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-600/20 blur-3xl"></div>
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-8 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="text-left font-mono text-sm space-y-2">
                <div className="text-gray-500">$ edgedeploy convert model.pt</div>
                <div className="text-green-400">✓ Uploading model...</div>
                <div className="text-green-400">✓ Converting PyTorch → ONNX</div>
                <div className="text-green-400">✓ Converting ONNX → TensorFlow Lite</div>
                <div className="text-green-400">✓ Applying INT8 quantization</div>
                <div className="text-blue-400">Done in 12.3s</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Built for AI Developers</h2>
            <p className="text-gray-400 text-lg">Everything you need to deploy models at the edge</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-8 hover:border-blue-500/50 transition-colors">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Multi-Format Support</h3>
              <p className="text-gray-400">
                Convert between PyTorch, ONNX, and TensorFlow Lite seamlessly. Support for all major model formats.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-8 hover:border-purple-500/50 transition-colors">
              <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                <Gauge className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Quantization</h3>
              <p className="text-gray-400">
                Optimize models with INT8 and FP16 quantization. Reduce size by up to 75% without sacrificing accuracy.
              </p>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-8 hover:border-green-500/50 transition-colors">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Fast Cloud Processing</h3>
              <p className="text-gray-400">
                Lightning-fast conversions powered by optimized cloud infrastructure. Get results in seconds, not minutes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">How it Works</h2>
            <p className="text-gray-400 text-lg">Three simple steps to edge-ready models</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Model</h3>
              <p className="text-gray-400">
                Drag and drop your PyTorch or ONNX model. We support all standard formats.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Select Options</h3>
              <p className="text-gray-400">
                Choose output format and quantization settings. We'll optimize for your use case.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Download</h3>
              <p className="text-gray-400">
                Get your converted model in seconds. Ready to deploy on any edge device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Deploy at the Edge?</h2>
          <p className="text-gray-400 text-lg mb-8">
            Join thousands of developers building the next generation of AI applications
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-blue-500/25"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <span className="font-semibold">EdgeDeploy</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Documentation</a>
              <a href="#" className="hover:text-white transition-colors">API</a>
              <a href="#" className="hover:text-white transition-colors">Support</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="text-center text-sm text-gray-500 mt-8">
            © 2026 EdgeDeploy. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
