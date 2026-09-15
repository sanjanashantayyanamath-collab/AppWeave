'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Navbar } from '@/components/platform/Navbar';
import { Sidebar } from '@/components/platform/Sidebar';
import { useAppStore } from '@/lib/store/app-context';
import { Project } from '@/types/projects';
import { Folder, DocumentItem } from '@/types/documents';
import {
  FileText,
  Folder as FolderIcon,
  ArrowLeft,
  Upload,
  Zap,
  ExternalLink,
  Download,
  FileCode,
} from 'lucide-react';

export default function ProjectDocumentsFolderPage() {
  const params = useParams();
  const projectId = params.project_id as string;

  const {
    projects,
    folders,
    documents,
    uploadDocument,
  } = useAppStore();

  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('CAD Drawing (.dwg)');

  const project = projects.find((p: Project) => p.id === projectId);
  const projectFolders = folders.filter((f: Folder) => f.project_id === projectId);
  const rootFolder = projectFolders.find((f: Folder) => f.parent_id === null) || projectFolders[0];
  const subFolders = projectFolders.filter((f: Folder) => f.parent_id !== null);

  const projectDocs = documents.filter((d: DocumentItem) =>
    projectFolders.some((f: Folder) => f.id === d.folder_id)
  );

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim() || !rootFolder) return;

    await uploadDocument({
      folderId: rootFolder.id,
      name: fileName,
      fileType,
    });

    setFileName('');
    setIsUploadOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
          <div className="space-y-2">
            <Link
              href="/apps/documents"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to All Documents
            </Link>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <FolderIcon className="w-5 h-5" />
                  </div>
                  <h1 className="text-2xl font-bold text-white tracking-tight">
                    {project?.name || 'Project Vault'}
                  </h1>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
                    <Zap className="w-3 h-3" /> Auto-Created via Event
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Auto-provisioned folder structure: <code className="text-amber-300">/projects/{project?.name}/</code>
                </p>
              </div>

              <div className="flex items-center gap-2">
                {project && (
                  <Link
                    href={`/apps/projects/${project.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-850 text-slate-300 text-xs font-semibold"
                  >
                    <span>View Project</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
                <button
                  onClick={() => setIsUploadOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-500/25"
                >
                  <Upload className="w-4 h-4" /> Upload Asset
                </button>
              </div>
            </div>
          </div>

          {/* Subfolders Grid */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Auto-Provisioned Architectural Subfolders
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {subFolders.map((sub: Folder) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 hover:border-amber-500/40 transition flex items-center gap-3"
                >
                  <FolderIcon className="w-5 h-5 text-amber-400 flex-shrink-0" />
                  <div className="truncate">
                    <p className="text-xs font-bold text-white truncate">{sub.name}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Project Specific Folder</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Files */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800/80 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Files in this Vault</h3>
              <span className="text-xs text-slate-400">{projectDocs.length} assets</span>
            </div>

            <div className="space-y-2">
              {projectDocs.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs space-y-2">
                  <p>No drawings uploaded to this project yet.</p>
                  <button
                    onClick={() => setIsUploadOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                  >
                    Upload Drawing
                  </button>
                </div>
              ) : (
                projectDocs.map((doc: DocumentItem) => (
                  <div
                    key={doc.id}
                    className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3">
                      <FileCode className="w-5 h-5 text-amber-400" />
                      <div>
                        <h4 className="text-xs font-bold text-white">{doc.name}</h4>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono">
                            v{doc.version}
                          </span>
                          <span>{doc.file_type}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Upload Modal */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">Upload to {project?.name}</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleUpload} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">File Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Structural_Sections_Rev2.pdf"
                  value={fileName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFileName(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">File Format</label>
                <select
                  value={fileType}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFileType(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white"
                >
                  <option value="CAD Drawing (.dwg)">CAD Drawing (.dwg)</option>
                  <option value="BIM Model (.rvt)">BIM Model (.rvt)</option>
                  <option value="PDF Specification (.pdf)">PDF Specification (.pdf)</option>
                  <option value="Material Schedule (.xlsx)">Material Schedule (.xlsx)</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-amber-600 text-white text-xs font-semibold"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
