'use client';

export default function Page() {
  let data: any = {};
  let htmlContent = '';
  let cssContent = '';

  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem('gjs-project');
      if (saved) {
        data = JSON.parse(saved);
        htmlContent = data.html || data.project?.html || '';
        cssContent = data.css || data.project?.css || '';
        console.log('Preview loaded from localStorage:', { 
          hasContent: !!htmlContent, 
          timestamp: data.timestamp 
        });
      }
    } catch (e) {
      console.error('Preview load error:', e);
    }
  }

  return (
    <div className="w-full h-full bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">W</div>
            <div>
              <div className="font-semibold text-xl tracking-tight">WIT.SBY</div>
              <div className="text-[10px] text-gray-400 -mt-1">PREVIEW MODE</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-500">
              Last saved: {data.timestamp ? new Date(data.timestamp).toLocaleString('id-ID') : 'No save yet'}
            </div>
            <a 
              href="/" 
              className="px-5 py-2 text-sm border rounded-2xl hover:bg-gray-100 transition-colors"
            >
              ← Editor
            </a>
          </div>
        </div>
      </header>

      <main className="w-full h-full">
        {htmlContent ? (
          <div className="prose prose-lg max-w-none bg-white rounded-3xl shadow-2xl overflow-hidden border">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            <style dangerouslySetInnerHTML={{ __html: cssContent }} />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="text-6xl mb-6 opacity-40">🏗️</div>
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Landing Page belum disimpan</h2>
            <p className="text-gray-600 max-w-md mb-10">
              Edit desain di GrapeJS Studio, klik <span className="font-mono px-2 py-1 bg-amber-100 text-amber-700 rounded">Save Project (Local)</span>, 
              lalu kembali ke preview ini.
            </p>
            <a
              href="/"
              className="px-10 py-4 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-medium flex items-center gap-3 transition-all active:scale-95"
            >
              Buka Editor GrapesJS
            </a>
          </div>
        )}
      </main>

      <footer className="text-center py-12 text-xs text-gray-400 border-t bg-white mt-auto">
        Data diambil dari <code className="bg-gray-100 px-1 rounded">localStorage.getItem(&apos;gjs-project&apos;)</code>.<br />
        Saat ini tersimpan di <strong>browser lokal</strong>. Belum ada integrasi API/server.
      </footer>
    </div>
  );
}
