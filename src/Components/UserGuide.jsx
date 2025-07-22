import React from 'react';

export default function UserGuide() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
      <div style={{ maxWidth: 600, width: '100%' }}>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#009688', marginBottom: '18px', textAlign: 'center' }}>User Guide</h1>
        <p style={{ fontSize: '1.2rem', color: '#333', textAlign: 'center' }}>
          Welcome to the CRM User Guide!<br/>
          Here you'll find tips, tutorials, and answers to common questions to help you get the most out of your CRM.
        </p>
      </div>
    </div>
  );
} 