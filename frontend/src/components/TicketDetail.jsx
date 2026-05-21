import React, { useState } from 'react';
import { X, Clock, User, AlertCircle, CheckCircle, FileText } from 'lucide-react';

function TicketDetail({ ticket, onClose }) {
  const [activeTab, setActiveTab] = useState('details');

  if (!ticket) {
    return (
      <div style={{
        width: 400,
        backgroundColor: 'white',
        borderLeft: '1px solid #e5e7eb',
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#999' }}>Select a ticket to view details</p>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const statusMap = {
      'open': '#dc2626',
      'assigned': '#2563eb',
      'resolved': '#16a34a',
      'submitted': '#d97706',
      'requested': '#7c3aed'
    };
    return statusMap[status] || '#6b7280';
  };

  return (
    <div style={{
      width: 400,
      backgroundColor: 'white',
      borderLeft: '1px solid #e5e7eb',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      boxShadow: '-2px 0 8px rgba(0,0,0,0.1)'
    }}>
      {/* Header */}
      <div style={{
        padding: 20,
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between'
      }}>
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 600, margin: '0 0 8px 0' }}>#{ticket.id}</h2>
          <h3 style={{ fontSize: 14, color: '#6b7280', margin: 0 }}>{ticket.title || ticket.description}</h3>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 4,
            ':hover': { backgroundColor: '#f3f4f6' }
          }}
        >
          <X size={20} />
        </button>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        borderBottom: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb'
      }}>
        {['details', 'timeline'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: '12px 16px',
              border: 'none',
              backgroundColor: activeTab === tab ? 'white' : 'transparent',
              borderBottom: activeTab === tab ? '2px solid #2563eb' : 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: activeTab === tab ? 600 : 400,
              color: activeTab === tab ? '#2563eb' : '#6b7280'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
        {activeTab === 'details' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Status */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>STATUS</label>
              <div style={{
                marginTop: 6,
                display: 'inline-block',
                padding: '6px 12px',
                borderRadius: 6,
                backgroundColor: getStatusColor(ticket.status) + '20',
                color: getStatusColor(ticket.status),
                fontSize: 14,
                fontWeight: 600
              }}>
                {ticket.status ? ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1) : 'Unknown'}
              </div>
            </div>

            {/* Priority */}
            <div>
              <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>PRIORITY</label>
              <div style={{ marginTop: 6, fontSize: 14 }}>{ticket.priority || 'Medium'}</div>
            </div>

            {/* Description */}
            {(ticket.description || ticket.details) && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <FileText size={14} />
                  DESCRIPTION
                </label>
                <div style={{
                  marginTop: 6,
                  fontSize: 14,
                  color: '#1f2937',
                  lineHeight: 1.5,
                  padding: 12,
                  backgroundColor: '#f9fafb',
                  borderRadius: 6
                }}>
                  {ticket.description || ticket.details || 'No description'}
                </div>
              </div>
            )}

            {/* Created Date */}
            {ticket.created_at && (
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Clock size={14} />
                  CREATED
                </label>
                <div style={{ marginTop: 6, fontSize: 14 }}>
                  {new Date(ticket.created_at).toLocaleString()}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'timeline' && (
          <div style={{ color: '#6b7280', fontSize: 14 }}>
            <p>No timeline events yet</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketDetail;
