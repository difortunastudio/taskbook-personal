"use client";
import { useState, useEffect } from "react";

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
    <div style={{maxWidth: 600, margin: "2rem auto", padding: 16}}>
      <h1>Ideas rápidas</h1>
      <form onSubmit={handleAddIdea} style={{marginBottom: 24}}>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          placeholder="Escribe tu idea..."
          rows={3}
          style={{width: "100%", marginBottom: 8}}
        />
        <input
          value={tags}
          onChange={e => setTags(e.target.value)}
          placeholder="Etiquetas (separadas por coma)"
          style={{width: "100%", marginBottom: 8}}
        />
        <button type="submit">Agregar idea</button>
      </form>
      <ul style={{listStyle: "none", padding: 0}}>
        {ideas.map(idea => (
          <li key={idea.id} style={{marginBottom: 16, border: "1px solid #ccc", borderRadius: 8, padding: 12}}>
            <div style={{fontSize: 14, color: "#888"}}>{new Date(idea.createdAt).toLocaleString()}</div>
            <div style={{margin: "8px 0"}}>{idea.content}</div>
            {idea.tags.length > 0 && (
              <div style={{fontSize: 13, color: "#555"}}>
                {idea.tags.map(tag => (
                  <span key={tag} style={{background: "#e0e7ff", color: "#3730a3", borderRadius: 4, padding: "2px 6px", marginRight: 4}}>{tag}</span>
                ))}
              </div>
            )}
            <button onClick={() => handleDelete(idea.id)} style={{marginTop: 8, fontSize: 12}}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
