// Spring Test Profiler Report JavaScript Functions

// Initialize empty context statistics (will be populated by Thymeleaf injection)
window.contextStatistics = [];

/**
 * Toggle visibility of test method details
 * @param {HTMLElement} element - The clicked element
 */
function toggleClass(element) {
  const methods = element.nextElementSibling;
  if (methods) {
    methods.classList.toggle('show');
  }
}

/**
 * Toggle the theory section visibility
 */
function toggleTheorySection() {
  const content = document.getElementById('theory-content');
  const icon = document.getElementById('theory-toggle-icon');

  if (!content || !icon) return;

  if (content.style.display === 'none') {
    content.style.display = 'block';
    icon.textContent = '▼';
    icon.classList.add('expanded');
  } else {
    content.style.display = 'none';
    icon.textContent = '▶';
    icon.classList.remove('expanded');
  }
}

/**
 * Context Comparison Visualizer using D3.js
 */
class ContextComparator {
  constructor() {
    this.contextData = window.contextStatistics || [];
    this.selectedContextA = null;
    this.selectedContextB = null;
    this.init();
  }

  init() {
    this.populateDropdowns();
    this.bindEvents();
    this.preselectDefaultContexts();
  }

  populateDropdowns() {
    const contextASelect = document.getElementById('context-a-select');
    const contextBSelect = document.getElementById('context-b-select');

    if (!contextASelect || !contextBSelect) return;

    this.contextData.forEach(context => {
      const optionA = document.createElement('option');
      optionA.value = context.contextKey;
      optionA.textContent = `${context.contextKey} (${context.numberOfBeans} beans, ${context.testClasses.length} classes)`;
      contextASelect.appendChild(optionA);

      const optionB = document.createElement('option');
      optionB.value = context.contextKey;
      optionB.textContent = `${context.contextKey} (${context.numberOfBeans} beans, ${context.testClasses.length} classes)`;
      contextBSelect.appendChild(optionB);
    });
  }

  preselectDefaultContexts() {
    if (this.contextData.length >= 2) {
      const contextASelect = document.getElementById('context-a-select');
      const contextBSelect = document.getElementById('context-b-select');

      if (contextASelect && contextBSelect) {
        // Select first context for A
        contextASelect.value = this.contextData[0].contextKey;
        this.selectedContextA = this.contextData[0];

        // Select second context for B
        contextBSelect.value = this.contextData[1].contextKey;
        this.selectedContextB = this.contextData[1];

        // Update compare button state and trigger comparison
        this.updateCompareButton();
        this.compareContexts();
      }
    }
  }

  bindEvents() {
    const contextASelect = document.getElementById('context-a-select');
    const contextBSelect = document.getElementById('context-b-select');
    const compareBtn = document.getElementById('compare-contexts-btn');

    if (!contextASelect || !contextBSelect || !compareBtn) return;

    contextASelect.addEventListener('change', (e) => {
      if (e.target.value) {
        this.selectedContextA = this.contextData.find(ctx => ctx.contextKey === e.target.value);
      } else {
        this.selectedContextA = null;
      }
      this.updateCompareButton();
    });

    contextBSelect.addEventListener('change', (e) => {
      if (e.target.value) {
        this.selectedContextB = this.contextData.find(ctx => ctx.contextKey === e.target.value);
      } else {
        this.selectedContextB = null;
      }
      this.updateCompareButton();
    });

    compareBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (!compareBtn.disabled) {
        this.compareContexts();
      }
    });
  }

  updateCompareButton() {
    const compareBtn = document.getElementById('compare-contexts-btn');
    if (!compareBtn) return;

    const canCompare = this.selectedContextA && this.selectedContextB &&
                      this.selectedContextA.contextKey !== this.selectedContextB.contextKey;

    compareBtn.disabled = !canCompare;
  }

  compareContexts() {
    if (!this.selectedContextA || !this.selectedContextB) {
      return;
    }

    const legend = document.getElementById('context-comparison-legend');
    if (legend) {
      legend.style.display = 'flex';
    }

    this.renderComparison();
  }

  renderComparison() {
    const container = d3.select('#context-comparison-visualization');
    container.selectAll('*').remove();

    const width = 1000;
    const height = 600; // Increased height to accommodate bigger visualization
    const contextWidth = 400;
    const contextHeight = 400;

    const svg = container.append('svg')
      .attr('width', width)
      .attr('height', height);

    // Add title
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 30)
      .attr('text-anchor', 'middle')
      .attr('class', 'comparison-title')
      .style('font-size', '20px')
      .style('font-weight', 'bold')
      .text('Spring Test Context Comparison');

    // Context A
    this.renderContext(svg, this.selectedContextA, 50, 100, 'Test Context A');

    // Context B
    this.renderContext(svg, this.selectedContextB, 550, 100, 'Test Context B');

    // Render test classes lists below SVG
    this.renderTestClassesLists();
  }

  renderContext(svg, context, x, y, title) {
    const group = svg.append('g').attr('transform', `translate(${x}, ${y})`);

    // Title
    group.append('text')
      .attr('x', 200)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .text(title);

    // Context Key (smaller subtitle)
    group.append('text')
      .attr('x', 200)
      .attr('y', 25)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'normal')
      .style('fill', '#7f8c8d')
      .text(context.contextKey);

    // Central beans circle
    const centerX = 200;
    const centerY = 240; // Increased from 200 to provide more space below titles
    const centralRadius = 80;

    group.append('circle')
      .attr('cx', centerX)
      .attr('cy', centerY)
      .attr('r', centralRadius)
      .attr('fill', '#3498db')
      .attr('stroke', '#2980b9')
      .attr('stroke-width', 2);

    group.append('text')
      .attr('x', centerX)
      .attr('y', centerY - 10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Beans');

    group.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 10)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .text(`(${context.numberOfBeans})`);

    // Configuration features
    const features = this.getContextFeatures(context);
    const angleStep = (2 * Math.PI) / features.length;
    const satelliteRadius = 180;

    features.forEach((feature, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const featureX = centerX + Math.cos(angle) * satelliteRadius;
      const featureY = centerY + Math.sin(angle) * satelliteRadius;

      const featureGroup = group.append('g')
        .attr('transform', `translate(${featureX}, ${featureY})`);

      // Feature circle
      featureGroup.append('circle')
        .attr('cx', 0)
        .attr('cy', 0)
        .attr('r', 25)
        .attr('fill', this.getFeatureColor(feature))
        .attr('stroke', '#34495e')
        .attr('stroke-width', 1)
        .style('cursor', 'pointer')
        .on('mouseover', (event) => this.showTooltip(event, feature, context))
        .on('mouseout', () => this.hideTooltip());

      // Feature label
      featureGroup.append('text')
        .attr('x', 0)
        .attr('y', 35)
        .attr('text-anchor', 'middle')
        .style('font-size', '10px')
        .style('font-weight', 'bold')
        .text(feature.name);

      // Connecting line
      group.append('line')
        .attr('x1', centerX + Math.cos(angle) * (centralRadius + 5))
        .attr('y1', centerY + Math.sin(angle) * (centralRadius + 5))
        .attr('x2', featureX - Math.cos(angle) * 30)
        .attr('y2', featureY - Math.sin(angle) * 30)
        .attr('stroke', '#bdc3c7')
        .attr('stroke-width', 2)
        .attr('stroke-dasharray', '5,5');
    });
  }

  renderTestClassesLists() {
    const container = document.getElementById('context-comparison-visualization');

    // Create or update test classes container - append to same container as SVG, not parent
    let testClassesContainer = document.getElementById('test-classes-container');
    if (!testClassesContainer) {
      testClassesContainer = document.createElement('div');
      testClassesContainer.id = 'test-classes-container';
      testClassesContainer.style.cssText = 'display: flex; justify-content: space-between; margin-top: 20px; gap: 40px;';
      container.appendChild(testClassesContainer);
    }
    testClassesContainer.innerHTML = '';

    // Context A test classes
    const contextADiv = document.createElement('div');
    contextADiv.style.cssText = 'flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;';

    const titleA = document.createElement('h4');
    titleA.textContent = 'Test Context A - Test Classes';
    titleA.style.cssText = 'margin: 0 0 10px 0; color: #2c3e50; font-size: 16px;';
    contextADiv.appendChild(titleA);

    const listA = document.createElement('ul');
    listA.style.cssText = 'margin: 0; padding-left: 20px; font-family: monospace; font-size: 12px; line-height: 1.4;';

    const testClassesA = this.selectedContextA.testClasses || [];
    if (testClassesA.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No test classes found';
      li.style.color = '#7f8c8d';
      listA.appendChild(li);
    } else {
      testClassesA.forEach(testClass => {
        const li = document.createElement('li');
        li.textContent = testClass.split('.').pop(); // Show simple class name
        li.title = testClass; // Full name on hover
        li.style.cssText = 'margin-bottom: 2px; color: #34495e;';
        listA.appendChild(li);
      });
    }

    contextADiv.appendChild(listA);
    testClassesContainer.appendChild(contextADiv);

    // Context B test classes
    const contextBDiv = document.createElement('div');
    contextBDiv.style.cssText = 'flex: 1; background: #f8f9fa; padding: 15px; border-radius: 8px; border-left: 4px solid #3498db;';

    const titleB = document.createElement('h4');
    titleB.textContent = 'Test Context B - Test Classes';
    titleB.style.cssText = 'margin: 0 0 10px 0; color: #2c3e50; font-size: 16px;';
    contextBDiv.appendChild(titleB);

    const listB = document.createElement('ul');
    listB.style.cssText = 'margin: 0; padding-left: 20px; font-family: monospace; font-size: 12px; line-height: 1.4;';

    const testClassesB = this.selectedContextB.testClasses || [];
    if (testClassesB.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No test classes found';
      li.style.color = '#7f8c8d';
      listB.appendChild(li);
    } else {
      testClassesB.forEach(testClass => {
        const li = document.createElement('li');
        li.textContent = testClass.split('.').pop(); // Show simple class name
        li.title = testClass; // Full name on hover
        li.style.cssText = 'margin-bottom: 2px; color: #34495e;';
        listB.appendChild(li);
      });
    }

    contextBDiv.appendChild(listB);
    testClassesContainer.appendChild(contextBDiv);
  }

  getContextFeatures(context) {
    const config = context.contextConfiguration;
    return [
      { name: 'Locations', value: config.locations, key: 'locations' },
      { name: 'Classes', value: config.classes, key: 'classes' },
      { name: 'Context Initializer Classes', value: config.contextInitializerClasses, key: 'contextInitializerClasses' },
      { name: 'Active Profiles', value: config.activeProfiles, key: 'activeProfiles' },
      { name: 'Property Source Locations', value: config.propertySourceLocations, key: 'propertySourceLocations' },
      { name: 'Property Source Properties', value: config.propertySourceProperties, key: 'propertySourceProperties' },
      { name: 'Context Customizers', value: config.contextCustomizers, key: 'contextCustomizers' },
      { name: 'Context Loader', value: [config.contextLoader], key: 'contextLoader' },
      { name: 'Parent', value: config.parent ? [config.parent] : [], key: 'parent' }
    ];
  }

  getFeatureColor(feature) {
    if (!this.selectedContextA || !this.selectedContextB) return '#95a5a6';

    const configA = this.selectedContextA.contextConfiguration;
    const configB = this.selectedContextB.contextConfiguration;

    const valueA = this.getFeatureValue(configA, feature.key);
    const valueB = this.getFeatureValue(configB, feature.key);

    const arrayA = Array.isArray(valueA) ? valueA : [valueA];
    const arrayB = Array.isArray(valueB) ? valueB : [valueB];

    if (this.arraysEqual(arrayA, arrayB)) {
      return '#27ae60'; // Same - green
    } else {
      return '#e74c3c'; // Different - red
    }
  }

  getFeatureValue(config, key) {
    switch(key) {
      case 'contextLoader': return config.contextLoader;
      case 'parent': return config.parent;
      default: return config[key] || [];
    }
  }

  arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    const sortedA = [...a].sort();
    const sortedB = [...b].sort();
    return sortedA.every((val, i) => val === sortedB[i]);
  }

  truncateString(str, maxLength = 200) {
    if (!str || str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
  }

  formatValueArray(valueArray, maxLength = 200) {
    if (!valueArray || valueArray.length === 0) return 'None';

    const joinedString = valueArray.join(', ');
    return this.truncateString(joinedString, maxLength);
  }

  showTooltip(event, feature, context) {
    const tooltip = document.getElementById('context-comparison-tooltip');
    const tooltipContent = tooltip.querySelector('.tooltip-content');

    const valueA = this.getFeatureValue(this.selectedContextA.contextConfiguration, feature.key);
    const valueB = this.getFeatureValue(this.selectedContextB.contextConfiguration, feature.key);

    const arrayA = Array.isArray(valueA) ? valueA : [valueA];
    const arrayB = Array.isArray(valueB) ? valueB : [valueB];

    let content = `<strong>${feature.name}</strong><br/>`;

    if (this.arraysEqual(arrayA, arrayB)) {
      content += `<span style="color: #27ae60;">✓ Same configuration</span><br/>`;
      content += `Value: ${this.formatValueArray(arrayA)}`;
    } else {
      content += `<span style="color: #e74c3c;">✗ Different values</span><br/>`;
      content += `Context A: ${this.formatValueArray(arrayA)}<br/>`;
      content += `Context B: ${this.formatValueArray(arrayB)}`;
    }

    tooltipContent.innerHTML = content;

    tooltip.style.display = 'block';
    tooltip.style.left = (event.pageX + 10) + 'px';
    tooltip.style.top = (event.pageY - 10) + 'px';
  }

  hideTooltip() {
    document.getElementById('context-comparison-tooltip').style.display = 'none';
  }
}

/**
 * Initialize the report functionality when DOM is loaded
 */
function initializeReport() {
  // Ensure JSON is parsed first
  try {
    const jsonScript = document.getElementById('context-statistics-json');
    if (jsonScript) {
      window.contextStatistics = JSON.parse(jsonScript.textContent || '[]');
    }
  } catch (e) {
    console.error('Failed to parse context statistics JSON:', e);
    window.contextStatistics = [];
  }

  if (window.contextStatistics && window.contextStatistics.length > 0) {
    new ContextComparator();
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeReport);

// Export functions for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    toggleClass,
    toggleTheorySection,
    ContextComparator,
    initializeReport
  };
}
