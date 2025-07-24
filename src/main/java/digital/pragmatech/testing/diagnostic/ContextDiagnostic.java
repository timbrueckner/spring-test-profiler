package digital.pragmatech.testing.diagnostic;

import java.lang.management.ManagementFactory;

public record ContextDiagnostic(
    long contextLoadStartTime,
    long contextLoadEndTime,
    boolean contextLoadComplete,
    long heapMemoryUsedBytes,
    long nonHeapMemoryUsedBytes,
    int availableProcessors,
    long totalMemoryBytes,
    long maxMemoryBytes,
    long freeMemoryBytes) {

  public static ContextDiagnostic started() {
    return new ContextDiagnostic(
        System.currentTimeMillis(),
        0,
        false,
        ManagementFactory.getMemoryMXBean().getHeapMemoryUsage().getUsed(),
        ManagementFactory.getMemoryMXBean().getNonHeapMemoryUsage().getUsed(),
        Runtime.getRuntime().availableProcessors(),
        Runtime.getRuntime().totalMemory(),
        Runtime.getRuntime().maxMemory(),
        Runtime.getRuntime().freeMemory());
  }

  public ContextDiagnostic completed() {
    return new ContextDiagnostic(
        this.contextLoadStartTime,
        System.currentTimeMillis(),
        true,
        this.heapMemoryUsedBytes,
        this.nonHeapMemoryUsedBytes,
        this.availableProcessors,
        this.totalMemoryBytes,
        this.maxMemoryBytes,
        this.freeMemoryBytes);
  }

  public long getContextLoadDuration() {
    return contextLoadEndTime - contextLoadStartTime;
  }
}
