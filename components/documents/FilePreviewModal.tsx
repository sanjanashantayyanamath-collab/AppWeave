'use client';

import React from 'react';
import { DocumentItem } from '@/types/documents';
import { X, Download, FileText, Calendar, HardDrive } from 'lucide-react';

interface FilePreviewModalProps {
  document: DocumentItem | null;
  onClose: () => void;
}

export function FilePreviewModal({ document, onClose }: FilePreviewModalProps) {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white truncate max-w-xs">{document.name}</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-500">Format:</span>
              <span className="font-semibold text-white">{document.file_type || 'CAD Asset'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Version:</span>
              <span className="font-semibold text-amber-400">v{document.version}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Size:</span>
              <span className="text-white">{((document.size || 0) / (1024 * 1024)).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Uploaded By:</span>
              <span className="text-white">{document.uploader_name || 'Architect'}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs text-slate-400 hover:text-white"
          >
            Close
          </button>
          <a
            href={document.file_url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" /> Download Asset
          </a>
        </div>
      </div>
    </div>
  );
}
