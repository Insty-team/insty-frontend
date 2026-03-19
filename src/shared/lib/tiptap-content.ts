import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';

export function extractTextFromTiptapJsonString(value: string): string {
  try {
    const parsed = JSON.parse(value) as unknown;

    const walk = (node: unknown): string => {
      if (!node) return '';
      if (typeof node === 'string') return node;
      if (Array.isArray(node)) return node.map(walk).join('');
      if (typeof node === 'object') {
        const obj = node as Record<string, unknown>;
        if (obj.type === 'text' && typeof obj.text === 'string') {
          return obj.text;
        }
        if (obj.content) return walk(obj.content);
      }
      return '';
    };

    return walk(parsed).trim();
  } catch {
    return value;
  }
}

export function getDisplayContent(content?: string | null): string {
  if (!content) return '';

  try {
    const json = JSON.parse(content);
    return generateHTML(json, [StarterKit]);
  } catch {
    return content;
  }
}