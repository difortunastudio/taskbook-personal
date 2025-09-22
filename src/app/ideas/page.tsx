"use client";
import { useState, useEffect } from "react";
import { FileText, Plus, Tag, Trash2 } from "lucide-react";

interface Idea {
  id: string;
  content: string;
  tags: string[];
  createdAt: string;
}

function getIdeas(): Idea[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("ideas") || "[]");
  } catch {
    return [];
  }
}

function saveIdeas(ideas: Idea[]) {
  localStorage.setItem("ideas", JSON.stringify(ideas));
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");

  useEffect(() => {
    setIdeas(getIdeas());
  }, []);

  function handleAddIdea(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    const newIdea: Idea = {
      id: Date.now().toString(),
      content: content.trim(),
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
      createdAt: new Date().toISOString(),
    };
    const updated = [newIdea, ...ideas];
    setIdeas(updated);
    saveIdeas(updated);
    setContent("");
    setTags("");
  }

  function handleDelete(id: string) {
    const updated = ideas.filter(i => i.id !== id);
    setIdeas(updated);
    saveIdeas(updated);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center pb-20">
      <div className="w-full max-w-2xl mx-auto mt-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-1">Eureka</h1>
        <p className="text-gray-500 text-lg mb-8">Anota tus ideas rápidas y organízalas con etiquetas</p>
        <form onSubmit={handleAddIdea} className="bg-white rounded-lg shadow-md p-8 mb-10 border border-gray-200 flex flex-col gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">Idea</label>
            <textarea
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="Escribe tu idea..."
              rows={5}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 bg-yellow-50 text-lg resize-none font-mono shadow-inner min-h-[120px]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Tag className="h-5 w-5 text-blue-500" /> Etiquetas (opcional)
            </label>
            <input
              value={tags}
              onChange={e => setTags(e.target.value)}
              placeholder="Ej: creatividad, inspiración"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900 bg-gray-50 text-base"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={() => { setContent(""); setTags(""); }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center"
              disabled={!content.trim()}
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Idea
            </button>
          </div>
        </form>
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FileText className="h-6 w-6 text-yellow-600 mr-2" />
            Ideas guardadas ({ideas.length})
          </h2>
          {ideas.length === 0 ? (
            <div className="text-gray-400 text-center py-12">No hay ideas aún. ¡Agrega la primera!</div>
          ) : (
            <ul className="space-y-6">
              {ideas.map(idea => (
                <li key={idea.id} className="border border-gray-200 rounded-lg p-5 bg-yellow-50 relative group shadow-sm">
                  <div className="flex items-center text-base text-gray-500 mb-2">
                    <FileText className="h-5 w-5 mr-2 text-yellow-600" />
                    {new Date(idea.createdAt).toLocaleString()}
                  </div>
                  <div className="text-gray-900 mb-3 whitespace-pre-line text-lg font-mono">{idea.content}</div>
                  {idea.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {idea.tags.map(tag => (
                        <span key={tag} className="bg-blue-100 text-blue-700 rounded px-3 py-1 text-base font-medium">{tag}</span>
                      ))}
                    </div>
                  )}
                  <button
                    onClick={() => handleDelete(idea.id)}
                    className="absolute top-3 right-3 text-red-500 hover:text-red-700 p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    title="Eliminar"
                  >
                    <Trash2 className="h-6 w-6" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
