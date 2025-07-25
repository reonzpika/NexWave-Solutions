import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import Icon from '../../../components/AppIcon';


const UsageChart = ({ data, type = 'line', title, height = 300, className = '' }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg p-3 shadow-clinical-lg backdrop-blur-sm">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-muted-foreground capitalize">
                  {entry.dataKey}:
                </span>
              </div>
              <span className="text-sm font-medium text-foreground">
                {entry.value}
                {entry.dataKey === 'duration' ? 'min' : ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }) => (
    <div className="flex flex-wrap items-center justify-center gap-4 mt-4 px-4">
      {payload?.map((entry, index) => (
        <div key={index} className="flex items-center space-x-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground capitalize">
            {entry.value}
            {entry.value === 'duration' ? ' (min)' : ''}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <div className={`bg-card border border-border rounded-lg p-4 sm:p-6 shadow-clinical hover:shadow-clinical-lg transition-shadow duration-200 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center space-x-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse"></div>
          <span>Live data</span>
        </div>
      </div>
      
      <div style={{ width: '100%', height }} className="min-h-[250px]">
        <ResponsiveContainer>
          {type === 'line' ? (
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--color-border)" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={-10}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend content={<CustomLegend />} />
              <Line 
                type="monotone" 
                dataKey="sessions" 
                stroke="var(--color-primary)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-primary)', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: 'var(--color-primary)', strokeWidth: 2, fill: 'var(--color-background)' }}
                name="Sessions"
              />
              <Line 
                type="monotone" 
                dataKey="duration" 
                stroke="var(--color-accent)" 
                strokeWidth={3}
                dot={{ fill: 'var(--color-accent)', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, stroke: 'var(--color-accent)', strokeWidth: 2, fill: 'var(--color-background)' }}
                name="Duration"
              />
            </LineChart>
          ) : (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="var(--color-border)" 
                opacity={0.3}
              />
              <XAxis 
                dataKey="name" 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dy={10}
              />
              <YAxis 
                stroke="var(--color-muted-foreground)"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                dx={-10}
                label={{ value: 'Sessions', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar 
                dataKey="value" 
                fill="var(--color-primary)"
                radius={[6, 6, 0, 0]}
                name="Sessions"
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {/* Empty state for no data */}
      {(!data || data.length === 0) && (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <Icon name="BarChart3" size={24} className="text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">No data available</p>
          <p className="text-sm text-muted-foreground mt-1">Data will appear here once you start using the system</p>
        </div>
      )}
    </div>
  );
};

export default UsageChart;