'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import type { Editor } from 'grapesjs';
import GrapesJsStudio, { StudioCommands, ToastVariant } from '@grapesjs/studio-sdk/react';
import '@grapesjs/studio-sdk/style';

type InitialContent =
  | { type: 'project'; contentJson: any }
  | { type: 'template'; html: string; css: string }
  | { type: 'blank' };

export default function EditorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project_id');
  const templateId = searchParams.get('template_id');

  const [loading, setLoading] = useState(true);
  const [projectName, setProjectName] = useState('');
  const [initialContent, setInitialContent] = useState<InitialContent>({ type: 'blank' });
  const [editor, setEditor] = useState<Editor | null>(null);
  const [saving, setSaving] = useState(false);

  // Keep a ref so onReady (closure) can access latest initialContent
  const initialContentRef = useRef<InitialContent>({ type: 'blank' });

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!storedToken || !storedUser) {
      router.push('/login');
      return;
    }

    if (projectId) {
      fetchProject(projectId, storedToken);
    } else if (templateId) {
      fetchTemplate(templateId, storedToken);
    } else {
      setLoading(false);
    }
  }, [projectId, templateId]);

  const fetchProject = async (id: string, token: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/projects/${id}`, {
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
        setProjectName(data.project_name);
        const content: InitialContent = { type: 'project', contentJson: data.content_json };
        setInitialContent(content);
        initialContentRef.current = content;
      }
    } catch (error) {
      console.error('Failed to fetch project:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTemplate = async (id: string, token: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/templates/${id}`, {
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
        setProjectName(data.name);
        // Prefer html_content for direct editing; fall back to project_data
        const content: InitialContent = data.html_content
          ? { type: 'template', html: data.html_content, css: data.css_content || '' }
          : { type: 'project', contentJson: data.project_data };
        setInitialContent(content);
        initialContentRef.current = content;
      }
    } catch (error) {
      console.error('Failed to fetch template:', error);
    } finally {
      setLoading(false);
    }
  };

  const onReady = (editorInstance: Editor) => {
    console.log('Editor loaded', editorInstance);
    setEditor(editorInstance);

    const content = initialContentRef.current;

    if (content.type === 'project' && content.contentJson) {
      // Load saved GrapeJS project data
      editorInstance.loadProjectData(content.contentJson);
    } else if (content.type === 'template') {
      // Load raw HTML+CSS from template into GrapeJS
      editorInstance.setComponents(content.html);
      editorInstance.setStyle(content.css);
    }
    // type === 'blank' → leave default content
  };

  const handleSave = async () => {
    if (!projectName.trim()) {
      alert('Please enter a project name');
      return;
    }
    if (!editor) return;

    setSaving(true);
    try {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      const contentJson = editor.getProjectData();
      const html = editor.getHtml();
      const css = editor.getCss();

      // Check if user is creator or admin
      let isCreator = false;
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          isCreator = userData.role === 'creator' || userData.role === 'admin';
        } catch (e) {
          console.error('Failed to parse user data:', e);
        }
      }

      // Determine endpoint based on user role and context
      // If user is creator/admin and editing template → update template
      // Otherwise → create new project
      const endpoint = isCreator && templateId
        ? `http://127.0.0.1:8000/api/templates/${templateId}`
        : 'http://127.0.0.1:8000/api/projects';

      const method = isCreator && templateId ? 'PUT' : 'POST';

      const response = await fetch(endpoint, {
        method: method,
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(isCreator && templateId
          ? {
              name: projectName,
              project_data: contentJson,
              html_content: html,
              css_content: css,
            }
          : {
              project_name: projectName,
              content_json: contentJson,
              html_content: html,
              css_content: css,
              template_id: templateId ?? null,
            }
        ),
      });

      if (response.ok) {
        const data = await response.json();
        if (isCreator && templateId) {
          // Template editing - keep template_id in URL
          showToast('save-success', 'Template saved successfully!', ToastVariant.Success);
        } else {
          // New project created - replace URL
          router.replace(`/editor?project_id=${data.id}`);
        }
      } else {
        showToast('save-error', 'Failed to save', ToastVariant.Error);
      }
    } catch (error) {
      console.error('Failed to save:', error);
      showToast('save-error', 'Failed to save', ToastVariant.Error);
    } finally {
      setSaving(false);
    }
  };

  const showToast = (id: string, message: string, variant: ToastVariant = ToastVariant.Info) => {
    editor?.runCommand(StudioCommands.toastAdd, {
      id,
      header: variant === ToastVariant.Error ? 'Error' : variant === ToastVariant.Success ? 'Success' : 'Info',
      content: message,
      variant,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Editor Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/profile" className="text-slate-600 hover:text-slate-900">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Project Name"
              className="text-lg font-semibold text-slate-900 border-none focus:ring-0 placeholder-slate-400 outline-none"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-bold text-white bg-red-600 rounded-lg hover:bg-red-700 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Project'}
            </button>
          </div>
        </div>
      </header>

      {/* GrapeJS Studio */}
      <div className="flex-1 w-full overflow-hidden">
        <GrapesJsStudio
          onReady={onReady}
          options={{
            licenseKey: 'YOUR_LICENSE_KEY',
            storage: {
              // Use 'self' type to take full control — disable auto browser caching
              type: 'self',
              autosaveChanges: 0,
              autosaveIntervalMs: 0,
              onLoad: async () => ({ project: {} as any }),
              onSave: async () => {},
            },
            project: {
              default: {
                pages: [
                  {
                    name: 'Home',
                    component: `<h1 style="padding: 2rem; text-align: center">Welcome to WIT.SBY Editor 👋</h1>`,
                  },
                ],
              },
            },
          }}
        />
      </div>
    </div>
  );
}
