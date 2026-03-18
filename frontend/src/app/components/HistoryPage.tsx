import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Zap, Download, CheckCircle, XCircle, Clock, Search, Filter, Loader2 } from 'lucide-react';

export default function HistoryPage() {
  const navigate = useNavigate();
  const [conversions, setConversions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, success: 0, failed: 0 });

  useEffect(() => {
    const apiKey = localStorage.getItem('api_key');
    if (!apiKey) {
      navigate('/auth');
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await fetch('/tasks', {
          headers: { 'X-API-Key': apiKey }
        });
        if (!res.ok) throw new Error('Failed to fetch history');
        const data = await res.json();
        
        setConversions(data.tasks);
        setStats({
          total: data.count,
          success: data.tasks.filter((t: any) => t.status === 'completed').length,
          failed: data.tasks.filter((t: any) => t.status === 'failed').length,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-[#0f0f0f] flex flex-col">
        <div className="p-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg">EdgeDeploy</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <Link
              to="/dashboard"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Dashboard
            </Link>
            <div className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg bg-blue-500/10 text-blue-400">
              History
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <header className="border-b border-white/10 bg-[#0f0f0f]/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="px-8 py-4">
            <h1 className="text-xl font-semibold mb-1">Conversion History</h1>
            <p className="text-sm text-gray-400">View and download your past conversions</p>
          </div>
        </header>

        <div className="p-8">
          {/* Filters and Search */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversions..."
                className="w-full bg-white/5 border border-white/10 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button className="bg-white/5 border border-white/10 text-white px-4 py-3 rounded-lg hover:bg-white/10 transition-colors flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filter
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Total Conversions</div>
              <div className="text-2xl font-bold">24</div>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Successful</div>
              <div className="text-2xl font-bold text-green-400">22</div>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Failed</div>
              <div className="text-2xl font-bold text-red-400">2</div>
            </div>
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl p-4">
              <div className="text-sm text-gray-400 mb-1">Avg. Time</div>
              <div className="text-2xl font-bold">8.4s</div>
            </div>
          </div>

          {/* Table */}
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0f0f0f] border border-white/10 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Model Name
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Format
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Size
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Date
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {conversions.map((conversion) => (
                    <tr
                      key={conversion.task_id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium">{conversion.task_id.slice(0, 8)}...</div>
                        <div className="text-sm text-gray-400">{conversion.precision}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          PyTorch → TFLite/ONNX
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {conversion.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            Completed
                          </span>
                        ) : conversion.status === 'failed' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 text-sm">
                            <XCircle className="w-4 h-4" />
                            Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm">
                            <Clock className="w-4 h-4" />
                            {conversion.status.charAt(0).toUpperCase() + conversion.status.slice(1)}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm">-</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          {new Date(conversion.created_at).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {conversion.status === 'completed' && conversion.outputs ? (
                          <div className="flex gap-2">
                            {conversion.outputs.tflite && (
                                <a 
                                    href={`/download/${conversion.task_id}/tflite`}
                                    className="bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-xs"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    TFLite
                                </a>
                            )}
                             {conversion.outputs.onnx && (
                                <a 
                                    href={`/download/${conversion.task_id}/onnx`}
                                    className="bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 text-xs"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    ONNX
                                </a>
                            )}
                          </div>
                        ) : (
                          <button className="bg-white/5 text-gray-500 px-4 py-2 rounded-lg cursor-not-allowed text-sm">
                            Unavailable
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-400">Showing 1-5 of 24 conversions</div>
            <div className="flex items-center gap-2">
              <button className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                Previous
              </button>
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg text-sm">1</button>
              <button className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                2
              </button>
              <button className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                3
              </button>
              <button className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
