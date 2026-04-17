import { useState } from 'react';
import { ERP } from '../data/erpData.js';
import { KPICard, BarChart, LineChart, PieChart, PowerBITable, FilterSlicer } from './PowerBICharts.jsx';

export default function PowerBIDashboard() {
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('6m');

  const regions = [
    { value: 'all', label: 'All Regions' },
    { value: 'north', label: 'North' },
    { value: 'south', label: 'South' },
    { value: 'east', label: 'East' },
    { value: 'west', label: 'West' },
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Staples', label: 'Staples' },
    { value: 'Edible Oils', label: 'Edible Oils' },
    { value: 'Pulses', label: 'Pulses' },
    { value: 'Snacks', label: 'Snacks' },
    { value: 'Premium', label: 'Premium' },
  ];

  const timeframes = [
    { value: '1m', label: '1 Month' },
    { value: '3m', label: '3 Months' },
    { value: '6m', label: '6 Months' },
  ];

  // Filter SKUs based on selections
  const filteredSKUs = ERP.skus.filter(sku => {
    if (selectedCategory !== 'all' && sku.cat !== selectedCategory) return false;
    return true;
  });

  // Calculate KPIs
  const totalRevenue = ERP.pnl.revenue.reduce((a, b) => a + b, 0);
  const totalRevenueCr = (totalRevenue / 10000000).toFixed(2);
  const avgMargin = (ERP.skus.reduce((sum, s) => sum + s.margin, 0) / ERP.skus.length).toFixed(1);
  const totalEBITDA = ERP.pnl.ebitda.reduce((a, b) => a + b, 0);
  const totalEBITDACr = (totalEBITDA / 10000000).toFixed(2);

  // Revenue trend data
  const revenueTrend = ERP.pnl.months.map((month, i) => ({
    month,
    revenue: ERP.pnl.revenue[i],
  }));

  // Category distribution
  const categoryData = ERP.skus.reduce((acc, sku) => {
    const existing = acc.find(c => c.category === sku.cat);
    if (existing) {
      existing.revenue += sku.sales_rev[5];
    } else {
      acc.push({ category: sku.cat, revenue: sku.sales_rev[5] });
    }
    return acc;
  }, []);

  // Top performing SKUs
  const topSKUs = [...ERP.skus]
    .sort((a, b) => b.sales_rev[5] - a.sales_rev[5])
    .slice(0, 5)
    .map(sku => ({
      sku: sku.id,
      name: sku.name,
      revenue: (sku.sales_rev[5] / 100000).toFixed(1) + 'L',
      margin: sku.margin + '%',
      trend: sku.trend,
    }));

  // Inventory by region
  const inventoryByRegion = regions.slice(1).map(region => ({
    region: region.label,
    value: ERP.skus.reduce((sum, sku) => sum + sku.inv[region.value], 0),
  }));

  // Distributor performance
  const distributorData = ERP.distributors.map(d => ({
    name: d.name,
    revenue: '₹' + d.rev_lac + 'L',
    achievement: d.achievement + '%',
    status: d.status,
  }));

  return (
    <div style={{ background: '#f8f9fa', minHeight: '100vh', padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: '#252423', marginBottom: 4 }}>
          Apex Retail India - Power BI Dashboard
        </h1>
        <p style={{ fontSize: 13, color: '#666' }}>
          FY 2025-26 · Last sync: 10 min ago · Data sources: Tally Prime, Google Sheets, Shopify
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        <FilterSlicer
          title="Region"
          options={regions}
          selected={selectedRegion}
          onChange={setSelectedRegion}
        />
        <FilterSlicer
          title="Category"
          options={categories}
          selected={selectedCategory}
          onChange={setSelectedCategory}
        />
        <FilterSlicer
          title="Timeframe"
          options={timeframes}
          selected={selectedTimeframe}
          onChange={setSelectedTimeframe}
        />
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
        <KPICard
          title="Total Revenue"
          value={totalRevenueCr}
          format="cr"
          change={12.5}
          trend="up"
          sparkline={ERP.pnl.revenue.slice(-6)}
        />
        <KPICard
          title="Average Margin"
          value={avgMargin}
          format="percent"
          change={2.3}
          trend="up"
        />
        <KPICard
          title="EBITDA"
          value={totalEBITDACr}
          format="cr"
          change={8.7}
          trend="up"
          sparkline={ERP.pnl.ebitda.slice(-6)}
        />
        <KPICard
          title="Active Alerts"
          value={ERP.alerts.filter(a => a.sev === 'high').length}
          change={-15}
          trend="down"
        />
      </div>

      {/* Charts Row 1 */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 24 }}>
        <LineChart
          data={revenueTrend}
          title="Revenue Trend (Oct - Mar)"
          xKey="month"
          yKey="revenue"
          color="#0078D4"
          showArea={true}
        />
        <PieChart
          data={categoryData}
          title="Revenue by Category"
          labelKey="category"
          valueKey="revenue"
        />
      </div>

      {/* Charts Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <BarChart
          data={inventoryByRegion}
          title="Inventory by Region"
          xKey="region"
          yKey="value"
          color="#107C10"
        />
        <BarChart
          data={topSKUs}
          title="Top 5 SKUs by Revenue"
          xKey="sku"
          yKey="revenue"
          color="#FFB900"
          formatValue={(v) => v}
        />
      </div>

      {/* Tables */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <PowerBITable
          data={topSKUs}
          columns={[
            { key: 'sku', label: 'SKU' },
            { key: 'name', label: 'Product' },
            { key: 'revenue', label: 'Revenue' },
            { key: 'margin', label: 'Margin' },
          ]}
          title="Top Performing SKUs"
        />
        <PowerBITable
          data={distributorData}
          columns={[
            { key: 'name', label: 'Distributor' },
            { key: 'revenue', label: 'Revenue' },
            { key: 'achievement', label: 'vs Target' },
            { key: 'status', label: 'Status' },
          ]}
          title="Distributor Performance"
        />
      </div>
    </div>
  );
}
