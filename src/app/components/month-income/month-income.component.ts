import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartConfiguration, ChartType, ChartOptions, ChartData } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import { TransactionService } from '../../transaction/services/transaction.service'; 

@Component({
  selector: 'app-month-income',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './month-income.component.html',
  styleUrl: './month-income.component.css'
})
export class MonthIncomeComponent implements  OnInit{

  totalIncome: number = 0;
  chartType: ChartType = 'bar';


  chartData: ChartData<'bar'> = {
    labels: [this.getCurrentMonthName()],
    datasets: [
      {
        label: 'Ingresos del Mes',
        data: [this.totalIncome],
        backgroundColor: 'rgba(121, 243, 157, 0.7)',
        borderColor: '#3b82f6',
        borderWidth: 1,
        borderRadius: 8,
        barThickness: 50,
        maxBarThickness: 70,
        hoverBackgroundColor: '#3b82f6',
      },
    ],
  };

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          font: {
            family: "'Poppins', 'Helvetica', 'Arial', sans-serif",
            size: 12
          },
          color: '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            family: "'Poppins', 'Helvetica', 'Arial', sans-serif",
            size: 14,
            weight: 'bold'
          },
          color: '#374151',
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: '', // Se completará dinámicamente en ngOnInit
        font: {
          family: "'Poppins', 'Helvetica', 'Arial', sans-serif",
          size: 18,
          weight: 'bold'
        },
        color: '#1f2937',
        padding: {
          bottom: 20
        }
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 13,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `$${context.parsed.y.toLocaleString('es-AR')}`;
          }
        }
      },
    },
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    },
  };









  constructor(private transactionService: TransactionService) {}


  getCurrentMonthName(): string {
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[new Date().getMonth()];
  }





  ngOnInit(): void {
    this.transactionService.getMonthIncome().subscribe({
      next: (data) => {
        this.totalIncome = data;
  
        const currentMonthName = this.getCurrentMonthName();
        const visibleIncome = this.totalIncome === 0 ? 0.03 : this.totalIncome;
  
        this.chartData = {
          labels: [currentMonthName],
          datasets: [
            {
              label: 'Ingreso mensual',
              data: [visibleIncome],
              backgroundColor: 'rgba(52, 211, 153, 0.7)', // Verde agua semi-transparente
              borderColor: '#34d399',                     // Verde agua sólido
              borderWidth: 1,
              borderRadius: 8,
              barThickness: 50,
              maxBarThickness: 70,
              hoverBackgroundColor: '#34d399',
            },
          ],
        };
  
        const scaleOptions = this.chartOptions.scales as any;
        if (scaleOptions?.y) {
          scaleOptions.y.max = Math.ceil(visibleIncome * 1.2);
        }
  
        if (this.chartOptions.plugins?.title) {
          this.chartOptions.plugins.title.text = `Total Ingresos en el Mes: $${this.totalIncome.toLocaleString('es-AR')}`;
        }
      },
      error: (err) => console.error('Error al cargar el total gastado del mes', err),
    });
  }
  

}
