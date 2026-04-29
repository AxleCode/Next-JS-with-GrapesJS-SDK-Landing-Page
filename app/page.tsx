'use client';

import { useState, useEffect } from 'react';
import type { Editor } from 'grapesjs';
import GrapesJsStudio from '@grapesjs/studio-sdk/react';

import '@grapesjs/studio-sdk/style';

export default function Home() {
  const [editor, setEditor] = useState<Editor>();

  const onReady = (editorInstance: Editor) => {
    console.log('GrapesJS Studio Ready', editorInstance);
    setEditor(editorInstance);

    // Auto-save system + restore from localStorage
    const handleStorage = () => {
      try {
        const projectData = editorInstance.getProjectData();
        const html = editorInstance.getHtml();
        const css = editorInstance.getCss();

        const saveData = {
          project: projectData,
          html,
          css,
          timestamp: new Date().toISOString(),
        };

        localStorage.setItem('gjs-project', JSON.stringify(saveData));
        console.log('✅ Auto-saved to localStorage');
      } catch (err) {
        console.warn('Auto-save failed:', err);
      }
    };

    // Listen to changes
    editorInstance.on('component:update', handleStorage);
    editorInstance.on('block:add', handleStorage);
    editorInstance.on('block:remove', handleStorage);
    editorInstance.on('canvas:drop', handleStorage);
    editorInstance.on('styleManager:change', handleStorage);

    // Restore previous project
    const saved = localStorage.getItem('gjs-project');
    if (saved) {
      try {
        const saveData = JSON.parse(saved);
        const projectData = saveData.project || saveData;

        if (typeof (editorInstance as any).setProjectData === 'function') {
          (editorInstance as any).setProjectData(projectData);
          console.log('📂 Project restored from localStorage onReady');
        } else if (typeof (editorInstance as any).loadProjectData === 'function') {
          (editorInstance as any).loadProjectData(projectData);
          console.log('📂 Project restored from localStorage onReady');
        }
      } catch (e) {
        console.warn('Failed to restore project:', e);
      }
    }

    // Cleanup
    return () => {
      editorInstance.off('component:update', handleStorage);
      editorInstance.off('block:add', handleStorage);
      editorInstance.off('block:remove', handleStorage);
      editorInstance.off('canvas:drop', handleStorage);
      editorInstance.off('styleManager:change', handleStorage);
    };
  };

  return (
    <main className="h-screen flex flex-col overflow-hidden bg-zinc-950">
      {/* Header kecil untuk branding */}
      <div className="h-11 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between text-white text-sm">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center text-xs font-bold">W</div>
          <div>
            <span className="font-semibold">WIT.SBY</span>
            <span className="text-zinc-500 text-xs ml-2">Landing Page Studio</span>
          </div>
        </div>
        <div className="text-xs text-zinc-500">
          Changes are auto-saved to localStorage • Open{' '}
          <a href="/preview" target="_blank" className="text-blue-400 hover:underline">
            Preview
          </a>
        </div>
      </div>

      {/* Full Studio SDK - menggunakan toolbar bawaan GrapesJS Studio */}
      <div className="flex-1 overflow-hidden">
        <GrapesJsStudio
          onReady={onReady}
          options={{
            licenseKey: 'YOUR_LICENSE_KEY', // Ganti dengan license key resmi jika punya
            project: {
              default: {
                pages: [
                  {
                    name: 'Home',
                    component: `
                      <div style="padding: 4rem 2rem; text-align: center; font-family: system-ui;">
                        <h1 style="font-size: 3rem; color: #dc2626; margin-bottom: 1rem;">
                          WIT.SBY Studio
                        </h1>
                        <p style="color: #666; font-size: 1.1rem;">
                          Edit landing page kamu di sini.<br/>
                          Semua perubahan <strong>otomatis tersimpan</strong> ke localStorage.
                        </p>
                      </div>
                    `,
                  },
                ],
              },
            },
          }}
        />
      </div>
    </main>
  );
}
