import { Component, ElementRef, AfterViewInit, ViewChild, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Vehicle, DataService } from '../services/data.service';
import { ToastService } from '../services/toast.service';
import * as d3 from 'd3';

@Component({
  selector: 'app-vehicle-analysis',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="h-full flex flex-col">
      
      <!-- Header -->
      <div class="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6 animate-fade-in-up shrink-0">
        <button (click)="back.emit()" class="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors shadow-sm hover:scale-110 active:scale-95">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        </button>
        <div class="flex-1 min-w-0">
           <h2 class="text-base sm:text-xl font-bold text-slate-900 dark:text-white truncate">
             {{ vehicle().brand }} {{ vehicle().model }}
           </h2>
           <p class="text-xs sm:text-sm text-slate-400 truncate">Análise detalhada</p>
        </div>
      </div>

      <!-- Content -->
      <div class="flex-1 overflow-y-auto pr-1 sm:pr-2 pb-20 md:pb-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          
          <!-- Main Content Column -->
          <div class="lg:col-span-2 space-y-4 sm:space-y-6">
            
            <!-- Vehicle Info Card -->
            <div class="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl animate-fade-in-up" style="animation-delay: 100ms;">
              <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
                <img [src]="vehicle().image" class="w-full sm:w-48 h-40 sm:h-32 object-cover rounded-xl shadow-lg hover:scale-105 transition-transform duration-500 cursor-pointer">
                <div class="flex-1 min-w-0">
                  <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-4">
                    <div class="min-w-0">
                      <h1 class="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white truncate">{{ vehicle().model }}</h1>
                      <div class="flex flex-wrap items-center gap-2 mt-1">
                        <p class="text-sm sm:text-lg text-slate-500">{{ vehicle().version }}</p>
                        <span class="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] sm:text-xs font-bold border border-emerald-200 dark:border-emerald-700">
                          Aprovado
                        </span>
                      </div>
                    </div>
                    <div class="sm:text-right mt-2 sm:mt-0">
                       <p class="text-[10px] sm:text-sm text-slate-400 uppercase tracking-wide font-medium">Preço</p>
                       <p class="text-xl sm:text-3xl font-bold text-slate-900 dark:text-white">R$ {{ vehicle().price | number:'1.0-0' }}</p>
                    </div>
                  </div>
                  
                  <div class="mt-4 sm:mt-6 flex flex-wrap gap-2 sm:gap-4">
                    <div class="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 sm:gap-2">
                       <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                       {{ vehicle().year }}
                    </div>
                    <div class="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 sm:gap-2">
                       <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                       {{ vehicle().km | number }} km
                    </div>
                    <div class="px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 flex items-center gap-1.5 sm:gap-2">
                       <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                       {{ vehicle().location }}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Price Validation Card -->
            <div class="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl animate-fade-in-up" style="animation-delay: 200ms;">
              <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 sm:mb-6">Validação de Preço de Mercado</h3>
              
              <div class="space-y-4 mb-4 sm:mb-6">
                <div class="relative pt-4 sm:pt-6">
                   <div class="flex justify-between text-[10px] sm:text-xs font-semibold text-slate-500 mb-1">
                     <span>Referência FIPE</span>
                     <span>R$ {{ vehicle().fipePrice | number:'1.0-0' }}</span>
                   </div>
                   <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                     <div class="h-full bg-slate-400 w-full animate-grow" style="width: 0%; --w: 100%"></div>
                   </div>
                </div>

                <div class="relative">
                   <div class="flex justify-between text-[10px] sm:text-xs font-semibold text-primary-500 mb-1">
                     <span>Estimativa IA</span>
                     <span>R$ {{ vehicle().aiFairPrice | number:'1.0-0' }}</span>
                   </div>
                   <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                     <div class="h-full bg-primary-500 animate-grow" style="width: 0%" [style.--w.%]="(vehicle().aiFairPrice / vehicle().fipePrice) * 100"></div>
                   </div>
                   <p class="text-[9px] sm:text-[10px] text-slate-400 mt-1">
                     Ajuste baseado em região, km e opcionais.
                   </p>
                </div>

                <div class="relative">
                   <div class="flex justify-between text-[10px] sm:text-xs font-semibold text-emerald-500 mb-1">
                     <span>Oferta Atual</span>
                     <span>R$ {{ vehicle().price | number:'1.0-0' }}</span>
                   </div>
                   <div class="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                     <div class="h-full bg-emerald-500 animate-grow" style="width: 0%" [style.--w.%]="(vehicle().price / vehicle().fipePrice) * 100"></div>
                   </div>
                </div>
              </div>

            </div>

            <!-- Price Trend Chart Card -->
            <div class="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl animate-fade-in-up" style="animation-delay: 300ms;">
               <h3 class="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-3 sm:mb-4">Tendência de Preços</h3>
               <div class="h-48 sm:h-64 w-full" #chartContainer></div>
            </div>

          </div>

          <!-- Sidebar Column -->
          <div class="space-y-4 sm:space-y-6">
            
            <!-- Financial Summary Card -->
            <div class="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 text-slate-900 dark:text-white border-none shadow-xl animate-fade-in-up hover:scale-[1.02] transition-transform duration-300" style="animation-delay: 400ms;">
               <h3 class="font-bold text-base sm:text-lg mb-4 sm:mb-6">Resumo Financeiro</h3>
               
               <div class="space-y-3 sm:space-y-4">
                 <div class="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-300 dark:border-white/10">
                   <span class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Lance Sugerido</span>
                   <span class="font-bold text-base sm:text-xl">R$ {{ vehicle().price * 0.95 | number:'1.0-0' }}</span>
                 </div>
                 <div class="flex justify-between items-center pb-3 sm:pb-4 border-b border-slate-300 dark:border-white/10">
                   <span class="text-xs sm:text-sm text-slate-600 dark:text-slate-300">Revenda Projetada</span>
                   <span class="font-bold text-base sm:text-xl">R$ {{ vehicle().projectedResalePrice | number:'1.0-0' }}</span>
                 </div>
                 <div class="pt-2">
                   <span class="text-xs sm:text-sm text-slate-600 dark:text-slate-300 block mb-1">Lucro Líquido Estimado</span>
                   <span class="font-bold text-2xl sm:text-4xl text-emerald-600 dark:text-emerald-400">R$ {{ vehicle().projectedProfit | number:'1.0-0' }}</span>
                 </div>
               </div>

               <button (click)="buy()" class="w-full mt-6 sm:mt-8 bg-emerald-500 hover:bg-emerald-600 text-white py-3 sm:py-4 rounded-xl font-bold transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 active:scale-95">
                 <span class="text-sm sm:text-base">Marcar como Comprado</span>
                 <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
               </button>
            </div>
  
            <!-- NLP Analysis Card -->
            <div class="glass-card p-4 sm:p-6 rounded-2xl sm:rounded-3xl animate-fade-in-up" style="animation-delay: 500ms;">
              <h3 class="font-bold text-slate-900 dark:text-white mb-3 sm:mb-4 text-sm sm:text-base">Análise Semântica (PLN)</h3>
              
              <div class="mb-4">
                 <p class="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-2">Pontos Fortes</p>
                 <ul class="space-y-1.5 sm:space-y-2">
                   @for (feat of vehicle().highlights; track feat) {
                     <li class="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 p-1.5 sm:p-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg border border-emerald-100 dark:border-emerald-900/30">
                       <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                       <span class="truncate">{{ feat }}</span>
                     </li>
                   }
                 </ul>
              </div>

              @if (vehicle().issues.length > 0) {
                <div>
                   <p class="text-[10px] sm:text-xs text-slate-500 uppercase font-bold mb-2">Pontos de Atenção</p>
                   <ul class="space-y-1.5 sm:space-y-2">
                     @for (issue of vehicle().issues; track issue) {
                       <li class="flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300 p-1.5 sm:p-2 bg-orange-50 dark:bg-orange-900/10 rounded-lg border border-orange-100 dark:border-orange-900/30">
                         <svg class="w-3.5 h-3.5 sm:w-4 sm:h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                         <span class="truncate">{{ issue }}</span>
                       </li>
                     }
                   </ul>
                </div>
              }
            </div>
          </div>

        </div>
      </div>

      @if (confirmBuy()) {
        <div class="fixed inset-0 z-[70] flex items-center justify-center px-4">
          <div class="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" (click)="cancelBuy()"></div>
          <div class="relative w-full max-w-md glass-card rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 animate-fade-in-up">
            <div class="flex items-start gap-3">
              <div class="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-xs uppercase font-bold text-slate-500">Confirmar aquisição</p>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white truncate">
                  Mover para estoque?
                </h3>
                <p class="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  O anúncio sairá desta lista e entrará no estoque.
                </p>
              </div>
              <button class="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10" (click)="cancelBuy()">
                <svg class="w-5 h-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>

            <div class="flex flex-col sm:flex-row gap-2 sm:justify-end">
              <button class="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-white/10 transition-colors" (click)="cancelBuy()">
                Cancelar
              </button>
              <button class="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/30 hover:bg-emerald-600 transition-colors" (click)="confirmBuyNow()">
                Confirmar
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class VehicleAnalysisComponent implements AfterViewInit {
  vehicle = input.required<Vehicle>();
  back = output<void>();
  dataService = inject(DataService);
  toast = inject(ToastService);
  confirmBuy = signal(false);

  @ViewChild('chartContainer') chartContainer!: ElementRef;

  buy() {
    this.confirmBuy.set(true);
  }

  confirmBuyNow() {
    this.dataService.addToInventory(this.vehicle());
    this.confirmBuy.set(false);
    this.back.emit();
    this.toast.add('Veículo movido para estoque');
  }

  cancelBuy() {
    this.confirmBuy.set(false);
  }

  ngAfterViewInit() {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.renderChart();
      });
    });
  }

  renderChart() {
    const element = this.chartContainer.nativeElement;
    
    if (!element || element.clientWidth === 0 || element.clientHeight === 0) {
      requestAnimationFrame(() => this.renderChart());
      return;
    }
    
    const margin = { top: 10, right: 10, bottom: 25, left: 45 };
    const width = element.clientWidth - margin.left - margin.right;
    const height = element.clientHeight - margin.top - margin.bottom;

    if (width <= 0 || height <= 0) {
      requestAnimationFrame(() => this.renderChart());
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

    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
        .attr("id", "area-gradient")
        .attr("x1", "0%").attr("y1", "0%")
        .attr("x2", "0%").attr("y2", "100%");
    
    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0.4);
    gradient.append("stop").attr("offset", "100%").attr("stop-color", "#3b82f6").attr("stop-opacity", 0);

    const marketPrice = this.vehicle().marketAveragePrice;
    const data = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (6 - i));
      return {
        date: date,
        price: marketPrice * (1 + (Math.random() * 0.05 - 0.025)) 
      };
    });

    const x = d3.scaleTime().domain(d3.extent(data, d => d.date) as [Date, Date]).range([0, width]);
    const y = d3.scaleLinear().domain([marketPrice * 0.8, marketPrice * 1.2]).range([height, 0]);

    svg.append("g")
       .attr("transform", `translate(0,${height})`)
       .call(d3.axisBottom(x).ticks(4).tickFormat((d:any) => d3.timeFormat('%b')(d)))
       .attr('class', 'text-slate-400')
       .selectAll('text')
       .style('font-size', '10px')
       .select('.domain').remove();

    svg.append("g")
       .call(d3.axisLeft(y).ticks(4).tickFormat(d => `${(d as number)/1000}k`))
       .attr('class', 'text-slate-400')
       .selectAll('text')
       .style('font-size', '10px')
       .select('.domain').remove();

    const line = d3.line<{date: Date, price: number}>()
      .x(d => x(d.date))
      .y(d => y(d.price))
      .curve(d3.curveCatmullRom);

    const area = d3.area<{date: Date, price: number}>()
      .x(d => x(d.date))
      .y0(height)
      .y1(d => y(d.price))
      .curve(d3.curveCatmullRom);

    const areaPath = svg.append("path")
       .datum(data)
       .attr("fill", "url(#area-gradient)")
       .attr("d", area)
       .attr("opacity", 0);
    
    areaPath.transition().duration(1000).attr("opacity", 1);

    const linePath = svg.append("path")
       .datum(data)
       .attr("fill", "none")
       .attr("stroke", "#3b82f6")
       .attr("stroke-width", 2)
       .attr("d", line);
    
    const totalLength = (linePath.node() as SVGPathElement).getTotalLength();
    linePath
      .attr("stroke-dasharray", totalLength + " " + totalLength)
      .attr("stroke-dashoffset", totalLength)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0);
    
    svg.append("line")
       .attr("x1", 0)
       .attr("x2", width)
       .attr("y1", y(this.vehicle().price))
       .attr("y2", y(this.vehicle().price))
       .attr("stroke", "#94a3b8")
       .attr("stroke-dasharray", "5,5")
       .attr("stroke-width", 1.5)
       .attr("opacity", 0)
       .transition()
       .delay(1000)
       .duration(500)
       .attr("opacity", 1);

    svg.selectAll(".dot")
       .data(data)
       .enter().append("circle")
       .attr("cx", d => x(d.date))
       .attr("cy", d => y(d.price))
       .attr("r", 0)
       .attr("fill", "#3b82f6")
       .attr("stroke", "#1e293b")
       .attr("stroke-width", 2)
       .attr("class", "hover:r-6 transition-all")
       .transition()
       .delay((d, i) => i * 150 + 800)
       .duration(400)
       .attr("r", 3);
  }
}
