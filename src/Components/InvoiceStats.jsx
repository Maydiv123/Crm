import React from 'react';
import { formatCurrency } from './InvoiceUtils';
import { FaChartLine, FaClock, FaPercentage, FaSync, FaStar, FaCalendarAlt } from 'react-icons/fa';
// Custom Images
import InvoiceImg from '../assets/Invoice.png';
import AnalyticsImg from '../assets/Analytics.png';
import AutomationImg from '../assets/Automation.png';
import PipelineImg from '../assets/Pipeline.png';
import AiImg from '../assets/Ai.png';

export default function InvoiceStats({ stats }) {
  return (
    <div className="invoice-dashboard">
      <div className="invoice-card">
        <div className="invoice-card-title">
          <img src={InvoiceImg} alt="Invoice" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
          Total Invoices
        </div>
        <div className="invoice-card-value">{stats.total}</div>
      </div>
      <div className="invoice-card">
        <div className="invoice-card-title">
          <img src={AnalyticsImg} alt="Analytics" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
          Total Amount
        </div>
        <div className="invoice-card-value">{formatCurrency(stats.amount)}</div>
      </div>
      <div className="invoice-card">
        <div className="invoice-card-title">Paid</div>
        <div className="invoice-card-value" style={{ color: '#25d366' }}>{stats.paid}</div>
      </div>
      <div className="invoice-card">
        <div className="invoice-card-title">Pending</div>
        <div className="invoice-card-value" style={{ color: '#ffc107' }}>{stats.pending}</div>
      </div>
      <div className="invoice-card">
        <div className="invoice-card-title">Overdue</div>
        <div className="invoice-card-value" style={{ color: '#dc3545' }}>{stats.overdue}</div>
      </div>
      
      {/* Advanced CRM Stats */}
      <div className="invoice-card">
        <div className="invoice-card-title">
          <img src={AutomationImg} alt="Automation" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
          High Priority
        </div>
        <div className="invoice-card-value" style={{ color: '#ff6b35' }}>{stats.highPriority}</div>
      </div>
      
      <div className="invoice-card">
        <div className="invoice-card-title">
          <img src={PipelineImg} alt="Pipeline" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
          This Month
        </div>
        <div className="invoice-card-value" style={{ color: '#4ecdc4' }}>{stats.thisMonth}</div>
      </div>
      
      <div className="invoice-card">
        <div className="invoice-card-title">
          <img src={AiImg} alt="AI" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
          Avg Payment Time
        </div>
        <div className="invoice-card-value" style={{ color: '#667eea' }}>{stats.avgPaymentTime} days</div>
      </div>
      
      <div className="invoice-card">
        <div className="invoice-card-title">
          <img src={AnalyticsImg} alt="Analytics" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
          Conversion Rate
        </div>
        <div className="invoice-card-value" style={{ color: '#25d366' }}>{stats.conversionRate}%</div>
      </div>
      
      <div className="invoice-card">
        <div className="invoice-card-title">
          <img src={AutomationImg} alt="Automation" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
          Recurring Revenue
        </div>
        <div className="invoice-card-value" style={{ color: '#764ba2' }}>{formatCurrency(stats.recurringRevenue)}</div>
      </div>
      
              <div className="invoice-card">
          <div className="invoice-card-title">
            <img src={PipelineImg} alt="Pipeline" style={{ width: '20px', height: '20px', marginRight: '8px', verticalAlign: 'middle' }} />
            Growth Rate
          </div>
          <div className="invoice-card-value" style={{ color: '#ff6b35' }}>+12.5%</div>
        </div>
    </div>
  );
} 