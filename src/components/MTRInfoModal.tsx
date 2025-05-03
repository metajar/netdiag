import React from 'react';
import { X } from 'lucide-react';

interface MTRInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MTRInfoModal: React.FC<MTRInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Understanding MTR Results</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <section>
            <h3 className="text-lg font-medium text-blue-400 mb-2">Packet Loss Interpretation</h3>
            <p className="text-gray-300">
              A common misconception is that packet loss at intermediate hops indicates network problems. 
              However, if the final destination shows minimal or no packet loss, the intermediate losses 
              typically don't impact overall connectivity.
            </p>
            <div className="mt-2 bg-gray-700 p-4 rounded-md">
              <p className="text-sm">
                <strong>Key Point:</strong> Intermediate hop packet loss often occurs because:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-300">
                <li>Routers prioritize forwarding traffic over responding to ICMP requests</li>
                <li>Rate limiting of ICMP responses</li>
                <li>Security policies that drop or limit ICMP traffic</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-blue-400 mb-2">Reading Latency Values</h3>
            <div className="space-y-2">
              <p className="text-gray-300">The test shows several latency measurements:</p>
              <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
                <li><strong>Last:</strong> Most recent round-trip time</li>
                <li><strong>Avg:</strong> Average round-trip time</li>
                <li><strong>Best:</strong> Lowest recorded latency</li>
                <li><strong>Wrst:</strong> Highest recorded latency</li>
                <li><strong>StDev:</strong> Standard deviation (jitter indicator)</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-medium text-blue-400 mb-2">Network Path Analysis</h3>
            <p className="text-gray-300">
              MTR combines ping and traceroute to show the entire path to your destination. 
              Each hop represents a router in the path, providing:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm text-gray-300">
              <li>Path visualization from source to destination</li>
              <li>Performance metrics for each network segment</li>
              <li>Identification of potential bottlenecks</li>
              <li>Network operator information through ASN lookup</li>
            </ul>
          </section>

          <div className="mt-6 bg-blue-900/30 p-4 rounded-md border border-blue-800/50">
            <h4 className="text-lg font-medium mb-2">Best Practices</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
              <li>Focus on final destination metrics for overall health assessment</li>
              <li>Consider latency trends rather than individual spikes</li>
              <li>Use multiple tests at different times for better accuracy</li>
              <li>Compare results with known good baselines</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MTRInfoModal;