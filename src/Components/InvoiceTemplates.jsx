import React from 'react';
import { invoiceTemplates } from './InvoiceUtils';

export default function InvoiceTemplates({ selectedTemplate, onSelect }) {
  return (
    <div className="invoice-templates">
      {invoiceTemplates.map(tpl => (
        <div
          key={tpl.id}
          className={`invoice-template-card${selectedTemplate === tpl.id ? ' selected' : ''}`}
          onClick={() => onSelect(tpl.id)}
        >
          <div style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: 8 }}>{tpl.name}</div>
          <div style={{ height: 60, width: 100, background: '#f8f9fa', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#888', fontSize: 12 }}>
            Preview
          </div>
        </div>
      ))}
    </div>
  );
} 