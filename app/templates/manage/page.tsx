'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type Template = {
  id: string;
  name: string;
  thumbnail_url: string | null;
  project_data: any;
  html_content: string;
  css_content: string;
  created_at: string;
};

export default function ManageTemplatesPage() {
  const router = useRouter();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState('');

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

    // Check if user is creator or admin
    try {
      const userData = JSON.parse(storedUser);
      if (userData.role !== 'creator' && userData.role !== 'admin') {
        router.push('/profile');
        return;
      }
    } catch (e) {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      router.push('/login');
      return;
    }

    fetchTemplates(storedToken);
  }, []);

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
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplateName.trim()) {
      alert('Please enter a template name');
      return;
    }

    const token = localStorage.getItem('token') || '';
    try {
      const response = await fetch('http://127.0.0.1:8000/api/templates', {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          name: newTemplateName,
          project_data: {
            canvas: {},
            styles: {},
            components: []
          },
          html_content: '',
          css_content: ''
        }),
      });

      if (response.ok) {
        setNewTemplateName('');
        setShowCreateModal(false);
        fetchTemplates(token);
      } else {
        alert('Failed to create template');
      }
    } catch (error) {
      console.error('Failed to create template:', error);
      alert('Failed to create template');
    }
  };

  const handleDeleteTemplate = async (templateId: string) => {
    if (!confirm('Are you sure you want to delete this template?')) return;
    
    const token = localStorage.getItem('token') || '';
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/templates/${templateId}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`, 
          'Content-Type': 'application/json' 
        },
      });

      if (response.ok) {
        setTemplates(templates.filter(t => t.id !== templateId));
      }
    } catch (error) {
      console.error('Failed to delete template:', error);
    }
  };

  const handleEditTemplate = (templateId: string) => {
    router.push(`/editor?template_id=${templateId}`);
  };

  // Helper functions for preview
  const renderComponent = (comp: any): string => {
    if (!comp) return '';

    const styleStr = comp.style
      ? Object.entries(comp.style)
          .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
          .join(';')
      : '';

    const attrsStr = comp.attributes
      ? Object.entries(comp.attributes)
          .map(([k, v]) => `${k}="${String(v).replace(/"/g, '&quot;')}"`)
          .join(' ')
      : '';

    const children = (comp.components || []).map(renderComponent).join('');
    const content = comp.content || '';

    if (comp.type === 'text') {
      return `<span style="${styleStr}">${content}${children}</span>`;
    }
    if (comp.type === 'link') {
      const href = comp.attributes?.href || '#';
      return `<a href="${href}" style="${styleStr}" ${attrsStr}>${content}${children}</a>`;
    }
    if (comp.type === 'button') {
      return `<button style="${styleStr}" ${attrsStr}>${content}${children}</button>`;
    }
    if (comp.type === 'image') {
      return `<img src="${comp.src || comp.attributes?.src || ''}" alt="${comp.alt || comp.attributes?.alt || ''}" style="${styleStr}" ${attrsStr} />`;
    }
    if (comp.type === 'section') {
      return `<section style="${styleStr}" ${attrsStr}>${content}${children}</section>`;
    }
    if (comp.type === 'header') {
      return `<header style="${styleStr}" ${attrsStr}>${content}${children}</header>`;
    }
    if (comp.type === 'footer') {
      return `<footer style="${styleStr}" ${attrsStr}>${content}${children}</footer>`;
    }
    if (comp.type === 'nav') {
      return `<nav style="${styleStr}" ${attrsStr}>${content}${children}</nav>`;
    }

    return `<div style="${styleStr}" ${attrsStr}>${content}${children}</div>`;
  };

  const buildStylesBlock = (styles: Record<string, any> = {}): string => {
    return Object.entries(styles)
      .map(([selector, rules]) => {
        const declarations = Object.entries(rules as Record<string, string>)
          .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
          .join(';');
        return `${selector}{${declarations}}`;
      })
      .join('\n');
  };

  const buildPreviewHtml = (template: Template): string => {
    if (template.html_content) {
      const css = template.css_content || '';
      const stylesBlock = buildStylesBlock(template.project_data?.styles);
      return `<!DOCTYPE html><html><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><style>${stylesBlock}${css}</style></head><body>${template.html_content}</body></html>`;
    }

    const pd = template.project_data;
    if (!pd) return '<html><body></body></html>';

    const stylesBlock = buildStylesBlock(pd.styles);
    const canvasStyles = pd.canvas
      ? Object.entries(pd.canvas).map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`).join(';')
      : '';
    const components = (pd.components || []).map(renderComponent).join('');

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>${stylesBlock}</style>
</head>
<body>
  <div style="${canvasStyles}">${components}</div>
</body>
</html>`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Templates</h1>
            <p className="text-slate-600 mt-1">Create and manage your reusable templates</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-all"
          >
            + Create New Template
          </button>
        </div>

        {/* Back to Profile */}
        <div className="mb-6">
          <Link 
            href="/profile" 
            className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            Back to Profile
          </Link>
        </div>

        {/* Templates Grid */}
        {templates.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No templates yet</h3>
            <p className="text-slate-600 mb-6">Create your first template to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Create Your First Template
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.map((template) => (
              <div key={template.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow group">
                {/* Thumbnail */}
                <div className="h-44 bg-white overflow-hidden relative">
                  {template.thumbnail_url ? (
                    <img
                      src={template.thumbnail_url}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <iframe
                      srcDoc={buildPreviewHtml(template)}
                      title={template.name}
                      sandbox="allow-same-origin"
                      className="border-0 absolute top-0 left-0 pointer-events-none"
                      style={{
                        width: '1920px',
                        height: '1080px',
                        transformOrigin: 'top left',
                        transform: `scale(${176 / 800})`,
                      }}
                    />
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                    <button
                      onClick={() => handleEditTemplate(template.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg shadow-lg hover:bg-red-700 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-semibold text-slate-900 mb-1">{template.name}</h3>
                  <p className="text-xs text-slate-500 mb-4">
                    {new Date(template.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </p>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="w-full px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Delete Template
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewTemplate && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex flex-col"
          onClick={(e) => { if (e.target === e.currentTarget) setPreviewTemplate(null); }}
        >
          <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 shrink-0">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-slate-900">Preview: {previewTemplate.name}</span>
              <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">Read-only</span>
            </div>
            <div className="flex items-center gap-3">
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

          <div className="flex-1 overflow-hidden bg-white">
            <iframe
              srcDoc={buildPreviewHtml(previewTemplate)}
              title={`Preview: ${previewTemplate.name}`}
              className="w-full h-full border-0"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      )}

      {/* Create Template Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Create New Template</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="templateName" className="block text-sm font-semibold text-slate-700 mb-2">
                  Template Name
                </label>
                <input
                  id="templateName"
                  type="text"
                  value={newTemplateName}
                  onChange={(e) => setNewTemplateName(e.target.value)}
                  placeholder="Enter template name"
                  className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none"
                  autoFocus
                />
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateTemplate}
                  className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Create Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
