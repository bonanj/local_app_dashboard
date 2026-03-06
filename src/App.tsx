import { useState, useEffect, useCallback } from 'react';
import { 
  Activity, 
  ExternalLink, 
  RefreshCw, 
  Shield, 
  Terminal, 
  Globe, 
  Cpu,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ScanResult {
  port: number;
  open: boolean;
  title?: string;
}

export default function App() {
  const [results, setResults] = useState<ScanResult[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [lastScan, setLastScan] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const performScan = useCallback(async () => {
    setIsScanning(true);
    setError(null);
    try {
      const response = await fetch('/api/scan');
      if (!response.ok) throw new Error('Failed to scan ports');
      const data = await response.json();
      setResults(data);
      setLastScan(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsScanning(false);
    }
  }, []);

  useEffect(() => {
    performScan();
    const interval = setInterval(performScan, 30000); // Auto-refresh every 30s
    return () => clearInterval(interval);
  }, [performScan]);

  const openPortsCount = results.filter(r => r.open).length;

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header / Mission Control Bar */}
      <header className="border-b border-[#141414] p-4 flex items-center justify-between sticky top-0 bg-[#E4E3E0]/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="bg-[#141414] p-1.5 rounded-sm">
            <Cpu className="w-5 h-5 text-[#E4E3E0]" />
          </div>
          <div>
            <h1 className="text-xs font-bold uppercase tracking-widest">Local Port Explorer</h1>
            <p className="text-[10px] font-mono opacity-60">SYSTEM_STATUS: {isScanning ? 'SCANNING...' : 'IDLE'}</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4">
            <div className="text-right">
              <p className="text-[10px] font-mono opacity-50 uppercase">Active Services</p>
              <p className="text-sm font-mono font-bold">{openPortsCount}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-mono opacity-50 uppercase">Last Update</p>
              <p className="text-sm font-mono font-bold">
                {lastScan ? lastScan.toLocaleTimeString([], { hour12: false }) : '--:--:--'}
              </p>
            </div>
          </div>
          
          <button 
            onClick={performScan}
            disabled={isScanning}
            className="group flex items-center gap-2 bg-[#141414] text-[#E4E3E0] px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-tighter hover:bg-[#141414]/90 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
            {isScanning ? 'Scanning' : 'Refresh'}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-red-100 border border-red-900/20 p-4 rounded-sm flex items-center gap-3 text-red-900"
            >
              <AlertCircle className="w-5 h-5" />
              <p className="text-sm font-medium">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* System Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-[#141414] p-4 flex flex-col justify-between h-32 relative overflow-hidden group">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono opacity-50 uppercase italic">01 // Connectivity</span>
              <Globe className="w-4 h-4 opacity-20" />
            </div>
            <div className="mt-auto">
              <p className="text-3xl font-mono font-bold tracking-tighter truncate" title={window.location.hostname}>
                {window.location.hostname}
              </p>
              <p className="text-[10px] font-mono opacity-60">ACTIVE_INTERFACE</p>
            </div>
          </div>

          <div className="border border-[#141414] p-4 flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono opacity-50 uppercase italic">02 // Range</span>
              <Terminal className="w-4 h-4 opacity-20" />
            </div>
            <div className="mt-auto">
              <p className="text-3xl font-mono font-bold tracking-tighter">3000-3020</p>
              <p className="text-[10px] font-mono opacity-60">TARGET_PORT_SPECTRUM</p>
            </div>
          </div>

          <div className="border border-[#141414] p-4 flex flex-col justify-between h-32 relative overflow-hidden">
            <div className="flex justify-between items-start">
              <span className="text-[10px] font-mono opacity-50 uppercase italic">03 // Security</span>
              <Shield className="w-4 h-4 opacity-20" />
            </div>
            <div className="mt-auto">
              <p className="text-3xl font-mono font-bold tracking-tighter">SECURED</p>
              <p className="text-[10px] font-mono opacity-60">INTERNAL_SCAN_ONLY</p>
            </div>
          </div>
        </div>

        {/* Data Grid Section */}
        <section className="border border-[#141414] bg-white/50">
          <div className="grid grid-cols-5 md:grid-cols-12 border-b border-[#141414] bg-[#141414] text-[#E4E3E0] p-3 text-[10px] font-mono uppercase tracking-widest">
            <div className="col-span-1">Port</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-2 md:col-span-4">App Title</div>
            <div className="col-span-1 md:col-span-5">Service URL</div>
            <div className="col-span-1 text-right">Action</div>
          </div>

          <div className="divide-y divide-[#141414]/10">
            {results.length === 0 && !isScanning ? (
              <div className="p-12 text-center opacity-40 italic font-serif">
                Initializing system scan...
              </div>
            ) : (
              results.map((result) => (
                <motion.div 
                  key={result.port}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`grid grid-cols-5 md:grid-cols-12 p-3 items-center transition-colors hover:bg-[#141414] hover:text-[#E4E3E0] group cursor-default`}
                >
                  <div className="col-span-1 font-mono font-bold text-sm">
                    {result.port}
                  </div>
                  <div className="col-span-1 flex items-center gap-2">
                    {result.open ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:text-emerald-400" />
                        <span className="text-[10px] font-mono font-bold uppercase text-emerald-600 group-hover:text-emerald-400">Open</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-3.5 h-3.5 text-red-600 group-hover:text-red-400 opacity-40" />
                        <span className="text-[10px] font-mono uppercase opacity-40">Closed</span>
                      </>
                    )}
                  </div>
                  <div className="col-span-2 md:col-span-4 font-mono text-[11px] truncate pr-4 italic opacity-80 group-hover:opacity-100">
                    {result.open ? (result.title || 'Unknown Service') : '---'}
                  </div>
                  <div className="col-span-1 md:col-span-5 font-mono text-[11px] truncate opacity-60 group-hover:opacity-100">
                    {result.open ? `http://${window.location.hostname}:${result.port}` : '---'}
                  </div>
                  <div className="col-span-1 text-right">
                    {result.open && (
                      <a 
                        href={`http://${window.location.hostname}:${result.port}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] font-bold uppercase border-b border-[#141414] group-hover:border-[#E4E3E0] pb-0.5"
                      >
                        Launch <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Footer Info */}
        <footer className="pt-8 border-t border-[#141414]/10 flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest">System Logs</p>
            <div className="bg-[#141414] text-[#E4E3E0] p-3 rounded-sm font-mono text-[10px] leading-relaxed max-w-md">
              <p className="opacity-50">[{new Date().toISOString()}] Initializing port spectrum analysis...</p>
              <p className="opacity-50">[{new Date().toISOString()}] Scanning range 3000-3020 on 127.0.0.1</p>
              {openPortsCount > 0 && (
                <p className="text-emerald-400">[{new Date().toISOString()}] Found {openPortsCount} active service(s).</p>
              )}
            </div>
          </div>
          
          <div className="text-right flex flex-col justify-end">
            <p className="text-[10px] font-mono opacity-40 uppercase tracking-widest italic">Crafted for precision</p>
            <p className="text-[10px] font-mono opacity-60">© 2024 PORT_EXPLORER_V1.0</p>
          </div>
        </footer>
      </main>

      {/* Scanning Overlay */}
      <AnimatePresence>
        {isScanning && results.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#E4E3E0] flex flex-col items-center justify-center z-50"
          >
            <Activity className="w-12 h-12 animate-pulse mb-4" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-[0.3em]">Calibrating Sensors...</h2>
            <div className="w-48 h-1 bg-[#141414]/10 mt-6 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-[#141414]"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
