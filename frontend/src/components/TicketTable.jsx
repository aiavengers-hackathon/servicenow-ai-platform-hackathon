import React from 'react';
import { AlertCircle, Clock, CheckCircle } from 'lucide-react';

function TicketTable({ tickets = [], onSelect }) {
  const getStatusBadge = (status) => {
    const statusMap = {
      'open': { bg: 'bg-red-100', text: 'text-red-800', label: 'Open', icon: AlertCircle },
      'assigned': { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Assigned', icon: AlertCircle },
      'resolved': { bg: 'bg-green-100', text: 'text-green-800', label: 'Resolved', icon: CheckCircle },
      'submitted': { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Submitted', icon: Clock },
      'requested': { bg: 'bg-purple-100', text: 'text-purple-800', label: 'Requested', icon: Clock }
    };
    return statusMap[status] || statusMap['open'];
  };

  if (tickets.length === 0) {
    return <div style={{ padding: 20, textAlign: 'center', color: '#999' }}>No tickets found</div>;
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #e5e7eb', backgroundColor: '#f9fafb' }}>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>ID</th>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>Title</th>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>Status</th>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>Priority</th>
            <th style={{ padding: 12, textAlign: 'left', fontWeight: 600 }}>Created</th>
          </tr>
        </thead>
        <tbody>
          {tickets.map((ticket) => {
            const statusBadge = getStatusBadge(ticket.status);
            const StatusIcon = statusBadge.icon;
            return (
              <tr
                key={ticket.id}
                onClick={() => onSelect && onSelect(ticket)}
                style={{
                  borderBottom: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  ':hover': { backgroundColor: '#f3f4f6' }
                }}
              >
                <td style={{ padding: 12, fontWeight: 500 }}>#{ticket.id}</td>
                <td style={{ padding: 12 }}>{ticket.title || ticket.description}</td>
                <td style={{ padding: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <StatusIcon size={16} />
                    <span className={statusBadge.text}>{statusBadge.label}</span>
                  </div>
                </td>
                <td style={{ padding: 12 }}>
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: 4,
                    fontSize: 12,
                    backgroundColor: ticket.priority === 'high' ? '#fee2e2' : 
                                    ticket.priority === 'medium' ? '#fef3c7' : '#dcfce7',
                    color: ticket.priority === 'high' ? '#dc2626' : 
                          ticket.priority === 'medium' ? '#d97706' : '#16a34a'
                  }}>
                    {ticket.priority || 'Medium'}
                  </span>
                </td>
                <td style={{ padding: 12, fontSize: 14, color: '#6b7280' }}>
                  {ticket.created_at ? new Date(ticket.created_at).toLocaleDateString() : 'N/A'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default TicketTable;
