'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { Project } from '@/types/projects';
import { Folder, DocumentItem } from '@/types/documents';
import {
  FileText,
  Folder as FolderIcon,
  FolderPlus,
  Upload,
  Search,
  File,
  ChevronRight,
  ExternalLink,
  FileCode,
  FileSpreadsheet,
  Download,
} from 'lucide-react';

function DocumentsContent() {
  const searchParams = useSearchParams();
  const filterProjectId = searchParams.get('project_id');

  const {
    organization,
    folders,
    documents,
    projects,
    createFolder,
    uploadDocument,
  } = useAppStore();

  const orgFolders = folders.filter((f: Folder) => f.org_id === organization.id);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(
    filterProjectId
      ? orgFolders.find((f: Folder) => f.project_id === filterProjectId)?.id || orgFolders[0]?.id || null
      : orgFolders[0]?.id || null
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderProjectId, setNewFolderProjectId] = useState(filterProjectId || '');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadFileType, setUploadFileType] = useState('CAD Drawing (.dwg)');

  const currentFolder = orgFolders.find((f: Folder) => f.id === selectedFolderId);
  const currentProject = projects.find((p: Project) => p.id === currentFolder?.project_id);

  // Documents in selected folder
  const folderDocs = documents.filter((d: DocumentItem) => d.folder_id === selectedFolderId);
  const filteredDocs = folderDocs.filter((d: DocumentItem) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalStorageBytes = documents.reduce((sum: number, d: DocumentItem) => sum + (d.size || 0), 0);
  const totalStorageMB = (totalStorageBytes / (1024 * 1024)).toFixed(1);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const created = await createFolder(
      newFolderName,
      newFolderProjectId || undefined,
      selectedFolderId || undefined
    );
    setSelectedFolderId(created.id);
    setNewFolderName('');
    setIsFolderModalOpen(false);
  };

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName.trim() || !selectedFolderId) return;

    await uploadDocument({
      folderId: selectedFolderId,
      name: uploadFileName,
      fileType: uploadFileType,
    });

    setUploadFileName('');
    setIsUploadModalOpen(false);
  };

  const getFileIcon = (type?: string) => {
    if (type?.includes('CAD') || type?.includes('dwg')) {
      return <FileCode className="w-5 h-5 text-amber-400" />;
    }
    if (type?.includes('Spreadsheet') || type?.includes('xlsx')) {
      return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
    }
    return <FileText className="w-5 h-5 text-blue-400" />;
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <FileText className="w-5 h-5" />
                </div>
                <h1 className="text-2xl font-bold text-white tracking-tight">Documents Module</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Warm Amber
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Supabase Storage vault for BIM models, CAD floorplans, and client specifications with automatic project binding.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFolderModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-200 text-xs font-semibold transition"
              >
                <FolderPlus className="w-4 h-4 text-amber-400" />
                <span>New Folder</span>
              </button>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                disabled={!selectedFolderId}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-500/25 transition disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Asset</span>
              </button>
            </div>
          </div>

          {/* Storage KPI Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Vault Storage Allocated</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-amber-400">{totalStorageMB} MB</span>
                <span className="text-xs text-slate-500">Supabase Storage</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Project Vault Folders</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{orgFolders.length}</span>
                <span className="text-xs text-emerald-400 font-medium">Cross-app synced</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 space-y-1">
              <p className="text-xs text-slate-400 font-medium">Total Versioned Drawings</p>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-white">{documents.length}</span>
                <span className="text-xs text-blue-400 font-medium">CAD, BIM & Specs</span>
              </div>
            </div>
          </div>

          {/* Main Vault Browser (Two Columns: Folders & Files) */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left: Folders Hierarchy */}
            <div className="p-4 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white uppercase tracking-wider">
                  Vault Folders
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                  {orgFolders.length} Folders
                </span>
              </div>

              <div className="space-y-1 max-h-[500px] overflow-y-auto">
                {orgFolders.map((f: Folder) => {
                  const isSelected = f.id === selectedFolderId;
                  const proj = projects.find((p: Project) => p.id === f.project_id);

                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFolderId(f.id)}
                      className={`w-full text-left p-3 rounded-2xl transition flex items-center justify-between ${
                        isSelected
                          ? 'bg-amber-500/15 text-white border border-amber-500/30 font-semibold shadow-inner'
                          : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FolderIcon className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-amber-400' : 'text-slate-400'}`} />
                        <div className="truncate">
                          <p className="text-xs truncate">{f.name}</p>
                          {proj && (
                            <p className="text-[10px] text-amber-400/80 truncate">⚡ {proj.name}</p>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Files in selected folder */}
            <div className="lg:col-span-3 p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
              {/* Folder Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderIcon className="w-5 h-5 text-amber-400" />
                    <h3 className="text-base font-bold text-white">
                      {currentFolder?.name || 'Root Storage'}
                    </h3>
                  </div>

                  {currentProject && (
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                      <span>Bound Project:</span>
                      <Link
                        href={`/apps/projects/${currentProject.id}`}
                        className="text-blue-400 hover:underline font-medium inline-flex items-center gap-1"
                      >
                        {currentProject.name}
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </p>
                  )}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Filter files..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Files Table / List */}
              <div className="space-y-2">
                {filteredDocs.length === 0 ? (
                  <div className="py-16 text-center text-slate-500 text-xs space-y-3">
                    <File className="w-8 h-8 mx-auto text-slate-600" />
                    <p>No documents uploaded to this folder yet.</p>
                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                    >
                      Upload First Drawing
                    </button>
                  </div>
                ) : (
                  filteredDocs.map((doc: DocumentItem) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 hover:border-amber-500/40 transition flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                          {getFileIcon(doc.file_type)}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-amber-400 transition">
                            {doc.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                            <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono font-semibold">
                              v{doc.version}
                            </span>
                            <span>{doc.file_type || 'Asset'}</span>
                            <span>•</span>
                            <span>{((doc.size || 0) / (1024 * 1024)).toFixed(2)} MB</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[10px] text-slate-500 hidden sm:block">
                          By {doc.uploader_name || 'Team Member'}
                        </span>
                        <a
                          href={doc.file_url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 hover:text-white transition"
                          title="Download asset"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modal: New Folder */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Create Vault Folder</h3>
              <button onClick={() => setIsFolderModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateFolder} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Folder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electrical & Lighting Blueprints"
                  value={newFolderName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFolderName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Link to Project (Optional)</label>
                <select
                  value={newFolderProjectId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewFolderProjectId(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="">No Project Link (General Vault)</option>
                  {projects.map((p: Project) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Upload Document */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Upload Asset to Vault</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUploadFile} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master_Plan_Rev_D.dwg"
                  value={uploadFileName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUploadFileName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Format</label>
                <select
                  value={uploadFileType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setUploadFileType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="CAD Drawing (.dwg)">CAD Drawing (.dwg)</option>
                  <option value="BIM Model (.rvt)">BIM Model (.rvt)</option>
                  <option value="PDF Specification (.pdf)">PDF Specification (.pdf)</option>
                  <option value="Material Schedule (.xlsx)">Material Schedule (.xlsx)</option>
                </select>
              </div>

              <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300">
                Will be uploaded to Supabase Storage bucket with versioning and audit log entry.
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                >
                  Upload & Version
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950" />}>
      <DocumentsContent />
    </Suspense>
  );
}
