'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function AdminProductActions({ id }: { id: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('Delete this product? This cannot be undone.')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        href={`/admin/products/${id}/edit`}
        className="w-7 h-7 border border-charcoal/15 flex items-center justify-center text-muted hover:text-charcoal hover:border-charcoal transition-colors rounded"
        title="Edit"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
        </svg>
      </Link>
      <button
        onClick={handleDelete}
        className="w-7 h-7 border border-charcoal/15 flex items-center justify-center text-muted hover:text-red-600 hover:border-red-300 transition-colors rounded"
        title="Delete"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="3,6 5,6 21,6"/>
          <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        </svg>
      </button>
    </div>
  );
}
