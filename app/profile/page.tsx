'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

type Project = {
  id: string;
  project_name: string;
  created_at: string;
  updated_at: string;
};

type Template = {
  id: string;
  name: string;
  thumbnail_url: string | null;
  project_data: any;
  html_content: string;
  css_content: string;
  created_at: string;
};

type User = {
  id: string;
  name: string;
  email: string;
  subscription_status: 'free' | 'paid';
};

type Tab = 'projects' | 'templates';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');

    if (!storedUser || !storedToken) {
      router.push('/login');
      return;
    }

    // Check if token is expired
    try {
      const payload = storedToken.split('.')[1];
      const decoded = JSON.parse(atob(payload));
      const currentTime = Date.now() / 1000;
      
      if (decoded.exp && decoded.exp < currentTime) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
    } catch (e) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      router.push('/login');
      return;
    }

    try {
      setUser(JSON.parse(storedUser));
      Promise.all([
        fetchProjects(storedToken),
        fetchTemplates(storedToken),
      ]).finally(() => setLoading(false));
    } catch (e) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, []);

  // Convert project_data component tree to HTML string
  const renderComponent = (comp: any): string => {
    if (!comp) return '';

    const styleStr = comp.style
      ? Object.entries(comp.style).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';')
      : '';

    if (comp.type === 'text') {
      return `<p style="${styleStr}">${comp.content || ''}</p>`;
    }
    if (comp.type === 'button') {
      return `<button style="${styleStr}">${comp.content || ''}</button>`;
    }
    if (comp.type === 'image') {
      return `<img src="${comp.src || ''}" alt="${comp.alt || ''}" style="${styleStr}" />`;
    }

    // container, section, div, or any other type with children
    const tag = comp.type === 'section' ? 'section' : 'div';
    const children = (comp.components || []).map(renderComponent).join('');
    return `<${tag} style="${styleStr}">${children}</${tag}>`;
  };

  const buildPreviewHtml = (template: Template): string => {
    // Prefer explicit html_content if available
    if (template.html_content) {
      const css = template.css_content || '';
      const bodyStyles = template.project_data?.styles?.body
        ? Object.entries(template.project_data.styles.body).map(([k, v]) => `${k}:${v}`).join(';')
        : '';
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><style>body{${bodyStyles}}${css}</style></head><body>${template.html_content}</body></html>`;
    }

    // Fall back to rendering project_data component tree
    const pd = template.project_data;
    if (!pd) return '<p style="padding:2rem;color:#888">No preview available.</p>';

    const bodyStyles = pd.styles?.body
      ? Object.entries(pd.styles.body).map(([k, v]) => `${k}:${v}`).join(';')
      : 'margin:0;padding:0';

    const canvasStyles = pd.canvas
      ? Object.entries(pd.canvas).map(([k, v]) => `${k}:${v}`).join(';')
      : '';

    const components = (pd.components || []).map(renderComponent).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>body{${bodyStyles}}</style>
</head>
<body>
  <div style="${canvasStyles}">${components}</div>
</body>
</html>`;
  };

  // Generate a compact HTML preview for thumbnails (without full HTML document)
  const generateThumbnailHtml = (template: Template): string => {
    const pd = template.project_data;
    if (!pd) return '';

    const bodyStyles = pd.styles?.body
      ? Object.entries(pd.styles.body).map(([k, v]) => `${k}:${v}`).join(';')
      : 'margin:0;padding:0';

    const canvasStyles = pd.canvas
      ? Object.entries(pd.canvas).map(([k, v]) => `${k}:${v}`).join(';')
      : '';

    const components = (pd.components || []).map(renderComponent).join('');

    return `<div style="${bodyStyles}"><div style="${canvasStyles}">${components}</div></div>`;
  };

  // Inject HTML+CSS into iframe when preview opens
  useEffect(() => {
    if (previewTemplate && iframeRef.current) {
      const doc = iframeRef.current.contentDocument;
      if (doc) {
        const html = buildPreviewHtml(previewTemplate);
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [previewTemplate]);

  const fetchProjects = async (token: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/projects', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setProjects(data.data || data);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const fetchTemplates = async (token: string) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/templates', {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        router.push('/login');
        return;
      }
      
      if (response.ok) {
        const data = await response.json();
        setTemplates(data.data || data);
      }
    } catch (error) {
      console.error('Failed to fetch templates:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    const token = localStorage.getItem('token') || '';
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      if (response.ok) setProjects(projects.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleCreateNewProject = () => {
    localStorage.removeItem('gjs-project');
    router.push('/editor');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{user?.name}</h1>
                <p className="text-slate-600">{user?.email}</p>
                <span className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                  user?.subscription_status === 'paid'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {user?.subscription_status === 'paid' ? 'Paid Plan' : 'Free Plan'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl border border-slate-200 p-1 w-fit">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'projects' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            My Projects ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-5 py-2 text-sm font-semibold rounded-lg transition-colors ${
              activeTab === 'templates' ? 'bg-red-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Templates ({templates.length})
          </button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">My Projects</h2>
              <button
                onClick={handleCreateNewProject}
                className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-all"
              >
                + Create New Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No projects yet</h3>
                <p className="text-slate-600 mb-6">Start from scratch or pick a template below</p>
              <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handleCreateNewProject}
                    className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-all"
                  >
                    Create from Scratch
                  </button>
                  <button
                    onClick={() => setActiveTab('templates')}
                    className="px-5 py-2.5 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all"
                  >
                    Browse Templates
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div className="p-5">
                      <h3 className="text-base font-semibold text-slate-900 mb-1">{project.project_name}</h3>
                      <p className="text-xs text-slate-500 mb-4">
                        Updated {new Date(project.updated_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/editor?project_id=${project.id}`}
                          className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-center"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="px-4 py-2 text-sm font-semibold text-slate-500 border border-slate-200 rounded-lg hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Templates Tab */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-900">Available Templates</h2>
              <p className="text-sm text-slate-500">Pick a template to start editing instantly</p>
            </div>

            {templates.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates available</h3>
                <p className="text-slate-600">Templates will appear here once added by admin</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {templates.map((template) => (
                  <div key={template.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
                    {/* Thumbnail / Preview area */}
                    <div className="h-44 bg-gradient-to-br from-red-50 to-slate-100 overflow-hidden relative">
                      {template.thumbnail_url ? (
                        <img
                          src={template.thumbnail_url}
                          alt={template.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full p-4">
                          <div
                            className="w-full h-full overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: generateThumbnailHtml(template) }}
                          />
                        </div>
                      )}
                      {/* Hover overlay with Preview button */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="flex items-center gap-2 px-4 py-2 bg-white text-slate-900 text-sm font-semibold rounded-lg shadow-lg hover:bg-slate-50 transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          Preview
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-base font-semibold text-slate-900 mb-1">{template.name}</h3>
                      <p className="text-xs text-slate-500 mb-4">
                        {new Date(template.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPreviewTemplate(template)}
                          className="px-4 py-2 text-sm font-semibold text-slate-600 border border-slate-200 rounded-lg hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Preview
                        </button>
                        <Link
                          href={`/editor?template_id=${template.id}`}
                          className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors text-center"
                        >
                          Use Template
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex flex-col"
          onClick={(e) => { if (e.target === e.currentTarget) setPreviewTemplate(null); }}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-900">Preview: {previewTemplate.name}</span>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Read-only</span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href={`/editor?template_id=${previewTemplate.id}`}
                className="px-5 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Use This Template
              </Link>
              <button
                onClick={() => setPreviewTemplate(null)}
                className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* iframe Preview */}
          <div className="flex-1 overflow-hidden bg-white">
            <iframe
              ref={iframeRef}
              title={`Preview: ${previewTemplate.name}`}
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}
    </div>
  );
}
