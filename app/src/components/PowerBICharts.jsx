// Power BI-style visualization components
// Zero infrastructure, pure React + SVG

export function KPICard({ title, value, change, trend, sparkline, format = 'number' }) {
  const isPositive = trend === 'up' || (change && change > 0);
  const isNegative = trend === 'down' || (change && change < 0);
  
  const formatValue = (val) => {
    if (format === 'currency') return '₹' + val.toLocaleString('en-IN');
    if (format === 'percent') return val + '%';
    if (format === 'cr') return '₹' + val + 'Cr';
    if (format === 'lac') return '₹' + val + 'L';
    return val.toLocaleString('en-IN');
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      padding: 16,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: 12, color: '#666', fontWeight: 600, marginBottom: 4 }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#252423', marginBottom: 8 }}>
        {formatValue(value)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {change !== undefined && (
          <span style={{
            fontSize: 12,
            color: isPositive ? '#107C10' : isNegative ? '#D13438' : '#666',
            fontWeight: 600,
            background: isPositive ? '#E6FFEC' : isNegative ? '#FDE7E9' : '#F3F2F1',
            padding: '2px 8px',
            borderRadius: 4,
          }}>
            {isPositive ? '↑' : isNegative ? '↓' : ''} {Math.abs(change)}%
          </span>
        )}
        <span style={{ fontSize: 11, color: '#666' }}>vs last period</span>
      </div>
      {sparkline && (
        <div style={{ marginTop: 8, height: 40 }}>
          <Sparkline data={sparkline} color={isPositive ? '#107C10' : isNegative ? '#D13438' : '#0078D4'} />
        </div>
      )}
    </div>
  );
}

function Sparkline({ data, color = '#0078D4', height = 40 }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
}

export function BarChart({ data, title, xKey, yKey, color = '#0078D4' }) {
  const maxValue = Math.max(...data.map(d => d[yKey]));
  const chartHeight = 200;
  const barWidth = 40;
  const gap = 20;

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      padding: 16,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#252423', marginBottom: 16 }}>{title}</div>
      <div style={{ height: chartHeight, display: 'flex', alignItems: 'flex-end', gap: gap, paddingBottom: 24, borderBottom: '1px solid #e0e0e0' }}>
        {data.map((d, i) => {
          const height = (d[yKey] / maxValue) * (chartHeight - 24);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: barWidth,
                height,
                background: color,
                borderRadius: 4,
                transition: 'height 0.3s',
              }} />
              <div style={{ marginTop: 8, fontSize: 10, color: '#666', textAlign: 'center', fontWeight: 500 }}>
                {d[xKey]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LineChart({ data, title, xKey, yKey, color = '#0078D4', showArea = false }) {
  const maxValue = Math.max(...data.map(d => d[yKey]));
  const minValue = Math.min(...data.map(d => d[yKey]));
  const range = maxValue - minValue || 1;
  const chartHeight = 200;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d[yKey] - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  const areaPoints = `0,100 ${points} 100,100`;

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      padding: 16,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#252423', marginBottom: 16 }}>{title}</div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: '100%', height: chartHeight }}>
        {showArea && (
          <polygon
            fill={color + '20'}
            stroke="none"
            points={areaPoints}
          />
        )}
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
        />
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((d[yKey] - minValue) / range) * 80 - 10;
          return (
            <circle key={i} cx={x} cy={y} r="3" fill={color} />
          );
        })}
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        {data.map((d, i) => (
          <div key={i} style={{ fontSize: 10, color: '#666', fontWeight: 500 }}>{d[xKey]}</div>
        ))}
      </div>
    </div>
  );
}

export function PieChart({ data, title, labelKey, valueKey }) {
  const total = data.reduce((sum, d) => sum + d[valueKey], 0);
  let currentAngle = 0;
  
  const colors = ['#0078D4', '#107C10', '#D13438', '#FFB900', '#8764B8', '#008272'];

  const slices = data.map((d, i) => {
    const angle = (d[valueKey] / total) * 360;
    const slice = {
      ...d,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      color: colors[i % colors.length],
      percentage: ((d[valueKey] / total) * 100).toFixed(1),
    };
    currentAngle += angle;
    return slice;
  });

  const getSlicePath = (startAngle, endAngle) => {
    const x1 = 50 + 40 * Math.cos((startAngle - 90) * Math.PI / 180);
    const y1 = 50 + 40 * Math.sin((startAngle - 90) * Math.PI / 180);
    const x2 = 50 + 40 * Math.cos((endAngle - 90) * Math.PI / 180);
    const y2 = 50 + 40 * Math.sin((endAngle - 90) * Math.PI / 180);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return `M 50 50 L ${x1} ${y1} A 40 40 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  return (
    <div style={{
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      padding: 16,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#252423', marginBottom: 16 }}>{title}</div>
      <div style={{ display: 'flex', gap: 24 }}>
        <svg viewBox="0 0 100 100" width="200" height="200">
          {slices.map((slice, i) => (
            <path
              key={i}
              d={getSlicePath(slice.startAngle, slice.endAngle)}
              fill={slice.color}
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </svg>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8 }}>
          {slices.map((slice, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 12, height: 12, background: slice.color, borderRadius: 2 }} />
              <div style={{ fontSize: 11, color: '#666' }}>{slice[labelKey]}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#252423', marginLeft: 'auto' }}>
                {slice.percentage}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PowerBITable({ data, columns, title }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      padding: 16,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: 14, fontWeight: 600, color: '#252423', marginBottom: 16 }}>{title}</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
              {columns.map(col => (
                <th key={col.key} style={{
                  padding: '10px 12px',
                  textAlign: col.align || 'left',
                  fontSize: 11,
                  fontWeight: 600,
                  color: '#666',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                {columns.map(col => (
                  <td key={col.key} style={{
                    padding: '10px 12px',
                    textAlign: col.align || 'left',
                    color: col.color ? col.color(row[col.key]) : '#252423',
                    fontWeight: col.bold ? 600 : 400,
                  }}>
                    {col.format ? col.format(row[col.key]) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function FilterSlicer({ title, options, selected, onChange, multiSelect = false }) {
  return (
    <div style={{
      background: 'white',
      border: '1px solid #e0e0e0',
      borderRadius: 8,
      padding: 16,
      boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
    }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: '#666', marginBottom: 12 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            style={{
              padding: '8px 12px',
              border: multiSelect 
                ? (selected.includes(option.value) ? '2px solid #0078D4' : '1px solid #e0e0e0')
                : (selected === option.value ? '2px solid #0078D4' : '1px solid #e0e0e0'),
              borderRadius: 4,
              background: multiSelect 
                ? (selected.includes(option.value) ? '#E6F2FF' : 'white')
                : (selected === option.value ? '#E6F2FF' : 'white'),
              fontSize: 12,
              color: '#252423',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.2s',
            }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
