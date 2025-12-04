import { Component, inject, signal, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService } from '../services/data.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="space-y-8 animate-fade-in-up">
      
      <div class="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 animate-fade-in-up" style="animation-delay: 100ms;">
            Inteligência de Mercado
          </h2>
          <p class="text-slate-500 dark:text-slate-400 mt-1 animate-fade-in-up" style="animation-delay: 200ms;">
            Olá, {{ dataService.currentUser()?.name }}. O mercado está <span class="text-emerald-500 font-bold">aquecido</span> hoje.
          </p>
        </div>
        
        <div class="hidden lg:flex items-center gap-6 bg-slate-900 text-slate-300 text-xs px-4 py-2 rounded-full border border-slate-700 shadow-sm overflow-hidden animate-fade-in-up" style="animation-delay: 300ms;">
          <span class="font-bold text-white uppercase tracking-wider">Em Alta:</span>
          <div class="flex items-center gap-4 animate-marquee whitespace-nowrap">
            <span class="flex items-center gap-1 text-emerald-400">Compass T270 <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> +2.4%</span>
            <span class="flex items-center gap-1 text-emerald-400">Nivus HL <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg> +1.8%</span>
            <span class="flex items-center gap-1 text-red-400">HB20 Sense <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"></path></svg> -0.5%</span>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300" style="animation-delay: 100ms;">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-primary-500/10 rounded-full blur-2xl group-hover:bg-primary-500/20 transition-all duration-700"></div>
          <div class="relative z-10">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Potencial de Lucro</p>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              R$ {{ metrics().potentialProfit | number:'1.0-0' }}
            </h3>
            <div class="mt-4 flex items-center gap-2 text-emerald-500 text-sm font-medium">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
              <span>{{ metrics().activeOpportunities }} oportunidades mapeadas</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300" style="animation-delay: 200ms;">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
          <div class="relative z-10">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Valor em Estoque</p>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              R$ {{ metrics().inventoryValue | number:'1.0-0' }}
            </h3>
            <div class="mt-4 flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
              <span>{{ dataService.inventory().length }} veículos na pátio</span>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300" style="animation-delay: 300ms;">
          <div class="absolute -right-6 -top-6 w-24 h-24 bg-accent-500/10 rounded-full blur-2xl group-hover:bg-accent-500/20 transition-all duration-700"></div>
          <div class="relative z-10">
            <p class="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Margem Média Estimada</p>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {{ metrics().averageMargin | number:'1.1-1' }}%
            </h3>
            <div class="mt-4 w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div class="bg-accent-500 h-1.5 rounded-full animate-grow" [style.--w.%]="75" style="width: 0%"></div>
            </div>
          </div>
        </div>

        <div class="glass-card p-6 rounded-2xl relative overflow-hidden group animate-fade-in-up hover:-translate-y-1 hover:shadow-2xl transition-all duration-300" 
             style="animation-delay: 400ms;"
             [class.border-l-4]="metrics().stagnantStockCount > 0" 
             [class.border-l-orange-500]="metrics().stagnantStockCount > 0">
          <div class="relative z-10">
            <p class="text-sm font-medium text-orange-600 dark:text-orange-400 uppercase tracking-wider">Alerta de Giro</p>
            <h3 class="text-3xl font-bold text-slate-900 dark:text-white mt-2">
              {{ metrics().stagnantStockCount }}
            </h3>
            <p class="mt-1 text-slate-500 dark:text-slate-400 text-sm">Veículos sem giro (>60 dias)</p>
            @if(metrics().stagnantStockCount > 0) {
              <button class="mt-4 text-xs font-semibold text-orange-600 dark:text-orange-400 hover:text-orange-500 flex items-center gap-1 uppercase tracking-wide group-hover:translate-x-1 transition-transform">
                Ver Sugestão de Reprecificação &rarr;
              </button>
            }
          </div>
        </div>
      </div>

      <div class="glass-card rounded-2xl p-6 md:p-8 animate-fade-in-up" style="animation-delay: 500ms;">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          <div>
            <h3 class="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg class="w-6 h-6 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path></svg>
              Tendências de Mercado
            </h3>
            <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Selecione um modelo para visualizar a evolução de preços nos últimos 6 meses.</p>
          </div>
          
          <div class="relative w-full md:w-72 group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-slate-400 group-focus-within:text-primary-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
            <select 
              [ngModel]="selectedModel()" 
              (ngModelChange)="onModelChange($event)"
              class="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer transition-all hover:bg-slate-100 dark:hover:bg-slate-700/50">
              <option value="Honda Civic">Honda Civic</option>
              <option value="Toyota Corolla">Toyota Corolla</option>
              <option value="Jeep Compass">Jeep Compass</option>
              <option value="VW Nivus">VW Nivus</option>
              <option value="BMW 320i">BMW 320i</option>
              <option value="Fiat Pulse">Fiat Pulse</option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 h-72 w-full transition-opacity duration-500" #trendChartContainer></div>

          <div class="space-y-6">
             <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform duration-300">
               <span class="text-xs uppercase font-bold text-slate-500">Liquidez</span>
               <div class="flex items-center gap-2 mt-2">
                 <div class="flex gap-1">
                   <div class="w-3 h-8 bg-emerald-500 rounded-sm"></div>
                   <div class="w-3 h-8 bg-emerald-500 rounded-sm"></div>
                   <div class="w-3 h-8 bg-emerald-500 rounded-sm"></div>
                   <div class="w-3 h-8 bg-emerald-500/30 rounded-sm"></div>
                   <div class="w-3 h-8 bg-emerald-500/30 rounded-sm"></div>
                 </div>
                 <span class="text-lg font-bold text-slate-900 dark:text-white">Alta</span>
               </div>
               <p class="text-xs text-slate-400 mt-2">Giro médio de 18 dias na sua região.</p>
             </div>

             <div class="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-5 border border-slate-100 dark:border-slate-700 hover:scale-[1.02] transition-transform duration-300">
               <span class="text-xs uppercase font-bold text-slate-500">Volatilidade</span>
               <div class="flex items-center justify-between mt-2">
                  <span class="text-lg font-bold text-slate-900 dark:text-white">Baixa (2.1%)</span>
                  <svg class="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
               </div>
               <p class="text-xs text-slate-400 mt-2">Preços estáveis nos últimos 30 dias.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements AfterViewInit {
  dataService = inject(DataService);
  metrics = this.dataService.metrics;
  
  selectedModel = signal('Honda Civic');
  
  @ViewChild('trendChartContainer') chartContainer!: ElementRef;

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.renderChart(this.selectedModel());
      });
    });
  }

  onModelChange(model: string) {
    this.selectedModel.set(model);
    const el = this.chartContainer.nativeElement;
    el.style.opacity = '0';
    setTimeout(() => {
      this.renderChart(model);
      el.style.opacity = '1';
    }, 200);
  }

  renderChart(model: string) {
    const element = this.chartContainer.nativeElement;
    
    if (!element || element.clientWidth === 0 || element.clientHeight === 0) {
      requestAnimationFrame(() => this.renderChart(model));
      return;
    }
    
    const margin = { top: 20, right: 20, bottom: 30, left: 50 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = element.clientHeight - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) {
      requestAnimationFrame(() => this.renderChart(model));
      return;
    }

    d3.select(element).select('svg').remove();

    const svg = d3.select(element)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', `0 0 ${element.clientWidth} ${element.clientHeight}`)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const data = this.dataService.getMarketTrends(model);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date) as [Date, Date])
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([d3.min(data, d => d.price) * 0.9, d3.max(data, d => d.price) * 1.1])
      .range([height, 0]);

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "trend-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
    
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.5);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0);

    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x).ticks(5).tickFormat((d:any) => d3.timeFormat('%b/%y')(d)))
       .attr('class', 'text-slate-400')
       .select('.domain').remove();

    svg.append("g")
       .call(d3.axisLeft(y).ticks(5).tickFormat(d => `R$${(d as number)/1000}k`))
       .attr('class', 'text-slate-400')
       .select('.domain').remove();

    svg.append("g")
        .attr("class", "grid")
        .call(d3.axisLeft(y)
            .tickSize(-width)
            .tickFormat(() => "")
        )
        .attr("stroke", "currentColor")
        .attr("stroke-opacity", "0.1")
        .select(".domain").remove();

    const area = d3.area<{date: Date, price: number}>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.price))
      .curve(d3.curveMonotoneX);

    const line = d3.line<{date: Date, price: number}>()
      .x(d => x(d.date))
      .y(d => y(d.price))
      .curve(d3.curveMonotoneX);

    const path = svg.append("path")
       .datum(data)
       .attr("fill", "url(#trend-gradient)")
       .attr("d", area)
       .attr("opacity", 0);

    path.transition().duration(1000).attr("opacity", 1);

    const linePath = svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "#3b82f6")
       .attr("stroke-width", 3)
       .attr("d", line);

    const totalLength = (linePath.node() as SVGPathElement).getTotalLength();
    linePath
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);


    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.date))
       .attr("cy", d => y(d.price))
       .attr("r", 0)
       .attr("fill", "#1e293b")
       .attr("stroke", "#3b82f6")
       .attr("stroke-width", 2)
       .attr("class", "hover:r-6 transition-all")
       .transition()
       .delay((d, i) => i * 100 + 500)
       .duration(500)
       .attr("r", 5);
  }
}